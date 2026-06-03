import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ToastContext } from '@/components/toast-context'
import type { TranslationKey } from '@/types/i18n.types'

type NotifySeverity = 'success' | 'info' | 'error'

export function useNotify() {
  const toastRef = useContext(ToastContext)
  const { t } = useTranslation()

  const notify = (severity: NotifySeverity, messageKey: TranslationKey) => {
    toastRef?.current?.show({ severity, detail: t(messageKey), life: 4000 })
  }

  return {
    success: (messageKey: TranslationKey) => {
      notify('success', messageKey)
    },
    info: (messageKey: TranslationKey) => {
      notify('info', messageKey)
    },
    error: (messageKey: TranslationKey) => {
      notify('error', messageKey)
    },
  }
}
