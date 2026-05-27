import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { Predicate, getOperationList, lookupOperation } from '@m-next/types';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  onOperationChange: PropTypes.func,
  onSecondTypeChange: PropTypes.func,
  advanced: PropTypes.bool,
  firstFieldType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function OperationEditor({ id, first, operation, onOperationChange, advanced, firstFieldType }) {
  const operationOption = useMemo(() => {
    if (operation === null || operation === undefined) return null;
    return { value: operation, label: lookupOperation(operation, firstFieldType) };
  }, [operation, firstFieldType]);

  const operationList = useMemo(() => getOperationList(firstFieldType), [firstFieldType]);

  const renderAdvanced = () => (
    <Dropdown
      id={`${id}-condition`}
      options={operationList}
      onChange={onOperationChange}
      placeholder='Condition'
      dropdownStyle='multi-icon'
      isV4Design
      value={operationOption}
      style={{
        flexGrow: 1,
        flexBasis: '100%',
      }}
      disabled={first.value === null || first.value === undefined}
      required
      listHeight={advanced ? 100 : null}
      isPortal={advanced}
    />
  );

  const renderBasic = () => (
    <Dropdown
      id={`${id}-condition`}
      options={operationList}
      onChange={onOperationChange}
      placeholder='Condition'
      dropdownStyle='multi-icon'
      isV4Design
      value={operationOption}
      style={{
        flexGrow: 1,
        flexBasis: '100%',
      }}
      disabled={first.value === null || first.value === undefined}
      required
      isPortal={advanced}
    />
  );

  return advanced ? renderAdvanced() : renderBasic();
}

OperationEditor.propTypes = propTypes;
export default OperationEditor;
