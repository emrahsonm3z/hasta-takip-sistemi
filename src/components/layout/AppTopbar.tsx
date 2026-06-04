import { useTranslation } from 'react-i18next'
import { Button } from 'primereact/button'

import { AppLanguageSwitcher } from './AppLanguageSwitcher'
import { AppThemeToggle } from './AppThemeToggle'

interface AppTopbarProps {
  title: string
  onMenuToggle: () => void
}

export function AppTopbar({ title, onMenuToggle }: AppTopbarProps) {
  const { t } = useTranslation()

  return (
    <header className="l-topbar">
      <div className="l-topbar-start">
        <Button
          icon="pi pi-bars"
          text
          rounded
          aria-label={t('common.menu')}
          onClick={onMenuToggle}
          pt={{
            root: { className: 'l-topbar-iconbtn h-10 w-10' },
            icon: { className: 'text-xl' },
          }}
        />
        <h1 className="truncate text-lg font-semibold text-text">{title}</h1>
      </div>
      <div className="l-topbar-actions">
        <AppLanguageSwitcher />
        <AppThemeToggle />
      </div>
    </header>
  )
}
