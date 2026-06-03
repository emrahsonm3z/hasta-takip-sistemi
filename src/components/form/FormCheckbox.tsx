import { useField } from 'formik'
import { Checkbox } from 'primereact/checkbox'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormCheckboxProps {
  name: string
  labelKey: TranslationKey
}

export function FormCheckbox({ name, labelKey }: FormCheckboxProps) {
  const [field, , helpers] = useField<boolean>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id }) => (
        <Checkbox
          inputId={id}
          checked={Boolean(field.value)}
          onChange={(event) => {
            void helpers.setValue(Boolean(event.checked))
          }}
          onBlur={() => {
            void helpers.setTouched(true)
          }}
        />
      )}
    </FormField>
  )
}
