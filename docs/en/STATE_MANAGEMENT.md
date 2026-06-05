# Data & Storage

This document explains where the patient data comes from, where it is kept,
and what happens when a record is added, edited, or deleted. The big picture
needs no developer background; the contracts below it are exact.

**Honest status note:** the patient data layer described in the second half
(model, mapper, storage service, query keys, composables) is the **designed
contract for Sprint 1.1** and is not in the repository yet. What ships today
is the architecture itself plus one working example of it — the documentation
module's own data flow. Everything is labelled accordingly.

---

## The model

`localStorage` (a small key-value store inside your browser) is the single
persistent source of truth; **TanStack React Query** is the in-memory cache
over it. The server is read-only and is contacted **once**, to seed the
initial list.

```
remote API (GET, once)
      │  raw snake_case rows
      ▼
   mapper (pure)                      ← planned, 1.1
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

## The patient data layer — planned (Sprint 1.1)

The contracts below are the agreed design (see the sprint plan); files and
code land in 1.1.

**Storage service** (`modules/patients/api/patients.storage.ts`):
`patientStorage.{read, write, add, update, remove, clear}` over a JSON value
at `STORAGE_KEY = 'patients'`. `read` returns `[]` on missing or corrupt JSON
instead of crashing; `write` reports a quota failure through a toast.

**Seed flow** (`composables/usePatients.ts`) — on first visit:

1. `useQuery` reads `patientStorage.read()`.
2. Empty? Fetch the GET once, run the mapper, write the result to storage.
3. Return the list. Seeding is idempotent (safe under React StrictMode's
   double-invoke).

**Writes** (`composables/usePatientMutations.ts`): every mutation calls the
storage service, then `queryClient.invalidateQueries(patientKeys.all())` —
invalidation-only, no manual cache patching. Success and failure both speak
through `useNotify` toasts.

**Mapper boundary:** the API returns raw snake_case rows; the pure mapper
(`lib/patient.mapper.ts`) produces the typed camelCase `PatientRecord` and
runs **only on the seed path**. Storage round-trips the already-mapped model.
There is no storage migration — if the model changes, clear and re-seed
(acceptable for mock data).

---

## If something goes wrong

| Failure | Behaviour |
| --- | --- |
| Seed GET fails | In-page `ErrorState` with retry (query `retry: 1` first) |
| Stored JSON corrupt | Treated as empty — the app re-seeds rather than crashing |
| Storage quota exceeded | Error toast via `useNotify` *(planned, 1.1)* |
| A document file fails to load | Same `ErrorState` pattern in the docs viewer (live today) |
