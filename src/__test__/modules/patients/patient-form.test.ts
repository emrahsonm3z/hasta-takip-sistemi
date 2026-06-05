import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createEmptyFormValues,
  type PatientFormValues,
  toFormValues,
  toPatientRecord,
} from '../../../modules/patients/lib/patient.form.ts'
import { buildPatientFormSchema } from '../../../modules/patients/lib/patient-form.schema.ts'
import type { PatientRecord } from '../../../modules/patients/models/patient.model.ts'

const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

const validValues: PatientFormValues = {
  fullName: 'Şule Özdemir',
  birthDate: new Date(1980, 3, 1),
  bloodType: 'B-',
  department: 'neurology',
  status: 'waiting',
  priority: 'normal',
  appointmentDate: inSevenDays,
  score: 3,
  diagnosisTr: 'Migren',
  diagnosisEn: 'Migraine',
  noteTr: '',
  noteEn: '',
  isInsured: true,
  isFollowUp: false,
  isVaccinated: true,
  tags: ['kalp'],
}

const createSchema = buildPatientFormSchema('create')
const editSchema = buildPatientFormSchema('edit')

const isValid = (overrides: Partial<PatientFormValues>): boolean =>
  createSchema.isValidSync({ ...validValues, ...overrides })

test('the schema accepts a fully valid record', () => {
  assert.equal(createSchema.isValidSync(validValues), true)
})

test('the schema accepts empty optional notes and empty tags', () => {
  assert.equal(isValid({ noteTr: '', noteEn: '', tags: [] }), true)
})

test('the schema rejects a missing or too-short full name', () => {
  assert.equal(isValid({ fullName: '' }), false)
  assert.equal(isValid({ fullName: 'A' }), false)
})

test('the schema rejects values outside the enum unions', () => {
  assert.equal(
    isValid({ department: 'urology' as PatientFormValues['department'] }),
    false,
  )
  assert.equal(isValid({ status: null }), false)
  assert.equal(isValid({ bloodType: 'O+' as PatientFormValues['bloodType'] }), false)
})

test('the schema rejects a birth date in the future', () => {
  const future = new Date(Date.now() + 24 * 60 * 60 * 1000)
  assert.equal(isValid({ birthDate: future, appointmentDate: future }), false)
})

test('the schema rejects an appointment before the birth date', () => {
  assert.equal(isValid({ appointmentDate: new Date(1970, 0, 1) }), false)
})

test('create mode rejects a past appointment but allows today', () => {
  assert.equal(isValid({ appointmentDate: yesterday }), false)
  assert.equal(isValid({ appointmentDate: new Date() }), true)
})

test('edit mode allows a past appointment but still respects the birth date', () => {
  assert.equal(
    editSchema.isValidSync({ ...validValues, appointmentDate: yesterday }),
    true,
  )
  assert.equal(
    editSchema.isValidSync({ ...validValues, appointmentDate: new Date(1970, 0, 1) }),
    false,
  )
})

test('the schema rejects scores outside 1-5 and non-integers', () => {
  assert.equal(isValid({ score: 0 }), false)
  assert.equal(isValid({ score: 6 }), false)
  assert.equal(isValid({ score: 2.5 }), false)
  assert.equal(isValid({ score: null }), false)
})

test('the schema requires both diagnosis languages', () => {
  assert.equal(isValid({ diagnosisTr: '' }), false)
  assert.equal(isValid({ diagnosisEn: '' }), false)
})

test('createEmptyFormValues starts blank with safe defaults', () => {
  const empty = createEmptyFormValues()
  assert.equal(empty.fullName, '')
  assert.equal(empty.birthDate, null)
  assert.equal(empty.score, null)
  assert.equal(empty.isInsured, false)
  assert.deepEqual(empty.tags, [])
})

test('toFormValues and toPatientRecord round-trip a record', () => {
  const record: PatientRecord = {
    id: 'pat-001',
    createdAt: '2023-09-12T00:00:00.000Z',
    notes: 'Hasta takip altında.',
    fullName: 'Şule Özdemir',
    birthDate: '1980-04-01T00:00:00.000Z',
    appointmentDate: '2024-02-14T00:00:00.000Z',
    bloodType: 'B-',
    department: 'neurology',
    status: 'waiting',
    priority: 'normal',
    score: 3,
    diagnosisTr: 'Migren',
    diagnosisEn: 'Migraine',
    noteTr: 'Not',
    noteEn: 'Note',
    isInsured: true,
    isFollowUp: false,
    isVaccinated: true,
    tags: ['kalp', 'kronik'],
  }
  const roundTripped = toPatientRecord(toFormValues(record), {
    id: record.id,
    createdAt: record.createdAt,
    notes: record.notes,
  })
  assert.deepEqual(roundTripped, record)
})

test('toPatientRecord trims text fields and drops empty tags', () => {
  const record = toPatientRecord(
    { ...validValues, fullName: '  Ali Veli  ', tags: [' kalp ', '  '] },
    { id: 'pat-x', createdAt: '2026-01-01T00:00:00.000Z', notes: null },
  )
  assert.equal(record.fullName, 'Ali Veli')
  assert.deepEqual(record.tags, ['kalp'])
})

test('toPatientRecord refuses incomplete values', () => {
  assert.throws(() =>
    toPatientRecord(
      { ...validValues, birthDate: null },
      { id: 'pat-x', createdAt: '2026-01-01T00:00:00.000Z', notes: null },
    ),
  )
})
