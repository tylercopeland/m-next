import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import BannerContent from './bannerContent';
import * as s from './banner.styles';

// types
const propTypes = {
  id: PropTypes.string,
  message: PropTypes.node,
  primaryButton: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
  secondaryButton: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  children: PropTypes.node,
  hasClose: PropTypes.bool,
  onClose: PropTypes.func,
  bannerStyle: PropTypes.oneOf(['full', 'trailing']),
  severity: PropTypes.oneOf(['informational', 'success', 'error', 'warning', 'clear', 'loading']),
  icon: PropTypes.string,
};

/**
 * Wrapper component around
 */
function Banner({
  id = '',
  message = '',
  primaryButton = null,
  onPrimaryButtonClick = null,
  secondaryButton = null,
  onSecondaryButtonClick = null,
  hasClose = false,
  onClose = null,
  bannerStyle = 'full',
  severity = 'informational',
  icon = null,
  children,
}) {
  return (
    <s.BannerRoot id={`banner-${id}`} severity={severity}>
      <BannerContent
        message={message}
        bannerStyle={bannerStyle}
        severity={severity}
        secondaryAction={
          secondaryButton ? (
            <s.BannerActionButton
              severity={severity}
              type='button'
              id={`banner-content-secondary-button-${id}`}
              onClick={onSecondaryButtonClick}
            >
              {secondaryButton}
            </s.BannerActionButton>
          ) : null
        }
        primaryAction={
          primaryButton ? (
            <s.BannerActionButton
              severity={severity}
              type='button'
              id={`banner-content-primary-button-${id}`}
              onClick={onPrimaryButtonClick}
            >
              {primaryButton}
            </s.BannerActionButton>
          ) : null
        }
        icon={icon}
      >
        {children}
      </BannerContent>
      {hasClose && (
        <SvgIcon
          id={`banner-content-close-${id}`}
          // style={CSSProperties.lead}
          name='close-V4'
          size={16}
          caption='close'
          onClick={onClose}
          style={{ margin: '8px 0px' }}
          color={lightTheme.content.subtle}
        />
      )}
    </s.BannerRoot>
  );
}

Banner.propTypes = propTypes;
export default Banner;
