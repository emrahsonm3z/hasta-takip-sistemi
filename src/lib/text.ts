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
