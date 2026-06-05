# Patients Module

This document describes the patient tracking feature. Honest status up front:
**what ships today is the module's skeleton** — the route, the sidebar entry,
and a placeholder page. The data layer is Sprint 1.1; the list screen is 1.2;
add/edit/delete is 1.3. Everything below is explicitly split into "exists
now" and "planned".

---

## What exists today

The module is wired into the app the standard way (see "Architecture"), with
three files:

```
src/modules/patients/
├── pages/PatientsPage.tsx    Placeholder page (renders the title)
├── routes.tsx                PATIENT_ROUTES constants + the route array
└── index.ts                  Barrel: export { PATIENT_ROUTES, patientRoutes }
```

The route constants — the single source the router AND the sidebar menu read
(this is why the menu can never disagree with the routes):

```tsx
export const PATIENT_ROUTES = {
  LIST: {
    name: 'patients',
    path: '/patients',
    titleKey: 'patients.title',
    icon: 'pi pi-users',
    menuOrder: 1,
  },
} as const
```

`/` redirects here — Patients is the app's landing page. The locale files
already carry the full bilingual vocabulary the feature will use:
`patients.fields.*` (15 field labels), `patients.status.*`,
`patients.priority.*`, `patients.department.*`, and `patients.bloodType.*` —
see "Languages (TR / EN)" for the code↔label tables.

---

## Planned — Sprint 1.1: the data layer

The agreed contract (no code exists yet; details in "Data & Storage" and the
sprint plan):

| Piece | File (planned) | Job |
| --- | --- | --- |
| Model | `models/patient.model.ts` | Flat camelCase `PatientRecord` + enum-like unions |
| Mapper | `lib/patient.mapper.ts` | Raw snake_case API rows → typed model (seed only) |
| API | `api/patients.api.ts` | The one read-only GET (`VITE_API_URL`) |
| Storage | `api/patients.storage.ts` | `patientStorage.{read,write,add,update,remove,clear}` over `localStorage` |
| Query keys | `constants/query-keys.ts` | `patientKeys` factory |
| Read + seed | `composables/usePatients.ts` | `useQuery`: read storage; if empty, GET → map → write |
| Mutations | `composables/usePatientMutations.ts` | add/update/remove → invalidate `patientKeys.all()` |

The record's fields (from the case-study data model — `id`, `fullName`,
`birthDate`, `appointmentDate`, `createdAt`, `department`, `status`,
`priority`, `bloodType`, `score`, bilingual `note`/`diagnosis` pairs,
`isInsured`, `isFollowUp`, `isVaccinated`, `tags`) will be typed against the
live API when 1.1 lands.

---

## Planned — Sprints 1.2 / 1.3: the screens

- **1.2 — the list:** `AppDataTable` with Turkish-aware global search, one
  column sort, one column filter, status/priority rendered as translated
  labels, dates through `formatDate`.
- **1.3 — add / edit / delete:** a PrimeReact Dialog form built from the
  shared `Form*` fields, Yup validation with typed bilingual messages, both
  language variants of note/diagnosis side by side, delete with confirmation,
  toasts via `useNotify`.

This page will be rewritten with the real code as those sprints land (the
sprint plan tracks this as task 2.1).
