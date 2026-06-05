# Testing

This document explains how we check that the application works correctly: what
is tested automatically, what is checked by hand, and how to run and extend
the tests. The first sections are for everyone; the how-to is for developers.

---

## The approach

Automated tests cover the application's **pure logic** — functions that take
values in and return values out, with no browser involved. Visual appearance
and on-screen behaviour are verified by hand (and the lint/type chain catches
a large class of UI mistakes before any test runs). There is deliberately
**no Vitest, no React Testing Library, no jsdom** — the runner is Node's
built-in `node --test`, with zero test dependencies. Adding a DOM test harness
is a recorded, separate decision for later.

---

## Running the tests

The specs are TypeScript, executed through Node's native **type-stripping**,
which requires **Node 24** (`.nvmrc`). On an older Node the `.ts` specs are
silently skipped — so switch first:

```
nvm use
npm test
```

CI runs the same command on Node 24 (the gate reads `.nvmrc`), so a forgotten
`nvm use` locally can never slip a broken test past review.

---

## What is covered today

| Spec file (`src/__test__/`) | What it proves |
| --- | --- |
| `composables/useMenu.lib.test.ts` | Menu grouping, item + child sorting, subsection labels |
| `composables/useNotify.lib.test.ts` | Unknown errors normalise to `errors.unexpected` |
| `modules/docs/docs-registry.test.ts` | Every registered doc resolves to an existing en + tr file; slugs unique; `resolveDocPath` language picking |
| `locales/locales.test.ts` | `tr.json` and `en.json` carry identical key paths |
| `plugins/theme.lib.test.ts` | Theme swap logic (href, `dark` class, persistence) |
| `lib/*.test.ts` | `formatDate`, `pickLocalized`, Turkish normalise/collator, route handle guard |
| `components/AppDataTable.lib.test.ts` | Initial filter construction |
| `config/env.test.ts` | Missing-variable detection |
| `tools/eslint/` (RuleTester) | The custom no-explanatory-comments lint rule |

The locale-parity spec is a good example of the style — small, pure, and
guarding a rule humans would forget:

```ts
test('tr and en locale files have identical key paths', () => {
  const trKeys = keyPaths(tr).sort()
  const enKeys = keyPaths(en).sort()
  assert.deepEqual(trKeys, enKeys)
})
```

---

## How to add a test

1. Put the logic you want to test in a **pure** file (a `lib/` helper or a
   composable's `.lib.ts` core) — if it touches React or the DOM, extract the
   pure part first; that split is the project's standard pattern.
2. Create `src/__test__/<mirrored-path>/<name>.test.ts` — the test tree
   mirrors the source tree.
3. Import with **relative paths including the `.ts` extension** (Node's test
   runner does not resolve the `@/` alias); type-only imports may use `@/`.
4. Use `node:test` + `node:assert/strict`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveDocPath } from '../../../modules/docs/lib/doc-path.ts'

test('resolveDocPath picks the Turkish file for tr', () => {
  assert.equal(resolveDocPath(entry, 'tr'), entry.paths.tr)
})
```

5. `nvm use && npm test` — the suite runs in well under a second.

Tests are planned with the work (in the audit step) and written together with
the code — never bolted on afterwards. There is no mandatory coverage
threshold; the bar is that every pure contract worth breaking has a spec.

---

## What machines check besides tests

Every commit and every pull request also passes `npm run validate`
(type-check + ESLint + Stylelint + Prettier) and a production build — see
"How We Work" for the full gate.
