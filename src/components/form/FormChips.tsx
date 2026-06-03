import { useField } from 'formik'
import { Chips } from 'primereact/chips'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormChipsProps {
  name: string
  labelKey: TranslationKey
}

export function FormChips({ name, labelKey }: FormChipsProps) {
  const [field, , helpers] = useField<string[]>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid }) => (
        <Chips
          inputId={id}
          value={field.value ?? []}
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
