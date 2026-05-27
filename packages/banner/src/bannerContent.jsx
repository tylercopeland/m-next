import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './banner.styles';

// types
const propTypes = {
  message: PropTypes.node,
  primaryAction: PropTypes.node,
  secondaryAction: PropTypes.node,
  id: PropTypes.string,
  bannerStyle: PropTypes.oneOf(['full', 'trailing']),
  severity: PropTypes.oneOf(['informational', 'success', 'error', 'warning', 'clear', 'loading']),
  icon: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Wrapper component around
 */
function BannerContent({
  id = '',
  message = '',
  primaryAction = null,
  secondaryAction = null,
  bannerStyle = 'full',
  severity = 'informational',
  icon = null,
  children,
}) {
  return (
    <s.BannerContentWrapper>
      {icon && (
        <s.BannerContentIcon severity={severity}>
          <SvgIcon
            id={`banner-content-icon-${id}`}
            name={icon}
            size={16}
            color={(() => {
              switch (severity) {
                case 'error':
                  return lightTheme.negative.icon;
                case 'success':
                  return lightTheme.positive.icon;
                case 'warning':
                  return lightTheme.warning.icon;
                default:
                  return lightTheme.informative.icon;
              }
            })()}
          />
        </s.BannerContentIcon>
      )}

      <s.BannerContent id={`banner-content-${id}`}>
        <s.BannerContentMessage id={`banner-content-message-${id}`} bannerStyle={bannerStyle} severity={severity}>
          {children ?? message}
        </s.BannerContentMessage>
        <s.BannerContentActionBlock>
          {secondaryAction ? (
            <s.BannerContentSectionAction id={`banner-content-secondary-${id}`} severity={severity}>
              {secondaryAction}
            </s.BannerContentSectionAction>
          ) : null}

          {primaryAction ? (
            <s.BannerContentPrimaryAction id={`banner-content-primary-${id}`} severity={severity}>
              {primaryAction}
            </s.BannerContentPrimaryAction>
          ) : null}
        </s.BannerContentActionBlock>
      </s.BannerContent>
    </s.BannerContentWrapper>
  );
}

BannerContent.propTypes = propTypes;
export default BannerContent;
