# `@m-next/tokens`

Design tokens for the m-next system. Single source of truth for spacing, radius, elevation, layering, motion, and typography scales.

## What's here

| Scale | Keys | Values |
|-------|------|--------|
| `spacing` | none, xs, sm, md, lg, xl, 2xl, 3xl | 0, 4, 8, 12, 16, 24, 32, 48 (px) |
| `radius` | none, sm, md, lg, xl, full | 0, 2, 4, 8, 12, 9999 (px) |
| `shadow` | none, sm, md, lg, xl | progressive elevation strings |
| `zIndex` | base, dropdown, sticky, modal, popover, toast | 0, 1000, 1100, 1300, 1400, 1500 |
| `transition` | fast, normal, slow | 150ms, 200ms, 300ms |
| `lineHeight` | tight, normal, relaxed | 1.25, 1.5, 1.75 |
| `fontWeight` | normal, medium, semibold, bold | 400, 500, 600, 700 |

## Usage

```js
import { spacing, radius, shadow } from '@m-next/tokens';

const styles = {
  padding: spacing.md,
  borderRadius: radius.lg,
  boxShadow: shadow.md,
};
```

Or pull the whole set:

```js
import tokens from '@m-next/tokens';
tokens.spacing.md; // 12
```

## CSS variables

The package also ships a CSS-variable representation for non-JS consumers (vanilla CSS, Storybook docs, Figma sync):

```js
import { cssVariables } from '@m-next/tokens';

// cssVariables is a string:
// :root {
//   --space-md: 12px;
//   --radius-lg: 8px;
//   ...
// }
```

Inject once into the document root, then reference as `var(--space-md)` from any stylesheet.

## Scope

Colors and typography (sizes, families) live in `@m-next/styles` for now. This package covers the scales m-one historically lacked. A follow-up will fold `@m-next/styles` content into this package once the API normalization work in Phase 3 settles.
