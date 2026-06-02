# @m-next/carousel

Horizontal slide carousel. Thin wrapper over [react-multi-carousel](https://www.npmjs.com/package/react-multi-carousel) with Method-styled chevron arrows and an optional title.

## Quick start

```jsx
import Carousel from '@m-next/carousel';

<Carousel title='Featured apps'>
  <FeatureCard {...a} />
  <FeatureCard {...b} />
  <FeatureCard {...c} />
</Carousel>;
```

See the Storybook MDX (`stories/carousel.mdx`) for the intent contract and design decisions.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | auto | Outer shell id. Auto-generated as `m-next-carousel-N` when omitted. |
| `children` | `node` | `null` | Slide content. Each child becomes one paged slide. |
| `width` | `string` | `'100%'` | CSS width on the outer shell. |
| `height` | `string` | `'100%'` | CSS height on the outer shell. |
| `title` | `string` | `''` | Optional centered heading above the slides. |
| `sideMarginPX` | `number` | `56` | Horizontal margin (px) applied to each slide's content wrapper. |
| `leftArrow` | `node` | built-in chevron | Override the left arrow button. |
| `rightArrow` | `node` | built-in chevron | Override the right arrow button. |
| `responsive` | `object` | single-item desktop | react-multi-carousel breakpoint map. |
| `itemClass` | `string` | `''` | className applied to each slide item. |
| `containerClass` | `string` | `''` | className applied to the carousel container. |

## What it does NOT do

- Doesn't autoplay — pass a custom wrapper if you need it.
- Doesn't render dots — chevron arrows only.
- Doesn't own slide layout — wrap your own content to control sizing.
- Doesn't replace react-multi-carousel — the underlying dep stays in place.

## Roadmap

- v2: optional dots/pagination, autoplay opt-in, per-slide aria-roledescription.
