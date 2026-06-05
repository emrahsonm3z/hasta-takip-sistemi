import type { DocEntry } from '../constants/docs-registry'

export const resolveDocPath = (entry: DocEntry, language: string): string => {
  const base = language.split('-')[0]
  return base === 'tr' ? entry.paths.tr : entry.paths.en
}

export const findDocEntry = (entries: DocEntry[], slug: string): DocEntry | undefined =>
  entries.find((entry) => entry.slug === slug)
