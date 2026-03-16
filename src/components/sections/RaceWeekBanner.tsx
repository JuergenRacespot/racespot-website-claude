'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/language'

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export function RaceWeekBanner() {
  const { days, hours, mins, secs } = useCountdown('2026-07-08T10:00:00+02:00')
  const t = useTranslation()

  return (
    <section className="section section--alt">
      <div className="container-rs">
        {/* Section header */}
        <p className="section-label mb-2">{t('raceweek.label')}</p>
        <h2 className="section-title mb-8">Race Week 2026</h2>

        {/* Event hero card */}
        <div
          className="grid lg:grid-cols-[1.8fr_1fr] gap-10 p-8 lg:p-12 rounded-lg border border-rs-border"
          style={{
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A00 50%, #0A0A0A 100%)',
          }}
        >
          {/* Left content */}
          <div>
            <p className="section-label mb-4">08 – 12 July 2026 · Cologne, Germany</p>

            <h3 className="font-display font-black text-white uppercase leading-[0.95] mb-4" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              Europe&apos;s New Festival of<br />
              <em className="not-italic text-rs-yellow">Virtual Motorsport</em>
            </h3>

            <p className="text-[15px] text-white/60 mb-4 max-w-lg">
              Esports competition · Automotive innovation · Live entertainment ·
              Up to 1,500 guests · Global broadcast infrastructure
            </p>

            <p className="text-[13px] uppercase tracking-[0.08em] text-rs-muted mb-6">
              Cologne · Germany · Capacity 1,500 · Global Broadcast
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">{t('raceweek.register')}</Link>
              <Link href="/contact" className="btn-outline">{t('raceweek.partner')}</Link>
            </div>
          </div>

          {/* Right - Countdown */}
          <div className="flex flex-col items-start lg:items-end justify-center">
            <p className="section-label mb-4">{t('raceweek.countdown')}</p>
            <div className="flex gap-4">
              {[
                { value: days, label: t('live.days') },
                { value: String(hours).padStart(2, '0'), label: t('live.hrs') },
                { value: String(mins).padStart(2, '0'), label: t('live.min') },
                { value: String(secs).padStart(2, '0'), label: t('live.sec') },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="bg-rs-gray border border-rs-border rounded-rs px-4 py-3 min-w-[72px] text-center"
                >
                  <p className="font-display font-black text-rs-yellow text-4xl leading-none">
                    {unit.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-rs-muted mt-1">
                    {unit.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
