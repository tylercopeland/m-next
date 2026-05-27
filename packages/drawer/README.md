# `@m-next/drawer`

Slide-in panel from a viewport edge. Portal-rendered, focus-trapped, accessible by default. No external dependencies for focus management or positioning.

## Quick start

```jsx
import { Drawer } from '@m-next/drawer';

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>
<Drawer open={open} onClose={() => setOpen(false)} title="Edit invoice">
  <p>Body content goes here.</p>
</Drawer>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | boolean | required | Controlled visibility. |
| `onClose` | `() => void` | required | Fires on backdrop click, ESC, close button. |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge the drawer slides in from. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full' \| number \| string` | `'md'` | Horizontal placements: sm=320, md=480, lg=720, full=100vw. Vertical: sm=240, md=360, lg=480, full=100vh. Numbers → px. Strings pass through. |
| `title` | string | — | Optional header text. |
| `showCloseButton` | boolean | `true` | × in top-right of drawer header. |
| `closeOnEsc` | boolean | `true` | ESC key closes the drawer. |
| `closeOnOverlayClick` | boolean | `true` | Click on backdrop closes the drawer. |
| `children` | ReactNode | — | Body content. |
| `style`, `className` | — | — | Forwarded to the drawer panel. |

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the panel.
- `aria-labelledby` points at the title id (if `title` provided); otherwise `aria-label="Drawer"`.
- Close button has `aria-label="Close drawer"`.
- Backdrop is `aria-hidden="true"`.
- **Focus is trapped** inside the drawer. Tab from the last focusable wraps to the first; Shift+Tab from the first wraps to the last.
- On open, focus moves to the close button (or the first focusable element if the close button is hidden).
- On close, focus returns to whichever element was focused when the drawer opened.
- ESC closes the drawer (suppressible via `closeOnEsc={false}`).

## Why no `useTheme()`

Drawers sometimes render alongside content rendered before a `ThemeProvider` has mounted — error boundary panels, lazy-route placeholders, top-level shells. Coupling to theme would throw in those cases. Colors come from `@m-next/tokens` directly.

## Animation

- Backdrop fades in/out (`200ms`).
- Panel slides in/out (`220ms`, ease-out).
- Keyframes are injected once into `document.head` when the first Drawer mounts. Idempotent — every Drawer instance shares the same keyframes block.
- The panel unmounts only after the exit animation has finished, so closing looks the same as opening rather than snapping out.

## Body scroll lock

While at least one drawer is open, `document.body.style.overflow` is set to `hidden`. A module-level counter handles overlapping drawers (the lock releases only when the last drawer closes) and the original `overflow` value is restored on cleanup.

## Notes

- The component is portal-mounted to `document.body`. It does not render anything (returns `null`) while `open` is false and the exit animation has completed.
- Avoid stacking drawers — the body scroll lock and focus trap support it, but UX-wise, prefer wizard steps or in-drawer dialogs.
- For brief notifications, use `@m-next/toast`. For confirmation prompts, use `@m-next/dialog`.
