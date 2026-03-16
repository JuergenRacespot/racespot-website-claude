import type { Metadata } from 'next'
import { getLiveStream, getLiveStreamViaSearch } from '@/lib/youtube'
import { getUpcomingEvents } from '@/lib/sheets'
import { LiveEmbed } from '@/components/sections/LiveEmbed'
import { LiveOffline } from '@/components/sections/LiveOffline'

/* Always fetch fresh data — live detection must be real-time */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Live',
  description: 'Watch Racespot live streams — sim racing broadcasts live on YouTube.',
}

export default async function LivePage() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || ''

  const [liveStream, events] = await Promise.all([
    getLiveStream(),
    getUpcomingEvents(10),
  ])

  // Check if Google Sheets shows any live events
  const liveEvents = events.filter((e) => e.isLive)

  // Build upcoming events list (used in both live and offline states)
  const upcomingEvents = events
    .filter((e) => e.isUpcoming)
    .slice(0, 5)
    .map((e) => ({
      series: e.series,
      description: e.description,
      dateISO: e.date.toISOString(),
      tier: e.tier,
    }))

  // If YouTube scraping found a specific live stream, use it
  if (liveStream) {
    return <LiveEmbed liveStream={liveStream} upcomingEvents={upcomingEvents} />
  }

  // If Sheets says we're live but scraping failed (cloud IP blocked),
  // use the Search API as fallback (100 units, but only when actually live)
  if (liveEvents.length > 0) {
    const searchResult = await getLiveStreamViaSearch()
    if (searchResult) {
      return <LiveEmbed liveStream={searchResult} upcomingEvents={upcomingEvents} />
    }
  }

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null

  return (
    <LiveOffline
      nextEvent={nextEvent}
      upcomingEvents={upcomingEvents}
      channelId={channelId}
    />
  )
}
