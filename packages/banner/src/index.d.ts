import React from 'react';

// Banner severity types
export type BannerSeverity = 'informational' | 'success' | 'error' | 'warning' | 'clear';

// Banner style types
export type BannerStyle = 'full' | 'trailing';

// Banner component props
export interface BannerProps {
  /** Unique identifier for the banner */
  id?: string;
  /** Message content to display in the banner */
  message?: React.ReactNode;
  /** Text for the primary action button */
  primaryButton?: string;
  /** Click handler for the primary button */
  onPrimaryButtonClick?: () => void;
  /** Text for the secondary action button */
  secondaryButton?: string;
  /** Click handler for the secondary button */
  onSecondaryButtonClick?: () => void;
  /** Child content to display in the banner */
  children?: React.ReactNode;
  /** Whether to show a close button */
  hasClose?: boolean;
  /** Click handler for the close button */
  onClose?: () => void;
  /** Style variant of the banner */
  bannerStyle?: BannerStyle;
  /** Severity level that affects styling and icon */
  severity?: BannerSeverity;
  /** Name of the icon to display */
  icon?: string;
}

// Banner component
declare const Banner: React.FC<BannerProps>;

export default Banner;