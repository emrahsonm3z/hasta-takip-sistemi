# Architecture

This document explains how the application is organised: which building blocks
exist, what each one is responsible for, and how they fit together. The plain
sections give everyone the big picture; the code and tables give developers
the exact contracts.

---

## The big picture

A single-page web application for tracking patients. It loads the patient list
once from a read-only data service, keeps all later changes on your own device,
and speaks two languages (Turkish and English). There is no login — the app is
a case study reviewed as-is.

---

## Directory structure

What is in the repository today.

```
src/
├── main.tsx                 Bootstrap: i18n → env check → theme → providers → router
├── config/
│   └── env.ts               Typed frozen env + validateRequiredEnvVars()
├── plugins/                 Third-party library configuration
│   ├── primereact.ts        Provider config + TR locale + Turkish-overridden text filter modes
│   ├── theme.ts             Lara Green light/dark ?url swap over <link id="app-theme">
│   ├── theme.lib.ts         Pure theme-swap logic (unit-tested)
│   ├── react-query.ts       QueryClient defaults
│   ├── dayjs.ts             Day.js plugins + tr/en locales
│   ├── sentry.ts            Errors-only Sentry init (prod + DSN only; pure noise filter in sentry.lib.ts)
│   ├── i18n.ts              react-i18next init + PrimeReact + Day.js bridge
│   └── yup.ts               yup.setLocale() → i18n message keys
├── router/
│   └── index.tsx            createBrowserRouter: layout + module routes + 404
├── components/              Global UI: AppDataTable (+ AppDataTableFilters), AppDialog,
│   │                        AppPrimeReactProvider (locale bridge), AppToastProvider, error screens
│   ├── form/                Formik↔PrimeReact field wrappers (6 fields + FormField shell
│   │                        + FormDirtyListener)
│   └── layout/              AppLayout, AppSidebar, AppTopbar, AppLogo, …
├── composables/             useMenu, useNotify, useMediaQuery (+ pure .lib cores)
├── lib/                     Global pure helpers: text, date, filters, pickLocalized, route
├── locales/                 tr.json + en.json (same key set, test-enforced)
├── styles/                  SCSS (SMACSS) + token aliases
├── types/                   Route handle + TranslationKey typing
├── __test__/                node:test specs mirroring the source tree
└── modules/
    ├── patients/            Patient tracking (complete: list + add/edit/delete)
    │   ├── api/  composables/  constants/  models/  pages/
    │   ├── components/      PatientList, PatientForm, PatientDialog, PatientTags
    │   ├── lib/             patient.mapper, patient.form, patient-form.schema,
    │   │                    patient-list.lib, patient-storage.lib
    │   ├── routes.tsx
    │   └── index.ts
    └── docs/                This documentation viewer (see its own doc)
        ├── components/  composables/  constants/  lib/  pages/
        ├── routes.tsx
        └── index.ts
```

---

## Layer responsibilities

Inside a module, code flows through layers — each with one job, each allowed
to lean only on the layers above it in this table:

| Layer | Responsibility |
| --- | --- |
| `api/` | I/O only — network calls and storage reads/writes; no parsing, no logic |
| `models/` | Interfaces, types, enum-like unions |
| `lib/` | Mappers and pure helper functions (unit-testable) |
| `composables/` | `useQuery`/`useMutation` wrappers + orchestration |
| `pages/` | Thin shells — call composables, compose components |
| `components/` | Receive data via props, render |
| `constants/` | Query-key factories, route constants |

Global layers mirror the same idea: `src/lib` (pure), `src/composables`
(hooks), `src/components` (UI), `src/plugins` (third-party config).

---

## Modules and the barrel rule

Each feature lives in a self-contained folder under `src/modules/` and exposes
a single public doorway: its `index.ts` (the "barrel"). Everything else is
private.

```ts
// Correct — the barrel is the public API
import { PATIENT_ROUTES } from '@/modules/patients'
import { docsRegistry, DOCS_ROUTES } from '@/modules/docs'

// Wrong — deep imports into another module are forbidden
import { docsRegistry } from '@/modules/docs/constants/docs-registry'
```

Global layers (the router, `useMenu`) may import module barrels. Anything
reusable across modules moves to a global layer — never copy-pasted, never
reached into.

---

## Routing

Routes are declared as **constants** in each module's `routes.tsx`, never as
hardcoded strings. The real patients declaration:

```tsx
const PatientsPage = lazy(() => import('./pages/PatientsPage'))

export const PATIENT_ROUTES = {
  LIST: {
    name: 'patients',
    path: '/patients',
    titleKey: 'patients.title',
    icon: 'pi pi-users',
    menuOrder: 1,
  },
} as const

export const patientRoutes: RouteObject[] = [
  {
    path: PATIENT_ROUTES.LIST.path,
    element: <PatientsPage />,
    handle: { titleKey: PATIENT_ROUTES.LIST.titleKey } satisfies AppRouteHandle,
  },
]
```

The flow from a module to the address bar:

```
modules/{m}/routes.tsx  →  modules/{m}/index.ts  →  router/index.tsx  →  useMenu
(route constants)          (barrel re-export)       (createBrowserRouter)  (sidebar)
```

The full route tree today:

```
/                  → redirect to /patients
/patients          → PatientsPage
/docs              → DocsOverviewPage (documentation index)
/docs/:slug        → DocViewerPage (one document)
*                  → NotFound (404)
```

Every route carries a typed `handle` (`AppRouteHandle`): a `titleKey` resolved
through i18n, or a `title(match)` function for dynamic titles (the docs viewer
uses this to put the document's name in the browser tab). `AppLayout` reads the
deepest match and sets `document.title`; pages stay thin. Paths are
language-neutral English; labels always come from i18n.

The sidebar menu is **derived** from the same route constants by `useMenu` —
there is no hand-written menu array, so the menu can never drift out of sync.
The Dokümanlar entry additionally nests the registered documents as children.

---

## Bootstrap

`src/main.tsx`, in order — each step exists in the file today:

1. Side-effect imports: i18n init, Yup locale, the SCSS bundle.
2. `validateRequiredEnvVars()` — if a required variable is missing, the app
   renders `ConfigErrorScreen` and stops (no broken half-app).
3. `applyTheme()` — sets the Lara theme `<link>` href from the stored mode.
4. Providers, outermost first: `StrictMode` → `AppErrorBoundary` →
   `QueryClientProvider` → `PrimeReactProvider` → `AppToastProvider` → `App`.

---

## Error monitoring (Sentry, errors-only)

Production builds report unexpected errors to Sentry when `VITE_SENTRY_DSN`
is set (free Developer tier: errors only — `tracesSampleRate: 0`, no Session
Replay, no profiling). The init lives in `plugins/sentry.ts`, imported first
in `main.tsx`; a pure `shouldDropErrorEvent` filter (unit-tested) drops
ResizeObserver loop noise and browser-extension frames. The two existing
error boundaries report what they catch (render crashes; non-404 route
errors) — expected data errors and 404s are deliberately not captured.
PII guards: `sendDefaultPii: false`; CRUD lives in `localStorage`, which the
SDK never reads; thrown messages carry keys/counts, never field values — and
if a patient ID ever enters a route/URL (the backlog detail route),
breadcrumb URL scrubbing becomes required. Source-map upload
(`@sentry/vite-plugin`) is double-gated on `SENTRY_AUTH_TOKEN`: without the
token the build neither uploads nor emits `.map` files; the plugin's release
name matches the SDK's (`hasta-takip-sistemi@<version>`) so uploaded maps
symbolicate against the events. The DSN and the auth token are owner-managed
(Vercel env) and never live in the repo.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | yes | Read-only patient data source (one-time seed) |

The typed accessor lives in `src/config/env.ts`:

```ts
const REQUIRED_ENV_VARS = ['VITE_API_URL'] as const

export const env = Object.freeze({
  apiUrl: typeof apiUrlValue === 'string' ? apiUrlValue : '',
})
```

`.env` is never committed; `.env.example` documents every variable. A missing
variable produces a clear configuration-error screen (variable names shown in
development, a translated message in production) instead of a broken app.
