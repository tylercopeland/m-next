import * as React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './banner.styles';

const propTypes = {
  id: PropTypes.string,
  primaryAction: PropTypes.node,
  secondaryAction: PropTypes.node,
  variant: PropTypes.oneOf(['full', 'trailing']),
  status: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  icon: PropTypes.string,
  children: PropTypes.node,
};

function BannerContent({
  id = '',
  primaryAction = null,
  secondaryAction = null,
  variant = 'full',
  status = 'info',
  icon = null,
  children,
}) {
  return (
    <s.BannerContentWrapper>
      {icon && (
        <s.BannerContentIcon status={status}>
          <SvgIcon
            id={`banner-content-icon-${id}`}
            name={icon}
            size={16}
            color={(() => {
              switch (status) {
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
        <s.BannerContentMessage id={`banner-content-message-${id}`} variant={variant} status={status}>
          {children}
        </s.BannerContentMessage>
        <s.BannerContentActionBlock>
          {secondaryAction ? (
            <s.BannerContentSectionAction id={`banner-content-secondary-${id}`} status={status}>
              {secondaryAction}
            </s.BannerContentSectionAction>
          ) : null}

          {primaryAction ? (
            <s.BannerContentPrimaryAction id={`banner-content-primary-${id}`} status={status}>
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
