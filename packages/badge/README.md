# `@m-next/badge`

Small inline label for status, count, or category. Renders as a `<span>`. Theme-agnostic — works outside a `ThemeProvider`.

## Quick start

```jsx
import { Badge } from '@m-next/badge';

<Badge>New</Badge>                                          // solid neutral, md
<Badge colorScheme="green">Active</Badge>                   // solid green
<Badge variant="subtle" colorScheme="blue">Info</Badge>     // pale blue tint
<Badge variant="outline" colorScheme="red">Failed</Badge>   // outlined red
<Badge size="sm" colorScheme="yellow">Beta</Badge>          // small yellow
<Badge dot colorScheme="green">Online</Badge>               // with leading dot
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `'solid' \| 'subtle' \| 'outline'` | `'solid'` | Visual treatment. |
| `colorScheme` | `'neutral' \| 'blue' \| 'green' \| 'yellow' \| 'red'` | `'neutral'` | Semantic color. |
| `size` | `'sm' \| 'md'` | `'md'` | No `lg` — badges are inherently small. |
| `dot` | `boolean` | `false` | If true, renders a 6px circle before children. |
| `children` | `ReactNode` | — | The badge content. |
| Any other prop | — | — | Forwarded to the wrapper `<span>` (including `style`, `className`, `aria-*`). |

## Variants

- **solid** — filled background in the colorScheme hue, white text.
- **subtle** — pale background tint (~12%), dark text in the colorScheme hue.
- **outline** — transparent background, 1px border + text in the colorScheme hue.

## Sizes

- `sm`: 10px font, 2px/6px padding.
- `md`: 12px font, 3px/8px padding.

Border-radius is always `9999` (pill shape).

## Accessibility

Badges are visual decoration — no special ARIA is applied. If a consumer uses a badge to signal a dynamic change (e.g., "3 unread"), wrap the surrounding region in `aria-live` yourself:

```jsx
<div aria-live="polite">
  Inbox <Badge colorScheme="blue">{unreadCount}</Badge>
</div>
```

## Why no `useTheme()`

Badges often render before a `ThemeProvider` mounts — initial loading screens, error boundary fallbacks, empty states. Coupling to theme via `useTheme()` would throw in those cases. The five `colorScheme` values give you semantic intent with hardcoded sensible defaults. Consumers who want fully theme-tied color can pass `style={{ background: theme.X, color: theme.Y }}` themselves.
