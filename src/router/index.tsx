import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import { NotFound } from '@/components/NotFound'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { docsRoutes } from '@/modules/docs'
import { patientRoutes } from '@/modules/patients'
import { showcaseRoutes } from '@/modules/showcase'

const appChildren: RouteObject[] = [
  ...patientRoutes,
  ...docsRoutes,
  { path: '*', element: <NotFound /> },
]

export const router = createBrowserRouter([
  ...showcaseRoutes,
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: appChildren,
  },
])
