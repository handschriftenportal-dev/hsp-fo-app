import { WebModuleLanguage } from 'hsp-web-module'
import i18n, { InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next, useTranslation } from 'react-i18next'

import de from '../../locales/de/app.json'
import en from '../../locales/en/app.json'

export function initI18n(
  options?: Partial<InitOptions> & { doNotTranslate?: boolean },
) {
  i18n.on('languageChanged', (lng: string) => {
    document.documentElement.setAttribute('lang', lng)
  })

  // In this case i18next renders the keys instead of the translations.
  // Useful for testing.
  if (options?.doNotTranslate) {
    return i18n.use(initReactI18next).init({
      lng: 'none',
      fallbackLng: 'none',
      resources: {
        none: { translation: {} },
      },
      ...options,
    })
  }

  return i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'de',
      resources: {
        de: { translation: de },
        en: { translation: en },
      },
      detection: {
        caches: ['cookie'],
      },
      ...options,
    })
}

export { i18n, useTranslation }

// Assumes that the language code passed to that function
// is in BCP 47 format (e.g. "en", "en-US", "en-us").
//
// See: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
export function getWebModuleLanguage(code: string): WebModuleLanguage {
  const langs: WebModuleLanguage[] = ['de', 'en']
  const lower = code.toLowerCase()
  return (
    langs.find((lang) => lower === lang) ||
    langs.find((lang) => lower.startsWith(lang + '-')) ||
    'de'
  )
}
