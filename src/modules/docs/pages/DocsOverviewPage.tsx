import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { docsRegistry } from '../constants/docs-registry'
import { DOCS_ROUTES } from '../routes'

export default function DocsOverviewPage() {
  const { t } = useTranslation()
  const entries = [...docsRegistry].sort((first, second) => first.order - second.order)

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link
              to={DOCS_ROUTES.VIEWER.build(entry.slug)}
              className="card group flex h-full flex-col gap-3 p-5 no-underline transition-colors hover:bg-surface-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 text-primary transition-colors group-hover:bg-surface-200"
                aria-hidden="true"
              >
                <i className={`${entry.icon} text-lg`} />
              </span>
              <span className="text-base font-semibold text-text transition-colors group-hover:text-primary">
                {t(entry.titleKey)}
              </span>
              <span className="text-sm leading-relaxed text-text-secondary">
                {t(entry.descriptionKey)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
