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
  const { t, i18n } = useTranslation()

  const passThrough = {
    column: {
      filterMenuButton: { 'aria-label': t('filters.aria.menu') },
      filterOperatorDropdown: { input: { 'aria-label': t('filters.aria.operator') } },
      filterMatchModeDropdown: {
        input: { 'aria-label': t('filters.aria.constraint') },
      },
    },
  }

  return (
    <PrimeReactProvider
      value={{
        ...primeReactConfig,
        locale: toPrimeReactLocale(i18n.language),
        pt: passThrough,
      }}
    >
      <PrimeReactLocaleBridge language={i18n.language} />
      {children}
    </PrimeReactProvider>
  )
}
