import type { TranslationKey } from '@/types/i18n.types'

interface KeyedError {
  messageKey: TranslationKey
}

function isKeyedError(error: unknown): error is KeyedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'messageKey' in error &&
    typeof (error as Record<string, unknown>).messageKey === 'string'
  )
}

export function normalizeErrorKey(error: unknown): TranslationKey {
  return isKeyedError(error) ? error.messageKey : 'errors.unexpected'
}
