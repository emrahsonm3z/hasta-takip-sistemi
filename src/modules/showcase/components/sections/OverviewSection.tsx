import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { DOCS_ROUTES } from '@/modules/docs'
import { PATIENT_ROUTES } from '@/modules/patients'

import { SHOWCASE_GITHUB_URL } from '../../constants/showcase.constants'
import { SectionShell } from '../ShowcaseSection'

export function OverviewSection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="overview">
      <div className="flex flex-col gap-6 py-8 lg:py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {t('showcase.hero.eyebrow')}
        </p>
        <h1
          id="overview-title"
          className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl"
        >
          {t('showcase.hero.title')}
        </h1>
        <p className="max-w-2xl text-lg text-text-secondary">
          {t('showcase.hero.subtitle')}
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            to={PATIENT_ROUTES.LIST.path}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-text transition-opacity hover:opacity-90"
          >
            <i className="pi pi-arrow-right text-xs" aria-hidden="true" />
            {t('showcase.cta.demo')}
          </Link>
          <a
            href={SHOWCASE_GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-surface-100"
          >
            <i className="pi pi-github text-base" aria-hidden="true" />
            {t('showcase.cta.github')}
          </a>
          <Link
            to={DOCS_ROUTES.OVERVIEW.path}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
          >
            <i className="pi pi-book text-base" aria-hidden="true" />
            {t('showcase.cta.docs')}
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}
