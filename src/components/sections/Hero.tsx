'use client'

import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background video/image layer */}
      <div className="absolute inset-0 bg-rs-black">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-rs-black/60 via-transparent to-rs-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-rs-black/80 via-transparent to-transparent z-10" />

        {/* YouTube embed background - replace with real video ID */}
        <iframe
          className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none opacity-40"
          src="https://www.youtube.com/embed/live_stream?channel=UCIBgYfDjtWlbJhg--Z4sOgQ&autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&playsinline=1"
          allow="autoplay; encrypted-media"
          style={{ aspectRatio: 'unset', border: 'none' }}
        />
      </div>

      {/* Content */}
      <div className="container-rs relative z-20 pb-24 pt-40">
        <div className="max-w-3xl">
          <p className="section-label mb-6">Est. 2013 — Cologne, Germany</p>

          <h1 className="text-display font-bold text-rs-white mb-6 leading-none">
            The Home of<br />
            <span className="text-rs-yellow">Simracing</span><br />
            Broadcasts
          </h1>

          <p className="text-lg text-rs-muted max-w-xl mb-10 leading-relaxed">
            World-class live production for sim racing&apos;s biggest events.
            From iRacing to Assetto Corsa — on YouTube, TV, and beyond.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/services" className="btn-primary">
              Work with us
              <ArrowRight />
            </Link>
            <Link href="/broadcasts" className="btn-outline">
              View portfolio
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 pt-8 border-t border-rs-border/50 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: '400+',  label: 'Live Events / Year' },
            { value: '2.5M+', label: 'YouTube Views' },
            { value: '8',     label: 'Languages' },
            { value: '100M+', label: 'Impressions / Year' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-rs-yellow text-3xl font-bold tracking-tight">{value}</p>
              <p className="text-rs-muted text-xs mt-1 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
