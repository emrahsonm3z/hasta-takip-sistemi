import { useTranslation } from 'react-i18next'

import { ShowcaseDataPreview } from '../ShowcaseDataPreview'
import { SectionLead, SectionShell, UnderHood } from '../ShowcaseSection'

export function PreviewSection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="preview">
      <SectionLead
        titleId="preview-title"
        title={t('showcase.preview.title')}
        lead={t('showcase.preview.lead')}
      />
      <ShowcaseDataPreview />
      <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
        <i className="pi pi-info-circle shrink-0" aria-hidden="true" />
        {t('showcase.preview.disclaimer')}
      </p>
      <UnderHood>{t('showcase.preview.underHood')}</UnderHood>
    </SectionShell>
  )
}
