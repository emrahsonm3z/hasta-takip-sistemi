import { Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useMatches } from 'react-router-dom'

import { Loading } from '@/components/Loading'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { MEDIA } from '@/config/breakpoints'
import { getRouteHandle } from '@/lib/route'

import { AppSidebar } from './AppSidebar'
import { AppTopbar } from './AppTopbar'

export function AppLayout() {
  const { t } = useTranslation()
  const matches = useMatches()
  const location = useLocation()
  const isDesktop = useMediaQuery(MEDIA.minLg)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const contentScrollRef = useRef<HTMLElement>(null)

  const active = [...matches].reverse().find((match) => getRouteHandle(match))
  const handle = active ? getRouteHandle(active) : undefined
  const title = handle ? (handle.title ? handle.title(active!) : t(handle.titleKey)) : ''

  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  useEffect(() => {
    setMobileMenuOpen(false)
    contentScrollRef.current?.scrollTo({ top: 0 })
  }, [location.pathname])

  const handleMenuToggle = () => {
    if (isDesktop) {
      setSidebarCollapsed((collapsed) => !collapsed)
    } else {
      setMobileMenuOpen(true)
    }
  }

  return (
    <div
      className={`l-layout bg-app-ground text-text${sidebarCollapsed ? ' is-collapsed' : ''}`}
    >
      <AppSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="l-content p-8">
        <AppTopbar title={title} onMenuToggle={handleMenuToggle} />
        <main ref={contentScrollRef} className="l-content-scroll min-w-0 flex-1">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
