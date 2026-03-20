import Link from 'next/link'
import { getCompletedBroadcasts } from '@/lib/youtube'
import { VideoCard } from '@/components/ui/VideoCard'
import { T } from '@/components/ui/T'
import { LiveBanners } from './LiveBanners'

export async function LatestBroadcasts() {
  const videos = await getCompletedBroadcasts(3)

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

        {/* Live stream banners — client-side, from LiveStatusProvider */}
        <LiveBanners />

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
