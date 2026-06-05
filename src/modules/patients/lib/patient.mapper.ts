import type {
  PatientBloodType,
  PatientDepartment,
  PatientPriority,
  PatientRecord,
  PatientStatus,
  RawPatientRow,
} from '../models/patient.model'

const STATUS_BY_RAW_VALUE: Record<string, PatientStatus> = {
  Bekliyor: 'waiting',
  Muayenede: 'inExamination',
  Tamamlandı: 'completed',
  İptal: 'cancelled',
}

const PRIORITY_BY_RAW_VALUE: Record<string, PatientPriority> = {
  acil: 'urgent',
  normal: 'normal',
}

const DEPARTMENT_BY_RAW_VALUE: Record<string, PatientDepartment> = {
  Dahiliye: 'internalMedicine',
  Kardiyoloji: 'cardiology',
  Nöroloji: 'neurology',
  Ortopedi: 'orthopedics',
  Pediatri: 'pediatrics',
}

function coerce<T>(lookup: Record<string, T>, rawValue: string, field: string): T {
  const coerced = lookup[rawValue]
  if (coerced === undefined) {
    throw new Error(`Unknown ${field} value: ${rawValue}`)
  }
  return coerced
}

const BLOOD_TYPE_BY_RAW_VALUE: Record<string, PatientBloodType> = {
  '0+': '0+',
  '0-': '0-',
  'A+': 'A+',
  'A-': 'A-',
  'AB+': 'AB+',
  'AB-': 'AB-',
  'B+': 'B+',
  'B-': 'B-',
}

export function mapRawPatient(raw: RawPatientRow): PatientRecord {
  return {
    id: raw.id,
    fullName: raw.fullName,
    birthDate: raw.birthDate,
    appointmentDate: raw.appointmentDate,
    createdAt: raw.createdAt,
    department: coerce(DEPARTMENT_BY_RAW_VALUE, raw.department, 'department'),
    status: coerce(STATUS_BY_RAW_VALUE, raw.status, 'status'),
    priority: coerce(PRIORITY_BY_RAW_VALUE, raw.priority, 'priority'),
    bloodType: coerce(BLOOD_TYPE_BY_RAW_VALUE, raw.bloodType, 'bloodType'),
    score: raw.score,
    noteTr: raw.note_tr,
    noteEn: raw.note_en,
    diagnosisTr: raw.diagnosis_tr,
    diagnosisEn: raw.diagnosis_en,
    isInsured: raw.isInsured,
    isFollowUp: raw.isFollowUp,
    isVaccinated: raw.isVaccinated,
    tags: [...raw.tags],
    notes: raw.notes,
  }
}

export function mapRawPatients(rows: RawPatientRow[]): PatientRecord[] {
  return rows.map(mapRawPatient)
}
