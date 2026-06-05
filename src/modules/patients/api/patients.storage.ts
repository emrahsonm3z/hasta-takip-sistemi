import { createPatientStorage } from '../lib/patient-storage.lib'

export const patientStorage = createPatientStorage(window.localStorage)
