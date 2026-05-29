# `@m-next/button-group`

A row of related actions. Two exports:

- `ButtonGroup` — the primary export. Renders a labeled split-button or single-button cluster with an attached dropdown menu. Used for "Save / Save and close / Save and new" patterns.
- `ButtonGroupRow` — a segmented toggle row (Tabs / List / Grid style switcher).

Forked from `@m-one/button-group` and normalized to the m-next API conventions.

## Quick start

```jsx
import ButtonGroup, { ButtonGroupRow } from '@m-next/button-group';

// Split-button — primary action plus dropdown
<ButtonGroup
  buttonStyle="primary"
  isDropdown
  data={[
    { value: 'save', label: 'Save' },
    { value: 'save-close', label: 'Save and close' },
    { value: 'save-new', label: 'Save and create new' },
  ]}
  onClick={(item) => handle(item.value)}
/>

// Segmented selector
<ButtonGroupRow
  selected={view}
  data={[
    { value: 'list', icon: 'tabs-V4' },
    { value: 'grid', icon: 'tabs-condensed-V4' },
  ]}
  onClick={(item) => setView(item.value)}
  aria-label="Choose view"
/>
```

## When to use it

- **Split-button** — a primary action with related variants (Save / Save and close / Save and new).
- **Toolbar cluster** — three or four buttons that act on the same thing.
- **Segmented switcher** — a small fixed set of mutually-exclusive views (`ButtonGroupRow`).

## When NOT to use it

- For a single action — use `@m-next/button`.
- For form input selection (radio-like with submit value) — use a `RadioGroup` / `SegmentedControl`.
- For tab navigation — use a `Tabs` component.

## ButtonGroup API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `data` | `ButtonGroupDataItem[]` | `[]` | Items rendered in the group. Index 0 is the primary action; the rest go into the dropdown when `isDropdown` is true. |
| `buttonStyle` | `'primary' \| 'ghost' \| 'plain' \| 'calendarMenu'` | `'primary'` | Visual treatment. |
| `isDropdown` | boolean | `false` | Split-button mode. The primary button toggles the menu. |
| `hasMenuLabel` | boolean | `false` | Use `menuLabel` as the button text instead of the first item's label. |
| `menuLabel` | string | `''` | Static label for `hasMenuLabel` mode. |
| `label` | string | `''` | Rendered above the group via `@m-next/caption`. |
| `showCaption` | boolean | `true` | Show the caption above the group. |
| `disabled` | boolean | `false` | Disables interaction; sets `aria-disabled`. |
| `size` | `'small' \| 'medium'` | `'medium'` | Height — 24px / 32px. |
| `width` | string | `'auto'` | Container width. |
| `fillWidth` | boolean | `false` | Stretches the group to fill its container. |
| `margin` | string | `'0px 5px 10px 5px'` | Container margin (legacy default — pass an explicit value to override). |
| `forceOpenUp` | boolean | `false` | Force the dropdown to open above the trigger. |
| `id` | string | auto-generated | Optional. Generated as `m-next-button-group-N` when omitted. |
| `onClick` | `(item, index) => void` | — | Fired when any item is selected. |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded to the container. |
| `aria-label` | string | derived | Accessible name for the group. Falls back to `label`, then primary button text, then `'Button group'`. |

### `ButtonGroupDataItem`

```ts
{
  value: string | number | boolean;
  label?: string | ReactNode;
  icon?: string;          // svg-icon name
  disabled?: boolean;
  tooltip?: string;       // raw HTML — rendered via react-tooltip
  labelStyle?: CSSProperties;
}
```

The `data` array shape is intentionally retained from the legacy API. A cleaner architecture (children-based composition) is a follow-up beyond this API cleanup pass.

## ButtonGroupRow API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `data` | `ButtonGroupDataItem[]` | `[]` | Items rendered as segments. |
| `selected` | `string \| number \| boolean` | — | Currently-selected item value. |
| `onClick` | `(item, index) => void` | — | Fires when a segment is clicked. |
| `id` | string | auto-generated | Optional. |
| `width` | string \| number | — | Max width of the row. |
| `tooltipId`, `tooltipPlace` | string | — | Hook into a `react-tooltip` instance. |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded to the wrapping row. |
| `aria-label` | string | `'Button group'` | Accessible name for the segmented row. |

## What changed from `@m-one/button-group`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `legacyClass="..."` | `style` / variant composition | Soft shim — warns once, still flows through `convertLegacyControlStyle` |
| `backgroundColor` / `color` / `borderColor` / `fontSize` props | `buttonStyle` or `style` for one-off escape hatches | Soft shim — warns once. **Note:** legacy flat-key palette names (`'dark-grey'`) are no longer translated. Pass hex / CSS color names instead. |
| `isV4Design`, `isMobile`, `displayAuto`, `compactStyle` | — | Silently ignored |
| `colors['grey-darkest']`, `colors.legacy['blueHover']`, etc. (internal) | `colors.grey.darkest`, `colors.blue.dark` from `@m-next/tokens` | Internal — no API impact |

## Accessibility

- Outer wrapper is `role="group"` with `aria-label`. The label is derived from `aria-label` → `label` → primary button text → `'Button group'`.
- The split-button trigger is `role="button"` with `aria-haspopup`, `aria-expanded`, and `aria-controls` wired to the menu.
- The dropdown is `role="menu"` with `aria-labelledby` pointing at the caption or trigger id.
- Each dropdown item is `role="menuitem"` with `aria-disabled` mirroring its disabled state.
- The menu-open icon button has its own `aria-label` (`{group label} — open menu`).
- `ButtonGroupRow` segments are `role="button"` with `aria-pressed` reflecting selection and `aria-label` from `label || icon`.
- Keyboard: Tab / Shift-Tab focus the group, Arrow Up/Down navigate the open menu, Enter / Space activate.

## Open follow-ups

- `ButtonGroup.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button / Input.
- The `data`-array prop shape is architectural. A children-based composition (`<ButtonGroup><ButtonGroup.Item>…</ButtonGroup.Item></ButtonGroup>`) is the long-term move, but out of scope for this API cleanup pass.
- The `convertLegacyControlStyle` path on `legacyClass` is retained for source compatibility. Consumer migration is the path to dropping it.
