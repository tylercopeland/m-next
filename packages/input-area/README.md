# `@m-next/input-area`

Multi-line text input — the textarea counterpart to `@m-next/input`.

> **Naming note.** Per the m-one design system audit, this component is now referred to as **Textarea**.
> The package name stays `@m-next/input-area` and the default export stays `InputArea` for backwards compatibility. New code should prefer the `Textarea` named export.

## Quick start

```jsx
import { Textarea } from '@m-next/input-area';
// or, for backwards compat:
//   import InputArea from '@m-next/input-area';

<Textarea label="Notes" placeholder="Add a note…" rows={4} />
<Textarea label="Description" autoGrow maxHeight={400} />
<Textarea label="Bio" required errorMessage="Required" />
<Textarea ref={textareaRef} label="Comments" />
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | string | — | Visible label rendered above the textarea (via `@m-next/caption`) |
| `name` | string | — | Native textarea name |
| `value` | string \| number | `''` | Controlled value |
| `placeholder` | string | — | Native placeholder |
| `required` | boolean | `false` | Marks the field required (visually + ARIA) |
| `disabled` | boolean | `false` | Disables interaction; sets `aria-disabled` |
| `readOnly` | boolean | `false` | Read-only state |
| `tabIndex` | number | `0` | |
| `errorMessage` | string \| ReactNode | — | When set, textarea shows error state + renders this message |
| `intent` | `'error' \| 'warning' \| 'informative'` | `'error'` | Visual intent of the message |
| `hideLabel` | boolean | `false` | Hides the visible label (still announced via `aria-label`) |
| `width` | string \| number | `'100%'` | Container width |
| `rows` | number | `3` | Native `rows` attribute |
| `cols` | number | — | Native `cols` attribute |
| `resize` | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | — | Native CSS `resize`. Overrides `disableResize` when set. |
| `disableResize` | boolean | `false` | Shortcut for `resize="none"` |
| `autoGrow` | boolean | `false` | Auto-grow height as content increases |
| `maxHeight` | number | `250` | Max height in px for `autoGrow` |
| `initialHeight` | number | — | Starting height in px |
| `selectOnFocus` | boolean | `false` | Selects content when focused |
| `navigateGrid` | function | — | Editable-grid up/down navigation hook |
| `isBlurOnSubmit` | boolean | — | Blur on Enter (editable-grid cells) |
| `style` | object | — | Style overrides for container |
| `onChange`, `onBlur`, `onFocus`, `onKeyDown`, `onKeyUp` | function | — | Standard React event handlers |
| `ref` | ref | — | Imperative handle exposing `focus()`, `blur()`, `select()` |
| Any `aria-*`, native textarea attrs | — | — | Spread to the underlying `<textarea>` |

## What changed from `@m-one/input-area`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `validationMessage` | `errorMessage` | Soft shim — warns once |
| `infoLevel` | `intent` | Soft shim — warns once |
| `hideCaption` | `hideLabel` | Soft shim — warns once |
| `ariaDescribedby` | `aria-describedby` (standard React attr) | Soft shim — warns once |
| `ariaLabel` | `aria-label` (standard React attr) | Soft shim — warns once |
| `readonly` (lowercase) | `readOnly` (React standard) | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `onChange(value)` | `onChange(event)` | Standard React event signature |
| `isV4Design`, `isMobile`, `hidden`, `displayAuto`, `legacyClass`, `compactStyle` | — | Silently ignored |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:
- `validationMessage` → `errorMessage`
- `infoLevel` → `intent`
- `hideCaption` → `hideLabel`
- `ariaDescribedby` → `aria-describedby`
- `ariaLabel` → `aria-label`
- `readonly` → `readOnly`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `hidden`, `displayAuto`, `legacyClass`, `compactStyle`) accept their prop but have no behavioral effect — V4 styling is now always on.

### `onChange` signature change

The legacy `@m-one/input-area` invoked `onChange(value)` with a raw string. The cleaned-up Textarea follows the standard React signature and calls `onChange(event)`. Pull the value off `event.target.value`. The sibling `DebouncedInputArea` still emits the raw value to its consumer — its outer API is unchanged.

## Imperative handle

```jsx
const ref = useRef();
<Textarea ref={ref} label="Comments" />

ref.current.focus();
ref.current.blur();
ref.current.select();
```

## Accessibility

- Uses native `<textarea>` semantics. All `aria-*` props pass through.
- `disabled` automatically mirrors to `aria-disabled`.
- `errorMessage` flips `aria-invalid` to `true`.
- `required` mirrors to `aria-required`.
- `label` is rendered via `@m-next/caption` and connected to the textarea via `htmlFor` / `id`.
- `hideLabel` keeps the label in the DOM for screen readers but visually hides it.

## Tokens consumed

- `colors.grey.dark` for placeholder text
- Theme context (via Emotion) for `theme.content.*`, `theme.negative.*`, `theme.background.*` — when rendered inside `<ThemeProvider>` from `@m-next/theme`, picks up the active named theme. Falls back to `lightTheme` from `@m-next/styles`.

## Related

- `Input` (`@m-next/input`) — single-line counterpart.
- `DebouncedInputArea` / `DebouncedTextarea` — sibling export that buffers user input.

## Open follow-ups

- `InputArea.test.jsx` and `__snapshots__/` still reference the legacy API. They will fail until rewritten — same situation as Button / Input.
