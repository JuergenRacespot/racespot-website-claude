'use client'

import { useState, type FormEvent } from 'react'
import { useTranslation } from '@/lib/language'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const t = useTranslation()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const name = data.get('name') as string
    const email = data.get('email') as string
    const subject = data.get('subject') as string
    const message = data.get('message') as string

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    const mailto = `mailto:contact@racespot.tv?subject=${encodeURIComponent(subject || 'Website Inquiry')}&body=${encodeURIComponent(body)}`

    window.open(mailto, '_blank')
    setSubmitted(true)
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

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {t('contact.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
