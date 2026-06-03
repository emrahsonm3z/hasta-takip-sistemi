import { useField } from 'formik'
import { Calendar } from 'primereact/calendar'

import type { TranslationKey } from '@/types/i18n.types'

import { FormField } from './FormField'

interface FormCalendarProps {
  name: string
  labelKey: TranslationKey
}

export function FormCalendar({ name, labelKey }: FormCalendarProps) {
  const [field, , helpers] = useField<Date | null>(name)

  return (
    <FormField name={name} labelKey={labelKey}>
      {({ id, invalid }) => (
        <Calendar
          inputId={id}
          value={field.value}
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
