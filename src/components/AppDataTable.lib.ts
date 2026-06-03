import type { DataTableFilterMeta } from 'primereact/datatable'

export function buildInitialFilters(
  globalMatchMode: string,
  defaultFilters: DataTableFilterMeta | undefined,
  includeGlobal: boolean,
): DataTableFilterMeta {
  const base = includeGlobal
    ? { global: { value: null, matchMode: globalMatchMode } }
    : {}

  return { ...base, ...defaultFilters } as unknown as DataTableFilterMeta
}
