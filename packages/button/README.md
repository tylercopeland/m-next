# `@m-next/button`

Button component. Forked from `@m-one/button` and normalized to the m-next API conventions.

## Quick start

```jsx
import Button from '@m-next/button';

<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" leftIcon={<TrashIcon />}>Delete</Button>
<Button variant="link">Learn more</Button>
<Button size="sm">Small</Button>
<Button size="lg" fullWidth>Big primary CTA</Button>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | ReactNode | — | Button content |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'link'` | `'primary'` | Visual treatment |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24 / 32 / 40 px height |
| `leftIcon` | ReactNode | — | Icon before children |
| `rightIcon` | ReactNode | — | Icon after children |
| `fullWidth` | boolean | `false` | Fill container width |
| `disabled` | boolean | `false` | Sets `disabled` + `aria-disabled` |
| `type` | string | `'button'` | Native button type |
| `onClick` | function | — | Click handler |
| `ref` | ref | — | Forwarded to the `<button>` element |
| Any `aria-*`, `data-*`, native button attrs | — | — | Spread to root |

## What changed from `@m-one/button`

This is the first component cleaned up under the m-next API normalization. Migration is mostly mechanical:

| Was | Now | Status |
|-----|-----|--------|
| `value="Save"` | `<Button>Save</Button>` | Soft shim — warns once |
| `buttonStyle="primary"` | `variant="primary"` | Soft shim — warns once |
| `buttonStyle="plain"` | `variant="ghost"` | Soft shim — merged |
| `buttonStyle="radio"` / `"radio-selected"` | n/a — use a SegmentedControl | Hard break |
| `size="small"` / `"medium"` | `size="sm"` / `"md"` | Soft shim — warns once |
| `icon={{ name, size, color, position }}` | `leftIcon={<Icon/>}` or `rightIcon` | Soft shim — translates via `@m-next/svg-icon` |
| `forwardRef={...}` prop | React `ref={...}` (forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `visible`, `classes`, `widthType`, `width` | n/a | Silently ignored |
| `isDangerous` + `dangerouslySetInnerHTML` | n/a — pass ReactNode children | **Hard break (security)** |
| `tooltip` / `tooltipId` | Wrap with `<Tooltip>` from `@m-next/tooltip` | **Hard break (composition)** |
| `backgroundColor` / `borderColor` / `borderRadius` / `fontSize` / `color` props | Use `variant` or `style={{ ... }}` | **Hard break (use the variant system)** |
| Zero ARIA support | `aria-*` props pass through; `aria-disabled` mirrors `disabled` | Fixed |

## Backwards compatibility

Old prop names still work with a single `console.warn` at first use. The shim translates:

- `value` → `children`
- `buttonStyle` → `variant` (with `plain` → `ghost`, `v4-primary` → `primary`)
- `size: 'small' \| 'medium'` → `'sm' \| 'md'`
- `icon: { name, size, color, position }` → `leftIcon` / `rightIcon` rendered with `@m-next/svg-icon`
- `forwardRef` prop → standard React `ref`

Hard-broken props (`isDangerous`, `tooltip`, per-prop color overrides) still warn so you know they were used, but render no special behavior. Migrate as flagged.

## Accessibility

- The root is a real `<button>` element with native keyboard semantics.
- All `aria-*` and `data-*` attributes spread to the root, so `aria-label`, `aria-pressed`, `aria-expanded` work as expected.
- `disabled` automatically sets `aria-disabled`.
- Focus ring on keyboard focus only (`:focus-visible`), 2px outline at 2px offset.

## Open follow-ups

- `button.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — flagged as a separate task.
- A `destructive` variant (red primary) is not in this pass. Add when the first consumer needs it.
