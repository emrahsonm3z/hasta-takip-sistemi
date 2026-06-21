import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar'

import { useMenu } from '@/composables/useMenu'
import type { MenuItem } from '@/composables/useMenu.lib'

import { AppLogo } from './AppLogo'

interface AppSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

interface SidebarLeafLinkProps {
  item: MenuItem
  nested?: boolean
  onNavigate?: () => void
}

function SidebarLeafLink({ item, nested, onNavigate }: SidebarLeafLinkProps) {
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `l-sidebar-item${nested ? ' l-sidebar-subitem' : ''}${isActive ? ' is-active' : ''}`
      }
    >
      <i className={item.icon} aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  )
}

interface SidebarDisclosureProps {
  item: MenuItem
  onNavigate?: () => void
}

function SidebarDisclosure({ item, onNavigate }: SidebarDisclosureProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [override, setOverride] = useState<boolean | undefined>(undefined)

  const expanded = override ?? location.pathname.startsWith(item.path)
  const submenuId = `l-sidebar-submenu-${item.key}`

  return (
    <div>
      <div className="l-sidebar-row">
        <NavLink
          to={item.path}
          end
          onClick={onNavigate}
          className={({ isActive }) => `l-sidebar-item${isActive ? ' is-active' : ''}`}
        >
          <i className={item.icon} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
        <button
          type="button"
          className={`l-sidebar-chevron${expanded ? ' is-expanded' : ''}`}
          aria-expanded={expanded}
          aria-controls={submenuId}
          aria-label={t('menu.toggleSubmenu')}
          onClick={() => setOverride(!expanded)}
        >
          <i className="pi pi-chevron-down" aria-hidden="true" />
        </button>
      </div>
      {expanded ? (
        <div id={submenuId} className="l-sidebar-subnav">
          {item.children?.map((child, index) => {
            const previous = index > 0 ? item.children?.[index - 1] : undefined
            const startsNewSection =
              Boolean(child.sectionLabel) && child.sectionLabel !== previous?.sectionLabel
            return (
              <Fragment key={child.key}>
                {startsNewSection ? (
                  <p className="l-sidebar-section l-sidebar-subsection">
                    {child.sectionLabel}
                  </p>
                ) : null}
                <SidebarLeafLink item={child} nested onNavigate={onNavigate} />
              </Fragment>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()
  const groups = useMenu()

  return (
    <>
      <div className="l-sidebar-brand">
        <Link
          to="/"
          onClick={onNavigate}
          aria-label={t('common.homeBrand')}
          className="inline-flex items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <AppLogo />
        </Link>
      </div>
      <nav className="l-sidebar-nav">
        {groups.map((group) => (
          <div key={group.key} className="l-sidebar-group">
            <p className="l-sidebar-section">{group.label}</p>
            {group.items.map((item) =>
              item.children?.length ? (
                <SidebarDisclosure key={item.key} item={item} onNavigate={onNavigate} />
              ) : (
                <SidebarLeafLink key={item.key} item={item} onNavigate={onNavigate} />
              ),
            )}
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
