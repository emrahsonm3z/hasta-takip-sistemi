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
| Responsive design / responsiveness | §16                 | `docs/en/COMPONENTS.md`                        |

**Always-on** (every task): §0.1 Active Work (read FIRST), §7 Naming, §8 Text &
i18n, §13 Documentation System, §15 Workflow (incl. pre-work doc reading).

**End every Claude Code prompt with**: "If you see an issue, ambiguity, or a
better suggestion, surface it before implementing. Otherwise proceed."

## 0.1 Active Work

The single "where are we" pointer — ONE active TOPIC at a time (≈ a SPRINT_PLAN
task; a branch = a topic, §15). It answers what is in progress and where, at a
glance, including the current sub-item (the `Next` line). The detailed trace lives
in the topic's per-sub-item commits and the PR description (the contract, §15),
NOT here — so this stays small and the rules file does not churn or cause merge
conflicts. Created when an audit is approved; the `Next` line and `status` are
updated as sub-items land; the whole item is DELETED in the topic's final authored
commit (the last commit before the Rebase and merge, §15) — there is no post-merge
commit in which to remove it. The permanent trace is `SPRINT_PLAN.md`.

**Format**:

```markdown
### Active: <SPRINT_PLAN id + name> · branch: <branch> · status: <planned | in-progress | in-review>
Sections: <CLAUDE.md §refs>   ·   Paths: <key paths touched>
Next: <the current/next sub-item — specific enough to start without context>
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
| Testing       | Node built-in test runner (`node --test`, Node 24 type-strip), pure-logic specs — no Vitest/RTL/MSW (§11) |

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
- Dependabot (`.github/dependabot.yml`, where this is ENFORCED) **ignores ALL
  update types** for the five exact-pinned criticals — `react`, `react-dom`,
  `primereact`, `primeicons`, `tailwindcss` — so they never drift, and **ignores
  the `eslint` AND `@eslint/*` majors** (eslint v10 would break
  `eslint-plugin-jsx-a11y`, which caps at eslint 9; `@eslint/js` is a SEPARATE
  package whose major tracks the same eslint line and slipped through the
  `eslint`-only ignore once, so `@eslint/*` is ignored too). Every other
  dependency's minor / patch updates are grouped into one weekly PR that still goes
  through CI + review (§15); security exposure is covered by the
  `npm audit --audit-level=high` gate.

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
├── __test__/                node:test specs mirroring the source tree (§11); value imports relative, type-only via @/
├── config/
│   ├── env.ts               Typed frozen env + validateRequiredEnvVars()
│   └── vite-env.d.ts        ImportMetaEnv augmentation
├── plugins/                 Third-party library configuration
│   ├── primereact.ts        PrimeReactProvider value + locale + FilterService.register('nfcContains') (§8)
│   ├── theme.ts             Lara Green light/dark theme.css?url + applyTheme/setThemeMode over <link id="app-theme"> (§9; core deprecated/empty, icons via main.scss)
│   ├── theme.lib.ts         Pure theme-swap logic (resolveThemeMode/applyThemeMode); no ?url, unit-tested under node:test
│   ├── react-query.ts       QueryClient defaults (§10)
│   ├── dayjs.ts             Day.js plugins + tr/en locale + setDayjsLocale (§8)
│   ├── i18n.ts              react-i18next init + PrimeReact + Day.js bridge (§8)
│   └── yup.ts               yup.setLocale() → i18n message keys (§8, §3.1)
├── router/
│   └── index.tsx            createBrowserRouter: AppLayout + errorElement + index redirect + module routes + 404 (§6)
├── components/              Global UI (App* wrappers + shells) — §3.1
│   ├── AppDataTable.tsx     DataTable wrapper (toolbar slot + search + clear-filters, Turkish sort/filter, two-mode loading, responsive paginator) (§3.1)
│   ├── AppDataTable.lib.ts  pure buildInitialFilters(globalMatchMode, defaults, includeGlobal) (unit-tested)
│   ├── AppToastProvider.tsx Mounts PrimeReact <Toast/>; backs useNotify (§3.1)
│   ├── toast-context.ts     ToastContext (split out so AppToastProvider stays fast-refresh-clean)
│   ├── Loading.tsx          Lazy-route fallback
│   ├── ErrorState.tsx       In-page expected-data error + retry (§3.1)
│   ├── ConfigErrorScreen.tsx Missing-env screen (dev: names; prod: i18n) (§3 config)
│   ├── RouteErrorBoundary.tsx Router errorElement (useRouteError) (§6; minimal until 0.7)
│   ├── NotFound.tsx         404 page for the `*` route (errors.notFound) (§6)
│   ├── AppErrorBoundary.tsx Class boundary above RouterProvider → FatalError (§6)
│   ├── FatalError.tsx       Unexpected-error fallback UI
│   ├── form/                Formik↔PrimeReact field wrappers (§3.1)
│   │   ├── FormInputText.tsx  FormDropdown.tsx  FormCalendar.tsx
│   │   ├── FormInputNumber.tsx  FormCheckbox.tsx  FormChips.tsx
│   │   ├── FormField.tsx       Shared shell: i18n label + Yup error via resolveValidationMessage
│   │   └── validation.ts       resolveValidationMessage(raw, t) — parse {key,values} → t() (unit-tested)
│   └── layout/              App* layout shell (§6, §9)
│       ├── AppLayout.tsx      <Outlet/> + <ScrollRestoration/> + title from route handle; fixed sidebar offset (lg) + mobile-drawer close on route change
│       ├── AppSidebar.tsx     renders useMenu() groups; transparent fixed panel (lg) + PrimeReact <Sidebar> drawer (< lg, .l-sidebar-drawer) (§6, §9, §16)
│       ├── AppTopbar.tsx      .l-topbar-start (hamburger + title) + action chips (language + theme), no avatar
│       ├── AppLogo.tsx        inline-SVG brand mark (token-colored) + BRAND_NAME wordmark (§9)
│       ├── AppLanguageSwitcher.tsx  active-language text chip (TR/EN) → i18n.changeLanguage toggles the other (single language flow §8)
│       └── AppThemeToggle.tsx       → plugins/theme setThemeMode + 'theme-mode' (§9)
├── composables/
│   ├── useMenu.ts           single menu source: module route constants + docs registry, assigns sections (§6)
│   ├── useMenu.lib.ts       pure buildMenu(sources, translate) — grouped sections, sort + label (unit-tested)
│   ├── useNotify.ts         success / error / info toasts; key-only TranslationKey API (§3.1)
│   ├── useNotify.lib.ts     pure normalizeErrorKey(error) → TranslationKey (unit-tested)
│   └── useMediaQuery.ts     matchMedia hook (responsive paginator template, §16)
├── lib/                     Global pure helpers
│   ├── text.ts              NFC + toLocaleLowerCase('tr'); Intl.Collator('tr') (§8)
│   ├── date.ts              formatDate(value, pattern) via Day.js (§8)
│   ├── pickLocalized.ts     pickLocalized(tr, en, language) — Turkish fallback (§8)
│   └── route.ts             getRouteHandle() typed guard over UIMatch (§6)
├── locales/
│   ├── tr.json
│   └── en.json
├── styles/                  SCSS (SMACSS) + token aliases (§9)
│   ├── main.scss            Entry: @use base/layout/module partials + primeicons @import, @layer tw-base/primereact/tw-components/tw-utilities order + Tailwind-in-layers + 14px base/antialiased (§9)
│   ├── base/_typography.scss  @font-face Inter (variable woff2, latin + latin-ext) (§9)
│   ├── fonts/               Self-hosted Inter variable woff2 (latin + latin-ext) — no npm dep (§9)
│   ├── images/pattern.png   Self-hosted PrimeVue/Atlantis pattern asset (licensed, like the Inter font) — fed to --glow-image (§9)
│   ├── layout/_layout.scss    .l-layout wrapper (relative, ground + pattern background via --glow-image/--glow-blend) + .l-content offset column (§9)
│   ├── layout/_sidebar.scss   .l-sidebar shell — TRANSPARENT (no surface/shadow), fixed 21rem, brand, grouped nav, 8px primary border-left accent; .l-sidebar-drawer mobile-panel overrides (§9)
│   ├── layout/_topbar.scss    .l-topbar shell — transparent (start cluster, action chips, :focus-visible-only focus) (§9)
│   ├── modules/_card.scss     .card the RAISED surface (card-bg + 1px border + faint shadow, radius 8px, padding 14px) (§9)
│   ├── utils/_tokens.scss   SCSS aliases of the v10 theme vars + the app-* custom tokens (for component SCSS)
│   └── theme/_dark.scss     Custom app tokens (:root + .dark) — app-ground/card/radii/sidebar-width + the mode-invariant --glow-* pattern tokens; --app-background folded into the cool ground (FOUC) (§9)
├── types/
│   ├── route.types.ts       AppRouteHandle { titleKey; title?(args) } (§6)
│   ├── i18n.types.ts        TranslationKey (DotPaths from en.json) — portable, no i18next ref (§8)
│   └── i18next-augmentation.ts  app-only ambient i18next CustomTypeOptions augmentation (typeof en.json). Split from i18n.types.ts so the node-typed test project (which pulls i18n.types via route types) doesn't hit TS2664; TranslationKey stays import-safe in tests (§8)
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

Repo root: index.html (holds <link id="app-theme"> + pre-paint theme-mode script + favicon link, §9),
public/favicon.svg (app mark; referenced by index.html),
README.md, .env.example, .nvmrc, vercel.json,
package.json, vite.config.ts, tsconfig.json (+ tsconfig.app/node/test.json; test.json = node-typed config for src/__test__ *.test.ts), eslint.config.js, tailwind.config.ts,
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

- `AppDataTable` — the only table. Wraps PrimeReact DataTable; Turkish-aware
  (global + column filters via the registered `nfcContains`; Turkish-collator
  column sort via `compareTurkish`). Header = a `toolbar` action slot + global
  search box + clear-filters button (resets search + column filters). Per-column
  filters via `filterDisplay` + `defaultFilters` (filter state managed internally).
  Two-mode loading (initial / empty → the `Loading` component; background refetch →
  DataTable overlay). Responsive paginator (`useMediaQuery` mobile/desktop template)
  with a `{first} - {last} / {total}` report. `emptyMessageKey` → `t()`. Props:
  `data`, `children` (columns), `dataKey`, `loading`, `toolbar`, `showSearchBox`,
  `globalFilterFields`, `filterDisplay`, `defaultFilters`, controlled sort
  (`sortField` / `sortOrder` / `onSort`), `paginator`, `rows`, `rowsPerPageOptions`,
  `rowClass` / `rowHover` / `stripedRows`, `emptyMessageKey`. Not its job: data
  fetching, page errors. No selection / expansion / grouping; rowClick is a 1.2
  decision. `buildInitialFilters` is the unit-tested pure core. (Final responsive
  prop + patient columns land in 1.2.)
- `AppToastProvider` — mounts the single PrimeReact `<Toast/>`; backs `useNotify`.
- `Loading` — lazy-route Suspense fallback (no skeletons).
- `ErrorState` — in-page expected-data error with `onRetry` (distinct from the
  error boundaries, which catch unexpected bugs).
- `RouteErrorBoundary` — React Router `errorElement` (`useRouteError`);
  `isRouteErrorResponse` 404 → `errors.notFound`, else `errors.unexpected`, with a
  home link (dev shows the error message).
- `AppErrorBoundary` — class boundary mounted **outermost** (just inside
  `StrictMode`, wrapping the providers) → `FatalError`; catches render crashes
  anywhere below.
- `FatalError`, `ConfigErrorScreen` — fallback screens that BOTH use the
  react-i18next **singleton** (`i18n.t`) + plain JSX (no PrimeReact, no hook) so
  they survive a crashed or pre-provider tree. `FatalError` = the AppErrorBoundary
  last-resort (reload button); `ConfigErrorScreen` = pre-providers env failure (dev:
  var names; prod: i18n message).
- `form/Form*` — Formik↔PrimeReact field wrappers (`FormInputText`,
  `FormDropdown`, `FormCalendar`, `FormInputNumber`, `FormCheckbox`,
  `FormChips`); i18n label + error display built in.
- `layout/App*` — `AppLayout`, `AppSidebar`, `AppTopbar`, `AppLogo`,
  `AppLanguageSwitcher`, `AppThemeToggle`. `AppLogo` is the brand mark (token-colored
  inline SVG + the `BRAND_NAME` constant wordmark — a proper noun, not i18n);
  `AppLanguageSwitcher` is a single text chip showing ONLY the active language code
  (`TR`/`EN`); clicking it switches to the other via `i18n.changeLanguage` (§8). It and
  `AppThemeToggle` share the `.l-topbar-chip` circular surface styling (§9).
  The shell styling lives in `styles/layout/_sidebar.scss` + `_topbar.scss`; the
  reusable content surface is the `.card` module (`styles/modules/_card.scss`, §9).

**Composables** (`src/composables`): `useMenu` (the single menu source — collects
each module's route constants via barrels + the docs registry, sorts by
`menuOrder`, resolves labels via `t(titleKey)`; `AppSidebar` only renders it);
`useNotify` (success/error/info; accepts ONLY a `TranslationKey` — a literal is a
compile error, §8; the pure `normalizeErrorKey` in `useNotify.lib` maps unknown
errors to `errors.unexpected`); `useMediaQuery` (matchMedia hook for responsive UI,
e.g. AppDataTable's paginator).

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
  `TranslationKey` (`types/i18n.types.ts`), and Yup messages go through the
  `message(key, values)` helper (`plugins/yup.ts`) that serializes `{ key, values }`
  with the key typed `TranslationKey`; a raw literal in either place is a compile
  error.
- **All Yup messages go through `message()`.** Every `setLocale` entry AND any
  custom `.test()` / inline schema message must use `message(key, values)` so it
  stays `TranslationKey`-typed and language-reactive; `FormField` resolves them at
  render via `resolveValidationMessage` → `t(key, values)` (interpolating
  `{{min}}`/`{{max}}`). `resolveValidationMessage`'s raw-string fallback is graceful
  degradation, NOT a license to pass a bare literal.
- **Key typing (`types/i18n.types.ts`).** `TranslationKey` is the leaf dot-path
  union derived (a recursive `DotPaths`) from the EN locale shape (`typeof`
  `en.json`, via `resolveJsonModule`). The same shape augments i18next's
  `CustomTypeOptions.resources`, so `t()` itself is key-checked natively — a wrong
  key is a compile error (`t()` → TS2345, a `satisfies TranslationKey` slot →
  TS1360). EN is the source of truth for the key set; `tr.json` must match it (a
  `node:test` asserts parity).
- A new key is added to BOTH `tr.json` and `en.json` in the same change.
- **Critical pattern.** An enum value is a constant; its label is translated:
  the status value is `'waiting'`, the label is ``t(`patients.status.${status}`)``.
- **Enum codes are the locale keys (0.5 → 1.1 forward-contract).** The canonical
  codes live under `patients.{status,priority,department,bloodType}` in the locale
  files. The status/priority/department enum unions in the model and the mapper
  (`models/patient.model.ts`, `lib/patient.mapper.ts`, §10) MUST use these exact
  codes; the mapper normalizes the API's Turkish display values
  (e.g. `Bekliyor` → `waiting`, `acil` → `urgent`, `Dahiliye` → `internalMedicine`)
  to them. `bloodType` keys are the raw notation (`0+`…); EN labels use the letter
  `O`, TR keeps the zero.

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

**No `/alpha` on token colours.** The bridged Tailwind colours are plain
`var(--…)` values (no `<alpha-value>` channel), so Tailwind's opacity modifier
(`bg-primary/10`, `text-text/50`) does NOT work on them. For hover / active /
selected states use a **solid surface step** (`bg-surface-100`, `bg-surface-200`,
…) — they are mode-correct via the swap — not an opacity variant.

### Prefer a theme var; add a custom token only when needed

Default to a Lara theme var — via the bridged Tailwind tokens (`primary`,
`surface.*`, `ground`, `card`, `surface-border`, `text`, `text-secondary`) or the
`_tokens.scss` aliases — for any colour/surface that has a suitable one. This keeps
PrimeReact and Tailwind on ONE palette, dark-correct via the theme swap (no `dark:`).
Define an app-specific CUSTOM token (`:root` + `.dark`, both modes — e.g.
`--app-background`, the FOUC background) ONLY when no suitable theme var exists OR
there is a clear functional reason (e.g. a value needed before the theme link loads).
Use judgment: reach for an existing var first; do not fragment the palette with
parallel custom colours.

### App shell custom tokens (Atlantis-inspired)

The shell adds app-specific custom tokens in `theme/_dark.scss` (colour tokens in
both modes, `:root` + `.dark`; radii/width/`--glow-*` are mode-invariant, `:root`
only), aliased in `utils/_tokens.scss`, and exposed to Tailwind in
`tailwind.config.ts` where used by TSX (`bg-app-ground`, `w-sidebar`). Color
literals live ONLY in these definitions (written as
`rgb()`, not hex, to match the file convention); every consumer uses the token:

| Token | Light | Dark |
| --- | --- | --- |
| `--app-ground` (wrapper/body bg) | `rgb(248 250 252)` | `rgb(9 9 11)` |
| `--app-background` (FOUC, = ground) | `var(--app-ground)` | `var(--app-ground)` |
| `--app-card-bg` (raised card surface) | `rgb(255 255 255)` | `rgb(24 24 27)` |
| `--app-card-border` | `rgb(226 232 240)` | `rgb(63 63 70)` |
| `--app-card-shadow` | `0 1px 2px rgb(15 23 42 / 4%), 0 1px 3px rgb(15 23 42 / 6%)` | `none` |
| `--app-menu-item-hover-bg` (sidebar hover/active overlay) | `rgb(100 116 139 / 10%)` | `rgb(255 255 255 / 5%)` |
| `--app-radius-card` / `-item` | `8px` / `8px` | same |
| `--app-radius-sidebar` / `-drawer` (desktop panel / mobile drawer right corners) | `16px` / `16px` | same |
| `--app-sidebar-width` | `21rem` (sidebar width; content offset is `+ 1rem` = 22rem) | same |
| `--glow-image` (pattern asset) | `url('../images/pattern.png')` | same |
| `--glow-blend` (pattern blend) | `hard-light, multiply` | same |

**Surface model (the core of the Atlantis look): the SIDEBAR is the FLAT layer and the
CARDS are the RAISED layer.** The sidebar has NO background, NO border, NO shadow — the
menu sits directly on the ground and the decorative pattern shows behind it. The `.card`
module is the only elevated surface: `--app-card-bg` (distinct from the ground) + a 1px
`--app-card-border` + a faint `--app-card-shadow` (which collapses to `none` in dark, the
border carrying the separation). `--app-background` is folded into the ground so first
paint matches. The favicon/Inter/`pattern.png` assets are fixed brand/decorative
literals, NOT theme tokens — the only sanctioned non-token colours.

### Static layout + decorative background

`.l-layout` (the wrapper, `position: relative`, `bg-app-ground`, `min-block-size: 100vh`)
holds the fixed sidebar plus `.l-content` — the content column (`padding: 2rem`,
`position: relative`, `z-index: 1`, `overflow-x: hidden`). At `>= lg` the column is offset
right of the fixed sidebar via `margin-inline-start: calc(var(--app-sidebar-width) + 1rem)`
(= 22rem), set in `_layout.scss` (not a Tailwind utility, so the collapse can transition it).
The **topbar lives inside `.l-content`** (`.l-topbar`: transparent,
`justify-content: space-between`, `margin-block-end: 2rem`; `.l-topbar-start` = hamburger
2.5rem + title, gaps 1.5rem; no avatar/search). The right cluster (`.l-topbar-actions`) is
the language + theme **chips**: `.l-topbar-chip` = circular (`border-radius: 50%`),
`2.5rem`, `--surface-card` background, `--surface-100` hover. The hamburger is a NEUTRAL
icon (`.l-topbar-iconbtn` → `--text-color-secondary`, beating the Lara text-button primary
via the `tw-components` layer), not primary. All topbar buttons are
**`:focus-visible`-only**: `.l-topbar-iconbtn:focus` clears the PrimeReact
box-shadow/outline (no ring on mouse click) and `:focus-visible` restores a 2px primary
ring for keyboard focus (§16).
**Sidebar** (`.l-sidebar` + `.l-sidebar-fixed`): **transparent**, fixed, full height,
`21rem`, `border-radius: 0 var(--app-radius-sidebar) var(--app-radius-sidebar) 0` (16px),
NO shadow/border; menu padding `0 1.5rem`, groups
`margin-bottom: 2.25rem` (first `margin-top: 2rem`), section label `0.857rem`/600/uppercase/
muted, items `padding: 0.5rem 1rem` + `border-inline-start: 8px solid transparent`; **active
= `border-inline-start-color: primary` (8px green accent) + `--app-menu-item-hover-bg`**
(no text-colour change), hover = the same overlay.
**Sidebar toggle.** The topbar hamburger is visible at all widths. At `>= lg` it toggles a
`.is-collapsed` modifier on `.l-layout` (state in `AppLayout`, branched on
`useMediaQuery('(min-width: 1024px)')`): collapsed → `.l-sidebar-fixed` `transform:
translateX(-100%)` and `.l-content` `margin-inline-start: 0` (content reflows full width),
both transitioned `0.3s cubic-bezier(0,0,0.2,1)`. Below `lg` the hamburger instead opens the
**mobile drawer** — the PrimeReact `<Sidebar>` with `showCloseIcon`, restyled via
`pt.root` + `.l-sidebar-drawer`: an OPAQUE `--app-ground` panel (overriding the Lara
surface so it matches the page ground in both modes), `border-radius: 0
var(--app-radius-drawer) var(--app-radius-drawer) 0` (16px), `box-shadow: none` (the
backdrop separates), `overflow: hidden`, width `w-sidebar` capped `max-w-[85vw]`. Its
`.p-sidebar-header` is positioned ABSOLUTE in the top-right (`padding: 1rem`,
`z-index: 1`) so the close (X) floats and takes no vertical space — the drawer renders the
same `SidebarContent` (logo + menu) with the logo at the very top, at the desktop offset
(the `.l-sidebar-brand` padding). The drawer closes on route change; the collapse
transform is gated to `>= lg`. The decorative background sits directly on `.l-layout`:
the **self-hosted** `images/pattern.png` (the licensed PrimeVue/Atlantis pattern asset,
self-hosted like the Inter font — never hot-linked) via the mode-invariant tokens
`--glow-image` + `--glow-blend` — `background-image: var(--glow-image)`,
`background-blend-mode: var(--glow-blend)` (`hard-light, multiply`),
`background-position: top`, `background-repeat: no-repeat`, `background-size: auto 20rem` —
blended against the element's `--app-ground` `background-color` (which MUST stay on
`.l-layout` for the blend to have a base), so ONE asset adapts to both modes. It shows
behind the transparent sidebar + topbar; the opaque drawer covers it. Atlantis's breakpoint
is 992px; we use Tailwind `lg` (1024px) so the drawer threshold matches our mobile rule.

### Custom SCSS goes in the right cascade layer (the `@layer`-merge mechanism)

Sass `@use` must be top-level, so to land custom rules in the correct CSS cascade
layer each shell/module partial **wraps its rules in `@layer tw-components { … }`**
(same-named layers merge regardless of source position); `@font-face` and the
`:root`/`.dark` custom-property blocks stay UNLAYERED (correct for them). `main.scss`
`@use`s the partials (`base/_typography`, `layout/_layout`, `layout/_sidebar`,
`layout/_topbar`, `modules/_card`). Layer ORDER stays locked by the `index.html` inline anchor (§9
Cascade (b)), so the partials appearing before the in-bundle `@layer` statement is
fine. SMACSS folders now in use: `base/` (typography), `layout/` (`l-*` shell),
`modules/` (`.card`); state via an `is-active` class. Class names are kebab-case
(SMACSS `l-`/`is-`), NOT BEM `__`/`--`, to satisfy `selector-class-pattern` without a
Stylelint config change.

### Typography (Inter, self-hosted)

`base/_typography.scss` `@font-face`s the **self-hosted Inter variable woff2** (latin
+ latin-ext subsets in `styles/fonts/`, with `unicode-range`; latin-ext covers the
Turkish glyphs ğ/ş/ı/İ) — **no npm dependency**, the font asset is the only addition.
`Inter` is the first `fontFamily.sans` entry in the Tailwind config (so preflight uses
it), and `main.scss` sets the **14px** base size + antialiasing in `@layer tw-base`.

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
        'app-ground': 'var(--app-ground)',
      },
      width: { sidebar: 'var(--app-sidebar-width)' },
      fontFamily: { sans: ['Inter', 'system-ui', /* … platform fallbacks */ 'sans-serif'] },
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

CSS `@layer` order: `tw-base, primereact, tw-components, tw-utilities` (utilities
win; `tw-base` lowest). Effective precedence: Tailwind utilities > our components >
PrimeReact theme > Tailwind preflight.

**(a) Why the `tw-` prefix.** Tailwind v3 owns the bare names `base` / `components` /
`utilities` as its OWN compile-time directives — wrapping `@tailwind base` in a
native `@layer base {}` makes Tailwind consume the wrapper and emit UNLAYERED CSS
(which would then beat the theme). Prefixing the native layers
(`tw-base` / `tw-components` / `tw-utilities`) keeps them as real CSS cascade layers
that Tailwind leaves intact. `primereact` is the theme's own layer, sitting between.

**(b) The inline `<style>@layer …;` anchor in `index.html` MUST stay first** (before
the `app-theme` link and the bundle CSS). It is the authoritative declaration of
layer order: raw HTML, immune to the bundler/minifier (lightningcss) rewriting the
in-bundle `@layer` statement, and the theme loads at runtime (the swappable
`<link>`), so the order must be pre-locked before any sheet loads. Do NOT remove or
reorder it; its names must match the `tw-*` layers.

**(c) `--app-background` is a custom token** (`theme/_dark.scss`, `:root` + `.dark`):
the pre-paint FOUC script needs a correct background BEFORE the theme `<link>`
loads, so it cannot depend on the not-yet-loaded Lara `--surface-*` vars. Keep
both-mode values; it is applied to `html` in `tw-base`.

**(d) No separate PrimeReact core import.** `primereact/resources/primereact.min.css`
is deprecated and EMPTY in 10.9.8; all component CSS (structural + skin) ships in
the theme, already wrapped in `@layer primereact`. Only the theme is loaded (the
swappable `?url` link); there is no core stylesheet to import or relocate.

SCSS folders (`utils/` + `theme/` + `main.scss` exist now;
`base/`/`layout/`/`modules/`/`state/` added when first used):

```
src/styles/
├── base/      reset, typography, element styles
├── layout/    l- prefixed major scaffolding
├── modules/   reusable component styles
├── state/     is- prefixed state classes
├── theme/     dark-mode custom tokens (under .dark) — _dark.scss
├── utils/     _tokens.scss, mixins, functions (no output)
└── main.scss  primeicons @import + @layer order + Tailwind-in-layers
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

The runner is **Node's built-in test runner** (`node --test`, the `node:test` +
`node:assert/strict` modules) over **pure-logic** specs — there is **no Vitest, no
React Testing Library, no MSW, no jsdom**. Tests are PLANNED in the audit step (§15)
and WRITTEN with the code in implementation.

- **Node 24 required.** Specs are TypeScript (`*.test.ts`) run via Node's native
  type-stripping, which needs **Node 24** (per `.nvmrc`; CI uses it). On older Node
  (e.g. 20) `node --test` silently skips the `.ts` specs and only the JS tooling test
  runs — so run tests on Node 24 (`nvm use`) or trust CI.
- **What is tested** — pure functions: `lib/` (mapper, `pickLocalized`, `formatDate`,
  Turkish normalise), pure composable cores (`useMenu.lib` grouping, `useNotify.lib`,
  `theme.lib`, `AppDataTable.lib`, form `validation`), locale parity, and the custom
  lint rule (`RuleTester`). **Components, hooks, and DOM/interaction are NOT
  unit-tested** (no renderer) — shell/visual behaviour is covered by `validate`
  (type-check + ESLint + Stylelint + Prettier) + manual QA. Adding a DOM harness
  (Vitest/RTL/jsdom) for component smoke tests would be a separate chore.
- **Layout** — specs live under `src/__test__/` mirroring the source tree, as
  `*.test.ts`. Value imports use relative paths with the `.ts` extension (node:test
  does not resolve `@/`); type-only imports may use `@/`. The tooling RuleTester test
  stays in `tools/eslint/`.
- **Coverage** — no mandatory threshold.

Detail: `docs/en/TESTING.md`.

## 12. Linting and Quality

One integrated chain; Prettier is the only formatter.

| Tool                | Owns                                   | Conflict resolution                       |
| ------------------- | -------------------------------------- | ----------------------------------------- |
| typescript-eslint   | TS/React correctness, rule violations  | —                                         |
| eslint-plugin-i18next | `no-literal-string` (JSX-only, §8)   | —                                         |
| eslint-plugin-jsx-a11y | accessibility floor (§16)           | —                                         |
| eslint-plugin-simple-import-sort | import + export order (enforced, auto-fixed by `eslint --fix`; groups per §5: side-effects, `node:`, externals (react first), `@/` alias, relative) | — |
| eslint-plugin-import-x | import hygiene (all files): `no-duplicates` = error, `first` + `newline-after-import` = warn; `no-unresolved` off (TS verifies resolution — no resolver). Ordering stays with simple-import-sort (`import-x/order` off) | — |
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
| `TESTING.md`            | Test strategy, MSW, layout (`src/__test__`), priorities   |
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
  `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE` → major (with the
  pre-1.0 exception below). Readable history (commitlint, §12) is therefore also
  the release source. Every reviewed sub-commit is **preserved** on `main` (not
  squashed — §15 Merge strategy), so release-please reads each Conventional type.
- **Release flow** (live): merging a topic branch to `main` — preserving its
  sub-commits (**Rebase and merge** on GitHub, §15) — deploys the code (Vercel)
  immediately; the version is unchanged. The release-please GitHub Action
  (`.github/workflows/release.yml`, config in `release-please-config.json` +
  `.release-please-manifest.json`) opens/updates a single **Release PR** that
  bumps the version and regenerates `CHANGELOG.md` from the commits since the last
  release. That Release PR is opened by the `GITHUB_TOKEN`, so it does **not**
  trigger the `gate` check (GitHub anti-recursion: a token-opened PR cannot start
  Actions). The owner has two ways to merge it: (a) because branch protection
  keeps administrators exempt (§15), merge this mechanical version + `CHANGELOG`
  PR directly, without the check; or (b) **CLOSE + REOPEN the Release PR in the
  GitHub UI** — a human-initiated reopen is outside the `GITHUB_TOKEN`
  anti-recursion rule, so it triggers CI, `gate` runs, and the PR merges with a
  real green check. The reopen path is the one that yields a green `gate`.
  Merging it performs the version bump + git tag. The app is private — there is
  **no npm publish**. Detail: `docs/en/VERSIONING.md`.
- **0.x during initial development.** release-please is kept in the pre-1.0 range.
  The manifest is seeded at `0.0.1`, **not** `0.0.0` — at `0.0.0` release-please
  ignores the pre-major options and jumps straight to `1.0.0`
  (googleapis/release-please#2087) — and `bump-minor-pre-major: true`
  (`release-please-config.json`) keeps breaking changes as MINOR bumps inside 0.x.
  So while pre-1.0: `feat:` and breaking changes bump the **minor** (e.g.
  `0.1.0` → `0.2.0`, staying in 0.x) and `fix:` bumps the **patch**. The first
  release therefore lands at `0.1.0`. The move to `1.0.0` is **deliberate**, taken
  when the app is feature-complete — not triggered automatically by a breaking
  change.
- **Required repo setting.** Because release-please opens its Release PR with the
  `GITHUB_TOKEN`, **Settings → Actions → General → Workflow permissions → "Allow
  GitHub Actions to create and approve pull requests"** must be ENABLED, or the
  Action cannot open the Release PR.

## 15. Workflow

A team workflow. The repository owner is the team manager: nothing reaches `main`
without their review. Claude Code never commits or merges without explicit
approval, and never opens pull requests — its flow ENDS at commit + docs:sync +
push; the owner opens the PR on GitHub. Detail: `docs/en/WORKFLOW.md` (also
covers the CI / Vercel / release mechanics).

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
   docs + drift. Refined in chat; on approval the §0.1 Active Work item is created
   for the TOPIC.
2. **Implementation, one sub-item at a time** — a branch is ONE topic (≈ a
   SPRINT_PLAN task, or a tight group of related sub-steps) and carries MULTIPLE
   commits, one per reviewed sub-item. For each sub-item: Claude Code writes code +
   tests → **developer self code-review** (issues → fix → re-review loop) → a
   Conventional Commit when confident (commitlint runs per commit, §12). Claude Code
   never commits without explicit approval. The §0.1 Active Work `Next` / `status` is
   updated as sub-items land.
3. **docs:sync in the topic's final commit** — docs (both languages, §13.3) +
   `SPRINT_PLAN.md` ✅ + the Active Work deletion ride in the topic's LAST commit (or
   their own `docs:` / `chore:` commit), with a Conventional message (§14).
4. **Finish the topic.** **Push** the branch and STOP — the developer flow ENDS
   here. Claude Code does NOT open the pull request; the owner does (Manager step
   5 below). After pushing, the agent outputs the proposed PR title and body (the
   contract) in its final report; the owner opens the PR on GitHub using that
   text.

### Automated gate (CI)

On every PR, CI runs the `gate` job (`validate` + tests + `build` +
`npm audit --audit-level=high`; `.github/workflows/ci.yml`); **a PR cannot merge
unless `gate` is green** (required status check). Humans then review substance.

### Manager (the owner)

5. **Open the PR on GitHub; the PR description is the contract** (audit plan +
   what was done + test notes + docs touched + acceptance criteria + linked
   backlog item), using the title and body the agent proposed in its final report
   (Developer step 4). CI's `gate` job runs on the PR and must be green before
   review (Automated gate + Merge strategy below).
6. **Review** against the contract (plan, acceptance criteria, code, docs) across the
   topic's sub-commits — *target:* on the PR with CI green; *interim:* on the local
   branch/commits. Issues → back to the developer.
7. **Merge to `main`** preserving the sub-commits (Merge strategy below) →
   production deploy (Vercel) + release-please opens/updates the Release PR (§14).

### Merge strategy

Merges **PRESERVE the reviewed sub-commits linearly on `main` — no squash.** Each
sub-commit is atomic, reviewed, and Conventional, and release-please reads each type
(§14), so squashing would drop release signal. Close a topic with **Rebase and
merge** on GitHub (never "Squash and merge", never a merge commit), then delete the
branch and `git checkout main && git pull`.

### Branch protection

`main` protection is **ON**, applied by the owner in repository settings:
require a pull request before merging; require the `gate` status check to pass;
require linear history (so only **Rebase and merge** is possible — no merge
commits, no squash); block force-pushes and branch deletion. **Do NOT enable "Do
not allow bypassing the above settings"** — administrators stay exempt so the
owner can merge the release-please Release PR, which (opened by `GITHUB_TOKEN`)
never runs the `gate` check (§14). Solo note: GitHub does not let you approve your
own PR, so the gate is the required `gate` status check (CI green); enable required
approvals (1+) when a teammate joins. Rollback: Vercel instant rollback to a
previous deployment; urgent fix via `fix/*`, same flow expedited.

### Fast path

Trivial, low-risk changes (incl. Dependabot bumps) skip the formal audit / Active
Work ceremony (implement → self-review → Conventional commit) — but the gates are
never skipped: the owner-opened PR + CI `gate` + the owner's merge. Only the
audit is lightened.

### Git conventions

Branches `feat/*`, `fix/*`, `chore/*` (also `docs/*`, `refactor/*`, `test/*`) — one
topic per branch, carrying MULTIPLE Conventional Commits (`type(scope): subject`),
one per reviewed sub-item, enforced by commitlint (§12) and consumed by release-please
(§14). Push is manual. Merges preserve the sub-commits (Merge strategy above):
**Rebase and merge** on GitHub — never squash, never a merge commit.

Every prompt ends with: "If you see an issue, ambiguity, or a better suggestion,
surface it before implementing. Otherwise proceed." Gate failures loop back: a
failed self-review returns to implementation; a failed review returns to the developer.

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

**Responsive (mobile-first):**

- Design mobile-first; layer Tailwind breakpoints up (`sm` 640 / `md` 768 / `lg`
  1024 / `xl` 1280 — Tailwind defaults). Avoid fixed pixel widths; prefer fluid
  utilities (`w-full`, `max-w-*`, grid/flex) and verify at `sm`/`md`/`lg`/`xl`.
- Bake responsive behaviour into the `App*` / `Form*` wrappers so screens get it by
  default: `AppSidebar` collapses on small screens (off-canvas/toggle); `AppDataTable`
  adopts a responsive/horizontal-scroll mode rather than overflowing; `Form*` fields
  stack to one column on narrow widths; `Dialog` goes full-width on mobile.
- Tool split: use **PrimeReact's own responsive features** for a component's internals
  — `DataTable` scroll/responsive mode, `Dialog` `breakpoints` (e.g.
  `{ '960px': '75vw', '640px': '95vw' }`) — and **Tailwind breakpoint utilities** for
  the layout/spacing around them. Don't reimplement what the component already provides.
  (The exact `AppDataTable` responsive prop is settled when that wrapper is built in
  1.2.)

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
8. Styling (§9) — token-backed only, no raw hex; prefer a theme var, custom token
   only when no suitable var exists or a functional reason; SCSS via `_tokens.scss`;
   every colour valid in both modes; no `dark:` on token colours; no `@apply` in SCSS.
9. State (§10) — React Query seeds from storage; CRUD via the storage service +
   `invalidateQueries`; query-key factory; one source of truth.
10. Tests (§11) — planned in audit, written with the code; MSW for the GET; under
    `src/__test__/` mirroring source.
11. Lint/format (§12) — `validate` passes.
12. Accessibility / performance / responsive (§16) — labelled fields, a11y lint,
    lazy routes; mobile-first, Tailwind breakpoints, responsive `App*`/`Form*` wrappers.
13. Docs (§13) — routed through §13.3, both languages, registered per §13.4
    (incl. `docsRegistry`).
14. Versioning (§14) — a clear Conventional Commit (release-please derives the
    bump); no version / dependency-major drift (§1.1).
15. Workflow (§15) — pre-work docs consulted; no self-commits/merges; gates and
    PR-contract respected.
