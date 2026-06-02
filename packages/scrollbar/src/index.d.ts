import * as React from 'react';
import SimpleBar from 'simplebar-react';

export interface ScrollbarProps {
  /** Auto-generated when not provided. */
  id?: string;
  /**
   * Vertical space reserved at the top of the scroll container.
   * Translated internally to `maxHeight: calc(100% - <offset>)`. Number is
   * treated as pixels; strings pass through as CSS lengths.
   */
  offset?: number | string;
  /** When false, the component renders nothing. */
  isVisible?: boolean;
  /** Explicit max-height. Overrides any `offset`-derived calc. */
  maxHeight?: number | string;
  /** Explicit height. Defaults to '100%' so SimpleBar has something to size against. */
  height?: number | string;
  className?: string;
  children?: React.ReactNode;

  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<SimpleBar> | null;
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

declare const Scrollbar: React.ForwardRefExoticComponent<
  ScrollbarProps & React.RefAttributes<SimpleBar>
>;

export default Scrollbar;
