import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Typeography from './Typeography';

// types
const propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  gutterBottom: PropTypes.number,
  style: PropTypes.instanceOf(Object),
  color: PropTypes.string,
  bold: PropTypes.bool,
  fontSize: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge', 'mediumLarge']),
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltipHighlighting: PropTypes.bool,
  tooltipPlace: PropTypes.string,
  className: PropTypes.string,
  opacity: PropTypes.number,
  isMobile: PropTypes.bool,
  isV4: PropTypes.bool,
  ellipsis: PropTypes.bool,
};

const Text = forwardRef(
  (
    {
      id,
      children,
      gutterBottom,
      bold,
      fontSize,
      style,
      color,
      onClick,
      tooltip,
      tooltipId,
      tooltipPlace,
      tooltipHighlighting,
      className,
      opacity,
      isMobile,
      isV4,
      ellipsis,
    },
    ref,
  ) => (
    <Typeography
      ref={ref}
      id={id}
      gutterBottom={gutterBottom}
      variant='body2'
      style={style}
      color={color}
      bold={bold}
      fontSize={fontSize}
      onClick={onClick}
      tooltip={tooltip}
      tooltipId={tooltipId}
      tooltipPlace={tooltipPlace}
      tooltipHighlighting={tooltipHighlighting}
      className={className}
      opacity={opacity}
      isMobile={isMobile}
      isV4={isV4}
      ellipsis={ellipsis}
    >
      {children}
    </Typeography>
  ),
);

Text.displayName = 'Text';
Text.propTypes = propTypes;
export default Text;
