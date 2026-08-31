import React, { forwardRef, useState, useEffect, useRef } from 'react';
import SvgIcon, { type SvgIconName } from '@m-next/svg-icon';
import Button from '@m-next/button';
import CheckWithBackground from './CheckWithBackground';
import * as s from './appActivationOverlay.styles';
import { iconSize } from '@m-next/tokens';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

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
  /** Optional. Auto-generated when not provided. */
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

  // Soft-shimmed legacy props
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLDivElement> | null;

  // Silently ignored legacy ghosts
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect. */
  hidden?: boolean;

  [key: string]: unknown;
}

/**
 * AppActivationOverlay — modal-style banner for app-activation flows. Renders
 * a full-viewport backdrop and a centered card with title, description,
 * bullet points, up to two CTA buttons, and optional right-side illustration.
 */
const AppActivationOverlay = forwardRef<HTMLDivElement, AppActivationOverlayProps>(
  function AppActivationOverlay(props, ref) {
    const {
      id: idProp,
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

      // Soft-shimmed legacy props
      forwardRef: legacyForwardRef,

      // Silently ignored legacy ghosts
      isV4Design: _isV4Design,
      isMobile: _isMobile,
      legacyClass: _legacyClass,
      displayAuto: _displayAuto,
      compactStyle: _compactStyle,
      hidden: _hidden,

      ...rest
    } = props;

    // Auto-generate id if not provided.
    const internalIdRef = useRef<string | null>(null);
    if (internalIdRef.current === null) {
      // eslint-disable-next-line no-plusplus
      internalIdRef.current = `m-next-app-activation-overlay-${++autoIdCounter}`;
    }
    const id = idProp ?? internalIdRef.current;

    if (legacyForwardRef) {
      warnOnce(
        'app-activation-overlay-forwardRef-prop',
        '@m-next/app-activation-overlay: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
      );
    }

    const hasPrimary = showPrimaryCTA && primaryCTA;
    const hasSecondary = showSecondaryCTA && secondaryCTA;

    const [isViewportMobile, setIsViewportMobile] = useState(false);
    const [leftOffset, setLeftOffset] = useState(0);
    const topOffset = topOffsetProp ?? 24;
    const overlayRef = useRef<HTMLDivElement>(null);

    // Chain modern ref + legacy forwardRef prop onto the rendered backdrop.
    useEffect(() => {
      const assign = (target: typeof ref | typeof legacyForwardRef) => {
        if (!target) return;
        if (typeof target === 'function') {
          target(overlayRef.current);
        } else {
          // eslint-disable-next-line no-param-reassign
          (target as React.MutableRefObject<HTMLDivElement | null>).current = overlayRef.current;
        }
      };
      assign(ref);
      assign(legacyForwardRef);
    }, [ref, legacyForwardRef]);

    useEffect(() => {
      const checkScreenSize = () => {
        setIsViewportMobile(window.innerWidth <= 768);
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
      padding: isViewportMobile ? '12px 24px' : '8px 16px',
      borderRadius: isViewportMobile ? '70px !important' : '38px',
      fontFamily: 'Source Sans Pro',
      fontWeight: 600,
      fontSize: isViewportMobile ? '16px' : '14px',
      lineHeight: isViewportMobile ? '24px' : '16px',
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
        {...rest}
      >
        <s.BannerCard id={id} data-testid='banner-card' style={{ marginTop: topOffset }}>
          <s.ContentWrapper>
            {/* Left Side - Content */}
            <s.LeftContent>
              {/* Icon */}
              {iconName && (
                <s.IconWrapper data-testid='icon-wrapper'>
                  <SvgIcon name={iconName} size={iconSize.lg} color='#0D71C8' />
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
              <SvgIcon name='x-icon' size={iconSize.xs} color='grey' />
            </s.CloseButton>
          )}
        </s.BannerCard>
      </s.OverlayBackdrop>
    );
  },
);

AppActivationOverlay.displayName = 'AppActivationOverlay';

export default AppActivationOverlay;
