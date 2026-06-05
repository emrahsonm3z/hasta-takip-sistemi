# Docs Module

This document describes the documentation viewer itself — the feature you are
using right now. It is fully shipped, so everything below is real code from
the repository.

---

## What it does

The Dokümanlar entry in the sidebar expands into the full document list (with
the module docs grouped under a "Modüller" label) and navigates to `/docs` —
a card-grid index of every document. Each card opens `/docs/:slug`, a styled
reading page. Switching the application language (TR/EN) swaps the document
to its translation instantly; switching the theme keeps everything readable —
code blocks stay dark in both modes by design.

---

## Files

```
src/modules/docs/
├── components/
│   └── MarkdownRenderer.tsx   react-markdown + remark-gfm + rehype-highlight
├── composables/
│   └── useDocContent.ts       useQuery over the lazy file loader
├── constants/
│   ├── docs-registry.ts       DocEntry[] — the single source of truth
│   └── query-keys.ts          docsKeys factory
├── lib/
│   ├── doc-path.ts            resolveDocPath + findDocEntry (pure, unit-tested)
│   └── docs-loader.ts         import.meta.glob loader
├── pages/
│   ├── DocsOverviewPage.tsx   /docs — the card-grid index
│   └── DocViewerPage.tsx      /docs/:slug — the reading page
├── routes.tsx                 DOCS_ROUTES (OVERVIEW + VIEWER) + dynamic title
└── index.ts                   barrel
```

---

## The registry — one list rules everything

Every document is one entry in `docsRegistry`. The sidebar children, the
overview cards, the route titles, and the file loading all derive from it —
an unregistered document does not exist for the app.

```ts
export interface DocEntry {
  slug: string
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  icon: string
  order: number
  paths: { en: string; tr: string }
}
```

A regular entry and the one root-level exception:

```ts
{
  slug: 'architecture',
  titleKey: 'docs.doc.architecture.title',
  descriptionKey: 'docs.doc.architecture.description',
  icon: 'pi pi-sitemap',
  order: 1,
  paths: { en: '/docs/en/ARCHITECTURE.md', tr: '/docs/tr/ARCHITECTURE.md' },
},
{
  slug: 'changelog',
  titleKey: 'docs.doc.changelog.title',
  descriptionKey: 'docs.doc.changelog.description',
  icon: 'pi pi-history',
  order: 11,
  paths: { en: '/CHANGELOG.md', tr: '/CHANGELOG.md' },   // root file, EN-only
},
```

`CHANGELOG.md` points both languages at the same root file because the
release tooling generates it there, English-only. The sprint plan lives at
`docs/{en,tr}/SPRINT_PLAN.md` like every other doc. An automated test
(`src/__test__/modules/docs/docs-registry.test.ts`) fails the build if any
registered file is missing in either language, or if two entries share a slug.

---

## Loading a document

Files are **not** bundled into the app's first download. The loader collects
lazy import functions for every matching file; each resolves on demand:

```ts
const docFiles = import.meta.glob<string>(['/docs/**/*.md', '/CHANGELOG.md'], {
  query: '?raw',
  import: 'default',
})

export const loadDocContent = (entry: DocEntry, language: string): Promise<string> => {
  const path = resolveDocPath(entry, language)
  const load = docFiles[path]
  if (!load) {
    return Promise.reject(new Error(path))
  }
  return load()
}
```

Language picking is one pure function (Turkish for `tr`/`tr-TR`, English
otherwise), and the fetch is cached per document **and language** through the
standard React Query machinery:

```ts
export function useDocContent(entry: DocEntry) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: docsKeys.content(entry.slug, i18n.language),
    queryFn: () => loadDocContent(entry, i18n.language),
  })
}
```

So a language switch re-renders with the other file (fetched once, then
cached forever — `staleTime: Infinity`), and a failed load shows the standard
in-page `ErrorState` with a retry button.

---

## Rendering

`DocViewerPage` resolves `:slug` through `findDocEntry` (unknown slug → the
`NotFound` page), shows `Loading` while the file resolves, then hands the
markdown to the renderer:

```tsx
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose w-full max-w-[57.5rem]">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </Markdown>
    </article>
  )
}
```

- `remark-gfm` — tables, strikethrough, task lists.
- `rehype-highlight` + the highlight.js `github-dark` stylesheet — syntax
  colouring on a dark canvas **in both themes** (the one sanctioned exception
  to the token rule; see "Styling & Theme").
- The reading design (ruled headings, full-grid tables with uniform cell
  padding, callout blockquotes, inline-code chips, 0.9375rem/1.7 body) lives
  in the `typography` theme block of `tailwind.config.ts`, every colour
  mapped to theme tokens — dark mode needs no extra rules.
- Content sits directly on the content surface, left-aligned, capped at
  57.5rem; the browser-tab title comes from the route handle's dynamic
  `title(match)`, which looks the slug up in the registry.

---

## The sidebar disclosure

`useMenu` gives the Dokümanlar item the registry as `children`; slugs starting
with `module-` get the `menu.section.modules` subsection label:

```ts
children: docsRegistry.map((entry) => ({
  key: entry.slug,
  titleKey: entry.titleKey,
  path: DOCS_ROUTES.VIEWER.build(entry.slug),
  icon: entry.icon,
  menuOrder: entry.order,
  ...(entry.slug.startsWith('module-')
    ? { subsectionKey: 'menu.section.modules' as const }
    : {}),
})),
```

`AppSidebar` renders that as a disclosure: the row navigates to `/docs`, the
chevron button toggles (with `aria-expanded`/`aria-controls`), the submenu
auto-opens whenever the route is under `/docs`, and a small uppercase
"Modüller" label appears before the first module doc. The same content
renders inside the mobile drawer.

---

## Adding a new document — checklist

1. Create the file in BOTH `docs/en/` and `docs/tr/`.
2. Add one `DocEntry` to `docsRegistry` (slug, two locale keys, icon, order,
   paths).
3. Add the `docs.doc.<slug>.title` / `.description` keys to BOTH locale files.
4. Done — the sidebar, the overview grid, the route, and the title all pick
   it up from the registry; the integrity test verifies the files exist.
