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
what every screen would otherwise rebuild: Turkish-aware global search (the
registered `nfcContains` filter), per-column filters, a toolbar slot, a
clear-filters button, two loading modes (initial → `Loading`; background
refetch → the table's overlay), and a responsive paginator that switches
template on small screens via `useMediaQuery`.

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
  filterDisplay?: 'row' | 'menu'
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
}
```

Not its job: data fetching and page-level errors — those belong to
composables and the error surfaces below. Its pure core,
`buildInitialFilters` (`AppDataTable.lib.ts`), is unit-tested.

---

## Form fields

Six Formik-connected fields share one shell (`FormField`) that renders the
i18n label, wires `htmlFor`/`id` (no unlabelled inputs), and resolves Yup
errors:

| Field | Wraps |
| --- | --- |
| `FormInputText` | InputText |
| `FormInputNumber` | InputNumber |
| `FormDropdown` | Dropdown |
| `FormCalendar` | Calendar |
| `FormCheckbox` | Checkbox |
| `FormChips` | Chips |

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
chips (see the Languages and Styling docs for what they drive).

---

## Composables and helpers behind the components

| Item | File | Job |
| --- | --- | --- |
| `useMenu` | `composables/useMenu.ts` | Single menu source — builds groups (and the docs children) from route constants |
| `useNotify` | `composables/useNotify.ts` | Key-only toast API |
| `useMediaQuery` | `composables/useMediaQuery.ts` | `matchMedia` hook (paginator, sidebar breakpoints) |
| `normalizeTurkish` / `compareTurkish` / `turkishIncludes` | `lib/text.ts` | Turkish-aware normalise / collator sort / contains |
| `formatDate` | `lib/date.ts` | The only date formatter (Day.js, active locale) |
| `pickLocalized` | `lib/pickLocalized.ts` | Bilingual field picker with Turkish fallback |
| `getRouteHandle` | `lib/route.ts` | Typed guard over router matches |
