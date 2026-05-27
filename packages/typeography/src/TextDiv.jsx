import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Typeography from './Typeography';

// types
const propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  gutterBottom: PropTypes.number,
  bold: PropTypes.bool,
  fontSize: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge', 'mediumLarge']),
  style: PropTypes.instanceOf(Object),
  color: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltipHighlighting: PropTypes.bool,
  tooltipPlace: PropTypes.string,
  className: PropTypes.string,
  opacity: PropTypes.number,
};

const TextDiv = forwardRef(
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
    },
    ref,
  ) => (
    <Typeography
      ref={ref}
      id={id}
      gutterBottom={gutterBottom}
      variant='div'
      bold={bold}
      fontSize={fontSize}
      style={style}
      color={color}
      onClick={onClick}
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

TextDiv.displayName = 'TextDiv';
TextDiv.propTypes = propTypes;
export default TextDiv;
