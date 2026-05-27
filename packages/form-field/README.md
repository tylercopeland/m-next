# `@m-next/form-field`

Slot-based wrapper for a single form row: label, optional description, the control itself, and an optional error message. Use it to give Method-styled label+help+error layout to controls that don't ship their own — third-party inputs, custom widgets, button groups, etc.

`@m-next/input` already renders its own label and error internally — don't wrap an Input in a FormField.

## Quick start

```jsx
import { FormField } from '@m-next/form-field';

<FormField
  label="API key"
  description="Generated in your account settings"
  errorMessage="API key must be 32 characters"
  required
  htmlFor="api-key-input"
>
  <input id="api-key-input" type="text" />
</FormField>
```

## Auto id wiring

If `htmlFor` is omitted and the child has no `id`, FormField generates an id and injects it into the child along with `aria-describedby` and `aria-invalid` via `cloneElement`. If the child already has an `id`, FormField uses that one for `htmlFor` and leaves the id alone.

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | `string \| ReactNode` | — | Rendered above the control. |
| `description` | `string \| ReactNode` | — | Help text below the label, above the control. |
| `errorMessage` | `string \| ReactNode` | — | When set, renders below the control with error styling and sets `aria-invalid` on the child. |
| `required` | `boolean` | `false` | Shows an asterisk after the label. Visual cue only — the `required` attribute on the control is the consumer's responsibility. |
| `htmlFor` | `string` | — | Forwarded to the `<label>`'s `htmlFor`. If absent, the id is derived from the child or auto-generated. |
| `hideLabel` | `boolean` | `false` | Hides the label visually; it remains in the DOM for screen readers. |
| `id` | `string` | auto | Wrapper id. Description gets `${id}-description`, error gets `${id}-error`. |
| `children` | `ReactNode` | — | The control. A single React element is cloneable; anything else is rendered as-is. |
| Any other prop | — | — | Spread onto the wrapper `<div>`. |

## Accessibility

- A real `<label>` element points at the control via `htmlFor`.
- `aria-describedby` on the control combines description-id, error-id, and any pre-existing value from the consumer.
- `aria-invalid="true"` is set on the control when `errorMessage` is present (and the consumer hasn't already set it).
- The error region uses `role="alert"` so screen readers announce it when it appears.
- The required asterisk is `aria-hidden`; semantic required state must be set on the control by the consumer.

## When NOT to use it

- Don't wrap `@m-next/input` — Input handles its own label and error. Wrapping doubles them.
- Don't use as a layout primitive. For groups of fields, stack FormFields directly with normal spacing.
