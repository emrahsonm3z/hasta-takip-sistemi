# Styling & Theme

This document explains how the application gets its look: where the colours
come from, how light and dark mode work, and why everything stays visually
consistent. The principle is simple enough for everyone: **there is exactly
one palette, and every colour on screen points at it.** The rest of the page
shows developers how that is wired.

---

## One token source, many consumers

The single design-token source is the PrimeReact **Lara Green** theme
stylesheet, which defines CSS variables (`--primary-color`,
`--surface-0…900`, `--text-color`, …). Tailwind and our SCSS both consume
those same variables. Raw hex colours are forbidden everywhere outside token
definitions.

```
Lara Green theme CSS (swapped at runtime)   styles/theme/_dark.scss (ours)
  → the GREEN accent + component skins        → the NEUTRAL scale: --surface-*
                                                recolored to Tailwind ZINC,
                                                light AND dark
      ├→ tailwind.config.ts   colours map straight to the variables
      ├→ styles/utils/_tokens.scss   SCSS aliases for custom SCSS
      └→ styles/modules/_prime-skin.scss   re-points PrimeReact's baked
         component surfaces (tables, inputs, dropdown panels) at the variables
```

A subtlety worth knowing: PrimeReact's theme paints its components with
hard-coded colour values — it does not read the `--surface-*` variables at
runtime. So our `_dark.scss` redefines the whole neutral scale to zinc (the
page's own grey family), and `_prime-skin.scss` re-points the painted
component surfaces — both the CELLS (header/body/footer cells, gridlines,
hover, paginator buttons, inputs, dropdown items) and their CONTAINER
elements, which the theme paints separately (`.p-datatable-thead` /
`-tfoot` / `-footer`, the dropdown and multiselect panels + their headers,
the datepicker, chips, the column-filter overlay + its operator header) — at
those same variables. One grey family
everywhere; the green accent stays Lara's. Table rows are transparent and sit
directly on the card, separated by hairline gridlines (striped rows are off).
If a future PrimeReact component clashes, it gets a row in
`_prime-skin.scss` — never a local override.

The Tailwind side (excerpt from `tailwind.config.ts` as it exists):

```ts
colors: {
  primary: 'var(--primary-color)',
  ground: 'var(--surface-ground)',
  card: 'var(--surface-card)',
  text: 'var(--text-color)',
  'text-secondary': 'var(--text-color-secondary)',
  'app-ground': 'var(--app-ground)',
},
```

The SCSS side (`styles/utils/_tokens.scss`) aliases the same variables
(`$color-primary: var(--primary-color);` …) so custom SCSS never touches a
hex value either.

---

## Light and dark mode — one switch, two effects

The moon/sun chip calls `setThemeMode(mode)` (`plugins/theme.ts`), which does
exactly two things: swaps the `<link id="app-theme">` stylesheet between the
light and dark Lara files, and toggles the `dark` class on `<html>`. The
choice persists in `localStorage` under `theme-mode`.

```ts
export function applyThemeMode(mode: ThemeMode, target: ThemeTarget): void {
  target.linkElement?.setAttribute('href', target.hrefForMode(mode))
  target.root.classList.toggle('dark', mode === 'dark')
  target.storage.setItem(THEME_STORAGE_KEY, mode)
}
```

Because the two theme files redefine the same variables, everything built on
tokens is mode-correct automatically — which is why Tailwind `dark:` variants
on token colours are **forbidden**: they would be a second, redundant
mechanism. A small inline script in `index.html` applies the `dark` class
before the first paint, so there is no flash of the wrong background.

---

## App-specific custom tokens

PrimeReact's theme doesn't know about our shell, so the shell defines its own
tokens — once for each mode (`styles/theme/_dark.scss`, `:root` + `.dark`):

| Token | Light | Dark |
| --- | --- | --- |
| `--app-ground` (page background) | `var(--surface-ground)` → zinc-50 | `var(--surface-ground)` → zinc-950 |
| `--app-card-bg` (raised surface) | `var(--surface-card)` → white | `var(--surface-card)` → zinc-900 |
| `--app-card-border` | `var(--surface-border)` → zinc-200 | `var(--surface-border)` → zinc-700 |
| `--app-card-shadow` | faint two-layer shadow | `none` (border separates) |
| `--app-menu-item-hover-bg` | `rgb(100 116 139 / 10%)` | `rgb(255 255 255 / 5%)` |
| `--app-success` / `--app-danger` (boolean/tristate icons; AA 3:1 on the light card) | `rgb(22 163 74)` / `rgb(220 38 38)` | `rgb(74 222 128)` / `rgb(248 113 113)` |
| `--app-link` (clickable text on the card — the below-`md` patient-name edit control; AA 4.5:1 in both modes, where raw `--primary-color` sits at 2.5:1 on the light card) | `rgb(21 128 61)` | `var(--primary-color)` |
| `--app-tag-{success,info,warning,danger}` (Tag backgrounds; light = the AA −700 set, dark = Lara's passing hues) | `rgb(21 128 61)` / `rgb(3 105 161)` / `rgb(194 65 12)` / `rgb(185 28 28)` | `rgb(74 222 128)` / `rgb(56 189 248)` / `rgb(251 146 60)` / `rgb(248 113 113)` |
| `--app-tag-secondary-bg` / `-text` (Lara ships no secondary Tag rule) | `rgb(82 82 91)` / `rgb(255 255 255)` | `rgb(212 212 216)` / `rgb(24 24 27)` |
| `--app-checkmark` (checked checkbox icon — Lara dark bakes a dark check) | `rgb(255 255 255)` | same |
| `--app-radius-card/-item` | `8px` | same |
| `--app-radius-dialog` | `12px` | same |
| `--app-radius-sidebar/-drawer` | `16px` | same |
| `--app-sidebar-width` | `21rem` | same |
| `--glow-image` / `--glow-blend` | the decorative pattern + its blend mode | same |

These definitions are the **only** place colour literals are allowed. A new
custom token is added only when no suitable theme variable exists.

---

## The surface model

The design language (Atlantis-inspired): the **sidebar is the flat layer** —
no background, no border, no shadow; the menu sits directly on the page
ground with the decorative pattern showing behind it. The **cards are the
raised layer** — `.card` (`styles/modules/_card.scss`) is the only elevated
surface: card background + 1px border + a faint shadow that collapses to
`none` in dark mode. Forms and panels live on cards; documentation prose sits
directly on the content surface, left-aligned.

The shell is viewport-locked: the window never scrolls; `<main>` is the
single scroll region, so the sidebar and topbar stay put on long pages.

---

## Which tool, when

| Need | Use |
| --- | --- |
| Spacing, layout, one-off utility | Tailwind utility (token-backed colours only) |
| Colour | `primary` / `surface-*` / `text` — never raw hex |
| PrimeReact component internals | PassThrough (`pt`) with token-backed classes |
| Reusable complex style | SCSS module (SMACSS), `_tokens.scss` aliases only |
| State variation | SMACSS `is-` class (e.g. `is-active`, `is-collapsed`) |

Hover/active states use a solid surface step (`bg-surface-100`), never an
opacity modifier — the bridged colours carry no alpha channel.

---

## Cascade layers — why styles never fight

All CSS lands in four ordered cascade layers, declared **first** in
`index.html` so the order is locked before any stylesheet loads:

```
@layer tw-base, primereact, tw-components, tw-utilities;
```

Effective precedence, lowest to highest: Tailwind preflight → the PrimeReact
theme → our components (`l-*` shell, `.card`, prose tweaks) → Tailwind
utilities. So a utility class on a PrimeReact component always wins, and the
theme never bleeds over our shell styling. Custom SCSS partials wrap their
rules in `@layer tw-components { … }`; same-named layers merge.

---

## Typography

The typeface is **Inter** (variable woff2, self-hosted in `styles/fonts/` —
no CDN), with `latin-ext` covering the Turkish glyphs ğ ş ı İ. The base size
is 14px, set in `main.scss` — and drops to **12px below the `md` breakpoint**
(`(width <= 767px)`) in the same block, so on phones everything rem-based
(text, PrimeReact paddings and widths, Tailwind spacing) densifies from one
rule. Alongside it, `_prime-skin.scss` renders every PrimeReact button at
Lara's small metrics below the same breakpoint (one `@media` block —
PrimeReact 10 has no preset/`definePreset` API; that is v11). Breakpoint
values have one canonical style-side source:
`styles/utils/_breakpoints.scss` (`$bp-sm: 640px`, `$bp-md: 768px`,
`$bp-lg: 1024px`, no output) — every SCSS media query derives from these
(e.g. `(width <= #{$bp-md - 1px})` → 767px), never a hardcoded pixel value;
the TypeScript side mirrors the breakpoints it consumes (md, lg) in
`src/config/breakpoints.ts`
(`BREAKPOINTS` + the derived `MEDIA` matchMedia strings). A tap-target audit
at the 12px root found nothing under the WCAG 2.2 minimum of 24px CSS; the
below-`md` patient-name edit control is itself sized to that floor — it
fills its table cell with a `min-h-8` minimum (2rem = 24px at the 12px
root; WCAG 2.5.8).
Rendered documentation uses the
`@tailwindcss/typography` plugin with every `--tw-prose-*` colour mapped onto
the theme variables in `tailwind.config.ts` — left-aligned on the content
surface, capped at ~920px — and one more place where dark mode costs nothing
extra (`prose-invert` is unnecessary and unused). The single sanctioned
exception: fenced code blocks render **dark in both modes** (highlight.js
`github-dark`), so code always reads on its familiar dark canvas.
