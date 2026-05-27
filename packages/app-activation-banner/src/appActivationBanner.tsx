import React, { useEffect, useState } from 'react';
import SvgIcon, { type SvgIconName } from '@m-next/svg-icon';
import Button from '@m-next/button';
import CheckWithBackground from '../components/CheckWithBackground';
import * as s from './appActivationBanner.styles';

export interface AppActivationBannerCTA {
  id: string;
  text: string;
  onClick: () => void;
}

export interface AppActivationBannerBulletPoint {
  id: string;
  text: string;
  icon?: string;
}

export interface AppActivationBannerProps {
  id?: string;
  iconName?: SvgIconName;
  title: string;
  description: string;
  sectionTitle?: string;
  bulletPoints?: AppActivationBannerBulletPoint[];
  primaryCTA?: AppActivationBannerCTA;
  secondaryCTA?: AppActivationBannerCTA;
  showPrimaryCTA?: boolean;
  showSecondaryCTA?: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  backgroundColor?: string;
}

function AppActivationBanner({
  id = 'app-activation-banner',
  iconName,
  title,
  description,
  sectionTitle,
  bulletPoints = [],
  primaryCTA,
  secondaryCTA,
  showPrimaryCTA = true,
  showSecondaryCTA = true,
  dismissible = true,
  onClose,
  backgroundColor = 'blue-lighter',
}: AppActivationBannerProps) {
  const hasPrimary = showPrimaryCTA && primaryCTA;
  const hasSecondary = showSecondaryCTA && secondaryCTA;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const ctaButtonStyle = {
    padding: isMobile ? '12px 24px' : '8px 16px',
    borderRadius: isMobile ? '70px !important' : '38px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    fontSize: isMobile ? '16px' : '14px',
    lineHeight: isMobile ? '24px' : '16px',
  };

  return (
    <s.BannerWrapper id={id} backgroundColor={backgroundColor}>
      <s.ContentWrapper>
        {/* Icon */}
        {iconName && (
          <s.IconWrapper data-testid='icon-wrapper'>
            <SvgIcon name={iconName} size={20} color='#0D71C8' />
          </s.IconWrapper>
        )}

        {/* Inner Content */}
        <s.InnerWrapper>
          {/* Title and Description */}
          <s.TextSection>
            <s.Title data-testid='title'>{title}</s.Title>
            <s.Description data-testid='description'>{description}</s.Description>
          </s.TextSection>

          {/* Optional Section Title */}
          {sectionTitle && <s.SectionTitle data-testid='section-title'>{sectionTitle}</s.SectionTitle>}

          {/* Bullet Points */}
          {bulletPoints && bulletPoints.length > 0 && (
            <s.BulletPointsContainer data-testid='bullet-column'>
              {bulletPoints.map((point) => (
                <s.BulletPointRow key={point.id}>
                  <s.IconContainer>
                    <CheckWithBackground />
                  </s.IconContainer>
                  <s.BulletPointText>{point.text}</s.BulletPointText>
                </s.BulletPointRow>
              ))}
            </s.BulletPointsContainer>
          )}

          {/* Action Buttons */}
          {(hasPrimary || hasSecondary) && (
            <s.ButtonsContainer data-testid='buttons-container'>
              {hasPrimary && (
                <Button
                  id={primaryCTA?.id}
                  value={primaryCTA?.text}
                  buttonStyle='primary'
                  onClick={primaryCTA?.onClick}
                  style={ctaButtonStyle}
                  borderRadius={ctaButtonStyle.borderRadius}
                />
              )}
              {hasSecondary && (
                <Button
                  id={secondaryCTA?.id}
                  value={secondaryCTA?.text}
                  buttonStyle='ghost'
                  onClick={secondaryCTA?.onClick}
                  style={ctaButtonStyle}
                  borderRadius={ctaButtonStyle.borderRadius}
                />
              )}
            </s.ButtonsContainer>
          )}
        </s.InnerWrapper>
      </s.ContentWrapper>

      {/* Close Button */}
      {dismissible && onClose && (
        <s.CloseButton data-testid='close-button' onClick={onClose} aria-label='Close banner'>
          <SvgIcon name='close-V4' size={12} color='grey' />
        </s.CloseButton>
      )}
    </s.BannerWrapper>
  );
}

export default AppActivationBanner;
