import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import {
  SHOWCASE_LAYERS,
  SHOWCASE_STACK,
} from '../../constants/showcase-content.constants'
import { Pill, SectionLead, SectionShell, UnderHood } from '../ShowcaseSection'

export function ArchitectureSection() {
  const { t } = useTranslation()

  return (
    <SectionShell id="architecture">
      <SectionLead
        titleId="architecture-title"
        title={t('showcase.architecture.title')}
        lead={t('showcase.architecture.lead')}
      />

      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
        {t('showcase.architecture.layersCaption')}
      </p>
      <ol className="flex flex-col gap-2">
        {SHOWCASE_LAYERS.map((layer, index) => (
          <Fragment key={layer.name}>
            {index > 0 ? (
              <i
                className="pi pi-angle-down self-center text-text-secondary"
                aria-hidden="true"
              />
            ) : null}
            <li className="flex flex-col gap-2 rounded-lg border border-surface-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-32 shrink-0 rounded-md border border-surface-border bg-surface-50 px-2 py-1 text-center font-mono text-sm text-text">
                {layer.name}
              </span>
              <span className="text-sm text-text-secondary">
                {t(layer.descriptionKey)}
              </span>
            </li>
          </Fragment>
        ))}
      </ol>
      <p className="mt-3 text-sm text-text-secondary">
        {t('showcase.architecture.layersNote')}
      </p>

      <p className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-text-secondary">
        {t('showcase.architecture.stackCaption')}
      </p>
      <div className="flex flex-wrap gap-2">
        {SHOWCASE_STACK.map((tech) => (
          <Pill key={tech}>{tech}</Pill>
        ))}
      </div>

      <UnderHood>{t('showcase.architecture.underHood')}</UnderHood>
    </SectionShell>
  )
}
