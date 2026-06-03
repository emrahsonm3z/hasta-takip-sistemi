import { setLocale } from 'yup'

import type { TranslationKey } from '@/types/i18n.types'

setLocale({
  mixed: {
    default: 'validation.invalid' satisfies TranslationKey,
    required: 'validation.required' satisfies TranslationKey,
    notType: 'validation.invalid' satisfies TranslationKey,
  },
  string: {
    email: 'validation.email' satisfies TranslationKey,
    min: 'validation.stringMin' satisfies TranslationKey,
    max: 'validation.stringMax' satisfies TranslationKey,
  },
  number: {
    min: 'validation.numberMin' satisfies TranslationKey,
    max: 'validation.numberMax' satisfies TranslationKey,
  },
})
