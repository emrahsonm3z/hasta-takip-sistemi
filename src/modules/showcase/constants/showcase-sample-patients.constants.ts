export type ShowcaseDepartment =
  | 'internalMedicine'
  | 'cardiology'
  | 'neurology'
  | 'orthopedics'
  | 'pediatrics'

export type ShowcaseStatus = 'waiting' | 'inExamination' | 'completed' | 'cancelled'

export type ShowcasePriority = 'urgent' | 'normal'

export interface ShowcaseSamplePatient {
  id: string
  fullName: string
  department: ShowcaseDepartment
  status: ShowcaseStatus
  priority: ShowcasePriority
  appointmentDate: string
}

export const SHOWCASE_SAMPLE_PATIENTS: ShowcaseSamplePatient[] = [
  {
    id: 's1',
    fullName: 'Ayşe Yılmaz',
    department: 'cardiology',
    status: 'completed',
    priority: 'normal',
    appointmentDate: '2026-06-18',
  },
  {
    id: 's2',
    fullName: 'Mehmet Demir',
    department: 'internalMedicine',
    status: 'waiting',
    priority: 'urgent',
    appointmentDate: '2026-06-22',
  },
  {
    id: 's3',
    fullName: 'Zeynep Kaya',
    department: 'pediatrics',
    status: 'inExamination',
    priority: 'normal',
    appointmentDate: '2026-06-20',
  },
  {
    id: 's4',
    fullName: 'Can Öztürk',
    department: 'neurology',
    status: 'waiting',
    priority: 'normal',
    appointmentDate: '2026-06-25',
  },
  {
    id: 's5',
    fullName: 'Elif Şahin',
    department: 'orthopedics',
    status: 'completed',
    priority: 'urgent',
    appointmentDate: '2026-06-19',
  },
  {
    id: 's6',
    fullName: 'Burak Çelik',
    department: 'internalMedicine',
    status: 'cancelled',
    priority: 'normal',
    appointmentDate: '2026-06-23',
  },
]

export const SHOWCASE_DEPARTMENTS: ShowcaseDepartment[] = [
  'internalMedicine',
  'cardiology',
  'neurology',
  'orthopedics',
  'pediatrics',
]

export const SHOWCASE_STATUSES: ShowcaseStatus[] = [
  'waiting',
  'inExamination',
  'completed',
  'cancelled',
]
