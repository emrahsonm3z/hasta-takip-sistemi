import { useField } from 'formik'
import { InputText } from 'primereact/inputtext'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormInputTextProps {
  name: string
  labelKey: TranslationKey
}

export function FormInputText({ name, labelKey }: FormInputTextProps) {
  const [field, , helpers] = useField<string>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid }) => (
        <InputText
          id={id}
          value={field.value ?? ''}
          invalid={invalid}
          onChange={(event) => {
            void helpers.setValue(event.target.value)
          }}
          onBlur={() => {
            void helpers.setTouched(true)
          }}
        />
      )}
    </FormField>
  )
}
