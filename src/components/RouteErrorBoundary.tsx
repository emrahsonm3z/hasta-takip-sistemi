import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { captureException } from '@sentry/react'

import { PATIENT_ROUTES } from '@/modules/patients'

export function RouteErrorBoundary() {
  const { t } = useTranslation()
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  useEffect(() => {
    if (!isNotFound && import.meta.env.PROD) {
      captureException(error)
    }
  }, [error, isNotFound])
  const messageKey = isNotFound ? 'errors.notFound' : 'errors.unexpected'
  const detail = import.meta.env.DEV && error instanceof Error ? error.message : null

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ground p-6 text-center text-text"
    >
      <h1 className="text-xl font-semibold">{t(messageKey)}</h1>
      {detail ? <pre className="text-sm text-text-secondary">{detail}</pre> : null}
      <Link to={PATIENT_ROUTES.LIST.path} className="text-primary">
        {t('patients.title')}
      </Link>
    </div>
  )
}
