import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function FormulaWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M10.25 11.5a.25.25 0 0 1 .049.495.25.25 0 0 1-.299-.245.25.25 0 0 1 .25-.25m2.5 0a.25.25 0 0 1 .049.495.25.25 0 0 1-.299-.245.25.25 0 0 1 .25-.25m-2.5 2a.25.25 0 0 1 .049.495.25.25 0 0 1-.299-.245.25.25 0 0 1 .25-.25'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.75 13.5a.25.25 0 0 1 .049.495c-.049-1.99-.099-1.995-.145-2.014a.25.25 0 0 1 .096-.481Zm.75-4.333c0 .235-.143.333-.286.333H9.786c-.143 0-.285-.11-.285-.345V7.833c0-.236.142-.333.286-.333h3.428c.143 0 .286.097.286.333z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M14.727 5.5H8.273a.77.77 0 0 0-.773.773v8.454a.77.77 0 0 0 .773.773h6.454a.77.77 0 0 0 .773-.773V6.273a.77.77 0 0 0-.773-.773'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.5 7.507h-4a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
FormulaWidget.propTypes = propTypes;
export default FormulaWidget;
