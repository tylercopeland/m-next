import React from 'react';
import PropTypes from 'prop-types';
import { lightTheme, convertLegacyCaptionStyle } from '@m-next/styles';
import * as s from './caption.styles';

const propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  color: PropTypes.string,
  elFor: PropTypes.string,
  id: PropTypes.string,
  focused: PropTypes.bool,
  isMobile: PropTypes.bool,
  label: PropTypes.string,
  required: PropTypes.bool,
  style: PropTypes.shape({}),
  legacyClass: PropTypes.string,
  isValid: PropTypes.bool,
  isV4Design: PropTypes.bool,
  float: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  background: PropTypes.string,
  floatYPos: PropTypes.number,
  floatXPosFocus: PropTypes.string,
  floatXPosUnfocus: PropTypes.string,
  isLabelBolded: PropTypes.bool,
  narrow: PropTypes.bool,
  onClick: PropTypes.func,
};

function Caption({
  align = 'left',
  id = null,
  label = null,
  elFor = '',
  required = false,
  style = null,
  legacyClass = null,
  color,
  isValid = true,
  isV4Design,
  isMobile = false,
  float = false,
  focused = false,
  disabled = false,
  readOnly = false,
  background = null,
  floatYPos = 9,
  floatXPosFocus = null,
  floatXPosUnfocus = null,
  isLabelBolded = true,
  narrow = false,
  onClick = null,
}) {
  return (
    <s.CaptionWrapper
      id={`${id}-Caption`}
      htmlFor={elFor}
      align={align}
      color={isValid ? color : lightTheme.negative.secondary}
      style={{ ...convertLegacyCaptionStyle(legacyClass), ...style }}
      isV4Design={isV4Design}
      float={float}
      focused={focused}
      disabled={disabled}
      readOnly={readOnly}
      isValid={isValid}
      isMobile={isMobile}
      background={background}
      floatYPos={floatYPos}
      floatXPosFocus={floatXPosFocus}
      floatXPosUnfocus={floatXPosUnfocus}
      isLabelBolded={isLabelBolded}
      narrow={narrow}
      onClick={onClick}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: required ? `${label.trim()}<span style="color: red">*</span>` : label.trim(),
      }}
    />
  );
}

Caption.propTypes = propTypes;

export default Caption;
