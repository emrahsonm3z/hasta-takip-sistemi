import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { InputText } from 'primereact/inputtext'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormInputTextProps {
  name: string
  labelKey: TranslationKey
  placeholderKey?: TranslationKey
}

export function FormInputText({ name, labelKey, placeholderKey }: FormInputTextProps) {
  const { t } = useTranslation()
  const [field, , helpers] = useField<string>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid, errorId }) => (
        <InputText
          id={id}
          aria-invalid={invalid}
          aria-describedby={errorId}
          value={field.value ?? ''}
          placeholder={placeholderKey ? t(placeholderKey) : undefined}
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
