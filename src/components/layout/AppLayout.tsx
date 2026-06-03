import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom'

import { getRouteHandle } from '@/lib/route'

export function AppLayout() {
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
    <>
      <main className="min-h-screen bg-ground p-6 text-text">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
