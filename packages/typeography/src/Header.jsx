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
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  fontSize: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge', 'mediumLarge']),
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltipPlace: PropTypes.string,
  tooltipHighlighting: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  opacity: PropTypes.number,
};

const Header = forwardRef(
  (
    {
      id,
      children,
      gutterBottom,
      style,
      color,
      bold,
      variant = 'h1',
      fontSize,
      tooltip,
      tooltipId,
      tooltipPlace,
      tooltipHighlighting,
      onClick,
      className,
      opacity,
    },
    ref,
  ) => (
    <Typeography
      ref={ref}
      id={id}
      gutterBottom={gutterBottom}
      variant={variant}
      style={style}
      color={color}
      onClick={onClick}
      bold={bold}
      fontSize={fontSize}
      tooltip={tooltip}
      tooltipId={tooltipId}
      tooltipPlace={tooltipPlace}
      tooltipHighlighting={tooltipHighlighting}
      className={className}
      opacity={opacity}
    >
      {children}
    </Typeography>
  ),
);

Header.displayName = 'Header';
Header.propTypes = propTypes;
export default Header;
