import assert from 'node:assert/strict'
import test from 'node:test'

import {
  arrayContainsAny,
  turkishContains,
  turkishEndsWith,
  turkishEquals,
  turkishNotContains,
  turkishNotEquals,
  turkishStartsWith,
} from '../../lib/filters.ts'

test('every text predicate passes everything when the filter is empty', () => {
  for (const predicate of [
    turkishStartsWith,
    turkishContains,
    turkishNotContains,
    turkishEndsWith,
    turkishEquals,
    turkishNotEquals,
  ]) {
    assert.equal(predicate('İstanbul', null), true)
    assert.equal(predicate('İstanbul', undefined), true)
    assert.equal(predicate('İstanbul', ''), true)
  }
})

test('turkishContains matches case-insensitively under Turkish rules', () => {
  assert.equal(turkishContains('Işık Demir', 'ışık'), true)
  assert.equal(turkishContains('İstanbul', 'ist'), true)
  assert.equal(turkishContains('Ankara', 'xyz'), false)
  assert.equal(turkishContains(null, 'x'), false)
})

test('turkishStartsWith and turkishEndsWith respect Turkish casing', () => {
  assert.equal(turkishStartsWith('İnci Yılmaz', 'inci'), true)
  assert.equal(turkishStartsWith('Irmak', 'ır'), true)
  assert.equal(turkishStartsWith('Irmak', 'mak'), false)
  assert.equal(turkishEndsWith('Sarıyer ILICA', 'ılıca'), true)
  assert.equal(turkishEndsWith('Ankara', 'kar'), false)
})

test('turkishEquals stringifies so numbers and booleans still compare', () => {
  assert.equal(turkishEquals('İZMİR', 'izmir'), true)
  assert.equal(turkishEquals(2, 2), true)
  assert.equal(turkishEquals(2, 3), false)
  assert.equal(turkishEquals(true, true), true)
  assert.equal(turkishEquals(null, 'x'), false)
})

test('the negated predicates mirror their counterparts', () => {
  assert.equal(turkishNotContains('Işık', 'ışık'), false)
  assert.equal(turkishNotContains('Ankara', 'xyz'), true)
  assert.equal(turkishNotEquals('İZMİR', 'izmir'), false)
  assert.equal(turkishNotEquals('İzmir', 'Ankara'), true)
  assert.equal(turkishNotEquals(null, 'x'), true)
})

test('arrayContainsAny passes everything when the filter is empty', () => {
  assert.equal(arrayContainsAny(['a'], null), true)
  assert.equal(arrayContainsAny(['a'], []), true)
})

test('arrayContainsAny matches when at least one tag intersects', () => {
  assert.equal(arrayContainsAny(['kalp', 'kronik'], ['kronik']), true)
  assert.equal(arrayContainsAny(['kalp', 'kronik'], ['diyabet', 'kalp']), true)
  assert.equal(arrayContainsAny(['kalp'], ['diyabet']), false)
})

test('arrayContainsAny rejects non-array values when a filter is set', () => {
  assert.equal(arrayContainsAny('kalp', ['kalp']), false)
  assert.equal(arrayContainsAny(null, ['kalp']), false)
})
