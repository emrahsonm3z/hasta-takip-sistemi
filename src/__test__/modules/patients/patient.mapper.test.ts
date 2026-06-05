import assert from 'node:assert/strict'
import test from 'node:test'

import {
  mapRawPatient,
  mapRawPatients,
} from '../../../modules/patients/lib/patient.mapper.ts'
import type { RawPatientRow } from '../../../modules/patients/models/patient.model.ts'

const rawRow: RawPatientRow = {
  id: 'pat-001',
  fullName: 'Şule Özdemir',
  birthDate: '1980-04-01',
  appointmentDate: '2024-02-14T00:00:00',
  createdAt: '2023-09-12T00:00:00',
  department: 'Nöroloji',
  status: 'İptal',
  priority: 'acil',
  bloodType: 'B-',
  score: 2,
  note_tr: 'Ek tetkik istendi.',
  note_en: 'Complaints have decreased.',
  diagnosis_tr: 'Hipotiroidi',
  diagnosis_en: 'Hypothyroidism',
  isInsured: true,
  isFollowUp: false,
  isVaccinated: true,
  tags: ['kalp', 'kronik'],
  notes: null,
}

test('mapRawPatient flattens localized fields to camelCase', () => {
  const patient = mapRawPatient(rawRow)
  assert.equal(patient.noteTr, 'Ek tetkik istendi.')
  assert.equal(patient.noteEn, 'Complaints have decreased.')
  assert.equal(patient.diagnosisTr, 'Hipotiroidi')
  assert.equal(patient.diagnosisEn, 'Hypothyroidism')
})

test('mapRawPatient coerces Turkish display values to canonical codes', () => {
  const patient = mapRawPatient(rawRow)
  assert.equal(patient.status, 'cancelled')
  assert.equal(patient.priority, 'urgent')
  assert.equal(patient.department, 'neurology')
  assert.equal(patient.bloodType, 'B-')
})

test('mapRawPatient coerces every status value', () => {
  const statusPairs = [
    ['Bekliyor', 'waiting'],
    ['Muayenede', 'inExamination'],
    ['Tamamlandı', 'completed'],
    ['İptal', 'cancelled'],
  ] as const
  for (const [rawValue, code] of statusPairs) {
    assert.equal(mapRawPatient({ ...rawRow, status: rawValue }).status, code)
  }
})

test('mapRawPatient coerces every department value', () => {
  const departmentPairs = [
    ['Dahiliye', 'internalMedicine'],
    ['Kardiyoloji', 'cardiology'],
    ['Nöroloji', 'neurology'],
    ['Ortopedi', 'orthopedics'],
    ['Pediatri', 'pediatrics'],
  ] as const
  for (const [rawValue, code] of departmentPairs) {
    assert.equal(mapRawPatient({ ...rawRow, department: rawValue }).department, code)
  }
})

test('mapRawPatient passes plain fields and copies tags', () => {
  const patient = mapRawPatient(rawRow)
  assert.equal(patient.id, 'pat-001')
  assert.equal(patient.score, 2)
  assert.equal(patient.notes, null)
  assert.deepEqual(patient.tags, ['kalp', 'kronik'])
  assert.notEqual(patient.tags, rawRow.tags)
})

test('mapRawPatient throws on unknown enum values', () => {
  assert.throws(() => mapRawPatient({ ...rawRow, status: 'Bilinmiyor' }))
  assert.throws(() => mapRawPatient({ ...rawRow, priority: 'yüksek' }))
  assert.throws(() => mapRawPatient({ ...rawRow, department: 'Üroloji' }))
  assert.throws(() => mapRawPatient({ ...rawRow, bloodType: 'O+' }))
})

test('mapRawPatients maps every row', () => {
  const patients = mapRawPatients([rawRow, { ...rawRow, id: 'pat-002' }])
  assert.deepEqual(
    patients.map((patient) => patient.id),
    ['pat-001', 'pat-002'],
  )
})
