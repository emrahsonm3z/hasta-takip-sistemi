import type { APIOptions } from 'primereact/api'
import { addLocale, FilterService, locale } from 'primereact/api'

import { turkishIncludes } from '@/lib/text'

export const NFC_CONTAINS = 'nfcContains'

const TR_LOCALE = {
  accept: 'Evet',
  reject: 'Hayır',
  choose: 'Seç',
  cancel: 'İptal',
  clear: 'Temizle',
  apply: 'Uygula',
  today: 'Bugün',
  weekHeader: 'Hf',
  emptyMessage: 'Sonuç bulunamadı',
  emptyFilterMessage: 'Sonuç bulunamadı',
}

addLocale('tr', TR_LOCALE)

function cellText(input: unknown): string {
  return typeof input === 'string' ||
    typeof input === 'number' ||
    typeof input === 'boolean'
    ? String(input)
    : ''
}

FilterService.register(NFC_CONTAINS, (value: unknown, filter: unknown): boolean => {
  if (filter === undefined || filter === null || filter === '') {
    return true
  }
  if (value === undefined || value === null) {
    return false
  }
  return turkishIncludes(cellText(value), cellText(filter))
})

export function setPrimeReactLocale(language: string): void {
  locale(language === 'tr' ? 'tr' : 'en')
}

export const primeReactConfig: Partial<APIOptions> = {
  ripple: true,
}
