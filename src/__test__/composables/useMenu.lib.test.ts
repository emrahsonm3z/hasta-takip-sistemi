import assert from 'node:assert/strict'
import test from 'node:test'

import type { TranslationKey } from '@/types/i18n.types'

import { buildMenu, type MenuSource } from '../../composables/useMenu.lib.ts'

const translate = (key: TranslationKey): string => {
  const labels: Partial<Record<TranslationKey, string>> = {
    'patients.title': 'Hastalar',
    'docs.title': 'Dokümanlar',
    'menu.section.general': 'Genel',
    'common.actions': 'İşlemler',
  }
  return labels[key] ?? key
}

test('buildMenu groups a section, sorts its items by menuOrder, resolves labels', () => {
  const sources: MenuSource[] = [
    {
      key: 'docs',
      titleKey: 'docs.title',
      path: '/docs',
      icon: 'pi pi-book',
      menuOrder: 2,
      sectionKey: 'menu.section.general',
      sectionOrder: 1,
    },
    {
      key: 'patients',
      titleKey: 'patients.title',
      path: '/patients',
      icon: 'pi pi-users',
      menuOrder: 1,
      sectionKey: 'menu.section.general',
      sectionOrder: 1,
    },
  ]

  const groups = buildMenu(sources, translate)

  assert.equal(groups.length, 1)
  assert.equal(groups[0].key, 'menu.section.general')
  assert.equal(groups[0].label, 'Genel')
  assert.deepEqual(
    groups[0].items.map((item) => item.key),
    ['patients', 'docs'],
  )
  assert.equal(groups[0].items[0].label, 'Hastalar')
  assert.equal(groups[0].items[1].label, 'Dokümanlar')
})

test('buildMenu orders sections by sectionOrder', () => {
  const sources: MenuSource[] = [
    {
      key: 'docs',
      titleKey: 'docs.title',
      path: '/docs',
      icon: 'pi pi-book',
      menuOrder: 1,
      sectionKey: 'common.actions',
      sectionOrder: 2,
    },
    {
      key: 'patients',
      titleKey: 'patients.title',
      path: '/patients',
      icon: 'pi pi-users',
      menuOrder: 1,
      sectionKey: 'menu.section.general',
      sectionOrder: 1,
    },
  ]

  const groups = buildMenu(sources, translate)

  assert.deepEqual(
    groups.map((group) => group.key),
    ['menu.section.general', 'common.actions'],
  )
  assert.deepEqual(
    groups.map((group) => group.items.map((item) => item.key)),
    [['patients'], ['docs']],
  )
})
