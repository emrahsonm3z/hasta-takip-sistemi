import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { Calendar } from 'primereact/calendar'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormCalendarProps {
  name: string
  labelKey: TranslationKey
  placeholderKey?: TranslationKey
  minDate?: Date
}

export function FormCalendar({
  name,
  labelKey,
  placeholderKey,
  minDate,
}: FormCalendarProps) {
  const { t } = useTranslation()
  const [field, , helpers] = useField<Date | null>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid, errorId }) => (
        <Calendar
          inputId={id}
          aria-invalid={invalid}
          aria-describedby={errorId}
          value={field.value}
          placeholder={placeholderKey ? t(placeholderKey) : undefined}
          minDate={minDate}
          invalid={invalid}
          onChange={(event) => {
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
