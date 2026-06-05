import type { PatientRecord } from '../models/patient.model'

export const PATIENT_STORAGE_KEY = 'patients'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface PatientStorage {
  read(): PatientRecord[]
  write(patients: PatientRecord[]): void
  add(patient: PatientRecord): void
  update(patient: PatientRecord): void
  remove(id: string): void
  clear(): void
}

export function createPatientStorage(storage: StorageLike): PatientStorage {
  const read = (): PatientRecord[] => {
    try {
      const raw = storage.getItem(PATIENT_STORAGE_KEY)
      if (!raw) {
        return []
      }
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as PatientRecord[]) : []
    } catch {
      return []
    }
  }

  const write = (patients: PatientRecord[]): void => {
    storage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(patients))
  }

  return {
    read,
    write,
    add: (patient) => {
      write([...read(), patient])
    },
    update: (patient) => {
      write(read().map((record) => (record.id === patient.id ? patient : record)))
    },
    remove: (id) => {
      write(read().filter((record) => record.id !== id))
    },
    clear: () => {
      storage.removeItem(PATIENT_STORAGE_KEY)
    },
  }
}
