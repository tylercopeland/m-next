# `@m-next/text`

Typography primitive — a customisable `<p>`, `<div>`, or `<h1>` driven by inline-style props. Forked from `@m-one/text` and normalised to the m-next API conventions.

## Quick start

```tsx
import Text from '@m-next/text';
import { colors } from '@m-next/tokens';

<Text>Default paragraph text.</Text>
<Text as="DIV" fontColor={colors.grey.darkest} fontSize="14px">Body copy.</Text>
<Text as="H1" fontSize="24px" fontWeight="bold">Heading.</Text>
<Text ref={textRef} fontColor={colors.red.base}>Error message.</Text>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `as` | `'P' \| 'DIV' \| 'H1'` | `'P'` | Which HTML element to render. Accepted uppercase for legacy compat |
| `fontSize` | string | — | CSS length string (e.g., `'14px'`). Applied inline |
| `fontColor` | string | — | CSS colour string |
| `lineHeight` | string | `'20px'` | CSS length string |
| `fontWeight` | string \| number | `'normal'` | CSS font-weight |
| `mt`, `mb`, `ml`, `mr` | string | — | Margins (CSS length strings) |
| `center` | boolean | `false` | Shortcut for `text-align: center` |
| `wordBreak` | string | — | CSS word-break |
| `whiteSpace` | string | `'normal'` | CSS white-space |
| `overflow` | string | `'visible'` | CSS overflow |
| `overrideFontSize` | boolean | `false` | Emit `fontSize` with `!important` |
| `inlineStyling` | object | — | Inline-style overrides merged on top of base styles |
| `sx` | object | — | Reflexbox-style overrides (DIV variant) |
| `tabIndex` | number | `-1` | Native tabIndex |
| `iconAlign` | string | — | Aligns an attached pseudo-element icon (`'Left'` / `'Right'`) |
| `legacyClasses` | string | — | Space-separated Method UI 3 class names (`mi-caption-font-xlarge`, `font-large`, `mi-color-primary`, etc.). Translated by the bundled classConverter |
| `id` | string | auto | Optional. Auto-generated if omitted |
| `ref` | ref | — | Forwarded to the rendered element |
| `style`, `className`, `data-*`, `aria-*` | — | — | Native attributes spread through |

## What changed from `@m-one/text`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored (V4 design is always on) |

## Backwards compatibility

The legacy `forwardRef` prop still works — it emits a single `console.warn` at first use and is chained with the React `ref`. All other prop names were already idiomatic and remain unchanged.

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle`) are accepted but have no behavioural effect.

`legacyClasses` (note the plural — different from the silently-ignored singular `legacyClass`) is the **canonical** legacy-class translator and is kept functional for Method UI 3 markup that depends on it.

## Accessibility

- Renders semantic HTML — `<p>`, `<div>`, or `<h1>`. Pick `as` deliberately.
- All native `data-*` / `aria-*` attributes pass through.
- `tabIndex` defaults to `-1` (not focusable); set explicitly when interactive.

## Open follow-ups

- `Text.test.tsx` still passes against the new API — Text's surface barely changed. Consider rewriting the legacy-classes test to cover a wider swath of `classConverter` once that file is touched.
- `classConverter.ts` still consumes flat-key colour names from `@m-next/styles` (`colors.legacy.red`, etc.) — kept intact to preserve translation behaviour. Phase 3 is API surface only; a deeper rewrite would migrate the converter onto `@m-next/tokens` and is deferred.
- `Text.styles.ts` is `// @ts-nocheck` because the styled-component prop typing predates current Emotion typings. Left alone — same caveat as Toggle's styles file.
