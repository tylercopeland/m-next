# `@m-next/tabs`

Horizontal tab navigation. A controlled tab bar plus a panel slot. Includes overflow handling (a More-menu when tabs don't fit), optional drag reordering, and full keyboard navigation.

## Quick start

```jsx
import Tabs from '@m-next/tabs';

const tabList = [
  { id: 'data', caption: 'Data' },
  { id: 'display', caption: 'Display' },
  { id: 'formatting', caption: 'Formatting' },
];

const [active, setActive] = useState('data');

<Tabs
  tabList={tabList}
  selectedTab={active}
  onChange={(id) => setActive(id)}
  onRenderTabContent={() => <Panel for={active} />}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto | Optional. Used to namespace tab and panel ids for ARIA wiring. |
| `tabList` | `{ id, caption, disabled? }[]` | — | Tab descriptors. Order = display order. |
| `selectedTab` | string | — | Id of the active tab. Component is controlled. |
| `onChange` | `(id, index, e) => void` | — | Fired on click or keyboard activation. |
| `onRenderTabContent` | `() => ReactNode` | — | Render-prop for the panel. |
| `onRenderTabHeader` | `(tab, refreshId) => ReactNode` | — | Custom rendering for each tab button. |
| `onRenderTabHeaderMenuItem` | `(tab, refreshId) => ReactNode` | — | Custom rendering for entries in the More-menu. |
| `onRenderTabHeaderRightIcon` | `() => ReactNode` | — | Optional right-aligned action area. |
| `onTabOrderChange` | `(newTabs, src, dest) => void` | — | When provided, tabs are drag-reorderable. |
| `refreshId` | number | `0` | Bump to force re-measure / re-call render-props. |
| `width` | string | `'100%'` | CSS width on the outer container. |
| `containerMargin` | string | — | CSS margin on the outer container. |
| `tabPadding` | number | `0` | Extra px padding used in overflow width calculation. |
| `borderless` | boolean | `false` | Remove the panel's 1px border. |
| `dyanmicHeight` | boolean | `false` | Let the panel shrink to its content (no min-height). |
| `fullHeight` | boolean | `false` | Container fills 100% height. |
| `calMenuHeight` | boolean | `false` | Panel height `calc(100% - 65px)` — calendar-menu special case. |
| `fullWidthTabs` | boolean | `false` | Distribute tabs evenly across the bar. No More-menu in this mode. |
| `legacyPadding` | boolean | `false` | Older padding rules for the More-menu dropdown. |
| `contentStyle`, `headerStyle`, `containerStyle` | object | — | Style overrides for panel / header / container. |
| `ref` | ref | — | Forwarded to the outer container `<div>`. |

## Accessibility

The tab bar is wired with the ARIA tabs pattern:

- The header container is `role="tablist"`.
- Each tab button is `role="tab"` with `aria-selected`, `aria-controls`, and `aria-disabled` set appropriately.
- The active tab panel is `role="tabpanel"` with `aria-labelledby` pointing back at the active tab button.
- Roving `tabIndex`: only the active tab is in the tab order; arrow keys move focus / selection between tabs.

### Keyboard

| Key | Action |
|-----|--------|
| Left / Up | Move to previous tab (wraps through the More-menu when present). |
| Right / Down | Move to next tab. |
| Home | Jump to first tab. |
| End | Jump to last tab (or open the More-menu and focus its last entry). |
| Enter / Space | Activate the focused tab (used to select a More-menu entry). |

## What changed from `@m-one/tabs`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `role="option"` on tab buttons | `role="tab"` + proper `aria-controls` / `aria-selected` / `tablist` / `tabpanel` | Accessibility fix — old DOM contract broken intentionally |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isMobile` toggled a separate mobile render branch | — | Silently ignored. Use CSS media queries or a separate mobile component. |
| `onRenderTabHeaderMobile` | — | Silently ignored (paired with `isMobile`). |
| `isV4Design`, `legacyClass`, `displayAuto` | — | Silently ignored. |

The mobile render branch (`isMobile={true}` → ribbon-style list with no More-menu) was removed because it had no API parity with desktop tabs (no overflow handling, no keyboard support) and was actively interfering with the ARIA cleanup. If you need a mobile variant, render a different control beneath a media query.

## Tokens consumed

- `@m-next/tokens.colors.grey.lighter` — More-menu hover background, drag preview background
- `@m-next/tokens.colors.grey.light` — drag placeholder background
- `@m-next/tokens.colors.grey.darkest` — fallback disabled text color
- `@m-next/tokens.colors.white` — More-menu surface
- Theme context (via Emotion) for `theme.content.*` and `theme.background.*` — picks up the active named theme via `@m-next/theme`'s `<ThemeProvider>`. Falls back to `lightTheme` from `@m-next/styles`.

## Open follow-ups

- Tests do not yet exist for tabs; the package has been on `--passWithNoTests` since the original fork.
- `@m-next/tabs-v2` is a separate, architecturally-different rewrite. Merging it with this package is out of scope for the Phase 3 API cleanup.
- `react-beautiful-dnd` is unmaintained. Replacement is out of scope for this pass.
- The legacy `dyanmicHeight` typo is preserved as the public prop name for backwards compatibility — fix it in a future major.
