# CLAUDE.md

Operational rule file for Claude Code in this repository. It holds rules,
conventions, and the reference map — it stays terse. Deep, human-readable
explanations live in `docs/{en,tr}/` (see §13), are rendered in-app by the
`docs` module, and are the authoritative long form. There are no per-module
README files; each module's detail lives in `docs/{en,tr}/modules/<NAME>.md`,
and global infrastructure lives in `docs/{en,tr}/COMPONENTS.md`.

Scope: a React + TypeScript patient-tracking panel (Abisena / Panates case
study). Server data is a read-only GET; add / edit / delete are client-side,
persisted in `localStorage`. UI is fully bilingual (Turkish / English).

The data is mock/dummy (a case study to be reviewed); client-side `localStorage`
persistence is acceptable for this exercise and is NOT a pattern for real
patient / PHI data.

## 0. How to Work on This Project

Identify the task type and read the indicated sections + docs. Multiple types →
the UNION of all matching rows.

| Task type                          | Read in CLAUDE.md   | Deep doc                                       |
| ---------------------------------- | ------------------- | ---------------------------------------------- |
| UI component add / change          | §2 §3 §3.1 §7 §9    | `docs/en/STYLING.md`, `docs/en/COMPONENTS.md`, `docs/en/modules/PATIENTS.md` |
| Global component / wrapper         | §2 §3.1             | `docs/en/COMPONENTS.md`                        |
| Form (add / edit)                  | §3.1 §8 §16         | `docs/en/COMPONENTS.md`, `docs/en/modules/PATIENTS.md` |
| New module                         | §2 §3 §4 §5 §6      | `docs/en/ARCHITECTURE.md`                      |
| Routing / pages / menu             | §6                  | `docs/en/ARCHITECTURE.md`                      |
| Third-party library config         | §3 (plugins)        | `docs/en/ARCHITECTURE.md`                      |
| Dependencies / versions / upgrades | §1.1                | this file                                      |
| Data fetching / CRUD / storage     | §10                 | `docs/en/STATE_MANAGEMENT.md`                  |
| Sort / filter / search             | §3.1 §8             | `docs/en/COMPONENTS.md`                        |
| UI text / i18n / localized fields  | §8                  | `docs/en/I18N.md`                              |
| Styling / Tailwind / SCSS / theme  | §9                  | `docs/en/STYLING.md`                           |
| Environment / config               | §3 (config)         | `docs/en/ARCHITECTURE.md`, `README.md`         |
| Tests                              | §11                 | `docs/en/TESTING.md`                           |
| Lint / format / tooling            | §12                 | `docs/en/CODING_STANDARDS.md`                  |
| Docs / references / in-app docs    | §13                 | this file                                      |
| Versioning / release               | §14                 | `docs/en/VERSIONING.md`                        |
| Workflow / audit / commit / merge  | §15                 | `docs/en/WORKFLOW.md`                          |
| Accessibility / performance        | §16                 | `docs/en/COMPONENTS.md`                        |

**Always-on** (every task): §0.1 Active Work (read FIRST), §7 Naming, §8 Text &
i18n, §13 Documentation System, §15 Workflow (incl. pre-work doc reading).

**End every Claude Code prompt with**: "If you see an issue, ambiguity, or a
better suggestion, surface it before implementing. Otherwise proceed."

## 0.1 Active Work

The single "where are we" pointer — ONE active task at a time. It answers what is
in progress and where, at a glance. The detailed step-by-step log lives in the PR
description (the contract, §15), NOT here — so this stays small and the rules file
does not churn or cause merge conflicts. Created when an audit is approved; the
`Next` line and `status` are updated as work moves; the whole item is DELETED in
the final commit when the task is done. The permanent trace is `SPRINT_PLAN.md`.

**Format**:

```markdown
### Active: <SPRINT_PLAN id + name> · branch: <branch> · status: <planned | in-progress | in-review>
Sections: <CLAUDE.md §refs>   ·   Paths: <key paths touched>
Next: <the immediate next action, specific enough to start without context>
```

_(No active work in progress.)_

## 1. Project Overview

| Layer         | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| Framework     | React 18 (function components + composables). No Next.js.     |
| Language      | TypeScript (strict)                                           |
| Build         | Vite                                                          |
| Routing       | React Router (data router, `createBrowserRouter`) — §6        |
| UI library    | PrimeReact 10.9.8 (stable v10) + PrimeIcons. Lara Green theme CSS (from resources path); dark via theme-swap (§9) |
| Utility CSS   | Tailwind CSS 3.4 (token-backed — §9)                          |
| Custom CSS    | SCSS, organised by SMACSS, token-aliased (§9)                 |
| Forms         | Formik + Yup (i18n-driven messages — §8, §3.1)                |
| Dates         | Day.js (configured in `plugins/`) — §8                        |
| Server data   | TanStack Query (React Query) — seeds from the GET once         |
| Client data   | `localStorage` is the persistent source; CRUD via invalidation (§10) |
| i18n          | react-i18next (TR / EN) + PrimeReact Locale API (§8)          |
| In-app docs   | `docs` module renders `docs/{tr,en}/*.md` (react-markdown) — §13 |
| Versioning    | release-please (Conventional-Commit driven) (§14)             |
| Testing       | Vitest + React Testing Library + MSW (§11)                    |

Data source (GET, read-only, one-time seed):
`https://v0-json-api-three.vercel.app/api/data`

## 1.1 Dependencies and version policy

- **Critical exact pins** (never a range, never auto-bumped): `primereact` at
  `10.9.8`, `tailwindcss` at `3.4.x`. **Do NOT upgrade PrimeReact to v11 or
  Tailwind to v4** — they replace the entire styling / token model (§9) and are
  major architectural decisions, not Dependabot bumps. (PrimeReact v11's preset
  theming via `@primeuix/themes` requires `@primereact/core` v1+, a different
  package family; out of scope here.)
- The Lara Green theme CSS is consumed from the installed `primereact` package's
  `resources/themes/` path — no separate theme package, no SASS build, no
  vendored copy (§9).
- Other dependencies use caret majors; the lockfile is committed and `npm ci` is
  used everywhere (local, CI, Vercel).
- Docs-rendering deps: `react-markdown` (^9), `remark-gfm` (^4),
  `@tailwindcss/typography` (^0.5) — the last is wired into the Tailwind config
  `plugins` (§9).
- Dependabot (`.github/dependabot.yml`) **ignores major updates** for
  `primereact`, `tailwindcss`, `react`, and `react-dom` so versions never drift;
  minor / patch are grouped and still go through PR + CI + review (§15).

## 2. Architecture

Modular. Each domain lives in a self-contained module under `src/modules/`,
owning its api, models, lib, composables, components, pages, routes, and
constants. Global cross-cutting code lives in top-level `src/` layers.
Third-party library configuration lives in `src/plugins/`.

**Layer dependency order** (inside a module and across the app):
`api → models → lib (mapper + pure helpers) → composables → pages/components`.

**Key principles:**

- **Public API via the barrel.** Modules expose only through `index.ts`. Other
  code imports from `@/modules/<name>`, never deep paths. Global layers MAY
  import a module barrel (e.g. `useMenu`, the router — §6); modules import each
  other ONLY through barrels, never internals.
- **Decomposition is mandatory, by responsibility — no fixed line count.** Split
  module code into small, focused files in the correct subfolder (network →
  `api`, shapes → `models`, transforms/pure logic → `lib`, orchestration →
  `composables`, rendering → `components`, screens → `pages`). The trigger to
  split is mixed concerns / a unit doing more than one thing — not a line
  threshold. Split what is sensible to split; do not pad or over-fragment.
- **Placement rule (mandatory).** Module-specific code stays inside the module.
  Anything reusable across more than one module MUST be written in a global
  layer (`src/components`, `src/composables`, `src/lib`) — not duplicated, and
  not buried inside a module where a sibling would reach in.
- **Global wrapper components (App*).** Repeated UI patterns get a global `App*`
  wrapper in `src/components` (e.g. `AppDataTable`). At call sites the wrapper is
  mandatory — never use the raw PrimeReact component directly. A missing
  capability is added to the wrapper, not worked around locally. The global
  catalogue is §3.1; detail in `docs/en/COMPONENTS.md`.
- **api is I/O only** — no parsing, no business logic. The GET path returns raw
  snake_case rows and the mapper (module `lib/`) builds the domain model — this
  runs only on the seed. The storage service round-trips the already-mapped
  domain model as JSON, with no mapper (§10).
- **Composables orchestrate; pages are thin shells** that call composables and
  compose components; components receive data via props.
- Code identifiers in English; user-facing text only via i18n (§8).

Authoritative detail: `docs/en/ARCHITECTURE.md`.

## 3. Directory Structure

```
src/
├── main.tsx                 Bootstrap: init i18n → validate env → apply theme link → providers → RouterProvider
├── config/
│   ├── env.ts               Typed frozen env + validateRequiredEnvVars()
│   └── vite-env.d.ts        ImportMetaEnv augmentation
├── plugins/                 Third-party library configuration
│   ├── primereact.ts        PrimeReactProvider value + locale + FilterService.register('nfcContains') (§8)
│   ├── theme.ts             Lara Green light/dark theme.css?url + applyTheme/setThemeMode over <link id="app-theme"> (§9)
│   ├── react-query.ts       QueryClient defaults (§10)
│   ├── dayjs.ts             Day.js plugins + tr/en locale + setDayjsLocale (§8)
│   ├── i18n.ts              react-i18next init + PrimeReact + Day.js bridge (§8)
│   └── yup.ts               yup.setLocale() → i18n message keys (§8, §3.1)
├── router/
│   └── index.tsx            createBrowserRouter: AppLayout + errorElement + index redirect + module routes + 404 (§6)
├── components/              Global UI (App* wrappers + shells) — §3.1
│   ├── AppDataTable.tsx     DataTable wrapper (native sort/filter/search, Turkish-aware)
│   ├── AppToastProvider.tsx Mounts PrimeReact <Toast/>; backs useNotify (§3.1)
│   ├── Loading.tsx          Lazy-route fallback
│   ├── ErrorState.tsx       In-page expected-data error + retry (§3.1)
│   ├── ConfigErrorScreen.tsx Missing-env screen (dev: names; prod: i18n) (§3 config)
│   ├── RouteErrorBoundary.tsx Router errorElement (useRouteError) (§6)
│   ├── AppErrorBoundary.tsx Class boundary above RouterProvider → FatalError (§6)
│   ├── FatalError.tsx       Unexpected-error fallback UI
│   ├── form/                Formik↔PrimeReact field wrappers (§3.1)
│   │   ├── FormInputText.tsx  FormDropdown.tsx  FormCalendar.tsx
│   │   ├── FormInputNumber.tsx  FormCheckbox.tsx  FormChips.tsx
│   └── layout/              App* layout shell (§6)
│       ├── AppLayout.tsx      <Outlet/> + <ScrollRestoration/> + title from route handle
│       ├── AppSidebar.tsx     renders useMenu() (§6)
│       ├── AppTopbar.tsx
│       ├── AppLanguageSwitcher.tsx  → i18n.changeLanguage (single language flow §8)
│       └── AppThemeToggle.tsx       → plugins/theme setThemeMode + 'theme-mode' (§9)
├── composables/
│   ├── useMenu.ts           single menu source: module route constants + docs registry (§6)
│   └── useNotify.ts         success / error / info toasts; key-only API; error normalisation (§3.1)
├── lib/                     Global pure helpers
│   ├── text.ts              NFC + toLocaleLowerCase('tr'); Intl.Collator('tr') (§8)
│   ├── date.ts              formatDate(value, pattern) via Day.js (§8)
│   ├── pickLocalized.ts     pickLocalized(tr, en, language) — Turkish fallback (§8)
│   └── route.ts             getRouteHandle() typed guard over UIMatch (§6)
├── locales/
│   ├── tr.json
│   └── en.json
├── styles/                  SCSS (SMACSS) + token aliases (§9)
├── types/
│   ├── route.types.ts       AppRouteHandle { titleKey; title?(args) } (§6)
│   └── i18n.types.ts        TranslationKey union (key-only typing) (§8)
└── modules/
    ├── patients/
    │   ├── api/
    │   │   ├── patients.api.ts      GET raw rows (one-time seed)
    │   │   └── patients.storage.ts  localStorage CRUD service (§10)
    │   ├── models/          patient.model.ts (PatientRecord flat fields + enums)
    │   ├── lib/
    │   │   ├── patient.mapper.ts    raw snake_case → camelCase model (§10)
    │   │   ├── patient.form.ts      form values ↔ model (§3.1)
    │   │   └── patient-form.schema.ts  Yup schema (§3.1)
    │   ├── composables/     usePatients.ts (query+seed), usePatientMutations.ts (CRUD)
    │   ├── components/       PatientList, PatientForm, PatientDialog, …
    │   ├── constants/
    │   │   ├── patient-options.constants.ts
    │   │   └── query-keys.ts            patientKeys factory (§10)
    │   ├── pages/            PatientsPage.tsx (thin)
    │   ├── routes.tsx        PATIENT_ROUTES constants + route array (§6)
    │   └── index.ts          barrel (public API + routes + route constants)
    └── docs/                 In-app documentation viewer (§13)
        ├── components/       Markdown renderer (react-markdown + remark-gfm)
        ├── constants/        docs-registry.ts (slug + titleKey; single source)
        ├── pages/            DocsOverviewPage.tsx (/docs), DocViewerPage.tsx (/docs/:slug)
        ├── routes.tsx        DOCS_ROUTES constants + route array
        └── index.ts          barrel

Repo root: index.html (holds <link id="app-theme"> + pre-paint theme-mode script, §9),
README.md, .env.example, .nvmrc, vercel.json,
package.json, vite.config.ts, tsconfig.json, eslint.config.js, tailwind.config.ts,
postcss.config.js, stylelint.config.js, commitlint.config.js, .husky/,
release-please-config.json, .release-please-manifest.json,
tools/eslint/no-explanatory-comments.js (custom lint rule, §12),
.github/{workflows/ci.yml, workflows/release.yml, dependabot.yml}
docs/{en,tr}/  (rendered in-app by the docs module)
```

`.env` is gitignored and never committed; `.env.example` documents the required
variables. The lockfile is committed; `npm ci` is used everywhere.

## 3.1 Global Infrastructure Index

Reusable building blocks live in global layers and are mandatory at call sites.
Full behaviour and props: `docs/en/COMPONENTS.md`. Module code references these;
it never re-implements them.

**Components** (`src/components`):

- `AppDataTable` — the only table. Wraps PrimeReact DataTable with native
  sort / filter / search; Turkish-aware (global filter + text filters use a
  registered `nfcContains`; sorting uses `Intl.Collator('tr', { numeric: true })`);
  `emptyMessage` from an i18n key. Not its job: data fetching, page errors,
  toolbars. Core props: `data`, `loading`, `dataKey`, `rows`,
  `rowsPerPageOptions`, `paginator`, `globalFilterFields`, `showSearchBox`,
  `clearButton`, `emptyMessageKey`, `filterDisplay`, `filters`, `onFilter`,
  `sortField`, `sortOrder`, `onSort`, `children` (columns). Sort/filter may be
  uncontrolled (built-in) or controlled via the paired props — pick one mode per
  table; detail in COMPONENTS.md.
- `AppToastProvider` — mounts the single PrimeReact `<Toast/>`; backs `useNotify`.
- `Loading` — lazy-route Suspense fallback (no skeletons).
- `ErrorState` — in-page expected-data error with `onRetry` (distinct from the
  error boundaries, which catch unexpected bugs).
- `RouteErrorBoundary` — React Router `errorElement` (`useRouteError`).
- `AppErrorBoundary` — small class boundary above `RouterProvider` → `FatalError`.
- `FatalError`, `ConfigErrorScreen` — fallback screens. `ConfigErrorScreen`
  renders after i18n init but before providers, using the react-i18next
  singleton directly (dev shows the missing var names; prod shows an i18n
  message).
- `form/Form*` — Formik↔PrimeReact field wrappers (`FormInputText`,
  `FormDropdown`, `FormCalendar`, `FormInputNumber`, `FormCheckbox`,
  `FormChips`); i18n label + error display built in.
- `layout/App*` — `AppLayout`, `AppSidebar`, `AppTopbar`,
  `AppLanguageSwitcher`, `AppThemeToggle`.

**Composables** (`src/composables`): `useMenu` (the single menu source — collects
each module's route constants via barrels + the docs registry, sorts by
`menuOrder`, resolves labels via `t(titleKey)`; `AppSidebar` only renders it);
`useNotify` (success/error/info; accepts ONLY a `TranslationKey` — a literal is a
compile error, §8; normalises unknown errors to `errors.unexpected`).

**Lib** (`src/lib`): `text` (Turkish normalise + collator), `date`
(`formatDate`), `pickLocalized`, `route` (`getRouteHandle`).

**Error surfaces** (four, never conflated): expected data-load failure →
`ErrorState` (in-page, retry); unexpected runtime bug → `RouteErrorBoundary` /
`AppErrorBoundary`; user-action feedback → `useNotify` toast; missing/invalid env
→ `ConfigErrorScreen` (before the app mounts).

## 4. Module Index

Each module follows the internal layout above. Per-module detail (public API,
file map, dependencies, non-obvious behaviour) lives in the docs, not in module
READMEs. CLAUDE.md references the relevant doc and its `en` version.

| Module     | Description (TR / EN) — documentation only | Detail doc                    |
| ---------- | ------------------------------------------ | ----------------------------- |
| `patients` | Hasta takibi / Patient tracking            | `docs/en/modules/PATIENTS.md` |
| `docs`     | Doküman görüntüleyici / Docs viewer        | `docs/en/modules/DOCS.md`     |

The Description column is documentation only. The UI title of any screen comes
from the route handle (§6), not from this table. New modules are added here and
given a `docs/{en,tr}/modules/<NAME>.md` in the same change.

## 5. Module Dependency Rules

- Modules import each other ONLY via barrels: `import { … } from '@/modules/x'`.
  Deep imports (`@/modules/x/composables/...`) are forbidden.
- A module never imports a sibling's internal files. Shared logic moves to a
  global layer (per the §2 placement rule).
- Cross-module navigation reads the target module's route constants from its
  barrel (a module → module barrel import, which §5 allows). There is no separate
  global route-name registry.
- Global layers (the router in `router/index.tsx`, `useMenu`) import module
  barrels to aggregate routes/menu. That is global → module, allowed.
- Documented exceptions (none yet) are listed here with a one-line reason.

## 6. Routing (React Router) — no authentication

This app has no auth: no route guards, no protected or role gating, no login or
403 routes. The router is a layout, the module routes, the in-app docs routes,
and a 404. The default index route redirects to `patients`.

- **Route constants, never hardcoded strings.** Each module declares its routes
  in its `routes.tsx` (e.g. `PATIENT_ROUTES`): `name` (stable English id),
  `path` (the URL), `titleKey` (an i18n key — never hardcoded display text, §8),
  optional `icon` and `menuOrder` for the menu, and a `build()` helper for
  dynamic params. The module barrel re-exports these so the router and `useMenu`
  can read them.
- **Navigate by path — one idiom.** Use the constant's `path` / `build(id)` with
  `<Link to=…>` or `navigate(…)`. React Router has no named routes; `name` is an
  id for menu keys and matching, not for navigation.
- **Per-module route arrays.** Each module exports a typed `RouteObject[]` with
  lazy components and a typed `handle` (`AppRouteHandle`).
- **Aggregation lives in `router/index.tsx`.** It builds one `AppLayout` route
  with a root `errorElement={<RouteErrorBoundary/>}`, children: an index redirect
  to `patients`, the spread module arrays, and a `*` 404, and calls
  `createBrowserRouter`. `AppErrorBoundary` wraps `RouterProvider` as a
  last-resort safety net. HTML5 history → SPA rewrite (`vercel.json`; see §15 /
  `docs/en/WORKFLOW.md`).
- **Layout + title (static or dynamic).** `AppLayout` renders `<Outlet/>` +
  `<ScrollRestoration/>` and sets `document.title` from the deepest match's
  handle via `useMatches()` + `getRouteHandle` (`lib/route.ts`): if the handle
  has `title`, it is called with the match (for dynamic per-record titles like a
  doc slug or patient name); otherwise `t(titleKey)` is used. Re-runs on match /
  language change. Pages stay thin.
- **Route handle, typed.** `types/route.types.ts`:
  `AppRouteHandle { titleKey: string; title?: (match: UIMatch) => string }`.
  Title only — the menu is NOT in the handle.
- **Menu is derived from route constants (no drift).** The `useMenu` composable
  (`src/composables`) is the single menu source: it collects each module's route
  constants via their barrels, sorts by `menuOrder`, resolves the label from
  `t(titleKey)`, and appends the docs group from the docs registry (§13).
  `AppSidebar` only renders what `useMenu` returns — never a hand-coded array.
- **Dynamic params.** Declared in the path (`/patients/:patientId`) with a typed
  `build(patientId)` helper; params read as strings, parsed where consumed.

Paths are language-neutral English (`/patients`); labels come from i18n via the
handle, never from the path.

```ts
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
    lazy: async () => ({ Component: (await import('./pages/PatientsPage')).default }),
    handle: { titleKey: PATIENT_ROUTES.LIST.titleKey } satisfies AppRouteHandle,
  },
]
```

Authoritative detail: `docs/en/ARCHITECTURE.md`.

## 7. Naming

Identifiers are descriptive full words. Length does not matter; meaningless
abbreviations are forbidden (`submitNewPatientButton`, not `sbmtBtn`).

| Category     | Convention             | Example                        |
| ------------ | ---------------------- | ------------------------------ |
| Folders      | kebab-case             | `modules/patients/`            |
| Components   | PascalCase.tsx         | `PatientList.tsx`, `AppDataTable.tsx` |
| Composables  | useCamelCase.ts        | `usePatients.ts`              |
| API modules  | camelCase.api.ts       | `patients.api.ts`             |
| Storage      | camelCase.storage.ts   | `patients.storage.ts`         |
| Models       | camelCase.model.ts     | `patient.model.ts`            |
| Mappers      | camelCase.mapper.ts    | `patient.mapper.ts`           |
| Pure helpers | camelCase.ts           | `pickLocalized.ts`            |
| Constants    | kebab-case.constants.ts| `patient-options.constants.ts`|
| Routes       | routes.tsx             | `routes.tsx`                  |

Declarations: `const` by default, `let` only when reassigned. No `var`.

**No explanatory comments and no JSDoc.** Intent is carried by names, structure,
and the docs. Enforced by the custom lint rule `local/no-explanatory-comments`
(§12). The only comments the rule permits are: `eslint-disable*` /
`eslint-enable`, `@ts-*`, `prettier-ignore`, `global` / `globals`, triple-slash
`/// <reference>` directives, the Vite `@vite-ignore` magic comment (Vite only —
no webpack), shebang lines, and empty comments. The rare unavoidable explanatory
comment (e.g. a directive not on that list) is written with an explicit
`eslint-disable-next-line local/no-explanatory-comments` so it is never habitual
and always visible in review.

## 8. Text and i18n

- **No human-readable string literals in JS/JSX.** Every user-facing string
  comes from the locale JSON (`src/locales/tr.json`, `en.json`). This covers JSX
  text and the UI attributes `placeholder`, `title`, `label`, `header`, `alt`,
  `aria-label`, `tooltip`, `emptyMessage`, plus toast messages, Yup messages, and
  route `titleKey`. Technical strings stay constants: `className`, route
  `path`/`name`, query keys, icon names, enum VALUES, date patterns, `severity`,
  `field`, `dataKey`, `data-testid`.
- **Enforcement is layered.** (a) `eslint-plugin-i18next` `no-literal-string` in
  JSX-only mode, with a `jsx-attributes` whitelist (the UI attributes above) and
  `callees` excluding `t` / `i18n.t` / `clsx` / `cn`; disabled in test and
  constants files (§12). (b) The lint blind spots — toast and validation
  strings — are closed by TYPING, not review: `useNotify` accepts only a
  `TranslationKey` (`types/i18n.types.ts`), and Yup messages come from
  `yup.setLocale()` keys (`plugins/yup.ts`); a raw literal in either place is a
  compile error.
- A new key is added to BOTH `tr.json` and `en.json` in the same change.
- **Critical pattern.** An enum value is a constant; its label is translated:
  the status value is `'active'`, the label is ``t(`patient.status.${status}`)``.

### Bilingual content fields (flat) + `pickLocalized`

The API returns flat localized fields (`note_tr`, `note_en`, `diagnosis_tr`,
`diagnosis_en`). The mapper produces a FLAT camelCase model — `noteTr`, `noteEn`,
`diagnosisTr`, `diagnosisEn` — with no nesting and no `LocalizedText` object.
Display picks the active language with a Turkish fallback:

```ts
export const pickLocalized = (tr: string, en: string, language: string): string => {
  const base = language.split('-')[0]
  return base === 'en' ? (en || tr) : (tr || en)
}
```

Render via `pickLocalized(patient.noteTr, patient.noteEn, i18n.language)`. The
add/edit form shows ALL fields (`noteTr` + `noteEn`, `diagnosisTr` +
`diagnosisEn`) side by side, regardless of the active language (no tabs).

### PrimeReact locale + dates (one language flow)

PrimeReact's own component strings are driven by its Locale API (the `tr`/`en`
entries from `primelocale`), not react-i18next. Switching language is a single
flow in `AppLanguageSwitcher`: `i18n.changeLanguage` → PrimeReact `setLocale` →
`setDayjsLocale` → update `<html lang>`. Dates use one helper,
`formatDate(value, pattern = 'L')` (`lib/date.ts`, Day.js + active locale; `''`
for invalid ISO), with `localizedFormat` tokens per field (`birthDate` → `'L'`,
`appointmentDate` → `'LLL'`). Scattered `toLocaleString` is forbidden. Dates are
ISO strings in the model; the Calendar `Date` is converted to ISO on save.

### Turkish-aware text

Search/filter normalise with `.normalize('NFC').toLocaleLowerCase('tr')`; sort
uses `new Intl.Collator('tr', { numeric: true }).compare`. These live in
`lib/text.ts`; the `nfcContains` filter is registered in `plugins/primereact.ts`
and wired into `AppDataTable` (§3.1). Detail: `docs/en/I18N.md`.

## 9. Styling — One Token Source, Many Consumers (PrimeReact v10)

PrimeReact 10 uses the legacy theme-CSS model. The single design-token source is
the imported Lara Green theme stylesheet, which exposes v10 CSS variables
(`--primary-color`, `--surface-0..900`, `--surface-ground`, `--surface-card`,
`--surface-border`, `--text-color`, `--text-color-secondary`, …). Tailwind and
SCSS consume those SAME variables. **Raw hex colours are forbidden everywhere.**
Authoritative detail: `docs/en/STYLING.md`.

### Theme source + dark mode (one switch drives everything)

The theme is fed from the installed package's resources path via Vite `?url`
imports — no public copy, no SASS, no `changeTheme`:

```ts
import lightThemeUrl from 'primereact/resources/themes/lara-light-green/theme.css?url'
import darkThemeUrl  from 'primereact/resources/themes/lara-dark-green/theme.css?url'
```

`plugins/theme.ts` owns a `<link id="app-theme">` and `setThemeMode(mode)`, which
sets that link's `href` to the light or dark URL, toggles the `dark` class on
`<html>`, and persists `theme-mode` in `localStorage`. `AppThemeToggle` calls it.
To avoid a flash, a small inline script in `index.html` reads `theme-mode` and
sets the `dark` class BEFORE React renders (so the background — a custom token
defined for both modes — is correct on first paint); the theme stylesheet `href`
is applied during bootstrap (`main.tsx`) from the same `theme-mode`. One switch,
two effects (stylesheet + `dark` class) — never add a third mechanism.

### Every colour is defined for both modes

Because the light/dark theme files redefine the v10 variables, anything built on
those variables is mode-correct automatically — so **do NOT use Tailwind `dark:`
variants on token-backed colours; they are already mode-correct via the swap.**
The `.dark` class exists ONLY for the app-specific custom tokens PrimeReact does
not provide, defined once for BOTH modes — under `:root { … }` and `.dark { … }`
(the same class Tailwind toggles) — never a single-mode hardcoded value.

### Token pipeline

```
Lara Green theme CSS (lara-light-green / lara-dark-green, ?url-swapped by plugins/theme)
  → v10 CSS variables (--primary-color, --surface-0..900, --text-color, …)
      ├→ tailwind.config.ts  colours map straight to the v10 variables
      └→ src/styles/utils/_tokens.scss  → SCSS aliases for custom SCSS
```

### Tailwind config (token-backed, v10 — no tailwindcss-primeui)

Tailwind defines no palette of its own; its colours point at the v10 variables,
and `darkMode` is the `class` strategy matching the `<html>` `dark` class. The
typography plugin styles rendered docs (§13).

```ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        surface: {
          0: 'var(--surface-0)', 50: 'var(--surface-50)', 100: 'var(--surface-100)',
          200: 'var(--surface-200)', 300: 'var(--surface-300)', 400: 'var(--surface-400)',
          500: 'var(--surface-500)', 600: 'var(--surface-600)', 700: 'var(--surface-700)',
          800: 'var(--surface-800)', 900: 'var(--surface-900)',
        },
        ground: 'var(--surface-ground)',
        card: 'var(--surface-card)',
        'surface-border': 'var(--surface-border)',
        text: 'var(--text-color)',
        'text-secondary': 'var(--text-color-secondary)',
      },
    },
  },
  plugins: [typography],
} satisfies Config
```

### SCSS token layer

`src/styles/utils/_tokens.scss` re-exposes the v10 variables as aliases so custom
SCSS never reaches for a hex value; the swap keeps them mode-correct.

```scss
$color-primary:          var(--primary-color);
$surface-0:              var(--surface-0);
$surface-ground:         var(--surface-ground);
$surface-card:           var(--surface-card);
$surface-border:         var(--surface-border);
$text-color:             var(--text-color);
$text-color-secondary:   var(--text-color-secondary);
```

Tailwind utilities live in TSX `className`; SCSS does NOT use `@tailwind` or
`@apply`. SCSS reads only the `_tokens.scss` aliases, so Stylelint needs no
Tailwind awareness.

### Which tool, when

| Need                                              | Use                                              |
| ------------------------------------------------- | ------------------------------------------------ |
| Spacing, layout, one-off utility                  | Tailwind utility (token-backed colours only)     |
| Colour                                            | `primary` / `surface` / `text` … — never raw hex |
| PrimeReact component internals                    | PrimeReact PassThrough (`pt`) with token-backed Tailwind classes |
| Reusable complex style, what utilities can't express | SCSS module (SMACSS), referencing `_tokens.scss` aliases only |
| State variation (open / active / selected)        | SMACSS `is-` class or Tailwind `data-*` variant  |

### Cascade and SCSS structure

CSS `@layer` order: `base, primereact, components, utilities`. SCSS folders:

```
src/styles/
├── base/      reset, typography, element styles
├── layout/    l- prefixed major scaffolding
├── modules/   reusable component styles
├── state/     is- prefixed state classes
├── theme/     dark-mode custom tokens (under .dark)
├── utils/     _tokens.scss, mixins, functions (no output)
└── main.scss  imports in SMACSS order
```

## 10. State and Data

`localStorage` is the single persistent source of truth; React Query is the
in-memory cache over it. There is no write API and no query persister.

- **Storage service** — `modules/patients/api/patients.storage.ts` exposes
  `patientStorage.{read, write, add, update, remove, clear}` over a JSON value at
  `STORAGE_KEY = 'patients'`. All persistence goes through it. `read` returns
  `[]` on missing or corrupt JSON (try/catch); `write` reports a `useNotify`
  error on quota failure. There is no storage schema migration — if the model
  changes, `clear` + re-seed (acceptable for dummy data).
- **Reads + seed** — `composables/usePatients.ts` `useQuery` reads
  `patientStorage.read()`; if empty, it fetches the GET once, runs the mapper,
  writes the seed via `patientStorage.write`, and returns it. The mapper runs
  only on this seed path. Seeding is idempotent (StrictMode-safe).
- **Writes (CRUD)** — `composables/usePatientMutations.ts` uses `useMutation`
  that calls the storage service, then `queryClient.invalidateQueries(patientKeys.all())`.
  Invalidation-only — no `setQueryData`. Reset = `clear` + invalidate.
- **Notifications** — mutations call `useNotify` on success/error (§3.1).
- **QueryClient defaults** (`plugins/react-query.ts`): `staleTime: Infinity`,
  `gcTime: Infinity`, `refetchOnWindowFocus: false`, `retry: 1` (affects only the
  seed GET; storage reads are synchronous). The list query uses
  `throwOnError: false` so read failures render an in-page `ErrorState` (§3.1)
  rather than hitting the error boundary.
- **Query keys** — one factory, `constants/query-keys.ts`, function form
  + `as const` (`patientKeys.all()` → `['patients']`; future
  `patientKeys.detail(id)`). Imported everywhere; hardcoded arrays forbidden.
- **Model + mapper** — `PatientRecord` and its enum-like unions live in
  `models/patient.model.ts`, confirmed against the live API (no free `string`).
  The mapper does snake_case → camelCase + enum typing, FLAT (no nesting, §8).

Detail: `docs/en/STATE_MANAGEMENT.md`, `docs/en/modules/PATIENTS.md`.

## 11. Testing

Vitest + React Testing Library + MSW. Tests are PLANNED in the audit step (§15)
and WRITTEN with the code in implementation.

- **Network** — the GET is mocked with MSW; no real network in tests.
- **Layout** — test files are colocated with source as `*.test.ts(x)`.
- **Coverage** — no mandatory threshold; priority targets are pure `lib/`
  (mapper, `pickLocalized`, `formatDate`, Turkish normalise), the composables'
  CRUD-on-storage behaviour, and the custom lint rule (`RuleTester`).

Detail: `docs/en/TESTING.md`.

## 12. Linting and Quality

One integrated chain; Prettier is the only formatter.

| Tool                | Owns                                   | Conflict resolution                       |
| ------------------- | -------------------------------------- | ----------------------------------------- |
| typescript-eslint   | TS/React correctness, rule violations  | —                                         |
| eslint-plugin-i18next | `no-literal-string` (JSX-only, §8)   | —                                         |
| eslint-plugin-jsx-a11y | accessibility floor (§16)           | —                                         |
| eslint-plugin-simple-import-sort | import + export order (enforced, auto-fixed by `eslint --fix`; groups per §5: side-effects, `node:`, externals (react first), `@/` alias, relative) | — |
| eslint-plugin-react-hooks | `rules-of-hooks` = error, `exhaustive-deps` = error (src only; justified `eslint-disable` for an intentionally-omitted dep) | — |
| eslint-plugin-react-refresh | `only-export-components` = warn (HMR hint, `allowConstantExport`; off for barrels/`routes.tsx`/`*.constants.*`) | — |
| eslint-plugin-react (core) | curated, src only: `jsx-key`, `no-array-index-key`, `no-unstable-nested-components`, `jsx-no-useless-fragment` = error; `react-in-jsx-scope` + `prop-types` off (new JSX transform + TS); `react.version: detect` | — |
| local/no-explanatory-comments | no comments / no JSDoc (§7)   | explicit `eslint-disable-next-line` for rare exceptions |
| Prettier            | All formatting                         | `eslint-config-prettier` disables ESLint format rules |
| Stylelint           | SCSS quality, SMACSS, prop order       | `stylelint-config-standard-scss` + `stylelint-order` + `stylelint-prettier` |
| commitlint          | Conventional Commit messages (§14, §15) | `@commitlint/config-conventional` (commit-msg hook) |
| Husky + lint-staged | Runs lint/format on staged files pre-commit; commitlint on commit-msg | — |

`no-literal-string` config: JSX-only mode, `jsx-attributes` whitelist (the §8 UI
attributes), `callees` excluding `t`/`i18n.t`/`clsx`/`cn`, disabled in test and
constants files. `local/no-explanatory-comments` allowlist: `eslint-disable*` /
`eslint-enable`, `@ts-*`, `prettier-ignore`, `global` / `globals`, triple-slash
references, the Vite `@vite-ignore` magic comment (Vite only — no webpack),
shebang, and empty comments. The rule is implemented locally at
`tools/eslint/no-explanatory-comments.js` and wired into `eslint.config.js` as an
inline `local` plugin (`plugins: { local: { rules: { … } } }`), with a
`RuleTester` unit test.

One script runs everything: `validate` = `type-check` + `lint` + `lint:style` +
`format:check`. CI runs `validate` + tests + `build` + `npm audit --audit-level=high`.

## 13. Documentation System

The reference map. For any change, the docs to update are looked up here, not
guessed. All docs are also rendered in-app by the `docs` module (§3 directory),
loaded via Vite `import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default' })`,
picked by the active language.

### 13.1 Audience and clarity

`docs/` is read by humans, including non-authors and end users, and is rendered
in-app. Write it in clear, plain language with short examples — not the terse
shorthand of this file. CLAUDE.md is operational shorthand for the agent;
`docs/` is the single home for all detailed explanation (no module READMEs).
Every doc opens with a one-paragraph plain summary of what it covers and who
needs it.

### 13.2 Documentation index

All docs exist in both `docs/en/` and `docs/tr/` (CHANGELOG.md excepted — §13.5).

| File                    | Contents                                                 |
| ----------------------- | -------------------------------------------------------- |
| `ARCHITECTURE.md`       | Modules, layers, directory, plugins, routing, env/config, dependency rules |
| `COMPONENTS.md`         | Global infrastructure: App* wrappers, form fields, layout, useMenu, useNotify, lib helpers |
| `CODING_STANDARDS.md`   | Naming, no-comments rule, decomposition + placement, i18n-only text, lint/format tooling |
| `STYLING.md`            | v10 theme model, Lara Green via resources ?url, theme-swap dark mode, Tailwind + SCSS token aliases, SMACSS, both-mode colour |
| `STATE_MANAGEMENT.md`   | localStorage source + React Query seed, invalidation-only CRUD, mapper, query keys |
| `I18N.md`               | Locale files, keys, flat localized fields + `pickLocalized`, key-only typing, PrimeReact locale, dates, Turkish-aware text |
| `TESTING.md`            | Test strategy, MSW, colocation, priorities                |
| `WORKFLOW.md`           | Team roles, backlog, gated flow, CI gate, PR-as-contract, fast path, CI/Vercel/release mechanics |
| `VERSIONING.md`         | release-please Release-PR flow, Conventional-Commit bumps, no publish |
| `SPRINT_PLAN.md`        | Living backlog + completed (✅) record — kept permanently |
| `CHANGELOG.md`          | Per-version work, generated by release-please from Conventional Commits at repo root (English only; see §13.5) |
| `modules/PATIENTS.md`   | Patients module detail (public API, file map, behaviour)  |
| `modules/DOCS.md`       | Docs module detail (registry, renderer, routes)           |

### 13.3 Change-type → docs to update

On `commit + docs:sync`, find every matching row and update the listed files in
BOTH languages.

| Change                                          | Update (en + tr)                          |
| ----------------------------------------------- | ----------------------------------------- |
| Module / layer / dependency / plugins structure changed | `ARCHITECTURE.md`                 |
| Routing / menu changed                          | `ARCHITECTURE.md`                         |
| Global component / wrapper / form field changed | `COMPONENTS.md`                           |
| Naming / no-comment / placement / coding rule changed | `CODING_STANDARDS.md`               |
| Lint / format / tooling config changed          | `CODING_STANDARDS.md`                     |
| Styling token / theme / Tailwind / SCSS changed  | `STYLING.md`                              |
| Data / storage / CRUD / mapper / query keys changed | `STATE_MANAGEMENT.md` + `modules/PATIENTS.md` |
| i18n keys, localized fields, dates, or PrimeReact locale changed | `I18N.md`                |
| Test strategy / tooling changed                  | `TESTING.md`                              |
| Workflow / CI / deploy / release changed         | `WORKFLOW.md`                             |
| Versioning process changed                       | `VERSIONING.md`                           |
| A module's behaviour changed                     | `modules/<NAME>.md`                       |
| Dependency added / pinned / upgrade policy changed | this file (§1.1) + `ARCHITECTURE.md`    |
| Sprint task completed                            | `SPRINT_PLAN.md` (mark ✅, never delete)  |
| User-facing change shipped                        | a clear Conventional Commit → release-please fills `CHANGELOG.md` (§14) |
| New / changed env variable                       | `README.md` + `ARCHITECTURE.md` (Configuration) |

### 13.4 Creating a new reference point

A new doc/reference is created only when a topic does not fit any existing file
AND is a standalone concern referenced from more than one place.

- **Naming**: `UPPER_SNAKE_CASE.md` at the `docs/{lang}/` root, or
  `modules/{NAME}.md` for a module-scoped concern.
- **Registration is atomic — same commit, all five steps:**
  1. Create the file in BOTH `docs/en/` and `docs/tr/`, opening with the §13.1
     plain summary.
  2. Add a row to the index (§13.2).
  3. Add a row to the change-type table (§13.3) so future changes route to it.
  4. If a CLAUDE.md section should point to it, add the pointer in the §0 table.
  5. Add an entry to the in-app `docsRegistry` (`modules/docs/constants`) so it
     appears in the sidebar and is reachable at `/docs/:slug`.
- **Rule**: a reference point not in the index (§13.2), the mapping table
  (§13.3), AND the `docsRegistry` does not exist. No unregistered docs.

### 13.5 Bilingual rule

Every doc is maintained in `docs/en/` and `docs/tr/`. Prose is translated; code,
file names, identifiers, and token names stay English. CLAUDE.md is English only.
Exception: `CHANGELOG.md` is generated by release-please at the repo root,
English only, and is exempt from the bilingual rule; the in-app docs viewer
renders it as an English-only entry.

### 13.6 Sprint plan and success tags

`SPRINT_PLAN.md` is the living backlog AND the permanent record: planned items
carry acceptance criteria; completed items are marked ✅ and never deleted.
Distinct from §0.1 Active Work, which is transient and deleted on completion.

## 14. Versioning

release-please, driven by Conventional Commits (§15). The version is never
hand-edited into feature branches, so concurrent work never conflicts on it.

- **No changeset files.** The bump is derived from commit types on `main`:
  `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE` → major. Readable
  history (commitlint, §12) is therefore also the release source.
- **Release flow**: merging a feature PR to `main` deploys the code (Vercel)
  immediately; the version is unchanged. The release-please GitHub Action
  (`.github/workflows/release.yml`, config in `release-please-config.json` +
  `.release-please-manifest.json`) opens/updates a single **Release PR** that
  bumps the version and regenerates `CHANGELOG.md` from the commits since the
  last release. Merging THAT PR performs the version bump + git tag. The app is
  private — there is **no npm publish**. Detail: `docs/en/VERSIONING.md`.

## 15. Workflow

A team workflow. The repository owner is the team manager: nothing reaches `main`
without their review. Claude Code never commits or merges without explicit
approval. Detail: `docs/en/WORKFLOW.md` (also covers the CI / Vercel / release
mechanics).

### Backlog

`SPRINT_PLAN.md` is the living backlog. Work is pulled from it; each task may
carry acceptance criteria.

### Pre-work (before any audit / plan / implementation)

1. Identify every module + global piece the task will read or modify (trace via §5).
2. Read each affected `docs/en/modules/<NAME>.md` and `docs/en/COMPONENTS.md`
   end-to-end. Do not skim or infer. If a doc does not exist yet (early
   scaffolding), note that and proceed from CLAUDE.md + the code.
3. Surface consulted docs at the top of the output: `Consulted docs:` then paths.
4. Flag any doc↔code drift as a finding. Do not silently work around it.

### Developer (local)

1. **Audit / Plan** — no code. Scope + sub-step breakdown + test plan + consulted
   docs + drift. Refined in chat; on approval the §0.1 Active Work item is created.
2. **Implementation** — Claude Code writes code + tests. Does NOT commit.
3. **Developer self code-review** — the developer reviews Claude Code's output;
   issues → fix → re-review (loop). Commit only when confident.
4. **commit + docs:sync** — code + tests + docs (both languages, §13.3) +
   `SPRINT_PLAN.md` ✅ + Active Work update, with a Conventional Commit message
   (§14). The final commit of the task DELETES the Active Work item.
5. **push** the feature branch → **open a PR. The PR description is the contract**:
   audit plan + what was done + test notes + docs touched + acceptance criteria +
   linked backlog item.

### Automated gate (CI)

On every PR, CI runs `validate` + tests + `build` + `npm audit --audit-level=high`.
**A PR cannot merge unless CI is green** (required status check). Humans then
review substance.

### Manager (the owner, remote)

6. **PR review** against the contract (plan, acceptance criteria, code, docs) —
   with CI green. Issues → back to the developer.
7. **Merge to `main`** → production deploy (Vercel) + release-please opens/updates
   the Release PR (§14).

`main` is protected. Solo configuration: required status checks (CI green) +
manual review-and-merge (GitHub does not allow approving your own PR). When a
teammate joins, enable required approvals (1+). Rollback: Vercel instant rollback
to a previous deployment; urgent fix via `fix/*`, same flow expedited.

### Fast path

Trivial, low-risk changes (incl. Dependabot bumps) skip the formal audit / Active
Work ceremony (implement → self-review → commit → PR) — but PR + CI + the
manager's merge still apply. The gates are never skipped; only the audit is
lightened.

### Git conventions

Branches `feat/*`, `fix/*`, `chore/*` (also `docs/*`, `refactor/*`, `test/*`).
Conventional Commits (`type(scope): subject`), enforced by commitlint (§12) and
consumed by release-please (§14). Push is manual. PRs squash-merge to a linear
history; the squash message (= PR title) is conventional.

Every prompt ends with: "If you see an issue, ambiguity, or a better suggestion,
surface it before implementing. Otherwise proceed." Gate failures loop back: a
failed self-review returns to step 2; a failed PR review returns to the developer.

## 16. Accessibility and Performance

**Accessibility:**

- `form/Form*` wrappers always render an i18n label bound to the input
  (`htmlFor`/`id`) — no unlabelled fields. Icon-only buttons get
  `aria-label={t(...)}`.
- PrimeReact Dialog provides focus-trap + ESC + `role="dialog"`; set
  `aria-labelledby` (header) and return focus on close.
- DataTable sortable-column ARIA is built in; column headers are labelled.
- Colour tokens (light + dark) target WCAG AA contrast (§9).
- Language switch updates `<html lang>` (§8).
- Enforced floor: `eslint-plugin-jsx-a11y` (§12).

**Performance:**

- Native client-side DataTable filter/sort over a small dataset → no
  virtualisation needed.
- React Query cache (`staleTime: Infinity`) avoids refetch (§10).
- Route-level code splitting: `React.lazy` + Suspense with the `Loading`
  fallback (§6, §3.1).
- No premature memoisation — the native table removes most of the need; memoise
  only a measured bottleneck.

## 17. Checklist for New Code

1. Module placement (§2 §3) — barrel-only imports; module-specific code in the
   module, reusable code in a global layer; logic in `lib`, fetching/persistence
   in `api`/composables, never in leaf UI.
2. Decomposition (§2) — small focused files in the correct subfolder; split by
   concern, not by line count.
3. Shared UI (§2 §3.1) — use `App*` wrappers (e.g. `AppDataTable`) and `Form*`
   fields; never raw PrimeReact at call sites.
4. Routing (§6) — route constants (incl. `icon`/`menuOrder`), lazy pages, thin
   pages; menu via `useMenu`; dynamic titles via the handle `title()`.
5. Naming (§7) — full descriptive words; no comments / no JSDoc.
6. Text (§8) — no human-readable literals; keys in both locales; `useNotify` /
   Yup are key-only (typed); flat localized fields via `pickLocalized`;
   PrimeReact + Day.js locale synced.
7. Turkish-aware text (§8) — NFC + `toLocaleLowerCase('tr')`; `Intl.Collator('tr')`
   via `lib/text.ts` / `AppDataTable`.
8. Styling (§9) — token-backed only, no raw hex; SCSS via `_tokens.scss`; every
   colour valid in both modes; no `dark:` on token colours; no `@apply` in SCSS.
9. State (§10) — React Query seeds from storage; CRUD via the storage service +
   `invalidateQueries`; query-key factory; one source of truth.
10. Tests (§11) — planned in audit, written with the code; MSW for the GET;
    colocated.
11. Lint/format (§12) — `validate` passes.
12. Accessibility / performance (§16) — labelled fields, a11y lint, lazy routes.
13. Docs (§13) — routed through §13.3, both languages, registered per §13.4
    (incl. `docsRegistry`).
14. Versioning (§14) — a clear Conventional Commit (release-please derives the
    bump); no version / dependency-major drift (§1.1).
15. Workflow (§15) — pre-work docs consulted; no self-commits/merges; gates and
    PR-contract respected.
