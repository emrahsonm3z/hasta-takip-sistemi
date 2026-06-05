import assert from 'node:assert/strict'
import test from 'node:test'

import {
  compareTurkish,
  normalizeTurkish,
  sortRowsByTurkishField,
  turkishIncludes,
} from '../../lib/text.ts'

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

test('sortRowsByTurkishField orders rows with the Turkish collator', () => {
  const rows = [{ name: 'Çelik' }, { name: 'Irmak' }, { name: 'Demir' }, { name: 'İnci' }]
  const ascending = sortRowsByTurkishField(rows, 'name', 1)
  assert.deepEqual(
    ascending.map((row) => row.name),
    ['Çelik', 'Demir', 'Irmak', 'İnci'],
  )
})

test('sortRowsByTurkishField reverses for descending order and keeps the input intact', () => {
  const rows = [{ name: 'Demir' }, { name: 'Çelik' }]
  const descending = sortRowsByTurkishField(rows, 'name', -1)
  assert.deepEqual(
    descending.map((row) => row.name),
    ['Demir', 'Çelik'],
  )
  assert.deepEqual(
    rows.map((row) => row.name),
    ['Demir', 'Çelik'],
  )
})

test('sortRowsByTurkishField treats null and undefined fields as empty strings', () => {
  const rows = [{ name: 'Ali' }, { name: null }, { name: 'Ayşe' }]
  const ascending = sortRowsByTurkishField(rows, 'name', 1)
  assert.deepEqual(
    ascending.map((row) => row.name),
    [null, 'Ali', 'Ayşe'],
  )
})
