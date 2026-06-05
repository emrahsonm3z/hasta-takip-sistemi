import type { PatientPriority, PatientStatus } from '../models/patient.model'

export type PatientTagSeverity = 'success' | 'info' | 'warning' | 'danger' | 'secondary'

export const STATUS_TAG_SEVERITY: Record<PatientStatus, PatientTagSeverity> = {
  waiting: 'warning',
  inExamination: 'info',
  completed: 'success',
  cancelled: 'secondary',
}

export const PRIORITY_TAG_SEVERITY: Record<PatientPriority, PatientTagSeverity> = {
  urgent: 'danger',
  normal: 'secondary',
}
