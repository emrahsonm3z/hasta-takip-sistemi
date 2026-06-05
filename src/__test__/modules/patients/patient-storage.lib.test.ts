import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createPatientStorage,
  PATIENT_STORAGE_KEY,
  type StorageLike,
} from '../../../modules/patients/lib/patient-storage.lib.ts'
import type { PatientRecord } from '../../../modules/patients/models/patient.model.ts'

function memoryStorage(initial: Record<string, string> = {}): StorageLike {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value)
    },
    removeItem: (key) => {
      values.delete(key)
    },
  }
}

const patient = (id: string, fullName = 'Test Patient'): PatientRecord => ({
  id,
  fullName,
  birthDate: '1980-04-01',
  appointmentDate: '2024-02-14T00:00:00',
  createdAt: '2023-09-12T00:00:00',
  department: 'neurology',
  status: 'waiting',
  priority: 'normal',
  bloodType: 'B-',
  score: 2,
  noteTr: '',
  noteEn: '',
  diagnosisTr: '',
  diagnosisEn: '',
  isInsured: true,
  isFollowUp: false,
  isVaccinated: true,
  tags: [],
  notes: null,
})

test('read returns [] when nothing is stored', () => {
  const storage = createPatientStorage(memoryStorage())
  assert.deepEqual(storage.read(), [])
})

test('read returns [] for corrupt or non-array JSON', () => {
  const corrupt = createPatientStorage(
    memoryStorage({ [PATIENT_STORAGE_KEY]: 'not json {' }),
  )
  assert.deepEqual(corrupt.read(), [])
  const nonArray = createPatientStorage(
    memoryStorage({ [PATIENT_STORAGE_KEY]: '{"id":"x"}' }),
  )
  assert.deepEqual(nonArray.read(), [])
})

test('write then read round-trips records', () => {
  const storage = createPatientStorage(memoryStorage())
  storage.write([patient('pat-001')])
  assert.equal(storage.read().length, 1)
  assert.equal(storage.read()[0].id, 'pat-001')
})

test('add appends to the stored list', () => {
  const storage = createPatientStorage(memoryStorage())
  storage.write([patient('pat-001')])
  storage.add(patient('pat-002'))
  assert.deepEqual(
    storage.read().map((record) => record.id),
    ['pat-001', 'pat-002'],
  )
})

test('update replaces the record with the same id', () => {
  const storage = createPatientStorage(memoryStorage())
  storage.write([patient('pat-001'), patient('pat-002')])
  storage.update(patient('pat-002', 'Updated Name'))
  assert.equal(storage.read()[1].fullName, 'Updated Name')
  assert.equal(storage.read()[0].fullName, 'Test Patient')
})

test('remove deletes only the record with the given id', () => {
  const storage = createPatientStorage(memoryStorage())
  storage.write([patient('pat-001'), patient('pat-002')])
  storage.remove('pat-001')
  assert.deepEqual(
    storage.read().map((record) => record.id),
    ['pat-002'],
  )
})

test('clear removes the stored value entirely', () => {
  const backing = memoryStorage()
  const storage = createPatientStorage(backing)
  storage.write([patient('pat-001')])
  storage.clear()
  assert.equal(backing.getItem(PATIENT_STORAGE_KEY), null)
  assert.deepEqual(storage.read(), [])
})
