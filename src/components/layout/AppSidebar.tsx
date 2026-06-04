import { NavLink } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar'

import { useMenu } from '@/composables/useMenu'

import { AppLogo } from './AppLogo'

interface AppSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const groups = useMenu()

  return (
    <>
      <div className="l-sidebar-brand">
        <AppLogo />
      </div>
      <nav className="l-sidebar-nav">
        {groups.map((group) => (
          <div key={group.key} className="l-sidebar-group">
            <p className="l-sidebar-section">{group.label}</p>
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `l-sidebar-item${isActive ? ' is-active' : ''}`
                }
              >
                <i className={item.icon} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </>
  )
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  return (
    <>
      <aside className="l-sidebar l-sidebar-fixed hidden lg:flex">
        <SidebarContent />
      </aside>
      <Sidebar
        visible={mobileOpen}
        onHide={onMobileClose}
        showCloseIcon
        className="lg:hidden"
        pt={{
          root: { className: 'l-sidebar-drawer w-sidebar max-w-[85vw]' },
          content: { className: 'p-0' },
        }}
      >
        <div className="l-sidebar">
          <SidebarContent onNavigate={onMobileClose} />
        </div>
      </Sidebar>
    </>
  )
}
