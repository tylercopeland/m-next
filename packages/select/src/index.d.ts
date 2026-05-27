/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type SelectSize = 'sm' | 'lg';

export interface SelectOptionShape {
  /** Icon name passed to `@m-next/svg-icon`. */
  icon?: string;
  /** Heading text rendered inside the card. Also used as the selection value. */
  title?: string;
  /** Optional descriptive text below the title. */
  description?: string;
  /** Disables interaction for this individual card. */
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id?: string;
  className?: string;
  /** Options to render as radio-cards. */
  options?: SelectOptionShape[];
  /** Fired with the full option object when the user picks a card. */
  onChange?: (option: SelectOptionShape) => void;
  /** The currently selected option's `title`. */
  selectedValue?: string | number;
  /** Alias of `selectedValue`. Forward-compatible name. */
  value?: string | number;
  /** Accessible label for the radiogroup. */
  label?: string;
  /** Card scale. `lg` is the default 80px icon / 24px padding; `sm` is 40px / 16px. */
  size?: SelectSize;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `size="sm"` or `size="lg"` — the new scale matches Button. */
  // Note: legacy callers may still pass `'small' | 'large'`; the runtime normalizes.

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries / container queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}

/**
 * Select renders a horizontal row of icon + title + description "radio cards".
 *
 * NOTE: this component is misleadingly named. It is NOT a `<select>` dropdown.
 * It is a radio-group chooser styled as cards (one-of-N selection). For the
 * standard form-select pattern, use `@m-next/dropdown` instead.
 *
 * The package name is kept as-is for Phase 3 (API-only cleanup). A future
 * Phase 5 may rename or alias the package.
 */
export const Select: React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<HTMLDivElement>
>;
export default Select;
