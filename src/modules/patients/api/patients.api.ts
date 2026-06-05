import { env } from '@/config/env'

import type { RawPatientRow } from '../models/patient.model'

export async function fetchRawPatients(): Promise<RawPatientRow[]> {
  const response = await fetch(env.apiUrl)
  if (!response.ok) {
    throw new Error(`Patient seed request failed with status ${response.status}`)
  }
  return (await response.json()) as RawPatientRow[]
}
