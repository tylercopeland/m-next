import PropTypes from 'prop-types';

const ExpressionElement = PropTypes.shape({
  dateField: PropTypes.number,
  dateWhere: PropTypes.string,
  operation: PropTypes.number,
  source: PropTypes.shape({
    ChildProperty: PropTypes.string,
    FontStyles: PropTypes.string,
    Property: PropTypes.string,
    ValidationMessage: PropTypes.string,
    Value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    ValueType: PropTypes.number,
  }),
});

export default ExpressionElement;
