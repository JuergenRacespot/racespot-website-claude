import { Hero }             from '@/components/sections/Hero'
import { StatsBar }         from '@/components/sections/StatsBar'
import { LatestBroadcasts } from '@/components/sections/LatestBroadcasts'
import { Services }         from '@/components/sections/Services'
import { PartnerLogos }     from '@/components/sections/PartnerLogos'
import { PhotoGallery }     from '@/components/sections/PhotoGallery'
import { LatestNews }       from '@/components/sections/LatestNews'
import { ContactCTA }       from '@/components/sections/ContactCTA'
import { getLiveStreams }    from '@/lib/youtube'
import { getUpcomingEvents } from '@/lib/sheets'

/* Re-check live status & events every 60 seconds (ISR) */
export const revalidate = 60

export default async function HomePage() {
  const [liveStreams, events] = await Promise.all([
    getLiveStreams(),
    getUpcomingEvents(3),
  ])

  const liveEvents = events.filter(e => e.isLive)
  const isLive = liveStreams.length > 0 || liveEvents.length > 0

  // Build array of live titles for hero
  const liveTitles: string[] = []
  for (const stream of liveStreams) {
    liveTitles.push(stream.title)
  }
  // If no YouTube streams but Sheets says live, use event titles
  if (liveStreams.length === 0) {
    for (const event of liveEvents) {
      liveTitles.push(`${event.series}${event.description ? ` · ${event.description}` : ''}`)
    }
  }

  // Next upcoming event for hero (when not live)
  const nextEvent = events.find(e => e.isUpcoming)

  return (
    <>
      <Hero
        isLive={isLive}
        liveTitles={liveTitles}
        nextEventSeries={nextEvent?.series}
        nextEventDateISO={nextEvent?.date.toISOString()}
      />
      <StatsBar />
      <LatestBroadcasts />
      <Services />
      <PartnerLogos />
      <PhotoGallery />
      <LatestNews />
      <ContactCTA />
    </>
  )
}
