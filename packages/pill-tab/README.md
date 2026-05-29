# `@m-next/pill-tab`

**SegmentedControl** — a horizontal toggle between a small set of mutually-exclusive options. Same visual surface as an iOS-style segmented control.

> The package name is `@m-next/pill-tab` for historical reasons. The canonical component name going forward is `SegmentedControl`. The default export `PillTab` is preserved as a legacy alias and is identical to `SegmentedControl`.

## Quick start

```jsx
import { SegmentedControl } from '@m-next/pill-tab';
// or, equivalently:
// import PillTab from '@m-next/pill-tab';

<SegmentedControl
  options={[
    { value: 'plan', label: 'Plan' },
    { value: 'build', label: 'Build' },
  ]}
  value={view}
  onChange={setView}
  aria-label="Workspace view"
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `options` | `{ value, label, disabled?, href?, target?, rel? }[]` | `[]` | The selectable options |
| `value` | `T` | — | Controlled selected value |
| `onChange` | `(value: T) => void` | — | Receives the next value |
| `size` | `'sm' \| 'md'` | `'md'` | Visual size variant |
| `aria-label` | string | — | Accessible name for the radiogroup |
| `aria-labelledby` | string | — | Reference an element that labels the group |
| `className`, `style` | — | — | Container styling overrides |
| `data-testid` | string | `'pill-tab'` | Test id |
| `ref` | ref | — | Forwarded to the underlying container `<div>` |

## What changed from `@m-one/pill-tab`

| Was | Now | Status |
|-----|-----|--------|
| Component name `PillTab` | `SegmentedControl` (default export still `PillTab`) | Backwards-compatible |
| `id` required | optional — auto-generated | Backwards-compatible |
| `items` | `options` | Soft shim — warns once |
| `selected` | `value` | Soft shim — warns once |
| `size="narrow"` / `"regular"` | `size="sm"` / `"md"` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| Implicit `role="tab"` per option | `role="radiogroup"` + `role="radio"` per option, arrow-key nav | Accessibility upgrade |
| `isV4Design`, `isMobile`, `legacyClass`, `compactStyle`, `displayAuto` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use:

- `items` → `options`
- `selected` → `value`
- `size="narrow"` → `size="sm"`, `size="regular"` → `size="md"`
- `forwardRef` prop → use the React `ref` directly

Legacy ghost props (`isV4Design`, `isMobile`, `legacyClass`, `compactStyle`, `displayAuto`) accept their value but have no behavioural effect — V4 styling is now always on.

## Accessibility

- Root has `role="radiogroup"`. Provide either `aria-label` or `aria-labelledby`.
- Each option has `role="radio"` and `aria-checked` mirroring the selected state.
- Disabled options receive `aria-disabled="true"`.
- **Arrow-key navigation** — ArrowRight / ArrowDown selects the next enabled option; ArrowLeft / ArrowUp selects the previous. Enter / Space activates a button-style option.
- **Roving tabindex** — only the currently selected option is in the tab sequence; the rest are skipped.
- Options that render as links (`href`) navigate through the browser instead of calling `onChange`.

## Tokens consumed

- `colors.white` — selected pill background.
- `colors.grey.dark` — option label colour.
- `colors.grey.light` — hover background + disabled label colour.
- `colors.blue.base` / `colors.blue.lighter` — keyboard focus ring.

## Open follow-ups

- Tests (`PillTab.test.tsx`) still exercise the legacy `role="tab"` semantics. The component now uses `role="radio"` per option, so the existing tests will need updating in a follow-up pass.
- The container chrome (`rgba(...)` background + inset shadow) is not yet expressible from tokens; left as literal values for now.
