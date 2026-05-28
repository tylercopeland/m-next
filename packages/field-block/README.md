# `@m-next/field-block`

`FormSection` — a multi-control form group wrapper. Renders a list of typed fields with optional title / description, edit / save controls, and collapse-empty toggle.

> **Naming note.** The audit-driven canonical component name is **`FormSection`**. The legacy default export is still called `FieldBlock` for backwards compatibility, and the package name remains `@m-next/field-block`. Both refer to the same component.

## Quick start

```jsx
// Canonical name (preferred for new code)
import { FormSection } from '@m-next/field-block';

// Legacy default export (still works — same component)
import FieldBlock from '@m-next/field-block';

<FormSection
  title="Contact details"
  description="How customers can reach this account."
  fields={fields}
  data={data}
  tagsList={tagsList}
/>
```

## When to use

- Grouping several form controls under a shared heading + description.
- Rendering a data-driven form from a `fields` array (Field types from `@m-next/types`).
- Inline edit-mode toggle with Save / Clear footer actions.

## When NOT to use

- A single labeled input — use `@m-next/form-field` + `@m-next/input` directly.
- A free-form layout without typed fields — compose `FormField` instances yourself.

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto-generated | Optional. Drives child element ids and `aria-labelledby` wiring. |
| `title` | string | — | FormSection heading. Renders as `<h2>` and wires `aria-labelledby` on the section region. |
| `description` | ReactNode | — | Supporting copy below the title. |
| `fields` | `Field[]` | — | Field definitions (from `@m-next/types`) that drive each row. |
| `data` | object | — | Map of `{ [field.name]: value }`. |
| `validationErrors` | `Record<string, string>` | `null` | Per-field error messages. |
| `error` | string | — | Block-level error; replaces field render with retry CTA. |
| `onRefetch` | function | — | Triggered by the retry button when `error` is set. |
| `isLoading` | boolean | `false` | Renders skeletons in place of fields. |
| `collapseEmpty` | boolean | `false` | Hide empty fields behind a "Show more" toggle. |
| `forceOpen` | boolean | `false` | Force the collapsed group open on next render. |
| `mode` | `0 \| 1` | `0` | `0` = read-only, `1` = edit. |
| `showEdit` | boolean | `false` | Renders an inline edit-toggle icon. |
| `showSave` | boolean | `false` | Renders a Save button in edit mode. |
| `showClearAndNew` | boolean | `false` | Renders a Clear-and-new button in edit mode. |
| `saveLabel` / `clearLabel` | string | `'Save'` / `'Clear and new'` | Footer button copy. |
| `onSaveClick` / `onClearClick` | function | — | Footer button handlers, called with the current internal data. |
| `isWorking` | boolean | `false` | Disables footer / edit controls during a save. |
| `tagsList` | `Tag[]` | — | Forwarded to `TagsField` rows. |
| `displayPreferences` | object | — | Forwarded to each field renderer. |
| `dropdownLists` | object | — | Per-field option arrays for `DropdownField` / `User` rows. |
| `onLoadDropdownData` | function | — | Lazy-loader for dropdown options. |
| `onImageUpload` / `onDownloadImage` | function | — | Forwarded to `ImageField` / `ProfileImage` rows. |
| `metadata` | object | — | Per-field metadata blob, forwarded to field renderers. |
| `onSelect` / `selectedField` | function / string | — | Highlight a single row for app-builder selection. |
| `onMoreClick` | function | — | Fires when the "Show more / Show less" toggle changes. |
| `showMoreRef` | ref | — | Forwarded to the collapse Button. |
| `width` | number \| string | — | Container width. |
| `style` | object | — | Style overrides on the outer Container. |
| `ref` | ref | — | React forwardRef API; resolves to the outer wrapper. |

## What changed from `@m-one/field-block`

| Was | Now | Status |
|-----|-----|--------|
| Component spoken-of as "FieldBlock" | Spoken-of as **FormSection**; legacy `FieldBlock` default export retained | Both names point at the same component |
| `id="..."` required | Optional — auto-generated if absent | Backwards-compatible |
| `heading` | `title` | Soft shim — warns once |
| `caption` (as section title) | `title` | Soft shim — warns once |
| `hint` | `description` | Soft shim — warns once |
| `help` | `description` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |
| `colors.blue` (legacy flat key) | `colors.blue.base` (nested `@m-next/tokens`) | Migrated |
| `colors.concrete` | `colors.concrete` (token) | Migrated |

## Backwards compatibility

Legacy prop names work with a single `console.warn` at first use. The shim translates:
- `heading` / `caption` → `title`
- `hint` / `help` → `description`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, etc.) accept their prop but have no behavioral effect — V4 styling is now always on.

## Accessibility

- Outer wrapper renders `role="region"` when a `title` is set.
- `title` renders an `<h2>` with a stable id that's wired up via `aria-labelledby` on the region.
- `description` renders below the title in the normal reading order — screen readers announce it after the section name.
- Field rows inherit their own a11y semantics from the underlying field renderers (`TextField`, `DropdownField`, `ImageField`, etc.).
- Save / Clear / Edit / Show-more buttons are real `<button>`s via `@m-next/button`.

## Open follow-ups

- `fieldBlock.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button / Input.
- `SectionHeader` is currently a styled `<h2>` with a fixed visual scale. If a wider type system lands in `@m-next/typeography`, that's the place to route it.
- The `fields[].caption` property is the per-row label from `@m-next/types`. It is unrelated to the (deprecated) component-level `caption` prop renamed to `title`.
