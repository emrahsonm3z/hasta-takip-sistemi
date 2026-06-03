import darkThemeUrl from 'primereact/resources/themes/lara-dark-green/theme.css?url'
import lightThemeUrl from 'primereact/resources/themes/lara-light-green/theme.css?url'

import {
  applyThemeMode,
  resolveThemeMode,
  THEME_LINK_ID,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from './theme.lib'

function hrefForMode(mode: ThemeMode): string {
  return mode === 'dark' ? darkThemeUrl : lightThemeUrl
}

function getThemeTarget() {
  return {
    linkElement: document.getElementById(THEME_LINK_ID),
    root: document.documentElement,
    storage: window.localStorage,
    hrefForMode,
  }
}

export function getStoredThemeMode(): ThemeMode {
  return resolveThemeMode(window.localStorage.getItem(THEME_STORAGE_KEY))
}

export function applyTheme(): void {
  applyThemeMode(getStoredThemeMode(), getThemeTarget())
}

export function setThemeMode(mode: ThemeMode): void {
  applyThemeMode(mode, getThemeTarget())
}
