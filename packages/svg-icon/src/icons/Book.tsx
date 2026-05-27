import PropTypes from 'prop-types';
import React from 'react';

interface BookProps {
  height?: number;
  width?: number;
  color?: string;
}

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

const Book: React.FC<BookProps> = ({ height, width, color = 'currentColor' }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12 20.964V5.54774M12 20.964C12 20.964 9.82475 18.5515 2.48268 18.4523C2.36346 18.4489 2.25034 18.3988 2.16759 18.3129C2.08484 18.227 2.03904 18.1121 2.04002 17.9929V3.49553C2.03983 3.37311 2.08823 3.25562 2.17459 3.16885C2.21691 3.12609 2.26742 3.09229 2.32309 3.06947C2.37876 3.04666 2.43846 3.03529 2.49862 3.03605C9.82652 3.13343 12 5.54774 12 5.54774M12 20.964C12 20.964 14.1753 18.5515 21.5173 18.4523C21.6365 18.4489 21.7497 18.3988 21.8324 18.3129C21.9152 18.227 21.961 18.1121 21.96 17.9929V3.49553C21.9602 3.37311 21.9118 3.25562 21.8254 3.16885C21.7831 3.12609 21.7326 3.09229 21.6769 3.06947C21.6212 3.04666 21.5615 3.03529 21.5014 3.03605C14.1735 3.13343 12 5.54774 12 5.54774M9.34399 11.274C7.83738 10.7673 6.27263 10.4534 4.68714 10.34M9.34399 14.9881C7.83738 14.4813 6.27263 14.1675 4.68714 14.054M14.656 11.274C16.1626 10.7673 17.7273 10.4534 19.3128 10.34M14.656 14.9881C16.1626 14.4813 17.7273 14.1675 19.3128 14.054'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

Book.propTypes = propTypes;
export default Book;
