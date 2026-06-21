import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AppLanguageSwitcher } from '@/components/layout/AppLanguageSwitcher'
import { AppLogo } from '@/components/layout/AppLogo'
import { AppThemeToggle } from '@/components/layout/AppThemeToggle'
import { PATIENT_ROUTES } from '@/modules/patients'

import { SHOWCASE_GITHUB_URL } from '../constants/showcase.constants'

export function ShowcaseTopbar() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 border-b border-surface-border bg-app-ground">
      <div className="flex h-16 items-center justify-between px-6 sm:px-8">
        <Link
          to="/"
          aria-label={t('showcase.meta.title')}
          className="inline-flex items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <AppLogo />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to={PATIENT_ROUTES.LIST.path}
            aria-label={t('showcase.topbar.demo')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-text transition-opacity hover:opacity-90 md:px-4"
          >
            <i className="pi pi-arrow-right text-xs" aria-hidden="true" />
            <span className="hidden md:inline">{t('showcase.topbar.demo')}</span>
          </Link>
          <a
            href={SHOWCASE_GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t('showcase.topbar.github')}
            className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface-100 md:px-4"
          >
            <i className="pi pi-github text-base" aria-hidden="true" />
            <span className="hidden md:inline">{t('showcase.topbar.github')}</span>
          </a>
          <AppLanguageSwitcher />
          <AppThemeToggle />
        </nav>
      </div>
    </header>
  )
}
