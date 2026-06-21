import { useTranslation } from 'react-i18next'

import { SHOWCASE_QUALITY_BADGES } from '../../constants/showcase-content.constants'
import { SectionLead, SectionShell, UnderHood } from '../ShowcaseSection'

export function QualitySection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="quality">
      <SectionLead
        titleId="quality-title"
        title={t('showcase.quality.title')}
        lead={t('showcase.quality.lead')}
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {SHOWCASE_QUALITY_BADGES.map((badge) => (
          <li
            key={badge.labelKey}
            className="flex items-center gap-3 rounded-xl border border-surface-border bg-card px-4 py-3"
          >
            <i className={`${badge.icon} text-lg text-primary`} aria-hidden="true" />
            <span className="text-sm font-medium text-text">{t(badge.labelKey)}</span>
          </li>
        ))}
      </ul>
      <UnderHood>{t('showcase.quality.underHood')}</UnderHood>
    </SectionShell>
  )
}
