import PropTypes from 'prop-types';
import Field from './field';
import Sorting from './Sorting';

const Projection = PropTypes.shape({
  id: PropTypes.string,
  fields: PropTypes.arrayOf(Field),
  sorting: PropTypes.arrayOf(Sorting),
});

export default Projection;
