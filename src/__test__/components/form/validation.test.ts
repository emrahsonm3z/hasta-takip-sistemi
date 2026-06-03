import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveValidationMessage } from '../../../components/form/validation.ts'
import type { TranslationKey } from '../../../types/i18n.types'

const t = (key: TranslationKey, values?: Record<string, unknown>): string =>
  key === 'validation.stringMin' ? `min ${String(values?.min)}` : key

test('resolveValidationMessage parses serialized {key, values} and interpolates', () => {
  const raw = JSON.stringify({ key: 'validation.stringMin', values: { min: 3 } })
  assert.equal(resolveValidationMessage(raw, t), 'min 3')
})

test('resolveValidationMessage resolves a serialized key without values', () => {
  const raw = JSON.stringify({ key: 'validation.required' })
  assert.equal(resolveValidationMessage(raw, t), 'validation.required')
})

test('resolveValidationMessage returns the raw string when not serialized', () => {
  assert.equal(resolveValidationMessage('plain message', t), 'plain message')
  assert.equal(resolveValidationMessage('{"no":"key"}', t), '{"no":"key"}')
})
