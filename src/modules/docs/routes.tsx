import type { RouteObject } from 'react-router-dom'

import type { AppRouteHandle } from '@/types/route.types'

import DocsOverviewPage from './pages/DocsOverviewPage'

export const DOCS_ROUTES = {
  OVERVIEW: {
    name: 'docs',
    path: '/docs',
    titleKey: 'docs.title',
    icon: 'pi pi-book',
    menuOrder: 2,
  },
} as const

export const docsRoutes: RouteObject[] = [
  {
    path: DOCS_ROUTES.OVERVIEW.path,
    element: <DocsOverviewPage />,
    handle: { titleKey: DOCS_ROUTES.OVERVIEW.titleKey } satisfies AppRouteHandle,
  },
]
