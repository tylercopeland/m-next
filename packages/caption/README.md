# `@m-next/caption`

The label / caption companion for form controls (Input, Dropdown, MultiSelect, Banner, Dialog, …) and standalone informational text. Renders a label element with optional floating-label positioning. Forked from `@m-one/caption` and normalized to the m-next API conventions.

## Quick start

```jsx
import Caption from '@m-next/caption';

// Plain label
<Caption label="Email address" />

// Required field — appends a red asterisk
<Caption label="Email" required />

// Bound to an input via htmlFor
<Caption label="Email" htmlFor="user-email-input" />

// Error / invalid state — flips text color
<Caption label="Email" isValid={false} />

// Floating-label mode (the visual used inside Input / Dropdown)
<Caption label="Email" float />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | _auto_ | Auto-generated if omitted (was required in `@m-one/caption`) |
| `label` | string \| ReactNode | — | Label content. Strings render via dangerouslySetInnerHTML for legacy HTML-string callers; ReactNodes render normally |
| `htmlFor` | string | — | Form-control id this label is bound to (renders as `for` attribute) |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `color` | string | — | Explicit text color (overrides themed default) |
| `required` | boolean | `false` | Appends a red asterisk |
| `isValid` | boolean | `true` | When false, renders in the negative / error color |
| `disabled` | boolean | `false` | Dims with the associated control |
| `readOnly` | boolean | `false` | Reflects a read-only field |
| `focused` | boolean | `false` | Signals the associated control is focused (affects floating-label color) |
| `float` | boolean | `false` | Floating-label mode — label translates upward and shrinks |
| `floatYPos` | number | `9` | Vertical offset (px) for the inline / unfocused position |
| `floatXPosFocus` | string | — | Horizontal offset applied when floated (above-input) |
| `floatXPosUnfocus` | string | — | Horizontal offset applied when inline (at-baseline) |
| `narrow` | boolean | `false` | Removes the default 10px bottom margin |
| `style`, `className` | — | — | Standard escape hatches |
| `onClick` | function | — | Click handler on the label element |
| `ref` | ref | — | Forwarded to the rendered label element |

## What changed from `@m-one/caption`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `caption="..."` | `label="..."` | Soft shim — warns once |
| `elFor="..."` | `htmlFor="..."` (React standard) | Soft shim — warns once |
| `readonly` (lowercase) | `readOnly` (React standard) | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `legacyClass="mi-caption-…"` | `className` / `style` | Soft shim — warns once; the `mi-caption-*` class names are still translated to inline styles for now |
| `isV4Design`, `isMobile`, `isLabelBolded`, `background` | — | Silently ignored |

The floating-label positioning props (`float`, `floatYPos`, `floatXPosFocus`, `floatXPosUnfocus`) are kept on the clean API surface because they describe a real visual mode — the "label floats above a filled input" UX consumed by `@m-next/input`, `@m-next/dropdown`, etc. They are no longer guarded by an `isV4Design` flag; the V4 styling path is always active.

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:

- `caption` → `label`
- `elFor` → `htmlFor`
- `readonly` → `readOnly`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `isLabelBolded`, `background`) accept their value but have no behavioral effect:

- `isV4Design` — V4 design is always on.
- `isMobile` — the mobile font/size branch (16/14px @ y=16px) is now CSS-driven; consumers should use media queries / responsive containers.
- `isLabelBolded` — labels are always semi-bold in m-next. Consumers needing thinner weight should set `style={{ fontWeight: 400 }}`.
- `background` — the floating-label background-color overlay is no longer applied; consumers style their own surface.

## Accessibility

- When `htmlFor` is set, the wrapper element exposes the `for` attribute so the label is announced as associated with the control.
- `required` appends a red asterisk; screen readers will read the literal `*`. For richer semantics, pair with `aria-required` on the associated control.
- `isValid={false}` flips the text color to the theme's `negative.secondary`. Pair with `aria-invalid` on the associated control.

## Floating-label mode

Caption powers the floating-label pattern used by Input and Dropdown. When `float={true}` the label is absolutely positioned, translated up, and shrunk to 12px. When `float={false}` (default) it sits inline at the input baseline. Consumers compute `float` themselves — typically `Boolean(value || placeholder || focused || leftIcon)`.

```jsx
<div style={{ position: 'relative' }}>
  <Caption label="Email" htmlFor="email" float={Boolean(value || focused)} focused={focused} />
  <input id="email" value={value} onChange={…} onFocus={…} onBlur={…} />
</div>
```

## Open follow-ups

- `caption.test.jsx` and `__snapshots__/` reference the legacy API (and the old hex-literal output of `convertLegacyCaptionStyle`). Tests will fail until rewritten — same situation as Button / Input.
- The rendered element is a `<div>` with a `for` attribute, not a proper `<label>`. Promoting to a real `<label>` (when `htmlFor` is set) is a candidate for a future a11y pass — out of scope for this API-surface cleanup.
- The `dangerouslySetInnerHTML` path is preserved for legacy callers that pass HTML strings as `label`. ReactNode labels render safely. The HTML-string path is a candidate to retire once `@m-next/grid` and other heavy consumers are cleaned up.
- `convertLegacyCaptionStyle` (from `@m-next/styles`) still translates `mi-caption-*` class names to inline styles with hard-coded hex values. That helper lives in the styles package and is shared with `@m-one`; migrating it to `@m-next/tokens` is a styles-package pass.
- `lightTheme` from `@m-next/styles` is still used as the fallback for theme-context resolution. The theme system is unchanged in this pass.
