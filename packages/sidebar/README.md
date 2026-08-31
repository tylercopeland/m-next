# @m-next/sidebar

Vertical app navigation shell. Compound-component API — the consumer composes the shell with `Sidebar.Header`, `Sidebar.Body`, `Sidebar.Group`, `Sidebar.Item`, and `Sidebar.Footer` rather than passing data arrays.

## Quick start

```jsx
import { Sidebar } from '@m-next/sidebar';

<Sidebar isOpen={open}>
  <Sidebar.Header>
    <Logo />
  </Sidebar.Header>

  <Sidebar.Body>
    <Sidebar.Group title="Workspace">
      <Sidebar.Item icon={<DashboardIcon />} active onClick={goToDashboard}>
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item icon={<CustomersIcon />} onClick={goToCustomers}>
        Customers
      </Sidebar.Item>
      <Sidebar.Item icon={<PaymentsIcon />} badge="3" onClick={goToPayments}>
        Payments
      </Sidebar.Item>
    </Sidebar.Group>

    <Sidebar.Group title="Tools" collapsible defaultExpanded={false}>
      <Sidebar.Item icon={<BuilderIcon />}>App Builder</Sidebar.Item>
    </Sidebar.Group>
  </Sidebar.Body>

  <Sidebar.Footer>
    <UserMenu />
  </Sidebar.Footer>
</Sidebar>;
```

See the Storybook MDX (`stories/sidebar.mdx`) for the intent contract and design decisions.

## Sub-components

| Export | What it is |
|---|---|
| `Sidebar` (default) | Root `<aside>` shell. Controls width, open/closed state, surface chrome. |
| `Sidebar.Header` | Slot above the body. Logo, brand, search, etc. |
| `Sidebar.Body` | Scrollable middle slot. Holds groups and items. |
| `Sidebar.Group` | Optional titled section. `collapsible` for expand/collapse. |
| `Sidebar.Item` | Clickable row. Defaults to `<button>`; pass `as='a'` or `href` for links. |
| `Sidebar.Footer` | Slot below the body. User menu, version string, theme switcher. |

All sub-components are also available as named exports: `import { Header, Body, Group, Item, Footer } from '@m-next/sidebar';`.

## What it does NOT do

- Doesn't own routing — wire `Item`'s `onClick` or `href` to your router.
- Doesn't own open/close state — pass `isOpen` from the consumer.
- Doesn't auto-collapse on small viewports in v1 — defer to consumer media queries.
- Doesn't persist open state between sessions — caller's concern.

## Roadmap

- v2: built-in collapse handle, mobile-responsive drawer mode, dark theme.
