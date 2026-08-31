# @m-next/section-header

Title-plus-subtitle stack for grouping form sections, settings panels, or any content block that needs a hierarchy break.

## Quick start

```jsx
import { SectionHeader } from '@m-next/section-header';

<SectionHeader
  title='Billing details'
  subTitle='Used for invoicing and tax purposes.'
/>;
```

Both props are optional. Either can be a plain string or arbitrary `ReactNode` — drop in an inline icon, a help link, or a status badge if you need to.

## Props

| Prop | Type | Description |
|---|---|---|
| `title` | `string \| ReactNode` | Section title. Rendered as an `<h3>` via `@m-next/text as='H3'`. |
| `subTitle` | `string \| ReactNode` | Section subtitle. Rendered as a `<p>` via `@m-next/text`. |
| `id` | `string` | Optional. Auto-generated when omitted. |

Plus the standard m-next legacy envelope: `forwardRef` (soft-shimmed with deprecation warning), and silently-ignored ghosts `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`, `hidden`.

## Intent contract

**SectionHeader is a typography stack, not a layout container.** It owns:

- The visual rhythm — 8px below the title, 16px below the subtitle (preserved from the MethodUI original).
- The semantic level — `<h3>`. Matches the original `<Heading type='h3'>`.
- Auto-IDs and the ref-forwarding envelope all other m-next packages have.

It explicitly does NOT own:

- Section content. Render your form fields, table, or panel as a sibling below it.
- Action affordances (edit/expand buttons). Compose those into a `Stack` next to the header, or pass them as a `ReactNode` into `title`.
- The heading level. v1 is fixed at H3 to preserve the MethodUI behavior; if you need H2 or H4, use `@m-next/text` directly until v2 adds a `level` prop.

## When to reach for SectionHeader

- You're laying out a long form and need to break it into logical sections.
- You're building a settings panel with grouped controls.
- The MethodUI codebase already uses `<SectionHeader />` and you're porting that screen — drop-in replacement.

If you need a top-of-page page header with breadcrumb + actions, use a layout-level component instead.

## Roadmap

- v2: `level` prop (`h2` | `h3` | `h4`) so subsections can carry the right semantic depth.
- v2: optional `actions` slot for trailing buttons.
