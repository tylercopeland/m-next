# `@m-next/hero-banner`

Page-level promotional hero banner. A heading + description + up to two action buttons + optional image, in a themed surface. Forked from `@m-one/hero-banner` and normalized to the m-next API conventions.

Not to be confused with `@m-next/banner` — that's the inline message strip. HeroBanner is the larger marketing/onboarding surface.

## Quick start

```jsx
import HeroBanner from '@m-next/hero-banner';

<HeroBanner
  title="Welcome to Method"
  description="Get started with our platform and learn how Method can help you save time and win more work."
  imageSrc="/hero.jpg"
  primaryButton="Get started"
  onPrimaryButtonClick={handleStart}
/>

<HeroBanner
  title="Schedule your demo"
  description="Book a personalized walkthrough."
  backgroundColor="green"
  primaryButton="Book demo"
  secondaryButton="Learn more"
  hasClose
  onClose={() => setVisible(false)}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | string | — | Rendered as an H2; drives the accessible name via `aria-labelledby` |
| `description` | ReactNode | — | Supporting copy below the title |
| `imageSrc` | string | — | URL for the hero image, rendered in the leading slot |
| `primaryButton` | string | — | Label for the primary action |
| `onPrimaryButtonClick` | function | — | Primary action handler |
| `primaryButtonStyle` | `'primary' \| 'ghost'` | `'primary'` | Visual variant for the primary button |
| `primaryButtonColor` | string | — | Custom color (text + border) override for the primary button |
| `secondaryButton` | string | — | Label for the secondary action (always rendered as `ghost`) |
| `onSecondaryButtonClick` | function | — | Secondary action handler |
| `backgroundColor` | `'blue' \| 'orange' \| 'green' \| 'red'` | `'blue'` | Themed surface tint |
| `hasClose` | boolean | `false` | Renders a close button (real `<button aria-label="Dismiss banner">`) |
| `onClose` | function | — | Click handler for the close button |
| `id` | string | auto | Auto-generated if omitted |
| `className` | string | — | Additional classes for the root |
| `style` | object | — | Inline styles for the root |
| `testId` | string | — | Mirrored to `data-testid` |
| `dismissIconSize` | number | `12` | Size of the close-button icon |
| `ref` | ref | — | Forwarded to the root `<div>` |
| Any `aria-*`, native `div` attrs | — | — | Spread to the root |

## What changed from `@m-one/hero-banner`

| Was | Now | Status |
|-----|-----|--------|
| `id` required | optional — auto-generated if absent | Backwards-compatible |
| `backgroundColor='blue-lighter'` (etc.) | `backgroundColor='blue'` family name | Soft shim — warns once, still renders |
| `canDismiss` | `hasClose` | Soft shim — warns once |
| `onBannerDismiss` | `onClose` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isMobile` prop driving layout | CSS media queries (`max-width: 640px`) | `isMobile` accepted but ignored |
| Hardcoded hex literals (`#111827`, `#4B5563`, `lightTheme.content.emphasize`) | `@m-next/tokens` colors (`colors.grey.darkest`, `colors.grey.base`) | Token migration |
| Close icon was a clickable `<button>` already, but lacked focus ring | Real `<button>` + `:focus-visible` outline | Accessibility polish |
| No root semantics | `role="region"` + `aria-labelledby` (when `title` present) | Accessibility addition |
| `isV4Design`, `legacyClass`, `displayAuto` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:

- `backgroundColor='blue-lighter'` → `'blue'` (and `orange-lighter`, `green-lighter`, `red-lighter` similarly)
- `canDismiss` → `hasClose`
- `onBannerDismiss` → `onClose`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`) accept their value but have no behavioral effect. `isMobile` in particular is now handled via CSS media queries.

## Accessibility

- Root carries `role="region"` and, when `title` is provided, `aria-labelledby="${id}-title"` so screen-reader users can navigate to and out of the banner as a landmark.
- The close button is a real `<button type="button" aria-label="Dismiss banner">` — keyboard-focusable with a visible `:focus-visible` outline.
- Action buttons render via `@m-next/button`, which produces native `<button>` elements.
- Heading is an H2 — fits below page-level H1, above any subsection H3s.

## Tokens consumed

- `colors.{blue|orange|green|red}.lighter` — themed background surface
- `colors.grey.darkest` — title text + close icon
- `colors.grey.base` — description text
- `colors.blue.base` — focus ring on the close button

## Open follow-ups

- `HeroBanner.test.jsx` still references the legacy API (`isMobile` layout assertions, hex color assertions). It'll keep working through the shim but the assertions reflect old behaviour. Rewriting it is a separate pass.
- The two `<Text>` calls still consume `@m-next/typeography` with hardcoded font sizes overriding the `fontSize` prop. The right fix is for Typeography to surface tokenised sizes — deferred.
- `Button` is still passed via the legacy API (`buttonStyle`, `value`). Once `@m-next/button`'s clean API is stable, switch to `variant` and children.

## Related components

- `@m-next/banner` — the inline message strip (for status / system messages).
- `@m-next/dialog` — for blocking confirmations.
- `@m-next/card` — for content blocks that aren't promotional / hero-level.
