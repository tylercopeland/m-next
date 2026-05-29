import type { Ref, CSSProperties, ReactNode } from 'react';

/** Size variant for the segmented control. */
export type PillTabSize = 'sm' | 'md';

export interface PillTabOption<T = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * SegmentedControl / PillTab props.
 * `options` may also be passed as `items` (legacy alias) and `value` as `selected` (legacy alias).
 */
export interface PillTabProps<T = string> {
  /** Optional. Auto-generated when not provided. */
  id?: string;
  /** The selectable options. */
  options?: PillTabOption<T>[];
  /** Controlled selected value. */
  value?: T;
  // eslint-disable-next-line no-unused-vars -- callback param for type signature only
  onChange?: (value: T) => void;
  className?: string;
  style?: CSSProperties;
  /** Visual size variant. */
  size?: PillTabSize;
  /** Accessible label for the radiogroup. */
  'aria-label'?: string;
  /** Reference an element that labels the radiogroup. */
  'aria-labelledby'?: string;
  'data-testid'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `options`. */
  items?: PillTabOption<T>[];
  /** @deprecated Use `value`. */
  selected?: T;
  /** @deprecated `narrow` → `sm`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legacySize?: any;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: Ref<HTMLDivElement> | null;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}
