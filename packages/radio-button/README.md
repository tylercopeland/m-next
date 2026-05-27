# `@m-next/radio-button`

A single radio button — labeled, accessible, with an optional tooltip hint. Forked from `@m-one/radio-button` and normalized to the m-next API conventions.

This package also exports three group composites — `RadioGroup`, `ButtonRadioGroup`, and `IconRadioGroup` — all on the same cleaned-up API conventions. They're documented further down in this README. Consumers building new UI from scratch can still compose multiple `<RadioButton>` instances themselves (see below) if the prebuilt groups don't fit.

## Quick start

```jsx
import { RadioButton } from '@m-next/radio-button';

const [selected, setSelected] = useState('one');

<>
  <RadioButton
    label="Option one"
    name="example"
    value="one"
    checked={selected === 'one'}
    onChange={(e) => setSelected(e.target.value)}
  />
  <RadioButton
    label="Option two"
    name="example"
    value="two"
    checked={selected === 'two'}
    onChange={(e) => setSelected(e.target.value)}
  />
  <RadioButton
    label="Option three (with hint)"
    name="example"
    value="three"
    checked={selected === 'three'}
    onChange={(e) => setSelected(e.target.value)}
    hint="This is the recommended option for most cases."
  />
</>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Visible label, also drives accessible name |
| `name` | string | — | Native radio name (group multiple radios with the same value) |
| `value` | string \| number | — | Native input value |
| `checked` | boolean | `false` | Whether the radio is selected |
| `onChange` | function | — | `(e: ChangeEvent<HTMLInputElement>) => void` |
| `disabled` | boolean | `false` | Disables interaction |
| `id` | string | auto | Optional — auto-generated if absent |
| `color` | string | `colors.blue.base` | Indicator border + fill color when checked |
| `hint` | string | — | Tooltip help text rendered as an info icon next to the label |
| `direction` | `'row' \| 'column'` | — | Layout hint when used inside a group |
| `isFocused` | boolean | `false` | When true + `checked`, the radio receives DOM focus on mount |
| `tabIndex` | number | `0` | |
| `narrow` | boolean | `false` | Compact spacing |
| `bold` | boolean | `false` | Bolds the label |
| `customFontSize` | string | — | Label font size override |
| `style`, `labelStyle` | object | — | Style overrides |
| `marginBottom` | number | — | Bottom margin in pixels |
| `widthType`, `rowItemWidth` | — | — | Group-layout pass-throughs |
| `ref` | ref | — | Forwarded to the native `<input>` element |
| `aria-checked`, `aria-labelledby`, `aria-label`, `aria-describedby` | — | — | Standard React ARIA attrs pass through |

## Composing a radio group

For new code, render multiple `<RadioButton>` instances inside your own container — there's no group wrapper API in the clean surface. The legacy `RadioGroup`, `IconRadioGroup`, and `ButtonRadioGroup` exports still exist but are not part of this cleanup.

```jsx
const options = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const [size, setSize] = useState('md');

<fieldset role="radiogroup" aria-label="Size">
  {options.map(({ value, label }) => (
    <RadioButton
      key={value}
      name="size"
      value={value}
      label={label}
      checked={size === value}
      onChange={(e) => setSize(e.target.value)}
    />
  ))}
</fieldset>
```

## What changed from `@m-one/radio-button`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `customColor="#0D71C8"` | `color` | Soft shim — warns once |
| `ariaChecked={true}` | `aria-checked={true}` (standard React attr) | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored — V4 styling is always on |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `customColor` → `color`
- `ariaChecked` → `aria-checked`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, etc.) accept their prop but have no behavioral effect — V4 styling is now always on.

## Accessibility

- Uses a native `<input type="radio">`. All `aria-*` props pass through.
- `label` text is rendered in a sibling `<span>` and connected via `aria-labelledby`.
- `disabled` mirrors to the input's `disabled` attribute.
- `hint` renders an info icon with a `react-tooltip` popover — the tooltip is positioned `right` of the icon.

## Tokens consumed

- `colors.blue.base` — default indicator color
- `colors.grey.base` — disabled indicator and focus border
- `colors.blue.lighter` — focus ring border
- `colors.white` — indicator center dot and high-contrast overrides

## Group composites

This package ships three prebuilt groups that map common patterns to the underlying `<RadioButton>` (or, for icon/button styles, swapped renderers). All three accept the same `options` shape pattern (label + value), expose a `label` for the group's accessible name, support `ref` via the React forwardRef API, and auto-generate `id` if not provided.

### `<RadioGroup>` — the canonical group

The default export. Renders a column or row of `<RadioButton>` instances, with optional Caption above, optional subtext under each option, and a hint tooltip per option.

```jsx
import { RadioGroup } from '@m-next/radio-button';

const [size, setSize] = useState('md');

<RadioGroup
  name="size"
  label="Size"
  options={[
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ]}
  selectedValue={size}
  onChange={(_, value) => setSize(value)}
/>
```

Key props (see `src/index.d.ts` for the full list):

| Prop | Type | Notes |
|------|------|-------|
| `options` | `{ label, value, subtext?, disabled?, hint? }[]` | Required |
| `selectedValue` | string \| number | Currently selected `value` |
| `onChange` | `(event, value) => void` | `event.target.name` reports the bare `name` |
| `label` | string | Group accessible name (renders a `<Caption>`) |
| `name` | string | Forwarded to each radio's native input |
| `id` | string | Optional — auto-generated if absent |
| `direction` | `'row' \| 'column'` | Default `'column'` |
| `color` | string | Indicator color forwarded to every radio. Default `colors.blue.base` |
| `gap` | number | Vertical gap between rows (px). Default 16 |
| `allowWrap` | boolean | When `direction='row'`, allows wrapping. Default `true` |

### `<ButtonRadioGroup>` — segmented buttons

Renders the options as a row of buttons. Selecting one swaps it to the "radio-selected" button style. Use this for short, mutually-exclusive choices that read more naturally as a toolbar than as radios — e.g. aggregation type, alignment.

```jsx
import { ButtonRadioGroup } from '@m-next/radio-button';

const [agg, setAgg] = useState('sum');

<ButtonRadioGroup
  label="Aggregation"
  options={[
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'max', label: 'Max' },
    { value: 'min', label: 'Min' },
  ]}
  selectedValue={agg}
  onChange={(item) => setAgg(item.value)}
/>
```

`onChange` receives the selected option object (`{ value, label }`), not a synthetic event. Pass `isOneLine` to force a single row, `buttonWidth` to fix the width of each button.

### `<IconRadioGroup>` — icon tiles

Renders each option as an icon tile with a label underneath. Use for visual choices like chart type, layout style, theme.

```jsx
import { IconRadioGroup } from '@m-next/radio-button';

const [chart, setChart] = useState(1);

<IconRadioGroup
  label="Chart type"
  options={[
    { value: 1, icon: 'mi-icon-bar-chart', label: 'Column' },
    { value: 0, icon: 'mi-icon-graph-bar-1', label: 'Bar' },
    { value: 3, icon: 'mi-icon-graph-line-2', label: 'Line' },
  ]}
  selectedValue={chart}
  onChange={(item) => setChart(item.value)}
/>
```

`onChange` receives the selected option object (`{ value, label, icon }`).

### What changed in the groups

Same shim style as `<RadioButton>` — old names work with a one-time `console.warn`. The translations:

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="..."` | `label` | Soft shim — warns once |
| `customColor` (RadioGroup) | `color` | Soft shim — warns once |
| `customFontSize` (RadioGroup) | `fontSize` | Soft shim — warns once |
| `legacyClass` (RadioGroup) | `className` / `style` | Warns once; still applied via `convertClass` |
| `forwardRef` prop | `ref` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `isRuntime`, `hideCaption`, `displayAuto`, `compactStyle`, `controlId` | — | Silently ignored |

### A11y notes for groups

- Each group renders a `<div role="radiogroup">` with `aria-label` / `aria-labelledby` wired to the Caption when `label` is provided.
- `<RadioGroup>` puts a real `role="radio"` on each native `<input>` via `<RadioButton>`. Tab navigation lands on the currently-selected radio; arrow keys are handled by the browser's native radio behavior.
- `<ButtonRadioGroup>` and `<IconRadioGroup>` add `role="radio"` + `aria-checked` to their tile elements. Arrow-key navigation between tiles is **not** wired up — they currently rely on Tab to move between tiles. This is a known follow-up.

## Open follow-ups

- `RadioButton.test.jsx` and `__snapshots__/` still reference the legacy API — they will fail until rewritten (same pattern as Button / Input).
- `<ButtonRadioGroup>` and `<IconRadioGroup>` don't yet implement arrow-key navigation between tiles.
- `@m-next/caption` still has its own legacy surface (consumed by all three groups). Cleaning it is a separate pass.
