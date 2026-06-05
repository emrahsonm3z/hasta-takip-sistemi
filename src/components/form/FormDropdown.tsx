import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { Dropdown } from 'primereact/dropdown'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormDropdownOption<V> {
  label: string
  value: V
}

interface FormDropdownProps<V> {
  name: string
  labelKey: TranslationKey
  options: FormDropdownOption<V>[]
  placeholderKey?: TranslationKey
  optionTemplate?: (option: FormDropdownOption<V>) => ReactNode
}

export function FormDropdown<V>({
  name,
  labelKey,
  options,
  placeholderKey,
  optionTemplate,
}: FormDropdownProps<V>) {
  const { t } = useTranslation()
  const [field, , helpers] = useField<V | null>(name)

  const placeholder = placeholderKey ? t(placeholderKey) : undefined
  const selectedOption = options.find((option) => option.value === field.value)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid }) => (
        <Dropdown
          inputId={id}
          value={field.value}
          options={options}
          invalid={invalid}
          placeholder={placeholder}
          itemTemplate={optionTemplate}
          valueTemplate={
            optionTemplate ? (
              selectedOption ? (
                optionTemplate(selectedOption)
              ) : (
                <span className="text-text-secondary">{placeholder}</span>
              )
            ) : undefined
          }
          onChange={(event) => {
            void helpers.setValue((event.value as V | undefined) ?? null)
          }}
          onBlur={() => {
            void helpers.setTouched(true)
          }}
        />
      )}
    </FormField>
  )
}
