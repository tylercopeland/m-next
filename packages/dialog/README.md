# `@m-next/dialog`

Modal dialog. Wraps `react-modal` with m-next styling, default header/body/footer composition, and proper modal accessibility.

## Quick start

```jsx
import Dialog from '@m-next/dialog';

<Dialog
  isOpen={open}
  title="Leave without saving?"
  onClose={() => setOpen(false)}
  footer={{
    primaryButtonLabel: "Don't save and close",
    onPrimaryButtonClick: handleDiscard,
    secondaryButtonLabel: 'Cancel',
    onSecondaryButtonClick: () => setOpen(false),
  }}
>
  You have unsaved changes. Leaving now will discard them.
</Dialog>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `isOpen` | boolean | `false` | Whether the dialog is visible |
| `title` | string | — | Title rendered in the default header; drives `aria-labelledby` |
| `onClose` | function | — | Called when the user dismisses (button or react-modal close path) |
| `onDismiss` | function | — | Called alongside `onClose` from the explicit dismiss-button path |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | Use `alertdialog` for destructive / critical confirms |
| `hideDismissButton` | boolean | `false` | Hides the header X button |
| `header` | ReactNode | — | Extra content rendered into the default header (between title and dismiss) |
| `footer` | object | — | `{ primaryButtonLabel, onPrimaryButtonClick, secondaryButtonLabel, onSecondaryButtonClick, primaryVariant, secondaryVariant, primaryDisabled, secondaryDisabled }` or `{ children }` |
| `width` | number \| string | `612` | Content width |
| `maxHeight` | number \| string | `'auto'` | Body max height |
| `aria` | `{ labelledby, describedby }` | derived | Override the auto-resolved aria associations |
| `customStyles` | `{ overlay, content }` | — | Style overrides merged on top of defaults |
| `hideDefaultHeader` | boolean | `false` | Skip the default header (render fully custom inside `children`) |
| `hideDefaultBody` | boolean | `false` | Skip the default body wrapper (renders `children` directly) |
| `hideDefaultFooter` | boolean | `false` | Skip the default footer wrapper |
| `id` | string | auto-generated | id prefix for header / title / body / footer / dismiss / wrapper |

## What changed from `@m-one/dialog`

| Was | Now | Status |
|-----|-----|--------|
| `id` required for ARIA wiring | optional — auto-generated if absent | Backwards-compatible |
| `aria-labelledby` pointed at the header wrapper id (which contained the title, dismiss button, and extra content) | now points at the title element directly | Fixes a screen-reader bug — the dialog's accessible name is now just the title text |
| `role` and `aria-modal` provided ad-hoc | always present via react-modal's content element | Fixes the audit-flagged accessibility gap |
| Dismiss button was a `<div>` with no role / no keyboard support | real `<button type="button" aria-label="Close dialog">` | Now keyboard-focusable, screen-reader-announced |
| `customStyles.content.background` not set | defaults to `colors.white` (still overridable) | Avoids transparent content overlay |
| `forwardRef={ref}` prop | not supported — dialog is portaled | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto` | — | Silently ignored |

## Accessibility

- `role="dialog"` (or `alertdialog`) is always present on the modal content element. `aria-modal="true"` is applied by `react-modal`.
- `aria-labelledby` is auto-resolved to the title element's id when `title` is provided. Override with the `aria` prop if you render a custom title.
- `aria-describedby` is auto-resolved to the body wrapper id. Override with the `aria` prop.
- The dismiss button is a real `<button>` with `aria-label="Close dialog"`. Keyboard focusable.

### Known gaps

- **Focus trap.** This dialog uses `react-modal`'s built-in focus management — initial focus, return focus, and a tab trap are provided by the underlying library. If you set `hideDefaultHeader` and pass a fully custom layout, ensure at least one focusable element exists inside the dialog so the trap has something to land on.
- **ESC to close.** Provided by `react-modal` and routed through `onClose`.

## Backwards compatibility

Old prop names work with a single `console.warn` at first use:

- `forwardRef` prop → warns; refs aren't supported on a portaled dialog.

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`) accept their prop but have no behavioral effect — V4 styling is now always on.

## Open follow-ups

- The legacy `dialog.test.jsx` snapshot still references the previous header markup; tests will need a rewrite (same situation as Button / Input).
- Dialog body and footer composition primitives (`DialogBody`, `DialogFooter`) are not exported separately — composition is driven by props. If consumers need finer-grained pieces, expose them as named exports later.
- `react-modal` ships its own focus trap. Consider replacing with the same hand-rolled trap used in `@m-next/drawer` once the API has stabilized — gives us full control over edge cases (open-on-mount, nested modals).
