import React from 'react';
import PropTypes from 'prop-types';
import Image from '@m-next/image';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './HeroBanner.styles';

const propTypes = {
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
  backgroundColor: PropTypes.oneOf(['blue-lighter', 'orange-lighter', 'green-lighter', 'red-lighter']),
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  testId: PropTypes.string,
  isMobile: PropTypes.bool,
  canDismiss: PropTypes.bool,
  onBannerDismiss: PropTypes.func,
  dismissIconSize: PropTypes.number,
};

function HeroBanner({
  id = 'hero-banner',
  title = '',
  description = '',
  imageSrc = '',
  primaryButton = null,
  onPrimaryButtonClick = null,
  primaryButtonStyle = 'primary',
  primaryButtonColor = null,
  secondaryButton = null,
  onSecondaryButtonClick = null,
  backgroundColor = 'blue-lighter',
  className = '',
  style = {},
  testId = '',
  isMobile = false,
  canDismiss = false,
  onBannerDismiss = null,
  dismissIconSize = 12,
}) {
  return (
    <s.HeroBannerRoot
      id={`${id}-root`}
      className={className}
      style={style}
      backgroundColor={backgroundColor}
      isMobile={isMobile}
      data-testid={testId}
    >
      {canDismiss && onBannerDismiss && (
        <s.DismissButton
          onClick={onBannerDismiss}
          title='Dismiss'
          id={`${id}-dismiss`}
          data-testid={`${id}-dismiss-button`}
          aria-label='Dismiss banner'
          isMobile={isMobile}
        >
          <SvgIcon name='close-V4' size={dismissIconSize} color={lightTheme.content.emphasize} />
        </s.DismissButton>
      )}
      <s.HeroBannerContentWrapper isMobile={isMobile}>
        <s.HeroBannerImageContainer backgroundColor={backgroundColor} isMobile={isMobile}>
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

        <s.HeroBannerInnerWrapper isMobile={isMobile}>
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
                  color: '#111827',
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
                  color: '#4B5563',
                  whiteSpace: 'pre-line',
                }}
              >
                {description}
              </Text>
            )}
          </s.HeroBannerTextWrapper>

          {(primaryButton || secondaryButton) && (
            <s.HeroBannerActionsWrapper isMobile={isMobile}>
              {primaryButton && (
                <Button
                  id={`${id}-primary-button`}
                  buttonStyle={primaryButtonStyle}
                  value={primaryButton}
                  onClick={onPrimaryButtonClick}
                  data-testid={`${id}-primary-button`}
                  isMobile={isMobile}
                  style={
                    primaryButtonColor ? { color: primaryButtonColor, borderColor: primaryButtonColor } : undefined
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
                  isMobile={isMobile}
                />
              )}
            </s.HeroBannerActionsWrapper>
          )}
        </s.HeroBannerInnerWrapper>
      </s.HeroBannerContentWrapper>
    </s.HeroBannerRoot>
  );
}

HeroBanner.propTypes = propTypes;
export default HeroBanner;
