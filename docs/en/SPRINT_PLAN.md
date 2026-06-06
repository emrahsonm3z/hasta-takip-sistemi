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

### 0.4 ✅ Styling system — token-backed Tailwind + SCSS (SMACSS) + dark
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

### 0.5 ✅ i18n locale files + key typing
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

### 0.6 ✅ Router + layout shell + menu + dynamic title
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

### 0.7 ✅ Global components (wrappers, forms, error surfaces, notify)
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

### 0.8 ✅ CI, release-please, Dependabot, deploy config
**Goal:** Automated gate + release automation + dependency hygiene + SPA routing
on Vercel (§14, §15).
**Depends on:** 0.2
**Sub-steps:**
- `.github/workflows/ci.yml`: on PR → `npm ci` → `validate` → `test` → `build` →
  `npm audit --audit-level=high`; set as a required status check.
- `.github/workflows/release.yml`: release-please action;
  `release-please-config.json` + `.release-please-manifest.json` (version `0.0.0`
  start, `release-type: node`, **no publish** — private).
- `.github/dependabot.yml`: npm ecosystem, group minor/patch, **ignore ALL update
  types** for the five exact pins `react`, `react-dom`, `primereact`,
  `primeicons`, `tailwindcss` + **ignore `eslint` major** (§1.1).
- `vercel.json`: SPA rewrite (all → `/index.html`); branch protection documented
  in §15 (owner-applied: require PR + the `gate` check + linear history; admins
  exempt for the release-please PR).
**Files:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`,
`release-please-config.json`, `.release-please-manifest.json`,
`.github/dependabot.yml`, `vercel.json`.
**Acceptance:** opening a PR runs CI; a `feat:`/`fix:` merge to `main` makes
release-please open a Release PR with a correct bump + CHANGELOG; deep links
work on Vercel (no 404 on refresh).
**Tests:** none (pipeline-verified on the first real PR).
**DoD:** + global DoD. Commit `ci: add CI gate, release-please, dependabot, and SPA rewrite`.

### 0.9 ✅ Docs module + registry + skeleton docs + README
**Goal:** The in-app docs viewer works and every §13.2 doc exists (skeleton) in
both languages, registered.
**Depends on:** 0.6
**Sub-steps (as landed):**
- `modules/docs/`: `MarkdownRenderer` (`react-markdown` + `remark-gfm`,
  `@tailwindcss/typography` prose mapped onto the v10 theme vars — no
  `prose-invert`, §9); loader via
  `import.meta.glob(['/docs/**/*.md', '/CHANGELOG.md', '/SPRINT_PLAN.md', '/SPRINT_PLAN.tr.md'], { query: '?raw', import: 'default' })`
  keyed by active language (root files stay at root; registry `paths.{en,tr}`
  absorb it); `constants/docs-registry.ts` (slug + `titleKey` +
  `descriptionKey` + `icon` + `order` + `paths`, single source) +
  `query-keys.ts`; `lib/doc-path` (pure) + `lib/docs-loader`;
  `composables/useDocContent` (useQuery); `routes.tsx` (`DOCS_ROUTES`):
  `/docs` overview + `/docs/:slug` viewer (dynamic title via the handle,
  unknown slug → `NotFound`); `pages/`, `index.ts` barrel.
- Menu (decided in review): the sidebar carries a SINGLE Documentation item →
  `/docs`; the overview card-grid is the index of all docs (§13.4 step 5
  amended accordingly). `useMenu` reads `DOCS_ROUTES.OVERVIEW`.
- `docs/en/*` + `docs/tr/*` for every §13.2 file, each opening with the §13.1
  plain summary, written plain-language for non-developers; WORKFLOW,
  VERSIONING, and CODING_STANDARDS shipped as full guides (owner-opens-PRs
  flow, release-PR reopen path, no-`any` policy); the rest are skeletons
  (content filled in 2.1). `CHANGELOG.md` stays English-only at repo root
  (§13.5).
- `README.md`: setup, scripts, env (`VITE_API_URL`), deploy.
**Files:** `src/modules/docs/**`, `src/composables/useMenu.ts`, `docs/en/*.md`,
`docs/tr/*.md`, `docs/en/modules/*.md`, `docs/tr/modules/*.md`, `README.md`,
`tailwind.config.ts`, `src/__test__/modules/docs/*`.
**Acceptance:** `/docs` lists all docs; `/docs/:slug` renders the active-language
markdown; switching language swaps content; sidebar shows the single docs item;
every registered doc is reachable; unregistered doc rule holds.
**Tests:** docs-registry slug↔file integrity (every registry slug resolves to an
existing en + tr file), slug uniqueness, `resolveDocPath` + `findDocEntry` units.
**DoD:** + global DoD. Landed as `feat(docs)`/`docs:` sub-commits on
`feat/docs-module`.

### 0.10 ✅ Shell design pass (Atlantis-inspired)
**Goal:** Restyle the app shell to the Atlantis-inspired design (§9): transparent
flat sidebar vs raised `.card` surface model, custom `--app-*` tokens, brand mark,
pattern background, responsive drawer.
**Depends on:** 0.6
**Sub-steps (as landed):**
- `--app-*` custom tokens (`theme/_dark.scss`, both modes) + `_tokens.scss` aliases
  + Tailwind exposure (`bg-app-ground`, `w-sidebar`, Inter-first `fontFamily.sans`).
- Shell partials: `layout/_layout`, `layout/_sidebar`, `layout/_topbar`,
  `modules/_card` in `@layer tw-components`; `base/_typography` with self-hosted
  Inter variable woff2 (latin + latin-ext); 14px base.
- `AppLogo` (token-colored inline SVG + `BRAND_NAME`), `public/favicon.svg`.
- Topbar: neutral hamburger, circular `.l-topbar-chip` action buttons,
  text TR/EN active-language switcher (flags dropped), `:focus-visible`-only focus.
- Desktop collapse toggle (`.is-collapsed` @ `lg`) + mobile PrimeReact `<Sidebar>`
  drawer: opaque `--app-ground` panel, `0 16px 16px 0` corners, floated close (X),
  logo at top, closes on route change.
- Background: self-hosted PrimeVue `pattern.png` on `.l-layout` via mode-invariant
  `--glow-image` + `--glow-blend` (`hard-light, multiply`), `auto 20rem`, top,
  no-repeat, blended over `--app-ground` (replaced the interim scallop-SVG mask).
- `useMenu` grouped sections (`menu.section.general`) + updated `useMenu.lib` spec.
- Cleanup: removed orphaned `common.languages.*` keys and the unused
  `content-offset` Tailwind spacing.
**Files:** `src/components/layout/*`, `src/composables/useMenu*`,
`src/styles/{base,fonts,images,layout,modules,theme,utils}/*`, `src/styles/main.scss`,
`tailwind.config.ts`, `index.html`, `public/favicon.svg`, `src/locales/*`,
`src/__test__/composables/useMenu.lib.test.ts`.
**Acceptance:** shell matches the §9 spec in both modes; drawer + collapse work at
the `lg` threshold; no raw hex outside token definitions; `validate` + tests green.
**Tests:** `useMenu.lib` grouping spec updated (29 specs green, Node 24).
**DoD:** + global DoD. Commits `feat(layout): atlantis-style app shell` +
`docs: sync rule files and sprint plan for the shell design pass`.

### 0.11 ✅ Docs revision — technical depth, nested menu, scroll region
**Goal:** Bring the 0.9 docs to the reference bar (plain prose kept, real
technical demonstrations added — code from this repo only, planned work marked
as planned), restructure the shell around them.
**Depends on:** 0.9
**Sub-steps:**
- Viewport-locked shell: `.l-layout`/`.l-content` pinned to the viewport;
  `<main>` is the only scroll region; scroll-to-top on route change (replaces
  `ScrollRestoration`, which tracks window scroll only).
- Nested Dokümanlar sub-menu: `useMenu` items gain `children` (docs children
  from the registry); `AppSidebar` renders a disclosure (row navigates to
  `/docs`, chevron toggles, auto-expanded under `/docs`); §13.4 step 5
  re-amended.
- Overview lead paragraph removed (`docs.lead` key dropped).
- `SPRINT_PLAN` moved to `docs/{en,tr}/SPRINT_PLAN.md` (verified: no
  release-please/CI dependency on the root path); glob + registry + rule-file
  references updated; `CHANGELOG.md` stays at root (release-please owns it).
- Technical-depth rewrite of all 11 docs (EN + TR): real code excerpts,
  tables, ASCII trees/flows, worked examples — no mermaid, no new deps;
  patient data layer/UI marked planned (1.1–1.3).
- `README.md` rewritten in Turkish (overview, stack, prerequisites, setup,
  env, scripts, architecture summary, testing, deploy).
- (Added in review) Reference reading design for the content area: no card,
  left-aligned, 57.5rem cap; ruled h1/h2; full-grid tables with uniform
  0.875rem cell padding; callout blockquotes; dark-always code blocks via
  `rehype-highlight` + highlight.js `github-dark` (the sanctioned §9
  exception); module docs grouped under a Modüller subsection label in the
  sidebar disclosure.
**Files:** `src/styles/layout/*`, `src/components/layout/*`,
`src/composables/useMenu*`, `src/modules/docs/**`, `docs/{en,tr}/**`,
`README.md`, `src/locales/*`, `tailwind.config.ts`.
**Acceptance:** topbar + sidebar stay put while only the content scrolls; the
Dokümanlar parent expands to the doc links and `/docs` stays the landing; docs
match the reference's technical bar in both languages with nothing invented;
README is Turkish and professional; registry/menu/locale tests green.
**Tests:** `useMenu.lib` children spec; registry path integrity (moved
SPRINT_PLAN paths); locale parity.
**DoD:** + global DoD.

---

## Sprint 1 — Patients feature (end to end)

Outcome: list + add + edit + delete patients, bilingual, Turkish-aware, persisted
in `localStorage`, seeded once from the GET.

### 1.1 ✅ Patients data layer
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

### 1.2 ✅ Patient list (AppDataTable, Turkish sort/filter/search)
**Goal:** The full patient list over `AppDataTable` — every column sortable with
type-appropriate menu filters plus global search, bilingual fields and labels.
**Scope note:** this DELIBERATELY exceeds the case study's "1 sort, 1 filter,
1 search" minimum — the owner's choice, recorded here and in the module doc.
**Depends on:** 1.1
**Sub-steps (as landed):**
- `pages/PatientsPage.tsx` (thin): calls `usePatients`, renders `PatientList` on a
  `.card`, handles loading (wrapper two-mode) and read error (`ErrorState` + retry).
- `components/PatientList.tsx`: 15 columns (fullName, department, status,
  priority, appointmentDate, birthDate, bloodType, score, diagnosis, note,
  isInsured, isFollowUp, isVaccinated, tags, createdAt). status/priority as
  `Tag`s (severity map in `patient-tag.constants.ts`); booleans as translated
  yes/no; tags as `Chip`s; dates via `formatDate 'L'` (live data has no time
  component); diagnosis/note are locale-aware DERIVED row fields
  (`buildPatientListRows` + injected `pickLocalized`), so sort/filter/body all
  work on plain fields.
- Sorting, every column: Turkish collator for the text columns (fullName,
  department-by-label, diagnosis, note, bloodType, tags-by-joined-label) via
  `sortRowsByTurkishValue`; status/priority by their DEFINED enum order
  (`sortRowsByValueOrder`); dates (ISO strings)/score/booleans natural.
- Filtering, every column, `filterDisplay="menu"` hardcoded in the wrapper —
  STANDARD demo behaviour (revised in review): every menu has the default
  Clear + Apply buttonbar, filters apply ONLY on Apply, and the per-type
  match-mode dropdown is shown (hidden only for tags, demo-style; booleans
  auto-hide via `dataType="boolean"` → built-in TriStateCheckbox). The six
  standard TEXT modes are globally overridden Turkish-aware
  (`lib/filters.ts`); dates use the built-in date modes over real `Date`
  values in the derived rows; score uses the numeric InputNumber filter;
  enums use ONE reusable Dropdown element (status/priority with severity-Tag
  option templates); tags use ONE reusable any-of MultiSelect (custom
  `arrayContainsAny`). Shared element factories live in
  `components/AppDataTableFilters.tsx`. Global search kept (built-in
  Turkish `contains` over fullName + diagnosisTr/En; `nfcContains` removed).
- `AppDataTable`: `filterDisplay` and `minTableWidth` props REMOVED —
  menu filtering is hardcoded inside the wrapper and columns auto-fit
  (horizontal scroll on narrow viewports is the expected behaviour; a true
  mobile layout is a separate later decision). TR + EN PrimeReact locales extended
  with the filter vocabulary (+ TR calendar names); localized placeholders in
  every filter input; all filter overlays at one consistent 16rem width with
  a compact 0.75rem section rhythm.
- (Added in review) Zinc surface unification: the Lara `--surface-*`/`--gray-*`
  scale recolored to Tailwind zinc in both modes (`theme/_dark.scss`,
  unlayered beats `@layer primereact`); `--app-ground/card-bg/card-border`
  became `var(--surface-*)` aliases; `modules/_prime-skin.scss` re-points
  PrimeReact's baked surfaces — incl. container elements — at the variables
  (DataTable, paginator, inputs, dropdown/multiselect panels, datepicker,
  chips); striped rows off (gridlines instead).
**Files:** `src/modules/patients/{pages,components,lib,constants}/*`,
`src/components/AppDataTable.tsx`, `src/lib/{text,filters}.ts`,
`src/plugins/primereact.ts`, `src/styles/**`, `src/__test__/*`.
**Acceptance:** `/patients` lists seeded data; every column sorts (Turkish
collation on text, enum order on status/priority) and filters with its
type-appropriate menu control; `ışık` finds `Işık` via global search; empty
state shows the i18n `emptyMessage`; booleans/enums render translated; language
switch re-labels and re-localizes diagnosis/note live.
**Tests:** pure node:test specs — Turkish row sorting, enum-order sorting,
derived localized rows, distinct tag/score collectors, option builders,
`isoDateMatches` + `arrayContainsAny` predicates, tag-severity maps;
render/interaction by manual QA (§11 — no DOM harness).
**DoD:** + global DoD; `modules/PATIENTS.md` updated.

### 1.3 ✅ Patient add / edit / delete form
**Goal:** A bilingual form (all fields side by side) in a dialog, validated by
Yup, wired to the mutations, with delete confirmation.
**Depends on:** 1.1, 1.2
**As landed:**
- `lib/patient.form.ts`: `PatientFormValues` + `createEmptyFormValues` /
  `toFormValues` / `toPatientRecord(values, system)` (ISO↔`Date`; trims; the
  system fields `id`/`createdAt`/`notes` injected — `notes` is NOT
  user-editable, preserved on edit, `null` on create).
- `lib/patient-form.schema.ts`: MODE-AWARE `buildPatientFormSchema(mode)` —
  required/enum-membership rules, birthDate not in the future, appointment
  ≥ birthDate in both modes PLUS ≥ today (date-only) in CREATE only (edit
  keeps past appointments editable; the Calendar mirrors this via `minDate`);
  score integer 1–5; diagnosis required in both languages; notes optional.
  All messages via the typed `message()` keys.
- `components/AppDialog.tsx` (GLOBAL): the reusable dialog shell — 800px
  desktop base, max-height `min(750px, 70vh)`, pinned header + footer slots,
  content as the single scroll area, zinc skin rows in `_prime-skin.scss`.
- `components/PatientForm.tsx` + `PatientDialog.tsx`: ONE dialog for create
  + edit (title / initial values / mutation differ by mode); section-grouped
  two-column layout collapsing to one column on mobile (the three boolean
  checkboxes stay inline at ALL widths); localized placeholders everywhere;
  status/priority dropdowns render the shared severity Tags (options +
  selected value, `PatientTags.tsx` — also used by the 1.2 columns/filters);
  footer Kaydet submits via Formik `innerRef`. `FormField` reserves a fixed
  one-line error slot (no layout shift); `FormCheckbox` is inline;
  `placeholderKey` / `minDate` / generic `optionTemplate` added to the
  wrappers.
- Row actions: frozen-right column with aria-labelled edit/delete icon
  buttons (opaque frozen-cell skin + layered hover); edit pre-fills the
  dialog; delete via `confirmDialog()` naming the patient → remove mutation
  + toasts. NO row-click navigation (decided here).
**Tests:** pure `node:test` only — schema valid/invalid per field incl. the
create/edit mode split, mapping round-trip, empty-values defaults, trim/drop,
incomplete-values throw (the old RTL + MSW line predated the §11 decision and
was wrong).
**DoD:** met — `validate` + 88/88 tests + build green; docs synced
(PATIENTS/COMPONENTS + rule files, both languages).
Commits: `feat(patients): patient form schema and value mapping`,
`feat(patients): patient dialog with create and edit`, `feat(patients): row
actions with delete confirmation`, `fix(styles): zinc surfaces for dialog and
frozen cells`, `docs: …`.

---

### 1.4 ✅ Pre-Sprint-2 fix batch
**Goal:** Four owner-reported issues fixed before Sprint 2.
**As landed:** checkbox checked state visible again (the unconditional zinc
box rule now scoped `:not(.p-highlight)`; the checked checkmark forced light
in BOTH themes via the new mode-invariant `--app-checkmark` token — Lara dark
bakes a dark check); dialog submit gated on Formik `dirty` via the new global
`FormDirtyListener` (create starts disabled); mobile topbar fixed
(`.l-topbar-start` gets `flex:1` + `min-inline-size:0` so the title
truncates, responsive gaps); AppDataTable header responsive below `sm`
(toolbar right-aligned, full-width search) and a fixed `72rem` table floor so
narrow viewports scroll horizontally instead of crushing columns (realigns
the code with the documented 1.2 horizontal-scroll intent). No new pure-logic
tests (CSS/wiring); 88/88 stay green.

---

## Sprint 2 — Documentation, tests, accessibility, release

Outcome: docs fleshed out, the priority test suite in place, a11y verified, and
the first tagged release.

### 2.1 ⬜ Complete modules/PATIENTS.md + content review pass
**Goal:** (Rescoped — 0.11 absorbed the full-content rewrite.) After Sprint 1
lands, replace the "planned" markers in `modules/PATIENTS.md` with the shipped
data layer + UI (real code), and run a content review pass over all docs
against the code (flag/fix any drift).
**Depends on:** Sprint 1 complete
**Files:** `docs/{en,tr}/modules/PATIENTS.md`, drift fixes across `docs/{en,tr}/`.
**Acceptance:** PATIENTS.md documents the shipped module with nothing marked
planned; no doc↔code drift anywhere; registry intact.
**Tests:** (reuse the registry-integrity test.)
**DoD:** + global DoD. Commit `docs: complete the patients module documentation`.

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
**Deferred UI polish (carried from 0.6/0.7):** 404 page copy/wording;
`AppThemeToggle` icon direction (sun-vs-moon convention); switcher/icon-button
`aria-label` phrasing pass; `FormCheckbox` label-beside layout (currently
label-above like the other Form\* wrappers).
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
