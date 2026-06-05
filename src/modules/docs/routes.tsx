import { lazy } from 'react'
import type { RouteObject, UIMatch } from 'react-router-dom'

import i18n from '@/plugins/i18n'
import type { AppRouteHandle } from '@/types/route.types'

import { docsRegistry } from './constants/docs-registry'
import { findDocEntry } from './lib/doc-path'

const DocsOverviewPage = lazy(() => import('./pages/DocsOverviewPage'))
const DocViewerPage = lazy(() => import('./pages/DocViewerPage'))

export const DOCS_ROUTES = {
  OVERVIEW: {
    name: 'docs',
    path: '/docs',
    titleKey: 'docs.title',
    icon: 'pi pi-book',
    menuOrder: 2,
  },
  VIEWER: {
    name: 'docs-viewer',
    path: '/docs/:slug',
    titleKey: 'docs.title',
    build: (slug: string) => `/docs/${slug}`,
  },
} as const

const docTitle = (match: UIMatch): string => {
  const slug = match.params.slug
  const entry = slug ? findDocEntry(docsRegistry, slug) : undefined
  return entry ? i18n.t(entry.titleKey) : i18n.t('docs.title')
}

export const docsRoutes: RouteObject[] = [
  {
    path: DOCS_ROUTES.OVERVIEW.path,
    element: <DocsOverviewPage />,
    handle: { titleKey: DOCS_ROUTES.OVERVIEW.titleKey } satisfies AppRouteHandle,
  },
  {
    path: DOCS_ROUTES.VIEWER.path,
    element: <DocViewerPage />,
    handle: {
      titleKey: DOCS_ROUTES.VIEWER.titleKey,
      title: docTitle,
    } satisfies AppRouteHandle,
  },
]
