import { type ReactNode, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  locale as setPrimeReactGlobalLocale,
  PrimeReactContext,
  PrimeReactProvider,
} from 'primereact/api'

import { primeReactConfig } from '@/plugins/primereact'

function toPrimeReactLocale(language: string): string {
  return language.split('-')[0] === 'tr' ? 'tr' : 'en'
}

function PrimeReactLocaleBridge({ language }: { language: string }) {
  const context = useContext(PrimeReactContext)

  useEffect(() => {
    const nextLocale = toPrimeReactLocale(language)
    setPrimeReactGlobalLocale(nextLocale)
    context?.setLocale?.(nextLocale)
  }, [language, context])

  return null
}

export function AppPrimeReactProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()

  return (
    <PrimeReactProvider
      value={{ ...primeReactConfig, locale: toPrimeReactLocale(i18n.language) }}
    >
      <PrimeReactLocaleBridge language={i18n.language} />
      {children}
    </PrimeReactProvider>
  )
}
