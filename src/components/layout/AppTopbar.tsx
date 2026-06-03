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
    <header className="flex items-center gap-3 border-b border-surface-border bg-card px-4 py-3">
      <Button
        icon="pi pi-bars"
        text
        rounded
        aria-label={t('common.menu')}
        onClick={onMenuToggle}
        className="md:hidden"
      />
      <h1 className="text-lg font-semibold text-text">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <AppLanguageSwitcher />
        <AppThemeToggle />
      </div>
    </header>
  )
}
