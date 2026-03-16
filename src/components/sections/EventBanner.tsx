'use client'

import { useCountdown } from '@/lib/hooks/useCountdown'

interface EventBannerProps {
  /** Small label above section title */
  eyebrow?: string
  /** Section title, e.g. "Race Week 2026" */
  sectionTitle: string
  /** Label inside the card, e.g. "08 – 12 July 2026 · Cologne, Germany" */
  dateLabel: string
  /** Main heading line 1, e.g. "Europe's New Festival of" */
  headingLine1: string
  /** Main heading line 2 (highlighted in yellow), e.g. "Virtual Motorsport" */
  headingLine2: string
  /** Description text */
  description: string
  /** Meta line below description */
  meta: string
  /** Primary CTA button label */
  primaryCta: string
  /** Secondary CTA button label */
  secondaryCta: string
  /** ISO date string for countdown target, e.g. "2026-07-08T10:00:00+02:00" */
  countdownTarget: string
  /** Optional callback for primary CTA */
  onPrimaryCta?: () => void
  /** Optional callback for secondary CTA */
  onSecondaryCta?: () => void
}

export function EventBanner({
  eyebrow = 'Next Major Event',
  sectionTitle,
  dateLabel,
  headingLine1,
  headingLine2,
  description,
  meta,
  primaryCta,
  secondaryCta,
  countdownTarget,
  onPrimaryCta,
  onSecondaryCta,
}: EventBannerProps) {
  const { days, hours, mins, secs } = useCountdown(countdownTarget)

  return (
    <section className="section section--alt">
      <div className="container-rs">
        <p className="section-label mb-2">{eyebrow}</p>
        <h2 className="section-title mb-8">{sectionTitle}</h2>

        <div
          className="grid lg:grid-cols-[1.8fr_1fr] gap-10 p-8 lg:p-12 rounded-lg border border-rs-border"
          style={{
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A00 50%, #0A0A0A 100%)',
          }}
        >
          {/* Left content */}
          <div>
            <p className="section-label mb-4">{dateLabel}</p>

            <h3
              className="font-display font-black text-white uppercase leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              {headingLine1}<br />
              <em className="not-italic text-rs-yellow">{headingLine2}</em>
            </h3>

            <p className="text-[15px] text-white/60 mb-4 max-w-lg">{description}</p>

            <p className="text-[13px] uppercase tracking-[0.08em] text-rs-muted mb-6">{meta}</p>

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary" onClick={onPrimaryCta}>{primaryCta}</button>
              <button className="btn-outline" onClick={onSecondaryCta}>{secondaryCta}</button>
            </div>
          </div>

          {/* Right - Countdown */}
          <div className="flex flex-col items-start lg:items-end justify-center">
            <p className="section-label mb-4">Countdown</p>
            <div className="flex gap-4">
              {[
                { value: days, label: 'Days' },
                { value: String(hours).padStart(2, '0'), label: 'Hrs' },
                { value: String(mins).padStart(2, '0'), label: 'Min' },
                { value: String(secs).padStart(2, '0'), label: 'Sec' },
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
