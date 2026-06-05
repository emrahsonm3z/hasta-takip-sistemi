import assert from 'node:assert/strict'
import test from 'node:test'

import { pickLocalized } from '../../../lib/pickLocalized.ts'
import { compareTurkish } from '../../../lib/text.ts'
import {
  PRIORITY_TAG_SEVERITY,
  STATUS_TAG_SEVERITY,
} from '../../../modules/patients/constants/patient-tag.constants.ts'
import {
  buildBloodTypeFilterOptions,
  buildDepartmentFilterOptions,
  buildPatientListRows,
  buildPriorityFilterOptions,
  buildStatusFilterOptions,
  collectDistinctScores,
  collectDistinctTags,
  sortRowsByValueOrder,
  STATUS_SORT_ORDER,
} from '../../../modules/patients/lib/patient-list.lib.ts'
import type { PatientRecord } from '../../../modules/patients/models/patient.model.ts'

const basePatient: PatientRecord = {
  id: 'pat-001',
  fullName: 'Şule Özdemir',
  birthDate: '1980-04-01',
  appointmentDate: '2024-02-14T00:00:00',
  createdAt: '2023-09-12T00:00:00',
  department: 'neurology',
  status: 'waiting',
  priority: 'normal',
  bloodType: 'B-',
  score: 2,
  noteTr: 'Not TR',
  noteEn: 'Note EN',
  diagnosisTr: 'Tanı TR',
  diagnosisEn: 'Diagnosis EN',
  isInsured: true,
  isFollowUp: false,
  isVaccinated: true,
  tags: ['kalp', 'çay'],
  notes: null,
}

test('buildStatusFilterOptions returns one option per status code', () => {
  const options = buildStatusFilterOptions()
  assert.deepEqual(
    options.map((option) => option.value),
    ['waiting', 'inExamination', 'completed', 'cancelled'],
  )
  for (const option of options) {
    assert.equal(option.labelKey, `patients.status.${option.value}`)
  }
})

test('every status code has a tag severity', () => {
  assert.deepEqual(Object.keys(STATUS_TAG_SEVERITY).sort(), [
    'cancelled',
    'completed',
    'inExamination',
    'waiting',
  ])
  assert.equal(STATUS_TAG_SEVERITY.waiting, 'warning')
  assert.equal(STATUS_TAG_SEVERITY.inExamination, 'info')
  assert.equal(STATUS_TAG_SEVERITY.completed, 'success')
  assert.equal(STATUS_TAG_SEVERITY.cancelled, 'secondary')
})

test('every priority code has a tag severity', () => {
  assert.deepEqual(Object.keys(PRIORITY_TAG_SEVERITY).sort(), ['normal', 'urgent'])
  assert.equal(PRIORITY_TAG_SEVERITY.urgent, 'danger')
  assert.equal(PRIORITY_TAG_SEVERITY.normal, 'secondary')
})

test('buildPatientListRows resolves diagnosis and note for the active language', () => {
  const localizeTr = (turkish: string, english: string) =>
    pickLocalized(turkish, english, 'tr')
  const localizeEn = (turkish: string, english: string) =>
    pickLocalized(turkish, english, 'en-US')

  const [turkishRow] = buildPatientListRows([basePatient], localizeTr)
  assert.equal(turkishRow.diagnosis, 'Tanı TR')
  assert.equal(turkishRow.note, 'Not TR')
  assert.ok(turkishRow.appointmentDate instanceof Date)
  assert.ok(turkishRow.birthDate instanceof Date)
  assert.ok(turkishRow.createdAt instanceof Date)
  assert.equal(turkishRow.appointmentDate.getFullYear(), 2024)
  assert.equal(turkishRow.appointmentDate.getMonth(), 1)
  assert.equal(turkishRow.appointmentDate.getDate(), 14)

  const [englishRow] = buildPatientListRows([basePatient], localizeEn)
  assert.equal(englishRow.diagnosis, 'Diagnosis EN')
  assert.equal(englishRow.note, 'Note EN')
})

test('buildPatientListRows falls back to the other language when one side is empty', () => {
  const localizeEn = (turkish: string, english: string) =>
    pickLocalized(turkish, english, 'en')
  const [row] = buildPatientListRows(
    [{ ...basePatient, diagnosisEn: '', noteEn: '' }],
    localizeEn,
  )
  assert.equal(row.diagnosis, 'Tanı TR')
  assert.equal(row.note, 'Not TR')
})

test('sortRowsByValueOrder sorts by the defined enum order in both directions', () => {
  const rows = [
    { ...basePatient, id: 'a', status: 'completed' as const },
    { ...basePatient, id: 'b', status: 'waiting' as const },
    { ...basePatient, id: 'c', status: 'cancelled' as const },
    { ...basePatient, id: 'd', status: 'inExamination' as const },
  ]
  const ascending = sortRowsByValueOrder(rows, (row) => row.status, STATUS_SORT_ORDER, 1)
  assert.deepEqual(
    ascending.map((row) => row.status),
    ['waiting', 'inExamination', 'completed', 'cancelled'],
  )
  const descending = sortRowsByValueOrder(
    rows,
    (row) => row.status,
    STATUS_SORT_ORDER,
    -1,
  )
  assert.deepEqual(
    descending.map((row) => row.status),
    ['cancelled', 'completed', 'inExamination', 'waiting'],
  )
})

test('collectDistinctTags dedupes and sorts with the Turkish collator', () => {
  const tags = collectDistinctTags(
    [basePatient, { ...basePatient, id: 'pat-002', tags: ['diyabet', 'kalp'] }],
    compareTurkish,
  )
  assert.deepEqual(tags, ['çay', 'diyabet', 'kalp'])
})

test('collectDistinctScores dedupes and sorts ascending', () => {
  const scores = collectDistinctScores([
    basePatient,
    { ...basePatient, id: 'pat-002', score: 5 },
    { ...basePatient, id: 'pat-003', score: 2 },
    { ...basePatient, id: 'pat-004', score: 1 },
  ])
  assert.deepEqual(scores, [1, 2, 5])
})

test('every enum filter option builder pairs each value with its locale key', () => {
  assert.equal(buildPriorityFilterOptions().length, 2)
  assert.equal(buildDepartmentFilterOptions().length, 5)
  assert.equal(buildBloodTypeFilterOptions().length, 8)
  for (const option of [
    ...buildPriorityFilterOptions(),
    ...buildDepartmentFilterOptions(),
  ]) {
    assert.ok(option.labelKey.endsWith(option.value))
  }
  assert.equal(buildBloodTypeFilterOptions()[0].labelKey, 'patients.bloodType.0+')
})
