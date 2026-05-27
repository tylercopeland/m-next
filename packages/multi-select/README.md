# `@m-next/multi-select`

Multi-value pill input. The user enters values one at a time; each becomes a pill. Two modes:

- **Free-text** — type, hit Enter or comma to add. Optional email validation via `type="email"`.
- **Dropdown** — pick from a fixed list (`dropdownOptions`).

Forked from `@m-one/multi-select` and normalized to the m-next API conventions.

## Quick start

```jsx
import MultiSelect from '@m-next/multi-select';

<MultiSelect placeholder="Add tags..." onChange={(v) => console.log(v)} />

<MultiSelect
  type="email"
  placeholder="invite@example.com"
  existingEmails={['taken@example.com']}
  onChange={(email) => addInvitee(email)}
  onDelete={(email, isValid) => removeInvitee(email)}
  onError={(msg) => setError(msg)}
/>

<MultiSelect
  isDropdown
  dropdownOptions={['Tenant 2', 'Tenant 3', 'Tenant 4']}
  options={['Current tenant']}
  onChange={(value) => addTenant(value)}
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto-generated | Optional |
| `className` | string | — | Prefix for child class names |
| `placeholder` | string | — | Native placeholder for the inline `<input>` |
| `options` | string[] | `[]` | Initial pill values |
| `type` | `'text' \| 'email'` | `'text'` | `'email'` runs validation and dedup against `existingEmails` / `tenantEmails` |
| `existingEmails` | string[] | — | Emails to flag as already registered |
| `tenantEmails` | string[] | — | Emails to flag as belonging to another tenant |
| `isDropdown` | boolean | `false` | Render as a dropdown picker |
| `dropdownOptions` | string[] | — | Options available in dropdown mode |
| `height` | string | `'100px'` | CSS length for the container |
| `areAllPillsDeletable` | boolean | `false` | When false, the first pill is locked |
| `onChange` | function | — | Fired with the value when a new pill is added |
| `onDelete` | function | — | Fired with `(value, isValid?)` when a pill is removed |
| `onError` | function | — | Fired with a validation message (email mode) |
| `ref` | ref | — | Forwarded to the inline `<input>` element |

## What changed from `@m-one/multi-select`

| Was | Now | Status |
|-----|-----|--------|
| `id` — not used at all | `id` optional, auto-generated, propagated to children | Additive |
| `inputType="email"` | `type="email"` | Soft shim — warns once |
| `onSelect` | `onChange` | Soft shim — warns once (same signature) |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| `isMobile`, `fullSize` — affected layout | — | Silently ignored. Wrap in your own container / use CSS to size |
| `isV4Design`, `legacyClass`, `displayAuto` | — | Silently ignored |
| Hex literals via `@m-next/styles` flat keys (`colors['grey-light']`) | `@m-next/tokens` (`colors.grey.light`) | Internal — no API change |

## Backwards compatibility

Old prop names work with a single `console.warn` at first use. The shim translates:

- `inputType` → `type`
- `onSelect` → `onChange`
- `forwardRef` prop → chained with the React `ref`

Legacy ghosts (`isV4Design`, `isMobile`, `fullSize`, `legacyClass`, `displayAuto`) accept their prop but have no behavioral effect. Layout sizing should be handled via the `height` prop or by wrapping the component in a sized container.

## Accessibility

- The inline `<input>` underneath has native keyboard semantics — Enter and comma both commit a value; Backspace at an empty input deletes the previous pill.
- Pills are rendered via `@m-next/pill`; their delete actions are real buttons.
- Email validation surfaces error messages via the `onError` callback — wire it to a `Validation` / `ValidationMessage` near the field for SR users.

## Open follow-ups

- `MultiSelect.test.jsx` and `__snapshots__/` reference the legacy `colors` / `onSelect` / `inputType` API. They will need updates — same situation as Button / Input.
- The component still lacks an integrated `label` + `errorMessage` chrome of the kind `Input` carries. Consumers wrap with `Caption` / `ValidationMessage` themselves. A follow-up pass could fold those in once `@m-next/caption` is also cleaned up.
- Dropdown options take string arrays only; no `{ label, value }` shape. Acceptable for the current use case but worth revisiting alongside Dropdown / Select cleanup.
