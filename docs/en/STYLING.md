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
Lara Green theme CSS (light / dark file, swapped at runtime)
  → CSS variables (--primary-color, --surface-*, --text-color, …)
      ├→ tailwind.config.ts   colours map straight to the variables
      └→ styles/utils/_tokens.scss   SCSS aliases for custom SCSS
```

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
| `--app-ground` (page background) | `rgb(248 250 252)` | `rgb(9 9 11)` |
| `--app-card-bg` (raised surface) | `rgb(255 255 255)` | `rgb(24 24 27)` |
| `--app-card-border` | `rgb(226 232 240)` | `rgb(63 63 70)` |
| `--app-card-shadow` | faint two-layer shadow | `none` (border separates) |
| `--app-menu-item-hover-bg` | `rgb(100 116 139 / 10%)` | `rgb(255 255 255 / 5%)` |
| `--app-radius-card/-item` | `8px` | same |
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
`none` in dark mode. Documentation prose, tables, and forms all live on
cards.

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
is 14px, set in `main.scss`. Rendered documentation uses the
`@tailwindcss/typography` plugin with every `--tw-prose-*` colour mapped onto
the theme variables in `tailwind.config.ts` — a ~70-character reading
measure, and one more place where dark mode costs nothing extra
(`prose-invert` is unnecessary and unused).
