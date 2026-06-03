import { useField } from 'formik'
import { Dropdown } from 'primereact/dropdown'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormDropdownOption {
  label: string
  value: unknown
}

interface FormDropdownProps {
  name: string
  labelKey: TranslationKey
  options: FormDropdownOption[]
}

export function FormDropdown({ name, labelKey, options }: FormDropdownProps) {
  const [field, , helpers] = useField<unknown>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid }) => (
        <Dropdown
          inputId={id}
          value={field.value}
          options={options}
          invalid={invalid}
          onChange={(event) => {
            void helpers.setValue(event.value as unknown)
          }}
          onBlur={() => {
            void helpers.setTouched(true)
          }}
        />
      )}
    </FormField>
  )
}
