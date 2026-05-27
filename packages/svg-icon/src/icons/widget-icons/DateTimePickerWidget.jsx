import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DateTimePickerWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M5.55164 11.2666H1.81834C1.5708 11.2666 1.33341 11.1683 1.15837 10.9932C0.983342 10.8182 0.88501 10.5808 0.88501 10.3333V2.86668C0.88501 2.61914 0.983342 2.38175 1.15837 2.20671C1.33341 2.03168 1.5708 1.93335 1.81834 1.93335H10.2183C10.4658 1.93335 10.7032 2.03168 10.8782 2.20671C11.0533 2.38175 11.1516 2.61914 11.1516 2.86668V5.66665'
        stroke={color}
        strokeWidth='0.874993'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M0.88501 4.7334H11.1516'
        stroke={color}
        strokeWidth='0.874993'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M3.68517 2.86665V1' stroke={color} strokeWidth='0.874993' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8.3515 2.86665V1' stroke={color} strokeWidth='0.874993' strokeLinecap='round' strokeLinejoin='round' />
      <path
        d='M11.1517 15.0001C13.2136 15.0001 14.885 13.3286 14.885 11.2668C14.885 9.2049 13.2136 7.53345 11.1517 7.53345C9.08987 7.53345 7.41841 9.2049 7.41841 11.2668C7.41841 13.3286 9.08987 15.0001 11.1517 15.0001Z'
        stroke={color}
        strokeWidth='0.874993'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.8018 11.2667H11.1517V9.61719'
        stroke={color}
        strokeWidth='0.874993'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
DateTimePickerWidget.propTypes = propTypes;
export default DateTimePickerWidget;
