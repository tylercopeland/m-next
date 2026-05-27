# `@m-next/card`

Record-display card. An avatar slot plus up to two columns of formatted field/value pairs — used in list views, search results, and other compact summaries of a single record.

## Quick start

```jsx
import Card from '@m-next/card';

<Card
  hasAvatar
  avatar="https://…/jane.jpg"
  field1={{ name: 'FullName', caption: 'Name', type: 'Text' }}
  field4={{ name: 'Email',    caption: 'Email', type: 'Email' }}
  field5={{ name: 'BirthDate', caption: 'Birth Date', type: 'DateTime' }}
  data={{ FullName: 'Jane Smith', Email: 'jane@example.com', BirthDate: '2021-04-12T08:56:39' }}
  onClick={() => openRecord(record.id)}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `data` | object | `null` | Record object. Field values resolved by `data[field.name]` |
| `field1` … `field6` | `Field` | `null` | Field descriptors — first three go in column 1, next three in column 2 |
| `hasAvatar` | boolean | `false` | Render an Image slot on the left |
| `avatar` | string | `null` | Image source / record-image token |
| `size` | `'small' \| 'medium'` | `'medium'` | Compact (`small`) or default (`medium`) layout |
| `displayPreferences` | object | — | Backend display prefs (date / number / money) — passed to `@m-next/utilities`'s formatter |
| `tagsList` | array | — | Used when a field has `type: 'Tags'` |
| `isLoading` | boolean | `false` | Renders skeleton lines |
| `showLabels` | boolean | `false` | Prefix each line with `field.caption: ` |
| `hideEmptyFields` | boolean | `false` | Collapse trailing empty rows; render placeholders for unmapped fields in visible rows |
| `tooltipId` | string | — | Tooltip id used by `@m-next/typeography` ellipsis detection |
| `onClick` | function | — | Card-level click handler |
| `style` | object | — | Style overrides for the outer container |
| `ref` | ref | — | Forwarded to the container element |

## Field layout

The six `fieldN` slots map to a 3×2 grid:

```
field1 │ field4   ← header row (bold, larger)
field2 │ field5
field3 │ field6
```

When `size="small"`, the entire card uses a smaller font scale. When `hideEmptyFields={true}`, the layout switches to a more compact "grid" treatment for embedded use in Grid widgets.

## What changed from `@m-one/card`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`, `hidden` | — | Silently ignored |

The internal `<Image isV4Design />` usage is unchanged — that's a downstream legacy flag on `@m-next/image`, not a Card prop.

## Backwards compatibility

- Legacy `forwardRef` prop still works; it fires one `console.warn` at first use and is chained with the React `ref`.
- Legacy ghosts (`isV4Design`, `isMobile`, etc.) accept their value but have no behavioral effect.
- `isMobile` previously set extra horizontal padding (`0px 8px`). That padding is gone — use `style={{ padding }}` if you need a mobile-specific override.

## Accessibility

- The Card root is a Container `<div>`. When `onClick` is set, the consumer is responsible for keyboard activation (Container handles role/tabIndex) — there's no built-in `<button>` or `<a>` semantic. For navigable cards, wrap in a `<Link>` or pass through `role="button"` + `tabIndex={0}`.
- Each field line renders ellipsed text with a tooltip when truncated.

## Open follow-ups

- `Card.test.jsx` and `__snapshots__/` reference the legacy API and will need updating in the test-cleanup pass (same situation as Button / Input).
- `@m-next/container` still uses its own legacy `forwardRef` prop pattern internally — cleaning Container is a later pass.
- `CardLine.jsx` reads `@m-next/types` `FieldTypeNames` directly; the field-shape contract belongs to `@m-next/types` and is left untouched here.
- `@m-next/content-card` and `@m-next/insight-card` are separate packages with their own cleanup passes (the audit calls out `ContentCard → ActionCard` rename — that lives in `content-card`, not here).
