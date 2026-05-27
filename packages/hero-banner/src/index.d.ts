import React from 'react';

export interface HeroBannerProps {
  id?: string;
  title?: string;
  description?: string;
  icon?: string;
  iconContainerStyle?: React.CSSProperties;
  imageSrc?: string;
  primaryButton?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButton?: string;
  onSecondaryButtonClick?: () => void;
  backgroundColor?: 'blue-lighter' | 'orange-lighter' | 'green-lighter';
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
  isMobile?: boolean;
}

declare const HeroBanner: React.FC<HeroBannerProps>;
export default HeroBanner;