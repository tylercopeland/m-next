# `@m-next/input`

Text input component. Forked from `@m-one/input` and normalized to the m-next API conventions.

## Quick start

```jsx
import Input from '@m-next/input';

<Input label="Email" type="email" placeholder="jane@example.com" />
<Input label="Search" leftIcon={<SearchIcon />} placeholder="Find invoices…" />
<Input label="Email alias" rightContent="@method.me" />
<Input label="Password" type="password" required errorMessage="Required" />
<Input ref={inputRef} label="Account name" />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Visible label rendered above the input (via `@m-next/caption`) |
| `name` | string | — | Native input name |
| `type` | string | `'text'` | text / email / password / number / search / tel / url |
| `value` | string \| number | `''` | Controlled value |
| `placeholder` | string | — | Native placeholder |
| `required` | boolean | `false` | Marks the field required (visually + ARIA) |
| `disabled` | boolean | `false` | Disables interaction; sets `aria-disabled` |
| `readOnly` | boolean | `false` | Read-only state |
| `autoFocus` | boolean | `false` | Focuses on mount |
| `autoComplete` | string | `'off'` | Native autocomplete attr |
| `tabIndex` | number | `0` | |
| `leftIcon` | ReactNode | — | Optional leading icon |
| `rightContent` | ReactNode | — | Optional trailing content (text, badge, button) |
| `errorMessage` | string \| ReactNode | — | When set, input shows error state + renders this message |
| `intent` | `'error' \| 'warning' \| 'informative'` | `'error'` | Visual intent of the message |
| `hideLabel` | boolean | `false` | Hides the visible label (still announced via `aria-label`) |
| `width` | string \| number | `'100%'` | Container width |
| `style`, `inputStyle` | object | — | Style overrides for container / input element |
| `onChange`, `onBlur`, `onFocus`, `onKeyDown`, `onKeyUp` | function | — | Standard event handlers |
| `selectOnFocus` | boolean | `false` | Selects content when focused |
| `minLength`, `maxLength`, `minValue`, `maxValue` | number | — | Native length / range constraints |
| `ref` | ref | — | Forwarded to the `<input>` element |
| Any `aria-*`, native input attrs | — | — | Spread to the underlying `<input>` |

## What changed from `@m-one/input`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `prefixIcon="email"` (string icon name) | `leftIcon={<MailIcon />}` ReactNode | Soft shim — warns once, still renders via `@m-next/svg-icon` |
| `suffixText="..."` | `rightContent` ReactNode | Soft shim — warns once |
| `validationMessage` | `errorMessage` | Soft shim — warns once |
| `infoLevel` | `intent` | Soft shim — warns once |
| `hideCaption` | `hideLabel` | Soft shim — warns once |
| `ariaDescribedby` | `aria-describedby` (standard React attr) | Soft shim — warns once |
| `readonly` (lowercase) | `readOnly` (React standard) | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `hidden`, `displayAuto`, `legacyClass`, `compactStyle`, `isLabelBolded`, `innerStyle`, `background` | — | Silently ignored |
| `useValidation` + rules engine | Still works | Soft shim — but the recommended pattern is consumer-driven validation that sets `errorMessage` directly |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `prefixIcon` string → `leftIcon` rendered with `@m-next/svg-icon`
- `suffixText` → `rightContent`
- `validationMessage` → `errorMessage`
- `infoLevel` → `intent`
- `hideCaption` → `hideLabel`
- `ariaDescribedby` → `aria-describedby`
- `readonly` → `readOnly`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, etc.) accept their prop but have no behavioral effect — V4 styling is now always on.

## Accessibility

- Uses native `<input>` semantics. All `aria-*` props pass through.
- `disabled` automatically mirrors to `aria-disabled`.
- `errorMessage` flips `aria-invalid` to `true`.
- `label` is rendered via `@m-next/caption` and connected to the input via `htmlFor` / `id`.
- `hideLabel` keeps the label in the DOM for screen readers but visually hides it.

## Open follow-ups

- `input.test.jsx`, `debouncedInput.test.jsx`, and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button.
- `@m-next/caption` still has its own legacy API surface (`isV4Design`, `legacyClass`, `float`, etc.). Cleaning Caption is a separate pass.
- `@m-next/validation` rule engine (`useValidation`) is still supported via shim. The longer-term move is consumer-driven validation; Validation package becomes the deprecated path.
- `DebouncedInput` and `OutroAnimation` siblings still use the legacy API of `@m-next/caption` and `@m-next/styles`. Cleanup pass deferred.
