import '@/plugins/i18n'
import '@/plugins/yup'
import '@/styles/main.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { PrimeReactProvider } from 'primereact/api'

import App from '@/App'
import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { AppToastProvider } from '@/components/AppToastProvider'
import { ConfigErrorScreen } from '@/components/ConfigErrorScreen'
import { EnvConfigError, validateRequiredEnvVars } from '@/config/env'
import { primeReactConfig } from '@/plugins/primereact'
import { queryClient } from '@/plugins/react-query'
import { applyTheme } from '@/plugins/theme'

const root = createRoot(document.getElementById('root')!)

try {
  validateRequiredEnvVars()
} catch (error) {
  const missingVars = error instanceof EnvConfigError ? error.missingVars : []
  root.render(<ConfigErrorScreen missingVars={missingVars} />)
  throw error
}

applyTheme()

root.render(
  <StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider value={primeReactConfig}>
          <AppToastProvider>
            <App />
          </AppToastProvider>
        </PrimeReactProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
