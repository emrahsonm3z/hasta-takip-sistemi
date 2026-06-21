import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { DOCS_ROUTES } from '@/modules/docs'
import { PATIENT_ROUTES } from '@/modules/patients'

import { SHOWCASE_GITHUB_URL } from '../../constants/showcase.constants'
import { SectionShell } from '../ShowcaseSection'

export function ClosingSection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="closing">
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <h2
          id="closing-title"
          className="max-w-2xl text-3xl font-bold tracking-tight text-text sm:text-4xl"
        >
          {t('showcase.closing.title')}
        </h2>
        <p className="max-w-xl text-lg text-text-secondary">
          {t('showcase.closing.lead')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
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
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-50 px-3 py-1 text-sm text-text-secondary">
          <i className="pi pi-tag" aria-hidden="true" />
          {t('showcase.closing.version')} {__APP_VERSION__}
        </p>
      </div>
    </SectionShell>
  )
}
