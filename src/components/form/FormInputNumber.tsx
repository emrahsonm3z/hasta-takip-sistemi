import { useField } from 'formik'
import { InputNumber } from 'primereact/inputnumber'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormInputNumberProps {
  name: string
  labelKey: TranslationKey
}

export function FormInputNumber({ name, labelKey }: FormInputNumberProps) {
  const [field, , helpers] = useField<number | null>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid }) => (
        <InputNumber
          inputId={id}
          value={field.value}
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
