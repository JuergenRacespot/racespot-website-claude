import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Broadcasts',
  description: 'Portfolio of 400+ live sim racing broadcasts per year across all major platforms.',
}

const CATEGORIES = ['All', 'iRacing', 'Assetto Corsa', 'rFactor 2', 'TV Production', 'Esports']

// Placeholder — replace with YouTube API fetch
const BROADCASTS = Array.from({ length: 12 }, (_, i) => ({
  id: `video-${i}`,
  youtubeId: 'dQw4w9WgXcQ',
  title: `Broadcast Event ${i + 1} — Full Coverage`,
  category: CATEGORIES[1 + (i % (CATEGORIES.length - 1))],
  date: '2026-03-01',
  views: `${Math.floor(Math.random() * 500 + 50)}K`,
}))

export default function BroadcastsPage() {
  return (
    <div className="pt-24">
      <div className="container-rs py-16">
        <p className="section-label mb-3">Portfolio</p>
        <h1 className="text-headline font-bold text-rs-white mb-4">Broadcasts</h1>
        <p className="text-rs-muted max-w-xl mb-12">
          Over 400 live events per year across iRacing, Assetto Corsa, rFactor 2, and more —
          streamed online and produced for TV.
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`text-xs px-4 py-2 border transition-colors ${
                cat === 'All'
                  ? 'border-rs-yellow text-rs-yellow'
                  : 'border-rs-border text-rs-muted hover:border-rs-yellow/50 hover:text-rs-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BROADCASTS.map((b) => (
            <article key={b.id} className="group card-dark">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={`https://img.youtube.com/vi/${b.youtubeId}/mqdefault.jpg`}
                  alt={b.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-rs-black/30 group-hover:bg-rs-black/10 transition-colors" />
                <span className="absolute top-2 left-2 bg-rs-black/80 text-rs-yellow text-xs font-mono px-2 py-0.5">
                  {b.category}
                </span>
                <span className="absolute bottom-2 right-2 text-rs-white/70 text-xs">{b.views} views</span>
              </div>
              <div className="p-4">
                <p className="text-rs-white text-sm font-medium leading-snug mb-1 group-hover:text-rs-yellow transition-colors">
                  {b.title}
                </p>
                <p className="text-rs-muted text-xs">{b.date}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
