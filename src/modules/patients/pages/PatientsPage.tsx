import { ErrorState } from '@/components/ErrorState'

import { PatientList } from '../components/PatientList'
import { usePatients } from '../composables/usePatients'

export default function PatientsPage() {
  const { data, isPending, isError, refetch } = usePatients()

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div className="card p-4">
      <PatientList patients={data ?? []} loading={isPending} />
    </div>
  )
}
