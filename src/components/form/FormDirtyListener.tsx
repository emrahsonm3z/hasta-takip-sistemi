import { useEffect } from 'react'
import { useFormikContext } from 'formik'

interface FormDirtyListenerProps {
  onDirtyChange: (dirty: boolean) => void
}

export function FormDirtyListener({ onDirtyChange }: FormDirtyListenerProps) {
  const { dirty } = useFormikContext()

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])

  return null
}
