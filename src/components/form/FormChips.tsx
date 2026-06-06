import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { Chips } from 'primereact/chips'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormChipsProps {
  name: string
  labelKey: TranslationKey
  placeholderKey?: TranslationKey
}

export function FormChips({ name, labelKey, placeholderKey }: FormChipsProps) {
  const { t } = useTranslation()
  const [field, , helpers] = useField<string[]>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid, errorId }) => (
        <Chips
          inputId={id}
          aria-invalid={invalid}
          aria-describedby={errorId}
          value={field.value ?? []}
          placeholder={placeholderKey ? t(placeholderKey) : undefined}
          invalid={invalid}
          onChange={(event) => {
            void helpers.setValue(event.value ?? [])
          }}
          onBlur={() => {
            void helpers.setTouched(true)
          }}
        />
      )}
    </FormField>
  )
}
