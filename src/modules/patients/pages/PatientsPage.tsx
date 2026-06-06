import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import { ErrorState } from '@/components/ErrorState'

import { PatientDialog, type PatientDialogMode } from '../components/PatientDialog'
import { PatientList } from '../components/PatientList'
import { usePatientMutations } from '../composables/usePatientMutations'
import { usePatients } from '../composables/usePatients'
import type { PatientRecord } from '../models/patient.model'

interface DialogState {
  mode: PatientDialogMode
  patient: PatientRecord | null
}

export default function PatientsPage() {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = usePatients()
  const { addPatient, updatePatient, removePatient } = usePatientMutations()
  const [dialog, setDialog] = useState<DialogState | null>(null)

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  const patients = data ?? []

  const closeDialog = () => {
    setDialog(null)
  }

  const handleSave = (patient: PatientRecord) => {
    const mutation = dialog?.mode === 'edit' ? updatePatient : addPatient
    mutation.mutate(patient, { onSuccess: closeDialog })
  }

  const handleEdit = (id: string) => {
    const patient = patients.find((record) => record.id === id)
    if (patient) {
      setDialog({ mode: 'edit', patient })
    }
  }

  const handleDelete = (id: string) => {
    const patient = patients.find((record) => record.id === id)
    if (!patient) {
      return
    }
    confirmDialog({
      header: t('patients.confirmDelete.header'),
      message: t('patients.confirmDelete.message', { name: patient.fullName }),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('common.delete'),
      rejectLabel: t('common.cancel'),
      acceptClassName: 'p-button-danger',
      accept: () => {
        removePatient.mutate(id, { onSuccess: closeDialog })
      },
    })
  }

  const editingPatient = dialog?.mode === 'edit' ? dialog.patient : null

  return (
    <div className="card p-4">
      <PatientList
        patients={patients}
        loading={isPending}
        onAddPatient={() => {
          setDialog({ mode: 'create', patient: null })
        }}
        onEditPatient={handleEdit}
        onDeletePatient={handleDelete}
      />
      <PatientDialog
        visible={dialog !== null}
        mode={dialog?.mode ?? 'create'}
        patient={dialog?.patient ?? null}
        saving={addPatient.isPending || updatePatient.isPending}
        onHide={closeDialog}
        onSave={handleSave}
        onDelete={
          editingPatient
            ? () => {
                handleDelete(editingPatient.id)
              }
            : undefined
        }
      />
      <ConfirmDialog />
    </div>
  )
}
