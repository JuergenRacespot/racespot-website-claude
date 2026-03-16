'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type TranslationKey } from '@/lib/i18n/translations'

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
] as const

export type LangCode = (typeof LANGUAGES)[number]['code']

const SUPPORTED_CODES = new Set(LANGUAGES.map((l) => l.code))
const STORAGE_KEY = 'racespot-lang'

interface LanguageContextValue {
  lang: LangCode
  setLang: (code: LangCode) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
})

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useTranslation() {
  const { lang } = useLanguage()
  return function t(key: TranslationKey): string {
    const entry = translations[key]
    if (!entry) return key
    return (entry as Record<string, string>)[lang] || (entry as Record<string, string>).en || key
  }
}

function detectBrowserLang(): LangCode {
  if (typeof navigator === 'undefined') return 'en'

  // Check all browser languages for a match
  const browserLangs = navigator.languages || [navigator.language]
  for (const bl of browserLangs) {
    const code = bl.split('-')[0].toLowerCase()
    if (SUPPORTED_CODES.has(code as LangCode)) return code as LangCode
  }

  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check localStorage first, then browser detection
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_CODES.has(stored as LangCode)) {
      setLangState(stored as LangCode)
    } else {
      setLangState(detectBrowserLang())
    }
    setMounted(true)
  }, [])

  function setLang(code: LangCode) {
    setLangState(code)
    localStorage.setItem(STORAGE_KEY, code)
  }

  // Prevent flash — render with default until mounted
  if (!mounted) return <>{children}</>

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
