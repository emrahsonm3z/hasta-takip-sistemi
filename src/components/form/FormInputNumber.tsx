import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { InputNumber } from 'primereact/inputnumber'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormInputNumberProps {
  name: string
  labelKey: TranslationKey
  placeholderKey?: TranslationKey
}

export function FormInputNumber({
  name,
  labelKey,
  placeholderKey,
}: FormInputNumberProps) {
  const { t } = useTranslation()
  const [field, , helpers] = useField<number | null>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid, errorId }) => (
        <InputNumber
          inputId={id}
          aria-invalid={invalid}
          aria-describedby={errorId}
          value={field.value}
          placeholder={placeholderKey ? t(placeholderKey) : undefined}
          invalid={invalid}
          onValueChange={(event) => {
            void helpers.setValue(event.value ?? null)
          }}
          onBlur={() => {
            void helpers.setTouched(true)
          }}
        />
      )}
    </FormField>
  )
}
