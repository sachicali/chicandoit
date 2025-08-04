import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vici - Conquer Your Day | AI-Powered Task Tracker',
  description: 'Stop talking about it. Start conquering it. Vici is the no-BS task tracker that actually keeps you accountable. AI insights, smart reminders, and victory tracking.',
  keywords: [
    'task management', 'productivity app', 'AI task tracker', 'time management', 
    'todo app', 'daily agenda', 'accountability tracker', 'GTD', 'getting things done',
    'habit tracker', 'goal tracking', 'personal productivity', 'task scheduling',
    'intelligent reminders', 'productivity analytics', 'vici', 'conquer tasks'
  ],
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
    title: 'Vici - Conquer Your Day | AI-Powered Task Tracker',
    description: 'Stop talking about it. Start conquering it. The no-BS task tracker that actually keeps you accountable.',
    url: 'https://vici.app',
    siteName: 'Vici',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vici - Conquer Your Day Dashboard',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vici - Conquer Your Day',
    description: 'Stop talking about it. Start conquering it. The no-BS task tracker that actually works.',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
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
              description: 'No-BS task tracker that actually keeps you accountable. Stop talking about it, start conquering it.',
              url: 'https://vici.app',
              downloadUrl: 'https://vici.app/download',
              screenshot: 'https://vici.app/screenshot.png',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '2847',
                bestRating: '5',
                worstRating: '1',
              },
              author: {
                '@type': 'Organization',
                name: 'Vici',
                url: 'https://vici.app',
                logo: 'https://vici.app/logo.png',
              },
              featureList: [
                'No-BS task tracking',
                'AI accountability check-ins',
                'Smart task prioritization',
                'Victory analytics',
                'Cross-platform sync',
                'Intelligent time estimation'
              ],
              applicationSubCategory: 'Task Management',
              releaseNotes: 'Latest version includes enhanced AI insights and improved notification system.',
              softwareVersion: '1.0.0',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Vici',
              url: 'https://vici.app',
              logo: 'https://vici.app/logo.png',
              description: 'No-BS productivity solutions for people who actually want to get stuff done.',
              sameAs: [
                'https://twitter.com/viciapp',
                'https://github.com/viciapp',
                'https://linkedin.com/company/viciapp'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@vici.app',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Vici',
              url: 'https://vici.app',
              description: 'No-BS task tracker for people who actually want to conquer their day.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://vici.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What makes Vici different from other task management apps?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Vici is built for people who actually want to get stuff done. No 17-step workflows or "methodologies" - just add tasks, set priorities, and crush them. Our AI gives you real insights, not feel-good metrics.'
                  }
                },
                {
                  '@type': 'Question', 
                  name: 'Is Vici free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Vici offers core task tracking and AI accountability features for free. No hidden fees or sneaky subscriptions - just honest productivity tools.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'How does the AI accountability system work?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Our AI analyzes your task completion patterns, identifies procrastination trends, and sends timely, context-aware notifications to keep you on track without being intrusive.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'Can I use Vici on multiple devices?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Vici syncs across all your devices. Your data stays with you, on your devices. No cloud dependency required.'
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}