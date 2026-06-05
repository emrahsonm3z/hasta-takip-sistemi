import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { ErrorState } from '@/components/ErrorState'
import { Loading } from '@/components/Loading'
import { NotFound } from '@/components/NotFound'

import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useDocContent } from '../composables/useDocContent'
import { type DocEntry, docsRegistry } from '../constants/docs-registry'
import { findDocEntry } from '../lib/doc-path'
import { DOCS_ROUTES } from '../routes'

function DocContent({ entry }: { entry: DocEntry }) {
  const { data, isPending, isError, refetch } = useDocContent(entry)

  if (isPending) {
    return <Loading />
  }

  if (isError || data === undefined) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return <MarkdownRenderer content={data} />
}

export default function DocViewerPage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const entry = slug ? findDocEntry(docsRegistry, slug) : undefined

  if (!entry) {
    return <NotFound />
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        to={DOCS_ROUTES.OVERVIEW.path}
        className="inline-flex items-center gap-2 rounded text-sm font-medium text-text-secondary transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <i className="pi pi-arrow-left text-xs" aria-hidden="true" />
        {t('docs.backToList')}
      </Link>
      <div className="card mt-4 px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <DocContent entry={entry} />
      </div>
    </div>
  )
}
