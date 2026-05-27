import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { FieldTypeNames, Predicate, basicOperationId, complexValueTypes } from '@m-next/types';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  onSecondTypeChange: PropTypes.func,
  advanced: PropTypes.bool,
  firstFieldType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
};

function ValueTypeEditor({
  id,
  first,
  operation,
  second,
  onSecondTypeChange,
  advanced,
  firstFieldType,
  includeControls,
  includeSessionVariables,
}) {
  const getOptions = () => {
    let options = [];
    switch (firstFieldType) {
      case FieldTypeNames.YesNo:
        if (operation === basicOperationId.InList || operation === basicOperationId.NotInList) {
          options = [{ id: 'Text', value: complexValueTypes.Text, label: 'Text' }];
        } else {
          options = [{ id: 'true/false', value: complexValueTypes.YesNo, label: 'Yes/No' }];
        }
        break;
      case FieldTypeNames.DateTime:
      case FieldTypeNames.Date:
        options = [{ id: 'Date', value: complexValueTypes.Date, label: 'Date' }];
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
        if (operation === basicOperationId.InList || operation === basicOperationId.NotInList) {
          options = [
            { id: 'Number', value: complexValueTypes.Number, label: 'Number' },
            { id: 'Text', value: complexValueTypes.Text, label: 'Text' },
          ];
        } else {
          options = [{ id: 'Number', value: complexValueTypes.Number, label: 'Number' }];
        }
        break;
      default:
        options = [{ id: 'Text', value: complexValueTypes.Text, label: 'Text' }];
    }
    if (includeControls) {
      options.push({ id: 'Control', value: complexValueTypes.Control, label: 'Control' });
    }
    if (
      includeSessionVariables &&
      firstFieldType !== FieldTypeNames.YesNo &&
      firstFieldType !== FieldTypeNames.DateTime
    ) {
      options.push({ id: 'Session', value: complexValueTypes.Session, label: 'Session' });
    }

    return options;
  };

  const getTypeLabel = (type) => {
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
        return 'Date';
      case complexValueTypes.Time:
        return 'Time';
      case complexValueTypes.YesNo:
        return 'Yes/No';
      default:
        return '';
    }
  };

  const secondTypeOption = useMemo(() => {
    if (second.type === null || second.type === undefined) return null;
    return { value: second.type, label: getTypeLabel(second.type) };
  }, [second.type]);

  const renderAdvanced = () => (
    <Dropdown
      id={`${id}-value-type`}
      options={getOptions()}
      onChange={onSecondTypeChange}
      placeholder='Select a type'
      dropdownStyle='multi-icon'
      isV4Design
      value={secondTypeOption}
      style={{ flexGrow: 1, flexBasis: '100%' }}
      disabled={first.value === null || first.value === undefined}
      required
      listHeight={advanced ? 100 : null}
      isPortal={advanced}
    />
  );

  const renderBasic = () => (
    <Dropdown
      id={`${id}-value-type`}
      options={getOptions()}
      onChange={onSecondTypeChange}
      placeholder='Type'
      dropdownStyle='multi-icon'
      isV4Design
      value={secondTypeOption}
      style={{ flexGrow: 1, flexBasis: '100%' }}
      disabled={first.value === null || first.value === undefined}
      required
      isPortal={advanced}
    />
  );

  // eslint-disable-next-line no-nested-ternary
  return operation !== basicOperationId.IsEmpty &&
    operation !== basicOperationId.IsNotEmpty &&
    operation !== basicOperationId.IsTrue &&
    operation !== basicOperationId.IsFalse
    ? advanced
      ? renderAdvanced()
      : renderBasic()
    : null;
}

ValueTypeEditor.propTypes = propTypes;
export default ValueTypeEditor;
