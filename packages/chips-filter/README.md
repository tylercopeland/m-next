# `@m-next/chips-filter`

Horizontal row of filter chips backed by the criteria-builder expression model.
The canonical name for the component is **FilterChips**; the package and the
default export retain the historical `ChipsFilter` name for backwards
compatibility.

```jsx
import { FilterChips } from '@m-next/chips-filter';
// or, equivalently:
import ChipsFilter from '@m-next/chips-filter';
```

## Quick start

```jsx
import { FilterChips } from '@m-next/chips-filter';

<FilterChips
  fieldList={fields}
  simpleChipsExpression={state.simple}
  advancedChipsExpression={state.advanced}
  onExpressionChange={(next) => setState(next)}
  options={dropdownOptions}
  tagsList={tags}
  viewName="Activities"
/>
```

FilterChips renders a `role="group"` region holding:

1. Existing chips (one per predicate in the simple expression, plus one
   AdvancedChip if an advanced expression is also active).
2. An `AddChip` that opens a `ChipBuilderPopup` for picking a field + operation
   + value.
3. A "Clear all" link button when any filters are active.
4. Optional save/reset affordances when `egCustomViewsSaveButtonEnabled` is on.

The component owns its own state but is fully controlled at the
`simpleChipsExpression` / `advancedChipsExpression` boundary — callers receive
the resulting expression via `onExpressionChange`.

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto | Accessible-name anchor + id prefix for nested DOM nodes. Auto-generated if absent. |
| `label` | string | — | Accessible group name (becomes `aria-label` on the root). |
| `disabled` | boolean | `false` | Disables the Add Chip affordance. |
| `fieldList` | `Field[]` | `[]` | All fields available for filtering. Passed to ChipBuilder. |
| `simpleChipsExpression` | `ExpressionElement[]` | `[]` | Current simple-mode expression. |
| `advancedChipsExpression` | `ExpressionElement[]` | `[]` | Current advanced-mode expression (rendered as a single AdvancedChip). |
| `displayPreferences` | object | — | Field display preferences forwarded to ChipBuilder. |
| `onExpressionChange` | `(change) => void` | — | Fires with `{ simple, advanced, allFiltersInvalid? }` on every effective edit. |
| `options` | `{ value, label, avatar }[]` | — | Dropdown option list, async-friendly via `onSearch`. |
| `isLoading` | boolean | — | Toggles loading state in the value editors. |
| `onSearch` | `(field, text, expr) => void` | — | Called whenever the user types into a value editor. |
| `searchText` | string | — | Current search text, when externally controlled. |
| `tagsList` | `Tag[]` | — | Tag definitions (used to colour Pills in the value picker). |
| `viewName` | string | — | View name passed to the field formatter. |
| `forcedTimeZone` | string | — | Override timezone for date/time fields. |
| `disableMaxWidth` | boolean | — | Disables the per-chip max-width cap. |
| `forceClear` | boolean | — | When flipped to `true`, clears all filters. |
| `resetChipsTriggered` | boolean | — | When flipped to `true`, resets simple + advanced to empty. |
| `egCustomViewsSaveButtonEnabled` | boolean | `false` | Renders the save/reset button row. |
| `viewResetButtonVisible` | boolean | `false` | Visibility flag for the reset button. |
| `currentViewType` | `'standard' \| 'custom' \| 'shared'` | `'standard'` | Drives which save button(s) to render. |
| `canEditSharedView` | boolean | `false` | If `false` on a shared view, only "Save as new view" is offered. |
| `onUpdateCurrentView` / `onUpdateSharedView` / `onClickShowSaveGridViewDialog` / `onClickResetButton` | function | — | Save / reset handlers. |
| `onChipFilterApplied` / `onChipFilterRemoved` | function | — | Analytics callbacks. |
| `setViewSaveAndResetButtonsVisible` | function | — | Lifts unsaved-changes state to the parent. |
| `hasOtherViewChanges` | boolean | `false` | Combined with chip changes to decide button visibility. |
| `viewType` | `'Standard' \| 'Personal' \| 'Shared' \| null` | `null` | View classification for the unsaved-changes comparator. |
| `updateInitialValues` | boolean | `false` | When `true`, re-anchors the "initial" expression after a save. |
| `ref` | ref | — | Forwarded to the root container element. |

## What changed from `@m-one/chips-filter`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="..."` (legacy field name) | `label="..."` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |
| `isMobile` | layout still honours it internally | Marked `@deprecated` — prefer CSS media queries at the consumer |
| Default export named `ChipsFilter` | `FilterChips` named export (alias) | Audit-flagged rename. Both work. |

## Backwards compatibility

- Old prop names emit a single `console.warn` at first use and translate to
  the canonical name (`caption` → `label`).
- `ChipsFilter` is still the default export. `FilterChips` is the same
  component, exposed as a named export for forward-compat.
- All `@m-next/types` shapes (`Field`, `ExpressionElement`, `Predicate`, `Tag`)
  are unchanged.

## Accessibility

- Root container is `role="group"` with `aria-label` derived from `label` or
  the standard `aria-label` prop; falls back to `"Filter chips"`.
- Each chip is a real button via `@m-next/pill`'s clickable variant — keyboard
  semantics inherited.
- `AddChip` is the primary add affordance and is fully keyboard-focusable.
- The advanced edit popover renders inside a `Popover` from `@m-next/popover`,
  which handles focus management.

## Tokens consumed

- `colors.grey.base` / `colors.grey.light` — icon and divider colours
- `colors.concrete` — hover surface on `ListItem`
- `colors.white` — value-editor input background

All previously sourced from the legacy flat-key `@m-next/styles` colour map;
now migrated to `@m-next/tokens`. Tag-colour matching in `ListItem` still
operates on hex strings supplied by Method's tag data — those are data
matchers, not styling, and stay as hex.

## Open follow-ups

- Storybook still references the legacy mock data in `testing/`; rewriting
  those fixtures is out of scope for this pass.
- Internal sub-components (`Chip`, `AdvancedChip`, `OperationSelector`,
  `ChipBuilderPopup`, value editors) still carry `isMobile` and `isV4Design`
  props. The public API change here is the only Phase 3 surface change.
- `criteria-builder` (the underlying advanced-edit panel) has not yet been
  normalized.
