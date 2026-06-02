# SPRINT_PLAN.md

The living backlog AND the permanent record (§13.6). Tasks are pulled from here
in order; each carries sub-steps, the files it creates, acceptance criteria,
dependencies, test notes, and a Definition of Done (DoD). Completed tasks are
marked ✅ and never deleted; the transient "where are we" pointer is §0.1 Active
Work in CLAUDE.md, not this file.

**Status legend:** ⬜ planned · 🟡 in-progress · ✅ done

**Global DoD** (every task, on top of its own): consulted docs surfaced (§15);
`validate` + tests + `build` green locally; `npm audit --audit-level=high` clean;
docs synced in both languages per §13.3; a Conventional Commit (§14); PR opened
with the contract description (§15); CI green before merge. No raw hex, no string
literals in JSX, barrel-only imports, `App*`/`Form*` wrappers at call sites.

> Sprints 0 scaffolds the app to a runnable, lint-clean shell. Sprint 1 builds
> the patients feature end to end. Sprint 2 fills documentation, tests, a11y, and
> ships the first release. Within a sprint, tasks are mostly sequential by their
> `Depends on`.

---

## Sprint 0 — Foundation / Scaffolding

Outcome: an empty but runnable, fully-tooled app — providers wired, theme +
i18n + routing live, global components in place, CI/release/docs operational —
with zero feature code.

### 0.1 ✅ Project bootstrap + pinned dependencies
**Goal:** A runnable Vite + React 18 + TS (strict) skeleton with the exact
version policy (§1.1) locked.
**Depends on:** —
**Sub-steps:**
- Scaffold Vite `react-ts`; set Node in `.nvmrc`.
- Install + **exact-pin** `primereact@10.9.8`, `primeicons`, `tailwindcss@3.4.x`;
  carets for the rest (router, react-query, formik, yup, dayjs, i18next,
  react-i18next, react-markdown, remark-gfm, @tailwindcss/typography).
- `tsconfig.json` strict; path alias `@/` → `src/` (tsconfig + `vite.config.ts`).
- `vite.config.ts`: React plugin, alias, `base`/build config.
- Verify `npm ci` works against the committed lockfile.
**Files:** `package.json`, `package-lock.json`, `.nvmrc`, `tsconfig.json`,
`vite.config.ts`, `index.html` (minimal), `src/main.tsx` (placeholder),
`.gitignore` (`.env`, `dist`, `node_modules`).
**Acceptance:** `npm ci && npm run dev` serves a blank app; `npm run build`
passes; PrimeReact + Tailwind pinned exactly (no `^` on them).
**Tests:** none yet (tooling lands in 0.2).
**DoD:** + global DoD. Commit `chore: bootstrap vite react-ts project`.

### 0.2 ✅ Tooling + custom lint rule
**Goal:** The full quality chain (§12) green on an empty project, including the
local `no-explanatory-comments` rule.
**Depends on:** 0.1
**Sub-steps:**
- ESLint flat config: `typescript-eslint`, `eslint-plugin-i18next`
  (`no-literal-string` JSX-only + `jsx-attributes` whitelist + `callees`
  excluding `t`/`i18n.t`/`clsx`/`cn`; off in test/constants), `eslint-plugin-jsx-a11y`,
  `eslint-config-prettier`.
- Implement `tools/eslint/no-explanatory-comments.js` (allowlist per §7/§12) and
  wire it as an inline `local` plugin in `eslint.config.js`.
- Prettier, Stylelint (`stylelint-config-standard-scss` + `stylelint-order` +
  `stylelint-prettier`), commitlint (`config-conventional`), Husky
  (`pre-commit` → lint-staged; `commit-msg` → commitlint), lint-staged.
- Scripts: `type-check`, `lint`, `lint:style`, `format:check`, `validate`
  (= the four), `test` (placeholder), `build`.
**Files:** `eslint.config.js`, `tools/eslint/no-explanatory-comments.js`,
`tools/eslint/no-explanatory-comments.test.js` (RuleTester), `.prettierrc`,
`.prettierignore`, `stylelint.config.js`, `commitlint.config.js`,
`.husky/pre-commit`, `.husky/commit-msg`, `package.json` (scripts + lint-staged).
**Acceptance:** `npm run validate` passes; a planted explanatory comment fails
lint; a non-conventional commit message is rejected by the hook.
**Tests:** `RuleTester` cases for the custom rule (valid: allowlisted directives;
invalid: prose comment, JSDoc block).
**DoD:** + global DoD. Commit `chore: add lint, format, commit, and custom comment-rule tooling`.

### 0.3 ✅ Plugins, config, theme bootstrap + providers
**Goal:** All third-party libraries configured in `src/plugins/`, env typed and
validated, theme fed from the resources path, providers mounted in the correct
bootstrap order.
**Depends on:** 0.1 (0.2 for lint-clean)
**Sub-steps:**
- `config/env.ts` (typed, frozen, `validateRequiredEnvVars()` for `VITE_API_URL`)
  + `config/vite-env.d.ts`; `.env.example`.
- `plugins/primereact.ts`: PrimeReactProvider value, locale wiring, and
  `FilterService.register('nfcContains', …)` (§8).
- `plugins/theme.ts`: `?url` imports of `lara-light-green` + `lara-dark-green`;
  owns `<link id="app-theme">`, `applyTheme()`, `setThemeMode()` (href swap +
  `dark` class + `theme-mode` persist) (§9).
- `plugins/react-query.ts` (QueryClient defaults §10), `plugins/dayjs.ts`
  (`localizedFormat`, tr/en, `setDayjsLocale`), `plugins/i18n.ts` (react-i18next
  init + PrimeReact + Day.js bridge), `plugins/yup.ts` (`yup.setLocale` → keys).
- `index.html`: `<link id="app-theme">` + pre-paint inline script reading
  `theme-mode` to set the `dark` class before first paint (§9).
- `main.tsx` bootstrap order: init i18n → `validateRequiredEnvVars()` (fail →
  `ConfigErrorScreen` via the i18n singleton) → apply theme link → mount
  providers (QueryClientProvider, PrimeReactProvider, AppToastProvider,
  AppErrorBoundary) → `RouterProvider`.
**Files:** `src/config/env.ts`, `src/config/vite-env.d.ts`,
`src/plugins/{primereact,theme,react-query,dayjs,i18n,yup}.ts`, `index.html`,
`src/main.tsx`, `.env.example`.
**Acceptance:** app boots with light/dark green theme; toggling `theme-mode` in
storage flips theme with no flash; missing `VITE_API_URL` shows
`ConfigErrorScreen`; no console errors.
**Tests:** unit for `env` validation (missing var throws); `setThemeMode` swaps
href + toggles class (jsdom).
**DoD:** + global DoD. Commit `feat: configure plugins, env, and theme bootstrap`.

### 0.4 ⬜ Styling system — token-backed Tailwind + SCSS (SMACSS) + dark
**Goal:** One token source (the v10 theme variables) consumed by both Tailwind
and SCSS; custom tokens defined for both modes; no raw hex anywhere.
**Depends on:** 0.3
**Sub-steps:**
- `tailwind.config.ts`: token-backed colours (`primary`, `surface.*`, `ground`,
  `card`, `surface-border`, `text`, `text-secondary` → v10 vars), `darkMode:
  'class'`, `@tailwindcss/typography` plugin, `content` globs. `postcss.config.js`.
- `src/styles/` SMACSS skeleton: `base/`, `layout/`, `modules/`, `state/`,
  `theme/`, `utils/`; `utils/_tokens.scss` (SCSS aliases of the v10 vars);
  `theme/_dark.scss` (app-specific custom tokens under `:root` + `.dark`);
  `main.scss` importing in SMACSS order; `@layer base, primereact, components,
  utilities`.
- Import `main.scss` (and PrimeIcons) in `main.tsx`; confirm no `@apply`/`@tailwind`
  inside SCSS modules.
**Files:** `tailwind.config.ts`, `postcss.config.js`, `src/styles/**` (folders +
`_tokens.scss`, `_dark.scss`, `main.scss`).
**Acceptance:** a token Tailwind class (e.g. `bg-ground text-text`) renders
correctly in both modes via the swap (no `dark:` needed); Stylelint passes; a
planted hex value fails review intent (documented), `_tokens.scss` is the only
colour source for SCSS.
**Tests:** none (visual/lint-verified).
**DoD:** + global DoD. Commit `feat: add token-backed tailwind and SMACSS scss layer`.

### 0.5 ⬜ i18n locale files + key typing
**Goal:** Base locale JSON for both languages and the `TranslationKey` type that
makes `useNotify`/Yup key-only.
**Depends on:** 0.3
**Sub-steps:**
- `locales/tr.json` + `locales/en.json` with base namespaces: `common.*`
  (actions, labels), `errors.*` (incl. `errors.unexpected`), `validation.*`
  (Yup messages), `patients.*` (title, fields, status/priority/bloodType labels),
  `docs.*`. Keys identical across both files.
- `types/i18n.types.ts`: derive a `TranslationKey` union from the EN resource
  shape; export for `useNotify` and elsewhere.
**Files:** `src/locales/tr.json`, `src/locales/en.json`, `src/types/i18n.types.ts`.
**Acceptance:** both files have identical key sets; `TranslationKey` resolves;
passing a non-key string to a `TranslationKey` slot is a compile error.
**Tests:** unit asserting `Object.keys(tr)` deep-equals `Object.keys(en)`
(recursively) so the two never drift.
**DoD:** + global DoD. Commit `feat: add bilingual locale files and translation-key typing`.

### 0.6 ⬜ Router + layout shell + menu + dynamic title
**Goal:** A working `AppLayout` with sidebar/topbar, language + theme switches, a
data router aggregating (empty) module routes, and title resolution.
**Depends on:** 0.3, 0.4, 0.5
**Sub-steps:**
- `types/route.types.ts`: `AppRouteHandle { titleKey; title?(match) }`.
- `lib/route.ts`: `getRouteHandle()` typed guard over `UIMatch`.
- `composables/useMenu.ts`: collect module route constants (via barrels) + docs
  registry, sort by `menuOrder`, label via `t(titleKey)`.
- `components/layout/`: `AppLayout` (`<Outlet/>` + `<ScrollRestoration/>` +
  `document.title` from deepest handle: `title(match)` else `t(titleKey)`),
  `AppSidebar` (renders `useMenu`), `AppTopbar`, `AppLanguageSwitcher` (single
  flow §8), `AppThemeToggle` (`plugins/theme`).
- `router/index.tsx`: `createBrowserRouter` — one `AppLayout` route with
  `errorElement`, children = index redirect → `/patients`, spread module arrays
  (empty for now), `*` 404.
**Files:** `src/types/route.types.ts`, `src/lib/route.ts`,
`src/composables/useMenu.ts`, `src/components/layout/{AppLayout,AppSidebar,AppTopbar,AppLanguageSwitcher,AppThemeToggle}.tsx`,
`src/router/index.tsx`.
**Acceptance:** app renders layout; switching language updates labels + dates +
`<html lang>`; theme toggle works; unknown URL → 404; index redirects to
`/patients` (placeholder until 1.2); `document.title` tracks the active route.
**Tests:** `getRouteHandle` guard; `useMenu` ordering + label resolution
(render with a stubbed registry).
**DoD:** + global DoD. Commit `feat: add router, app layout, menu, and dynamic title`.

### 0.7 ⬜ Global components (wrappers, forms, error surfaces, notify)
**Goal:** Every reusable building block from §3.1 exists so feature code never
touches raw PrimeReact.
**Depends on:** 0.3, 0.5, 0.6
**Sub-steps:**
- `AppDataTable.tsx`: DataTable wrapper — native sort/filter/search; Turkish
  global filter + text filters via `nfcContains`; `Intl.Collator('tr')` sort;
  `emptyMessageKey`→`t()`; controlled/uncontrolled sort+filter props (§3.1).
- `lib/text.ts` (NFC + `toLocaleLowerCase('tr')`, collator), `lib/date.ts`
  (`formatDate`), `lib/pickLocalized.ts`.
- `form/`: `FormInputText`, `FormDropdown`, `FormCalendar`, `FormInputNumber`,
  `FormCheckbox`, `FormChips` — Formik-bound, i18n label + error built in.
- `useNotify.ts` (key-only `TranslationKey` API + error normalisation) +
  `AppToastProvider.tsx` (single `<Toast/>`).
- Error surfaces: `Loading`, `ErrorState` (in-page + retry), `RouteErrorBoundary`,
  `AppErrorBoundary` → `FatalError`, `ConfigErrorScreen`.
**Files:** `src/components/AppDataTable.tsx`, `src/components/AppToastProvider.tsx`,
`src/components/{Loading,ErrorState,RouteErrorBoundary,AppErrorBoundary,FatalError,ConfigErrorScreen}.tsx`,
`src/components/form/*.tsx`, `src/composables/useNotify.ts`,
`src/lib/{text,date,pickLocalized}.ts`.
**Acceptance:** a throwaway demo route renders `AppDataTable` with mock rows
(Turkish search/sort works), a `Form*` field shows i18n label + Yup error, a
`useNotify` toast fires; `ErrorState` + boundaries render their fallbacks; a
literal passed to `useNotify` is a compile error.
**Tests:** `lib/text` normalise + collator order; `formatDate` patterns + invalid
ISO → `''`; `pickLocalized` fallbacks; `AppDataTable` Turkish filter match.
**DoD:** + global DoD. Commit `feat: add global components, form fields, and error surfaces`.

### 0.8 ⬜ CI, release-please, Dependabot, deploy config
**Goal:** Automated gate + release automation + dependency hygiene + SPA routing
on Vercel (§14, §15).
**Depends on:** 0.2
**Sub-steps:**
- `.github/workflows/ci.yml`: on PR → `npm ci` → `validate` → `test` → `build` →
  `npm audit --audit-level=high`; set as a required status check.
- `.github/workflows/release.yml`: release-please action;
  `release-please-config.json` + `.release-please-manifest.json` (version `0.0.0`
  start, `release-type: node`, **no publish** — private).
- `.github/dependabot.yml`: npm ecosystem, group minor/patch, **ignore major**
  for `primereact`, `tailwindcss`, `react`, `react-dom` (§1.1).
- `vercel.json`: SPA rewrite (all → `/index.html`); document branch-protection
  setup in WORKFLOW (solo: required checks + manual merge).
**Files:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`,
`release-please-config.json`, `.release-please-manifest.json`,
`.github/dependabot.yml`, `vercel.json`.
**Acceptance:** opening a PR runs CI; a `feat:`/`fix:` merge to `main` makes
release-please open a Release PR with a correct bump + CHANGELOG; deep links
work on Vercel (no 404 on refresh).
**Tests:** none (pipeline-verified on the first real PR).
**DoD:** + global DoD. Commit `ci: add CI gate, release-please, dependabot, and SPA rewrite`.

### 0.9 ⬜ Docs module + registry + skeleton docs + README
**Goal:** The in-app docs viewer works and every §13.2 doc exists (skeleton) in
both languages, registered.
**Depends on:** 0.6
**Sub-steps:**
- `modules/docs/`: markdown renderer component (`react-markdown` + `remark-gfm`,
  `@tailwindcss/typography` prose styles), loader via
  `import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default' })` keyed
  by active language; `constants/docs-registry.ts` (slug + `titleKey`, single
  source); `routes.tsx` (`DOCS_ROUTES`): `/docs` overview + `/docs/:slug` viewer;
  `pages/`, `index.ts` barrel.
- Wire docs routes into `router/index.tsx`; `useMenu` appends the docs group.
- Create skeleton `docs/en/*` + `docs/tr/*` for every §13.2 file, each opening
  with the §13.1 plain summary (content filled in 2.1). `CHANGELOG.md` is
  English-only at repo root (§13.5).
- `README.md`: setup, scripts, env (`VITE_API_URL`), deploy.
**Files:** `src/modules/docs/**`, `docs/en/*.md`, `docs/tr/*.md`,
`docs/en/modules/*.md`, `docs/tr/modules/*.md`, `README.md`.
**Acceptance:** `/docs` lists all docs; `/docs/:slug` renders the active-language
markdown; switching language swaps content; sidebar shows the docs group; every
registered doc is reachable; unregistered doc rule holds.
**Tests:** docs-registry slug↔file integrity (every registry slug resolves to an
existing en + tr file).
**DoD:** + global DoD. Commit `feat: add in-app docs module with bilingual skeletons`.

---

## Sprint 1 — Patients feature (end to end)

Outcome: list + add + edit + delete patients, bilingual, Turkish-aware, persisted
in `localStorage`, seeded once from the GET.

### 1.1 ⬜ Patients data layer
**Goal:** Model, mapper, read-only GET, storage CRUD service, query keys, and the
seed + mutation composables (§10).
**Depends on:** 0.3, 0.7
**Sub-steps:**
- `models/patient.model.ts`: `PatientRecord` flat camelCase (incl. `noteTr`,
  `noteEn`, `diagnosisTr`, `diagnosisEn`) + enum-like unions (`status`,
  `priority`, `bloodType`, `department`), confirmed against the live API.
- `lib/patient.mapper.ts`: raw snake_case → model (flat, typed enums) — seed only.
- `api/patients.api.ts`: GET raw rows (uses `env.VITE_API_URL`).
- `api/patients.storage.ts`: `patientStorage.{read,write,add,update,remove,clear}`
  at `STORAGE_KEY='patients'`; `read` → `[]` on missing/corrupt; `write` → quota
  error via `useNotify`.
- `constants/query-keys.ts`: `patientKeys.all()` (function form + `as const`).
- `composables/usePatients.ts`: `useQuery` reads storage; if empty → GET → map →
  `write` → return (idempotent/StrictMode-safe; `throwOnError:false`).
- `composables/usePatientMutations.ts`: add/update/remove via storage +
  `invalidateQueries(patientKeys.all())`; success/error `useNotify`.
- `constants/patient-options.constants.ts`: option lists for dropdowns (values
  constant, labels via i18n keys).
- `index.ts` barrel (public API + routes + route constants).
**Files:** `src/modules/patients/{models,lib,api,constants,composables}/…`,
`src/modules/patients/index.ts`.
**Acceptance:** first load seeds from GET into storage; reload reads from storage
(no second GET); add/edit/remove persist and the list updates via invalidation;
corrupt storage value → empty list (no crash); model has no free `string` enums.
**Tests (priority):** mapper snake→camel + enum typing; storage read corrupt →
`[]`; add/update/remove round-trip; `usePatients` seeds once then reads storage
(MSW for the GET); `usePatientMutations` invalidates.
**DoD:** + global DoD; `STATE_MANAGEMENT.md` + `modules/PATIENTS.md` updated.
Commit `feat(patients): add data layer with storage-backed crud`.

### 1.2 ⬜ Patient list (AppDataTable, Turkish sort/filter/search)
**Goal:** The list page rendering `AppDataTable` with the case-study's one sort +
one filter + one search, bilingual fields and labels.
**Depends on:** 1.1
**Sub-steps:**
- `pages/PatientsPage.tsx` (thin): calls `usePatients`, renders `PatientList`,
  handles loading (`Loading`) and read error (`ErrorState` + retry).
- `components/PatientList.tsx`: `AppDataTable` columns — `fullName`, `department`
  (filter), `appointmentDate` (`formatDate 'LLL'`), `status`/`priority` as
  translated tags (``t(`patient.status.${value}`)``), localized note via
  `pickLocalized`; global search box; one sortable column; Turkish-aware match.
- Row actions (edit/delete) as icon buttons with `aria-label={t(...)}` (wired in 1.3).
- `routes.tsx`: `PATIENT_ROUTES.LIST` + lazy page + `handle.titleKey`.
**Files:** `src/modules/patients/pages/PatientsPage.tsx`,
`src/modules/patients/components/PatientList.tsx`,
`src/modules/patients/routes.tsx` (+ barrel export).
**Acceptance:** `/patients` lists seeded data; Turkish search (e.g. `şişli`/`sisli`)
matches; sort respects Turkish collation; the department filter narrows rows;
empty state shows the i18n `emptyMessage`; columns render localized values and
formatted dates; language switch re-labels without reload.
**Tests:** `PatientList` renders rows, Turkish filter narrows, sort order correct
(RTL, MSW seed).
**DoD:** + global DoD; `modules/PATIENTS.md` updated. Commit
`feat(patients): add list page with turkish-aware table`.

### 1.3 ⬜ Patient add / edit / delete form
**Goal:** A bilingual form (all fields side by side) in a dialog, validated by
Yup, wired to the mutations, with delete confirmation.
**Depends on:** 1.1, 1.2
**Sub-steps:**
- `lib/patient.form.ts`: form values ↔ model (ISO↔`Date` for calendars; defaults
  for create).
- `lib/patient-form.schema.ts`: Yup schema using `yup.setLocale` keys (no literal
  messages); required/format rules for the fields.
- `components/PatientForm.tsx`: Formik + `Form*` fields for every field incl.
  both `noteTr`/`noteEn` and `diagnosisTr`/`diagnosisEn` shown together (no tabs).
- `components/PatientDialog.tsx`: PrimeReact Dialog (focus-trap, `aria-labelledby`,
  focus return) hosting the form for create + edit.
- Wire list actions: add (toolbar), edit (row), delete (row → confirm) to
  `usePatientMutations`; success/error toasts; `dataKey` stable id.
**Files:** `src/modules/patients/lib/{patient.form,patient-form.schema}.ts`,
`src/modules/patients/components/{PatientForm,PatientDialog}.tsx` (+ wiring in
`PatientList`/`PatientsPage`).
**Acceptance:** create adds a row (persisted); edit updates it; delete (after
confirm) removes it; validation errors show localized messages; both-language
fields save; dialog is keyboard-accessible; toasts fire on success/error.
**Tests:** schema validation (missing required, bad date); form↔model mapping
round-trip; create/edit/delete update storage + list (RTL + MSW).
**DoD:** + global DoD; `modules/PATIENTS.md` updated. Commit
`feat(patients): add create, edit, and delete form`.

---

## Sprint 2 — Documentation, tests, accessibility, release

Outcome: docs fleshed out, the priority test suite in place, a11y verified, and
the first tagged release.

### 2.1 ⬜ Fill documentation content (en + tr)
**Goal:** Replace the 0.9 skeletons with real, plain-language content (§13.1) for
every doc, both languages.
**Depends on:** Sprint 1 complete
**Sub-steps:** write `ARCHITECTURE`, `COMPONENTS`, `CODING_STANDARDS`, `STYLING`,
`STATE_MANAGEMENT`, `I18N`, `TESTING`, `WORKFLOW`, `VERSIONING`,
`modules/PATIENTS`, `modules/DOCS` — each with the §13.1 summary + short examples;
keep code/identifiers English in both languages (§13.5); verify against the code
(flag/fix any drift).
**Files:** `docs/en/*.md`, `docs/tr/*.md`, `docs/{en,tr}/modules/*.md`.
**Acceptance:** each doc renders in-app in both languages; no doc↔code drift;
every §13.2 entry is non-skeleton; registry intact.
**Tests:** (reuse 0.9 registry-integrity test.)
**DoD:** + global DoD. Commit `docs: write full bilingual documentation content`.

### 2.2 ⬜ Test suite to priority bar
**Goal:** Solidify the priority targets (§11) and MSW setup beyond the unit tests
already landed with features.
**Depends on:** Sprint 1 complete
**Sub-steps:** finalize MSW handlers + test setup; ensure coverage of pure `lib/`
(mapper, `pickLocalized`, `formatDate`, Turkish normalise/collator), composable
CRUD-on-storage + seed-once behaviour, and the custom lint rule (`RuleTester`);
add any missing `*.test.ts(x)` colocated files; fix flakes.
**Files:** `src/test/setup.ts`, `src/test/msw/*`, colocated `*.test.ts(x)`.
**Acceptance:** `npm test` green and deterministic; priority targets covered; no
real network in tests.
**Tests:** this task is tests.
**DoD:** + global DoD; `TESTING.md` reflects reality. Commit
`test: complete priority test suite and msw setup`.

### 2.3 ⬜ Accessibility pass + final polish + first release
**Goal:** Clear the a11y floor, do a final review, and cut the first release.
**Depends on:** 2.1, 2.2
**Sub-steps:** run `eslint-plugin-jsx-a11y` clean; verify labelled fields,
icon-button `aria-label`s, dialog focus trap + return + `aria-labelledby`,
table header ARIA, `<html lang>` sync; check both themes for WCAG AA contrast;
responsive sanity check; final self-review against §17; merge the
release-please Release PR to tag the first version.
**Files:** small fixes across components as needed.
**Acceptance:** jsx-a11y clean; keyboard-only add/edit/delete works; both themes
pass contrast; §17 checklist satisfied; first version tagged with a generated
CHANGELOG.
**Tests:** keyboard-interaction test for the dialog flow (optional but preferred).
**DoD:** + global DoD. Commit `fix: accessibility and final polish` (then merge
the Release PR).

---

## Backlog / later (out of the case-study scope)

- Patient detail route (`/patients/:patientId`) using the `build()` helper +
  dynamic `title` handle.
- Storage schema versioning (currently clear + reseed, §10).
- Coverage threshold once the suite stabilises.
