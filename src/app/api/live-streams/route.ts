import { getLiveStreams, getLiveStreamsViaSearch } from '@/lib/youtube'
import { getUpcomingEvents } from '@/lib/sheets'

export const dynamic = 'force-dynamic'

/**
 * GET /api/live-streams
 * Returns current live streams for client-side polling.
 * The /live page polls this every 30 seconds to detect new/ended streams.
 *
 * Detection chain:
 *   1. getLiveStreams() — RSS+videos.list (1 unit), then scraping (0 units), then Search API (100 units)
 *   2. If empty + Sheets says live → try Search API as last resort (handles edge cases
 *      where stream isn't in RSS yet or was just created)
 */
export async function GET() {
  try {
    const [liveStreams, events] = await Promise.all([
      getLiveStreams(),
      getUpcomingEvents(3),
    ])

    // Primary detection found streams — return them
    if (liveStreams.length > 0) {
      return Response.json({ streams: liveStreams })
    }

    // Fallback: Sheets says we should be live but primary detection failed.
    // This handles edge cases: brand new stream not yet in RSS, or API hiccup.
    const liveEvents = events.filter((e) => e.isLive)
    if (liveEvents.length > 0) {
      console.log('[Live API] Primary detection empty but Sheets shows live event — trying Search API')
      const searchResults = await getLiveStreamsViaSearch()
      return Response.json({ streams: searchResults })
    }

    return Response.json({ streams: [] })
  } catch (error) {
    console.error('Live streams API error:', error)
    return Response.json({ streams: [] })
  }
}
