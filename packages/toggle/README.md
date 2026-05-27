# `@m-next/toggle`

Toggle switch — an accessible boolean control. Forked from `@m-one/toggle` and normalized to the m-next API conventions.

## Quick start

```jsx
import Toggle from '@m-next/toggle';

<Toggle label="Enable feature" checked={enabled} onChange={setEnabled} />
<Toggle label="Show details" checked={visible} onChange={setVisible} isRuntime textOpt="Yes/No" />
<Toggle label="Bold" checked={bold} onChange={setBold} size="large" />
<Toggle ref={inputRef} label="Notifications" checked={notify} onChange={setNotify} />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Visible label next to the toggle |
| `checked` | boolean | `false` | Controlled checked state |
| `onChange` | `(checked: boolean) => void` | — | Fires with the next checked value |
| `onFocus`, `onBlur` | function | — | Standard focus handlers |
| `disabled` | boolean | `false` | Disables interaction; greys out the control |
| `isRuntime` | boolean | `false` | Switches to the inline-label rendering (used at app runtime, with Yes/No, On/Off, True/False) |
| `textOpt` | `'Blank' \| 'Yes/No' \| 'On/Off' \| 'True/False'` | `'Blank'` | Inline text shown inside the track in runtime mode |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Visual scale of the track and circle |
| `color` | string | — | Override the checked-state colour (CSS colour string) |
| `alignRight` | boolean | `false` | Reverses label / control order |
| `bold` | boolean | `false` | Bolds the label |
| `icon` | string | — | Name of an `@m-next/svg-icon` icon shown beside the label (design-time mode) |
| `tooltip`, `tooltipId` | string | — | Tooltip text + react-tooltip target id |
| `width` | string | `'auto'` | Wrapper width |
| `style`, `labelStyle` | object | — | Style overrides for the wrapper and the label |
| `id` | string | auto | Optional. Auto-generated if omitted |
| `ref` | ref | — | Forwarded to the underlying `<input type="checkbox">` |

## What changed from `@m-one/toggle`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isV4Design`, `isMobile`, `legacyClass`, `compactStyle`, `displayAuto` | — | Silently ignored (V4 design is always on) |

## Backwards compatibility

The legacy `forwardRef` prop still works — it emits a single `console.warn` at first use and is chained with the React `ref`. All other prop names were already idiomatic and remain unchanged.

Legacy ghosts (`isV4Design`, `isMobile`, `legacyClass`, `compactStyle`, `displayAuto`) are accepted but have no behavioural effect — V4 styling is now always on.

## Accessibility

- Underlying element is a native `<input type="checkbox" role="switch">` — keyboard semantics inherited.
- `aria-checked` mirrors the checked state.
- `label` is rendered via `@m-next/caption` (runtime mode) or a styled `<div>` (design-time mode); both are wired via `htmlFor` / `id`.
- `disabled` flips the `disabled` attribute on the native input.
- `tooltip` / `tooltipId` are emitted as `data-tooltip-*` attributes for a react-tooltip host to pick up.

## Open follow-ups

- `Toggle.test.tsx` and `__snapshots__/` still reference the legacy API surface. They will need updating to match the new defaults (auto-id, no `isV4Design`) — same situation as Button and Input.
- `@m-next/caption` still has its own legacy API surface. Cleaning Caption is a separate pass.
- The translucent halo / track colours (`rgba(93, 157, 213, 0.x)`) don't have direct token equivalents. They're isolated as named constants in `toggle.styles.ts` and can be promoted to translucent token variants when those land.
