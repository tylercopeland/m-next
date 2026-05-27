import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  height: PropTypes.number,
};

function MethodLogo(props) {
  return (
    <img height={props?.height ?? 32} src='https://images.method.me/email/Method_Logo_darkblue_x2.png' alt='Method' />
  );
}

MethodLogo.propTypes = propTypes;
export default MethodLogo;
