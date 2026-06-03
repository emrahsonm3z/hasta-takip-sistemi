import { useTranslation } from 'react-i18next'

export default function PatientsPage() {
  const { t } = useTranslation()

  return <h1 className="text-2xl font-semibold text-text">{t('patients.title')}</h1>
}
