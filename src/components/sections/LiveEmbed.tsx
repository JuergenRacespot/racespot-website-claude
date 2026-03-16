'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { YouTubeLiveStream } from '@/lib/youtube'
import { formatViewCount } from '@/lib/youtube'
import { useTranslation } from '@/lib/language'

interface SerializedEvent {
  series: string
  description: string
  dateISO: string
  tier: number
}

interface LiveEmbedProps {
  liveStream: YouTubeLiveStream
  /** When true, the id is a channel live_stream param, not a video ID */
  isChannelEmbed?: boolean
  upcomingEvents?: SerializedEvent[]
}

export function LiveEmbed({ liveStream, isChannelEmbed, upcomingEvents = [] }: LiveEmbedProps) {
  const t = useTranslation()

  // Build the correct embed URL
  const embedUrl = isChannelEmbed
    ? `https://www.youtube.com/embed/${liveStream.id}&autoplay=1&modestbranding=1&rel=0`
    : `https://www.youtube.com/embed/${liveStream.id}?autoplay=1&modestbranding=1&rel=0`

  // Chat embed needs a video ID; skip for channel embeds
  const chatVideoId = isChannelEmbed ? null : liveStream.id

  return (
    <div className="pt-8 min-h-screen">
      <div className="container-rs py-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="badge-live">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
            {t('live.onAir')}
          </span>
          {parseInt(liveStream.concurrentViewers) > 0 && (
            <span className="text-rs-muted text-sm">
              {formatViewCount(liveStream.concurrentViewers)} {t('live.watching')}
            </span>
          )}
        </div>
        <h1 className="display-title mb-8">{t('live.liveNow')}</h1>

        {/* Main embed */}
        <div className="relative aspect-video bg-rs-dark border border-rs-border rounded-rs overflow-hidden mb-6">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Stream info */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            {liveStream.title}
          </h2>
          {liveStream.description && (
            <p className="text-rs-muted text-sm max-w-2xl line-clamp-3">
              {liveStream.description}
            </p>
          )}
        </div>

        {/* Chat embed — only when we have a specific video ID */}
        {chatVideoId && (
          <div className="border border-rs-border rounded-rs overflow-hidden">
            <div className="bg-rs-dark px-4 py-2.5 border-b border-rs-border">
              <p className="text-xs font-display font-bold uppercase tracking-wider text-rs-muted">
                {t('live.liveChat')}
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <iframe
                src={`https://www.youtube.com/live_chat?v=${chatVideoId}&embed_domain=racespot.tv`}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Upcoming schedule — shown below live stream + chat */}
        {upcomingEvents.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="section-label mb-2">{t('live.comingSoon')}</p>
                <h2 className="section-title">{t('live.upcomingSchedule')}</h2>
              </div>
              <Link href="/calendar" className="btn-ghost hidden sm:flex">
                {t('live.fullCalendar')}
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <UpcomingEventRow key={i} event={event} />
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Link href="/calendar" className="btn-ghost">
                {t('live.viewFullCalendar')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────

function UpcomingEventRow({ event }: { event: SerializedEvent }) {
  const [is24h, setIs24h] = useState(true)

  useEffect(() => {
    try {
      const locale = navigator.language || 'en'
      if (locale.startsWith('de')) { setIs24h(true); return }
      const resolved = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions()
      setIs24h(!resolved.hour12)
    } catch {
      setIs24h(false)
    }
  }, [])

  const d = new Date(event.dateISO)
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en'

  const time = (() => {
    try {
      return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: !is24h })
    } catch {
      const h = d.getHours()
      const m = String(d.getMinutes()).padStart(2, '0')
      return is24h ? `${String(h).padStart(2, '0')}:${m}` : `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`
    }
  })()

  return (
    <div className="flex items-center gap-4 p-4 rounded-rs border border-rs-border bg-rs-dark hover:border-rs-yellow/40 transition-colors">
      <div className="shrink-0 text-center min-w-[60px]">
        <p className="text-[11px] uppercase text-rs-muted">
          {d.toLocaleDateString(locale, { weekday: 'short' })}
        </p>
        <p className="text-xl font-display font-bold text-white">{d.getDate()}</p>
        <p className="text-[11px] uppercase text-rs-muted">
          {d.toLocaleDateString(locale, { month: 'short' })}
        </p>
      </div>
      <div className="w-px h-10 bg-rs-border shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{event.series}</p>
        {event.description && (
          <p className="text-rs-muted text-xs truncate">{event.description}</p>
        )}
      </div>
      <p className="text-rs-yellow text-sm font-display font-bold shrink-0">{time}</p>
    </div>
  )
}
