import { useState } from 'react'
import { Form, Formik } from 'formik'
import { Button } from 'primereact/button'
import * as yup from 'yup'

import { ErrorState } from '@/components/ErrorState'
import { FormInputText } from '@/components/form'
import { useNotify } from '@/composables/useNotify'
import { normalizeErrorKey } from '@/composables/useNotify.lib'

const demoSchema = yup.object({ fullName: yup.string().required().min(3) })

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

      <section className="rounded border border-surface-border p-4">
        <h2 className="mb-3 font-medium text-text">Form* (validation)</h2>
        <Formik
          initialValues={{ fullName: '' }}
          validationSchema={demoSchema}
          onSubmit={() => undefined}
        >
          <Form className="flex max-w-sm flex-col gap-3">
            <FormInputText name="fullName" labelKey="patients.fields.fullName" />
            <Button type="submit" label="Submit" />
          </Form>
        </Formik>
      </section>
    </div>
  )
}
