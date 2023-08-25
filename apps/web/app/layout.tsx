import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'ui/components/theme-provider'
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
    process.env.NEXT_PUBLIC_HOST_URL ?? 'https://nourishnest.app',
  ),
  title: {
    default: 'Nourish Nest - Your Parenting Partner',
    template: '%s | Nourish Nest - Your Parenting Partner',
  },
  description:
    'Elevate your parenting game with easy, nutritious meal plans and grocery list in minutes.',
  keywords: [
    'child nutrition',
    'baby meal plans',
    'toddler meal plans',
    'grocery lists',
    'baby diet',
    'toddler diet',
    'nutrition companion',
    'healthy child recipes',
    'baby food',
    'toddler food',
    'parenting tips',
    'Southeast Asia',
    'Nourish Nest',
    'meal planning',
    'parenting companion',
    'smart parenting',
    'parenting app',
    'parenting partner',
  ],
  openGraph: {
    title: 'Nourish Nest - Your Parenting Partner',
    description:
      'Elevate your parenting game with easy, nutritious meal plans and grocery list in minutes.',
    url: process.env.NEXT_PUBLIC_HOST_URL ?? 'https://nourishnest.app',
    siteName: 'Nourish Nest - Your Parenting Partner',
    locale: 'en-US',
    type: 'website',
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_HOST_URL ?? 'https://nourishnest.app'
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
    title: 'Nourish Nest - Your Parenting Partner',
    card: 'summary_large_image',
    description:
      'Elevate your parenting game with easy, nutritious meal plans and grocery list in minutes.',
    creator: '@nourish_nest',
    images: [
      `${
        process.env.NEXT_PUBLIC_HOST_URL ?? 'https://nourishnest.app'
      }/og-image.png`,
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${breeserif.variable} ${lato.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main className="flex flex-col items-center min-h-screen bg-background">
            {children}
            <Analytics />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
