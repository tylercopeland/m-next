# @m-next/app-bar

Horizontal top chrome for an app shell. Compound-component API — the consumer composes the bar with `AppBar.Start`, `AppBar.Center`, and `AppBar.End`.

## Quick start

```jsx
import { AppBar } from '@m-next/app-bar';

<AppBar sticky>
  <AppBar.Start>
    <IconButton icon="menu" onClick={toggleSidebar} aria-label="Toggle sidebar" />
    <Logo />
  </AppBar.Start>

  <AppBar.Center>
    <SearchInput placeholder="Search…" value={q} onChange={setQ} />
  </AppBar.Center>

  <AppBar.End>
    <IconButton icon="help" aria-label="Help" />
    <IconButton icon="bell" aria-label="Notifications" />
    <UserAvatar onClick={openUserMenu} />
  </AppBar.End>
</AppBar>;
```

See the Storybook MDX (`stories/appBar.mdx`) for the intent contract and design decisions.

## Slot semantics

| Slot | Flex behavior | Typical content |
|---|---|---|
| `AppBar.Start` | flex-shrink: 0 | Logo, sidebar-toggle, breadcrumbs |
| `AppBar.Center` | flex: 1, min-width: 0 | Search, page title, tab strip |
| `AppBar.End` | margin-left: auto, flex-shrink: 0 | Help, notifications, user menu |

## Props

- `height` (default `56`) — bar height in px.
- `borderless` — omit the bottom border.
- `sticky` — pin to viewport top with `position: sticky; z-index: 10`.
- `ariaLabel` (default `'Top navigation'`) — landmark label.

## Pairs with

[@m-next/sidebar](../sidebar) for the full app-shell pattern.
