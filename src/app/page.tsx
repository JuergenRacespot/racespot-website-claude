import { Hero }             from '@/components/sections/Hero'
import { StatsBar }         from '@/components/sections/StatsBar'
import { LatestBroadcasts } from '@/components/sections/LatestBroadcasts'
import { Services }         from '@/components/sections/Services'
import { PartnerLogos }     from '@/components/sections/PartnerLogos'
import { PhotoGallery }     from '@/components/sections/PhotoGallery'
import { LatestNews }       from '@/components/sections/LatestNews'
import { ContactCTA }       from '@/components/sections/ContactCTA'
import { getLiveStream }    from '@/lib/youtube'
import { getUpcomingEvents } from '@/lib/sheets'

/* Re-check live status & events every 60 seconds (ISR) */
export const revalidate = 60

export default async function HomePage() {
  const [liveStream, events] = await Promise.all([
    getLiveStream(),
    getUpcomingEvents(3),
  ])

  const liveEvents = events.filter(e => e.isLive)
  const isLive = !!liveStream || liveEvents.length > 0

  // Live info for hero
  const liveTitle = liveStream
    ? liveStream.title
    : liveEvents.length > 0
      ? `${liveEvents[0].series}${liveEvents[0].description ? ` · ${liveEvents[0].description}` : ''}`
      : null

  // Next upcoming event for hero (when not live)
  const nextEvent = events.find(e => e.isUpcoming)

  return (
    <>
      <Hero
        isLive={isLive}
        liveTitle={liveTitle}
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
