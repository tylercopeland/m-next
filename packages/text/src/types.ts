import type { CSSProperties, ReactNode, Ref } from 'react';

/**
 * Which HTML element Text renders as.
 * Accepted uppercase for backwards-compatibility with the legacy API.
 */
export type TextWrapperType = 'P' | 'DIV' | 'H1';

export interface TextProps {
  /** Optional. Auto-generated when not provided. */
  id?: string;
  /** HTML element to render. */
  as?: TextWrapperType;
  /** Font size with units (e.g., "14px"). Inline style. */
  fontSize?: string;
  /** Text colour. Any CSS colour string. */
  fontColor?: string;
  /** Line-height with units (e.g., "20px"). */
  lineHeight?: string;
  /** Font weight (CSS string or numeric weight). */
  fontWeight?: string | number;
  /** Margin top (CSS length string). */
  mt?: string;
  /** Margin bottom (CSS length string). */
  mb?: string;
  /** Margin right (CSS length string). */
  mr?: string;
  /** Margin left (CSS length string). */
  ml?: string;
  /** CSS word-break value. */
  wordBreak?: string;
  /** CSS white-space value. */
  whiteSpace?: string;
  /** CSS overflow value. Defaults to 'visible'. */
  overflow?: string;
  /** Inline style overrides merged after the base text styles. */
  inlineStyling?: Record<string, unknown> | null;
  /** Native tabIndex. */
  tabIndex?: number;
  /** When true, fontSize is emitted with `!important` to win specificity battles. */
  overrideFontSize?: boolean;
  /** Centers the text via `text-align: center`. */
  center?: boolean;
  /** Children to render inside the element. */
  children?: ReactNode;
  /** Native `style` attribute — merged on top of generated inline styles. */
  style?: CSSProperties;
  /** Aligns an attached pseudo-element icon. */
  iconAlign?: string;
  /** Reflexbox-style `sx` overrides (still respected on the DIV variant for back-compat). */
  sx?: Record<string, unknown>;

  // ============ Legacy class translation — kept functional ============
  /**
   * Space-separated list of legacy `mi-*` / `font-*` class names. Translated
   * to inline styles by the bundled classConverter for backwards-compatibility
   * with Method UI 3 markup that pre-dates the design tokens.
   */
  legacyClasses?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: Ref<HTMLElement> | null;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `legacyClasses` or `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;

  // Allow native HTML attributes and data-* / aria-* to pass through.
  [key: string]: unknown;
}
