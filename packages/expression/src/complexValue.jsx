import PropTypes from 'prop-types';

const ComplexValue = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool, PropTypes.instanceOf(Object)]),
  valueType: PropTypes.oneOf([3, 9]),
  label: PropTypes.string,
});

export default ComplexValue;
