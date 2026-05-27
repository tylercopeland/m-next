# `@m-next/pill`

A compact, slot-aware label with optional leading icon / avatar / dot and trailing icon or delete handle. Use it for tag-like content where you need more affordances than `@m-next/badge` provides (clickable, deletable, icon slots, avatar slot).

## Quick start

```jsx
import Pill from '@m-next/pill';

<Pill>Hello</Pill>                                            // default: subtle blue, md
<Pill colorScheme="green" leadIcon={{ name: 'dot' }}>Active</Pill>
<Pill size="sm" variant="solid" colorScheme="yellow">Beta</Pill>
<Pill variant="ghost" colorScheme="transparent" onClick={() => {}}>Add filter</Pill>
<Pill profileIcon={{ name: 'JD-5.mci' }}>John Doe</Pill>
<Pill onDelete={() => removeTag(id)}>Removable tag</Pill>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | `'sm' \| 'md'` | `'md'` | Pill height — 16px (`sm`) or 24px (`md`). |
| `variant` | `'subtle' \| 'solid' \| 'ghost'` | `'subtle'` | Visual treatment. |
| `colorScheme` | `'blue' \| 'green' \| 'fuchsia' \| 'grey' \| 'yellow' \| 'red' \| 'purple' \| 'orange' \| 'teal' \| 'transparent'` | `'blue'` | Semantic hue. |
| `children` | ReactNode | — | The pill content. Truncates with ellipsis once `maxWidth` is hit. |
| `maxWidth` | string \| number | `'100%'` | Caps the pill width; long text truncates. |
| `leadIcon` | `{ name, label?, size?, showTooltip?, color? }` | — | Leading slot. Pass `{ name: 'dot' }` for a colored dot. |
| `trailIcon` | `{ name, label?, size? }` | — | Trailing slot. |
| `profileIcon` | `{ name, label?, size? }` | — | Leading avatar (`@m-next/image/AvatarImage`). |
| `onClick` | function | — | Makes the pill clickable. Cursor flips to pointer. |
| `onDelete` | function | — | Renders a trailing × that calls this handler. |
| `disabled` | boolean | `false` | Dims text and disables `onClick`/`onDelete`. |
| `bold` | boolean | `true` | Text weight — `true` = 600, `false` = 400. |
| `fontSize` | number | `12` | Text font-size in px. |
| `tooltip`, `tooltipId` | string | — | Forwarded as `data-tooltip-html` / `data-tooltip-id` for an external tooltip layer. |
| `style`, `textStyle`, `className` | — | — | Style overrides on wrapper / text span. |
| `ref` | ref | — | Forwarded to the wrapper `<div>`. |

## When to use Pill vs. Badge

- **`@m-next/badge`** — purely decorative status / count / category. Single `<span>`, no slots, no interactivity.
- **`@m-next/pill`** — tag-like UI with affordances: clickable, deletable, leading avatar, leading/trailing icons.

If you don't need any of pill's affordances, reach for Badge.

## What changed from `@m-one/pill`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `size: 'narrow' \| 'regular'` | `size: 'sm' \| 'md'` | Soft shim — warns once, translates |
| `colorScheme: 'v4-blue' \| 'v4-red' \| ...` | `colorScheme: 'blue' \| 'red' \| ...` | Soft shim — warns once, strips `v4-` prefix; `v4-gray` → `grey` |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once, chains both |
| `validateProps` throws on invalid input | warns and falls back to default | Backwards-compatible (was hostile) |
| Inline `colors['blue-light']` / etc. (legacy flat-key palette) | `@m-next/tokens.colors.blue.light` / etc. (nested palette) | Internal — same hex values |
| `isV4Design`, `isMobile`, `legacyClass` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:

- `size="narrow"` → `size="sm"`
- `size="regular"` → `size="md"`
- `colorScheme="v4-*"` → `colorScheme="*"` (e.g. `v4-blue` → `blue`, `v4-gray` → `grey`)
- `forwardRef` prop → chained with the React `ref`

Invalid `size` / `variant` / `colorScheme` values no longer throw — they warn once and fall back to the default. This matches the rest of the cleaned components (Button, Input, Badge).

## Accessibility

- The wrapper is a `<div>` — Pill is *not* a button. If you wire `onClick`, also wire `role="button"` and `tabIndex={0}` at the consumer if it needs keyboard activation. The preferred path is to use `@m-next/button` for actions.
- `leadIcon.label` / `trailIcon.label` / `profileIcon.label` populate accessible captions on their respective slots.
- The dot variant has `role="presentation"` — color is never the sole signal.

## Open follow-ups

- `pill.test.jsx` and `__snapshots__/` still reference the legacy API (`pill-text-null` test IDs, `narrow`/`regular`). They will fail until rewritten — same situation as Button / Input.
- `@m-next/svg-icon` still has its own legacy API (`isV4Design`). Cleaning SvgIcon is a separate pass.
- `AvatarImage` is deep-imported from `@m-next/image/src/AvatarImage`. That deep import predates this cleanup; flagged for an Image-package pass.
