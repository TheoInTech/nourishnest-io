import SupabaseAuthProvider from '@/providers/supabase-auth-provider'
import SupabaseProvider from '@/providers/supabase-provider'
import { createClient } from '@/utils/supabase-server'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'ui/components/theme-provider'
import { Toaster } from 'ui/components/toaster'
import meta from 'ui/lib/metadata.json'
import './globals.css'

const breeserif = localFont({
  src: [
    {
      path: '../../../packages/ui/styles/fonts/BreeSerif/BreeSerif-Regular.ttf',
    },
  ],
  variable: '--font-breeserif',
  display: 'swap',
})

const lato = localFont({
  src: [
    {
      path: '../../../packages/ui/styles/fonts/Lato/Lato-Thin.ttf',
      weight: '200',
    },
    {
      path: '../../../packages/ui/styles/fonts/Lato/Lato-Light.ttf',
      weight: '300',
    },
    {
      path: '../../../packages/ui/styles/fonts/Lato/Lato-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../../packages/ui/styles/fonts/Lato/Lato-Bold.ttf',
      weight: '600',
    },
    {
      path: '../../../packages/ui/styles/fonts/Lato/Lato-Black.ttf',
      weight: '800',
    },
  ],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_HOST_URL ?? 'https://my.nourishnest.app',
  ),
  title: {
    default: meta.longName,
    template: `%s | ${meta.longName}`,
  },
  description: meta.description,
  keywords: meta.keywords,
  openGraph: {
    title: meta.longName,
    description: meta.description,
    url: process.env.NEXT_PUBLIC_HOST_URL ?? 'https://my.nourishnest.app',
    siteName: meta.longName,
    locale: 'en-US',
    type: 'website',
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_HOST_URL ?? 'https://my.nourishnest.app'
        }/og-image.png`,
        width: 2560,
        height: 1440,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: meta.longName,
    card: 'summary_large_image',
    description: meta.description,
    creator: '@nourish_nest',
    images: [
      `${
        process.env.NEXT_PUBLIC_HOST_URL ?? 'https://my.nourishnest.app'
      }/og-image.png`,
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body
        className={`${breeserif.variable} ${lato.variable} overflow-hidden`}
      >
        <SupabaseProvider>
          <SupabaseAuthProvider serverSession={session}>
            <ThemeProvider attribute="class" defaultTheme="light">
              <main className="flex items-center w-full min-h-screen overflow-hidden bg-background">
                {children}
                <Toaster />
                <Analytics />
              </main>
            </ThemeProvider>
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
