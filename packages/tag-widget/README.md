# `@m-next/tag-widget`

Tag-list widget. Ships two variants:

- **`EditableTagWidget`** — user types tags, presses Enter to add, deletes from the dropdown. Backed by `@m-next/dropdown` in multi-select / creatable mode.
- **`ReadOnlyTagWidget`** — renders the current tag list as a row of colored pills (`@m-next/pill`). No interaction.

The default export (`TagWidget`) is a thin convenience wrapper that picks one of the two based on `isEditable`.

Forked from `@m-one/tag-widget` and normalized to the m-next API conventions.

## Quick start

```jsx
import TagWidget, { EditableTagWidget, ReadOnlyTagWidget } from '@m-next/tag-widget';

// Read-only display
<ReadOnlyTagWidget
  label="Applied tags"
  tagsList={tagDirectory}
  value={['design', 'audit', 'q4']}
/>

// Editable
<EditableTagWidget
  label="Tags"
  tagsList={tagDirectory}
  suggestions={['design', 'audit']}
  value={appliedTags}
  onChange={(commaJoined) => setAppliedTags(commaJoined.split(','))}
  showManageTags
  onActionButtonClick={() => openTagManager()}
/>

// Wrapper — switch with isEditable
<TagWidget isEditable label="Tags" tagsList={tagDirectory} value={value} onChange={onChange} />
```

## API

### Common props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto-generated | Optional |
| `label` | string | — | Visible label rendered via `@m-next/caption` |
| `tagsList` | `{ name, colour }[]` | `[]` | Catalog of known tags — drives per-tag colouring |
| `value` | string[] | `[]` | Controlled list of currently-applied tag names |
| `size` | `'narrow' \| 'regular'` | `'narrow'` | Pill size |
| `ref` | ref | — | Forwarded to the outer container |

### `EditableTagWidget` extras

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `suggestions` | string[] | `[]` | Names to surface in the "recent" group of the dropdown |
| `onChange` | `(commaJoined: string) => void` | — | Fires when tags are added or removed |
| `disabled` | boolean | `false` | Disables interaction |
| `showManageTags` | boolean | `false` | Renders a "Manage Tags" action in the dropdown footer |
| `onActionButtonClick` | `() => void` | — | Handler for the "Manage Tags" action |
| `width` | string \| number | — | Container width |
| `placeholder` | string | `'Begin typing a tag name'` | Placeholder for the inline input |
| `isPortal` | boolean | `false` | Render the dropdown panel in a portal |

## What changed from `@m-one/tag-widget`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption` | `label` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| Hex literals via inline switch (`'#84f3ff'` → `'teal'`) | `colors.{family}.light` from `@m-next/tokens` | Internal — no API change |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |
| Single d.ts at `src/TagWidget.d.ts` (module-augmentation style) | `src/index.d.ts` exporting named types + components | Internal |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:

- `caption` → `label`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`) accept their prop but have no behavioral effect.

## Accessibility

- The editable widget's underlying `@m-next/dropdown` provides the inline `<input>`. It carries an `aria-label` describing what to type (defaults to "Tag input — type a tag name and press Enter to add"; consumer-supplied `label` overrides).
- Each rendered tag is a `@m-next/pill`. In the read-only widget the pills are passive. In the editable widget the dropdown's multi-select chips include a real `<button>` "remove" affordance with an accessible label.
- `label` is rendered via `@m-next/caption` (real `<label htmlFor>`).

## Tag colour mapping

Upstream tag records carry an arbitrary hex `colour`. The widget maps the known palette to `@m-next/tokens` families:

| Hex | Family |
|-----|--------|
| `#84F3FF` | `teal` |
| `#A9D9BF` | `green` |
| `#FFABB5` | `fuchsia` |
| `#BACAD0` | `grey` |
| `#FFEA80` | `yellow` |
| `#FFACA1` | `red` |
| `#91A2FF` | `purple` |
| `#FFCDAB` | `orange` |
| anything else | `blue` (fallback) |

The lookup table is built from `colors.{family}.light`, so palette tweaks in `@m-next/tokens` flow through automatically.

## Open follow-ups

- `TagWidget.test.jsx` and `__snapshots__/` still reference the legacy `caption` API. Soft-shimming means existing tests still pass, but the snapshots will drift once Caption / Dropdown propagate further cleanup.
- `width` on the editable variant is a Dropdown passthrough — the eventual Dropdown cleanup may rename or remove it.
- Tag colours could move out of a fixed hex-map into a richer `family` enum on the upstream `Tag` type. That would let the widget skip the lookup entirely.
