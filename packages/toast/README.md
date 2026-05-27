# `@m-next/toast`

Transient overlay notifications. Imperative API (`success(...)`, `error(...)`, …), portal-rendered, auto-dismissing, status-tinted to match `@m-next/alert`.

## Quick start

```jsx
import { ToastProvider, useToast } from '@m-next/toast';

// Mount once at the app root.
<ToastProvider position="top-right" defaultDuration={5000}>
  <App />
</ToastProvider>;

// Anywhere inside the provider:
const toast = useToast();
toast.success('Invoice saved');
toast.error('Could not connect', { duration: 8000 });
const id = toast.info('Long-running operation', { duration: null });
toast.dismiss(id);
toast.dismissAll();
```

## API

### `<ToastProvider>` props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `position` | `'top-right' \| 'top-left' \| 'top-center' \| 'bottom-right' \| 'bottom-left' \| 'bottom-center'` | `'top-right'` | Where the stack renders. |
| `defaultDuration` | `number \| null` | `5000` | Default ms before auto-dismiss. `null` makes toasts persistent unless overridden. |
| `maxToasts` | `number` | `5` | Combined cap across both ARIA stacks. Oldest is dismissed when exceeded. |
| `children` | `ReactNode` | — | Your app. |

### `useToast()`

Returns `{ info, success, warning, error, dismiss, dismissAll }`. Each fire-method takes a `message` (`ReactNode`) and optional `options`:

```ts
type ToastOptions = {
  title?: string;
  duration?: number | null;   // null = persistent
  action?: ReactNode;         // typically a button or link
};
```

Each fire-method returns a string `id` you can pass to `dismiss(id)`.

If `useToast()` is called outside a `<ToastProvider>`, it returns a no-op shim and logs a `console.warn` — your code won't crash, but no toast appears.

## Status palette

Matches `@m-next/alert`:

| Status | Background (`colors.{family}.lighter`) | Accent (`colors.{family}.base/dark`) | Icon |
|--------|----------------------------------------|--------------------------------------|------|
| `info` | `blue.lighter` | `blue.base` | `ℹ` |
| `success` | `green.lighter` | `green.base` | `✓` |
| `warning` | `yellow.lighter` | `yellow.dark` | `⚠` |
| `error` | `red.lighter` | `red.base` | `✕` |

## Accessibility

- The provider renders **two stack containers** — one with `aria-live="polite"` (info/success/warning), one with `aria-live="assertive"` (error). Static `aria-live` per container is more reliable than dynamically swapping a single container's politeness.
- Each toast gets `role="status"` (or `role="alert"` for errors).
- The dismiss button is a real `<button>` with `aria-label="Dismiss"`.

## Behavior notes

- **Portal:** the stack mounts into `document.body` via `ReactDOM.createPortal`.
- **z-index:** `zIndex.toast` from `@m-next/tokens` (1500) — above modals and popovers, so a system-issued error stays visible.
- **Hover-pause:** auto-dismiss is paused on mouse-enter and resumes on leave with the remaining time at the moment of pause.
- **`maxToasts` enforcement:** the cap is combined across both ARIA stacks. When firing a toast would exceed it, the single oldest toast (by fire order) is dismissed first.
- **Animations:** entrance and exit keyframes are injected once into `document.head` (idempotent), following the Spinner/Tooltip pattern. Entrance is 180ms slide+fade from the closest edge; exit is 140ms slide+fade in the same direction.
- **SSR:** the portal renders `null` when `document` is undefined.

## Why no `useTheme()`

Toasts often fire from code paths that may execute before a `ThemeProvider` is mounted — early auth events, websocket reconnects, hydration. Status colors are baked in. See the MDX for the longer rationale.
