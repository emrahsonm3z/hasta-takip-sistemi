import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import { setDayjsLocale } from './dayjs'
import { setPrimeReactLocale } from './primereact'

export const DEFAULT_LANGUAGE = 'tr'
export const FALLBACK_LANGUAGE = 'en'

const resources = {
  tr: {
    translation: {
      errors: {
        config: {
          title: 'Yapılandırma hatası',
          message:
            'Uygulama gerekli yapılandırmadan yoksun. Lütfen sistem yöneticinizle iletişime geçin.',
        },
      },
    },
  },
  en: {
    translation: {
      errors: {
        config: {
          title: 'Configuration error',
          message:
            'The application is missing required configuration. Please contact your administrator.',
        },
      },
    },
  },
}

function syncLanguageCompanions(language: string): void {
  const base = language.split('-')[0]
  setPrimeReactLocale(base)
  setDayjsLocale(base)
  if (typeof document !== 'undefined') {
    document.documentElement.lang = base
  }
}

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
})

i18n.on('languageChanged', syncLanguageCompanions)
syncLanguageCompanions(i18n.language || DEFAULT_LANGUAGE)

export default i18n
