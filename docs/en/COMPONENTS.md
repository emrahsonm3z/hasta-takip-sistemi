# Shared Components

This document describes the reusable building blocks every screen is assembled
from. The plain sections explain what each block does; the tables and code
show developers the exact contracts. The standing rule: at call sites these
wrappers are **mandatory** — a screen never uses the raw PrimeReact component
when an `App*` wrapper exists, and a missing capability is added to the
wrapper, not worked around locally.

---

## Catalogue

| Component | File | Job |
| --- | --- | --- |
| `AppDataTable` | `components/AppDataTable.tsx` | The only table — Turkish-aware sort/filter/search |
| `AppDataTableFilters` | `components/AppDataTableFilters.tsx` | Shared menu-filter element factories (enum/multiselect/date/numeric/boolean) |
| `AppDialog` | `components/AppDialog.tsx` | The dialog shell: 800px base, capped height, pinned header/footer, scrolling content |
| `AppToastProvider` | `components/AppToastProvider.tsx` | Mounts the single `<Toast/>`; backs `useNotify` |
| `Loading` | `components/Loading.tsx` | Spinner for lazy routes and initial loads |
| `ErrorState` | `components/ErrorState.tsx` | In-page "failed, retry" for expected data errors |
| `RouteErrorBoundary` | `components/RouteErrorBoundary.tsx` | Router `errorElement` for unexpected route errors |
| `AppErrorBoundary` | `components/AppErrorBoundary.tsx` | Outermost class boundary → `FatalError` |
| `FatalError` | `components/FatalError.tsx` | Last-resort crash screen (reload button) |
| `ConfigErrorScreen` | `components/ConfigErrorScreen.tsx` | Missing-environment screen, shown before the app mounts |
| `NotFound` | `components/NotFound.tsx` | 404 page (also used for unknown doc slugs) |
| `form/Form*` | `components/form/` | Formik↔PrimeReact field set (six fields + shared shell) |
| `layout/App*` | `components/layout/` | The shell: layout, sidebar, topbar, logo, switches |

---

## One table for everything

All lists use `AppDataTable`. It wraps PrimeReact's DataTable and bakes in
what every screen would otherwise rebuild: Turkish-aware global search,
Turkish-collator column sorting (`sortRowsByTurkishValue` /
`sortRowsByTurkishField` from `lib/text.ts`), **standard menu-style
per-column filtering hardcoded inside the wrapper** (`filterDisplay="menu"`,
demo-default behaviour: every filter menu has the Clear + Apply buttonbar —
filters apply ONLY on Apply — and the per-type match-mode dropdown; the six
standard text modes are globally overridden to be Turkish-aware, and the
custom `arrayContainsAny` covers tag any-of), a toolbar slot, a clear-filters
button, two loading modes (initial → `Loading`; background refetch → the
table's overlay), and a paginator that drops the numbered PageLinks below
`md` — the same `isBelowMd` switch as the density mode: on phones the
template is the compact `First/Prev/Report/Next/Last` set plus the
rows-per-page dropdown; at `md` and above the full numbered template
renders. The table always renders at PrimeReact's
small size (`size="small"` inside the wrapper — call sites never set it). At
`md` (768px) and above, columns auto-fit their content above a fixed `72rem`
table floor, so on narrow windows the table scrolls horizontally inside its
region instead of crushing its columns. That floor is the `tableMinWidth`
prop (default `72rem`, so the patients table is unchanged); a call site with
only a few columns can pass a smaller value — the showcase live preview
passes `100%` so its five columns fill the width with no horizontal scroll.
Below `md` the wrapper drops that
floor (columns shrink to their own minimums) and the app-wide density rules
take over — 12px root size and small buttons, see the Styling doc; the
patients list additionally swaps its row actions for a tap-friendly pattern
(see the patients module doc). The header is responsive: below
`sm` the toolbar right-aligns and the search box stretches full-width with
the clear-filters button beside it.

Where a column needs more than the default InputText element, the shared
factories in `components/AppDataTableFilters.tsx` supply the demo-standard
elements — enum Dropdown (with optional option template), tags MultiSelect,
Calendar, InputNumber, TriStateCheckbox — all applying via `filterCallback`
(i.e. on Apply), never re-implemented per column.

Its props, from the component as it exists today:

```ts
interface AppDataTableProps<T extends object> {
  data: T[]
  children: ReactNode            // <Column> definitions
  dataKey?: string
  loading?: boolean
  toolbar?: ReactNode
  showSearchBox?: boolean        // default true
  globalFilterFields?: string[]
  defaultFilters?: DataTableFilterMeta
  sortField?: string
  sortOrder?: 1 | 0 | -1 | null
  onSort?: (event: DataTableSortEvent) => void
  paginator?: boolean            // default true
  rows?: number                  // default 10
  rowsPerPageOptions?: number[]  // default [10, 20, 50]
  rowClass?: (row: T) => string
  rowHover?: boolean
  stripedRows?: boolean
  emptyMessageKey?: TranslationKey  // default 'common.noResults'
  tableMinWidth?: string            // default '72rem' — the md+ table floor
}
```

Not its job: data fetching and page-level errors — those belong to
composables and the error surfaces below. Its pure core,
`buildInitialFilters` (`AppDataTable.lib.ts`), is unit-tested.

---

## Dialogs

`AppDialog` is the shell every app dialog goes through (PatientDialog routes
its whole chrome through it). It pins the header and the `footer` slot (put
action buttons there — a submit button outside the form DOM submits via
Formik's `innerRef`), and makes the content region the single scroll area.
Sizing lives in the shell: 800px desktop base width, max-height
`min(750px, 70vh)`, 12px radius, breakpoints 960→75vw / 640→95vw. The zinc
dialog surfaces live in `_prime-skin.scss`; padding/scroll specifics are
scoped under the `app-dialog` class. PrimeReact's `ConfirmDialog` does NOT
route through it (it has its own accept/reject API) — it inherits the shared
`.p-dialog` zinc skin.

## Form fields

Six Formik-connected fields share one shell (`FormField`) that renders the
i18n label, wires `htmlFor`/`id` (no unlabelled inputs), resolves Yup errors,
and reserves a FIXED one-line message slot so an appearing error never shifts
the fields below; the slot is a polite live region (`aria-live`) wired to the
input via `aria-describedby` + `aria-invalid` (PrimeReact's `invalid` prop
alone emits no ARIA). All fields accept a typed `placeholderKey` (a raw literal
placeholder is a compile error):

| Field | Wraps | Extras |
| --- | --- | --- |
| `FormInputText` | InputText | |
| `FormInputNumber` | InputNumber | |
| `FormDropdown` | Dropdown | generic `optionTemplate` renders custom option AND selected value (e.g. severity Tags) |
| `FormCalendar` | Calendar | `minDate` |
| `FormCheckbox` | Checkbox | inline layout: box + label on one row (no stacked label, no error slot) |
| `FormChips` | Chips | |
| `FormDirtyListener` | — (renders nothing) | reports Formik `dirty` upward so a pinned dialog footer can disable its submit until something changes |

Validation messages arrive as serialized `{ key, values }` JSON (written by
`plugins/yup.ts`) and are translated at render time:

```ts
export function resolveValidationMessage(raw: string, t: Translate): string {
  const serialized = parseSerialized(raw)
  return serialized ? t(serialized.key, serialized.values) : raw
}
```

So a rule like "at least 2 characters" shows "En az 2 karakter olmalıdır." in
Turkish and "Must be at least 2 characters." in English — from one schema.

---

## The four error surfaces

Each kind of problem has exactly one surface; they are never mixed:

| Situation | Surface | What the user sees |
| --- | --- | --- |
| Expected data-load failure | `ErrorState` | In-page message + Retry button |
| Unexpected bug in a route | `RouteErrorBoundary` | Friendly error page + home link |
| Crash anywhere in the tree | `AppErrorBoundary` → `FatalError` | Reload screen |
| Missing/invalid environment | `ConfigErrorScreen` | Configuration error before the app mounts |

User-action feedback (saved, deleted, failed) is the fifth channel: a toast.

`FatalError` and `ConfigErrorScreen` deliberately use plain JSX and the i18n
singleton (`i18n.t`) — no PrimeReact, no hooks — so they survive a crashed or
not-yet-mounted tree.

---

## Notifications — `useNotify`

The toast API accepts **only** typed translation keys; a raw string is a
compile error. That is how "no hardcoded user-facing text" survives without
code review having to catch it:

```ts
const notify = useNotify()
notify.success('patients.title')   // ✓ a TranslationKey
notify.error('Something failed')   // ✗ compile error
```

Its pure core `normalizeErrorKey` (`useNotify.lib.ts`, unit-tested) maps
unknown thrown values to `errors.unexpected`, and lets errors carry their own
`messageKey` through.

---

## The layout shell

`AppLayout` owns the frame: the fixed transparent sidebar (`AppSidebar`, with
the nested Dokümanlar sub-menu and the mobile drawer), the topbar
(`AppTopbar`: hamburger, page title, language + theme chips), and the single
scroll region — the `<main>` element. The window itself never scrolls; on
route change the content region scrolls back to the top. `AppLogo` is the
brand mark; `AppLanguageSwitcher` and `AppThemeToggle` are the two topbar
chips (see the Languages and Styling docs for what they drive). The showcase
home page reuses both chips in its own slim top bar (see the Showcase module
doc), so language and theme are switchable there too.

---

## Composables and helpers behind the components

| Item | File | Job |
| --- | --- | --- |
| `useMenu` | `composables/useMenu.ts` | Single menu source — builds groups (and the docs children) from route constants |
| `useNotify` | `composables/useNotify.ts` | Key-only toast API |
| `useMediaQuery` | `composables/useMediaQuery.ts` | `matchMedia` hook — generic, but every call site passes a `MEDIA.*` constant from `config/breakpoints.ts` (never an inline query literal) |
| `normalizeTurkish` / `compareTurkish` / `turkishIncludes` / `sortRowsByTurkishValue` | `lib/text.ts` | Turkish-aware normalise / collator sort / contains / row sorting |
| `turkishStartsWith` … `turkishNotEquals` / `arrayContainsAny` | `lib/filters.ts` | Pure predicates behind the Turkish-overridden standard text modes + tag any-of |
| `formatDate` | `lib/date.ts` | The only date formatter (Day.js, active locale) |
| `pickLocalized` | `lib/pickLocalized.ts` | Bilingual field picker with Turkish fallback |
| `getRouteHandle` | `lib/route.ts` | Typed guard over router matches |
