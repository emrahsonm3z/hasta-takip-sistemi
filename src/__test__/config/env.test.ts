import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EnvConfigError,
  findMissingEnvVars,
  validateRequiredEnvVars,
} from '../../config/env.ts'

test('findMissingEnvVars reports VITE_API_URL when absent or empty', () => {
  assert.deepEqual(findMissingEnvVars({}), ['VITE_API_URL'])
  assert.deepEqual(findMissingEnvVars({ VITE_API_URL: '' }), ['VITE_API_URL'])
})

test('findMissingEnvVars is empty when VITE_API_URL is present', () => {
  assert.deepEqual(findMissingEnvVars({ VITE_API_URL: 'https://example.test/api' }), [])
})

test('validateRequiredEnvVars throws EnvConfigError listing the missing vars', () => {
  assert.throws(
    () => validateRequiredEnvVars({}),
    (error: unknown) =>
      error instanceof EnvConfigError && error.missingVars.includes('VITE_API_URL'),
  )
})

test('validateRequiredEnvVars passes when required vars are present', () => {
  assert.doesNotThrow(() =>
    validateRequiredEnvVars({ VITE_API_URL: 'https://example.test/api' }),
  )
})
