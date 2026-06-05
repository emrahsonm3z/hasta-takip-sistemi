import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useNotify } from '@/composables/useNotify'
import type { TranslationKey } from '@/types/i18n.types'

import { patientStorage } from '../api/patients.storage'
import { patientKeys } from '../constants/query-keys'
import type { PatientRecord } from '../models/patient.model'

export function usePatientMutations() {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const settle = async (successKey: TranslationKey) => {
    await queryClient.invalidateQueries({ queryKey: patientKeys.all() })
    notify.success(successKey)
  }

  const addPatient = useMutation({
    mutationFn: (patient: PatientRecord) => Promise.resolve(patientStorage.add(patient)),
    onSuccess: () => settle('patients.notifications.added'),
    onError: () => {
      notify.error('errors.saveFailed')
    },
  })

  const updatePatient = useMutation({
    mutationFn: (patient: PatientRecord) =>
      Promise.resolve(patientStorage.update(patient)),
    onSuccess: () => settle('patients.notifications.updated'),
    onError: () => {
      notify.error('errors.saveFailed')
    },
  })

  const removePatient = useMutation({
    mutationFn: (id: string) => Promise.resolve(patientStorage.remove(id)),
    onSuccess: () => settle('patients.notifications.removed'),
    onError: () => {
      notify.error('errors.saveFailed')
    },
  })

  return { addPatient, updatePatient, removePatient }
}
