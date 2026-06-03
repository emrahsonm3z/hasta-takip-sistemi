import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'

import DevDemoPage from '@/components/_dev/DevDemoPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { NotFound } from '@/components/NotFound'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'
import { docsRoutes } from '@/modules/docs'
import { PATIENT_ROUTES, patientRoutes } from '@/modules/patients'

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [{ path: '/dev', element: <DevDemoPage /> }]
  : []

const children: RouteObject[] = [
  { index: true, element: <Navigate to={PATIENT_ROUTES.LIST.path} replace /> },
  ...patientRoutes,
  ...docsRoutes,
  ...devRoutes,
  { path: '*', element: <NotFound /> },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children,
  },
])
