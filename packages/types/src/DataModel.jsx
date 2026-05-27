import PropTypes from 'prop-types';
import Field from './field';
import Sorting from './Sorting';
import ExpressionElement from './ExpressionElement';

const DataModel = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  caption: PropTypes.string,
  viewFriendlyName: PropTypes.string,
  filtering: PropTypes.arrayOf(ExpressionElement),

  fields: PropTypes.arrayOf(Field),
  sorting: PropTypes.arrayOf(Sorting),
});

export default DataModel;
