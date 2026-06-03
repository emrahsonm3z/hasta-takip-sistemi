import { useTranslation } from 'react-i18next'
import { Button } from 'primereact/button'

import type { TranslationKey } from '@/types/i18n.types'

interface ErrorStateProps {
  messageKey?: TranslationKey
  onRetry?: () => void
}

export function ErrorState({
  messageKey = 'errors.loadFailed',
  onRetry,
}: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div role="alert" className="flex flex-col items-center gap-3 p-6 text-center">
      <i
        className="pi pi-exclamation-triangle text-3xl text-text-secondary"
        aria-hidden="true"
      />
      <p className="text-text">{t(messageKey)}</p>
      {onRetry ? (
        <Button label={t('common.retry')} icon="pi pi-refresh" onClick={onRetry} />
      ) : null}
    </div>
  )
}
