/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface CaptionProps {
  /** Auto-generated if not supplied. */
  id?: string;

  /** Visible label content. Strings are rendered via dangerouslySetInnerHTML
   * for backwards-compatibility with legacy callers that pass HTML
   * fragments (e.g. Grid column headers). ReactNode values render
   * normally. */
  label?: React.ReactNode;

  /** Form-control id this label is bound to. Renders as the `for`
   * attribute on the label element. */
  htmlFor?: string;

  /** Text alignment for the label content. */
  align?: 'left' | 'center' | 'right';

  /** Explicit text color. Overrides the themed default when set. */
  color?: string;

  /** When true, appends a red asterisk to the rendered label. */
  required?: boolean;

  /** When false, the label renders in the negative / error color. */
  isValid?: boolean;

  /** When true, the label dims with the associated control. */
  disabled?: boolean;

  /** When true, the label reflects a read-only field. */
  readOnly?: boolean;

  /** When true, signals the associated control is focused (affects
   * floating-label color in `float` mode). */
  focused?: boolean;

  /** Floating-label mode: when true, the label translates upward and
   * shrinks (the classic "label floats above filled input" pattern).
   * When false, the label sits inline at the input baseline. */
  float?: boolean;

  /** Vertical offset (px) for the inline / unfocused floating-label
   * position. Defaults to 9. */
  floatYPos?: number;

  /** Horizontal offset applied when the label is in the floated
   * (above-input) position. */
  floatXPosFocus?: string | null;

  /** Horizontal offset applied when the label is in the inline
   * (at-baseline) position. */
  floatXPosUnfocus?: string | null;

  /** When true, removes the default 10px bottom margin. */
  narrow?: boolean;

  /** Style overrides. */
  style?: React.CSSProperties;

  /** Standard className escape hatch. */
  className?: string;

  /** Click handler on the label. */
  onClick?: (e: React.MouseEvent) => void;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: React.ReactNode;
  /** @deprecated Use `htmlFor` (React standard). */
  elFor?: string;
  /** @deprecated Use `readOnly` (React casing). */
  readonly?: boolean;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `className` / `style`. Still maps a handful of
   * `mi-caption-*` class names to inline styles for now. */
  legacyClass?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — labels are always
   * semi-bold in m-next. */
  isLabelBolded?: boolean;
  /** @deprecated No longer has any effect — style the surrounding
   * surface via the consumer's own container. */
  background?: string;
}

export const Caption: React.ForwardRefExoticComponent<
  CaptionProps & React.RefAttributes<HTMLElement>
>;
export default Caption;
