import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function Link2({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 13' fill='none'>
      <path
        d='M6.35983 10.05L5.77992 10.6299C5.25481 11.155 4.54262 11.45 3.80001 11.45C3.0574 11.45 2.34521 11.155 1.8201 10.6299C1.295 10.1048 1 9.39257 1 8.64996C1 7.90735 1.295 7.19515 1.8201 6.67005L4.78996 3.69957C5.28788 3.20053 5.95571 2.90767 6.6601 2.87947C7.36449 2.85127 8.0536 3.08981 8.58981 3.54746C9.12602 4.0051 9.46987 4.64817 9.55269 5.34824C9.63552 6.04831 9.45123 6.75387 9.03662 7.32401'
        stroke={color}
        strokeWidth='1.4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.75336 2.00271L10.22 1.53605C10.7451 1.01094 11.4573 0.715942 12.1999 0.715942C12.9425 0.715942 13.6547 1.01094 14.1798 1.53605C14.7049 2.06115 14.9999 2.77334 14.9999 3.51595C14.9999 4.25856 14.7049 4.97076 14.1798 5.49586L11.21 8.46572C10.712 8.96455 10.0441 9.25719 9.3398 9.28522C8.63548 9.31324 7.9465 9.07459 7.41042 8.61692C6.87434 8.15924 6.53061 7.5162 6.44784 6.8162C6.36508 6.1162 6.54938 5.41074 6.96394 4.84066'
        stroke={color}
        strokeWidth='1.4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
Link2.propTypes = propTypes;
export default Link2;
