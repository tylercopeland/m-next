/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepDescriptor {
  /** Visible label for this step. */
  label?: string;
  /** Any additional metadata — passed through to `onStepClick`. */
  [key: string]: any;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Optional — auto-generated if not provided. */
  id?: string;
  /**
   * Either a count of steps (renders `Step N` labels) or an array of step
   * descriptors with explicit labels / metadata.
   */
  steps: number | Array<StepDescriptor | string>;
  /** Zero-based index of the currently-active step. */
  activeStep?: number;
  /** Show the step labels under each indicator. */
  showLabels?: boolean;
  /** Layout orientation. Defaults to `'horizontal'`. */
  orientation?: StepperOrientation;
  /**
   * Optional click handler for steps. Receives `(index, stepDef, event)`.
   * When provided, completed and active steps become focusable buttons.
   * Future (not-yet-reached) steps remain `aria-disabled` and non-interactive.
   */
  onStepClick?: (index: number, stepDef: StepDescriptor | string | undefined, event: React.SyntheticEvent) => void;
  /** Icon name used for the completed-step checkmark. Defaults to `'completed-check'`. */
  iconName?: string;
  /** MUI's `alternativeLabel` — renders labels under each step icon. */
  alternativeLabel?: boolean;

  /** Accessible name for the stepper region. */
  'aria-label'?: string;
  /** Or, reference an element that labels the stepper. */
  'aria-labelledby'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `showLabels`. */
  displayLabel?: boolean;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

declare const Stepper: React.ForwardRefExoticComponent<
  StepperProps & React.RefAttributes<HTMLDivElement>
>;
export default Stepper;
export { Stepper };
