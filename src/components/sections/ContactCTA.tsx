'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/language'

export function ContactCTA() {
  const t = useTranslation()

  return (
    <div className="py-20 text-center border-t border-b border-rs-border bg-rs-black">
      <div className="container-rs">
        <h2 className="font-display font-black uppercase text-white mb-4" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
          {t('cta.title')}
        </h2>
        <p className="text-[16px] text-white/60 max-w-[560px] mx-auto mb-8">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-primary">{t('cta.requestQuote')}</Link>
          <Link href="/broadcasts" className="btn-outline">{t('cta.viewWork')}</Link>
        </div>
      </div>
    </div>
  )
}
