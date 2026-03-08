import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live',
  description: 'Watch Racespot live streams — sim racing broadcasts live on YouTube.',
}

// In production: check YouTube Data API for active live stream
const YOUTUBE_CHANNEL_ID = 'UCIBgYfDjtWlbJhg--Z4sOgQ'

export default function LivePage() {
  return (
    <div className="pt-16 min-h-screen bg-rs-black">
      <div className="container-rs py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="section-label">Live Now</p>
        </div>

        {/* Main embed */}
        <div className="relative aspect-video bg-rs-dark border border-rs-border mb-6">
          <iframe
            src={`https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=1&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Chat embed */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-rs-white font-bold text-xl mb-2">Racespot Live</h1>
            <p className="text-rs-muted text-sm">
              Live simracing coverage from the world&apos;s leading broadcast team.
              Follow us on{' '}
              <a
                href={`https://youtube.com/channel/${YOUTUBE_CHANNEL_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rs-yellow hover:underline"
              >
                YouTube
              </a>{' '}
              to get notified for upcoming streams.
            </p>
          </div>

          <div className="relative h-96 lg:h-auto bg-rs-dark border border-rs-border">
            <iframe
              src={`https://www.youtube.com/live_chat?channel=${YOUTUBE_CHANNEL_ID}&embed_domain=${
                typeof window !== 'undefined' ? window.location.hostname : 'racespot.tv'
              }`}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
