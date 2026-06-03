import assert from 'node:assert/strict'
import test from 'node:test'

import en from './en.json' with { type: 'json' }
import tr from './tr.json' with { type: 'json' }

function keyPaths(value: unknown, prefix = ''): string[] {
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

test('tr and en locale files have identical key paths', () => {
  const trKeys = keyPaths(tr).sort()
  const enKeys = keyPaths(en).sort()
  assert.deepEqual(trKeys, enKeys)
})
