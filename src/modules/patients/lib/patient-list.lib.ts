import type { TranslationKey } from '@/types/i18n.types'

import type {
  PatientBloodType,
  PatientDepartment,
  PatientPriority,
  PatientRecord,
  PatientStatus,
} from '../models/patient.model'

export interface PatientListRow extends Omit<
  PatientRecord,
  'appointmentDate' | 'birthDate' | 'createdAt'
> {
  appointmentDate: Date
  birthDate: Date
  createdAt: Date
  diagnosis: string
  note: string
}

export type LocalizedFieldPicker = (turkish: string, english: string) => string

export function buildPatientListRows(
  patients: PatientRecord[],
  localize: LocalizedFieldPicker,
): PatientListRow[] {
  return patients.map((patient) => ({
    ...patient,
    appointmentDate: new Date(patient.appointmentDate),
    birthDate: new Date(patient.birthDate),
    createdAt: new Date(patient.createdAt),
    diagnosis: localize(patient.diagnosisTr, patient.diagnosisEn),
    note: localize(patient.noteTr, patient.noteEn),
  }))
}

export function sortRowsByValueOrder<T, V>(
  rows: T[],
  getValue: (row: T) => V,
  orderedValues: readonly V[],
  order: 1 | -1,
): T[] {
  return [...rows].sort(
    (first, second) =>
      order *
      (orderedValues.indexOf(getValue(first)) - orderedValues.indexOf(getValue(second))),
  )
}

export function collectDistinctTags(
  patients: PatientRecord[],
  compare: (first: string, second: string) => number,
): string[] {
  const tags = new Set<string>()
  for (const patient of patients) {
    for (const tag of patient.tags) {
      tags.add(tag)
    }
  }
  return [...tags].sort(compare)
}

export function collectDistinctScores(patients: PatientRecord[]): number[] {
  return [...new Set(patients.map((patient) => patient.score))].sort(
    (first, second) => first - second,
  )
}

export interface EnumFilterOption<V extends string> {
  value: V
  labelKey: TranslationKey
}

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

export const STATUS_SORT_ORDER = STATUS_VALUES
export const PRIORITY_SORT_ORDER = PRIORITY_VALUES

export function buildStatusFilterOptions(): EnumFilterOption<PatientStatus>[] {
  return STATUS_VALUES.map((value) => ({
    value,
    labelKey: `patients.status.${value}`,
  }))
}

export function buildPriorityFilterOptions(): EnumFilterOption<PatientPriority>[] {
  return PRIORITY_VALUES.map((value) => ({
    value,
    labelKey: `patients.priority.${value}`,
  }))
}

export function buildDepartmentFilterOptions(): EnumFilterOption<PatientDepartment>[] {
  return DEPARTMENT_VALUES.map((value) => ({
    value,
    labelKey: `patients.department.${value}`,
  }))
}

export function buildBloodTypeFilterOptions(): EnumFilterOption<PatientBloodType>[] {
  return BLOOD_TYPE_VALUES.map((value) => ({
    value,
    labelKey: `patients.bloodType.${value}`,
  }))
}
