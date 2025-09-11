'use client'

import { useState, useRef, useEffect } from 'react'
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

export default function LanguageSwitcher({ currentLocale, currentPath = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getLocalizedPath = (locale) => {
    if (!currentPath) return `/${locale}`

    // Remove current locale from path and add new locale
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || ''
    return `/${locale}${pathWithoutLocale}`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200/50 hover:border-gray-300 rounded-xl hover:rounded-2xl focus:outline-none focus:ring-4 focus:ring-ocean-500/20 transition-all duration-200 shadow-soft hover:shadow-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-ocean-600 group-hover:text-ocean-700 transition-colors duration-200" />
        <span className="hidden sm:inline font-semibold">{currentLanguage.name}</span>
        <span className="sm:hidden text-base">{currentLanguage.flag}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl z-50 animate-scale-in overflow-hidden">
          <div className="py-2">
            {languages.map((language, index) => (
              <a
                key={language.code}
                href={getLocalizedPath(language.code)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${language.code === currentLocale
                  ? 'bg-ocean-50 text-ocean-700 font-semibold border-r-2 border-ocean-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {language.code === currentLocale && (
                  <div className="w-2 h-2 bg-ocean-500 rounded-full animate-pulse-soft"></div>
                )}
              </a>
            ))}
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-ocean-500 via-golden-500 to-sunset-500"></div>
        </div>
      )}
    </div>
  )
}