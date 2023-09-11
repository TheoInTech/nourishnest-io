import { createClient } from '@/utils/supabase-api'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Initialize Supabase witu Service Role
    const supabase = createClient()

    // Sign-Up with Email
    const {
      data: { user, session },
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          confirmed_at: new Date().toISOString(),
          confirmation_sent_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
        },
      },
    })

    if (!user && !session) {
      return new NextResponse(`User already exists. Please login instead.`, {
        status: 400,
      })
    }

    return new NextResponse(JSON.stringify({ user, session } as any), {
      status: 200,
    })
  } catch (error) {
    return new NextResponse(`${error}`, { status: 400 })
  }
}
