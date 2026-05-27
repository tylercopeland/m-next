import PropTypes from 'prop-types';

const Predicate = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.instanceOf(Object)]),
  type: PropTypes.number,
  property: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  childProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  label: PropTypes.string,
});

export const EmptyPredicate = () => ({
  value: null,
  type: null,
  property: null,
  childProperty: null,
});

export default Predicate;
