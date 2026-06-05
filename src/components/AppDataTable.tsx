import { type ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import {
  DataTable,
  type DataTableFilterMeta,
  type DataTableSortEvent,
  type DataTableStateEvent,
} from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'

import { Loading } from '@/components/Loading'
import { useMediaQuery } from '@/composables/useMediaQuery'
import type { TranslationKey } from '@/types/i18n.types'

import { buildInitialFilters } from './AppDataTable.lib'

interface AppDataTableProps<T extends object> {
  data: T[]
  children: ReactNode
  dataKey?: string
  loading?: boolean
  toolbar?: ReactNode
  showSearchBox?: boolean
  globalFilterFields?: string[]
  defaultFilters?: DataTableFilterMeta
  sortField?: string
  sortOrder?: 1 | 0 | -1 | null
  onSort?: (event: DataTableSortEvent) => void
  paginator?: boolean
  rows?: number
  rowsPerPageOptions?: number[]
  rowClass?: (row: T) => string
  rowHover?: boolean
  stripedRows?: boolean
  emptyMessageKey?: TranslationKey
}

const MOBILE_PAGINATOR_TEMPLATE = 'PrevPageLink CurrentPageReport NextPageLink'
const DESKTOP_PAGINATOR_TEMPLATE =
  'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'

export function AppDataTable<T extends object>({
  data,
  children,
  dataKey,
  loading,
  toolbar,
  showSearchBox = true,
  globalFilterFields,
  defaultFilters,
  sortField,
  sortOrder,
  onSort,
  paginator = true,
  rows = 10,
  rowsPerPageOptions = [10, 20, 50],
  rowClass,
  rowHover = true,
  stripedRows = false,
  emptyMessageKey = 'common.noResults',
}: AppDataTableProps<T>) {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [filters, setFilters] = useState<DataTableFilterMeta>(() =>
    buildInitialFilters(FilterMatchMode.CONTAINS, defaultFilters, showSearchBox),
  )

  const globalValue =
    (filters.global as { value?: string | null } | undefined)?.value ?? ''

  const setGlobal = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    }))
  }

  const clearAll = () => {
    setFilters(
      buildInitialFilters(FilterMatchMode.CONTAINS, defaultFilters, showSearchBox),
    )
  }

  const header = (
    <div className="flex flex-wrap items-center gap-2">
      {toolbar}
      <div className="ml-auto flex items-center gap-2">
        {showSearchBox ? (
          <InputText
            value={globalValue}
            placeholder={t('common.search')}
            aria-label={t('common.search')}
            onChange={(event) => {
              setGlobal(event.target.value)
            }}
          />
        ) : null}
        <Button
          icon="pi pi-filter-slash"
          severity="secondary"
          outlined
          aria-label={t('common.clearFilters')}
          tooltip={t('common.clearFilters')}
          onClick={clearAll}
        />
      </div>
    </div>
  )

  if (loading && data.length === 0) {
    return <Loading />
  }

  return (
    <DataTable
      value={data}
      loading={loading}
      dataKey={dataKey}
      paginator={paginator}
      rows={rows}
      rowsPerPageOptions={rowsPerPageOptions}
      paginatorTemplate={
        isMobile ? MOBILE_PAGINATOR_TEMPLATE : DESKTOP_PAGINATOR_TEMPLATE
      }
      currentPageReportTemplate="{first} - {last} / {totalRecords}"
      filters={filters}
      filterDisplay="menu"
      onFilter={(event: DataTableStateEvent) => {
        setFilters(event.filters)
      }}
      globalFilterFields={globalFilterFields}
      header={header}
      emptyMessage={t(emptyMessageKey)}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={onSort}
      removableSort
      scrollable
      rowHover={rowHover}
      stripedRows={stripedRows}
      rowClassName={rowClass}
    >
      {children}
    </DataTable>
  )
}
