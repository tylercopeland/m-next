# `@m-next/spinner`

Loading spinner. SVG-based, theme-agnostic, accessible by default.

## Quick start

```jsx
import { Spinner } from '@m-next/spinner';

<Spinner />                            // medium, default color
<Spinner size="sm" />                  // small (16px)
<Spinner size="lg" color="#137E58" />  // large with custom color
<Spinner size={48} />                  // custom px size
<Spinner label="Saving invoice" />     // screen-reader text
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | `sm`=16, `md`=24, `lg`=32. Numbers pass through as px. |
| `color` | string | `'#0D71C8'` | Any CSS color. Pass `theme.content.secondary` inside a ThemeProvider for theme-tied color. |
| `thickness` | number | `2.5` | Stroke width in SVG units (viewBox is 24×24). |
| `label` | string | `'Loading'` | Visible only to screen readers (`aria-label`). |
| Any other prop | — | — | Forwarded to the wrapper `<span>`. |

## Accessibility

- Wrapper has `role="status"` and `aria-live="polite"` so screen readers announce the loading state without interrupting.
- The visible SVG has `aria-hidden="true"` — decorative, not announced.
- The `label` prop is visually hidden but read by screen readers. Override per-context: `<Spinner label="Saving invoice" />`.

## Why no `useTheme()`

Spinners often render before a `ThemeProvider` mounts — initial loading splashes, error boundary fallbacks, lazy-route placeholders. Coupling to theme via `useTheme()` would throw in those cases. Instead, pass `color` explicitly when theming is desired:

```jsx
const theme = useTheme();
<Spinner color={theme.content.secondary} />
```

## Animation

The keyframes (`@keyframes m-next-spinner-rotate`) are injected once into `document.head` when the first Spinner mounts. Idempotent — multiple Spinners share the same keyframes block.
