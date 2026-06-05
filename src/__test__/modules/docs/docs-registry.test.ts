import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

import { docsRegistry } from '../../../modules/docs/constants/docs-registry.ts'
import { findDocEntry, resolveDocPath } from '../../../modules/docs/lib/doc-path.ts'

const repoRoot = join(import.meta.dirname, '..', '..', '..', '..')

test('every registry entry resolves to an existing en and tr file', () => {
  for (const entry of docsRegistry) {
    assert.ok(
      existsSync(join(repoRoot, entry.paths.en)),
      `${entry.slug}: missing ${entry.paths.en}`,
    )
    assert.ok(
      existsSync(join(repoRoot, entry.paths.tr)),
      `${entry.slug}: missing ${entry.paths.tr}`,
    )
  }
})

test('registry slugs are unique', () => {
  const slugs = docsRegistry.map((entry) => entry.slug)
  assert.equal(new Set(slugs).size, slugs.length)
})

test('resolveDocPath picks the Turkish file for tr and tr-TR', () => {
  const entry = docsRegistry[0]
  assert.equal(resolveDocPath(entry, 'tr'), entry.paths.tr)
  assert.equal(resolveDocPath(entry, 'tr-TR'), entry.paths.tr)
})

test('resolveDocPath falls back to the English file for other languages', () => {
  const entry = docsRegistry[0]
  assert.equal(resolveDocPath(entry, 'en'), entry.paths.en)
  assert.equal(resolveDocPath(entry, 'en-US'), entry.paths.en)
  assert.equal(resolveDocPath(entry, 'de'), entry.paths.en)
})

test('findDocEntry finds a known slug and misses an unknown one', () => {
  assert.equal(findDocEntry(docsRegistry, 'workflow')?.slug, 'workflow')
  assert.equal(findDocEntry(docsRegistry, 'nope'), undefined)
})
