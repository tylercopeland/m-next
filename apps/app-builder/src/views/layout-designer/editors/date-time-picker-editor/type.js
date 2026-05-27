import PropTypes from 'prop-types';

const DateTimePickerModel = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  caption: PropTypes.string,
  name: PropTypes.string,
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  isBound: PropTypes.bool,
  placeholder: PropTypes.string,
  useDateFormatPlaceholder: PropTypes.bool,
  hideCaption: PropTypes.bool,
  defaultValue: PropTypes.string,
  format: PropTypes.string,
  onChange: PropTypes.string,
  validationRules: PropTypes.arrayOf(
    PropTypes.shape({
      rule: PropTypes.number,
      value: PropTypes.any,
      canDelete: PropTypes.bool,
    })
  ),
});

export default DateTimePickerModel; 