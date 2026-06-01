import React, { forwardRef, useEffect, useRef, useState } from 'react';
import SvgIcon, { type SvgIconName } from '@m-next/svg-icon';
import Button from '@m-next/button';
import CheckWithBackground from '../components/CheckWithBackground';
import * as s from './appActivationBanner.styles';

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
  /** Optional. Auto-generated when not provided. */
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

  [key: string]: unknown;
}

/**
 * AppActivationBanner — promotional banner for app-activation flows. Title,
 * description, optional icon, optional bullet-point list, and up to two CTA
 * buttons (primary + secondary). Dismissible by default.
 */
const AppActivationBanner = forwardRef<HTMLDivElement, AppActivationBannerProps>(
  function AppActivationBanner(props, ref) {
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
      backgroundColor = 'blue-lighter',

      // Soft-shimmed legacy props
      forwardRef: legacyForwardRef,

      // Silently ignored legacy ghosts
      isV4Design: _isV4Design,
      isMobile: _isMobile,
      legacyClass: _legacyClass,
      displayAuto: _displayAuto,
      compactStyle: _compactStyle,

      ...rest
    } = props;

    // Auto-generate id if not provided.
    const internalIdRef = useRef<string | null>(null);
    if (internalIdRef.current === null) {
      // eslint-disable-next-line no-plusplus
      internalIdRef.current = `m-next-app-activation-banner-${++autoIdCounter}`;
    }
    const id = idProp ?? internalIdRef.current;

    if (legacyForwardRef) {
      warnOnce(
        'app-activation-banner-forwardRef-prop',
        '@m-next/app-activation-banner: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
      );
    }

    // Chain modern ref + legacy forwardRef prop onto the rendered root element.
    const internalElRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const assign = (target: typeof ref | typeof legacyForwardRef) => {
        if (!target) return;
        if (typeof target === 'function') {
          target(internalElRef.current);
        } else {
          // eslint-disable-next-line no-param-reassign
          (target as React.MutableRefObject<HTMLDivElement | null>).current = internalElRef.current;
        }
      };
      assign(ref);
      assign(legacyForwardRef);
    }, [ref, legacyForwardRef]);

    const setRef = (node: HTMLDivElement | null) => {
      internalElRef.current = node;
    };

    const hasPrimary = showPrimaryCTA && primaryCTA;
    const hasSecondary = showSecondaryCTA && secondaryCTA;

    const [isViewportMobile, setIsViewportMobile] = useState(false);

    useEffect(() => {
      const checkScreenSize = () => {
        setIsViewportMobile(window.innerWidth <= 768);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);

      return () => window.removeEventListener('resize', checkScreenSize);
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
      <s.BannerWrapper id={id} backgroundColor={backgroundColor} ref={setRef} {...rest}>
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
  },
);

AppActivationBanner.displayName = 'AppActivationBanner';

export default AppActivationBanner;
