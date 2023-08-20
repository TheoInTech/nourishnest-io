import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://nourishnest.io'),
  title: {
    default: "Nourish Nest - Your Child's Nutrition Partner",
    template: '%s | Nourish Nest',
  },
  description:
    "Your trusted companion in nourishing and nurturing your child. Discover weekly meal plans and grocery lists tailored for your child's unique needs.",
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
  ],
  openGraph: {
    title: "Nourish Nest - Your Child's Nutrition Partner",
    description:
      "Your trusted companion in nourishing and nurturing your child. Discover weekly meal plans and grocery lists tailored for your child's unique needs.",
    url: 'https://nourishnest.io',
    siteName: 'Nourish Nest',
    locale: 'en-US',
    type: 'website',
    images: [
      {
        url: 'https://nourishnest.io/images/og-image.png',
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
    title: "Nourish Nest - Your Child's Nutrition Partner",
    card: 'summary_large_image',
    description:
      "Your trusted companion in nourishing and nurturing your child. Discover weekly meal plans and grocery lists tailored for your child's unique needs.",
    creator: '@nourish_nest',
    images: ['https://nourishnest.io/images/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col items-center min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}
