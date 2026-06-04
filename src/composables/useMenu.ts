import { useTranslation } from 'react-i18next'

import { docsRegistry } from '@/modules/docs'
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
    ...docsRegistry.map((entry) => ({
      key: entry.slug,
      titleKey: entry.titleKey,
      path: entry.path,
      icon: entry.icon,
      menuOrder: entry.menuOrder,
      sectionKey: GENERAL_SECTION_KEY,
      sectionOrder: GENERAL_SECTION_ORDER,
    })),
  ]
}

export function useMenu(): MenuGroup[] {
  const { t } = useTranslation()
  return buildMenu(menuSources(), (key) => t(key))
}
