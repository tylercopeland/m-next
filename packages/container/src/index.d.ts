/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface ContainerProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  isLoading?: boolean;
  children?: React.ReactNode;
  isVisible?: boolean;
  hasChildLoading?: boolean;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  padding?: number | string;
  isRound?: boolean;
  borderless?: boolean;
  scrollable?: boolean;
  scrollableRef?: React.RefObject<any>;

  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  // eslint-disable-next-line no-unused-vars
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;

  // ============ Deprecated — soft-shimmed ============
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
  /** @deprecated No longer has any effect — don't render instead (use `isVisible={false}`). */
  hidden?: boolean;
}

export interface InfiniteScrollContainerProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  isLoading?: boolean;
  children?: React.ReactNode;
  isVisible?: boolean;
  hasChildLoading?: boolean;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  padding?: number | string;
  tabIndex?: number;

  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  /** Called when the bottom-of-list sentinel becomes visible. Wire up to your paginated-load action. */
  fetchData?: () => void;
  /** When set, renders an error string below the scroll area. */
  error?: string;
  /** Optional ref passed to SimpleBar's internal scrollable node. */
  scrollRef?: React.RefObject<any>;

  // ============ Deprecated — soft-shimmed ============
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
  /** @deprecated No longer has any effect — don't render instead (use `isVisible={false}`). */
  hidden?: boolean;
}

export const Container: React.ForwardRefExoticComponent<
  ContainerProps & React.RefAttributes<HTMLDivElement>
>;

export const InfiniteScrollContainer: React.ForwardRefExoticComponent<
  InfiniteScrollContainerProps & React.RefAttributes<HTMLDivElement>
>;

export default Container;
