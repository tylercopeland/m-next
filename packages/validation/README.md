# `@m-next/validation`

Validation rule engine + the small `ValidationMessage` component that renders inline error text. Both forked from `@m-one/validation` and normalized to the m-next API conventions.

This package is consumed primarily by the form composites — `@m-next/input`, `@m-next/dropdown`, `@m-next/multi-select`, etc. — which pass an `errorMessage` through to `ValidationMessage` for inline rendering, and (optionally) wrap their value in `<Validation>` to run the bundled rule engine.

> **API surface only.** The longer-term direction for m-next is consumer-driven validation — the consumer of an Input owns its validity state and passes `errorMessage` down. The `<Validation>` rule-engine wrapper still works (with a soft shim on its legacy props), but new code should pass `errorMessage` directly to the field. Replacing the rule engine entirely is a separate architectural pass.

## Quick start

```jsx
import { ValidationMessage, Validation } from '@m-next/validation';

// Standalone — render an error string under a custom field.
<ValidationMessage message="Email is already in use" />

// Rule engine — declarative validation against a value.
<Validation
  value={email}
  rules={[
    { type: 'isRequired' },
    { type: 'isValidEmail' },
  ]}
  onValidation={(isValid) => setIsValid(isValid)}
/>
```

## `ValidationMessage`

Renders a red warning-sign icon plus the given text. Used internally by the form composites — you rarely need to render it yourself, but it's exported for cases where you're building a custom field outside the standard composites.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `message` | string \| ReactNode | — | The validation text. Primary prop; matches React form-library convention. |
| `children` | ReactNode | — | Convenience alias for `message`. |
| `id` | string | auto | Optional — auto-generated if absent. Drives the icon and text element IDs. |
| Any `className` / `style` / etc. | — | — | Spread to the wrapper. |

If `message` (and `children`) is falsy, the component renders `null`.

## `Validation`

Declarative wrapper around the bundled rule library. Pass a `value` and a list of `rules`; the first failing rule produces an error message, which is rendered through `ValidationMessage`. Pass `message` directly to override rule output (used by composites to surface consumer-supplied errors).

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `value` | string \| number \| null | `null` | Value to evaluate against the rules. |
| `rules` | `ValidationRule[]` | `[]` | Rule definitions (see below). First failure wins. |
| `message` | string \| ReactNode | — | Pre-resolved error message. When set, bypasses rule evaluation. |
| `onValidation` | `(isValid: boolean) => void` | — | Fires every render with the validity boolean. |
| `id` | string | auto | Optional — auto-generated if absent. |

### Supported rules

The rule engine recognises four built-in rule types. Each rule is an object with a `type` discriminator and rule-specific config. Every rule accepts a `customMessage` to override the default error string.

| `type` | Config | Default message | Behaviour |
|--------|--------|-----------------|-----------|
| `isRequired` | — | `"Field is required."` | Fails when value is null / undefined / whitespace-only. |
| `isValidEmail` | — | `"Invalid email address."` | Fails when value doesn't match `\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+`. Also fails on empty. |
| `isValidLength` | `minLength?`, `maxLength?` | `"Must be between {min} and {max} characters."` / `"Must be at least {min} characters."` / `"Must be at most {max} characters."` | Compares against `value.toString().trim().length`. Zero / undefined skips that bound. |
| `isValidRange` | `minValue?`, `maxValue?` | Same shape as length but without "characters". | Compares `Number(value)` against the bounds. |

```jsx
const rules = [
  { type: 'isRequired' },
  { type: 'isValidLength', minLength: 8, maxLength: 64, customMessage: 'Password must be 8–64 characters.' },
];
```

Rules are evaluated in order; the first failing rule short-circuits, so put cheap / common checks first.

## What changed from `@m-one/validation`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop (both components) | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design` | — | Silently ignored — V4 styling is always on |
| `compactStyle` | — | Silently ignored |
| `isMobile`, `legacyClass` | — | Silently ignored |
| `lightTheme.negative.secondary` (Emotion theme lookup) | `colors.red.base` from `@m-next/tokens` | Background change — falls back to `theme.negative.secondary` if a ThemeProvider is in the tree |

The `message`, `rules`, `value`, and `onValidation` prop names are unchanged — they're the established API and form composites already pass them through.

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `forwardRef` prop → use the React `ref` directly (chaining is not currently implemented because the rendered components are not native DOM elements)

Legacy ghosts (`isV4Design`, `compactStyle`, `isMobile`, `legacyClass`) accept their value but have no behavioral effect — V4 styling is now always on and the message renders in a single canonical layout.

## Tokens consumed

- `colors.red.base` — the warning-sign icon color and (when no ThemeProvider is present) the message text color.
- Theme context (via Emotion) for `theme.negative.secondary` — when rendered inside `<ThemeProvider>` from `@m-next/theme`, picks up the active theme's negative color. Falls back to `colors.red.base`.

## Accessibility

- `ValidationMessage` renders text inline below the field. Composites wire it up with `aria-describedby` / `aria-invalid` on their input.
- The warning-sign icon is decorative — `@m-next/svg-icon` renders it with `aria-hidden`. The message text carries the meaning.
- When no message is provided, the component renders `null` rather than an empty container — screen readers won't announce phantom validation state.

## Open follow-ups

- `validation.test.jsx` still references the legacy API (`isV4Design`, `getByRole('img')`). It will fail until rewritten — same situation as Button, Input, and the form-component family.
- The bundled rule engine is the legacy path. The longer-term move is consumer-driven validation where the field's consumer holds the validity state and passes `errorMessage` directly. `<Validation>` will be deprecated as part of that architectural pass.
- The Storybook glob in `.storybook/main.js` doesn't yet include this package — when the next storybook-config pass runs, add `validation` to the list.
