import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { translations, LanguageCode, TranslationKeys } from './translations'

interface I18nContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('ffmpeg-language') as LanguageCode | null
    if (saved && saved in translations) return saved
    const navLang = navigator.language.substring(0, 2) as LanguageCode
    if (navLang in translations) return navLang
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('ffmpeg-language', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
  }, [])

  const t = translations[language]

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
