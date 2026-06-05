import type { TranslationKey } from '@/types/i18n.types'

export interface MenuChildSource {
  key: string
  titleKey: TranslationKey
  path: string
  icon: string
  menuOrder: number
  subsectionKey?: TranslationKey
}

export interface MenuSource extends MenuChildSource {
  sectionKey: TranslationKey
  sectionOrder: number
  children?: MenuChildSource[]
}

export interface MenuItem {
  key: string
  label: string
  path: string
  icon: string
  sectionLabel?: string
  children?: MenuItem[]
}

export interface MenuGroup {
  key: string
  label: string
  items: MenuItem[]
}

const toMenuItem = (
  source: MenuChildSource,
  translate: (key: TranslationKey) => string,
): MenuItem => ({
  key: source.key,
  label: translate(source.titleKey),
  path: source.path,
  icon: source.icon,
  ...(source.subsectionKey ? { sectionLabel: translate(source.subsectionKey) } : {}),
})

const toMenuItemWithChildren = (
  source: MenuSource,
  translate: (key: TranslationKey) => string,
): MenuItem => {
  const item = toMenuItem(source, translate)
  if (!source.children?.length) {
    return item
  }
  return {
    ...item,
    children: [...source.children]
      .sort((first, second) => first.menuOrder - second.menuOrder)
      .map((child) => toMenuItem(child, translate)),
  }
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
        .map((source) => toMenuItemWithChildren(source, translate)),
    }))
}
