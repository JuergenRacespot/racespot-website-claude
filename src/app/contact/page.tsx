'use client'

import { useState, type FormEvent } from 'react'
import { useTranslation } from '@/lib/language'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslation()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      subject: data.get('subject') as string,
      message: data.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      // If SMTP is not configured, open mailto as fallback
      if (result.method === 'mailto' && result.mailto) {
        const { to, subject, body } = result.mailto
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      }

      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please email us directly at contact@racespot.tv'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[200px] md:h-[260px] overflow-hidden bg-gradient-to-b from-rs-dark to-rs-black">
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rs-yellow via-rs-yellow/50 to-transparent" />
        <div className="container-rs relative h-full flex items-end pb-10">
          <div>
            <p className="section-label mb-3">{t('contact.label')}</p>
            <h1 className="display-title">{t('contact.title')}</h1>
          </div>
        </div>
      </div>

      <div className="container-rs py-16">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-16">
          {/* Left: Info */}
          <div>
            <h2 className="font-display font-bold text-xl uppercase text-white mb-4">
              {t('contact.letsTalk')}
            </h2>
            <p className="text-rs-muted text-sm leading-relaxed mb-8">
              {t('contact.intro')}
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1">
                  {t('contact.email')}
                </p>
                <a
                  href="mailto:contact@racespot.tv"
                  className="text-rs-yellow hover:text-white transition-colors text-sm"
                >
                  contact@racespot.tv
                </a>
              </div>

              <div>
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1">
                  {t('contact.location')}
                </p>
                <p className="text-white/80 text-sm">
                  Cologne / Hürth, Germany
                </p>
              </div>

              <div>
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1">
                  {t('contact.company')}
                </p>
                <p className="text-white/80 text-sm">
                  Racespot Media House GmbH
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="rounded-rs border border-rs-yellow/30 bg-rs-dark p-8 text-center">
                <p className="text-rs-yellow font-display font-bold text-lg uppercase mb-2">
                  {t('contact.thanks')}
                </p>
                <p className="text-rs-muted text-sm mb-6">
                  {t('contact.thanksDesc')}{' '}
                  <a href="mailto:contact@racespot.tv" className="text-rs-yellow hover:underline">
                    contact@racespot.tv
                  </a>
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline btn-sm"
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1.5 block">
                      {t('contact.name')}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full bg-rs-dark border border-rs-border rounded-rs px-4 py-3 text-sm text-white placeholder:text-rs-muted/50 focus:border-rs-yellow focus:outline-none transition-colors"
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1.5 block">
                      {t('contact.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-rs-dark border border-rs-border rounded-rs px-4 py-3 text-sm text-white placeholder:text-rs-muted/50 focus:border-rs-yellow focus:outline-none transition-colors"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1.5 block">
                    {t('contact.subject')}
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="w-full bg-rs-dark border border-rs-border rounded-rs px-4 py-3 text-sm text-white placeholder:text-rs-muted/50 focus:border-rs-yellow focus:outline-none transition-colors"
                    placeholder={t('contact.subjectPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-[11px] font-display font-bold uppercase tracking-[0.1em] text-rs-muted mb-1.5 block">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full bg-rs-dark border border-rs-border rounded-rs px-4 py-3 text-sm text-white placeholder:text-rs-muted/50 focus:border-rs-yellow focus:outline-none transition-colors resize-none"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>

                {error && (
                  <div className="rounded-rs border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('contact.sending') || 'Sending...'}
                    </span>
                  ) : (
                    t('contact.send')
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
