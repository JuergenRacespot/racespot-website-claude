import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { TickerServer } from '@/components/layout/TickerServer'
import { Footer } from '@/components/layout/Footer'
import { LanguageProvider } from '@/lib/language'
import { getLiveStream, getLiveStreamViaSearch } from '@/lib/youtube'
import { getUpcomingEvents } from '@/lib/sheets'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: "Racespot.tv — World's Leading Simracing Broadcast Studio",
    template: '%s | Racespot.tv',
  },
  description:
    "World's leading simracing broadcaster. 400+ live events per year. Broadcast, Esports & Live Events from Cologne.",
  keywords: ['simracing', 'esports', 'broadcast', 'live events', 'iRacing', 'motorsport'],
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    siteName: 'Racespot.tv',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: "Racespot.tv — World's Leading Simracing Broadcast Studio",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-home.jpg'],
  },
  metadataBase: new URL('https://racespot.tv'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [liveStream, events] = await Promise.all([
    getLiveStream(),
    getUpcomingEvents(3),
  ])

  // Check if live via scraping or via Sheets calendar
  const liveEvents = events.filter((e) => e.isLive)
  let isLive = !!liveStream || liveEvents.length > 0

  // If Sheets says live but scraping failed, try Search API to confirm
  if (!liveStream && liveEvents.length > 0) {
    const searchResult = await getLiveStreamViaSearch()
    isLive = !!searchResult || liveEvents.length > 0
  }

  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="bg-rs-black text-white" suppressHydrationWarning>
        <LanguageProvider>
          <Header isLive={isLive} />
          <TickerServer />
          {/* Offset for fixed header (64px) + ticker (34px) = 98px */}
          <main className="pt-[98px]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
