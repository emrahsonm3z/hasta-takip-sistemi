import { useTranslation } from 'react-i18next'

export function AppLanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language.split('-')[0] === 'en' ? 'en' : 'tr'
  const next = current === 'tr' ? 'en' : 'tr'

  return (
    <button
      type="button"
      aria-label={t('common.language')}
      onClick={() => void i18n.changeLanguage(next)}
      className="l-topbar-iconbtn l-topbar-chip text-sm font-semibold text-text"
    >
      {current.toUpperCase()}
    </button>
  )
}
