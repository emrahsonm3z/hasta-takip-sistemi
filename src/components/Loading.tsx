import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'

export function Loading() {
  const { t } = useTranslation()

  return (
    <div
      role="status"
      aria-label={t('common.loading')}
      className="flex min-h-40 items-center justify-center p-8"
    >
      <ProgressSpinner />
    </div>
  )
}
