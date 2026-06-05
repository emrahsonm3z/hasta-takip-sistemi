import type {
  PatientBloodType,
  PatientDepartment,
  PatientPriority,
  PatientRecord,
  PatientStatus,
} from '../models/patient.model'

export interface PatientFormValues {
  fullName: string
  birthDate: Date | null
  bloodType: PatientBloodType | null
  department: PatientDepartment | null
  status: PatientStatus | null
  priority: PatientPriority | null
  appointmentDate: Date | null
  score: number | null
  diagnosisTr: string
  diagnosisEn: string
  noteTr: string
  noteEn: string
  isInsured: boolean
  isFollowUp: boolean
  isVaccinated: boolean
  tags: string[]
}

export interface PatientSystemFields {
  id: string
  createdAt: string
  notes: string | null
}

export function createEmptyFormValues(): PatientFormValues {
  return {
    fullName: '',
    birthDate: null,
    bloodType: null,
    department: null,
    status: null,
    priority: null,
    appointmentDate: null,
    score: null,
    diagnosisTr: '',
    diagnosisEn: '',
    noteTr: '',
    noteEn: '',
    isInsured: false,
    isFollowUp: false,
    isVaccinated: false,
    tags: [],
  }
}

export function toFormValues(patient: PatientRecord): PatientFormValues {
  return {
    fullName: patient.fullName,
    birthDate: new Date(patient.birthDate),
    bloodType: patient.bloodType,
    department: patient.department,
    status: patient.status,
    priority: patient.priority,
    appointmentDate: new Date(patient.appointmentDate),
    score: patient.score,
    diagnosisTr: patient.diagnosisTr,
    diagnosisEn: patient.diagnosisEn,
    noteTr: patient.noteTr,
    noteEn: patient.noteEn,
    isInsured: patient.isInsured,
    isFollowUp: patient.isFollowUp,
    isVaccinated: patient.isVaccinated,
    tags: [...patient.tags],
  }
}

export function toPatientRecord(
  values: PatientFormValues,
  system: PatientSystemFields,
): PatientRecord {
  if (
    values.birthDate === null ||
    values.appointmentDate === null ||
    values.score === null ||
    values.bloodType === null ||
    values.department === null ||
    values.status === null ||
    values.priority === null
  ) {
    throw new Error('Patient form values are incomplete')
  }
  return {
    id: system.id,
    createdAt: system.createdAt,
    notes: system.notes,
    fullName: values.fullName.trim(),
    birthDate: values.birthDate.toISOString(),
    bloodType: values.bloodType,
    department: values.department,
    status: values.status,
    priority: values.priority,
    appointmentDate: values.appointmentDate.toISOString(),
    score: values.score,
    diagnosisTr: values.diagnosisTr.trim(),
    diagnosisEn: values.diagnosisEn.trim(),
    noteTr: values.noteTr.trim(),
    noteEn: values.noteEn.trim(),
    isInsured: values.isInsured,
    isFollowUp: values.isFollowUp,
    isVaccinated: values.isVaccinated,
    tags: values.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
  }
}
