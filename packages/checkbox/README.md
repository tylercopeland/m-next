# `@m-next/checkbox`

Checkbox component. Forked from `@m-one/checkbox` and normalized to the m-next API conventions.

## Quick start

```jsx
import Checkbox, { CheckboxGroup } from '@m-next/checkbox';

<Checkbox label="Subscribe to updates" checked={subscribed} onChange={setSubscribed} />
<Checkbox label="Select all" halfChecked onChange={toggleAll} />
<Checkbox label="Locked option" disabled checked />
<Checkbox ref={inputRef} label="With ref" />

<CheckboxGroup
  align="vertical"
  items={[
    { id: 'a', label: 'Apple', checked: true, onChange },
    { id: 'b', label: 'Banana', checked: false, onChange },
  ]}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | _auto_ | Auto-generated if omitted (was required in `@m-one/checkbox`) |
| `name` | string | — | Native input name |
| `label` | string \| ReactNode | — | Visible label rendered alongside the box |
| `checked` | boolean | `false` | Controlled checked state |
| `halfChecked` | boolean | `false` | Indeterminate visual (tri-state) |
| `disabled` | boolean | `false` | Disables interaction; sets `aria-disabled` |
| `autoFocus` | boolean | `false` | Focuses on mount |
| `tabIndex` | number | `0` | |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Box vs label position |
| `rounded` | boolean | `false` | 8px corner radius (default 4px) |
| `narrow` | boolean | `false` | Removes the default 14px bottom margin |
| `fullWidth` | boolean | `false` | Stretches the label to fill horizontal space |
| `bold` | boolean | `false` | Bold label text |
| `hideLabel` | boolean | `false` | Hides the label visually (still announced via ARIA) |
| `disableLabel` | boolean | `true` | If true, the label also dims when `disabled` |
| `width` | string \| number | `'100%'` | Wrapper width |
| `className`, `style`, `testId` | — | — | Standard escape hatches |
| `onChange` | `(checked: boolean) => void` | — | Receives the new boolean state |
| `onBlur`, `onFocus`, `onKeyDown` | function | — | Standard event handlers |
| `ref` | ref | — | Forwarded to the underlying `<input type="checkbox">` |

### CheckboxGroup

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `align` | `'vertical' \| 'horizontal'` | `'vertical'` | Flow direction |
| `items` | `CheckboxProps[]` | `[]` | Each item is rendered as a `<Checkbox>` keyed by `item.id` |
| `name` | string | — | Native input name applied to every child |

## What changed from `@m-one/checkbox`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop (imperative handle) | `ref={ref}` (React forwardRef API) | Soft shim — warns once; legacy handle still works |
| `hideCaption` | `hideLabel` | Soft shim — warns once |
| `controlId` (id for the label element) | derived from `id` | Soft shim — value still accepted as a label id |
| `isMobile`, `hidden`, `legacyClasses`, `isV4Design`, `displayAuto`, `legacyClass` | — | Silently ignored |
| Hex color literals in styles | `@m-next/tokens` references | Internal — no API change |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `forwardRef` prop → chained imperative handle is still populated, and the React `ref` API is preferred
- `hideCaption` → `hideLabel`
- `controlId` → still used as the label element id when supplied

Legacy ghosts (`isMobile`, `legacyClasses`, etc.) accept their prop but have no behavioral effect. The mobile sizing variant was a build-time-only branch — consumers needing larger touch targets should wrap in their own responsive container.

## Accessibility

- Native `<input type="checkbox">` underneath — keyboard semantics inherited.
- Space / Enter toggle the checked state.
- `disabled` automatically mirrors to `aria-disabled`.
- When `label` is rendered, the wrapper sets `aria-labelledby` to the label's id.
- When `hideLabel` is set or no label is provided, the box itself carries `aria-labelledby` and `aria-checked`.

## Open follow-ups

- `checkBox.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button / Input.
- `classConverter.jsx` still maps a handful of `mi-checkbox-*` class names to ad-hoc colors. The class-name override path is preserved for `@m-one` callers; in m-next, prefer composing color via `style` / `className`.
- File case (`checkBox.jsx`) is intentionally preserved to minimize porting friction back to `@m-one`.
