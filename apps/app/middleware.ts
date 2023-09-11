import { Database } from '@/types/supabase.type'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

const allowedOrigins =
  process.env.NEXT_PUBLIC_ENV === 'production'
    ? [
        'https://nourishnest.app',
        'https://beta.nourishnest.app',
        'https://my.nourishnest.app',
      ]
    : ['http://localhost:3000', 'https://beta.nourishnest.app']

export async function middleware(req: NextRequest) {
  try {
    const origin = req.headers.get('origin')
    const pathname = req.nextUrl.pathname
    const res = NextResponse.next()

    // API middleware
    if (pathname.includes('/api') || pathname.includes('/auth')) {
      if (
        ((origin && !allowedOrigins.includes(origin)) || !origin) &&
        !pathname.includes('/ls/webhook')
      ) {
        return new NextResponse('Forbidden', {
          status: 403,
          statusText: 'Bad Request',
          headers: {
            'Content-Type': 'text/plain',
          },
        })
      }

      return res
    }

    // Frontend middleware
    const supabase = createMiddlewareClient<Database>({ req, res })

    const sessionResult = await supabase.auth.getSession()
    const session = sessionResult?.data?.session
    let profile = null

    if (session?.user?.id) {
      const profileResult = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', session?.user?.id)
        .maybeSingle()
      profile = profileResult.data
    }

    const publicRoutes = ['/login', '/signup', '/forgot-password']
    const privateRoutes = ['/', '/billing', '/profile']

    // If there's no session
    if (!session) {
      // Redirect to login if trying to access a private route
      if (privateRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      // Allow access to public routes
      return res
    }

    // If there's a session but no profile, redirect to /signup/onboarding
    if (!profile && pathname !== '/signup/onboarding') {
      return NextResponse.redirect(new URL('/signup/onboarding', req.url))
    }

    // If trying to access a public route with a session and a profile, redirect to home
    if (profile && publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // If trying to access a public route with a session and a profile, redirect to home
    if (profile && pathname === '/signup/onboarding') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Allow access to the requested route
    return res
  } catch (error) {
    console.error(error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/',
    '/signup',
    '/signup/onboarding',
    '/login',
    '/billing',
    '/profile',
    '/reset-password',
    '/forgot-password',
    '/api/:path*',
    '/auth/:path*',
  ],
}
