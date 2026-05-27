import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function EyeClosed({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 20.244c-5.438 0-10.087-3.363-12-8.123a12.86 12.86 0 0 1 3.457-4.884l.178-.157L1.19 4.634l1.108-1.1 18.29 18.29-1.1 1.109-3.365-3.366-.13.043a12.7 12.7 0 0 1-3.992.634m0-11.238a3.115 3.115 0 0 1 3.04 3.804L11.31 9.082q.34-.077.689-.076m0-3.227c-1.19 0-2.358.19-3.454.526L7.164 4.933A13 13 0 0 1 12 3.999c5.438 0 10.087 3.363 12 8.122a12.9 12.9 0 0 1-4.19 5.481l-1.258-1.268a11.2 11.2 0 0 0 3.462-4.115l.048-.098-.048-.098A11.15 11.15 0 0 0 12 5.78M1.987 12.023l-.049.098.048.098A11.15 11.15 0 0 0 12 18.464c.782 0 1.555-.08 2.274-.24l.394-.087-2.877-2.89-.079-.009a3.186 3.186 0 0 1-2.829-2.829l-.008-.078L4.89 8.335l-.157.135a11.2 11.2 0 0 0-2.747 3.553'
        fill={color}
      />
    </svg>
  );
}
EyeClosed.propTypes = propTypes;
export default EyeClosed;
