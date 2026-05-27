# `@m-next/select`

> **Heads up — the name is misleading.** Despite being called `Select`, this is **not** a `<select>` dropdown. It is a **radio-card chooser**: a horizontal row of large icon + title + description cards where exactly one is "checked." If you need the standard form-select pattern (a labeled control that opens a list of options), use [`@m-next/dropdown`](../dropdown). The package name is preserved for this Phase 3 cleanup; renaming is deferred to a later phase to keep the production diff small.

A one-of-N radio-card chooser. Forked from `@m-one/select` and normalized to the m-next API conventions.

## Quick start

```jsx
import Select from '@m-next/select';

const options = [
  { icon: 'address-lookup', title: 'Explore',  description: 'Discover new ways to manage your business' },
  { icon: 'checklist',      title: 'Organize', description: 'Create and sync with accounting software' },
  { icon: 'cloud-download-V4', title: 'Download', description: 'Export millions of options exclusive to Method' },
];

<Select
  label="Choose a starting point"
  options={options}
  selectedValue="Explore"
  onChange={(opt) => console.log(opt.title)}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `options` | `{ icon, title, description, disabled }[]` | `[]` | One card per entry. `title` doubles as the selection identifier. |
| `selectedValue` | string \| number | — | The currently selected option's `title`. |
| `value` | string \| number | — | Alias of `selectedValue` (forward-compatible). |
| `onChange` | `(option) => void` | — | Fires with the full option object when a card is picked. |
| `label` | string | — | Accessible name for the radiogroup. |
| `size` | `'sm' \| 'lg'` | `'lg'` | Card scale. `lg` = 80px icon / 24px padding; `sm` = 40px icon / 16px padding. |
| `id` | string | auto | Optional. Auto-generated if absent. |
| `className`, `style` | — | — | Standard pass-through. |
| `ref` | ref | — | Forwarded to the outer `<div>` radiogroup. |

### Option shape

```ts
{
  icon?: string;        // name passed to @m-next/svg-icon
  title?: string;       // heading + selection value
  description?: string; // optional secondary text
  disabled?: boolean;   // disables this individual card
}
```

## What changed from `@m-one/select`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="..."` | `label` | Soft shim — warns once |
| `size="small" \| "large"` | `size="sm" \| "lg"` | Soft shim — warns once, still renders |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto` | — | Silently ignored |
| Internal color tokens via `@m-next/styles` (`colors.blue`, `colors['blue-lighter']`) | `@m-next/tokens` (`colors.blue.base`, `colors.blue.lighter`) | Internal-only — no consumer API change |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `caption` → `label`
- `size="small"` → `size="sm"`, `size="large"` → `size="lg"`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`) accept their prop but have no behavioral effect — V4 styling is now always on, and responsive sizing is handled with CSS.

## Accessibility

- The outer wrapper is a `role="radiogroup"` with `aria-label` taken from `label`.
- Each card is a `role="radio"` with `aria-checked` reflecting selection state.
- Disabled cards drop out of the tab order (`tabIndex={-1}`) and set `aria-disabled`.
- Cards respond to **Space** and **Enter** to select.

## Open follow-ups

- **Rename the package.** "Select" being a radio-card chooser conflicts with every consumer's mental model of `<select>`. A Phase 5 pass should either rename to something like `@m-next/card-chooser` / `@m-next/radio-cards`, or alias it.
- **Keyboard navigation across cards.** Arrow-key navigation between options is the standard radiogroup pattern but is not yet implemented; Space/Enter activation works.
- **`select.test.jsx` and `__snapshots__/`** still reference the legacy API — same situation as Button / Input. They will fail until rewritten.
- **`SelectOption` is currently internal.** A future pass may export it as a composition primitive (`<Select.Option>`) so consumers can hand-build heterogeneous card grids.
