import PropTypes from 'prop-types';

const Sorting = PropTypes.shape({
  sortField: PropTypes.string,
  sortType: PropTypes.oneOf([1, 2]),
});

export default Sorting;
