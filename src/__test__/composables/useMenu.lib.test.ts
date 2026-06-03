import assert from 'node:assert/strict'
import test from 'node:test'

import type { TranslationKey } from '@/types/i18n.types'

import { buildMenu, type MenuSource } from '../../composables/useMenu.lib.ts'

const sources: MenuSource[] = [
  {
    key: 'docs',
    titleKey: 'docs.title',
    path: '/docs',
    icon: 'pi pi-book',
    menuOrder: 2,
  },
  {
    key: 'patients',
    titleKey: 'patients.title',
    path: '/patients',
    icon: 'pi pi-users',
    menuOrder: 1,
  },
]

const translate = (key: TranslationKey): string =>
  key === 'patients.title' ? 'Hastalar' : key === 'docs.title' ? 'Dokümanlar' : key

test('buildMenu sorts by menuOrder and resolves labels', () => {
  const items = buildMenu(sources, translate)
  assert.deepEqual(
    items.map((item) => item.key),
    ['patients', 'docs'],
  )
  assert.equal(items[0].label, 'Hastalar')
  assert.equal(items[1].label, 'Dokümanlar')
})
