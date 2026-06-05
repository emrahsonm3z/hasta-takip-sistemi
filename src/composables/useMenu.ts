import { useTranslation } from 'react-i18next'

import { DOCS_ROUTES, docsRegistry } from '@/modules/docs'
import { PATIENT_ROUTES } from '@/modules/patients'
import type { TranslationKey } from '@/types/i18n.types'

import { buildMenu, type MenuGroup, type MenuSource } from './useMenu.lib'

const GENERAL_SECTION_KEY: TranslationKey = 'menu.section.general'
const GENERAL_SECTION_ORDER = 1

function menuSources(): MenuSource[] {
  return [
    {
      key: PATIENT_ROUTES.LIST.name,
      titleKey: PATIENT_ROUTES.LIST.titleKey,
      path: PATIENT_ROUTES.LIST.path,
      icon: PATIENT_ROUTES.LIST.icon,
      menuOrder: PATIENT_ROUTES.LIST.menuOrder,
      sectionKey: GENERAL_SECTION_KEY,
      sectionOrder: GENERAL_SECTION_ORDER,
    },
    {
      key: DOCS_ROUTES.OVERVIEW.name,
      titleKey: DOCS_ROUTES.OVERVIEW.titleKey,
      path: DOCS_ROUTES.OVERVIEW.path,
      icon: DOCS_ROUTES.OVERVIEW.icon,
      menuOrder: DOCS_ROUTES.OVERVIEW.menuOrder,
      sectionKey: GENERAL_SECTION_KEY,
      sectionOrder: GENERAL_SECTION_ORDER,
      children: docsRegistry.map((entry) => ({
        key: entry.slug,
        titleKey: entry.titleKey,
        path: DOCS_ROUTES.VIEWER.build(entry.slug),
        icon: entry.icon,
        menuOrder: entry.order,
      })),
    },
  ]
}

export function useMenu(): MenuGroup[] {
  const { t } = useTranslation()
  return buildMenu(menuSources(), (key) => t(key))
}
