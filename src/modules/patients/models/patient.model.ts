export const PATIENT_STATUSES = [
  'waiting',
  'inExamination',
  'completed',
  'cancelled',
] as const

export const PATIENT_PRIORITIES = ['urgent', 'normal'] as const

export const PATIENT_DEPARTMENTS = [
  'internalMedicine',
  'cardiology',
  'neurology',
  'orthopedics',
  'pediatrics',
] as const

export const PATIENT_BLOOD_TYPES = [
  '0+',
  '0-',
  'A+',
  'A-',
  'AB+',
  'AB-',
  'B+',
  'B-',
] as const

export type PatientStatus = (typeof PATIENT_STATUSES)[number]
export type PatientPriority = (typeof PATIENT_PRIORITIES)[number]
export type PatientDepartment = (typeof PATIENT_DEPARTMENTS)[number]
export type PatientBloodType = (typeof PATIENT_BLOOD_TYPES)[number]

export interface PatientRecord {
  id: string
  fullName: string
  birthDate: string
  appointmentDate: string
  createdAt: string
  department: PatientDepartment
  status: PatientStatus
  priority: PatientPriority
  bloodType: PatientBloodType
  score: number
  noteTr: string
  noteEn: string
  diagnosisTr: string
  diagnosisEn: string
  isInsured: boolean
  isFollowUp: boolean
  isVaccinated: boolean
  tags: string[]
  notes: string | null
}

export interface RawPatientRow {
  id: string
  fullName: string
  birthDate: string
  appointmentDate: string
  createdAt: string
  department: string
  status: string
  priority: string
  bloodType: string
  score: number
  note_tr: string
  note_en: string
  diagnosis_tr: string
  diagnosis_en: string
  isInsured: boolean
  isFollowUp: boolean
  isVaccinated: boolean
  tags: string[]
  notes: string | null
}
