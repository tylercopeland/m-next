import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { FieldTypeNames, complexValueTypes } from '@m-next/types';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  type: PropTypes.number,
  fieldType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
  includeCurrentDate: PropTypes.bool,
  includeNone: PropTypes.bool,
  isBlank: PropTypes.bool,
};

const getTypeLabel = (type, includeNone) => {
  switch (type) {
    case complexValueTypes.Control:
      return 'Control';
    case complexValueTypes.Session:
      return 'Session';
    case complexValueTypes.Text:
      return 'Text';
    case complexValueTypes.Number:
      return 'Number';
    case complexValueTypes.DateTime:
    case complexValueTypes.Date:
    case complexValueTypes.DateRange:
      return 'Exact date';
    case complexValueTypes.Time:
      return 'Time';
    case complexValueTypes.YesNo:
      return 'Yes/No';
    case complexValueTypes.CurrentDate:
      return 'Current date';
    default:
      return includeNone ? 'None' : '';
  }
};

function ValueTypeEditor({
  id,
  fieldType,
  includeControls,
  includeSessionVariables,
  includeCurrentDate,
  includeNone,
  onChange,
  type,
  isBlank,
}) {
  const getOptions = () => {
    let options = [];
    switch (fieldType) {
      case FieldTypeNames.YesNo:
        options = [{ id: 'true/false', value: complexValueTypes.YesNo, label: 'Yes/No' }];
        break;
      case FieldTypeNames.DateTime:
      case FieldTypeNames.Date:
        options = [{ id: 'Date', value: complexValueTypes.Date, label: 'Exact date' }];
        break;
      case FieldTypeNames.Time:
        options = [{ id: 'Time', value: complexValueTypes.Time, label: 'Time' }];
        break;
      case FieldTypeNames.Text:
        options = [{ id: 'Text', value: complexValueTypes.Text, label: 'Text' }];
        break;
      case FieldTypeNames.Decimal:
      case FieldTypeNames.Integer:
      case FieldTypeNames.Money:
        options = [{ id: 'Number', value: complexValueTypes.Number, label: 'Number' }];
        break;
      default:
        options = [{ id: 'Text', value: complexValueTypes.Text, label: 'Text' }];
    }

    if (includeControls) {
      options.push({ id: 'Control', value: complexValueTypes.Control, label: 'Control' });
    }

    if (includeSessionVariables && fieldType !== FieldTypeNames.YesNo) {
      options.push({ id: 'Session', value: complexValueTypes.Session, label: 'Session' });
    }

    if (includeCurrentDate) {
      options.push({ id: 'CurrentDate', value: complexValueTypes.CurrentDate, label: 'Current date' });
    }

    if (includeNone) {
      options.push({ id: 'None', value: '', label: 'None' });
    }

    return options;
  };

  const secondTypeOption = useMemo(() => {
    if (type === null || type === undefined || isBlank)
      return includeNone ? { id: 'None', value: '', label: 'None' } : null;
    return { value: type, label: getTypeLabel(type, includeNone) };
  }, [includeNone, isBlank, type]);

  return (
    <Dropdown
      id={`${id}-value-type`}
      options={getOptions()}
      onChange={onChange}
      placeholder='Type'
      dropdownStyle='multi-icon'
      isV4Design
      value={secondTypeOption}
      style={{ flexGrow: 1, flexBasis: '100%' }}
      required
    />
  );
}

ValueTypeEditor.propTypes = propTypes;
export default ValueTypeEditor;
