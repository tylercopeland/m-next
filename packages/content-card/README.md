# `@m-next/content-card`

> **ActionCard** — an actionable card with a title, description, optional thumbnail and completion badge, plus a primary action button. The audit calls out a `ContentCard → ActionCard` rename; the canonical export is now `ActionCard`. The legacy `ContentCard` default export and the package name `@m-next/content-card` are preserved for backwards compatibility.

This is the actionable-card sibling to `@m-next/card` (the record-display card).

## Quick start

```jsx
import { ActionCard } from '@m-next/content-card';

<ActionCard
  title="Getting Started"
  description="Preview and launch media within your app using this card."
  buttonText="Launch Demo"
  timeToComplete={5}
  icon="CircleCheck"
  isComplete
  onClick={() => openDemo()}
/>
```

The legacy default export also still works:

```jsx
import ContentCard from '@m-next/content-card';
// same component
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | string | — | Heading text |
| `description` | string | — | Body copy (two-line clamp) |
| `buttonText` | string | `'Launch Demo'` | Label on the primary action button |
| `onClick` | function | — | Click handler for the primary action button |
| `timeToComplete` | string \| number | — | Renders a Pill `~Nmin` when set |
| `isComplete` | boolean | `false` | Show the completion badge in the corner |
| `icon` | string | — | Completion-badge icon name (required for badge) |
| `iconColor` | string | `colors.green.base` | Completion-badge icon color |
| `iconSize` | string \| number | `16` | Completion-badge icon size |
| `thumbnail` | string | — | Image URL for the top slot (falls back to grey placeholder) |
| `style` | object | — | Style overrides for the wrapper |
| `ref` | ref | — | Forwarded to the wrapper `<div>` |
| Any native `<div>` attrs | — | — | Spread to the wrapper |

## What changed from `@m-one/content-card`

| Was | Now | Status |
|-----|-----|--------|
| `ContentCard` only | `ActionCard` canonical, `ContentCard` legacy alias / default export | Backwards-compatible |
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `iconColor='green'` (legacy named color) | `iconColor={colors.green.base}` (default) | Default updated; consumer values pass through |
| CSS variables `var(--Grey-Grey-*, #…)` in styles | `@m-next/tokens` `colors.grey.*` | Internal-only |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`, `hidden` | — | Silently ignored |

## Interactive semantics

The card root renders a plain `<div>` wrapper. The `onClick` prop is wired to the **internal primary action button** (rendered via `@m-next/button` with `buttonStyle='ghost'`) — *not* the card surface. This matches the existing m-one behavior: the card is a passive surface, the button is the affordance.

If you want a fully-clickable card surface, wrap the ActionCard yourself:

```jsx
<a href={…} style={{ textDecoration: 'none', color: 'inherit' }}>
  <ActionCard … />
</a>
```

## Backwards compatibility

- Legacy `forwardRef` prop still works; fires one `console.warn` at first use and is chained alongside the React `ref`.
- Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`, `hidden`) accept their value but have no behavioral effect.

## Accessibility

- The wrapper is a `<div>`. Native HTML attributes spread through, so `role`, `tabIndex`, `aria-*` can all be applied directly.
- The action button is a real `@m-next/button` and inherits its keyboard / focus / aria semantics.
- The thumbnail `<img>` uses `alt={title || 'thumbnail'}` — for purely decorative thumbnails, override with `alt=""` via the rest-spread.

## Open follow-ups

- `ContentCard.test.jsx` still works against the existing API surface — no test changes needed here, but a future pass could rename the suite to `ActionCard.test.jsx` for consistency.
- The package name `@m-next/content-card` and the file name `ContentCard.jsx` are intentionally not renamed in this pass (Phase 3 principle: API surface only).
- The internal Button currently hard-codes `isV4Design` — that's a downstream legacy flag on `@m-next/button`, not an ActionCard prop. Will drop when the Button ghost flag is fully retired.
