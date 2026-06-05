import type { ReactNode } from 'react'
import { Dialog } from 'primereact/dialog'

interface AppDialogProps {
  visible: boolean
  header: string
  footer?: ReactNode
  onHide: () => void
  children: ReactNode
}

export function AppDialog({ visible, header, footer, onHide, children }: AppDialogProps) {
  return (
    <Dialog
      visible={visible}
      modal
      draggable={false}
      className="app-dialog"
      header={header}
      footer={footer}
      style={{ width: '800px', maxHeight: 'min(750px, 70vh)' }}
      breakpoints={{ '960px': '75vw', '640px': '95vw' }}
      onHide={onHide}
    >
      {children}
    </Dialog>
  )
}
