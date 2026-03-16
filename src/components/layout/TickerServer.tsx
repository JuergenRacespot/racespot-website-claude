import { Ticker } from './Ticker'
import type { TickerItem } from './Ticker'
import { getUpcomingEvents } from '@/lib/sheets'
import { getLiveStream, formatViewCount } from '@/lib/youtube'

/** Fallback items when no data is available */
const FALLBACK_ITEMS: TickerItem[] = [
  { label: 'RACESPOT.TV — Professional Simracing Broadcast Production' },
  { label: '400+ Live Broadcasts Per Year — Cologne, Germany' },
  { label: 'Partners: Eurosport · Sport 1 · MotorsTV' },
]

export async function TickerServer() {
  const tickerItems: TickerItem[] = []
  let isLive = false

  try {
    // Fetch live stream from YouTube
    const [liveStream, events] = await Promise.all([
      getLiveStream(),
      getUpcomingEvents(5),
    ])

    // Determine live status
    const liveEvents = events.filter(e => e.isLive)
    isLive = !!liveStream || liveEvents.length > 0

    // Add live items only when actually live
    if (liveStream) {
      const viewers = formatViewCount(liveStream.concurrentViewers)
      tickerItems.push({
        label: `${liveStream.title} — ${viewers} Watching`,
      })
    } else if (liveEvents.length > 0) {
      for (const event of liveEvents) {
        tickerItems.push({
          label: `${event.series}${event.description ? ` — ${event.description}` : ''}`,
        })
      }
    }

    // Add upcoming events — pass ISO date so Ticker can format in user's local timezone
    const upcoming = events.filter(e => e.isUpcoming).slice(0, 3)
    for (const event of upcoming) {
      tickerItems.push({
        label: `${event.series}`,
        dateISO: event.date.toISOString(),
      })
    }
  } catch (error) {
    console.error('Ticker data fetch error:', error)
  }

  // Use fallback if no items generated
  const items = tickerItems.length > 0 ? tickerItems : FALLBACK_ITEMS

  return <Ticker items={items} isLive={isLive} />
}
