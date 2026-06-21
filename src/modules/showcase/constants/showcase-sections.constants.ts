import type { TranslationKey } from '@/types/i18n.types'

export interface ShowcaseSection {
  id: string
  titleKey: TranslationKey
}

export const SHOWCASE_SECTIONS = [
  { id: 'overview', titleKey: 'showcase.nav.overview' },
  { id: 'features', titleKey: 'showcase.nav.features' },
  { id: 'preview', titleKey: 'showcase.nav.preview' },
  { id: 'architecture', titleKey: 'showcase.nav.architecture' },
  { id: 'quality', titleKey: 'showcase.nav.quality' },
  { id: 'devops', titleKey: 'showcase.nav.devops' },
  { id: 'closing', titleKey: 'showcase.nav.closing' },
] as const satisfies readonly ShowcaseSection[]

export const SHOWCASE_SECTION_IDS = SHOWCASE_SECTIONS.map((section) => section.id)
