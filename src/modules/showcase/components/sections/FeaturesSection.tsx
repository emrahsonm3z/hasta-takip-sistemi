import { useTranslation } from 'react-i18next'

import { SHOWCASE_FEATURES } from '../../constants/showcase-content.constants'
import { SectionLead, SectionShell, UnderHood } from '../ShowcaseSection'

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="features">
      <SectionLead
        titleId="features-title"
        title={t('showcase.features.title')}
        lead={t('showcase.features.lead')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHOWCASE_FEATURES.map((feature) => (
          <div
            key={feature.titleKey}
            className="flex flex-col gap-2 rounded-xl border border-surface-border bg-card p-5"
          >
            <i className={`${feature.icon} text-2xl text-primary`} aria-hidden="true" />
            <h3 className="text-base font-semibold text-text">{t(feature.titleKey)}</h3>
            <p className="text-sm text-text-secondary">{t(feature.descriptionKey)}</p>
          </div>
        ))}
      </div>
      <UnderHood>{t('showcase.features.underHood')}</UnderHood>
    </SectionShell>
  )
}
