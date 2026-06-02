# @m-next/accordion

Progressive-disclosure container with a compound-component API. Use for settings panels, FAQ-style lists, nested option groups, or any place where stacked content needs to expand and collapse independently.

## Quick start

```jsx
import Accordion from '@m-next/accordion';

<Accordion allowMultiple defaultExpanded={['general']}>
  <Accordion.Item id='general' title='General settings'>
    <p>Workspace name, timezone, locale.</p>
  </Accordion.Item>
  <Accordion.Item id='security' title='Security'>
    <p>2FA, session length, single sign-on.</p>
  </Accordion.Item>
  <Accordion.Item id='billing' title='Billing' disabled>
    <p>Contact your admin to manage billing.</p>
  </Accordion.Item>
</Accordion>;
```

See the Storybook MDX (`stories/accordion.mdx`) for the intent contract and design decisions.

## API

### `<Accordion>` (root)

| Prop | Type | Default | What it does |
|---|---|---|---|
| `allowMultiple` | `boolean` | `false` | When true, multiple items can be open simultaneously. When false, opening one closes the others (radio-style). |
| `defaultExpanded` | `string \| string[]` | `[]` | Uncontrolled initial state. Pass item ids. |
| `expanded` | `string \| string[]` | — | Controlled state. When provided, the consumer owns expanded state. |
| `onExpandedChange` | `(next: string[]) => void` | — | Fires with the next expanded-id array whenever state would change. |
| `id` | `string` | auto | Root element id. Auto-generated when omitted. |

### `<Accordion.Item>`

| Prop | Type | What it does |
|---|---|---|
| `id` | `string` | Stable id used for state tracking. Strongly recommended. |
| `title` | `ReactNode` | Header content (string or rich node). |
| `disabled` | `boolean` | Disables toggle; header remains visible but inert. |
| `icon` | `ReactNode` | Optional left-side icon next to the title. |
| `children` | `ReactNode` | Body content shown when the item is expanded. |

## Why a compound API

The root owns expanded state for all items; items reach up through a private context to render their expanded UI and fire toggles. Consumers don't wire per-item handlers — they declare which items should be open via `defaultExpanded` / `expanded` on the root.

This is also why `@m-next/accordion` is **not** a re-export of `Sidebar.Group`. Sidebar.Group is a constrained accordion-like behavior scoped to one section of a nav rail; Accordion is the standalone primitive for arbitrary content. They're peers with different intents.

## Accessibility

- Each header is a real `<button type='button'>` with `aria-expanded` and `aria-controls` pointing at its body panel.
- Each body is a `<div role='region'>` with a matching `id` and `aria-labelledby` referencing its header.
- `disabled` items set `aria-disabled` and ignore click events.
- Native browser keyboard handling on the button: `Enter` / `Space` toggle.

## What it does NOT do

- Doesn't own routing or content state inside an item — caller's concern.
- Doesn't animate the expand/collapse beyond a chevron rotation in v1. (Height-animate slated for v2 once we settle on a tokenized motion curve.)
- Doesn't implement arrow-key navigation between items in v1 — native tab order moves between headers, which is the WAI-ARIA recommended minimum.

## Roadmap

- v2: arrow-key navigation between headers (`Home` / `End` / `ArrowDown` / `ArrowUp`).
- v2: height-animated expand/collapse.
- v2: optional `Accordion.Header` / `Accordion.Body` split for callers who want to layer a custom header layout.
