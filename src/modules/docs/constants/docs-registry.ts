import type { TranslationKey } from '@/types/i18n.types'

export interface DocEntry {
  slug: string
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  icon: string
  order: number
  paths: { en: string; tr: string }
}

export const docsRegistry: DocEntry[] = [
  {
    slug: 'architecture',
    titleKey: 'docs.doc.architecture.title',
    descriptionKey: 'docs.doc.architecture.description',
    icon: 'pi pi-sitemap',
    order: 1,
    paths: { en: '/docs/en/ARCHITECTURE.md', tr: '/docs/tr/ARCHITECTURE.md' },
  },
  {
    slug: 'components',
    titleKey: 'docs.doc.components.title',
    descriptionKey: 'docs.doc.components.description',
    icon: 'pi pi-th-large',
    order: 2,
    paths: { en: '/docs/en/COMPONENTS.md', tr: '/docs/tr/COMPONENTS.md' },
  },
  {
    slug: 'coding-standards',
    titleKey: 'docs.doc.codingStandards.title',
    descriptionKey: 'docs.doc.codingStandards.description',
    icon: 'pi pi-list-check',
    order: 3,
    paths: {
      en: '/docs/en/CODING_STANDARDS.md',
      tr: '/docs/tr/CODING_STANDARDS.md',
    },
  },
  {
    slug: 'styling',
    titleKey: 'docs.doc.styling.title',
    descriptionKey: 'docs.doc.styling.description',
    icon: 'pi pi-palette',
    order: 4,
    paths: { en: '/docs/en/STYLING.md', tr: '/docs/tr/STYLING.md' },
  },
  {
    slug: 'state-management',
    titleKey: 'docs.doc.stateManagement.title',
    descriptionKey: 'docs.doc.stateManagement.description',
    icon: 'pi pi-database',
    order: 5,
    paths: {
      en: '/docs/en/STATE_MANAGEMENT.md',
      tr: '/docs/tr/STATE_MANAGEMENT.md',
    },
  },
  {
    slug: 'i18n',
    titleKey: 'docs.doc.i18n.title',
    descriptionKey: 'docs.doc.i18n.description',
    icon: 'pi pi-globe',
    order: 6,
    paths: { en: '/docs/en/I18N.md', tr: '/docs/tr/I18N.md' },
  },
  {
    slug: 'testing',
    titleKey: 'docs.doc.testing.title',
    descriptionKey: 'docs.doc.testing.description',
    icon: 'pi pi-shield',
    order: 7,
    paths: { en: '/docs/en/TESTING.md', tr: '/docs/tr/TESTING.md' },
  },
  {
    slug: 'workflow',
    titleKey: 'docs.doc.workflow.title',
    descriptionKey: 'docs.doc.workflow.description',
    icon: 'pi pi-sync',
    order: 8,
    paths: { en: '/docs/en/WORKFLOW.md', tr: '/docs/tr/WORKFLOW.md' },
  },
  {
    slug: 'versioning',
    titleKey: 'docs.doc.versioning.title',
    descriptionKey: 'docs.doc.versioning.description',
    icon: 'pi pi-tag',
    order: 9,
    paths: { en: '/docs/en/VERSIONING.md', tr: '/docs/tr/VERSIONING.md' },
  },
  {
    slug: 'sprint-plan',
    titleKey: 'docs.doc.sprintPlan.title',
    descriptionKey: 'docs.doc.sprintPlan.description',
    icon: 'pi pi-flag',
    order: 10,
    paths: { en: '/docs/en/SPRINT_PLAN.md', tr: '/docs/tr/SPRINT_PLAN.md' },
  },
  {
    slug: 'changelog',
    titleKey: 'docs.doc.changelog.title',
    descriptionKey: 'docs.doc.changelog.description',
    icon: 'pi pi-history',
    order: 11,
    paths: { en: '/CHANGELOG.md', tr: '/CHANGELOG.md' },
  },
  {
    slug: 'module-patients',
    titleKey: 'docs.doc.modulePatients.title',
    descriptionKey: 'docs.doc.modulePatients.description',
    icon: 'pi pi-users',
    order: 12,
    paths: {
      en: '/docs/en/modules/PATIENTS.md',
      tr: '/docs/tr/modules/PATIENTS.md',
    },
  },
  {
    slug: 'module-docs',
    titleKey: 'docs.doc.moduleDocs.title',
    descriptionKey: 'docs.doc.moduleDocs.description',
    icon: 'pi pi-book',
    order: 13,
    paths: { en: '/docs/en/modules/DOCS.md', tr: '/docs/tr/modules/DOCS.md' },
  },
]
