import assert from 'node:assert/strict'
import test from 'node:test'

import type { DataTableFilterMeta } from 'primereact/datatable'

import { buildInitialFilters } from '../../components/AppDataTable.lib.ts'

function asMeta(value: Record<string, unknown>): DataTableFilterMeta {
  return value as unknown as DataTableFilterMeta
}

test('includes a global entry with the given match mode when requested', () => {
  const filters = buildInitialFilters('nfcContains', undefined, true) as Record<
    string,
    { value: unknown; matchMode: string }
  >
  assert.equal(filters.global.matchMode, 'nfcContains')
  assert.equal(filters.global.value, null)
})

test('omits the global entry when includeGlobal is false', () => {
  const filters = buildInitialFilters('nfcContains', undefined, false) as Record<
    string,
    unknown
  >
  assert.equal('global' in filters, false)
})

test('merges default column filters alongside the global entry', () => {
  const defaults = asMeta({ department: { value: 'x', matchMode: 'equals' } })
  const filters = buildInitialFilters('nfcContains', defaults, true) as Record<
    string,
    unknown
  >
  assert.equal('global' in filters, true)
  assert.equal('department' in filters, true)
})

test('buildInitialFilters deep-clones the defaults so resets cannot share state', () => {
  const defaults = {
    status: { operator: 'and', constraints: [{ value: null, matchMode: 'equals' }] },
    isInsured: { value: null, matchMode: 'equals' },
  } as unknown as Parameters<typeof buildInitialFilters>[1]
  const first = buildInitialFilters('contains', defaults, true)
  const second = buildInitialFilters('contains', defaults, true)
  const firstStatus = first?.status as { constraints: { value: unknown }[] }
  firstStatus.constraints[0].value = 'waiting'
  const secondStatus = second?.status as { constraints: { value: unknown }[] }
  const defaultStatus = (defaults as Record<string, unknown>).status as {
    constraints: { value: unknown }[]
  }
  assert.equal(secondStatus.constraints[0].value, null)
  assert.equal(defaultStatus.constraints[0].value, null)
})
