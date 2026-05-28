# `@m-next/stepper`

Multi-step progress indicator. Visualizes the user's position in a linear sequence — wizards, checkout flows, signup, onboarding, multi-page forms.

## Quick start

```jsx
import Stepper from '@m-next/stepper';

// Simple — N evenly-spaced steps, default "Step 1/2/3" labels
<Stepper steps={4} activeStep={1} showLabels />

// Explicit labels
<Stepper
  steps={[
    { label: 'Account' },
    { label: 'Details' },
    { label: 'Billing' },
    { label: 'Review' },
  ]}
  activeStep={2}
  showLabels
/>

// Clickable navigation (only completed + current; future steps stay disabled)
<Stepper
  steps={['Account', 'Details', 'Billing', 'Review']}
  activeStep={current}
  onStepClick={(index) => setCurrent(index)}
  showLabels
/>
```

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `id` | string | auto | Optional. Auto-generated if absent. |
| `steps` | number \| `(StepDescriptor \| string)[]` | — | Either a count or an array of step descriptors. |
| `activeStep` | number | `0` | Zero-based index of the active step. |
| `showLabels` | boolean | `false` | Render the labels under each step indicator. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `onStepClick` | `(index, stepDef, e) => void` | — | When provided, completed + active steps become focusable buttons. Future steps stay `aria-disabled` and non-interactive. |
| `iconName` | string | `'completed-check'` | Icon name (from `@m-next/svg-icon`) shown inside completed step indicators. |
| `alternativeLabel` | boolean | `false` | MUI layout mode — labels sit underneath the indicator instead of beside it. |
| `aria-label` | string | `'Progress'` | Accessible name for the stepper region. Defaults to `'Progress'` when neither this nor `aria-labelledby` is supplied. |
| `aria-labelledby` | string | — | Reference an element that labels the stepper. |
| `ref` | ref | — | Forwarded to the outer container `<div>`. |

## Accessibility

- The wrapper is `role="group"` with an accessible name (`aria-label` defaults to `'Progress'` if neither it nor `aria-labelledby` is provided).
- The active step has `aria-current="step"` — screen readers announce it as the current position in the sequence.
- Steps that have not been reached yet have `aria-disabled="true"`.
- Each step has an `aria-label` like `"Account (current step)"` or `"Details (completed)"` so the state is announced even when visible labels are hidden.
- When `onStepClick` is provided, eligible steps (completed + active) become `role="button"` with `tabIndex={0}`, support Enter and Space keys, and gain a visible focus ring. Future steps are not in the tab order.

## What changed from `@m-one/stepper`

| Was | Now | Status |
|-----|-----|--------|
| `id="..."` required | optional — auto-generated if absent | Backwards-compatible |
| `steps` could only be a number | now accepts a number or an array of `{ label }` / string descriptors | Backwards-compatible additive |
| `displayLabel` | `showLabels` | Soft shim — warns once |
| `forwardRef={ref}` prop | `ref={ref}` (React forwardRef API) | Soft shim — warns once |
| Hex literals + `@m-next/styles` flat-key colors | `@m-next/tokens.colors.*` | Internal — no consumer impact |
| No `role="group"`, no `aria-label`, no `aria-current` on the active step, no `aria-disabled` on future steps | Full ARIA wiring — `role="group"`, `aria-label="Progress"`, `aria-current="step"`, `aria-disabled` per state | Accessibility fix |
| No keyboard navigation when steps were clickable | When `onStepClick` is provided: `role="button"`, `tabIndex={0}`, Enter / Space activate | Accessibility fix |
| `isV4Design`, `isMobile`, `legacyClass`, `displayAuto`, `compactStyle` | — | Silently ignored |

## Tokens consumed

- `@m-next/tokens.colors.grey.light` — inactive label color, default step border, dashed connector line
- `@m-next/tokens.colors.grey.base` — text inside inactive step indicator
- `@m-next/tokens.colors.blue.base` — active / completed indicator border, active label color, active connector line, completed icon background, focus ring
- `@m-next/tokens.colors.white` — default indicator fill

## Open follow-ups

- `stepper.test.jsx` and `__snapshots__/` still reference the legacy snapshot. They will need to be regenerated — same situation as Button / Input / Tabs.
- MUI dependency is preserved. A future major could re-implement the visual indicators directly (the only MUI features actually used are `MUIStepper`, `MUIStep`, `MUIStepLabel`, plus their connector lines) and drop the dependency.
