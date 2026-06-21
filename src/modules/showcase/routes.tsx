import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import type { AppRouteHandle } from '@/types/route.types'

import { ShowcaseLayout } from './components/ShowcaseLayout'

const ShowcasePage = lazy(() => import('./pages/ShowcasePage'))

export const SHOWCASE_ROUTES = {
  HOME: {
    name: 'showcase',
    path: '/',
    titleKey: 'showcase.meta.title',
  },
  LEGACY: {
    name: 'showcase-legacy',
    path: '/showcase',
  },
} as const

export const showcaseRoutes: RouteObject[] = [
  {
    path: SHOWCASE_ROUTES.HOME.path,
    element: <ShowcaseLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <ShowcasePage />,
        handle: {
          titleKey: SHOWCASE_ROUTES.HOME.titleKey,
        } satisfies AppRouteHandle,
      },
    ],
  },
  {
    path: SHOWCASE_ROUTES.LEGACY.path,
    element: <Navigate to={SHOWCASE_ROUTES.HOME.path} replace />,
  },
]
