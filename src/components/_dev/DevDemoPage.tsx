import { useState } from 'react'
import { Button } from 'primereact/button'

import { ErrorState } from '@/components/ErrorState'
import { useNotify } from '@/composables/useNotify'
import { normalizeErrorKey } from '@/composables/useNotify.lib'

export default function DevDemoPage() {
  const [crash, setCrash] = useState(false)
  const notify = useNotify()

  if (crash) {
    throw new Error('Demo: route render crash')
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-text">Component demo (DEV)</h1>

      <section className="rounded border border-surface-border p-4">
        <h2 className="mb-3 font-medium text-text">ErrorState</h2>
        <ErrorState onRetry={() => undefined} />
      </section>

      <section className="rounded border border-surface-border p-4">
        <h2 className="mb-3 font-medium text-text">RouteErrorBoundary</h2>
        <button
          type="button"
          className="rounded bg-primary px-3 py-2 text-primary-text"
          onClick={() => {
            setCrash(true)
          }}
        >
          Trigger route render error
        </button>
      </section>

      <section className="rounded border border-surface-border p-4">
        <h2 className="mb-3 font-medium text-text">useNotify</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Success"
            severity="success"
            onClick={() => {
              notify.success('common.save')
            }}
          />
          <Button
            label="Info"
            severity="info"
            onClick={() => {
              notify.info('patients.title')
            }}
          />
          <Button
            label="Error"
            severity="danger"
            onClick={() => {
              notify.error(normalizeErrorKey(new Error('demo')))
            }}
          />
        </div>
      </section>
    </div>
  )
}
