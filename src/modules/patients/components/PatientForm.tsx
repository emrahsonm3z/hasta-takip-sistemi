import { type Ref, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik, type FormikProps } from 'formik'

import {
  FormCalendar,
  FormCheckbox,
  FormChips,
  FormDropdown,
  FormInputNumber,
  FormInputText,
} from '@/components/form'
import type { TranslationKey } from '@/types/i18n.types'

import type { PatientFormValues } from '../lib/patient.form'
import { buildPatientFormSchema, type PatientFormMode } from '../lib/patient-form.schema'
import {
  buildBloodTypeFilterOptions,
  buildDepartmentFilterOptions,
  buildPriorityFilterOptions,
  buildStatusFilterOptions,
  type EnumFilterOption,
} from '../lib/patient-list.lib'
import { PriorityTagOption, StatusTagOption } from './PatientTags'

interface PatientFormProps {
  mode: PatientFormMode
  initialValues: PatientFormValues
  formikRef: Ref<FormikProps<PatientFormValues>>
  onSubmit: (values: PatientFormValues) => void
}

function FormSectionHeading({ labelKey }: { labelKey: TranslationKey }) {
  const { t } = useTranslation()
  return (
    <div className="mt-2 flex items-center gap-3 first:mt-0 md:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {t(labelKey)}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-surface-200" />
    </div>
  )
}

export function PatientForm({
  mode,
  initialValues,
  formikRef,
  onSubmit,
}: PatientFormProps) {
  const { t } = useTranslation()
  const validationSchema = useMemo(() => buildPatientFormSchema(mode), [mode])
  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const translateOptions = <V,>(options: EnumFilterOption<V & string>[]) =>
    options.map((option) => ({ value: option.value, label: t(option.labelKey) }))

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form noValidate>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
            <FormSectionHeading labelKey="patients.form.sections.info" />
            <div className="md:col-span-2">
              <FormInputText
                name="fullName"
                labelKey="patients.fields.fullName"
                placeholderKey="patients.form.placeholders.fullName"
              />
            </div>
            <FormCalendar
              name="birthDate"
              labelKey="patients.fields.birthDate"
              placeholderKey="patients.form.placeholders.date"
            />
            <FormDropdown
              name="bloodType"
              labelKey="patients.fields.bloodType"
              options={translateOptions(buildBloodTypeFilterOptions())}
              placeholderKey="patients.form.placeholders.select"
            />

            <FormSectionHeading labelKey="patients.form.sections.appointment" />
            <FormDropdown
              name="department"
              labelKey="patients.fields.department"
              options={translateOptions(buildDepartmentFilterOptions())}
              placeholderKey="patients.form.placeholders.select"
            />
            <FormDropdown
              name="status"
              labelKey="patients.fields.status"
              options={translateOptions(buildStatusFilterOptions())}
              placeholderKey="patients.form.placeholders.select"
              optionTemplate={StatusTagOption}
            />
            <FormDropdown
              name="priority"
              labelKey="patients.fields.priority"
              options={translateOptions(buildPriorityFilterOptions())}
              placeholderKey="patients.form.placeholders.select"
              optionTemplate={PriorityTagOption}
            />
            <FormCalendar
              name="appointmentDate"
              labelKey="patients.fields.appointmentDate"
              placeholderKey="patients.form.placeholders.date"
              minDate={mode === 'create' ? today : (values.birthDate ?? undefined)}
            />
            <FormInputNumber
              name="score"
              labelKey="patients.fields.score"
              placeholderKey="patients.form.placeholders.score"
            />

            <FormSectionHeading labelKey="patients.form.sections.diagnosis" />
            <FormInputText
              name="diagnosisTr"
              labelKey="patients.fields.diagnosisTr"
              placeholderKey="patients.form.placeholders.diagnosis"
            />
            <FormInputText
              name="diagnosisEn"
              labelKey="patients.fields.diagnosisEn"
              placeholderKey="patients.form.placeholders.diagnosis"
            />

            <FormSectionHeading labelKey="patients.form.sections.note" />
            <FormInputText
              name="noteTr"
              labelKey="patients.fields.noteTr"
              placeholderKey="patients.form.placeholders.note"
            />
            <FormInputText
              name="noteEn"
              labelKey="patients.fields.noteEn"
              placeholderKey="patients.form.placeholders.note"
            />

            <FormSectionHeading labelKey="patients.form.sections.flags" />
            <div className="grid grid-cols-3 gap-2 md:col-span-2 md:gap-4">
              <FormCheckbox name="isInsured" labelKey="patients.fields.isInsured" />
              <FormCheckbox name="isFollowUp" labelKey="patients.fields.isFollowUp" />
              <FormCheckbox name="isVaccinated" labelKey="patients.fields.isVaccinated" />
            </div>

            <FormSectionHeading labelKey="patients.form.sections.tags" />
            <div className="md:col-span-2">
              <FormChips
                name="tags"
                labelKey="patients.fields.tags"
                placeholderKey="patients.form.placeholders.tags"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
