# `@m-next/search-input`

Search-flavored text input. A debounced `<input type="search">` with a leading search icon and an optional clear (×) button. Forked from `@m-one/search-input` and normalized to the m-next API conventions.

## Quick start

```jsx
import SearchInput from '@m-next/search-input';

<SearchInput placeholder="Search invoices…" onChange={setQuery} />
<SearchInput label="Search" showClearButton onChange={setQuery} />
<SearchInput leftIcon={<CustomIcon />} placeholder="Search…" />
<SearchInput ref={inputRef} placeholder="Search…" />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Accessible label (also used as `aria-label` when no visible label is rendered) |
| `name` | string | — | Native input name |
| `value` | string \| number | `''` | Controlled value |
| `placeholder` | string | — | Native placeholder |
| `disabled` | boolean | `false` | Disables interaction; sets `aria-disabled` |
| `readOnly` | boolean | `false` | Read-only state |
| `tabIndex` | number | `0` | |
| `leftIcon` | ReactNode | search icon | Optional leading icon — defaults to a magnifying glass; pass `null` to suppress |
| `showClearButton` | boolean | `false` | Show a clear (×) button when there's a value |
| `suppressAutoFocus` | boolean | `false` | Disable the default auto-focus on mount |
| `selectOnFocus` | boolean | `false` | Selects content when focused |
| `onChange` | (value) => void | — | Fires with the debounced string value (~200ms) |
| `onRawChange` | (value) => void | — | Fires immediately with the un-debounced value |
| `onClear` | () => void | — | Fires when the clear (×) button is pressed |
| `onFocus`, `onBlur` | (value) => void | — | Fire with the current string value |
| `onKeyDown`, `onKeyUp` | function | — | Standard event handlers |
| `style`, `wrapperStyle` | object | — | Style overrides for the input element / container |
| `ref` | ref | — | Forwarded to the `<input>` element |
| Any `aria-*`, native input attrs | — | — | Spread to the underlying `<input>` |

## What changed from `@m-one/search-input`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="..."` | `label="..."` | Soft shim — warns once |
| `prefixIcon="search"` (string icon name) | `leftIcon={<SearchIcon />}` ReactNode (defaults to a search glyph) | Soft shim — warns once |
| `ariaDescribedby` | `aria-describedby` (standard React attr) | Soft shim — warns once |
| `readonly` (lowercase) | `readOnly` (React standard) | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `hidden`, `displayAuto`, `legacyClass`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `caption` → `label`
- `prefixIcon` string → `leftIcon` rendered with `@m-next/svg-icon`
- `ariaDescribedby` → `aria-describedby`
- `readonly` → `readOnly`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, etc.) accept their prop but have no behavioral effect.

## Accessibility

- Uses native `<input type="search">` semantics. All `aria-*` props pass through.
- `aria-label` resolves from `aria-label` prop → `label` → `name` → `'Search'`.
- `disabled` automatically mirrors to `aria-disabled`.
- The clear button is a real `<button type="button">` with `aria-label="Clear search"`.
- `aria-describedby` passes through; legacy `ariaDescribedby` is shimmed.

## Open follow-ups

- `SearchInput.test.jsx` and `__snapshots__/` still reference the legacy snapshot output. Snapshots will need regeneration after this cleanup; functional tests should still pass (clear-button, controlled mode, onChange semantics are all preserved).
