# `@m-next/address`

Multi-field address widget. Renders an address either as read-only text or as an
editable form composed of `@m-next/input-area` (the five free-form lines) plus
four `@m-next/input`s (city / state / postal code / country).

## Quick start

```jsx
import Address from '@m-next/address';

// Read-only
<Address
  value={{
    Line1: '123 Fake St',
    Line2: 'Apt 4',
    City: 'Toronto',
    State: 'Ontario',
    PostalCode: 'M5J 2N8',
    Country: 'Canada',
  }}
/>

// Editable, with controlled value
const [value, setValue] = useState({});
<Address
  label="Billing address"
  value={value}
  isEditable
  required
  onChange={setValue}
/>

// Loading placeholder
<Address isLoading />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto | Optional; sub-field ids derive from this. |
| `label` | string | — | Optional section heading rendered above the fields. Drives `aria-labelledby`. |
| `value` | `AddressValue` | `{}` | Controlled value — see shape below. |
| `isLoading` | boolean | `false` | Renders a 7-line skeleton in place of the address. |
| `isEditable` | boolean | `false` | Renders the editable form instead of read-only text. |
| `disabled` | boolean | `false` | Disables all inputs (editable mode only). |
| `required` | boolean | `false` | Marks sub-fields required (editable mode only). |
| `width` | string \| number | — | Container width. |
| `style` | object | — | Style override for the outer container. |
| `onChange` | `(value) => void` | — | Fires when any sub-field changes — receives the merged value object. |
| `onFocus`, `onBlur` | function | — | Standard focus handlers. |
| `ref` | ref | — | Forwarded to the outer container element. |

### Value shape

```ts
interface AddressValue {
  Line1?: string | null;   // Street, building, unit — free form
  Line2?: string | null;
  Line3?: string | null;
  Line4?: string | null;
  Line5?: string | null;
  City?: string | null;
  State?: string | null;   // State / province / region
  PostalCode?: string | null;
  Country?: string | null;
}
```

`onChange` always receives the full merged `AddressValue` (every field present),
not a delta. Pass-through unchanged for fields that didn't change.

## What changed from `@m-one/address`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `Line1`, `Line2`, …, `City`, `State`, `PostalCode`, `Country` as nine separate props | `value={{ Line1, …, Country }}` single object | Soft shim — warns once, still renders |
| `caption="..."` | `label="..."` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. When the legacy
flat props are passed (no `value` object), they're collected into the canonical
`AddressValue` shape automatically.

## Accessibility

- Read-only mode renders address lines as a stack of `TextLine`s.
- Editable mode wraps the inputs in `role="group"` with `aria-labelledby`
  pointing at the section heading (if `label` is set) — otherwise
  `aria-label="Address"` is supplied.
- Each sub-field has its own `<label>` rendered via `@m-next/caption`
  (provided by `@m-next/input`).
- The street-lines `InputArea` carries an `aria-label` derived from `label`
  so it remains identifiable even when the section heading is shared.
- `disabled` mirrors to each sub-field's `aria-disabled` (via Input).

## Open follow-ups

- Per-field validation (state must be valid for country, postal code format
  per country, etc.) is not yet implemented — consumer is responsible.
- The Functional / snapshot test file (`Address.test.jsx` and the
  `__snapshots__/`) targets the legacy flat-prop API. Tests still pass via the
  soft shim but snapshots will need regeneration on the next `-u` run because
  `role="group"` is now set in editable mode.
