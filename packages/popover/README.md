# `@m-next/popover`

Floating panel anchored to a trigger element. Used for menus, edit panels, contextual pickers, and any UI that opens on click and dismisses on click-outside / ESC.

## Quick start

```jsx
import Popover from '@m-next/popover';

const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

<button ref={(el) => setAnchorEl(el)} onClick={() => setAnchorEl(triggerEl)}>
  Open
</button>

<Popover
  open={open}
  anchorEl={anchorEl}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
>
  <div>Anything you want in the panel.</div>
</Popover>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | boolean | — | Controlled visibility |
| `onClose` | function | — | Called on click-outside or ESC |
| `anchorEl` | HTMLElement \| string \| () => HTMLElement | — | The element the popover positions against |
| `anchorOrigin` | `{ vertical, horizontal }` | `{ top, left }` | Corner of the anchor to attach to |
| `transformOrigin` | `{ vertical, horizontal }` | `{ top, left }` | Corner of the popover that meets `anchorOrigin` |
| `anchorReference` | `'anchorEl' \| 'anchorPosition' \| 'none'` | `'anchorEl'` | Positioning strategy |
| `anchorPosition` | `{ top, left }` | — | Absolute coords when `anchorReference="anchorPosition"` |
| `relativeToParent` | boolean | `false` | Position relative to the offset parent (only with `inline`) |
| `inline` | boolean | `false` | Render in place instead of via portal |
| `width` / `height` | string \| number | `'auto'` / — | Container dimensions |
| `marginThreshold` | number | `16` | Minimum px distance the popover keeps from viewport edges |
| `marginHorizontal` / `marginVertical` | number | `0` | Anchor-relative offset |
| `shiftLeft` / `shiftDown` | number | `0` | Manual offset applied after edge-shifting |
| `skipShifting` | boolean | `false` | Disable auto edge-shifting |
| `closeOnEsc` | boolean | `true` | Whether ESC closes the popover |
| `closeOnOverlayClick` | boolean | `true` | Whether click-outside closes the popover |
| `trapFocus` | boolean | `false` | Opt-in focus trap while open |
| `modal` | boolean | `false` | Adds `role="dialog"` + `aria-modal="true"` |
| `id` | string | auto | Optional; auto-generated when absent |
| `className`, `style` | — | — | Standard React passthroughs |
| `ref` | React ref | — | Forwarded to the popover panel element |

## What changed from `@m-one/popover`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `triggerRef={ref}` | `anchorEl={el}` | Soft shim — warns once, falls back to `triggerRef.current` |
| `disableClickOutside` | `closeOnOverlayClick={false}` | Both work; new API takes precedence |
| `colors['grey-light']` border | `colors.grey.light` from `@m-next/tokens` | Internal rewrite, no API change |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use:
- `forwardRef` prop → React `ref` (chained internally)
- `triggerRef` → `anchorEl`
- `disableClickOutside` still works (`closeOnOverlayClick` is the new name, but both are accepted)

Legacy ghosts (`isV4Design`, etc.) accept their prop but have no behavioral effect.

## Accessibility

Popover is a positioned floating panel. By default it has **no explicit role** — the consumer is responsible for the semantics of the contents (a `<ul role="menu">`, a form, a paragraph of text, etc.).

When `modal={true}` is passed, the popover gets `role="dialog"` + `aria-modal="true"`. Pair with `trapFocus` for full modal-style behaviour.

- `closeOnEsc` (default true): ESC bubbles up from the panel and calls `onClose`.
- `closeOnOverlayClick` (default true): click-outside calls `onClose`.
- `trapFocus` (default false): when enabled, Tab/Shift+Tab cycle within the popover.
- `ref` forwards to the panel container element (the outer `<Container>`), useful for measuring or imperatively focusing it.

## Tokens consumed

- `colors.grey.light` for the 1px border.

## Open follow-ups

- Tests under `src/` still reference the legacy API (no tests in this package today, so nothing breaks).
- The underlying `Container` + `ClickOutside` wiring is preserved as-is. A future pass could replace them with direct DOM + a focus-trap utility, but this is out of Phase 3 scope.
- `inline` mode bypasses the portal; consumers should ensure their layout creates an offset parent when using it.
