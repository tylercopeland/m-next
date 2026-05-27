# `@m-next/banner`

Page-level banner for status messages, system announcements, and inline calls to action. Forked from `@m-one/banner` and normalized to the m-next API conventions.

## Quick start

```jsx
import Banner from '@m-next/banner';

<Banner>You're using a draft version of this screen.</Banner>

<Banner status="success" icon="check-circle-1-v4">
  12 records are ready for import.
</Banner>

<Banner
  status="error"
  primaryButton="Learn more"
  onPrimaryButtonClick={() => navigate('/help/conflicts')}
  hasClose
  onClose={() => setBannerOpen(false)}
>
  2 records have conflicts. These issues must be addressed before moving forward.
</Banner>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | ReactNode | — | Banner content. Strings, JSX, anything. |
| `status` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Drives theme colors, icon background, and ARIA role. Matches `@m-next/alert`. |
| `variant` | `'full' \| 'trailing'` | `'full'` | `full` stretches the message; `trailing` keeps it tight against actions. |
| `icon` | string | — | SvgIcon name rendered in the leading icon slot. |
| `primaryButton` | string | — | Text for the primary action. |
| `onPrimaryButtonClick` | function | — | Click handler for the primary action. |
| `secondaryButton` | string | — | Text for the secondary action. |
| `onSecondaryButtonClick` | function | — | Click handler for the secondary action. |
| `hasClose` | boolean | `false` | Renders a close button (real `<button>` with `aria-label="Close"`). |
| `onClose` | function | — | Click handler for the close button. |
| `id` | string | auto | Identifier; auto-generated if omitted. |
| `ref` | ref | — | Forwarded to the banner root `<div>`. |
| Any `aria-*`, native `div` attrs | — | — | Spread to the root element. |

`status` automatically sets `role="alert"` for `error` and `warning`, and `role="status"` otherwise.

## What changed from `@m-one/banner`

| Was | Now | Status |
|-----|-----|--------|
| `id` required | optional — auto-generated if absent | Backwards-compatible |
| `message` prop | `children` | Soft shim — warns once |
| `severity` prop | `status` | Soft shim — warns once |
| Legacy `severity` values `'informational'`, `'clear'`, `'loading'` | All map to `status="info"` | Silently translated |
| `bannerStyle` | `variant` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| Close button rendered as a clickable `<SvgIcon>` (a styled `<img>`) | Real `<button aria-label="Close">` wrapping the icon | Accessibility fix |
| `isV4Design`, `isMobile`, `legacyClass` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `message="..."` → `children`
- `severity="informational"` / `"clear"` / `"loading"` → `status="info"`
- `severity="error" | "success" | "warning"` → `status` unchanged
- `bannerStyle` → `variant`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`) accept their prop but have no behavioral effect — V4 styling is now always on, and responsive behaviour is handled via CSS.

## Accessibility

- The root sets `role="alert"` for `status="error"` and `status="warning"`, and `role="status"` otherwise — so screen readers announce critical banners immediately and informational ones politely.
- The close affordance is a real `<button type="button" aria-label="Close">` — keyboard focusable, Enter / Space activate it.
- All `aria-*` attrs pass through to the root.
- Action buttons (`primaryButton`, `secondaryButton`) render as native `<button type="button">` elements.

## Open follow-ups

- `banner.test.jsx` and `__snapshots__/` still reference the old API (`severity`, `bannerStyle`, `message`). They keep working through the shim but the snapshots reflect old class names / props. Rewriting them is a separate pass.
- `@m-next/styles` `lightTheme` is still consumed for the named theme buckets (`informative`, `negative`, `positive`, `warning`). Migrating Banner to consume theme via `ThemeProvider` from `@m-next/theme` is a separate pass.
- A `loading` status (with a spinner instead of an icon) was part of the old API but never properly themed. We folded it into `info` — a real loading banner is a follow-up.
