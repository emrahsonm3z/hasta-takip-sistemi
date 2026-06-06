import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'primereact/button'

import { getStoredThemeMode, setThemeMode } from '@/plugins/theme'
import type { ThemeMode } from '@/plugins/theme.lib'

export function AppThemeToggle() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<ThemeMode>(() => getStoredThemeMode())

  const toggle = () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setThemeMode(next)
    setMode(next)
  }

  return (
    <Button
      icon={mode === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
      text
      rounded
      aria-label={t(
        mode === 'dark' ? 'common.themeToggleToLight' : 'common.themeToggleToDark',
      )}
      onClick={toggle}
      pt={{
        root: { className: 'l-topbar-iconbtn l-topbar-chip' },
        icon: { className: 'text-lg' },
      }}
    />
  )
}
