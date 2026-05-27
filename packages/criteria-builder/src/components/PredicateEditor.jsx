import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Container from '@m-next/container';
import Dropdown from '@m-next/dropdown';
import { Predicate, complexValueTypes, EmptyPredicate, FieldTypeNames, basicOperationId } from '@m-next/types';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';

import OperationEditor from './OperationEditor';
import ValueEditor from './ValueEditor';
import ValueTypeEditor from './ValueTypeEditor';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  elementKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  fieldListOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      trueValue: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.string,
      lines: PropTypes.arrayOf(PropTypes.string),
      fieldType: PropTypes.string,
    }),
  ),
  controlList: PropTypes.instanceOf(Object),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  third: Predicate,
  dateField: PropTypes.number,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  onDisableDragging: PropTypes.func,
  index: PropTypes.number,
  set: PropTypes.number,
  ghost: PropTypes.bool,
  advanced: PropTypes.bool,
  onDisableClickOutside: PropTypes.func,
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
  splitValues: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
};

const Wrapper = styled.div(({ advanced }) => [
  {
    display: 'flex',
    gap: 8,
    flexDirection: advanced ? 'row' : 'column',
    flexGrow: 1,
  },
]);

const typesMatch = (metadata, type) => {
  if (metadata) {
    return metadata.type === type;
  }

  return true;
};

function PredicateEditor({
  id,
  first,
  operation,
  second,
  third,
  dateField,
  fieldList,
  controlList,
  onDelete,
  onChange,
  onDisableDragging,
  fieldListOptions,
  index,
  set,
  advanced,
  elementKey,
  ghost,
  onDisableClickOutside,
  includeControls = true,
  includeSessionVariables = true,
  splitValues = false,
  forcedTimeZone,
}) {
  const [internalFirst, setInternalFirst] = useState(first);
  const [internalOperation, setInternalOperation] = useState(operation);
  const [internalSecond, setInternalSecond] = useState(second);
  const [internalThird, setInternalThird] = useState(third);
  const [internalDateField, setInternalDateField] = useState(dateField);

  useEffect(() => {
    setInternalFirst(first);
    setInternalOperation(operation);
    setInternalSecond(second);
    setInternalDateField(dateField);
  }, [first, operation, second, dateField]);

  const firstOption = useMemo(() => {
    let label = internalFirst.value;
    if (internalFirst.value === null || internalFirst.value === undefined) {
      return null;
    }

    if (fieldList && internalFirst.value) {
      const match = fieldList.filter(
        (x) => x.name === internalFirst.value && typesMatch(internalFirst.metadata, x.type),
      );
      if (match !== null && match.length > 0) {
        if (match[0].type === FieldTypeNames.DropDown) {
          label = `${match[0].caption || match[0].name} - Display`;
        } else {
          label = match[0].caption
            ? match[0].caption.replace('_record id', ' - RecordID')
            : match[0].name.replace('_record id', ' - RecordID');
        }
      }
    }
    return {
      value: splitValues ? `${internalFirst.value}-${internalFirst.metadata?.type}` : internalFirst.value,
      label,
    };
  }, [fieldList, internalFirst.metadata, internalFirst.value, splitValues]);

  const firstFieldType = useMemo(() => {
    let type = null;
    if (fieldList && internalFirst.value) {
      const match = fieldList.filter(
        (x) => x.name === internalFirst.value && typesMatch(internalFirst.metadata, x.type),
      );
      if (match !== null && match.length > 0) {
        type = match[0].type;
      }
    }
    return type;
  }, [fieldList, internalFirst.value, internalFirst.metadata]);

  const handleOnFirstChange = (item) => {
    const updatedFirst = { ...internalFirst };
    let updatedSecond = internalSecond;
    let updatedThird = internalThird;
    updatedFirst.value = item.trueValue;
    updatedFirst.type = complexValueTypes.Field;
    updatedFirst.metadata = { type: item.fieldType };
    if (firstFieldType !== item.fieldType) {
      updatedSecond = { ...EmptyPredicate };
      updatedThird = updatedThird ? { ...EmptyPredicate } : null;
      switch (item.fieldType) {
        case FieldTypeNames.YesNo:
          updatedSecond.value = 'false';
          updatedSecond.type = complexValueTypes.YesNo;
          break;
        case FieldTypeNames.DateTime:
          updatedSecond.value = null;
          updatedSecond.type = complexValueTypes.DateRange;
          break;
        case FieldTypeNames.Decimal:
        case FieldTypeNames.Integer:
        case FieldTypeNames.Money:
          updatedSecond.type = complexValueTypes.Number;
          break;
        case FieldTypeNames.DropDown:
        case FieldTypeNames.Text:
        case FieldTypeNames.Linked:
        case FieldTypeNames.Tags:
          updatedSecond.type = complexValueTypes.Text;
          break;
        case FieldTypeNames.Date:
          updatedSecond.type = complexValueTypes.Date;
          break;
        case FieldTypeNames.Time:
          updatedSecond.type = complexValueTypes.Time;
          break;
        default:
          break;
      }
    }
    setInternalFirst(updatedFirst);
    setInternalOperation(null);
    setInternalSecond(updatedSecond);
    setInternalThird(updatedThird);
    onChange(
      index,
      {
        key: elementKey,
        first: updatedFirst,
        operation: null,
        second: updatedSecond,
        dateField,
        ghost,
        third: updatedThird,
      },
      set,
    );
  };

  const handleOperationChange = (item) => {
    setInternalOperation(item.value);
    const updatedSecond = { ...internalSecond };
    if (firstFieldType === FieldTypeNames.YesNo) {
      if (item.value === basicOperationId.InList || item.value === basicOperationId.NotInList) {
        updatedSecond.value = '';
        updatedSecond.type = complexValueTypes.Text;
      } else if (updatedSecond.type === complexValueTypes.Text) {
        updatedSecond.value = 'false';
        updatedSecond.type = complexValueTypes.YesNo;
      }

      setInternalSecond(updatedSecond);
    } else if (
      (item.value === basicOperationId.InList || item.value === basicOperationId.NotInList) &&
      updatedSecond.type === complexValueTypes.Number
    ) {
      updatedSecond.type = complexValueTypes.Text;
      setInternalSecond(updatedSecond);
    }

    let updatedThird = internalThird;

    if (item.value === basicOperationId.Between) {
      updatedThird = { ...EmptyPredicate };
      updatedThird.type = internalSecond.type;
      if (firstFieldType === FieldTypeNames.Date) {
        updatedSecond.type = complexValueTypes.Date;
      }
      if (firstFieldType === FieldTypeNames.Time) {
        updatedSecond.type = complexValueTypes.Time;
      }

      if (
        firstFieldType === FieldTypeNames.Money ||
        firstFieldType === FieldTypeNames.Decimal ||
        firstFieldType === FieldTypeNames.Integer
      ) {
        updatedSecond.type = complexValueTypes.Money;
      }

      setInternalSecond(updatedSecond);
      setInternalThird(updatedThird);
    }

    if (updatedSecond.type === complexValueTypes.Date) {
      if (updatedSecond && updatedSecond.value && updatedSecond.value !== -1 && updatedSecond.value !== -2) {
        const newDate = new Date(updatedSecond.value);
        if ([basicOperationId.Greater, basicOperationId.LessEqual].includes(item.value)) {
          newDate.setHours(23, 59, 59, 999);
        } else {
          newDate.setHours(0, 0, 0, 0);
        }
        updatedSecond.value = newDate.toISOString();

        setInternalSecond(updatedSecond);
      }
    }

    onChange(
      index,
      {
        key: elementKey,
        first: internalFirst,
        operation: item.value,
        second: updatedSecond,
        dateField,
        ghost,
        third: updatedThird,
      },
      set,
    );
  };

  const handleSecondChange = (item, type) => {
    const updated = { ...internalSecond };

    if (type !== null && type !== undefined) {
      updated.type = type;
    }

    if (updated.type === complexValueTypes.Control) {
      updated.value = item.parentId || item.value;
      updated.property = item.property;
      updated.childProperty = item.childProperty;
    } else if (updated.type === complexValueTypes.Session) {
      updated.value = item.value;
    } else if (updated.type === complexValueTypes.YesNo) {
      updated.value = item;
    } else if (updated.type === complexValueTypes.Number) {
      updated.value = item !== null && item !== '' && item !== undefined ? Number(item) : item;
    } else if (updated.type === complexValueTypes.DateRange) {
      updated.value = item;
    } else if (updated.type === complexValueTypes.DateTime) {
      if (item && item !== -1 && item !== -2) {
        updated.value = item.toISOString();
      } else {
        updated.value = null;
      }
    } else if (updated.type === complexValueTypes.Date) {
      if (item && item !== -1 && item !== -2) {
        if ([basicOperationId.Greater, basicOperationId.LessEqual].includes(internalOperation)) {
          item.setHours(23, 59, 59, 999);
        } else {
          item.setHours(0, 0, 0, 0);
        }
        updated.value = item.toISOString();
      } else {
        updated.value = null;
      }
    } else {
      updated.value = item;
    }

    setInternalSecond(updated);

    onChange(
      index,
      {
        key: elementKey,
        first: internalFirst,
        operation: internalOperation,
        second: updated,
        ghost,
        dateField,
        third: internalThird,
      },
      set,
    );
  };

  const handleThirdChange = (item, type) => {
    const updated = { ...internalThird };

    if (type !== null && type !== undefined) {
      updated.type = type;
    }

    if (updated.type === complexValueTypes.Control) {
      updated.value = item.parentId || item.value;
      updated.property = item.property;
      updated.childProperty = item.childProperty;
    } else if (updated.type === complexValueTypes.Session) {
      updated.value = item.value;
    } else if (updated.type === complexValueTypes.YesNo) {
      updated.value = item;
    } else if (updated.type === complexValueTypes.Number) {
      updated.value = item !== null && item !== '' && item !== undefined ? Number(item) : item;
    } else if (updated.type === complexValueTypes.DateRange) {
      updated.value = item;
    } else if (updated.type === complexValueTypes.DateTime) {
      if (item && item !== -1 && item !== -2) {
        updated.value = item.toISOString();
      } else {
        updated.value = null;
      }
    } else if (updated.type === complexValueTypes.Date) {
      if (item && item !== -1 && item !== -2) {
        item.setHours(23, 59, 59, 999);
        updated.value = item.toISOString();
      } else {
        updated.value = null;
      }
    } else {
      updated.value = item;
    }

    setInternalThird(updated);

    onChange(
      index,
      {
        key: elementKey,
        first: internalFirst,
        operation: internalOperation,
        second: internalSecond,
        ghost,
        dateField,
        third: updated,
      },
      set,
    );
  };

  const handleSecondTypeChange = (item) => {
    const updated = { ...internalSecond };
    updated.type = item.value;

    if (item.value !== internalSecond.type) {
      updated.value = null;
    }
    setInternalSecond(updated);

    onChange(
      index,
      {
        key: elementKey,
        first: internalFirst,
        operation: internalOperation,
        second: updated,
        dateField,
        ghost,
        third: internalThird,
      },
      set,
    );
  };

  const handleDateFieldChange = (item) => {
    setInternalDateField(item);
    onChange(
      index,
      {
        key: elementKey,
        first: internalFirst,
        operation: internalOperation,
        second: internalSecond,
        dateField: item,
        ghost,
        third: internalThird,
      },
      set,
    );
  };

  const handleDelete = () => {
    onDelete(index, set);
  };

  const handleMouseEnter = () => {
    if (onDisableDragging) onDisableDragging(index);
  };
  const handleMouseLeave = () => {
    if (onDisableDragging) onDisableDragging(null);
  };

  return (
    <Container
      id={`${id}-predicate-editor`}
      borderless
      style={{
        gap: 8,
        padding: 0,
        backgroundColor: colors['grey-lighter'],
        position: 'relative',
        flexDirection: 'row',
        alignItems: advanced ? 'center' : null,
      }}
      key={`${id}-predicate-editor`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Wrapper advanced={advanced}>
        <Dropdown
          id={`${id}-field`}
          options={fieldListOptions}
          onChange={handleOnFirstChange}
          placeholder='Search field'
          dropdownStyle='multi-icon'
          isV4Design
          value={firstOption}
          style={{ flexBasis: advanced ? '100%' : null }}
          required
          listHeight={advanced ? 100 : null}
          isPortal={advanced}
          autoFocus
        />
        {advanced && !internalFirst.value && <div style={{ flexBasis: '100%' }} />}
        {internalFirst.value && (
          <OperationEditor
            onOperationChange={handleOperationChange}
            first={internalFirst}
            operation={internalOperation}
            firstFieldType={firstFieldType}
            advanced={advanced}
            id={id}
          />
        )}
        {advanced && (!internalFirst.value || !internalOperation) && <div style={{ flexBasis: '100%' }} />}
        {advanced && (!internalFirst.value || !internalOperation) && <div style={{ flexBasis: '100%' }} />}
        {internalFirst.value && internalOperation && internalOperation !== basicOperationId.Between && (
          <ValueTypeEditor
            onSecondTypeChange={handleSecondTypeChange}
            first={internalFirst}
            operation={internalOperation}
            second={internalSecond}
            third={internalThird}
            firstFieldType={firstFieldType}
            advanced={advanced}
            id={id}
            includeControls={includeControls}
            includeSessionVariables={includeSessionVariables}
          />
        )}

        {internalFirst.value && internalOperation && (
          <ValueEditor
            onChange={handleSecondChange}
            onThirdChange={handleThirdChange}
            onDateFieldChange={handleDateFieldChange}
            first={internalFirst}
            operation={internalOperation}
            second={internalSecond}
            third={internalThird}
            firstFieldType={firstFieldType}
            advanced={advanced}
            id={id}
            controlList={controlList}
            fieldListOptions={fieldListOptions}
            dateField={internalDateField}
            onDisableClickOutside={onDisableClickOutside}
            forcedTimeZone={forcedTimeZone}
          />
        )}
      </Wrapper>
      {advanced && <SvgIcon name='delete' size={16} onClick={handleDelete} />}
    </Container>
  );
}

PredicateEditor.propTypes = propTypes;
export default PredicateEditor;
