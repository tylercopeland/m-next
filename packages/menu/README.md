# `@m-next/menu`

Popover menu of actions. Three exports: `MenuList`, `MenuItem`, and `IconMenuList`.
Forked from `@m-one/menu` and normalized to the m-next API conventions.

## Quick start

```jsx
import { MenuList, MenuItem, IconMenuList } from '@m-next/menu';

// Controlled MenuList anchored to a button
const [open, setOpen] = useState(false);
const buttonRef = useRef(null);

<button ref={buttonRef} onClick={() => setOpen(true)}>Actions</button>
<MenuList open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
  <MenuItem onClick={() => doRename()}>Rename</MenuItem>
  <MenuItem onClick={() => doArchive()}>Archive</MenuItem>
  <MenuItem disabled>Delete</MenuItem>
</MenuList>

// Pre-wired icon trigger + menu
<IconMenuList icon="chevron-down-V4" header="Sort by">
  <MenuItem onClick={() => sort('name')}>Name</MenuItem>
  <MenuItem onClick={() => sort('date')}>Date</MenuItem>
</IconMenuList>
```

## Components

### `MenuList`

The popover container. Anchors to an element, renders `MenuItem` children in a
scrollable list (when 10+ items), and handles keyboard navigation.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | boolean | `false` | Controlled open state |
| `onClose` | function | — | Called on outside click, ESC, or item activation |
| `anchorEl` | HTMLElement \| ref \| function | — | Element to position against |
| `id` | string \| number | auto | Optional — auto-generated if omitted |
| `children` | ReactNode | — | `<MenuItem>` children, plus any other ReactNode |
| `width` | string \| number | `'auto'` | Container width |
| `maxHeight` | string \| number | — | When set, enables scrolling beyond this height |
| `header` | string | — | Optional label rendered above items |
| `horizontalAlign` | `'left' \| 'center' \| 'right'` | `'center'` | Popover alignment |
| `inline` | boolean | `false` | Render inline instead of via portal |
| `relativeToParent` | boolean | — | Anchor to closest positioned parent |
| `marginVertical`, `marginHorizontal`, `marginThreshold`, `shiftLeft`, `shiftDown` | number | — | Positioning fine-tuning passed through to `@m-next/popover` |
| `popoverStyle`, `style`, `className` | — | — | Style overrides |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded to the menu Container (`role="menu"`) |

### `MenuItem`

A single, focusable, activatable row.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string \| number | auto | Optional — auto-generated if omitted |
| `children` | ReactNode | — | Item label / content |
| `onClick` | function | — | Activation handler. Fires on mouse click or Enter/Space |
| `selected` | boolean | `false` | Selected styling + `aria-selected` |
| `active` | boolean | `false` | Highlighted styling (alias for selected; both supported) |
| `disabled` | boolean | `false` | Greyed out, not focusable, `aria-disabled` |
| `style`, `className` | — | — | Style overrides |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded to the underlying `role="menuitem"` element |

### `IconMenuList`

A composed trigger + menu — pre-wires an `@m-next/svg-icon` button that opens
a `MenuList` containing the children. Useful for row-level overflow menus.

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `icon` | string | `'chevron-down-V4'` | Icon name (from `@m-next/svg-icon`) |
| `iconSize` | number | `16` | Icon pixel size |
| `iconBorder` | boolean | `false` | Whether the trigger icon shows a border |
| `iconRotation` | string | — | Rotation passed to SvgIcon |
| `color` | string | — | Trigger icon color |
| `open` | boolean | — | Optional controlled open state |
| `onToggle` | function | — | `(open: boolean) => void` — called whenever open state changes |
| `onClose` | function | — | Called when the menu closes |
| `onKeyUp` | function | — | Forwarded to the wrapper |
| `disabled` | boolean | `false` | Disables the trigger |
| `preventAutoClose` | boolean | `false` | When true, outside click / select won't auto-close |
| MenuList passthrough | — | — | `width`, `maxHeight`, `header`, `horizontalAlign`, `inline`, `relativeToParent`, `marginVertical`, `marginHorizontal`, `marginThreshold`, `shiftLeft`, `popoverStyle`, `style`, `className` |
| `ref` | `Ref<HTMLDivElement>` | — | Forwarded to the wrapper |

## What changed from `@m-one/menu`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| Items had `role="menu"` on the trigger wrapper, no `role="menuitem"` on items | `MenuList` → `role="menu"`, each `MenuItem` → `role="menuitem"` | Improved a11y |
| No arrow-key navigation | ArrowUp / ArrowDown / Home / End move focus between items; Enter/Space activate; ESC closes | New behavior |
| Hex literal `colors['grey-lighter']` flat-key lookups | `colors.grey.lighter` via `@m-next/tokens` | Migrated |
| `isV4Design`, `isMobile`, `hidden`, `displayAuto`, `legacyClass`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

The legacy `forwardRef` prop is shimmed — it still works and fires a single
`console.warn` at first use. All "ghost" props (`isV4Design`, etc.) accept their
value but have no effect.

## Accessibility

- `MenuList` renders with `role="menu"`. When a `header` is set, the container
  receives `aria-labelledby` pointing at the header element.
- `MenuItem` renders with `role="menuitem"`, `tabIndex={0}` (or `-1` when
  disabled), `aria-disabled` mirrors the `disabled` prop, and `aria-selected`
  mirrors `selected` / `active`.
- Arrow-key navigation: when the menu opens, focus moves to the first
  non-disabled item. `ArrowDown` / `ArrowUp` move between items (wrapping at
  the ends, skipping disabled). `Home` / `End` jump to the first / last
  focusable item.
- `Enter` and `Space` activate the focused item (fires `onClick`).
- `ESC` closes the menu via `onClose`.
- `IconMenuList`'s trigger icon receives `aria-haspopup="menu"`,
  `aria-expanded`, and `aria-controls` pointing at the menu. Closing returns
  focus to the trigger.

## Open follow-ups

- Tests are not in this package — when added, they should cover the keyboard
  navigation paths and the `forwardRef` shim.
- `MenuList` still depends on `@m-next/popover` for positioning. The popover
  package itself hasn't been cleaned up yet; once it is, this package can drop
  the explicit `marginVertical` / `marginThreshold` props.
