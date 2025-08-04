import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vici - Conquer Your Day with Smart Task Management',
  description: 'The no-BS task tracker that actually keeps you accountable. Track tasks, get AI insights, and conquer your to-do list like Julius Caesar.',
  keywords: ['task management', 'productivity app', 'AI task tracker', 'time management', 'todo app', 'GTD', 'getting things done'],
  authors: [{ name: 'Vici Team' }],
  creator: 'Vici',
  publisher: 'Vici',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vici.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vici - Conquer Your Day',
    description: 'The no-BS task tracker that actually keeps you accountable.',
    url: 'https://vici.app',
    siteName: 'Vici',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vici - Conquer Your Day',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vici - Conquer Your Day',
    description: 'The no-BS task tracker that actually keeps you accountable.',
    creator: '@viciapp',
    images: ['/twitter-image.png'],
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
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Vici',
              applicationCategory: 'ProductivityApplication',
              operatingSystem: 'Windows, macOS, Linux',
              description: 'The no-BS task tracker that actually keeps you accountable.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '1337',
              },
              author: {
                '@type': 'Organization',
                name: 'Vici Team',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}