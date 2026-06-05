import { useTranslation } from 'react-i18next'
import { Tag } from 'primereact/tag'

import {
  PRIORITY_TAG_SEVERITY,
  STATUS_TAG_SEVERITY,
} from '../constants/patient-tag.constants'
import type { PatientPriority, PatientStatus } from '../models/patient.model'

export function StatusTag({ status }: { status: PatientStatus }) {
  const { t } = useTranslation()
  return (
    <Tag value={t(`patients.status.${status}`)} severity={STATUS_TAG_SEVERITY[status]} />
  )
}

export function PriorityTag({ priority }: { priority: PatientPriority }) {
  const { t } = useTranslation()
  return (
    <Tag
      value={t(`patients.priority.${priority}`)}
      severity={PRIORITY_TAG_SEVERITY[priority]}
    />
  )
}

export const StatusTagOption = (option: { value: PatientStatus }) => (
  <StatusTag status={option.value} />
)

export const PriorityTagOption = (option: { value: PatientPriority }) => (
  <PriorityTag priority={option.value} />
)
