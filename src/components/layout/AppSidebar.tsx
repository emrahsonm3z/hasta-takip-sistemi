import { NavLink } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar'

import { useMenu } from '@/composables/useMenu'

interface AppSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const items = useMenu()

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => (
        <NavLink
          key={item.key}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded px-3 py-2 ${
              isActive
                ? 'bg-surface-200 font-medium text-primary'
                : 'text-text hover:bg-surface-100'
            }`
          }
        >
          <i className={item.icon} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-card md:block">
        <SidebarNav />
      </aside>
      <Sidebar visible={mobileOpen} onHide={onMobileClose}>
        <SidebarNav onNavigate={onMobileClose} />
      </Sidebar>
    </>
  )
}
