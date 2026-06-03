import type { TranslationKey } from '@/types/i18n.types'

export interface MenuSource {
  key: string
  titleKey: TranslationKey
  path: string
  icon: string
  menuOrder: number
}

export interface MenuItem {
  key: string
  label: string
  path: string
  icon: string
}

export function buildMenu(
  sources: MenuSource[],
  translate: (key: TranslationKey) => string,
): MenuItem[] {
  return [...sources]
    .sort((a, b) => a.menuOrder - b.menuOrder)
    .map((source) => ({
      key: source.key,
      label: translate(source.titleKey),
      path: source.path,
      icon: source.icon,
    }))
}
