import React from 'react';
import { SvgIconName } from '@m-next/svg-icon';

export interface AppActivationOverlayCTA {
  id: string;
  text: string;
  onClick: () => void;
}

export interface AppActivationOverlayBulletPoint {
  id: string;
  text: string;
}

export interface AppActivationOverlayProps {
  id?: string;
  iconName?: SvgIconName;
  title: string;
  description: string;
  sectionTitle?: string;
  bulletPoints?: AppActivationOverlayBulletPoint[];
  primaryCTA?: AppActivationOverlayCTA;
  secondaryCTA?: AppActivationOverlayCTA;
  showPrimaryCTA?: boolean;
  showSecondaryCTA?: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  image?: React.ReactNode;
}

declare const AppActivationOverlay: React.FC<AppActivationOverlayProps>;

export default AppActivationOverlay;
