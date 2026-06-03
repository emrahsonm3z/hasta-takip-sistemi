import i18n from '@/plugins/i18n'

export function FatalError() {
  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ground p-6 text-center text-text"
    >
      <h1 className="text-2xl font-semibold">{i18n.t('errors.unexpected')}</h1>
      <button
        type="button"
        onClick={() => {
          window.location.reload()
        }}
        className="rounded bg-primary px-4 py-2 text-primary-text"
      >
        {i18n.t('common.retry')}
      </button>
    </div>
  )
}
