import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { SHOWCASE_PIPELINE } from '../../constants/showcase-content.constants'
import { SectionLead, SectionShell, UnderHood } from '../ShowcaseSection'

export function DevopsSection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="devops">
      <SectionLead
        titleId="devops-title"
        title={t('showcase.devops.title')}
        lead={t('showcase.devops.lead')}
      />
      <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {SHOWCASE_PIPELINE.map((step, index) => (
          <Fragment key={step.labelKey}>
            {index > 0 ? (
              <i
                className="pi pi-angle-right hidden text-text-secondary sm:inline"
                aria-hidden="true"
              />
            ) : null}
            <li className="flex items-center gap-2 rounded-lg border border-surface-border bg-card px-4 py-2 text-sm font-medium text-text">
              <i className={`${step.icon} text-primary`} aria-hidden="true" />
              {t(step.labelKey)}
            </li>
          </Fragment>
        ))}
      </ol>
      <p className="mt-6 flex items-start gap-2 text-sm text-text-secondary">
        <i className="pi pi-shield mt-0.5 shrink-0" aria-hidden="true" />
        {t('showcase.devops.sentryNote')}
      </p>
      <UnderHood>{t('showcase.devops.underHood')}</UnderHood>
    </SectionShell>
  )
}
