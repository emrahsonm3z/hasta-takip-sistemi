import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom'

import { getRouteHandle } from '@/lib/route'

import { AppSidebar } from './AppSidebar'
import { AppTopbar } from './AppTopbar'

export function AppLayout() {
  const { t } = useTranslation()
  const matches = useMatches()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const active = [...matches].reverse().find((match) => getRouteHandle(match))
  const handle = active ? getRouteHandle(active) : undefined
  const title = handle ? (handle.title ? handle.title(active!) : t(handle.titleKey)) : ''

  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  return (
    <div className="flex min-h-screen bg-ground text-text">
      <AppSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar title={title} onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  )
}
