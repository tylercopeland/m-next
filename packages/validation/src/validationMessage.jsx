import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './validationMessage.styles';

const propTypes = {
  id: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isV4Design: PropTypes.bool,
  compactStyle: PropTypes.bool,
};

function ValidationMessage({ message = null, id = null, isV4Design = true, compactStyle = false }) {
  return message ? (
    <s.ValidationMessageWrapper isV4Design={isV4Design} compactStyle={compactStyle}>
      {isV4Design && (
        <SvgIcon
          id={`${id}-validation-icon`}
          name='warning-sign'
          size={14}
          color={lightTheme.negative.secondary}
          style={{ paddingRight: '4px' }}
        />
      )}
      <s.ValidationMessage id={`${id}-validation2`} isV4Design={isV4Design} compactStyle={compactStyle}>
        {' '}
        {message}{' '}
      </s.ValidationMessage>
    </s.ValidationMessageWrapper>
  ) : null;
}

ValidationMessage.propTypes = propTypes;
export default ValidationMessage;
