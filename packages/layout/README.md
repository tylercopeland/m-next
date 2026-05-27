# `@m-next/layout`

Layout primitives. The missing layer between m-next's components and raw CSS — spacing-aware, token-driven, and unopinionated about visual style.

## Why it exists

The audit found that m-next has no layout layer. Every screen reaches for hand-rolled `<div>` plus inline styles or Emotion blocks, which means spacing drifts on every screen. These primitives fix that: a handful of components that compose to anything, all driven by `@m-next/tokens`.

## Components

| Component | Use for |
|-----------|---------|
| `Box` | Padding, margin, sizing, background — the everyday container. |
| `Stack` | Vertical stack with gap. Default for most page sections. |
| `Inline` | Horizontal row with gap. Default for toolbars, button groups, label+control. |
| `Flex` | Less opinionated than Stack/Inline — explicit `direction`, `align`, `justify`, `wrap`. Reach for this only when Stack/Inline don't fit. |
| `Divider` | Horizontal or vertical separator. Spacing-aware. |

## Spacing values

All space props (`padding`, `margin`, `gap`, `Divider.spacing`) accept:

- A spacing token: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'` → resolves to px from `@m-next/tokens.spacing`
- A raw number: `16` → `'16px'`
- A raw string: `'16px'` or `'1rem'` → passed through unchanged

## Quick start

```jsx
import { Stack, Inline, Box, Divider } from '@m-next/layout';

const Page = () => (
  <Stack gap="lg" padding="xl">
    <Inline gap="sm" align="center" justify="spaceBetween">
      <h1>Invoices</h1>
      <Inline gap="xs">
        <button>Filter</button>
        <button>New invoice</button>
      </Inline>
    </Inline>

    <Divider spacing="md" />

    <Box background="#fff" padding="lg" borderTop>
      Content
    </Box>
  </Stack>
);
```

## API

### `<Box>`

The universal container. Use it directly for surfaces or as the base for any layout that doesn't fit Stack/Inline/Flex.

| Prop | Type | Notes |
|------|------|-------|
| `as` | element tag | Default `'div'`. Use `as="section"`, `as="aside"`, etc. for semantics. |
| `padding`, `paddingX`, `paddingY`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` | space value | Specific sides override compound props. |
| `margin`, `marginX`, `marginY`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft` | space value | Same precedence as padding. |
| `width`, `height`, `maxWidth`, `maxHeight`, `minWidth`, `minHeight` | space value or string | Numbers/tokens → px. Strings (`'100%'`, `'24rem'`) pass through. |
| `background` | string | Any valid CSS background. |
| `borderTop`, `borderBottom` | boolean | When true, adds `1px solid {borderColor}`. |
| `borderColor` | string | Default `#E0E0E0`. |
| `overflow`, `display` | string | Plain CSS values. |
| `style` | object | Escape hatch — merges last. |

### `<Stack>` / `<Inline>` / `<Flex>`

| Prop | `Stack` | `Inline` | `Flex` |
|------|---------|----------|--------|
| `gap` | ✓ (default `'md'`) | ✓ (default `'md'`) | optional |
| `align` | start \| center \| end \| stretch (default `'stretch'`) | start \| center \| end \| stretch \| baseline (default `'center'`) | optional |
| `justify` | — | start \| center \| end \| spaceBetween \| spaceAround (default `'start'`) | optional |
| `wrap` | — | boolean (default `false`) | boolean |
| `direction` | column (locked) | row (locked) | row \| column \| rowReverse \| columnReverse (default `'row'`) |

All three also accept every `<Box>` prop (passed through).

### `<Divider>`

| Prop | Type | Default |
|------|------|---------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` |
| `color` | string | `'#E5E7EB'` |
| `spacing` | space value | `'md'` (margin around the rule) |
| `size` | number | `1` (border thickness in px) |

Renders as `<div role="separator" aria-orientation>` — screen-reader friendly by default.

## Notes

- All primitives use inline `style` — no Emotion CSS-in-JS overhead, no class-name collisions. Cheaper to render and easier to inspect in devtools.
- `Stack` and `Inline` are deliberate. `Flex` is the escape hatch — most screens should never need it. If you find yourself reaching for `Flex` often, the project might be missing a more specific primitive.
- Promoted from the kit prototype's `_layout/` work. Notable changes: `space` prop → `gap`, dropped MethodUI dependency in `Divider`.
