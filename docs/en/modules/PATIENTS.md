# Patients Module

This document describes the patient tracking feature. Honest status: **the
data layer is shipped** (Sprint 1.1) — the module loads, stores, and mutates
patient records end to end. The screens are still to come: the list is 1.2,
add/edit/delete is 1.3; they are marked planned at the bottom.

---

## Files

```
src/modules/patients/
├── api/
│   ├── patients.api.ts        fetchRawPatients() — the one read-only GET
│   └── patients.storage.ts    patientStorage bound to window.localStorage
├── composables/
│   ├── usePatients.ts         useQuery: read storage, seed once if empty
│   └── usePatientMutations.ts add / update / remove + invalidate + toasts
├── constants/
│   └── query-keys.ts          patientKeys factory
├── lib/
│   ├── patient.mapper.ts      raw row → typed PatientRecord (pure, unit-tested)
│   └── patient-storage.lib.ts createPatientStorage core (pure, unit-tested)
├── models/
│   └── patient.model.ts       PatientRecord + the four enum-like unions
├── pages/PatientsPage.tsx     Placeholder page (the 1.2 list replaces it)
├── routes.tsx                 PATIENT_ROUTES constants + the route array
└── index.ts                   barrel
```

`/` redirects to `/patients` — this module is the app's landing page.

---

## The model

Flat camelCase, no nesting, no free strings on the enum fields — typed
against the live API (50 rows verified):

```ts
export interface PatientRecord {
  id: string
  fullName: string
  birthDate: string
  appointmentDate: string
  createdAt: string
  department: PatientDepartment
  status: PatientStatus
  priority: PatientPriority
  bloodType: PatientBloodType
  score: number
  noteTr: string
  noteEn: string
  diagnosisTr: string
  diagnosisEn: string
  isInsured: boolean
  isFollowUp: boolean
  isVaccinated: boolean
  tags: string[]
  notes: string | null
}
```

The unions carry the canonical codes (`'waiting' | 'inExamination' |
'completed' | 'cancelled'`, …) — the same codes the locale files use as label
keys, so rendering a label is always ``t(`patients.status.${status}`)``.

---

## The mapper — display values in, codes out

The API sends Turkish display values (`status: "Bekliyor"`,
`priority: "acil"`, `department: "Nöroloji"`) and snake_case localized pairs
(`note_tr`, `diagnosis_en`). The pure mapper normalises both, and **throws on
any unknown value** rather than silently mislabelling a record:

```ts
const STATUS_BY_RAW_VALUE: Record<string, PatientStatus> = {
  Bekliyor: 'waiting',
  Muayenede: 'inExamination',
  Tamamlandı: 'completed',
  İptal: 'cancelled',
}

function coerce<T>(lookup: Record<string, T>, rawValue: string, field: string): T {
  const coerced = lookup[rawValue]
  if (coerced === undefined) {
    throw new Error(`Unknown ${field} value: ${rawValue}`)
  }
  return coerced
}
```

It runs **only on the seed path** — storage round-trips the already-mapped
model.

---

## Storage

The pure core (`createPatientStorage`, unit-tested against an in-memory
backend) is bound to the real `window.localStorage` in one line. All
persistence goes through it; the key is `'patients'`.

| Operation | Behaviour |
| --- | --- |
| `read()` | `[]` on missing, corrupt, or non-array JSON — never throws |
| `write(patients)` | serialises the full list (a quota failure surfaces as the mutation's error toast) |
| `add(patient)` | append |
| `update(patient)` | replace by `id` |
| `remove(id)` | filter by `id` |
| `clear()` | remove the key (reset = clear + invalidate) |

---

## Read + seed

```ts
async function readOrSeedPatients(): Promise<PatientRecord[]> {
  const stored = patientStorage.read()
  if (stored.length > 0) {
    return stored
  }
  const rawRows = await fetchRawPatients()
  const patients = mapRawPatients(rawRows)
  patientStorage.write(patients)
  return patients
}

export function usePatients() {
  return useQuery({ queryKey: patientKeys.list(), queryFn: readOrSeedPatients })
}
```

First visit: one GET to `VITE_API_URL`, mapped, persisted. Every visit after:
storage only. The double-invoke under React StrictMode is harmless — the
second seed writes identical data. A failed GET renders the standard
`ErrorState` with retry (`throwOnError: false`, `retry: 1`).

---

## Mutations

`usePatientMutations` exposes `addPatient`, `updatePatient`, `removePatient`.
Each one calls the storage service, then invalidates `patientKeys.all()` —
invalidation-only, no manual cache patching — and speaks through `useNotify`
(typed keys: `patients.notifications.added` / `.updated` / `.removed` on
success, `errors.saveFailed` on failure).

```ts
const settle = async (successKey: TranslationKey) => {
  await queryClient.invalidateQueries({ queryKey: patientKeys.all() })
  notify.success(successKey)
}
```

---

## Tests

`src/__test__/modules/patients/` — 16 specs: the mapper (camelCase
flattening, every status/department coercion, tag copying, throw-on-unknown
for all four enums), storage CRUD round-trips incl. corrupt-JSON tolerance,
and the `patientKeys` factory (list extends the root key, so invalidation
always matches).

---

## Planned — Sprints 1.2 / 1.3: the screens

- **1.2 — the list:** `AppDataTable` over `usePatients()` with Turkish-aware
  global search, one column sort, one column filter, translated enum labels,
  dates through `formatDate`.
- **1.3 — add / edit / delete:** a PrimeReact Dialog form built from the
  shared `Form*` fields, Yup validation with typed bilingual messages, both
  language variants of note/diagnosis side by side, delete with confirmation
  — all wired to `usePatientMutations`.
