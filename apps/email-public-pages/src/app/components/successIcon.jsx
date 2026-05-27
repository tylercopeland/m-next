import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';

function SuccessIcon({ size }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '8px',
        alignItems: 'flex-start',
        gap: '10px',
        borderRadius: '100px',
        background: 'var(--Green-Green-Primary, #007B4A)',
      }}
    >
      <SvgIcon size={size} name='check-circle' color='white' />
    </div>
  );
}

SuccessIcon.propTypes = { size: PropTypes.number.isRequired };
export default SuccessIcon;
