import assert from 'node:assert/strict'
import test from 'node:test'

import { formatDate } from '../../lib/date.ts'

test('formatDate formats a valid ISO date with explicit patterns', () => {
  assert.equal(formatDate('2024-01-15', 'YYYY-MM-DD'), '2024-01-15')
  assert.equal(formatDate('2024-01-15', 'DD.MM.YYYY'), '15.01.2024')
})

test('formatDate returns "" for empty, nullish, or invalid input', () => {
  assert.equal(formatDate(''), '')
  assert.equal(formatDate(null), '')
  assert.equal(formatDate(undefined), '')
  assert.equal(formatDate('not-a-date'), '')
})
