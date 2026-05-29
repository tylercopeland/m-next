# `@m-next/loading-skeleton`

Skeleton — an animated placeholder shape rendered in place of content while it loads. Forked from `@m-one/loading-skeleton` and normalized to the m-next API conventions.

> The package name remains `@m-next/loading-skeleton` for compatibility, but the audit-canonical component name is **Skeleton**. Both `import Skeleton from '@m-next/loading-skeleton'` (via the named export) and `import LoadingSkeleton from '@m-next/loading-skeleton'` (the legacy default) work; they resolve to the same component.

## Quick start

```jsx
import { Skeleton } from '@m-next/loading-skeleton';

<Skeleton width={240} />
<Skeleton width={64} height={64} variant="circle" />
<Skeleton count={3} height={16} />
<Skeleton variant="text" width="80%" />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `width` | string \| number | — | Width in px or CSS string |
| `height` | string \| number | — | Height in px or CSS string |
| `variant` | `'text' \| 'rect' \| 'circle'` | `'rect'` | Shape variant. `'circle'` renders a round skeleton. |
| `count` | number | `1` | Renders multiple stacked skeletons |
| `baseColor` | string | `colors.grey.lighter` | Base shimmer color (from `@m-next/tokens`) |
| `highlightColor` | string | `colors.white` | Peak shimmer color |
| `borderRadius` | string \| number | — | Override the corner radius |
| `duration` | number | — | Shimmer animation duration (seconds) |
| `inline` | boolean | `false` | Render inline instead of block-level |
| `label` | string | `'Loading'` | Accessible label announced by screen readers |
| `id` | string | auto | Auto-generated when omitted |
| `ref` | ref | — | Forwarded to the wrapping `<span>` |
| Any other prop | — | — | Spread to the wrapper `<span>` (e.g. `style`, `className`, `data-*`) |

## What changed from `@m-one/loading-skeleton`

| Was | Now | Status |
|-----|-----|--------|
| `LoadingSkeleton` only | `Skeleton` named export added, `LoadingSkeleton` default kept | Backwards-compatible |
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `circle` boolean | `variant="circle"` | Soft shim — warns once, still works |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| no token integration | defaults pull from `@m-next/tokens.colors.grey.lighter` / `colors.white` | Backwards-compatible |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use:

- `circle` boolean → `variant="circle"`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, etc.) accept their value but have no behavioral effect.

## Accessibility

- The wrapping `<span>` carries `role="status"`, `aria-busy="true"`, and `aria-live="polite"` — screen readers announce that something is loading without interrupting the user.
- The `label` prop is the accessible text. Default is `"Loading"`. Override for specificity: `<Skeleton label="Loading invoices" />`.
- No keyboard interaction — Skeleton is informational, not interactive.
- When content arrives, unmount the Skeleton (don't toggle a flag) so the live region announces only the initial loading state.

## Open follow-ups

- `loadingSkeleton.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button / Input.
- Could grow a `SkeletonText` composite (n lines with auto-decreasing width on the last line) — deferred until consumer demand.
