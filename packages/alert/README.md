# `@m-next/alert`

Inline alert. Theme-agnostic, accessible, status-driven message box for forms, panels, and content sections.

Distinct from a page-level **Banner** — Alert is for inline messaging *inside* a form or content area: validation errors, success confirmations, contextual warnings.

## Quick start

```jsx
import { Alert } from '@m-next/alert';

<Alert status="error" title="Couldn't save invoice">
  The server returned a 500 error. Please try again.
</Alert>

<Alert status="success">Invoice saved.</Alert>

<Alert
  status="warning"
  title="Unsaved changes"
  onDismiss={() => setDismissed(true)}
  action={<button onClick={save}>Save now</button>}
>
  You have unsaved edits to this customer record.
</Alert>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `status` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Semantic intent. Drives background color, accent border, icon glyph, and ARIA role. |
| `title` | string | — | Optional heading rendered above the body. |
| `children` | ReactNode | — | The message body. |
| `action` | ReactNode | — | Optional element (e.g., a Retry button) rendered under the body. |
| `onDismiss` | `() => void` | — | If provided, a × dismiss button is rendered top-right. |
| Any other prop | — | — | Forwarded to the root `<div>`. |

## Status colors

| Status | Background | Accent | Icon |
|--------|-----------|--------|------|
| `info` | `#EAF3FB` | `#0D71C8` | `ℹ` |
| `success` | `#ECFDF5` | `#10B981` | `✓` |
| `warning` | `#FEF3C7` | `#D97706` | `⚠` |
| `error` | `#FEE2E2` | `#DC2626` | `✕` |

Colors are hardcoded into a status→colors map — Alert does not call `useTheme()` so it renders correctly outside a `ThemeProvider` (error boundary fallbacks, pre-mount validation states, etc.).

## Accessibility

- `status="error"` renders with `role="alert"` — announced immediately, interrupts the current speech.
- All other statuses render with `role="status"` — announced politely without interrupting.
- The dismiss button carries `aria-label="Dismiss"`.
- The status icon is `aria-hidden` (decorative — the role + visible/announced text carry the meaning).

## Why no `useTheme()`

Alerts often appear in code paths that run before `ThemeProvider` mounts — error boundary fallbacks, hydration mismatches, initial form validation. Coupling to theme via `useTheme()` would throw in those cases. Status colors are part of the component's semantic contract, not a theming concern.
