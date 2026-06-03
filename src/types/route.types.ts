import type { UIMatch } from 'react-router-dom'

import type { TranslationKey } from '@/types/i18n.types'

export interface AppRouteHandle {
  titleKey: TranslationKey
  title?: (match: UIMatch) => string
}
