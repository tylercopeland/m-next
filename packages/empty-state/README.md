# `@m-next/empty-state`

Empty state placeholder — shown when a list, table, or section has no data. Centered vertical layout: optional icon → title → optional description → optional action.

## Quick start

```jsx
import { EmptyState } from '@m-next/empty-state';

<EmptyState title="No invoices yet" />

<EmptyState
  title="No invoices yet"
  description="Create your first invoice to get started."
  action={<button type="button">New invoice</button>}
/>

<EmptyState
  variant="bordered"
  icon="📋"
  title="No invoices match your search"
  description="Try a different filter or clear all filters."
  action={<button type="button">Clear filters</button>}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `icon` | `ReactNode` | — | Optional decorative element (SVG, emoji, or any node). Visually hidden from assistive tech via `aria-hidden`. |
| `title` | `string` | — | **Required.** Also used as `aria-label` on the root region. |
| `description` | `ReactNode` | — | Body text. Can include links or other inline content. |
| `action` | `ReactNode` | — | Usually a button or link the user can take next. |
| `variant` | `'subtle' \| 'bordered' \| 'banner'` | `'subtle'` | Container treatment — see below. |
| Any other prop | — | — | Forwarded to the root `<div>`. |

## Variants

- **`subtle`** — no border, no background, padding 32px. Default. Use inline within a card.
- **`bordered`** — 1px dashed `#d1d5db` border on `#f9fafb` background, border-radius 12, padding 48. Use as the only content in a panel.
- **`banner`** — solid `#f3f4f6` background, no border, border-radius 8, padding 32. Use as a notice within a layout.

## Accessibility

- Root has `role="region"` and `aria-label={title}` so screen-reader users can navigate to (or skip) the empty state by landmark.
- `icon` is wrapped in `aria-hidden="true"` — decorative only. Don't rely on it to communicate meaning.
- `action` is rendered as-is — pass a real, focusable element (a `<button>` or `<a>`).

## Why no `useTheme()`

EmptyState is often rendered before data fetches — including before a `ThemeProvider` is guaranteed to be mounted (loading splashes, error fallbacks, lazy routes). Colors are hardcoded sensible defaults so the component never throws outside a theme context.
