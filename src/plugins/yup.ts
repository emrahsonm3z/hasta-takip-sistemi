import { setLocale } from 'yup'

import type { TranslationKey } from '@/types/i18n.types'

function message(key: TranslationKey, values?: Record<string, unknown>): string {
  return JSON.stringify({ key, values })
}

setLocale({
  mixed: {
    default: () => message('validation.invalid'),
    required: () => message('validation.required'),
    notType: () => message('validation.invalid'),
  },
  string: {
    email: () => message('validation.email'),
    min: ({ min }) => message('validation.stringMin', { min }),
    max: ({ max }) => message('validation.stringMax', { max }),
  },
  number: {
    min: ({ min }) => message('validation.numberMin', { min }),
    max: ({ max }) => message('validation.numberMax', { max }),
  },
})
