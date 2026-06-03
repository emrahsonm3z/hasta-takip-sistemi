import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeErrorKey } from '../../composables/useNotify.lib.ts'

test('normalizeErrorKey returns errors.unexpected for unknown errors', () => {
  assert.equal(normalizeErrorKey(new Error('boom')), 'errors.unexpected')
  assert.equal(normalizeErrorKey('a string'), 'errors.unexpected')
  assert.equal(normalizeErrorKey(null), 'errors.unexpected')
  assert.equal(normalizeErrorKey(undefined), 'errors.unexpected')
})

test('normalizeErrorKey passes through an error that carries a messageKey', () => {
  assert.equal(normalizeErrorKey({ messageKey: 'errors.notFound' }), 'errors.notFound')
})
