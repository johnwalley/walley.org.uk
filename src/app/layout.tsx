import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import 'katex/dist/katex.min.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.walley.org.uk'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s - John Walley',
    default: 'John Walley - Software Engineer & Data Visualisation Specialist',
  },
  description:
    'Senior software engineer specialising in data visualisation and complex UI systems. Expert in TypeScript, React, and modern frontend architecture.',
  keywords: [
    'software engineer',
    'data visualisation',
    'TypeScript',
    'React',
    'frontend development',
    'web applications',
    'Cambridge',
  ],
  authors: [{ name: 'John Walley', url: siteUrl }],
  creator: 'John Walley',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: 'John Walley',
    title: 'John Walley - Software Engineer & Data Visualisation Specialist',
    description:
      'Senior software engineer specialising in data visualisation and complex UI systems. Expert in TypeScript, React, and modern frontend architecture.',
  },
  twitter: {
    card: 'summary',
    title: 'John Walley - Software Engineer & Data Visualisation Specialist',
    description:
      'Senior software engineer specialising in data visualisation and complex UI systems.',
    creator: '@johnmwalley',
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
