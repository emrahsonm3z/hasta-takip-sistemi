# Patients Module

This document describes the patient tracking feature. Honest status: **the
data layer (1.1) and the list screen (1.2) are shipped** — the module loads,
stores, lists, sorts, filters, and searches patient records. Add/edit/delete
(1.3) is still planned and marked so at the bottom.

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
├── components/
│   └── PatientList.tsx        The 7-column list over AppDataTable
├── constants/
│   ├── patient-tag.constants.ts  status/priority → Tag severity maps
│   └── query-keys.ts          patientKeys factory
├── lib/
│   ├── patient-list.lib.ts    buildStatusFilterOptions (pure, unit-tested)
│   ├── patient.mapper.ts      raw row → typed PatientRecord (pure, unit-tested)
│   └── patient-storage.lib.ts createPatientStorage core (pure, unit-tested)
├── models/
│   └── patient.model.ts       PatientRecord + the four enum-like unions
├── pages/PatientsPage.tsx     Thin: usePatients → ErrorState | PatientList on a .card
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
`ErrorState` with retry — the `throwOnError: false` and `retry: 1` behaviour
comes from the global QueryClient defaults (`plugins/react-query.ts`); the
hook itself sets only the key and the query function.

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

## The list (shipped, Sprint 1.2)

`PatientsPage` is a thin shell: `usePatients()` → `ErrorState` (with retry) on
a read failure, otherwise `PatientList` on a `.card` surface.

**Scope, honestly stated:** the list deliberately EXCEEDS the case study's
"one sort, one filter, one search" minimum — the owner chose the full feature
set. What is built: **15 columns, every column sortable, every column with a
type-appropriate menu filter, plus the global search.**

| Column | Renders | Sorts by | Filters with |
| --- | --- | --- | --- |
| fullName | text | Turkish collator | text, standard match modes (Turkish-aware) |
| department | translated label | Turkish collator (displayed label) | dropdown |
| status | `Tag` (severity map) | defined enum order | dropdown |
| priority | `Tag` (severity map) | defined enum order | dropdown |
| appointmentDate | `formatDate 'L'` | natural | Calendar + date match modes (dateIs default) |
| birthDate | `formatDate 'L'` | natural | Calendar + date match modes |
| bloodType | translated notation | Turkish collator | dropdown |
| score | number | natural | InputNumber + numeric match modes |
| diagnosis | locale-aware derived field | Turkish collator | text, standard match modes |
| note | locale-aware derived field | Turkish collator | text, standard match modes |
| isInsured / isFollowUp / isVaccinated | success/danger icon (check / times) | natural | labelled TriStateCheckbox (yes / no / any) |
| tags | `Chip`s | — (not sortable) | any-of multiselect, comma display (`arrayContainsAny`) |
| createdAt | `formatDate 'L'` | natural | Calendar + date match modes |

The mechanics:

- **Standard menu-filter behaviour** (the official custom_filter demo): every
  filter menu shows the default **Clear + Apply** buttonbar, and a filter
  applies ONLY when Apply is pressed — nothing filters on change. The default
  match-mode dropdown is shown per type (text / numeric / date / enum
  columns); it is hidden only where a type has none — booleans hide it
  automatically (`dataType="boolean"`), and the tags multiselect sets
  `showFilterMatchModes={false}`, exactly as the demo does for its
  representative column.
- **Turkish-aware standard text modes.** The six standard text match modes
  (starts with / contains / not contains / ends with / equals / not equals)
  are globally overridden with Turkish-normalized implementations
  (`lib/filters.ts`, registered in `plugins/primereact.ts`) — so the
  match-mode dropdown offers the standard choices and ALL of them match
  Turkish-insensitively. The global search box rides the same (now Turkish)
  built-in `contains`.
- **Reusable filter elements, one shared module**
  (`components/AppDataTableFilters.tsx` — PrimeReact 10 ships only an
  InputText default element, verified in source): ONE enum Dropdown factory
  (status/priority pass a severity-Tag option template), ONE tags
  MultiSelect, plus the demo-standard Calendar / InputNumber /
  TriStateCheckbox elements. All apply via `filterCallback` → Apply.
- **Derived rows.** `buildPatientListRows(patients, localize)` resolves
  `diagnosis`/`note` for the active language (injected `pickLocalized`) AND
  converts the three date fields to real `Date` objects — required by the
  built-in date match modes, which compare dates, not strings. The builder is
  pure and unit-tested; rows re-resolve on language switch.
- **Locale.** The registered TR locale covers EVERY key of PrimeReact's
  default locale (filter vocabulary, calendar, upload/password texts, and all
  `aria.*` labels — completeness verified against
  `primereact/api`'s default object); EN pins the same set over the built-in
  defaults. The whole component vocabulary follows the active language and
  re-renders live on switch. Every filter
  input shows a localized placeholder (`filters.*` keys: "Ara…",
  "gg.aa.yyyy", "Sayı girin", "Seçiniz", "Tümü" — and their English
  counterparts). Every filter overlay has ONE consistent
  `16rem` width with a compact section rhythm (0.75rem section padding,
  0.5rem below the match-mode dropdown) via `_prime-skin.scss`. Boolean
  filters are a labelled TriStateCheckbox (field name beside the box);
  boolean cells render success/danger icons (the Tag severity hues, exposed
  as `--app-success`/`--app-danger`). The fullName / note / tags columns
  carry doubled min-widths (16 / 24 / 16rem); the rest auto-fit.
- **Layout.** Columns auto-fit their content above the wrapper's fixed
  `72rem` table floor; on narrow viewports the table scrolls horizontally
  inside its region (the floor is what makes the scroll real instead of
  crushed columns) — a true mobile layout (stacked/priority columns) is a
  separate, later decision. Rows sit
  transparent on the card with hairline gridlines (no stripes).

---

## The form (shipped, Sprint 1.3): add / edit / delete

ONE reusable dialog serves both create and edit — `PatientDialog` hosts
`PatientForm` inside the global `AppDialog` shell (800px desktop base,
max-height `min(750px, 70vh)`, pinned header + footer with only the content
scrolling, 75vw/95vw responsive breakpoints). Only three things differ by
mode: the title ("Yeni Hasta" / "Hasta Düzenle"), the initial values
(`createEmptyFormValues()` / `toFormValues(record)`), and the submit target
(add / update mutation). The footer Kaydet is DISABLED until the form is
dirty (`FormDirtyListener` → `disabled={!dirty}`): create starts disabled,
and reverting an edit back to its initial values re-disables it.

- **Form.** Built ONLY from the shared `Form*` wrappers. Sections (uppercase
  muted heading + hairline, i18n `patients.form.sections.*`): patient info
  (fullName full-width; birthDate + bloodType), appointment (department +
  status; priority + appointmentDate; score), diagnosis TR/EN side by side,
  note TR/EN side by side, the three boolean checkboxes in ONE row at all
  widths (inline box + label), tags as a Chips input. Everything else
  collapses to a single column on narrow widths. Status/priority dropdowns
  render the severity Tags (options + selected value) from the shared
  `PatientTags` source. Every input has a localized placeholder
  (`patients.form.placeholders.*`).
- **Validation** (`buildPatientFormSchema(mode)`, Yup, all messages via the
  typed `message()` helper): fullName required 2–120; the four enums required
  + `oneOf` membership; birthDate required, not in the future; appointment
  required, ≥ birthDate in BOTH modes, and in CREATE mode additionally ≥
  today (date-only; the Calendar also sets `minDate`) — EDIT keeps past
  appointments editable; score required integer 1–5; diagnosis required in
  BOTH languages (min 2); notes optional; tags optional, trimmed.
- **System fields.** `id` (`pat-` + UUID) and `createdAt` are generated on
  create; on edit they are preserved, as is the non-editable `notes` field.
  The pure `toPatientRecord(values, system)` merges them and is unit-tested.
- **Row actions.** A frozen-right actions column (always visible under the
  horizontal scroll; the frozen cells get an opaque card background with a
  layered hover tint in `_prime-skin.scss`) with aria-labelled edit + delete
  icon buttons. Edit opens the dialog pre-filled; delete runs
  `confirmDialog()` naming the patient ("{{name}} silinsin mi?"), accept →
  the remove mutation. There is NO row-click navigation (decided in 1.3).
- **Data.** Everything goes through `usePatientMutations` (storage →
  invalidate → toasts); the data layer was not touched.
