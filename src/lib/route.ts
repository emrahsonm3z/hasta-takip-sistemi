import type { UIMatch } from 'react-router-dom'

import type { AppRouteHandle } from '@/types/route.types'

export function getRouteHandle(match: UIMatch): AppRouteHandle | undefined {
  const { handle } = match
  if (handle !== null && typeof handle === 'object' && 'titleKey' in handle) {
    return handle as AppRouteHandle
  }
  return undefined
}
