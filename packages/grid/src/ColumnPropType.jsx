import PropTypes from 'prop-types';

export const Column = PropTypes.shape({
  editable: PropTypes.bool,
  fieldType: PropTypes.number,
  formatStyle: PropTypes.instanceOf(Object),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onColumnClick: PropTypes.func,
  columnAlign: PropTypes.string,
  fixedWidth: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  visible: PropTypes.bool,
  showOnMobile: PropTypes.bool,
  visibleOnMobile: PropTypes.bool,
  accessorProp: PropTypes.string,
  caption: PropTypes.string,
  hideable: PropTypes.bool,
  hasColumnTotal: PropTypes.bool,
  hideWhenDragging: PropTypes.bool,
  showHeader: PropTypes.bool,
  isDisabled: PropTypes.func,
  maxLength: PropTypes.number,
  infoLevel: PropTypes.oneOf(['error', 'warning', 'informative']),
});

export default Column;
