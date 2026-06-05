import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { Checkbox } from 'primereact/checkbox'

import type { TranslationKey } from '@/types/i18n.types'

interface FormCheckboxProps {
  name: string
  labelKey: TranslationKey
}

export function FormCheckbox({ name, labelKey }: FormCheckboxProps) {
  const { t } = useTranslation()
  const [field, , helpers] = useField<boolean>(name)
  const id = `field-${name}`

  return (
    <div className="flex items-center gap-2">
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
      <label htmlFor={id} className="text-sm font-medium text-text">
        {t(labelKey)}
      </label>
    </div>
  )
}
