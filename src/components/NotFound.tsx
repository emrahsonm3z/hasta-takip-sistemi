import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { PATIENT_ROUTES } from '@/modules/patients'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <div role="alert" className="p-6">
      <h1 className="text-xl font-semibold text-text">{t('errors.notFound')}</h1>
      <p className="mt-2 max-w-prose text-sm text-text-secondary">
        {t('errors.notFoundDetail')}
      </p>
      <Link
        to={PATIENT_ROUTES.LIST.path}
        className="mt-4 inline-block font-medium text-primary"
      >
        {t('patients.title')}
      </Link>
    </div>
  )
}
