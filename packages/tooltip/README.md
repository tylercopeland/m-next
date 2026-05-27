# `@m-next/tooltip`

Hover/focus-triggered floating label. Accessible, theme-agnostic, zero dependencies.

## Quick start

```jsx
import { Tooltip } from '@m-next/tooltip';

<Tooltip content="Save changes">
  <button type="button">Save</button>
</Tooltip>

<Tooltip content="Delete forever" placement="bottom">
  <button type="button">Delete</button>
</Tooltip>

<Tooltip content="Shows instantly" delay={0}>
  <a href="#help">Help</a>
</Tooltip>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `content` | ReactNode | — | **Required.** The tooltip content. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to the trigger. |
| `delay` | number | `300` | ms before showing on hover. Focus is always immediate. |
| `children` | ReactNode | — | A single trigger element. Cloned to receive event handlers and `aria-describedby`. |

## Behavior

- Hover: show after `delay` ms, hide on `mouseleave` immediately. Cancels pending show if you leave before the delay elapses.
- Focus: show on `focus`, hide on `blur`. No delay either way — keyboard users get instant feedback.
- The bubble only renders while visible — no hidden DOM left behind.

## Accessibility

- The bubble has `role="tooltip"` and a stable, unique `id`.
- The trigger gets `aria-describedby={tooltipId}` while the tooltip is visible.
- If the consumer already passed `aria-describedby` or any of the hover/focus handlers (`onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`), Tooltip chains them — your handler runs, then ours.

## Why no `useTheme()`

Tooltips are used everywhere — including in error boundaries, splash screens, and ad-hoc utility UIs that mount outside a `ThemeProvider`. Coupling to theme would throw in those cases. The bubble's dark slab style is intentionally fixed so it reads as a system overlay rather than themed chrome.

## Animation

The fade-in keyframes (`@keyframes m-next-tooltip-fade-in`) are injected once into `document.head` when the first Tooltip mounts. Idempotent — multiple Tooltips share the same keyframes block.
