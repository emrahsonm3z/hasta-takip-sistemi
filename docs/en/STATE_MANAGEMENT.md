# Data & Storage

This document explains where the patient data comes from, where it is kept,
and what happens when a record is added, edited, or deleted. The big picture
needs no developer background; the contracts below it are exact.

**Status:** the patient data layer (model, mapper, storage service, query
keys, composables) **shipped in Sprint 1.1** — everything below is real code
from the repository. Only the screens that will consume it are still planned
(the list is 1.2, the form is 1.3).

---

## The model

`localStorage` (a small key-value store inside your browser) is the single
persistent source of truth; **TanStack React Query** is the in-memory cache
over it. The server is read-only and is contacted **once**, to seed the
initial list.

```
remote API (GET, once)
      │  raw rows (Turkish display values, note_tr/_en pairs)
      ▼
   mapper (pure)
      │  typed camelCase PatientRecord[]
      ▼
localStorage  ──────────────►  React Query cache  ──────────►  screens
 (persistent truth)    read        (in-memory)        render
      ▲                                  │
      └──── add / edit / delete ◄────────┘
            then invalidate (re-read)
```

This is a deliberate case-study choice: the data is mock data. Real patient
data would never live in a browser's local storage.

---

## What exists and runs today

**QueryClient defaults** — `src/plugins/react-query.ts`, exactly as shipped:

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
      throwOnError: false,
    },
  },
})
```

Data never goes stale on its own (`staleTime: Infinity`) — the cache updates
only when an explicit invalidation says "your copy is outdated". Query errors
do not crash into error boundaries (`throwOnError: false`); screens render an
in-page `ErrorState` with a retry button instead.

**A live example of the pattern** — the docs module loads each document
through this exact machinery (`modules/docs/composables/useDocContent.ts`):

```ts
export function useDocContent(entry: DocEntry) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: docsKeys.content(entry.slug, i18n.language),
    queryFn: () => loadDocContent(entry, i18n.language),
  })
}
```

with its query-key factory (`modules/docs/constants/query-keys.ts`):

```ts
export const docsKeys = {
  all: () => ['docs'] as const,
  content: (slug: string, language: string) =>
    ['docs', 'content', slug, language] as const,
}
```

The rule the factory enforces: query keys are **never** hand-written string
arrays at call sites — every key comes from a module's factory, so
invalidation can never miss a spelling.

---

## The patient data layer (shipped, Sprint 1.1)

**Storage service**: the pure core `createPatientStorage`
(`lib/patient-storage.lib.ts`, unit-tested against an in-memory backend) is
bound to the real browser storage in one line
(`api/patients.storage.ts`):

```ts
export const patientStorage = createPatientStorage(window.localStorage)
```

`patientStorage.{read, write, add, update, remove, clear}` over a JSON value
at key `'patients'`. `read` returns `[]` on missing, corrupt, or non-array
JSON instead of crashing; a quota failure on `write` surfaces as the
mutation's error toast.

**Seed flow** (`composables/usePatients.ts`) — exactly as shipped:

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
```

First visit: one GET to `VITE_API_URL`, mapped, persisted. Afterwards:
storage only. Idempotent under React StrictMode's double-invoke (the second
seed writes identical data).

**Writes** (`composables/usePatientMutations.ts`): `addPatient`,
`updatePatient`, `removePatient` — each calls the storage service, then
`queryClient.invalidateQueries({ queryKey: patientKeys.all() })` —
invalidation-only, no manual cache patching. Success and failure both speak
through `useNotify` toasts (typed keys).

**Mapper boundary:** the API returns Turkish display values and snake_case
localized pairs; the pure mapper (`lib/patient.mapper.ts`) produces the typed
camelCase `PatientRecord` — throwing on unknown enum values — and runs **only
on the seed path**. Storage round-trips the already-mapped model. There is no
storage migration — if the model changes, clear and re-seed (acceptable for
mock data). Full detail: the Patients Module doc.

---

## If something goes wrong

| Failure | Behaviour |
| --- | --- |
| Seed GET fails | In-page `ErrorState` with retry (query `retry: 1` first) |
| Stored JSON corrupt | Treated as empty — the app re-seeds rather than crashing |
| Storage quota exceeded | The mutation fails → `errors.saveFailed` toast via `useNotify` |
| A document file fails to load | Same `ErrorState` pattern in the docs viewer (live today) |
