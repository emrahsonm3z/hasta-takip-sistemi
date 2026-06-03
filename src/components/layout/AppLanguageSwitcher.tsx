import { useTranslation } from 'react-i18next'
import { SelectButton } from 'primereact/selectbutton'

const LANGUAGE_OPTIONS = [
  { label: 'TR', value: 'tr' },
  { label: 'EN', value: 'en' },
]

export function AppLanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language.split('-')[0]

  return (
    <SelectButton
      value={current}
      options={LANGUAGE_OPTIONS}
      allowEmpty={false}
      aria-label={t('common.language')}
      onChange={(event) => {
        const next = event.value as string | null
        if (next) {
          void i18n.changeLanguage(next)
        }
      }}
    />
  )
}
