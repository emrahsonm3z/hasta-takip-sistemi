import type { TranslationKey } from '@/types/i18n.types'

export interface DocEntry {
  slug: string
  titleKey: TranslationKey
  path: string
  icon: string
  menuOrder: number
}

export const docsRegistry: DocEntry[] = [
  {
    slug: 'overview',
    titleKey: 'docs.title',
    path: '/docs',
    icon: 'pi pi-book',
    menuOrder: 2,
  },
]
