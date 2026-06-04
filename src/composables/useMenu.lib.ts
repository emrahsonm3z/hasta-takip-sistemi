import type { TranslationKey } from '@/types/i18n.types'

export interface MenuSource {
  key: string
  titleKey: TranslationKey
  path: string
  icon: string
  menuOrder: number
  sectionKey: TranslationKey
  sectionOrder: number
}

export interface MenuItem {
  key: string
  label: string
  path: string
  icon: string
}

export interface MenuGroup {
  key: string
  label: string
  items: MenuItem[]
}

export function buildMenu(
  sources: MenuSource[],
  translate: (key: TranslationKey) => string,
): MenuGroup[] {
  const sections = new Map<
    TranslationKey,
    { sectionOrder: number; sources: MenuSource[] }
  >()

  for (const source of sources) {
    const existing = sections.get(source.sectionKey)
    if (existing) {
      existing.sources.push(source)
    } else {
      sections.set(source.sectionKey, {
        sectionOrder: source.sectionOrder,
        sources: [source],
      })
    }
  }

  return [...sections.entries()]
    .sort((first, second) => first[1].sectionOrder - second[1].sectionOrder)
    .map(([sectionKey, section]) => ({
      key: sectionKey,
      label: translate(sectionKey),
      items: [...section.sources]
        .sort((first, second) => first.menuOrder - second.menuOrder)
        .map((source) => ({
          key: source.key,
          label: translate(source.titleKey),
          path: source.path,
          icon: source.icon,
        })),
    }))
}
