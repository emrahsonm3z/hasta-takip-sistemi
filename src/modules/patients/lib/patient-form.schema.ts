import { array, boolean, date, number, object, ref, string } from 'yup'

import { message } from '../../../plugins/yup.ts'
import type {
  PatientBloodType,
  PatientDepartment,
  PatientPriority,
  PatientStatus,
} from '../models/patient.model'

const STATUS_VALUES: PatientStatus[] = [
  'waiting',
  'inExamination',
  'completed',
  'cancelled',
]

const PRIORITY_VALUES: PatientPriority[] = ['urgent', 'normal']

const DEPARTMENT_VALUES: PatientDepartment[] = [
  'internalMedicine',
  'cardiology',
  'neurology',
  'orthopedics',
  'pediatrics',
]

const BLOOD_TYPE_VALUES: PatientBloodType[] = [
  '0+',
  '0-',
  'A+',
  'A-',
  'AB+',
  'AB-',
  'B+',
  'B-',
]

export type PatientFormMode = 'create' | 'edit'

function startOfDay(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
}

export const buildPatientFormSchema = (mode: PatientFormMode) =>
  object({
    fullName: string().required().min(2).max(120),
    birthDate: date()
      .required()
      .test(
        'birth-date-not-in-future',
        message('validation.birthDateInFuture'),
        (value) => value === undefined || value.getTime() <= Date.now(),
      ),
    bloodType: string()
      .oneOf(BLOOD_TYPE_VALUES, message('validation.invalid'))
      .required(),
    department: string()
      .oneOf(DEPARTMENT_VALUES, message('validation.invalid'))
      .required(),
    status: string().oneOf(STATUS_VALUES, message('validation.invalid')).required(),
    priority: string().oneOf(PRIORITY_VALUES, message('validation.invalid')).required(),
    appointmentDate: date()
      .required()
      .min(ref('birthDate'), message('validation.appointmentBeforeBirth'))
      .test(
        'appointment-not-in-past',
        message('validation.appointmentInPast'),
        (value) =>
          mode === 'edit' ||
          value === undefined ||
          startOfDay(value) >= startOfDay(new Date()),
      ),
    score: number().required().integer(message('validation.invalid')).min(1).max(5),
    diagnosisTr: string().required().min(2),
    diagnosisEn: string().required().min(2),
    noteTr: string().default(''),
    noteEn: string().default(''),
    isInsured: boolean().required(),
    isFollowUp: boolean().required(),
    isVaccinated: boolean().required(),
    tags: array(string().trim().min(1)).default([]),
  })
