import assert from 'node:assert/strict'
import test from 'node:test'

import { patientKeys } from '../../../modules/patients/constants/query-keys.ts'

test('patientKeys.all is the root key', () => {
  assert.deepEqual(patientKeys.all(), ['patients'])
})

test('patientKeys.list extends the root key so invalidation matches it', () => {
  assert.deepEqual(patientKeys.list(), ['patients', 'list'])
  assert.deepEqual(patientKeys.list().slice(0, patientKeys.all().length), [
    ...patientKeys.all(),
  ])
})
