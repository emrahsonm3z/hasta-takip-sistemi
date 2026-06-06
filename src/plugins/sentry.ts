import * as Sentry from '@sentry/react'

import { env } from '@/config/env'

import { shouldDropErrorEvent } from './sentry.lib'

Sentry.init({
  dsn: env.sentryDsn,
  enabled: import.meta.env.PROD && env.sentryDsn !== '',
  environment: import.meta.env.MODE,
  release: `hasta-takip-sistemi@${__APP_VERSION__}`,
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeSend(event) {
    return shouldDropErrorEvent(event) ? null : event
  },
})
