import { type ReactNode, useRef } from 'react'
import { Toast } from 'primereact/toast'

import { ToastContext } from './toast-context'

export function AppToastProvider({ children }: { children: ReactNode }) {
  const toastRef = useRef<Toast>(null)

  return (
    <ToastContext.Provider value={toastRef}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  )
}
