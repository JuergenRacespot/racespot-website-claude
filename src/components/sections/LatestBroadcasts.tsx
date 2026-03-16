import Link from 'next/link'
import {
  getCompletedBroadcasts,
  getLiveStream,
  formatViewCount,
} from '@/lib/youtube'
import { VideoCard } from '@/components/ui/VideoCard'
import { T } from '@/components/ui/T'

export async function LatestBroadcasts() {
  const [videos, liveStream] = await Promise.all([
    getCompletedBroadcasts(3),
    getLiveStream(),
  ])

  const hasData = videos.length > 0

  return (
    <section className="section">
      <div className="container-rs">
        <div className="section-header">
          <div>
            <p className="section-label mb-2"><T k="broadcasts.recentCoverage" /></p>
            <h2 className="section-title"><T k="broadcasts.latestBroadcasts" /></h2>
          </div>
          <Link href="/broadcasts" className="btn-ghost hidden sm:flex">
            <T k="broadcasts.viewAll" />
          </Link>
        </div>

        {/* Live stream banner */}
        {liveStream && (
          <a
            href={`https://youtube.com/watch?v=${liveStream.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 mb-8 rounded-rs border border-rs-live/40 bg-rs-dark group hover:border-rs-live transition-colors"
          >
            <span className="badge-live shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
              <T k="hero.liveNow" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold truncate group-hover:text-rs-yellow transition-colors">
                {liveStream.title}
              </p>
              <p className="text-rs-muted text-xs">
                {formatViewCount(liveStream.concurrentViewers)} <T k="live.watching" />
              </p>
            </div>
            <span className="text-rs-yellow text-sm font-display font-bold uppercase tracking-wider shrink-0">
              Watch ▶
            </span>
          </a>
        )}

        {/* Video grid — 3 latest broadcasts */}
        {hasData ? (
          <div className="card-grid card-grid--3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <FallbackBroadcasts />
        )}
      </div>
    </section>
  )
}

/** Fallback when YouTube API is unavailable */
function FallbackBroadcasts() {
  const placeholders = [
    { emoji: '🏎', title: 'Latest broadcast from RaceSpot.tv', category: 'Broadcast' },
    { emoji: '🏁', title: 'Recent race coverage', category: 'Coverage' },
    { emoji: '🌙', title: 'Endurance event replay', category: 'Endurance' },
  ]

  return (
    <div className="card-grid card-grid--3">
      {placeholders.map((b, i) => (
        <a
          key={i}
          href="https://www.youtube.com/@RaceSpotTV"
          target="_blank"
          rel="noopener noreferrer"
          className="card-dark overflow-hidden group"
        >
          <div className="aspect-video bg-rs-gray flex items-center justify-center">
            <span className="text-4xl">{b.emoji}</span>
          </div>
          <div className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-rs-yellow mb-1.5">
              {b.category}
            </p>
            <h3 className="text-[15px] font-semibold text-white leading-snug mb-2 group-hover:text-rs-yellow transition-colors">{b.title}</h3>
            <p className="text-xs text-rs-muted"><T k="broadcasts.watchOnYT" /></p>
          </div>
        </a>
      ))}
    </div>
  )
}
