# `@m-next/svg-icon` (Icon)

Renders an icon from Method's curated icon set as an inline SVG.

> **Naming:** the cleaned API is `Icon`. The historical `SvgIcon` name and
> default export are preserved for backwards compatibility — both names point
> to the same component. New code should prefer `import { Icon } from '@m-next/svg-icon'`.

## Quick start

```jsx
import { Icon } from '@m-next/svg-icon';

// Decorative — paired with a text label, hidden from screen readers
<Icon name="search" size={16} decorative />

// Meaningful — supplies its own accessible name
<Icon name="warning-sign" size={20} label="Action required" />

// Tinted with a token color
import { colors } from '@m-next/tokens';
<Icon name="check-circle" size={16} color={colors.green.base} label="Saved" />
```

The default export still works for existing call sites:

```jsx
import { SvgIcon } from '@m-next/svg-icon';
<SvgIcon name="dashboard" size={24} />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `SvgIconName` | — | Icon name from the curated catalog (see icon list story) |
| `size` | number | — | Pixel size used for width and height |
| `color` | string | `'currentColor'` | Fill color. Pass a `@m-next/tokens.colors.*` value or any CSS color |
| `hoverColor` | string | `'currentColor'` | Fill color on hover |
| `label` | string | — | Accessible name. Sets `role="img"` + `aria-label` on the SVG |
| `decorative` | boolean | `false` | When true, sets `aria-hidden="true"` and omits the label — for icons paired with adjacent text |
| `caption` | string | — | Adds an SVG `<title>` element. Falls back as the accessible name when `label` is not set |
| `onClick` | function | — | Makes the icon focusable + keyboard-activatable (Enter / Space) |
| `disabled` | boolean | `false` | Visually dims the icon and disables click/keyboard activation |
| `tabIndex` | number | — | Defaults to `0` when `onClick` is set |
| `id` | string | auto | Auto-generated if omitted |
| `testId` | string | — | Prefix for `data-testid` on wrapper / SVG |
| `viewBox` | string | `'0 0 1024 1024'` | Override the SVG viewBox if needed |
| `stroke`, `strokeWidth` | string | — | Forward stroke styling to the underlying `<path>` |
| `offsetX`, `offsetY` | number | `0` | Translates the icon within its wrapper |
| `rotate` | string | — | CSS transform fragment, e.g. `'transform: rotate(90deg);'` |
| `border` | boolean | `false` | Adds a 1px rounded border around the icon |
| `isRound` | boolean | `false` | Renders as a circular badge |
| `backgroundColor`, `backgroundHoverColor` | string | — | Wrapper background colors |
| `tooltip`, `tooltipId` | string | — | `data-tooltip-html` / `data-tooltip-id` for react-tooltip |
| `title` | string | — | Native HTML title attribute on the wrapper |
| `className`, `style` | string / object | — | Pass-through to the outer wrapper |
| `children` | ReactNode | — | Custom content rendered instead of the SVG (rare) |
| `ref` | ref | — | Forwarded to the outer wrapper `<div>` |
| `iconRef` | ref | — | Legacy ref to the outer wrapper (kept for compatibility) |

## What changed from `@m-one/svg-icon`

| Was | Now | Status |
|-----|-----|--------|
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `id` required | optional — auto-generated if absent | Backwards-compatible |
| `aria-label` always derived from `name` | `label` / `decorative` props control a11y semantics | Backwards-compatible default preserved |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |

## Accessibility

Icons fall into one of three categories:

1. **Decorative** — paired with a visible text label (e.g. inside a button with text). Pass `decorative` so the SVG is `aria-hidden`.
2. **Meaningful, standalone** — the icon is the only label. Pass `label="…"` so the SVG gets `role="img"` + `aria-label`.
3. **Legacy** — when neither `label` nor `decorative` is set, the component derives an aria-label from the icon `name` for backwards compatibility. Prefer the explicit forms going forward.

When `onClick` is set, the wrapper becomes keyboard-activatable on Enter / Space and defaults `tabIndex` to `0`.

## Tokens consumed

- `colors.grey.light` for the `border` outline
- `lightTheme.content.secondary` (from `@m-next/styles`) for the focus ring

Pass `colors.*` from `@m-next/tokens` for `color` / `hoverColor` to stay on palette.

## Notes

- The default export is `SvgIcon` and remains unchanged — Button, Input, Caption, Banner, Dialog, Drawer, FormField, RadioGroup, Select, and other internal consumers continue to work without modification.
- `LegacyIcons.ts` contains the historical name → component map and is part of the icon catalog, not the API surface.
