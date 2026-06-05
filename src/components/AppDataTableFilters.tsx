import type { ReactNode } from 'react'
import { Calendar } from 'primereact/calendar'
import type { ColumnFilterElementTemplateOptions } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { MultiSelect } from 'primereact/multiselect'
import { TriStateCheckbox } from 'primereact/tristatecheckbox'

export interface FilterSelectOption<V> {
  value: V
  label: string
}

export function createEnumFilterElement<V>(
  options: FilterSelectOption<V>[],
  ariaLabel: string,
  placeholder: string,
  itemTemplate?: (option: FilterSelectOption<V>) => ReactNode,
) {
  return (filterOptions: ColumnFilterElementTemplateOptions) => (
    <Dropdown
      value={(filterOptions.value as V | null | undefined) ?? null}
      options={options}
      onChange={(event) => {
        filterOptions.filterCallback(
          (event.value as V | undefined) ?? null,
          filterOptions.index,
        )
      }}
      itemTemplate={itemTemplate}
      showClear
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full"
    />
  )
}

export function createMultiSelectFilterElement(
  options: FilterSelectOption<string>[],
  ariaLabel: string,
  placeholder: string,
) {
  return (filterOptions: ColumnFilterElementTemplateOptions) => (
    <MultiSelect
      value={(filterOptions.value as string[] | null | undefined) ?? []}
      options={options}
      onChange={(event) => {
        const selected = event.value as string[]
        filterOptions.filterCallback(
          selected.length > 0 ? selected : null,
          filterOptions.index,
        )
      }}
      showClear
      display="comma"
      maxSelectedLabels={1}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full"
    />
  )
}

export function createDateFilterElement(ariaLabel: string, placeholder: string) {
  return (filterOptions: ColumnFilterElementTemplateOptions) => (
    <Calendar
      value={(filterOptions.value as Date | null | undefined) ?? null}
      onChange={(event) => {
        filterOptions.filterCallback(event.value ?? null, filterOptions.index)
      }}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full"
    />
  )
}

export function createNumericFilterElement(ariaLabel: string, placeholder: string) {
  return (filterOptions: ColumnFilterElementTemplateOptions) => (
    <InputNumber
      value={(filterOptions.value as number | null | undefined) ?? null}
      onChange={(event) => {
        filterOptions.filterCallback(event.value, filterOptions.index)
      }}
      useGrouping={false}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full"
    />
  )
}

export function createBooleanFilterElement(label: string, labelId: string) {
  return (filterOptions: ColumnFilterElementTemplateOptions) => {
    const value = (filterOptions.value as boolean | null | undefined) ?? null
    const stateClass = value === null ? '' : value ? ' is-true' : ' is-false'
    return (
      <div className={`app-tristate flex items-center gap-2${stateClass}`}>
        <TriStateCheckbox
          value={value}
          onChange={(event) => {
            filterOptions.filterCallback(event.value ?? null, filterOptions.index)
          }}
          aria-labelledby={labelId}
        />
        <span id={labelId} className="font-bold text-text">
          {label}
        </span>
      </div>
    )
  }
}
