export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme-mode'
export const THEME_LINK_ID = 'app-theme'

export function resolveThemeMode(stored: string | null): ThemeMode {
  return stored === 'dark' ? 'dark' : 'light'
}

interface ThemeTarget {
  linkElement: { setAttribute(name: string, value: string): void } | null
  root: { classList: { toggle(token: string, force: boolean): void } }
  storage: { setItem(key: string, value: string): void }
  hrefForMode: (mode: ThemeMode) => string
}

export function applyThemeMode(mode: ThemeMode, target: ThemeTarget): void {
  target.linkElement?.setAttribute('href', target.hrefForMode(mode))
  target.root.classList.toggle('dark', mode === 'dark')
  target.storage.setItem(THEME_STORAGE_KEY, mode)
}
