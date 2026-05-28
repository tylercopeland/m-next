# `@m-next/bread-crumbs`

Breadcrumbs — an accessible navigation trail showing the user's path through a hierarchy, with an optional kebab overflow menu.

> Package name keeps its legacy form (`@m-next/bread-crumbs`) so existing imports continue to work. The cleaned-up canonical name is **`Breadcrumbs`**, exported as a named export. The pre-existing `BreadCrumbsHeader` default export is unchanged.

## Quick start

```jsx
// New canonical import
import { Breadcrumbs } from '@m-next/bread-crumbs';

// Existing imports keep working
import BreadCrumbsHeader from '@m-next/bread-crumbs';

const crumbs = [
  { id: 'home', label: 'Home', onClick: () => navigate('/') },
  { id: 'customers', label: 'Customers', onClick: () => navigate('/customers') },
  { id: 'acme', label: 'Acme Corp' }, // last item = current page
];

<Breadcrumbs crumbs={crumbs} />;
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `crumbs` | `{ id, label, onClick?, tooltip? }[]` | `[]` | Last item is rendered as `aria-current="page"` |
| `showMenu` | boolean | `false` | Renders the trailing kebab overflow menu |
| `menuItems` | `{ id, label, onClick }[]` | `[]` | Items shown inside the overflow menu |
| `iconName` | string | `'screens-V4'` | Leading icon |
| `tooltipId` | string | — | Shared tooltip portal id |
| `aria-label` | string | `'Breadcrumbs'` | Accessible name of the `<nav>` landmark |
| `id` | string | auto | Container id — auto-generated if absent |
| `style`, `className` | — | — | Container overrides |
| `ref` | ref | — | Forwarded to the `<nav>` element |

## What changed from `@m-one/bread-crumbs`

> **Heads up:** the package name and the default export `BreadCrumbsHeader` are intentionally preserved — see the note at the top. The audit's `BreadCrumbsHeader → Breadcrumbs` rename is delivered via the **`Breadcrumbs`** named export alias.

| Was | Now | Status |
|-----|-----|--------|
| `BreadCrumbsHeader` (only export) | `Breadcrumbs` named export (canonical) + `BreadCrumbsHeader` default still exported | Additive — no break |
| `id` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `ariaLabel` (camelCase) | `aria-label` (standard React attr) | Soft shim — warns once |
| No nav landmark | Renders as a `<nav aria-label="Breadcrumbs">` with an `<ol>` of crumbs | Accessibility fix |
| `aria-current` partially wired | Last crumb always has `aria-current="page"` | Accessibility fix |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` on first use. The shim translates:
- `forwardRef` prop → chained with the React `ref`
- `ariaLabel` → `aria-label`

Legacy ghosts (`isV4Design`, `isMobile`, etc.) accept their prop but have no behavioral effect — V4 styling is always on.

## Accessibility

- Renders a real `<nav>` landmark with `aria-label="Breadcrumbs"` (override via `aria-label`).
- Crumbs are rendered as an ordered list (`<ol>` / `<li>`) — assistive tech announces position-in-trail.
- The last crumb carries `aria-current="page"`.
- Separator `/` characters are `aria-hidden="true"` so they're not announced.
- Pass-through `aria-*` attributes are spread onto the `<nav>`.

## Tokens consumed

Colors come from `theme.content.*` (active named theme via `<ThemeProvider>` from `@m-next/theme`) with a fallback to `lightTheme` from `@m-next/styles`. The local emotion styles use no hardcoded color literals.

## Open follow-ups

- `BreadCrumbsHeader.test.jsx` and the existing snapshot still reference the pre-cleanup DOM (a `<div>` of `<div>`s rather than the new `<nav>` / `<ol>` / `<li>`). They will fail until rewritten — same situation as Button and Input.
- The leading `screens-V4` icon name is V4-themed; longer term it likely becomes a slot (consumer-supplied React node) rather than an icon name string.
