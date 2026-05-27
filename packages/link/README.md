# `@m-next/link`

Styled anchor element. Theme-agnostic, accessible, three visual variants.

## Quick start

```jsx
import { Link } from '@m-next/link';

<Link href="/invoices">View invoices</Link>
<Link href="/invoices" variant="subtle">View invoices</Link>
<Link href="/invoices" variant="button">View invoices</Link>
<Link href="https://example.com" external>External docs</Link>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `href` | string | — | Required. |
| `variant` | `'primary' \| 'subtle' \| 'button'` | `'primary'` | Visual treatment. |
| `external` | boolean | `false` | Adds `target="_blank"`, `rel="noopener noreferrer"`, the `↗` glyph, and a visually-hidden "(opens in new tab)" hint for screen readers. |
| `children` | ReactNode | — | Link content. |
| Any other anchor attr | — | — | Forwarded to `<a>` (`download`, `aria-*`, `onClick`, etc.). |

## Variants

- **primary** — underlined, color `#0D71C8` (Method blue), hover `#0a5a9c`. Visited stays primary (not browser purple) so navigation history doesn't leak into UI styling.
- **subtle** — no underline, `color: inherit` so it sits in the surrounding text color. On hover, an underline appears and color shifts to `#0D71C8`. Useful on dark backgrounds, in cards with their own foreground color, or inside dense table rows.
- **button** — inline-flex pill: `6px 12px` padding, `4px` radius, transparent border, `#374151` text. On hover the background fills to `#f3f4f6` with a `#e5e7eb` border. Use for standalone CTAs that should look clickable without competing with primary buttons.

## Accessibility

- **Focus**: a 2px `#0D71C8` outline with 2px offset (via `:focus-visible`). Outline (not box-shadow) so it stays visible on transparent backgrounds.
- **External**: when `external` is true, a decorative `↗` glyph (`aria-hidden`) is appended, and a visually-hidden span announces "(opens in new tab)" to screen readers. The hidden-span approach was chosen over `aria-label` so the link's visible text remains the accessible name — `aria-label` would clobber it.
- All anchor attributes pass through, so consumers can add `download`, `aria-current`, `aria-describedby`, etc.

## Why no `useTheme()`

Links render in error pages, marketing surfaces, and unauthenticated flows where no `ThemeProvider` is mounted. Colors are hardcoded to Method blue (`#0D71C8`) and neutral greys; if you need a custom palette, override via `style` or wrap with your own className.

## Styles

A single `<style id="m-next-link-styles">` block is injected into `document.head` on first mount (idempotent). It defines `:hover`, `:visited`, and `:focus-visible` rules that can't be expressed via inline `style`.
