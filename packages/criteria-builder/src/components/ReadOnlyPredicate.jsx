import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Pill from '@m-next/pill';
import { Text } from '@m-next/typeography';
import { formatter } from '@m-next/utilities';
import {
  FieldTypeNames,
  Predicate,
  basicOperationId,
  complexValueTypes,
  dateRanges,
  lookupOperation,
  sessionLookup,
  widgets,
} from '@m-next/types';
import { colors } from '@m-next/styles';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  index: PropTypes.number,
  set: PropTypes.number,
  displayPreferences: PropTypes.instanceOf(Object),
  ghost: PropTypes.bool,
};

function ReadOnlyPredicate({
  id,
  first,
  operation,
  second,
  fieldList,
  controlList,
  onDelete,
  onClick,
  index,
  set,
  displayPreferences,
  ghost,
}) {
  const pillRef = useRef();

  const firstLabel = useMemo(() => {
    if (!first.value) return 'Field';
    let label = first.value;
    if (fieldList && first.value) {
      const match = fieldList.filter((x) => x.name === first.value);
      if (match !== null && match.length > 0) {
        if (match[0].type === FieldTypeNames.DropDown) {
          label = `${match[0].caption} - Display`;
        } else {
          label = match[0].caption.replace('_record id', ' - RecordID');
        }
      }
    }
    return label;
  }, [fieldList, first.value]);

  const childControls = useMemo(() => {
    const children = {};
    if (controlList) {
      Object.values(controlList).forEach((item) => {
        if (item.type === widgets.DATATABLE) {
          item.columns.forEach((inner) => {
            if (inner.controlId) {
              children[inner.controlId] = item.id;
            }
          });
        }
      });
    }
    return children;
  }, [controlList]);

  const secondLabel = useMemo(() => {
    if (!first.value) return 'condition';
    if (
      operation === basicOperationId.IsEmpty ||
      operation === basicOperationId.IsNotEmpty ||
      operation === basicOperationId.IsTrue ||
      operation === basicOperationId.IsFalse
    ) {
      return '';
    }

    if (second.value === null || second.value === undefined || second.value === '') {
      if (second.type === complexValueTypes.Session) return 'Session';
      if (second.type === complexValueTypes.Control) return 'Control';
      if (second.type === complexValueTypes.DateTime) return 'MM/DD/YYYY';
      if (second.type === complexValueTypes.Number) return 'Number';
      if (second.type === complexValueTypes.Field) return 'Field';
      if (second.type === complexValueTypes.Text) return 'Text';
    }

    if (second.type === complexValueTypes.Session) {
      const label = sessionLookup[second.value != null ? String(second.value).toLowerCase() : second.value];
      return label || second.value;
    }

    if (second.type === complexValueTypes.Control && controlList) {
      const control = controlList[second.value];
      if (!control && second.value) {
        return 'Unkown control';
      }
      if (!control) {
        return null;
      }

      const controlName = control.type === widgets.LABEL || !control.caption ? control.name : control.caption;

      if (second.property && second.childProperty) {
        return `${controlName} - ${second.property} - ${second.childProperty}`;
      }

      if (second.property) {
        return `${controlName} - ${second.property}`;
      }

      if (childControls) {
        const parentId = childControls[second.value];
        if (parentId) {
          const parentControl = controlList[parentId];
          const parentName = parentControl.caption || parentControl.name;
          return `${parentName} - ${controlName}`;
        }
      }

      return controlName;
    }

    if (second.type === complexValueTypes.Control && !controlList) {
      if (second.value) {
        return 'Unkown control';
      }
      return null;
    }

    if (second.type === complexValueTypes.YesNo) {
      return second.value && (second.value === true || second.value.toString().toLowerCase() === 'true')
        ? 'True'
        : 'False';
    }

    if (second.type === complexValueTypes.DateRange) {
      return dateRanges[second.value];
    }

    if (second.type === complexValueTypes.DateTime) {
      return formatter.formatFieldValue(
        FieldTypeNames.DateTime,
        { dateFormat: 'Short Date and Time' },
        second.value,
        displayPreferences,
      );
    }

    if (second.type === complexValueTypes.Date) {
      return formatter.formatFieldValue(
        FieldTypeNames.DateTime,
        { dateFormat: 'Short Date' },
        second.value,
        displayPreferences,
      );
    }

    return second.value;
  }, [
    controlList,
    second.childProperty,
    second.property,
    second.type,
    second.value,
    childControls,
    displayPreferences,
    first.value,
    operation,
  ]);

  const firstFieldType = useMemo(() => {
    let type = null;
    if (fieldList && first.value) {
      const lookup = first.value.replace('_RecordID', '');

      const match = fieldList.filter((x) => x.name === lookup);
      if (match !== null && match.length > 0) {
        type = match[0].type;
      }
    }
    return type;
  }, [first.value, fieldList]);

  const operationLabel = useMemo(() => lookupOperation(operation, firstFieldType), [operation, firstFieldType]);

  const handleDelete = () => {
    onDelete(index, set);
  };

  const handleClick = (e) => {
    onClick(e, index, set);
  };

  const isGhost = useMemo(() => {
    if (ghost) return true;
    if (
      operation === basicOperationId.IsEmpty ||
      operation === basicOperationId.IsNotEmpty ||
      operation === basicOperationId.IsTrue ||
      operation === basicOperationId.IsFalse
    )
      return false;
    if (second.value === null || second.value === undefined || second.value === '') return true;
  }, [ghost, operation, second.value]);

  return (
    <Pill
      id={`${id}-readonly-predicate`}
      onDelete={handleDelete}
      colorScheme='grey'
      key={id}
      onClick={handleClick}
      disabled={isGhost}
      style={{ whiteSpace: 'break-spaces', height: 'auto' }}
      textStyle={{ whiteSpace: 'break-spaces' }}
      forwardRef={pillRef}
    >
      <Text bold color={colors.purple}>
        {firstLabel}
      </Text>{' '}
      {operationLabel}{' '}
      <Text bold color={isGhost ? colors['grey-dark'] : colors['teal-dark']}>
        {secondLabel}
      </Text>
    </Pill>
  );
}

ReadOnlyPredicate.propTypes = propTypes;
export default ReadOnlyPredicate;
