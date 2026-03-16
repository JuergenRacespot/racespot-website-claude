'use client'

import { useTranslation } from '@/lib/language'
import type { TranslationKey } from '@/lib/i18n/translations'

/** Inline translated text — usable in both server and client component trees */
export function T({ k }: { k: TranslationKey }) {
  const t = useTranslation()
  return <>{t(k)}</>
}
