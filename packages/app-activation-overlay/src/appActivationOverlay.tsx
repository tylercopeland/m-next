import React, { useState, useEffect, useRef } from 'react';
import SvgIcon, { type SvgIconName } from '@m-next/svg-icon';
import Button from '@m-next/button';
import CheckWithBackground from './CheckWithBackground';
import * as s from './appActivationOverlay.styles';

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
  topOffset?: number;
}

function AppActivationOverlay({
  id = 'app-activation-overlay',
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
  image,
  topOffset: topOffsetProp,
}: AppActivationOverlayProps) {
  const hasPrimary = showPrimaryCTA && primaryCTA;
  const hasSecondary = showSecondaryCTA && secondaryCTA;

  const [isMobile, setIsMobile] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0);
  const topOffset = topOffsetProp ?? 24;
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate left offset (for left nav)
  useEffect(() => {
    const nav = document.getElementById('platform-nav');
    const updateOffset = () => setLeftOffset(nav ? nav.offsetWidth : 0);

    updateOffset();

    if (nav) {
      const observer = new ResizeObserver(updateOffset);
      observer.observe(nav);
      return () => observer.disconnect();
    }

    return undefined;
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
    <s.OverlayBackdrop
      ref={overlayRef}
      id={`${id}-backdrop`}
      data-testid='overlay-backdrop'
      role='dialog'
      aria-modal='true'
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      style={{ left: leftOffset, width: `calc(100vw - ${leftOffset}px)` }}
    >
      <s.BannerCard id={id} data-testid='banner-card' style={{ marginTop: topOffset }}>
        <s.ContentWrapper>
          {/* Left Side - Content */}
          <s.LeftContent>
            {/* Icon */}
            {iconName && (
              <s.IconWrapper data-testid='icon-wrapper'>
                <SvgIcon name={iconName} size={24} color='#0D71C8' />
              </s.IconWrapper>
            )}

            {/* Inner Content */}
            <s.InnerWrapper>
              {/* Title and Description */}
              <s.TextSection>
                <s.Title id={`${id}-title`} data-testid='title'>
                  {title}
                </s.Title>
                <s.Description id={`${id}-description`} data-testid='description'>
                  {description}
                </s.Description>
              </s.TextSection>

              {/* Optional Section Title */}
              {sectionTitle && <s.SectionTitle data-testid='section-title'>{sectionTitle}</s.SectionTitle>}

              {/* Bullet Points */}
              {bulletPoints && bulletPoints.length > 0 && (
                <s.BulletPointsContainer data-testid='bullet-points'>
                  {bulletPoints.map((point) => (
                    <s.BulletPointRow key={point.id}>
                      <s.CheckIconWrapper>
                        <CheckWithBackground />
                      </s.CheckIconWrapper>
                      <s.BulletPointText>{point.text}</s.BulletPointText>
                    </s.BulletPointRow>
                  ))}
                </s.BulletPointsContainer>
              )}

              {/* Action Buttons */}
              {(hasPrimary || hasSecondary) && (
                <s.ButtonsContainer data-testid='buttons-container'>
                  {hasPrimary && (
                    <s.PrimaryButtonWrapper>
                      <Button
                        id={primaryCTA.id}
                        value={primaryCTA.text}
                        buttonStyle='primary'
                        onClick={primaryCTA.onClick}
                        style={ctaButtonStyle}
                        borderRadius={ctaButtonStyle.borderRadius}
                      />
                    </s.PrimaryButtonWrapper>
                  )}
                  {hasSecondary && (
                    <s.SecondaryButtonWrapper>
                      <Button
                        id={secondaryCTA.id}
                        value={secondaryCTA.text}
                        buttonStyle='ghost'
                        onClick={secondaryCTA.onClick}
                        style={ctaButtonStyle}
                        borderRadius={ctaButtonStyle.borderRadius}
                      />
                    </s.SecondaryButtonWrapper>
                  )}
                </s.ButtonsContainer>
              )}
            </s.InnerWrapper>
          </s.LeftContent>

          {/* Right Side - Mockup/Illustration */}
          {image && <s.RightContent data-testid='mockup-content'>{image}</s.RightContent>}
        </s.ContentWrapper>

        {/* Close Button */}
        {dismissible && onClose && (
          <s.CloseButton data-testid='close-button' onClick={onClose} aria-label='Close overlay'>
            <SvgIcon name='x-icon' size={12} color='grey' />
          </s.CloseButton>
        )}
      </s.BannerCard>
    </s.OverlayBackdrop>
  );
}

export default AppActivationOverlay;
