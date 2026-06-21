# Showcase Module

This document describes the project showcase — the application's **home page**
(at `/`) that presents the whole project as a polished, modern overview. It
is aimed at two readers at once: a non-technical owner who wants to understand
what the app does, and a technical reviewer who wants evidence of real
engineering. It is fully shipped, so everything below is real code from the
repository.

---

## What it does

The home page is a single page with seven stacked sections — Overview (hero),
What it does, Live preview, Architecture & technology, Quality &
accessibility, How it ships, and Closing. Plain-language value lines carry the
story for the owner; each section adds a compact "under the hood" line and
badges for the technical reader.

On large screens (`lg` and up) a sticky right-hand table of contents lists the
section titles, highlights the active one as you scroll, and scrolls to a
section when clicked. Below `lg` the page is a single column with no side nav.

The page is fully bilingual: all copy lives in the locale files under
`showcase.*` (Turkish and English in parity), the language is switchable from
the top bar, and it renders Turkish by default.

---

## Home route and layout

The showcase is the application's **home page** and is **not** part of the
patient application shell. In `router/index.tsx` the index route `/` renders
the showcase directly (no redirect); the patient app keeps its own routes
(`/patients`, `/docs`, …) under `AppLayout`. The old `/showcase` path now
**redirects to `/`**, the single canonical home.

The showcase wraps its own slim, full-bleed `ShowcaseLayout` top bar — the
brand mark (linking to `/`), a "Live demo" link to `/patients`, a GitHub link,
and the **same language switcher and theme toggle the app shell uses**
(`AppLanguageSwitcher` + `AppThemeToggle`) — no sidebar. On small screens the
demo and GitHub buttons collapse to icon-only. The page is kept **off** the
sidebar menu (`useMenu` is untouched), while its module **documentation** (this
file) is registered in the docs registry like every other module doc.

Because all app-root providers (PrimeReact + the Lara theme, i18n, the toast
provider, React Query) sit above the router in `main.tsx`, the home route
inherits them with no extra wiring — which is what lets the live preview, the
language switcher, and the theme toggle work here.

---

## Live preview

The "Live preview" section embeds a **real** `AppDataTable` — the same global
wrapper the patients list uses — fed six **invented** sample rows (no real
patient data). It demonstrates genuine sort (Turkish-aware on the name),
two menu filters (department and status), and the global search box. The
sample data and its types are local to the module, so the showcase never
reaches into the patients module's internals. The table passes
`tableMinWidth="100%"` so its five columns fill the width without a forced
horizontal scroll on desktop (the wrapper's default `72rem` floor is
unchanged for the patients table).

---

## Scroll-spy

`useScrollSpy` tracks the active section from scroll position: the last
section whose top has crossed a fixed line near the top of the viewport is
active, with a near-bottom fallback that activates the final section once the
page is scrolled to the end (so every section, including the last two, can
become active). Clicking a table-of-contents item activates it immediately and
briefly locks out scroll recomputation so the click "sticks". Smooth scrolling
falls back to an instant jump when the visitor prefers reduced motion. The hook
is impure (it reads the DOM), so it is verified by hand, not unit-tested
(see the Testing doc).

---

## Files

```
src/modules/showcase/
├── components/
│   ├── ShowcaseLayout.tsx        slim top bar + Outlet (sibling-route layout)
│   ├── ShowcaseTopbar.tsx        brand + demo/GitHub + language & theme toggles
│   ├── ScrollSpyNav.tsx          right-hand table of contents (lg+)
│   ├── ShowcaseSection.tsx       SectionShell / SectionLead / UnderHood / Pill
│   ├── ShowcaseDataPreview.tsx   the live AppDataTable embed
│   └── sections/                 the seven section components
├── composables/
│   └── useScrollSpy.ts           active-section tracking
├── constants/
│   ├── showcase.constants.ts             GitHub URL
│   ├── showcase-sections.constants.ts    section ids + titles (the TOC source)
│   ├── showcase-content.constants.ts     metrics, features, stack, badges, steps
│   └── showcase-sample-patients.constants.ts   invented preview rows + types
├── pages/
│   └── ShowcasePage.tsx          composes the sections + the scroll-spy TOC
├── routes.tsx                    SHOWCASE_ROUTES + the sibling route array
└── index.ts                      barrel (SHOWCASE_ROUTES, showcaseRoutes)
```

---

## Public API

The barrel exposes only `SHOWCASE_ROUTES` (the route constant) and
`showcaseRoutes` (the `RouteObject[]` the router aggregates). Everything else
is internal to the module.
