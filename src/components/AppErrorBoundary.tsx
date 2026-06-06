import { Component, type ErrorInfo, type ReactNode } from 'react'
import { captureException } from '@sentry/react'

import { FatalError } from './FatalError'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.PROD) {
      captureException(error, {
        contexts: { react: { componentStack: info.componentStack } },
      })
    } else {
      console.error('Unhandled render error:', error, info.componentStack)
    }
  }

  render(): ReactNode {
    return this.state.hasError ? <FatalError /> : this.props.children
  }
}
