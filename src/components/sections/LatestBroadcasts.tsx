import Image from 'next/image'
import Link from 'next/link'

// In production: fetched from YouTube Data API v3
const PLACEHOLDER_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: '24h Le Mans Virtual 2026 — Full Race Broadcast', date: '2026-02-14', category: 'iRacing' },
  { id: 'dQw4w9WgXcQ', title: 'iRacing World Championship — Round 3 Highlights', date: '2026-02-07', category: 'iRacing' },
  { id: 'dQw4w9WgXcQ', title: 'Porsche Sim Racing Summit 2026 — Live Coverage', date: '2026-01-28', category: 'Esports' },
  { id: 'dQw4w9WgXcQ', title: 'Assetto Corsa EVO World Series — Season Opener', date: '2026-01-15', category: 'AC EVO' },
]

export function LatestBroadcasts() {
  return (
    <section className="py-24 bg-rs-dark">
      <div className="container-rs">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">On the air</p>
            <h2 className="text-headline font-bold text-rs-white">Latest broadcasts</h2>
          </div>
          <Link href="/broadcasts" className="hidden sm:flex btn-outline text-xs">
            Full archive
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLACEHOLDER_VIDEOS.map((v, i) => (
            <article key={i} className="group">
              <div className="relative aspect-video bg-rs-gray overflow-hidden mb-3">
                <Image
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-rs-black/40 group-hover:bg-rs-black/20 transition-colors" />
                <span className="absolute top-2 left-2 bg-rs-black/80 text-rs-yellow text-xs font-mono px-2 py-0.5">
                  {v.category}
                </span>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-rs-yellow flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M5 3l9 5-9 5V3z" fill="#0A0A0A" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-rs-white text-sm font-medium leading-snug mb-1 group-hover:text-rs-yellow transition-colors">
                {v.title}
              </p>
              <p className="text-rs-muted text-xs">{v.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
