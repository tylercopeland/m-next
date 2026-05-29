# `@m-next/phone-input`

International phone number input with country-code selector. Wraps [`react-phone-input-2`](https://www.npmjs.com/package/react-phone-input-2) and normalizes its API to the m-next conventions.

## Quick start

```tsx
import PhoneInput from '@m-next/phone-input';

<PhoneInput label="Phone" defaultCountry="ca" />
<PhoneInput label="Phone" value="+14372207682" />
<PhoneInput
  label="Phone"
  defaultCountry="us"
  onChange={(value, data, event, formatted) => {
    // value:     '14372207682'
    // data:      { name, dialCode, countryCode, format, rawPhone }
    // formatted: '+1 (437) 220-7682'
  }}
/>
<PhoneInput label="Phone" errorMessage="Please enter a valid phone number" />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto | Auto-generated when omitted |
| `label` | string | `'Phone number'` | Floating label rendered via `@m-next/caption` |
| `value` | string | — | Controlled phone value (E.164-ish: `+14372207682`) |
| `defaultCountry` | string | `'ca'` | Two-letter country code for the initial dial code |
| `onChange` | `(value, data, event, formatted) => void` | — | See "Change handler" below |
| `errorMessage` | string | — | Error message rendered below the input |
| `searchPlaceholder` | string | `'Search country'` | Placeholder for the country-search box |
| `enableSearch` | boolean | `true` | Show the country-search box |
| `disableSearchIcon` | boolean | `true` | Hide the search icon inside the search box |
| `enableTerritories` | boolean | `true` | Include territories/dependencies in the country list |
| `containerStyle`, `inputStyle`, `buttonStyle`, `dropdownStyle`, `searchStyle` | CSSProperties | — | Style overrides forwarded to react-phone-input-2 |

### Change handler

`onChange(value, data, event, formattedValue)`:
- `value` — concatenated dial code + entered digits (no `+`, no formatting), e.g. `'14372207682'`.
- `data` — country metadata from react-phone-input-2 (`name`, `dialCode`, `countryCode`, `format`) plus `rawPhone` — the dial-code stripped from `value`.
- `event` — the underlying `ChangeEvent<HTMLInputElement>`.
- `formattedValue` — the visually formatted string shown in the field, e.g. `'+1 (437) 220-7682'`.

## What changed from `@m-one/phone-input`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `placeholder="..."` (drove the floating label) | `label="..."` | Soft shim — warns once |
| `validationMessage` | `errorMessage` | Soft shim — warns once |
| `handleChange` | `onChange` | Soft shim — warns once |
| `country` (alias used in some call sites) | `defaultCountry` | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `compactStyle`, `displayAuto` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `placeholder` → `label`
- `validationMessage` → `errorMessage`
- `handleChange` → `onChange`
- `country` → `defaultCountry`

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `compactStyle`, `displayAuto`) accept their prop but have no behavioral effect — V4 styling is now always on, and responsive behavior is driven by CSS.

## Accessibility

PhoneInput renders the country selector and phone input from `react-phone-input-2`. That library renders:

- A `<button>` with `role="button"` for the flag/dial-code selector that toggles a country list.
- A native `<input type="tel">` for the phone number.
- The country list as a `<ul>` of `<li>` items (not a `role="listbox"`).

The floating label is rendered via `@m-next/caption` and connected to the input through the underlying field semantics. `errorMessage` renders below the field with a warning icon.

A11y open follow-ups (`react-phone-input-2` upstream limitations):
- The country list is rendered as `<ul>`/`<li>` rather than `role="listbox"` / `role="option"`.
- The flag button does not currently set `aria-expanded` or `aria-controls` on toggle.

Because these are upstream behaviors of `react-phone-input-2`, fully fixing them would require either patching that dependency or replacing it with a native country combobox implementation. Both are out of scope for this Phase 3 API-surface cleanup.

## Open follow-ups

- `phoneInput.test.tsx` and `__snapshots__/` still reference the legacy API (`validationMessage`, `handleChange`). Tests will fail until rewritten — same situation as Button / Input.
- `phoneInput.css` is preserved as-is (raw CSS isn't easily token-driven). The Emotion-styled component in `phoneInput.styles.tsx` consumes `@m-next/tokens.colors.*` for the equivalent rules. The bare `phoneInput.css` file contains one hex literal (`#0d71c8`, equivalent to `colors.blue.base`) and `black` — these are documented here as a follow-up for when raw CSS gets a token-aware pipeline.
- Upstream `react-phone-input-2` a11y gaps (`role="listbox"` / `aria-expanded`) are not patched here.
