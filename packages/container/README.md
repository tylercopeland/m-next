# `@m-next/container`

Surface wrapper. Renders a padded `<div>` with optional border-radius, shadow, hover styling, scroll behavior, and a skeleton loading state. The base surface used by Card, ContentCard, InsightCard, and any panel that needs the m-next surface treatment.

Exports two components:
- **`Container`** (default) — the surface wrapper.
- **`InfiniteScrollContainer`** (named) — same surface, plus an IntersectionObserver-driven `fetchData` callback when the bottom-of-list sentinel becomes visible.

## Quick start

```jsx
import Container, { InfiniteScrollContainer } from '@m-next/container';

<Container>
  <p>Hello surface.</p>
</Container>

<Container isLoading width="320px" height="240px">
  {/* renders LoadingSkeleton placeholder */}
</Container>

<Container scrollable height="400px" onScroll={(e) => console.log(e)}>
  <LongList />
</Container>

<InfiniteScrollContainer height="400px" fetchData={loadNextPage}>
  {records.map((r) => <Card key={r.id} data={r} />)}
</InfiniteScrollContainer>

<Container ref={containerRef}>…</Container>
```

## API — Container

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | ReactNode | — | Content inside the surface |
| `isVisible` | boolean | `true` | When `false`, `display: none` |
| `isLoading` | boolean | `false` | Renders a single `LoadingSkeleton` placeholder unless `hasChildLoading` is set |
| `hasChildLoading` | boolean | `false` | The children own their loading state — Container skips its own skeleton |
| `width` | string \| number | `'100%'` | Surface width |
| `height` | string \| number | `'unset'` | Surface height |
| `maxHeight` | string \| number | — | Max height for the surface (also passes to SimpleBar when `scrollable`) |
| `padding` | string \| number | `'16px'` | Internal padding (any non-null override wins) |
| `isRound` | boolean | `true` | 4px border-radius |
| `borderless` | boolean | `true` | Hides the elevation shadow; `false` enables `0px 2px 4px rgba(0,0,0,0.1)` |
| `scrollable` | boolean | `false` | Wraps content in a `simplebar-react` scroll container |
| `scrollableRef` | ref | — | External ref for the SimpleBar instance (use for programmatic recalculate / scroll) |
| `onClick` | function | — | Click handler; cursor flips to `pointer`. Enter-key activation is wired automatically |
| `onMouseEnter`, `onMouseLeave` | function | — | Standard mouse handlers (works with `hoverStyle`) |
| `onScroll` | function | — | Scroll handler — only fires when `scrollable` is true (bound to SimpleBar's scroll element) |
| `hoverStyle` | object | — | CSS styles applied on `:hover` |
| `style` | object | — | Style overrides for the surface element |
| `className` | string | — | className override |
| `id` | string | auto | Auto-generated if omitted |
| `ref` | ref | — | Forwarded to the underlying surface `<div>` |

## API — InfiniteScrollContainer

Same surface props as Container (minus `scrollable` / `scrollableRef` / `onScroll` / `isRound` / `borderless` — the scroll behavior is built in and the surface is forced to `borderless` `isRound={false}`), plus:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `fetchData` | function | — | Called when an IntersectionObserver sentinel at the bottom of the scroll area becomes fully visible |
| `error` | string | — | When set, rendered as `Error: {error}` below the content |
| `scrollRef` | ref | — | Passed to SimpleBar's `scrollableNodeProps.ref` so the consumer can read/set scroll position |
| `tabIndex` | number | — | Applied to the SimpleBar wrapper and the inner surface |

## What changed from `@m-one/container`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`, `hidden` | — | Silently ignored |

Both `Container` and `InfiniteScrollContainer` now use `React.forwardRef`. The legacy `forwardRef` prop still works (chained with the React `ref`) and fires one `console.warn` at first use.

Note: `@m-next/loading-skeleton`, `simplebar-react`, and the underlying Emotion theme (`@m-next/styles`) are unchanged. Visual output is identical to the pre-cleanup version — this pass is API-surface only.

## Backwards compatibility

- `forwardRef` prop works; one `console.warn` at first use; chained with the React `ref`.
- Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`, `hidden`) accept their value but have no behavioral effect.

## Accessibility

- The Container root is a `<div>` — no implicit `role`. When `onClick` is set, Container wires `onKeyDown` for Enter activation but does **not** add `tabIndex` or `role` — callers should add `role="button"` + `tabIndex={0}` (or wrap in a `<Link>`) for keyboard reachability.
- `isVisible={false}` uses `display: none` (no extra ARIA — the element is removed from the AOM as well).
- Scrollable mode uses `simplebar-react`, which paints custom scrollbar visuals on top of native overflow. Keyboard scrolling still works natively.

## Open follow-ups

- `container.test.jsx` and `__snapshots__/` reference the legacy API and will need updating in the test-cleanup pass (same situation as Button / Input / Card).
- `@m-next/styles` is still the source of `lightTheme.background.primary` for the surface fallback color — that's a deeper @m-next/styles cleanup pass, not a Container API change.
