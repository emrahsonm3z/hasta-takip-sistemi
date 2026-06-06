import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FormikProps } from 'formik'
import { Button } from 'primereact/button'

import { AppDialog } from '@/components/AppDialog'

import {
  createEmptyFormValues,
  type PatientFormValues,
  toFormValues,
  toPatientRecord,
} from '../lib/patient.form'
import type { PatientRecord } from '../models/patient.model'
import { PatientForm } from './PatientForm'

export type PatientDialogMode = 'create' | 'edit'

interface PatientDialogProps {
  visible: boolean
  mode: PatientDialogMode
  patient: PatientRecord | null
  saving: boolean
  onHide: () => void
  onSave: (patient: PatientRecord) => void
}

export function PatientDialog({
  visible,
  mode,
  patient,
  saving,
  onHide,
  onSave,
}: PatientDialogProps) {
  const { t } = useTranslation()
  const formikRef = useRef<FormikProps<PatientFormValues>>(null)
  const [dirty, setDirty] = useState(false)

  const initialValues = useMemo(
    () => (mode === 'edit' && patient ? toFormValues(patient) : createEmptyFormValues()),
    [mode, patient],
  )

  const handleSubmit = (values: PatientFormValues) => {
    const system =
      mode === 'edit' && patient
        ? { id: patient.id, createdAt: patient.createdAt, notes: patient.notes }
        : {
            id: `pat-${crypto.randomUUID()}`,
            createdAt: new Date().toISOString(),
            notes: null,
          }
    onSave(toPatientRecord(values, system))
  }

  return (
    <AppDialog
      visible={visible}
      header={t(mode === 'create' ? 'patients.form.addTitle' : 'patients.form.editTitle')}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label={t('common.cancel')}
            severity="secondary"
            outlined
            onClick={onHide}
          />
          <Button
            type="button"
            label={t('common.save')}
            disabled={!dirty}
            loading={saving}
            onClick={() => {
              void formikRef.current?.submitForm()
            }}
          />
        </div>
      }
      onHide={onHide}
    >
      <PatientForm
        key={mode === 'edit' ? (patient?.id ?? 'edit') : 'create'}
        mode={mode}
        initialValues={initialValues}
        formikRef={formikRef}
        onSubmit={handleSubmit}
        onDirtyChange={setDirty}
      />
    </AppDialog>
  )
}
