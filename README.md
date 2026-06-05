# Hasta Takip Sistemi — Patient Tracking Panel

A bilingual (Turkish / English) patient appointment and tracking panel, built
as a technical case study (Abisena / Panates). The patient list is seeded once
from a read-only API; add, edit, and delete happen client-side and persist in
the browser's `localStorage`. The data is mock data — this storage model is a
case-study choice, not a pattern for real patient data.

Full documentation is rendered inside the app itself (the **Documentation**
menu entry) from the bilingual markdown files in `docs/{en,tr}/`. Agent-facing
operational rules live in `CLAUDE.md`.

## Stack

React 18 · TypeScript (strict) · Vite · React Router · PrimeReact 10 ·
Tailwind CSS 3.4 · SCSS (SMACSS) · TanStack Query · Formik + Yup ·
react-i18next · Day.js · react-markdown

## Requirements

- **Node 24** (`.nvmrc`; `nvm use`) — tests run via Node's native TypeScript
  type-stripping and silently skip on older versions.
- npm (the lockfile is committed; use `npm ci`).

## Getting started

```bash
nvm use
npm ci
cp .env.example .env
npm run dev
```

## Environment

| Variable       | Purpose                                          |
| -------------- | ------------------------------------------------ |
| `VITE_API_URL` | Read-only patient data source (one-time seed)    |

`.env` is gitignored; `.env.example` documents every required variable. A
missing variable shows a configuration-error screen instead of a broken app.

## Scripts

| Script                 | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the dev server                               |
| `npm run build`        | Type-check + production build                      |
| `npm run preview`      | Preview the production build                       |
| `npm test`             | Run the unit tests (Node 24, `node --test`)        |
| `npm run validate`     | Type-check + ESLint + Stylelint + Prettier check   |
| `npm run lint`         | ESLint only                                        |
| `npm run format`       | Prettier write                                     |

## Quality gates

Every pull request runs the CI `gate` job: `validate` + tests + `build` +
`npm audit --audit-level=high`. Nothing merges while the gate is red. Commit
messages follow Conventional Commits (enforced by commitlint); versions and
the changelog are generated from them by release-please.

## Deploy

Deployed on Vercel. `vercel.json` rewrites every path to `index.html` so deep
links (HTML5 history routing) survive a refresh. Merging to `main` deploys
automatically; releases are tagged by the release-please flow (see the
**Versions & Releases** doc in-app).
