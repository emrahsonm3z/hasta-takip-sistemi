import type { RouteObject } from 'react-router-dom'

import type { AppRouteHandle } from '@/types/route.types'

import PatientsPage from './pages/PatientsPage'

export const PATIENT_ROUTES = {
  LIST: {
    name: 'patients',
    path: '/patients',
    titleKey: 'patients.title',
    icon: 'pi pi-users',
    menuOrder: 1,
  },
} as const

export const patientRoutes: RouteObject[] = [
  {
    path: PATIENT_ROUTES.LIST.path,
    element: <PatientsPage />,
    handle: { titleKey: PATIENT_ROUTES.LIST.titleKey } satisfies AppRouteHandle,
  },
]
