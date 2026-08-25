import React, { useState, useRef, useEffect } from 'react'
import { Languages, Check, ChevronDown } from 'lucide-react'
import { useI18n } from '../i18n'
import { languageLabels, LanguageCode } from '../i18n/translations'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (lang: LanguageCode) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-200 hover:text-dark-100 text-sm transition-colors"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">{languageLabels[language]}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-dark-700 border border-dark-500 rounded-lg shadow-lg z-50 overflow-hidden">
          {(Object.keys(languageLabels) as LanguageCode[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                language === lang
                  ? 'bg-neon-green/20 text-neon-green'
                  : 'text-dark-200 hover:bg-dark-600'
              }`}
            >
              {language === lang && <Check className="w-4 h-4" />}
              {language !== lang && <span className="w-4" />}
              {languageLabels[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
