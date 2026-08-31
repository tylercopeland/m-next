# @m-next/brand

Method-branded assets wrapped as m-next components. Currently ships one component (`MethodLogo`); future variants (icon-only, dark-surface) will be added here.

## Quick start

```jsx
import { MethodLogo } from '@m-next/brand';

<MethodLogo height={20} />
```

Width is derived from the natural aspect ratio of the asset. Pass `height` in most cases — the width handles itself.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `src` | string | white-wordmark URL on Method's CDN | Override to swap variants. |
| `height` | number\|string | `24` | Width derived from natural ratio. |
| `width` | number\|string | auto | Use either `height` or `width`. |
| `ariaLabel` | string | `'Method'` | Label for screen readers. |
| `decorative` | bool | `false` | When true, aria-hidden + role=presentation. |

Plus the standard envelope (forwardRef, ignored ghosts).

## Asset source

The default `src` points at Method's canonical CDN URL. Asset versioning lives on the CDN, not in this package — when Method publishes a new variant or updates the existing one, this component picks it up automatically.

See the Storybook MDX (`stories/methodLogo.mdx`) for the full intent contract and composition examples.
