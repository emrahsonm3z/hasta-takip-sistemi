import assert from 'node:assert/strict'
import test from 'node:test'

import { pickLocalized } from '../../lib/pickLocalized.ts'

test('pickLocalized picks by base language (region stripped)', () => {
  assert.equal(pickLocalized('Merhaba', 'Hello', 'tr'), 'Merhaba')
  assert.equal(pickLocalized('Merhaba', 'Hello', 'en'), 'Hello')
  assert.equal(pickLocalized('Merhaba', 'Hello', 'en-US'), 'Hello')
})

test('pickLocalized falls back to the other language when one side is empty', () => {
  assert.equal(pickLocalized('', 'Hello', 'tr'), 'Hello')
  assert.equal(pickLocalized('Merhaba', '', 'en'), 'Merhaba')
})
