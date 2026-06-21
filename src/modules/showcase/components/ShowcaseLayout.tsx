import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom'

import { Loading } from '@/components/Loading'
import { getRouteHandle } from '@/lib/route'

import { ShowcaseTopbar } from './ShowcaseTopbar'

export function ShowcaseLayout() {
  const { t } = useTranslation()
  const matches = useMatches()

  const active = [...matches].reverse().find((match) => getRouteHandle(match))
  const handle = active ? getRouteHandle(active) : undefined
  const title = handle ? (handle.title ? handle.title(active!) : t(handle.titleKey)) : ''

  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  return (
    <div className="min-h-screen bg-app-ground text-text">
      <ShowcaseTopbar />
      <main>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <ScrollRestoration />
    </div>
  )
}
