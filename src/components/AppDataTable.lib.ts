import type { DataTableFilterMeta } from 'primereact/datatable'

export function buildInitialFilters(
  globalMatchMode: string,
  defaultFilters: DataTableFilterMeta | undefined,
  includeGlobal: boolean,
): DataTableFilterMeta {
  const base = includeGlobal
    ? { global: { value: null, matchMode: globalMatchMode } }
    : {}
  const defaults = defaultFilters ? structuredClone(defaultFilters) : {}

  return { ...base, ...defaults } as unknown as DataTableFilterMeta
}
