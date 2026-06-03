import assert from 'node:assert/strict'
import test from 'node:test'

import {
  applyThemeMode,
  resolveThemeMode,
  THEME_STORAGE_KEY,
} from '../../plugins/theme.lib.ts'

test('resolveThemeMode returns dark only for the dark value, light otherwise', () => {
  assert.equal(resolveThemeMode('dark'), 'dark')
  assert.equal(resolveThemeMode('light'), 'light')
  assert.equal(resolveThemeMode(null), 'light')
  assert.equal(resolveThemeMode('garbage'), 'light')
})

function createDeps() {
  const link = { href: '' }
  const classes = new Set<string>()
  const store = new Map<string, string>()
  return {
    link,
    classes,
    store,
    deps: {
      linkElement: {
        setAttribute(name: string, value: string) {
          if (name === 'href') link.href = value
        },
      },
      root: {
        classList: {
          toggle(token: string, force: boolean) {
            if (force) classes.add(token)
            else classes.delete(token)
          },
        },
      },
      storage: {
        setItem(key: string, value: string) {
          store.set(key, value)
        },
      },
      hrefForMode: (mode: 'light' | 'dark') => `/themes/${mode}.css`,
    },
  }
}

test('applyThemeMode dark: sets dark href, adds dark class, persists dark', () => {
  const { link, classes, store, deps } = createDeps()
  applyThemeMode('dark', deps)
  assert.equal(link.href, '/themes/dark.css')
  assert.equal(classes.has('dark'), true)
  assert.equal(store.get(THEME_STORAGE_KEY), 'dark')
})

test('applyThemeMode light: sets light href, removes dark class, persists light', () => {
  const { link, classes, store, deps } = createDeps()
  classes.add('dark')
  applyThemeMode('light', deps)
  assert.equal(link.href, '/themes/light.css')
  assert.equal(classes.has('dark'), false)
  assert.equal(store.get(THEME_STORAGE_KEY), 'light')
})

test('applyThemeMode tolerates a missing link element', () => {
  const { deps } = createDeps()
  assert.doesNotThrow(() => applyThemeMode('dark', { ...deps, linkElement: null }))
})
