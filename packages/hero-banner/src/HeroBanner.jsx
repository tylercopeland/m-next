import React, { useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Image from '@m-next/image';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import * as s from './HeroBanner.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/banner.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

// Translate legacy backgroundColor strings (`'blue-lighter'`, etc.) to the new
// canonical color-family names. The new API accepts both the legacy `-lighter`
// suffixed values and the clean family names. Anything not recognised falls
// through to `'blue'`.
const VALID_BACKGROUNDS = new Set(['blue', 'orange', 'green', 'red']);
const translateBackground = (value) => {
  if (value == null) return 'blue';
  if (VALID_BACKGROUNDS.has(value)) return value;
  if (typeof value === 'string' && value.endsWith('-lighter')) {
    const stem = value.slice(0, -'-lighter'.length);
    if (VALID_BACKGROUNDS.has(stem)) return stem;
  }
  return 'blue';
};

let autoIdCounter = 0;

const HeroBanner = forwardRef(function HeroBanner(props, ref) {
  const {
    id: idProp,
    title = '',
    description = '',
    imageSrc = '',
    primaryButton = null,
    onPrimaryButtonClick = null,
    primaryButtonStyle = 'primary',
    primaryButtonColor = null,
    secondaryButton = null,
    onSecondaryButtonClick = null,

    // Clean API
    backgroundColor: backgroundColorProp,
    hasClose: hasCloseProp,
    onClose: onCloseProp,

    className = '',
    style = {},
    testId = '',
    dismissIconSize = 12,

    // Soft-shimmed legacy props
    canDismiss: legacyCanDismiss,
    onBannerDismiss: legacyOnBannerDismiss,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-hero-banner-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let backgroundColor = backgroundColorProp;
  if (
    typeof backgroundColorProp === 'string' &&
    backgroundColorProp.endsWith('-lighter')
  ) {
    warnOnce(
      'hero-banner-backgroundColor-lighter',
      `@m-next/hero-banner: backgroundColor='${backgroundColorProp}' is deprecated. Use '${backgroundColorProp.slice(0, -'-lighter'.length)}' instead.`,
    );
  }
  backgroundColor = translateBackground(backgroundColorProp);

  // hasClose / onClose replaces canDismiss / onBannerDismiss.
  let hasClose = hasCloseProp;
  if (hasClose == null && legacyCanDismiss != null) {
    warnOnce(
      'hero-banner-canDismiss',
      '@m-next/hero-banner: `canDismiss` is deprecated. Use `hasClose`.',
    );
    hasClose = legacyCanDismiss;
  }
  hasClose = Boolean(hasClose);

  let onClose = onCloseProp;
  if (onClose == null && legacyOnBannerDismiss != null) {
    warnOnce(
      'hero-banner-onBannerDismiss',
      '@m-next/hero-banner: `onBannerDismiss` is deprecated. Use `onClose`.',
    );
    onClose = legacyOnBannerDismiss;
  }

  if (legacyForwardRef) {
    warnOnce(
      'hero-banner-forwardRef-prop',
      '@m-next/hero-banner: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Ref forwarding ============

  const rootRef = useRef(null);
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(rootRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = rootRef.current;
    }
  }, [ref, legacyForwardRef]);

  return (
    <s.HeroBannerRoot
      ref={rootRef}
      id={`${id}-root`}
      className={className}
      style={style}
      backgroundColor={backgroundColor}
      data-testid={testId || undefined}
      role='region'
      aria-labelledby={title ? `${id}-title` : undefined}
      {...rest}
    >
      {hasClose && onClose && (
        <s.DismissButton
          type='button'
          onClick={onClose}
          title='Dismiss'
          id={`${id}-dismiss`}
          data-testid={`${id}-dismiss-button`}
          aria-label='Dismiss banner'
        >
          <SvgIcon name='close-V4' size={dismissIconSize} color={colors.grey.darkest} />
        </s.DismissButton>
      )}
      <s.HeroBannerContentWrapper>
        <s.HeroBannerImageContainer backgroundColor={backgroundColor}>
          {imageSrc && (
            <s.HeroBannerImageWrapper>
              <Image
                value={imageSrc}
                imgType='Fixed'
                id={`${id}-img`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </s.HeroBannerImageWrapper>
          )}
        </s.HeroBannerImageContainer>

        <s.HeroBannerInnerWrapper>
          <s.HeroBannerTextWrapper>
            {title && (
              <Text
                as='H2'
                id={`${id}-title`}
                data-testid={`${id}-title`}
                fontSize='xxlarge'
                bold
                style={{
                  fontSize: '24px',
                  lineHeight: '32px',
                  marginBottom: '0px',
                  marginTop: '0px',
                  color: colors.grey.darkest,
                }}
              >
                {title}
              </Text>
            )}
            {description && (
              <Text
                as='P'
                id={`${id}-description`}
                data-testid={`${id}-description`}
                fontSize='mediumLarge'
                style={{
                  fontSize: '16px',
                  lineHeight: '24px',
                  marginBottom: '0px',
                  marginTop: '0px',
                  color: colors.grey.base,
                  whiteSpace: 'pre-line',
                }}
              >
                {description}
              </Text>
            )}
          </s.HeroBannerTextWrapper>

          {(primaryButton || secondaryButton) && (
            <s.HeroBannerActionsWrapper>
              {primaryButton && (
                <Button
                  id={`${id}-primary-button`}
                  buttonStyle={primaryButtonStyle}
                  value={primaryButton}
                  onClick={onPrimaryButtonClick}
                  data-testid={`${id}-primary-button`}
                  style={
                    primaryButtonColor
                      ? { color: primaryButtonColor, borderColor: primaryButtonColor }
                      : undefined
                  }
                />
              )}
              {secondaryButton && (
                <Button
                  id={`${id}-secondary-button`}
                  buttonStyle='ghost'
                  value={secondaryButton}
                  onClick={onSecondaryButtonClick}
                  data-testid={`${id}-secondary-button`}
                />
              )}
            </s.HeroBannerActionsWrapper>
          )}
        </s.HeroBannerInnerWrapper>
      </s.HeroBannerContentWrapper>
    </s.HeroBannerRoot>
  );
});

HeroBanner.displayName = 'HeroBanner';

HeroBanner.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.node,
  imageSrc: PropTypes.string,
  primaryButton: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
  primaryButtonStyle: PropTypes.oneOf(['primary', 'ghost']),
  primaryButtonColor: PropTypes.string,
  secondaryButton: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  backgroundColor: PropTypes.oneOf([
    'blue',
    'orange',
    'green',
    'red',
    // Legacy:
    'blue-lighter',
    'orange-lighter',
    'green-lighter',
    'red-lighter',
  ]),
  hasClose: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  testId: PropTypes.string,
  dismissIconSize: PropTypes.number,
  // Soft-shimmed legacy:
  canDismiss: PropTypes.bool,
  onBannerDismiss: PropTypes.func,
  forwardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  // Silently ignored:
  isV4Design: PropTypes.bool,
  isMobile: PropTypes.bool,
  legacyClass: PropTypes.string,
  displayAuto: PropTypes.bool,
};

export default HeroBanner;
