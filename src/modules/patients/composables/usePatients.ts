import { useQuery } from '@tanstack/react-query'

import { fetchRawPatients } from '../api/patients.api'
import { patientStorage } from '../api/patients.storage'
import { patientKeys } from '../constants/query-keys'
import { mapRawPatients } from '../lib/patient.mapper'
import type { PatientRecord } from '../models/patient.model'

async function readOrSeedPatients(): Promise<PatientRecord[]> {
  const stored = patientStorage.read()
  if (stored.length > 0) {
    return stored
  }
  const rawRows = await fetchRawPatients()
  const patients = mapRawPatients(rawRows)
  patientStorage.write(patients)
  return patients
}

export function usePatients() {
  return useQuery({
    queryKey: patientKeys.list(),
    queryFn: readOrSeedPatients,
  })
}
