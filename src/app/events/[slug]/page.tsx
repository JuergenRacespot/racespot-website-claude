'use client'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useTranslation } from '@/lib/language'
import type { TranslationKey } from '@/lib/i18n/translations'
import { useEffect, useState } from 'react'

/* ── Event Data ───────────────────────────────────────────── */

interface EventHighlight {
  titleKey: TranslationKey
  descKey: TranslationKey
  icon: string
}

interface EventData {
  name: string
  date: string
  dateISO: string
  location: string
  venue: string
  capacity: string
  tags: string[]
  heroImage: string
  highlights: EventHighlight[]
  desc1Key: TranslationKey
  desc2Key: TranslationKey
  galleryImages: string[]
}

const EVENTS: Record<string, EventData> = {
  'race-week-2026': {
    name: 'RACE WEEK 2026',
    date: '08 – 12 July 2026',
    dateISO: '2026-07-08T10:00:00',
    location: 'Cologne, Germany',
    venue: 'Cologne, Germany',
    capacity: '1,500',
    tags: ['Festival', 'Live Event', 'Esports', 'Expo'],
    heroImage: '/images/events/rennsport-relaunch-2026/DSC00103.jpg',
    highlights: [
      { titleKey: 'eventDetail.hl.esports', descKey: 'eventDetail.hl.esportsDesc', icon: '🏆' },
      { titleKey: 'eventDetail.hl.expo', descKey: 'eventDetail.hl.expoDesc', icon: '🎮' },
      { titleKey: 'eventDetail.hl.panels', descKey: 'eventDetail.hl.panelsDesc', icon: '🎤' },
      { titleKey: 'eventDetail.hl.entertainment', descKey: 'eventDetail.hl.entertainmentDesc', icon: '🎵' },
    ],
    desc1Key: 'eventDetail.raceweek.desc1',
    desc2Key: 'eventDetail.raceweek.desc2',
    galleryImages: [
      '/images/events/rennsport-relaunch-2026/DSC00329.jpg',
      '/images/events/rennsport-relaunch-2026/DSC09899.jpg',
      '/images/events/rennsport-relaunch-2026/DSC00301.jpg',
      '/images/events/rennsport-relaunch-2026/DSC00315.jpg',
    ],
  },
}

/* ── Countdown Hook ───────────────────────────────────────── */

function useCountdown(targetISO: string) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const now = Date.now()
      const target = new Date(targetISO).getTime()
      const ms = Math.max(0, target - now)
      setDiff({
        days: Math.floor(ms / 86400000),
        hours: Math.floor((ms % 86400000) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return diff
}

/* ── Page Component ───────────────────────────────────────── */

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const t = useTranslation()
  const event = EVENTS[params.slug]

  if (!event) notFound()

  const countdown = useCountdown(event.dateISO)

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative h-[350px] md:h-[500px] overflow-hidden">
        <Image
          src={event.heroImage}
          alt={event.name}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rs-black via-rs-black/60 to-rs-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rs-yellow via-rs-yellow/50 to-transparent" />

        <div className="container-rs relative h-full flex items-end pb-10">
          <div>
            <Link href="/events" className="text-rs-muted hover:text-white text-sm transition-colors mb-4 inline-block">
              {t('eventDetail.backToEvents')}
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              {event.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono bg-rs-yellow text-rs-black px-2 py-0.5 font-bold">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl uppercase text-white tracking-tight">
              {event.name}
            </h1>
            <p className="text-rs-yellow font-bold text-lg mt-2">{event.date} · {event.location}</p>
          </div>
        </div>
      </section>

      <div className="container-rs py-16">
        {/* ── Countdown ── */}
        <div className="mb-16">
          <div className="grid grid-cols-4 gap-3 max-w-lg">
            {[
              { value: countdown.days, labelKey: 'live.days' as TranslationKey },
              { value: countdown.hours, labelKey: 'live.hrs' as TranslationKey },
              { value: countdown.minutes, labelKey: 'live.min' as TranslationKey },
              { value: countdown.seconds, labelKey: 'live.sec' as TranslationKey },
            ].map(({ value, labelKey }) => (
              <div key={labelKey} className="bg-rs-dark border border-rs-border rounded-rs p-4 text-center">
                <p className="font-display font-black text-rs-yellow text-3xl md:text-4xl">
                  {String(value).padStart(2, '0')}
                </p>
                <p className="text-xs text-rs-muted uppercase tracking-wider mt-1">{t(labelKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── About the Event ── */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-12 mb-20">
          <div>
            <h2 className="font-display font-bold text-2xl uppercase text-white mb-6">
              {t('eventDetail.about')}
            </h2>
            <div className="space-y-4 text-[15px] text-rs-muted leading-relaxed">
              <p>{t(event.desc1Key)}</p>
              <p>{t(event.desc2Key)}</p>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            <div className="bg-rs-dark border border-rs-border rounded-rs p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-rs-muted uppercase tracking-wider mb-1">{t('eventDetail.date')}</p>
                  <p className="text-white font-bold">{event.date}</p>
                </div>
                <div>
                  <p className="text-xs text-rs-muted uppercase tracking-wider mb-1">{t('eventDetail.venue')}</p>
                  <p className="text-white font-bold">{event.venue}</p>
                </div>
                <div>
                  <p className="text-xs text-rs-muted uppercase tracking-wider mb-1">{t('eventDetail.capacity')}</p>
                  <p className="text-white font-bold">{event.capacity} {t('eventDetail.visitorsPerDay')}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/contact" className="btn-primary w-full text-center block">
                  {t('raceweek.register')}
                </Link>
                <Link href="/contact" className="btn-ghost w-full text-center block">
                  {t('raceweek.partner')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Highlights Grid ── */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-rs-yellow font-display font-bold text-xl tracking-[0.08em] uppercase shrink-0">
              {t('eventDetail.highlights')}
            </h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-rs-yellow/60 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {event.highlights.map((hl) => (
              <div
                key={hl.titleKey}
                className="bg-rs-dark border border-rs-border rounded-rs p-6 hover:border-rs-yellow/50 transition-colors"
              >
                <span className="text-2xl mb-3 block">{hl.icon}</span>
                <h3 className="font-display font-bold text-lg uppercase text-white mb-2">
                  {t(hl.titleKey)}
                </h3>
                <p className="text-sm text-rs-muted leading-relaxed">
                  {t(hl.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Gallery ── */}
        {event.galleryImages.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-rs-yellow font-display font-bold text-xl tracking-[0.08em] uppercase shrink-0">
                {t('gallery.label')}
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-rs-yellow/60 to-transparent" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {event.galleryImages.map((img, i) => (
                <div key={img} className="relative aspect-[4/3] rounded-rs overflow-hidden group">
                  <Image
                    src={img}
                    alt={`${event.name} gallery ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
