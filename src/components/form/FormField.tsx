import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useField } from 'formik'

import type { TranslationKey } from '@/types/i18n.types'

import { resolveValidationMessage } from './validation'

interface FormFieldRenderProps {
  id: string
  invalid: boolean
  errorId: string
}

interface FormFieldProps {
  name: string
  labelKey: TranslationKey
  children: (props: FormFieldRenderProps) => ReactNode
}

export function FormField({ name, labelKey, children }: FormFieldProps) {
  const { t } = useTranslation()
  const [, meta] = useField(name)

  const id = `field-${name}`
  const errorId = `${id}-error`
  const invalid = Boolean(meta.touched && meta.error)
  const errorMessage =
    invalid && meta.error ? resolveValidationMessage(meta.error, t) : null

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {t(labelKey)}
      </label>
      {children({ id, invalid, errorId })}
      <small id={errorId} aria-live="polite" className="p-error block min-h-5 leading-5">
        {errorMessage}
      </small>
    </div>
  )
}
