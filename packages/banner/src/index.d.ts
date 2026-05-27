/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

/** Visual status for the banner. Matches Alert's status set. */
export type BannerStatus = 'info' | 'success' | 'warning' | 'error';

/** Layout variant for the banner. */
export type BannerVariant = 'full' | 'trailing';

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Unique identifier for the banner. Auto-generated if omitted. */
  id?: string;
  /** Banner content. Pass any ReactNode — strings, JSX, etc. */
  children?: React.ReactNode;
  /** Text for the primary action button. */
  primaryButton?: string;
  /** Click handler for the primary button. */
  onPrimaryButtonClick?: () => void;
  /** Text for the secondary action button. */
  secondaryButton?: string;
  /** Click handler for the secondary button. */
  onSecondaryButtonClick?: () => void;
  /** Whether to show a close button. */
  hasClose?: boolean;
  /** Click handler for the close button. */
  onClose?: () => void;
  /** Layout variant of the banner. */
  variant?: BannerVariant;
  /** Visual status — drives theme colors and ARIA role. */
  status?: BannerStatus;
  /** Name of the icon to display in the icon slot. */
  icon?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Pass content as `children` instead. */
  message?: React.ReactNode;
  /** @deprecated Use `status` ('info' | 'success' | 'warning' | 'error'). Legacy values: 'informational' | 'clear' | 'loading' all map to 'info'. */
  severity?: 'informational' | 'success' | 'error' | 'warning' | 'clear' | 'loading' | BannerStatus;
  /** @deprecated Use `variant`. */
  bannerStyle?: BannerVariant;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
}

declare const Banner: React.ForwardRefExoticComponent<
  BannerProps & React.RefAttributes<HTMLDivElement>
>;

export default Banner;
