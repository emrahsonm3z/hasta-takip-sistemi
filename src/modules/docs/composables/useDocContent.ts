import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

import type { DocEntry } from '../constants/docs-registry'
import { docsKeys } from '../constants/query-keys'
import { loadDocContent } from '../lib/docs-loader'

export function useDocContent(entry: DocEntry) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: docsKeys.content(entry.slug, i18n.language),
    queryFn: () => loadDocContent(entry, i18n.language),
  })
}
