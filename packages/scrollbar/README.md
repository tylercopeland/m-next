# @m-next/scrollbar

Themed scroll container. Thin wrapper over [`simplebar-react`](https://github.com/Grsmto/simplebar) with m-next track/thumb styling and an offset-aware height.

Replaces MethodUI's legacy `Scrollbar` (which used `react-custom-scroll`). The SimpleBar dependency is shared with `@m-next/container`, so adding a scrollbar to a page doesn't pull in a second scroll-virtualization library.

## Quick start

```jsx
import { Scrollbar } from '@m-next/scrollbar';

<div style={{ height: 400 }}>
  <Scrollbar offset='56px'>
    <LongList />
  </Scrollbar>
</div>;
```

The `offset` prop reserves vertical space at the top — useful when a fixed header sits above the scrollable region. Internally it becomes `maxHeight: calc(100% - <offset>)`.

## Props

| Prop        | Type                | Default | Notes |
| ----------- | ------------------- | ------- | --- |
| `id`        | `string`            | auto    | Auto-generated as `m-next-scrollbar-N` if not provided. |
| `offset`    | `number \| string`  | —       | Top spacing reserved for a fixed header. `56` → `'56px'`. |
| `isVisible` | `bool`              | `true`  | When false, renders nothing (matches the original API). |
| `maxHeight` | `number \| string`  | —       | Overrides the offset-derived height. |
| `height`    | `number \| string`  | `'100%'`| SimpleBar needs an explicit height to virtualize against. |

## Ref

The `ref` points at the SimpleBar component instance:

```jsx
const ref = useRef(null);
useEffect(() => {
  // recompute scroll geometry after content changes
  ref.current?.recalculate();
  // attach a native scroll listener
  ref.current?.getScrollElement().addEventListener('scroll', onScroll);
}, []);

<Scrollbar ref={ref}>...</Scrollbar>;
```

## What it does NOT do

- Doesn't set its own background or padding — it's a scroll container, not a surface. Wrap with `@m-next/container` for the surface treatment.
- Doesn't auto-detect whether a header exists — the consumer passes `offset` explicitly.
