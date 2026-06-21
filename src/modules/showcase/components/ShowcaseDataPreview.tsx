import { useTranslation } from 'react-i18next'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column, type ColumnSortEvent } from 'primereact/column'
import { Tag } from 'primereact/tag'

import { AppDataTable } from '@/components/AppDataTable'
import { createEnumFilterElement } from '@/components/AppDataTableFilters'
import { formatDate } from '@/lib/date'
import { sortRowsByTurkishValue } from '@/lib/text'

import {
  SHOWCASE_DEPARTMENTS,
  SHOWCASE_SAMPLE_PATIENTS,
  SHOWCASE_STATUSES,
  type ShowcaseSamplePatient,
  type ShowcaseStatus,
} from '../constants/showcase-sample-patients.constants'

const STATUS_SEVERITY: Record<ShowcaseStatus, 'success' | 'info' | 'warning' | 'danger'> =
  {
    completed: 'success',
    inExamination: 'info',
    waiting: 'warning',
    cancelled: 'danger',
  }

const menuConstraint = (matchMode: FilterMatchMode) => ({
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode }],
})

const DEFAULT_FILTERS = {
  fullName: menuConstraint(FilterMatchMode.CONTAINS),
  department: menuConstraint(FilterMatchMode.EQUALS),
  status: menuConstraint(FilterMatchMode.EQUALS),
}

const fullNameSort = (event: ColumnSortEvent): ShowcaseSamplePatient[] =>
  sortRowsByTurkishValue(
    event.data as ShowcaseSamplePatient[],
    (row) => row.fullName,
    event.order === -1 ? -1 : 1,
  )

export function ShowcaseDataPreview() {
  const { t } = useTranslation()

  const departmentFilterElement = createEnumFilterElement(
    SHOWCASE_DEPARTMENTS.map((code) => ({
      value: code,
      label: t(`patients.department.${code}`),
    })),
    t('patients.fields.department'),
    t('filters.selectPlaceholder'),
  )

  const statusFilterElement = createEnumFilterElement(
    SHOWCASE_STATUSES.map((code) => ({
      value: code,
      label: t(`patients.status.${code}`),
    })),
    t('patients.fields.status'),
    t('filters.selectPlaceholder'),
  )

  const statusBody = (row: ShowcaseSamplePatient) => (
    <Tag
      value={t(`patients.status.${row.status}`)}
      severity={STATUS_SEVERITY[row.status]}
    />
  )

  return (
    <div className="card">
      <AppDataTable
        data={SHOWCASE_SAMPLE_PATIENTS}
        dataKey="id"
        paginator={false}
        globalFilterFields={['fullName']}
        defaultFilters={DEFAULT_FILTERS}
        tableMinWidth="100%"
      >
        <Column
          field="fullName"
          header={t('patients.fields.fullName')}
          sortable
          sortFunction={fullNameSort}
          filter
          filterPlaceholder={t('filters.textPlaceholder')}
        />
        <Column
          field="department"
          header={t('patients.fields.department')}
          sortable
          filter
          filterElement={departmentFilterElement}
          body={(row: ShowcaseSamplePatient) =>
            t(`patients.department.${row.department}`)
          }
        />
        <Column
          field="status"
          header={t('patients.fields.status')}
          sortable
          filter
          filterElement={statusFilterElement}
          body={statusBody}
        />
        <Column
          field="priority"
          header={t('patients.fields.priority')}
          sortable
          body={(row: ShowcaseSamplePatient) => t(`patients.priority.${row.priority}`)}
        />
        <Column
          field="appointmentDate"
          header={t('patients.fields.appointmentDate')}
          sortable
          body={(row: ShowcaseSamplePatient) => formatDate(row.appointmentDate)}
        />
      </AppDataTable>
    </div>
  )
}
