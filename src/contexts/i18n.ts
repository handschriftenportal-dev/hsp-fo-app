/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { WebModuleLanguage } from 'hsp-web-module'
import i18n, { InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next, useTranslation } from 'react-i18next'
import de from '../../locales/de/app.json'
import en from '../../locales/en/app.json'

export function initI18n(
  options?: Partial<InitOptions> & { doNotTranslate?: boolean }
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
