# `@m-next/address-lookup`

Address autocomplete. A search-driven typeahead that asks Mapbox's geocoding API for suggestions as the user types, then returns a structured address when one is selected. Forked from `@m-one/address-lookup` and normalized to the m-next API conventions.

## Quick start

```jsx
import AddressLookup from '@m-next/address-lookup';

<AddressLookup
  label="Billing address"
  placeholder="Search for an address…"
  gatewayUrl="https://gateway.example.com"
  onChange={(option) => setAddress(option)}
/>
```

The `onChange` callback receives a structured `AddressLookupOption` containing `streetAddress`, `city`, `stateProvince`, `zipPostalCode`, `country`, `longitude`, `latitude`, plus the raw provider feature on `raw`.

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Visible label, rendered via `@m-next/caption` |
| `placeholder` | string | — | Search box placeholder |
| `gatewayUrl` | string | — | Required. Base URL of the Method gateway used for ipgeo bias |
| `onChange` | `(option \| null) => void` | — | Fires when a suggestion is selected |
| `onSelect` | `(option \| null) => void` | — | Alias for `onChange` |
| `onInputChange` | `(value: string) => void` | — | Fires on every keystroke in the search box |
| `width` | string \| number | `300` | Container width |
| `disabled` | boolean | `false` | Disables interaction |
| `required` | boolean | `false` | Marks the field required (visual + ARIA) |
| `errorMessage` | string | — | When set, switches to error state and renders below |
| `menuPlacement` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | Where the suggestions popup appears |
| `id` | string | auto | Optional — generated if omitted |
| `ref` | ref | — | Forwarded to the outer container `<div>` |

The selected option shape:

```ts
interface AddressLookupOption {
  label: string;          // full place name
  streetAddress?: string; // street line, when present
  city?: string;
  stateProvince?: string;
  zipPostalCode?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  raw: unknown;           // the raw Mapbox geocoding feature
}
```

## Provider

This component is currently wired to Mapbox via `@m-next/map`'s `MapboxApi()`. The `gatewayUrl` prop is the Method gateway base URL — it's used for an ipgeo lookup so suggestions are biased toward the user's coarse location. Swapping the provider would mean replacing `MapboxApi` inside `AddressLookup.tsx`; the public API of this component does not change.

## What changed from `@m-one/address-lookup`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="…"` | `label="…"` | Soft shim — warns once |
| `validationMessage` + `isValid={false}` | single `errorMessage` prop | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |
| hex literals + flat `colors.red` from `@m-next/styles` | nested `colors.red.base` etc. from `@m-next/tokens` | Migration |

Legacy ghosts (`isV4Design`, etc.) accept their prop but have no behavioral effect — V4 styling is now always on. `legacyClass` is silently ignored; pass `className` if you need to forward CSS classes.

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `caption` → `label`
- `validationMessage` → `errorMessage`
- `forwardRef` prop → chained with the React `ref`

## Accessibility

This component follows the WAI-ARIA 1.2 combobox pattern.

- The outer container has `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded` reflecting menu open state, and `aria-controls` / `aria-owns` pointing at the suggestion listbox.
- The underlying text input carries `aria-autocomplete="list"`, `aria-controls` pointing at the listbox, and `aria-expanded`.
- The suggestions menu has `role="listbox"` and a stable id of `${id}-List`.
- Each suggestion is rendered with `role="option"` and a stable id `${id}-option-${key}`.
- `errorMessage` flips `aria-invalid="true"` on the input.
- `required` mirrors to `aria-required` on the input.
- `disabled` is conveyed through React Select's own `aria-disabled` handling.
- `label` connects to the input via `htmlFor` on the rendered `<label>` (through `@m-next/caption`).

## Open follow-ups

- The Mapbox dependency is hardcoded. If Method needs to swap providers (Google Places, Smarty, etc.) the internal `MapboxApi()` call would need to be abstracted behind a `provider` prop.
- `AddressLookup.test.tsx` references the legacy `caption` / `isV4Design` / `validationMessage` API. The legacy props still work via the shim so most tests should pass, but expectations specifically tied to V4 vs non-V4 DOM structure may need a refresh.
- `@m-next/caption` itself has not been cleaned up yet — when it is, the floating-label wiring here may simplify.
