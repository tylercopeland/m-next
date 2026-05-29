/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  id?: string;
  count?: number;
  width?: string | number;
  height?: string | number;
  /** Shape variant. 'circle' renders a round skeleton; 'text' / 'rect' render rectangles. */
  variant?: SkeletonVariant;
  /** Base shimmer color. Defaults to `colors.grey.lighter` from `@m-next/tokens`. */
  baseColor?: string;
  /** Highlight shimmer color. Defaults to `colors.white` from `@m-next/tokens`. */
  highlightColor?: string;
  /** Border radius override. */
  borderRadius?: string | number;
  /** Shimmer animation duration in seconds. */
  duration?: number;
  /** Render inline rather than block-level. */
  inline?: boolean;
  /** Accessible label, announced by screen readers. Default 'Loading'. */
  label?: string;
  style?: React.CSSProperties;
  className?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `variant="circle"`. */
  circle?: boolean;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

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

/** Backwards-compatible alias kept for legacy import paths. */
export type LoadingSkeletonProps = SkeletonProps;

export const Skeleton: React.ForwardRefExoticComponent<
  SkeletonProps & React.RefAttributes<HTMLSpanElement>
>;
export const LoadingSkeleton: React.ForwardRefExoticComponent<
  SkeletonProps & React.RefAttributes<HTMLSpanElement>
>;
declare const _default: typeof LoadingSkeleton;
export default _default;
