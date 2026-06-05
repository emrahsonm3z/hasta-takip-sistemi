import type { DocEntry } from '../constants/docs-registry'
import { resolveDocPath } from './doc-path'

const docFiles = import.meta.glob<string>(['/docs/**/*.md', '/CHANGELOG.md'], {
  query: '?raw',
  import: 'default',
})

export const loadDocContent = (entry: DocEntry, language: string): Promise<string> => {
  const path = resolveDocPath(entry, language)
  const load = docFiles[path]
  if (!load) {
    return Promise.reject(new Error(path))
  }
  return load()
}
