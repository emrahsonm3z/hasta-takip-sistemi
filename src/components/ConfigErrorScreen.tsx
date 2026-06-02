import i18n from '@/plugins/i18n'

interface ConfigErrorScreenProps {
  missingVars: readonly string[]
}

export function ConfigErrorScreen({ missingVars }: ConfigErrorScreenProps) {
  const showDetails = import.meta.env.DEV && missingVars.length > 0

  return (
    <div role="alert" className="config-error">
      <h1>{i18n.t('errors.config.title')}</h1>
      <p>{i18n.t('errors.config.message')}</p>
      {showDetails ? <pre>{missingVars.join('\n')}</pre> : null}
    </div>
  )
}
