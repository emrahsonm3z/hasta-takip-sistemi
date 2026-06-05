# Coding Standards

This document explains the rules we follow when writing code and why they
exist. The reasoning is for everyone — these rules keep the code consistent,
readable, and safe to change; the snippets show developers exactly what the
machines enforce.

---

## Names do the explaining

Everything gets a descriptive, full-word name. Long names are fine; cryptic
abbreviations are not (`submitNewPatientButton`, never `sbmtBtn`).

| Artifact | Convention | Example |
| --- | --- | --- |
| Folders | kebab-case | `modules/patients/` |
| Components | PascalCase.tsx | `AppDataTable.tsx` |
| Composables | useCamelCase.ts | `useMenu.ts` |
| API modules | camelCase.api.ts | `patients.api.ts` *(planned, 1.1)* |
| Storage | camelCase.storage.ts | `patients.storage.ts` *(planned, 1.1)* |
| Models | camelCase.model.ts | `patient.model.ts` *(planned, 1.1)* |
| Mappers | camelCase.mapper.ts | `patient.mapper.ts` *(planned, 1.1)* |
| Pure helpers | camelCase.ts | `pickLocalized.ts` |
| Constants | kebab-case.constants.ts | `docs-registry.ts`, `query-keys.ts` |
| Routes | routes.tsx | `routes.tsx` |

`const` by default, `let` only when reassigned, no `var`.

---

## No explanatory comments

Code may not contain explanatory comments or JSDoc. If code needs a comment to
be understood, we rename or restructure until it doesn't; the explanation
belongs in these documentation pages. This is enforced by a custom lint rule
written for this repo — `local/no-explanatory-comments`
(`tools/eslint/no-explanatory-comments.js`, with its own `RuleTester` unit
test). The only comments it permits are machine directives:

```
eslint-disable* / eslint-enable     @ts-*          prettier-ignore
global / globals                    /// <reference> @vite-ignore
shebang lines                       empty comments
```

The rare unavoidable exception is written with an explicit
`eslint-disable-next-line local/no-explanatory-comments`, so it is always
visible in review — never habitual.

---

## Every piece in its place

Files are split by responsibility, not by line count: network in `api/`,
shapes in `models/`, pure transforms in `lib/`, orchestration in
`composables/`, rendering in `components/`, screens in `pages/`. The trigger
to split is a unit doing more than one thing. A worked example from this repo:
the theme switch is two files — `plugins/theme.lib.ts` holds the pure logic
(unit-testable, no browser APIs) and `plugins/theme.ts` binds it to the real
DOM:

```ts
// theme.lib.ts — pure, tested with node:test
export function applyThemeMode(mode: ThemeMode, target: ThemeTarget): void {
  target.linkElement?.setAttribute('href', target.hrefForMode(mode))
  target.root.classList.toggle('dark', mode === 'dark')
  target.storage.setItem(THEME_STORAGE_KEY, mode)
}

// theme.ts — the thin DOM binding
export function setThemeMode(mode: ThemeMode): void {
  applyThemeMode(mode, getThemeTarget())
}
```

Anything reusable across more than one module lives in a global layer
(`src/components`, `src/composables`, `src/lib`) — never duplicated.

---

## No text lives in the code

Every word a user sees comes from the locale files. This is enforced in
layers, so it does not depend on anyone remembering:

1. `eslint-plugin-i18next` flags literal strings in JSX (including
   `placeholder`, `aria-label`, `title`, …).
2. The lint blind spots are closed by **types**: `useNotify` and Yup messages
   accept only a `TranslationKey` — the union of every dot-path in `en.json`:

```ts
// types/i18n.types.ts — the key union is derived from the EN locale file
export type TranslationKey = DotPaths<typeof en>

// plugins/yup.ts — even validation messages are typed keys
setLocale({
  string: {
    min: ({ min }) => message('validation.stringMin', { min }),
  },
})
```

A wrong or hardcoded key is a compile error, in `t()` itself too. A `node:test`
asserts `tr.json` and `en.json` always carry the same key set.

---

## Strict types — and no `any`, ever

TypeScript runs in strict mode, and `@typescript-eslint/no-explicit-any` is
pinned to `error` for every TS file. Writing `any` fails the automated checks.
Where a value's type is genuinely unknown, the code says so honestly and
proves what it is before using it. A real example — `useNotify.lib.ts`
narrowing an unknown thrown value instead of casting it:

```ts
function isKeyedError(error: unknown): error is KeyedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'messageKey' in error &&
    typeof (error as Record<string, unknown>).messageKey === 'string'
  )
}
```

Silencing the checker (`@ts-ignore`, `@ts-expect-error`, a re-cast to `any`)
is not an option.

---

## Machines enforce the rules

| Tool | Owns |
| --- | --- |
| typescript-eslint | TS/React correctness; the no-`any` policy |
| eslint-plugin-i18next | no literal user-facing strings in JSX |
| eslint-plugin-jsx-a11y | accessibility floor |
| eslint-plugin-simple-import-sort | import/export order (auto-fixed) |
| eslint-plugin-import-x | import hygiene (no duplicates, position) |
| eslint-plugin-react-hooks | rules-of-hooks + exhaustive-deps as errors |
| eslint-plugin-react / react-refresh | curated JSX correctness + HMR hints |
| local/no-explanatory-comments | the no-comments rule above |
| Prettier | all formatting (ESLint format rules disabled) |
| Stylelint | SCSS quality, property order |
| commitlint | Conventional Commit messages |
| Husky + lint-staged | runs the above on staged files at commit time |

One command runs the whole chain, locally and in CI:

```
npm run validate   =  type-check + lint + lint:style + format:check
```

The CI gate adds the tests, the production build, and a dependency security
audit on every pull request — nothing merges while any of it is red.
