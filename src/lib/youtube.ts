/**
 * YouTube integration for Racespot.tv
 *
 * QUOTA OPTIMIZATION STRATEGY:
 *   1. RSS feed (0 units) for video data — includes title, thumbnail, views, date
 *   2. videos.list (1 unit) only when API available — adds duration, stats
 *   3. Scraping (0 units) for live stream pre-check — replaces search.list (100 units!)
 *   4. playlists.list (1 unit) cached for 24h
 *   5. Live stream details (1 unit) only when scraping confirms live
 *
 * FALLBACK: When API quota is exceeded, RSS data is used directly (no duration/stats).
 * Estimated daily cost: ~5-10 units (down from ~2,000)
 */

const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

// ─── Cache durations ────────────────────────────────────────
const CACHE_24H = 86400       // 24 hours — playlists, video details
const CACHE_1H = 3600         // 1 hour — latest videos, broadcasts
const CACHE_LIVE = 60         // 1 min — live stream check (lightweight scrape)
const CACHE_LIVE_DETAILS = 60 // 1 min — live stream details (only when live)

// ─── Types ──────────────────────────────────────────────────

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  thumbnailHigh: string
  publishedAt: string
  viewCount: string
  likeCount: string
  duration: string
  liveBroadcastContent: 'live' | 'upcoming' | 'none'
}

export interface YouTubeLiveStream {
  id: string
  title: string
  description: string
  thumbnail: string
  concurrentViewers: string
}

export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  thumbnailHigh: string
  itemCount: number
  publishedAt: string
}

interface YouTubeVideoItem {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium?: { url: string }
      high?: { url: string }
    }
    publishedAt: string
    liveBroadcastContent: 'live' | 'upcoming' | 'none'
  }
  statistics: { viewCount: string; likeCount: string }
  contentDetails: { duration: string }
}

function mapVideoItem(item: YouTubeVideoItem): YouTubeVideo {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium?.url || '',
    thumbnailHigh: item.snippet.thumbnails.high?.url || '',
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount || '0',
    likeCount: item.statistics?.likeCount || '0',
    duration: item.contentDetails?.duration || '',
    liveBroadcastContent: item.snippet.liveBroadcastContent,
  }
}

// ─── RSS Feed (0 quota units) ───────────────────────────────

interface RSSVideoData {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  viewCount: string
}

/**
 * Fetch latest videos from the channel's RSS feed.
 * Cost: 0 API units — uses YouTube's public Atom feed.
 * Returns up to 15 videos with basic data (YouTube RSS limit).
 */
async function getVideosFromRSS(): Promise<RSSVideoData[]> {
  if (!CHANNEL_ID) return []

  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    const res = await fetch(url, { next: { revalidate: CACHE_1H } })

    if (!res.ok) {
      console.error('YouTube RSS feed error:', res.status)
      return []
    }

    const xml = await res.text()
    const videos: RSSVideoData[] = []

    // Parse each <entry> block
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    let entryMatch
    while ((entryMatch = entryRegex.exec(xml)) !== null) {
      const entry = entryMatch[1]

      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || ''
      const title = entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] || ''
      const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || ''
      const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] || ''
      const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] || ''
      const viewCount = entry.match(/<media:statistics views="(\d+)"/)?.[1] || '0'

      if (id) {
        videos.push({ id, title, description, thumbnail, publishedAt, viewCount })
      }
    }

    return videos
  } catch (error) {
    console.error('YouTube RSS error:', error)
    return []
  }
}

/**
 * Convert RSS data to full YouTubeVideo format (without duration/detailed stats).
 */
function rssToYouTubeVideo(rss: RSSVideoData): YouTubeVideo {
  return {
    id: rss.id,
    title: rss.title,
    description: rss.description,
    thumbnail: rss.thumbnail || `https://i.ytimg.com/vi/${rss.id}/mqdefault.jpg`,
    thumbnailHigh: `https://i.ytimg.com/vi/${rss.id}/hqdefault.jpg`,
    publishedAt: rss.publishedAt,
    viewCount: rss.viewCount,
    likeCount: '0',
    duration: '',
    liveBroadcastContent: 'none',
  }
}

// ─── Video Details (1 unit per call, up to 50 IDs) ──────────

/**
 * Fetch video details by IDs.
 * Cost: 1 unit per call (regardless of how many IDs, up to 50).
 */
async function getVideoDetails(videoIds: string[], revalidate = CACHE_24H): Promise<YouTubeVideo[]> {
  if (!videoIds.length || !API_KEY) return []

  try {
    const url = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${API_KEY}`
    const res = await fetch(url, { next: { revalidate } })

    if (!res.ok) {
      console.error('YouTube videos API error:', res.status)
      return [] // Caller (getLatestVideos/getCompletedBroadcasts) falls back to RSS
    }

    const data = await res.json()
    if (!data.items?.length) return []

    return data.items.map(mapVideoItem)
  } catch (error) {
    console.error('YouTube video details error:', error)
    return []
  }
}

// ─── Public API ─────────────────────────────────────────────

/**
 * Fetch latest videos from the channel.
 * Cost: 0 units (RSS) + 1 unit (video details) = 1 unit total.
 * Fallback: RSS-only data when API quota is exceeded (no duration).
 * Cached for 1 hour.
 */
export async function getLatestVideos(maxResults = 6): Promise<YouTubeVideo[]> {
  if (!CHANNEL_ID) {
    console.warn('YouTube Channel ID not configured')
    return []
  }

  try {
    const rssVideos = await getVideosFromRSS()
    if (!rssVideos.length) return []

    const subset = rssVideos.slice(0, maxResults)
    const ids = subset.map((v) => v.id)

    // Try API for full details (duration, stats)
    const apiVideos = await getVideoDetails(ids, CACHE_1H)

    // If API returned data, use it; otherwise fall back to RSS
    if (apiVideos.length > 0) return apiVideos
    return subset.map(rssToYouTubeVideo)
  } catch (error) {
    console.error('YouTube latest videos error:', error)
    return []
  }
}

/**
 * Fetch recent broadcasts (videos > 10 min duration).
 * Cost: 0 units (RSS) + 1 unit (video details) = 1 unit total.
 * Fallback: When API unavailable, returns all RSS videos (can't filter by duration).
 * Cached for 1 hour.
 */
export async function getCompletedBroadcasts(maxResults = 6): Promise<YouTubeVideo[]> {
  if (!CHANNEL_ID) {
    console.warn('YouTube Channel ID not configured')
    return []
  }

  try {
    const rssVideos = await getVideosFromRSS()
    if (!rssVideos.length) return []

    // Try API for full details (needed for duration filtering)
    const apiVideos = await getVideoDetails(rssVideos.map((v) => v.id), CACHE_1H)

    if (apiVideos.length > 0) {
      // Filter for broadcast-length videos (> 10 minutes)
      const broadcasts = apiVideos.filter((v) => {
        const match = v.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
        const hours = parseInt(match?.[1] || '0', 10)
        const minutes = parseInt(match?.[2] || '0', 10)
        return hours > 0 || minutes >= 10
      })
      return broadcasts.slice(0, maxResults)
    }

    // Fallback: return RSS videos (can't filter by duration without API)
    return rssVideos.slice(0, maxResults).map(rssToYouTubeVideo)
  } catch (error) {
    console.error('YouTube completed broadcasts error:', error)
    return []
  }
}

/**
 * Check if channel is currently live streaming and return ALL live streams.
 *
 * Three-tier approach for multi-stream support:
 *   Tier 1 (0 units): Scrape channel page for live indicator (just a yes/no check)
 *   Tier 2 (100 units): If live, use Search API to find ALL concurrent live streams
 *   Tier 3 (1 unit): Fetch details for all found streams via videos.list
 *
 * When offline (99%+ of the time): 0 units.
 * When live: 101 units (search + details), cached for 60 seconds.
 */
export async function getLiveStreams(): Promise<YouTubeLiveStream[]> {
  if (!CHANNEL_ID) return []

  try {
    // Tier 1: Free scrape check — is the channel live at all?
    // Use cache: 'no-store' to avoid Next.js Response.clone errors
    // (body consumed by .text() can't be cloned for caching)
    const channelUrl = `https://www.youtube.com/channel/${CHANNEL_ID}/live`
    const scrapeRes = await fetch(channelUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Racespot/1.0)',
      },
    })

    if (!scrapeRes.ok) return []

    const html = await scrapeRes.text()
    const isLive = html.includes('"isLive":true') || html.includes('hqdefault_live.jpg')

    if (!isLive) return []

    // Tier 2: Search API to find ALL live streams (handles multiple concurrent broadcasts)
    if (!API_KEY) return []

    const searchUrl = `${BASE_URL}/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&maxResults=10&key=${API_KEY}`
    const searchRes = await fetch(searchUrl, { next: { revalidate: CACHE_LIVE } })

    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const searchItems = searchData.items || []

    if (searchItems.length === 0) return []

    // Tier 3: Get details for all found live streams (1 unit, up to 50 IDs)
    const videoIds = searchItems.map((item: { id: { videoId: string } }) => item.id.videoId)
    const detailUrl = `${BASE_URL}/videos?part=liveStreamingDetails,snippet&id=${videoIds.join(',')}&key=${API_KEY}`
    const detailRes = await fetch(detailUrl, { next: { revalidate: CACHE_LIVE_DETAILS } })

    if (!detailRes.ok) return []

    const detailData = await detailRes.json()
    const details = detailData.items || []

    // Filter to confirmed live streams on OUR channel
    return details
      .filter((detail: { snippet: { liveBroadcastContent: string; channelId: string } }) =>
        detail.snippet.liveBroadcastContent === 'live' && detail.snippet.channelId === CHANNEL_ID
      )
      .map((detail: {
        id: string
        snippet: {
          title: string
          description: string
          thumbnails: { high?: { url: string }; medium?: { url: string } }
        }
        liveStreamingDetails?: { concurrentViewers?: string }
      }) => ({
        id: detail.id,
        title: detail.snippet.title,
        description: detail.snippet.description,
        thumbnail: detail.snippet.thumbnails.high?.url || detail.snippet.thumbnails.medium?.url || '',
        concurrentViewers: detail.liveStreamingDetails?.concurrentViewers || '0',
      }))
  } catch (error) {
    console.error('YouTube live check error:', error)
    return []
  }
}

/**
 * Convenience wrapper — returns first live stream or null.
 * Used by components that only need to know "is anything live?"
 */
export async function getLiveStream(): Promise<YouTubeLiveStream | null> {
  const streams = await getLiveStreams()
  return streams[0] ?? null
}

/**
 * Fallback: Use YouTube Search API to find ALL live streams.
 * Cost: 100 units — only call when Sheets confirms we're live but scraping failed.
 * This handles cloud environments where YouTube blocks scraping.
 */
export async function getLiveStreamsViaSearch(): Promise<YouTubeLiveStream[]> {
  if (!API_KEY || !CHANNEL_ID) return []

  try {
    const searchUrl = `${BASE_URL}/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&maxResults=10&key=${API_KEY}`
    const searchRes = await fetch(searchUrl, { next: { revalidate: CACHE_LIVE } })

    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const searchItems = searchData.items || []

    if (searchItems.length === 0) return []

    // Get live details for all found streams (1 unit)
    const videoIds = searchItems.map((item: { id: { videoId: string } }) => item.id.videoId)
    const detailUrl = `${BASE_URL}/videos?part=liveStreamingDetails,snippet&id=${videoIds.join(',')}&key=${API_KEY}`
    const detailRes = await fetch(detailUrl, { next: { revalidate: CACHE_LIVE_DETAILS } })

    if (!detailRes.ok) return []

    const detailData = await detailRes.json()
    const details = detailData.items || []

    return details.map((detail: {
      id: string
      snippet: {
        title: string
        description: string
        thumbnails: { high?: { url: string }; medium?: { url: string } }
      }
      liveStreamingDetails?: { concurrentViewers?: string }
    }) => ({
      id: detail.id,
      title: detail.snippet.title,
      description: detail.snippet.description,
      thumbnail: detail.snippet.thumbnails.high?.url || detail.snippet.thumbnails.medium?.url || '',
      concurrentViewers: detail.liveStreamingDetails?.concurrentViewers || '0',
    }))
  } catch (error) {
    console.error('YouTube search API live check error:', error)
    return []
  }
}

/**
 * @deprecated Use getLiveStreamsViaSearch() instead
 */
export async function getLiveStreamViaSearch(): Promise<YouTubeLiveStream | null> {
  const streams = await getLiveStreamsViaSearch()
  return streams[0] ?? null
}

/**
 * Fetch all public playlists from the channel.
 * Cost: 1 unit. Cached for 24 hours.
 *
 * When the API fails (quota exceeded, network error, etc.) returns []
 * so the playlist section is hidden until the API recovers.
 */
export async function getChannelPlaylists(maxResults = 50): Promise<YouTubePlaylist[]> {
  if (!API_KEY || !CHANNEL_ID) {
    console.warn('YouTube API key or Channel ID not configured')
    return []
  }

  try {
    const url = `${BASE_URL}/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=${maxResults}&key=${API_KEY}`
    const res = await fetch(url, { next: { revalidate: CACHE_24H } })

    if (!res.ok) {
      console.error('YouTube playlists API error:', res.status)
      return []
    }

    const data = await res.json()
    if (!data.items?.length) return []

    return data.items
      .filter((item: { contentDetails: { itemCount: number } }) => item.contentDetails.itemCount > 0)
      .map((item: {
        id: string
        snippet: {
          title: string
          description: string
          thumbnails: { medium?: { url: string }; high?: { url: string } }
          publishedAt: string
        }
        contentDetails: { itemCount: number }
      }) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || '',
        thumbnailHigh: item.snippet.thumbnails.high?.url || '',
        itemCount: item.contentDetails.itemCount,
        publishedAt: item.snippet.publishedAt,
      })) as YouTubePlaylist[]
  } catch (error) {
    console.error('YouTube playlists error:', error)
    return []
  }
}

// ─── Formatting utilities ────────────────────────────────────

/**
 * Format view count to human-readable string
 * e.g. 2100000 -> "2.1M", 85000 -> "85K", 1234 -> "1.2K"
 */
export function formatViewCount(count: string): string {
  const num = parseInt(count, 10)
  if (isNaN(num)) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1).replace(/\.0$/, '')}K`
  return num.toLocaleString()
}

/**
 * Format ISO date to relative/short format
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * Parse ISO 8601 duration to human-readable
 * e.g. "PT1H30M15S" -> "1:30:15", "PT5M30S" -> "5:30"
 */
export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''

  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
