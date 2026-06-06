import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { Column, type ColumnSortEvent } from 'primereact/column'

import { AppDataTable } from '@/components/AppDataTable'
import {
  createBooleanFilterElement,
  createDateFilterElement,
  createEnumFilterElement,
  createMultiSelectFilterElement,
  createNumericFilterElement,
} from '@/components/AppDataTableFilters'
import { formatDate } from '@/lib/date'
import { pickLocalized } from '@/lib/pickLocalized'
import { compareTurkish, sortRowsByTurkishValue } from '@/lib/text'
import { ARRAY_CONTAINS_ANY } from '@/plugins/primereact'

import {
  buildBloodTypeFilterOptions,
  buildDepartmentFilterOptions,
  buildPatientListRows,
  buildPriorityFilterOptions,
  buildStatusFilterOptions,
  collectDistinctTags,
  type EnumFilterOption,
  type PatientListRow,
  PRIORITY_SORT_ORDER,
  sortRowsByValueOrder,
  STATUS_SORT_ORDER,
} from '../lib/patient-list.lib'
import type { PatientRecord } from '../models/patient.model'
import { PriorityTag, PriorityTagOption, StatusTag, StatusTagOption } from './PatientTags'

interface PatientListProps {
  patients: PatientRecord[]
  loading: boolean
  onAddPatient: () => void
  onEditPatient: (id: string) => void
  onDeletePatient: (id: string) => void
}

const GLOBAL_FILTER_FIELDS = ['fullName', 'diagnosisTr', 'diagnosisEn']

const menuConstraint = (matchMode: FilterMatchMode) => ({
  operator: FilterOperator.AND,
  constraints: [{ value: null, matchMode }],
})

const DEFAULT_FILTERS = {
  fullName: menuConstraint(FilterMatchMode.CONTAINS),
  department: menuConstraint(FilterMatchMode.EQUALS),
  status: menuConstraint(FilterMatchMode.EQUALS),
  priority: menuConstraint(FilterMatchMode.EQUALS),
  appointmentDate: menuConstraint(FilterMatchMode.DATE_IS),
  birthDate: menuConstraint(FilterMatchMode.DATE_IS),
  bloodType: menuConstraint(FilterMatchMode.EQUALS),
  score: menuConstraint(FilterMatchMode.EQUALS),
  diagnosis: menuConstraint(FilterMatchMode.CONTAINS),
  note: menuConstraint(FilterMatchMode.CONTAINS),
  isInsured: { value: null, matchMode: FilterMatchMode.EQUALS },
  isFollowUp: { value: null, matchMode: FilterMatchMode.EQUALS },
  isVaccinated: { value: null, matchMode: FilterMatchMode.EQUALS },
  tags: { value: null, matchMode: ARRAY_CONTAINS_ANY as FilterMatchMode },
  createdAt: menuConstraint(FilterMatchMode.DATE_IS),
}

function TagChips({ patient }: { patient: PatientListRow }) {
  return (
    <div className="flex flex-wrap gap-1">
      {patient.tags.map((tag) => (
        <Chip key={tag} label={tag} />
      ))}
    </div>
  )
}

function YesNoIcon({ value }: { value: boolean }) {
  const { t } = useTranslation()
  return value ? (
    <i
      className="pi pi-check-circle text-success"
      role="img"
      aria-label={t('common.yes')}
    />
  ) : (
    <i
      className="pi pi-times-circle text-danger"
      role="img"
      aria-label={t('common.no')}
    />
  )
}

const statusTagBody = (patient: PatientListRow) => <StatusTag status={patient.status} />
const priorityTagBody = (patient: PatientListRow) => (
  <PriorityTag priority={patient.priority} />
)
const tagsBody = (patient: PatientListRow) => <TagChips patient={patient} />
const insuredBody = (patient: PatientListRow) => <YesNoIcon value={patient.isInsured} />
const followUpBody = (patient: PatientListRow) => <YesNoIcon value={patient.isFollowUp} />
const vaccinatedBody = (patient: PatientListRow) => (
  <YesNoIcon value={patient.isVaccinated} />
)

function createActionsBody(
  editLabel: string,
  deleteLabel: string,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
) {
  return (row: PatientListRow) => (
    <div className="flex gap-1">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="secondary"
        aria-label={editLabel}
        onClick={() => {
          onEdit(row.id)
        }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        aria-label={deleteLabel}
        onClick={() => {
          onDelete(row.id)
        }}
      />
    </div>
  )
}

const turkishSortBy =
  (getValue: (row: PatientListRow) => string) =>
  (event: ColumnSortEvent): PatientListRow[] =>
    sortRowsByTurkishValue(
      event.data as PatientListRow[],
      getValue,
      event.order === -1 ? -1 : 1,
    )

const fullNameSort = turkishSortBy((row) => row.fullName)
const diagnosisSort = turkishSortBy((row) => row.diagnosis)
const noteSort = turkishSortBy((row) => row.note)
const bloodTypeSort = turkishSortBy((row) => row.bloodType)

const statusSort = (event: ColumnSortEvent): PatientListRow[] =>
  sortRowsByValueOrder(
    event.data as PatientListRow[],
    (row) => row.status,
    STATUS_SORT_ORDER,
    event.order === -1 ? -1 : 1,
  )

const prioritySort = (event: ColumnSortEvent): PatientListRow[] =>
  sortRowsByValueOrder(
    event.data as PatientListRow[],
    (row) => row.priority,
    PRIORITY_SORT_ORDER,
    event.order === -1 ? -1 : 1,
  )

export function PatientList({
  patients,
  loading,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
}: PatientListProps) {
  const { t, i18n } = useTranslation()

  const rows = useMemo(
    () =>
      buildPatientListRows(patients, (turkish, english) =>
        pickLocalized(turkish, english, i18n.language),
      ),
    [patients, i18n.language],
  )

  const departmentSort = useMemo(
    () => turkishSortBy((row) => t(`patients.department.${row.department}`)),
    [t],
  )

  const translateOptions = <V,>(options: EnumFilterOption<V & string>[]) =>
    options.map((option) => ({ value: option.value, label: t(option.labelKey) }))

  const selectPlaceholder = t('filters.selectPlaceholder')
  const datePlaceholder = t('filters.datePlaceholder')

  const departmentFilterElement = createEnumFilterElement(
    translateOptions(buildDepartmentFilterOptions()),
    t('patients.fields.department'),
    selectPlaceholder,
  )
  const statusFilterElement = createEnumFilterElement(
    translateOptions(buildStatusFilterOptions()),
    t('patients.fields.status'),
    selectPlaceholder,
    StatusTagOption,
  )
  const priorityFilterElement = createEnumFilterElement(
    translateOptions(buildPriorityFilterOptions()),
    t('patients.fields.priority'),
    selectPlaceholder,
    PriorityTagOption,
  )
  const bloodTypeFilterElement = createEnumFilterElement(
    translateOptions(buildBloodTypeFilterOptions()),
    t('patients.fields.bloodType'),
    selectPlaceholder,
  )
  const scoreFilterElement = createNumericFilterElement(
    t('patients.fields.score'),
    t('filters.numberPlaceholder'),
  )
  const appointmentDateFilterElement = createDateFilterElement(
    t('patients.fields.appointmentDate'),
    datePlaceholder,
  )
  const birthDateFilterElement = createDateFilterElement(
    t('patients.fields.birthDate'),
    datePlaceholder,
  )
  const createdAtFilterElement = createDateFilterElement(
    t('patients.fields.createdAt'),
    datePlaceholder,
  )
  const insuredFilterElement = createBooleanFilterElement(
    t('patients.fields.isInsured'),
    'patient-filter-insured',
  )
  const followUpFilterElement = createBooleanFilterElement(
    t('patients.fields.isFollowUp'),
    'patient-filter-followup',
  )
  const vaccinatedFilterElement = createBooleanFilterElement(
    t('patients.fields.isVaccinated'),
    'patient-filter-vaccinated',
  )
  const actionsBody = createActionsBody(
    t('patients.actions.edit'),
    t('patients.actions.delete'),
    onEditPatient,
    onDeletePatient,
  )

  const tagsFilterElement = useMemo(
    () =>
      createMultiSelectFilterElement(
        collectDistinctTags(patients, compareTurkish).map((tag) => ({
          value: tag,
          label: tag,
        })),
        t('patients.fields.tags'),
        t('filters.tagsPlaceholder'),
      ),
    [patients, t],
  )

  return (
    <AppDataTable
      data={rows}
      loading={loading}
      dataKey="id"
      globalFilterFields={GLOBAL_FILTER_FIELDS}
      defaultFilters={DEFAULT_FILTERS}
      toolbar={
        <Button
          label={t('patients.actions.add')}
          icon="pi pi-plus"
          onClick={onAddPatient}
        />
      }
    >
      <Column
        field="fullName"
        header={t('patients.fields.fullName')}
        sortable
        sortFunction={fullNameSort}
        filter
        filterPlaceholder={t('filters.textPlaceholder')}
        style={{ minInlineSize: '16rem' }}
      />
      <Column
        field="department"
        header={t('patients.fields.department')}
        sortable
        sortFunction={departmentSort}
        filter
        filterElement={departmentFilterElement}
        body={(patient: PatientListRow) => t(`patients.department.${patient.department}`)}
      />
      <Column
        field="status"
        header={t('patients.fields.status')}
        sortable
        sortFunction={statusSort}
        filter
        filterElement={statusFilterElement}
        body={statusTagBody}
      />
      <Column
        field="priority"
        header={t('patients.fields.priority')}
        sortable
        sortFunction={prioritySort}
        filter
        filterElement={priorityFilterElement}
        body={priorityTagBody}
      />
      <Column
        field="appointmentDate"
        header={t('patients.fields.appointmentDate')}
        sortable
        dataType="date"
        filter
        filterElement={appointmentDateFilterElement}
        body={(patient: PatientListRow) => formatDate(patient.appointmentDate)}
      />
      <Column
        field="birthDate"
        header={t('patients.fields.birthDate')}
        sortable
        dataType="date"
        filter
        filterElement={birthDateFilterElement}
        body={(patient: PatientListRow) => formatDate(patient.birthDate)}
      />
      <Column
        field="bloodType"
        header={t('patients.fields.bloodType')}
        sortable
        sortFunction={bloodTypeSort}
        filter
        filterElement={bloodTypeFilterElement}
        body={(patient: PatientListRow) => t(`patients.bloodType.${patient.bloodType}`)}
      />
      <Column
        field="score"
        header={t('patients.fields.score')}
        sortable
        dataType="numeric"
        filter
        filterElement={scoreFilterElement}
      />
      <Column
        field="diagnosis"
        header={t('patients.fields.diagnosis')}
        sortable
        sortFunction={diagnosisSort}
        filter
        filterPlaceholder={t('filters.textPlaceholder')}
      />
      <Column
        field="note"
        header={t('patients.fields.note')}
        sortable
        sortFunction={noteSort}
        filter
        filterPlaceholder={t('filters.textPlaceholder')}
        style={{ minInlineSize: '24rem' }}
      />
      <Column
        field="isInsured"
        header={t('patients.fields.isInsured')}
        sortable
        dataType="boolean"
        filter
        filterElement={insuredFilterElement}
        body={insuredBody}
      />
      <Column
        field="isFollowUp"
        header={t('patients.fields.isFollowUp')}
        sortable
        dataType="boolean"
        filter
        filterElement={followUpFilterElement}
        body={followUpBody}
      />
      <Column
        field="isVaccinated"
        header={t('patients.fields.isVaccinated')}
        sortable
        dataType="boolean"
        filter
        filterElement={vaccinatedFilterElement}
        body={vaccinatedBody}
      />
      <Column
        field="tags"
        header={t('patients.fields.tags')}
        filter
        showFilterMatchModes={false}
        filterElement={tagsFilterElement}
        body={tagsBody}
        style={{ minInlineSize: '16rem' }}
      />
      <Column
        field="createdAt"
        header={t('patients.fields.createdAt')}
        sortable
        dataType="date"
        filter
        filterElement={createdAtFilterElement}
        body={(patient: PatientListRow) => formatDate(patient.createdAt)}
      />
      <Column
        frozen
        alignFrozen="right"
        header={<span className="sr-only">{t('patients.actions.header')}</span>}
        body={actionsBody}
      />
    </AppDataTable>
  )
}
