import assert from 'node:assert/strict'
import test from 'node:test'

import { compareTurkish, normalizeTurkish, turkishIncludes } from '../../lib/text.ts'

test('normalizeTurkish lowercases with Turkish rules (dotless/dotted i)', () => {
  assert.equal(normalizeTurkish('I'), 'ı')
  assert.equal(normalizeTurkish('İ'), 'i')
  assert.equal(normalizeTurkish('İSTANBUL'), 'istanbul')
  assert.equal(normalizeTurkish('IRMAK'), 'ırmak')
})

test('turkishIncludes matches case-insensitively under Turkish rules', () => {
  assert.equal(turkishIncludes('İstanbul', 'ist'), true)
  assert.equal(turkishIncludes('Irmak', 'ır'), true)
  assert.equal(turkishIncludes('Ankara', 'xyz'), false)
})

test('compareTurkish sorts alphabetically and numerically', () => {
  assert.ok(compareTurkish('a', 'b') < 0)
  assert.ok(compareTurkish('b', 'a') > 0)
  assert.ok(compareTurkish('item2', 'item10') < 0)
})
