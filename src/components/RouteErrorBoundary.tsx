import { useTranslation } from 'react-i18next'
import { useRouteError } from 'react-router-dom'

export function RouteErrorBoundary() {
  const { t } = useTranslation()
  const error = useRouteError()
  const detail = import.meta.env.DEV && error instanceof Error ? error.message : null

  return (
    <div role="alert" className="p-6">
      <h1 className="text-xl font-semibold text-text">{t('errors.unexpected')}</h1>
      {detail ? <pre className="mt-2 text-sm text-text-secondary">{detail}</pre> : null}
    </div>
  )
}
