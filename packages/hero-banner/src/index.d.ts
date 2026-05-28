/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

/** Color family for the hero-banner background. */
export type HeroBannerBackground = 'blue' | 'orange' | 'green' | 'red';

export interface HeroBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Unique identifier. Auto-generated if omitted. */
  id?: string;
  /** Heading text — rendered as an H2. */
  title?: string;
  /** Supporting description text. */
  description?: React.ReactNode;
  /** Image source URL. */
  imageSrc?: string;
  /** Primary action button label. */
  primaryButton?: string;
  /** Primary action click handler. */
  onPrimaryButtonClick?: () => void;
  /** Primary button visual style. */
  primaryButtonStyle?: 'primary' | 'ghost';
  /** Custom color override for the primary button (text + border). */
  primaryButtonColor?: string;
  /** Secondary action button label. */
  secondaryButton?: string;
  /** Secondary action click handler. */
  onSecondaryButtonClick?: () => void;
  /**
   * Background color family for the banner. Accepts the canonical family
   * names. Legacy `-lighter` suffixed values (`'blue-lighter'`, etc.) still
   * work via the soft-shim but emit a one-time `console.warn`.
   */
  backgroundColor?: HeroBannerBackground | 'blue-lighter' | 'orange-lighter' | 'green-lighter' | 'red-lighter';
  /** When true, renders a close button in the top-right corner. */
  hasClose?: boolean;
  /** Click handler for the close button. */
  onClose?: () => void;
  /** Additional CSS classes. */
  className?: string;
  /** Custom inline styles. */
  style?: React.CSSProperties;
  /** Test identifier (rendered as `data-testid`). */
  testId?: string;
  /** Size of the dismiss icon in px. */
  dismissIconSize?: number;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `hasClose`. */
  canDismiss?: boolean;
  /** @deprecated Use `onClose`. */
  onBannerDismiss?: () => void;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — responsive behaviour is driven by CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}

declare const HeroBanner: React.ForwardRefExoticComponent<
  HeroBannerProps & React.RefAttributes<HTMLDivElement>
>;

export default HeroBanner;
