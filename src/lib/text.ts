export function normalizeTurkish(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase('tr')
}

const turkishCollator = new Intl.Collator('tr', { numeric: true })

export function compareTurkish(a: string, b: string): number {
  return turkishCollator.compare(a, b)
}

export function turkishIncludes(value: string, query: string): boolean {
  return normalizeTurkish(value).includes(normalizeTurkish(query))
}

export function sortRowsByTurkishValue<T>(
  rows: T[],
  getValue: (row: T) => string,
  order: 1 | -1,
): T[] {
  return [...rows].sort(
    (first, second) => order * compareTurkish(getValue(first), getValue(second)),
  )
}

export function sortRowsByTurkishField<T>(rows: T[], field: keyof T, order: 1 | -1): T[] {
  return sortRowsByTurkishValue(rows, (row) => String(row[field] ?? ''), order)
}
