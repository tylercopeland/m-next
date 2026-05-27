# `@m-next/dropdown`

Dropdown / select component. Forked from `@m-one/dropdown` and normalized to the m-next API conventions. Built on `react-select`.

## Quick start

```jsx
import Dropdown from '@m-next/dropdown';

<Dropdown
  label="Country"
  options={[{ value: 'CA', label: 'Canada' }, { value: 'US', label: 'United States' }]}
  value={selected}
  onChange={setSelected}
/>

<Dropdown label="Status" variant="icon" options={iconOptions} />
<Dropdown label="Tags" variant="multi" isMultiSelect options={tagOptions} />
<Dropdown ref={ref} label="Account" options={accounts} />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Visible label rendered above the control |
| `options` | DropdownOption[] \| DropdownOptionGroup[] | — | Options or grouped options |
| `value` | DropdownOption \| DropdownOption[] \| null | — | Controlled value |
| `onChange` | function | — | `(value, actionMeta) => void` |
| `variant` | `'single' \| 'icon' \| 'multi' \| 'multi-icon'` | `'single'` | Visual layout of each option row |
| `errorMessage` | string | — | When set, dropdown shows error state + renders this message |
| `required` | boolean | `false` | Marks the field required (visually + ARIA) |
| `disabled` | boolean | `false` | Disables interaction |
| `placeholder` | string | — | Placeholder when nothing selected |
| `width` | string \| number | — | Container width |
| `isMultiSelect` | boolean | `false` | Enable multi-value selection |
| `isCreatable` | boolean | `false` | Allow free-text creation of new options |
| `isSearchable` | boolean | `true` | Type-to-filter |
| `isClearable` | boolean | `false` | Show a clear (×) indicator |
| `isLoading` | boolean | `false` | Render a loading skeleton in place of the control |
| `onCreate` | function | — | Called with the created value when `isCreatable` |
| `actionButtonText` | string | — | If set, prepends an action button row to the menu |
| `onActionButtonClick` | function | — | Click handler for the action button row |
| `isPortal` | boolean | `false` | Render the menu in a portal to `document.body` |
| `openMenuOnFocus` | boolean | `false` | |
| `breakout` | boolean | `false` | Allow menu to grow wider than the control |
| `menuMinWidth` | string \| number | — | Minimum width of the open menu |
| `menuPlacement` | `'auto' \| 'bottom' \| 'top'` | `'auto'` | |
| `hideBorderWhenNotActive` | boolean | `false` | Borderless until focused/invalid (table cell pattern) |
| `disableSearchHighlight` | boolean | `false` | |
| `filterOption` | function | default | `(option, inputValue) => boolean` |
| `style` | object | — | Style override for the container |
| `ref` | ref | — | Forwarded to the underlying react-select instance |
| `aria-label` | string | — | Accessible name when no `label` is rendered |

### Option shape

```ts
type DropdownOption = {
  label: string;
  value: string | number | boolean;
  lines?: string[];     // additional lines for multi variant
  secondary?: string;   // right-aligned secondary text
  icon?: string;        // svg-icon name for icon/multi-icon variants
  color?: string;       // icon color
  size?: number;        // icon size
  colour?: string;      // pill color family for multi-select chips ('blue' | 'green' | …)
  isFixed?: boolean;    // pinned chip — hides remove (×)
};
```

## What changed from `@m-one/dropdown`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="..."` | `label="..."` | Soft shim — warns once |
| `dropdownStyle="single"` | `variant="single"` | Soft shim — warns once |
| `validationMessage="..."` | `errorMessage="..."` | Soft shim — warns once |
| `isCreateable` (typo) | `isCreatable` | Soft shim — warns once |
| `ariaLabel="..."` | `aria-label="..."` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `background` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `caption` → `label`
- `dropdownStyle` → `variant`
- `validationMessage` → `errorMessage`
- `isCreateable` → `isCreatable`
- `ariaLabel` → `aria-label`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `background`) accept their prop but have no behavioral effect — V4 styling is now always on.

## Accessibility

- Underlying react-select provides keyboard semantics (arrow keys, Enter, Esc, Home/End, type-ahead).
- `label` is rendered via `@m-next/caption` and connected to the input via `aria-labelledby`.
- `aria-label` is used when no visible label is set.
- `errorMessage` switches the border to the negative content color.
- `disabled` sets `isDisabled` on the underlying control.

## Variants

| `variant` | Use it for |
|-----------|-----------|
| `single` (default) | Plain label-per-row dropdown |
| `icon` | Row with a leading icon (or color square if `icon === 'square'`) |
| `multi` | Row with a primary label plus zero-or-more secondary `lines` |
| `multi-icon` | `multi` + a leading icon |

## Open follow-ups

- `dropdown.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button / Input.
- `DropdownAsync` and `ClickToEditDropdown` siblings still use the legacy API surface (`caption`, `dropdownStyle`, `isCreateable`, etc.). Cleanup pass deferred.
- `@m-next/caption` and `@m-next/validation` still have their own legacy API surfaces; cleaning each is a separate pass.
- The `option.colour` family-name lookup still resolves against the nested token palette (`colors.blue.light`, `.dark`). If a non-palette family is passed it falls back to `colors.blue.*`.
