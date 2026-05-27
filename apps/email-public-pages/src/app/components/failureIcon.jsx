import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';

function FailureIcon({ size }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '8px',
        alignItems: 'flex-start',
        gap: '10px',
        borderRadius: '100px',
        background: 'var(--Red-Red-Primary, #DA211E)',
      }}
    >
      <SvgIcon size={size} name='warning-sign' color='white' />
    </div>
  );
}

FailureIcon.propTypes = {
  size: PropTypes.number.isRequired,
};

export default FailureIcon;
