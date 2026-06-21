import type { TranslationKey } from '@/types/i18n.types'

export interface ShowcaseFeature {
  icon: string
  titleKey: TranslationKey
  descriptionKey: TranslationKey
}

export const SHOWCASE_FEATURES: ShowcaseFeature[] = [
  {
    icon: 'pi pi-list',
    titleKey: 'showcase.features.items.list.title',
    descriptionKey: 'showcase.features.items.list.description',
  },
  {
    icon: 'pi pi-pencil',
    titleKey: 'showcase.features.items.records.title',
    descriptionKey: 'showcase.features.items.records.description',
  },
  {
    icon: 'pi pi-globe',
    titleKey: 'showcase.features.items.bilingual.title',
    descriptionKey: 'showcase.features.items.bilingual.description',
  },
  {
    icon: 'pi pi-moon',
    titleKey: 'showcase.features.items.theme.title',
    descriptionKey: 'showcase.features.items.theme.description',
  },
  {
    icon: 'pi pi-book',
    titleKey: 'showcase.features.items.docs.title',
    descriptionKey: 'showcase.features.items.docs.description',
  },
  {
    icon: 'pi pi-shield',
    titleKey: 'showcase.features.items.monitoring.title',
    descriptionKey: 'showcase.features.items.monitoring.description',
  },
]

export interface ShowcaseLayer {
  name: string
  descriptionKey: TranslationKey
}

export const SHOWCASE_LAYERS: ShowcaseLayer[] = [
  { name: 'api', descriptionKey: 'showcase.architecture.layers.api' },
  { name: 'models', descriptionKey: 'showcase.architecture.layers.models' },
  { name: 'lib', descriptionKey: 'showcase.architecture.layers.lib' },
  {
    name: 'composables',
    descriptionKey: 'showcase.architecture.layers.composables',
  },
  {
    name: 'components',
    descriptionKey: 'showcase.architecture.layers.components',
  },
]

export const SHOWCASE_STACK = [
  'React 18',
  'TypeScript 6',
  'Vite 8',
  'React Router 7',
  'PrimeReact 10.9.8',
  'Tailwind 3.4',
  'React Query 5',
  'Vercel',
] as const

export interface ShowcaseBadge {
  icon: string
  labelKey: TranslationKey
}

export const SHOWCASE_QUALITY_BADGES: ShowcaseBadge[] = [
  { icon: 'pi pi-code', labelKey: 'showcase.quality.badges.strict' },
  { icon: 'pi pi-verified', labelKey: 'showcase.quality.badges.lint' },
  { icon: 'pi pi-comment', labelKey: 'showcase.quality.badges.noComments' },
  { icon: 'pi pi-check-circle', labelKey: 'showcase.quality.badges.tests' },
  { icon: 'pi pi-language', labelKey: 'showcase.quality.badges.parity' },
  { icon: 'pi pi-eye', labelKey: 'showcase.quality.badges.a11y' },
  { icon: 'pi pi-palette', labelKey: 'showcase.quality.badges.contrast' },
]

export interface ShowcaseStep {
  icon: string
  labelKey: TranslationKey
}

export const SHOWCASE_PIPELINE: ShowcaseStep[] = [
  { icon: 'pi pi-code', labelKey: 'showcase.devops.steps.commit' },
  { icon: 'pi pi-shield', labelKey: 'showcase.devops.steps.ci' },
  { icon: 'pi pi-users', labelKey: 'showcase.devops.steps.review' },
  { icon: 'pi pi-cloud-upload', labelKey: 'showcase.devops.steps.deploy' },
  { icon: 'pi pi-tag', labelKey: 'showcase.devops.steps.release' },
]
