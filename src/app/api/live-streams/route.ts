import { getLiveStreams, getLiveStreamsViaSearch } from '@/lib/youtube'
import { getUpcomingEvents } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

/**
 * GET /api/live-streams
 * Returns current live streams for client-side polling.
 * The /live page polls this every 30 seconds to detect new/ended streams.
 */
export async function GET() {
  try {
    const [liveStreams, events] = await Promise.all([
      getLiveStreams(),
      getUpcomingEvents(3),
    ])

    // If YouTube scraping found streams, return them
    if (liveStreams.length > 0) {
      return Response.json({ streams: liveStreams })
    }

    // Fallback: Sheets says live but scraping failed (cloud IP blocked)
    const liveEvents = events.filter((e) => e.isLive)
    if (liveEvents.length > 0) {
      const searchResults = await getLiveStreamsViaSearch()
      return Response.json({ streams: searchResults })
    }

    return Response.json({ streams: [] })
  } catch (error) {
    console.error('Live streams API error:', error)
    return Response.json({ streams: [] })
  }
}
