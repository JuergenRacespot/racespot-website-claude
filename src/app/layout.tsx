import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Racespot.tv — The Home of Simracing Broadcasts',
    template: '%s | Racespot.tv',
  },
  description:
    "World's leading simracing broadcaster. 400+ live events per year. Broadcast, Esports & Live Events from Cologne.",
  keywords: ['simracing', 'esports', 'broadcast', 'live events', 'iRacing', 'motorsport'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    siteName: 'Racespot.tv',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-rs-black text-rs-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
