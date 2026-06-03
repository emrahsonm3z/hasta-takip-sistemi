import { useTranslation } from 'react-i18next'

import { docsRegistry } from '@/modules/docs'
import { PATIENT_ROUTES } from '@/modules/patients'

import { buildMenu, type MenuItem, type MenuSource } from './useMenu.lib'

function menuSources(): MenuSource[] {
  return [
    {
      key: PATIENT_ROUTES.LIST.name,
      titleKey: PATIENT_ROUTES.LIST.titleKey,
      path: PATIENT_ROUTES.LIST.path,
      icon: PATIENT_ROUTES.LIST.icon,
      menuOrder: PATIENT_ROUTES.LIST.menuOrder,
    },
    ...docsRegistry.map((entry) => ({
      key: entry.slug,
      titleKey: entry.titleKey,
      path: entry.path,
      icon: entry.icon,
      menuOrder: entry.menuOrder,
    })),
  ]
}

export function useMenu(): MenuItem[] {
  const { t } = useTranslation()
  return buildMenu(menuSources(), (key) => t(key))
}
