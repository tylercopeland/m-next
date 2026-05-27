import PropTypes from 'prop-types';

const Field = PropTypes.shape({
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  type: PropTypes.oneOf([
    'Id',
    'Text',
    'Number',
    'Email',
    'DateTime',
    'Money',
    'YesNo',
    'Picture',
    'FileAttachment',
    'DropDown',
    'Decimal',
    'Integer',
    'Linked',
    'Phone',
    'Tags',
    'Address',
    'User',
    'ProfileImage',
    'Date',
    'Time',
    'Formula',
  ]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  placeHolder: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  isLinked: PropTypes.bool,
  isVisible: PropTypes.bool,
  isRequired: PropTypes.bool,
  maxLength: PropTypes.number,
  displayAs: PropTypes.string,
  displayOptions: PropTypes.oneOfType([
    PropTypes.shape({
      dateFormat: PropTypes.oneOf([0, 1, 2, 3]),
    }),
    PropTypes.shape({
      decimalRounding: PropTypes.number,
    }),
    PropTypes.shape({
      trueValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          icon: PropTypes.string,
          color: PropTypes.string,
        }),
      ]),
      falseValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          icon: PropTypes.string,
          color: PropTypes.string,
        }),
      ]),
    }),
  ]),
});

export default Field;
