import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { lightTheme } from '@m-next/styles';
import Container from '@m-next/container';
import {
  Field,
  Predicate,
  EmptyPredicate,
  complexValueTypes,
  basicOperationId,
  FieldTypeNames,
  Tag,
} from '@m-next/types';
import Popover from '@m-next/popover';
import FieldListSelector from './FieldListSelector';
import BuilderHeader from './BuilderHeader';
import ValueEditor from './ValueEditor';

const propTypes = {
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  fieldList: PropTypes.arrayOf(Field),
  cleanfieldList: PropTypes.arrayOf(Field),
  onClose: PropTypes.func,
  anchorEl: PropTypes.string,
  predicate: PropTypes.shape({
    first: Predicate,
    operation: PropTypes.number,
    second: Predicate,
    third: Predicate,
    set: PropTypes.number,
    key: PropTypes.string,
    index: PropTypes.number,
    ghost: PropTypes.bool,
  }),

  displayPreferences: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool,
  searchText: PropTypes.string,
  onSearch: PropTypes.func,
  tagsList: PropTypes.arrayOf(Tag),
  open: PropTypes.bool,
  onShowAdvancedEdit: PropTypes.func,
  forcedTimeZone: PropTypes.string,
  tooltipId: PropTypes.string,
};

function ChipBuilderPopup({
  id,
  isMobile,
  fieldList,
  cleanfieldList,
  onClose,
  anchorEl,
  predicate,
  displayPreferences,
  onChange,
  options,
  isLoading,
  searchText,
  onSearch,
  tagsList,
  open,
  onShowAdvancedEdit,
  forcedTimeZone,
  tooltipId,
}) {
  const { content: themeContent } = useTheme();
  const content = themeContent ?? lightTheme.content;
  const [currentTab, setCurrentTab] = useState(predicate?.first.value ? 1 : 0);
  const [keepOpen, setKeepOpen] = useState(false);
  const [internalPredicate, setInternalPredicate] = useState(predicate);

  const firstField = useMemo(
    () =>
      !fieldList || !internalPredicate.first?.value
        ? null
        : fieldList.find(
            (f) =>
              f.name === internalPredicate.first.value &&
              (internalPredicate.first.metadata ? internalPredicate.first.metadata?.type === f.type : true),
          ),
    [fieldList, internalPredicate.first],
  );

  const firstFieldType = useMemo(() => {
    let type = null;
    if (firstField) {
      type = firstField.type;
    }
    return type;
  }, [firstField]);

  const getType = (fieldType, operation) => {
    switch (fieldType) {
      case FieldTypeNames.YesNo:
        return complexValueTypes.YesNo;
      case FieldTypeNames.DateTime:
        return complexValueTypes.DateTime;
      case FieldTypeNames.Date:
        return complexValueTypes.Date;
      case FieldTypeNames.Time:
        return complexValueTypes.Time;
      case FieldTypeNames.Text:
        return complexValueTypes.Text;
      case FieldTypeNames.Decimal:
      case FieldTypeNames.Integer:
      case FieldTypeNames.Money:
        if (operation === basicOperationId.InList || operation === basicOperationId.NotInList) {
          return complexValueTypes.Text;
        }
        return complexValueTypes.Number;

      default:
        return complexValueTypes.Text;
    }
  };

  const handleFieldChange = (field) => {
    const updated = { ...internalPredicate };
    updated.first = field;
    updated.operation = basicOperationId.Is;
    updated.invalid = false;
    updated.third = null;

    let fieldType = null;
    if (fieldList && updated.first.value) {
      const match = fieldList.filter(
        (x) =>
          x.name === updated.first.value && (updated.first.metadata ? updated.first.metadata?.type === x.type : true),
      );
      if (match !== null && match.length > 0) {
        fieldType = match[0].type;
      }
    }

    if (fieldType === FieldTypeNames.Text) {
      updated.operation = basicOperationId.Contains;
    }

    if (fieldType === FieldTypeNames.Tags || field.value === 'TagList') {
      updated.operation = basicOperationId.InList;
    }

    const type = getType(fieldType, updated.operation);
    updated.second = { ...EmptyPredicate };
    updated.second.type = type;
    if (fieldType === FieldTypeNames.Date || fieldType === FieldTypeNames.DateTime) {
      const date = new Date();

      updated.second.value = date.toISOString();
    }
    if (fieldType === FieldTypeNames.Time) {
      const date = new Date();
      const m = (Math.round(date.getMinutes() / 15) * 15) % 60;
      date.setMinutes(m);
      updated.second.value = date.toISOString();
    }
    setCurrentTab(1);
    onChange(updated.index, updated, updated.set);
    setInternalPredicate(updated);
  };

  const handleSecondChange = (item, type, label) => {
    const updated = { ...internalPredicate };

    if (type !== null && type !== undefined) {
      updated.second.type = type;
    }
    updated.second.label = label;
    if (updated.second.type === complexValueTypes.Control) {
      updated.second.value = item.parentId || item.value;
      updated.second.property = item.property;
      updated.second.childProperty = item.childProperty;
    } else if (updated.second.type === complexValueTypes.Session) {
      updated.second.value = item.value;
    } else if (updated.second.type === complexValueTypes.YesNo) {
      updated.second.value = item;
    } else if (updated.second.type === complexValueTypes.Number) {
      updated.second.value = item;
      // Validate range for Between operation
      if (
        updated.operation === basicOperationId.Between &&
        updated.third?.value !== null &&
        updated.third?.value !== undefined &&
        updated.third?.value !== ''
      ) {
        const secondNum = Number(updated.second.value);
        const thirdNum = Number(updated.third.value);
        if (
          updated.second.value !== '' &&
          !Number.isNaN(secondNum) &&
          !Number.isNaN(thirdNum) &&
          thirdNum <= secondNum
        ) {
          updated.invalid = true;
        } else {
          updated.invalid = false;
        }
      } else {
        updated.invalid = false;
      }
    } else if (updated.second.type === complexValueTypes.DateRange) {
      updated.second.value = item;
    } else if (
      updated.second.type === complexValueTypes.DateTime ||
      updated.second.type === complexValueTypes.Date ||
      updated.second.type === complexValueTypes.Time
    ) {
      if (item && item !== -1 && item !== -2) {
        if ([basicOperationId.Greater, basicOperationId.LessEqual].includes(updated.operation)) {
          item.setHours(23, 59, 59, 999);
        } else {
          item.setHours(0, 0, 0, 0);
        }
        updated.second.value = item.toISOString();
      } else {
        updated.second.value = null;
      }
    } else if (firstFieldType === FieldTypeNames.DropDown) {
      updated.second.value = item;
      updated.second.type = complexValueTypes.Text;
      if (updated.second.value?.includes(',')) {
        if (updated.operation === basicOperationId.Is) {
          updated.operation = basicOperationId.InList;
        } else if (updated.operation === basicOperationId.IsNot) {
          updated.operation = basicOperationId.NotInList;
        }
      } else if (updated.operation === basicOperationId.InList) {
        updated.operation = basicOperationId.Is;
      } else if (updated.operation === basicOperationId.NotInList) {
        updated.operation = basicOperationId.IsNot;
      }
    } else {
      updated.second.value = item;
    }

    onChange(internalPredicate.index, updated, internalPredicate.set);
    setInternalPredicate(updated);
  };

  const handleThirdChange = (item, type) => {
    const updated = { ...internalPredicate };
    if (!updated.third) {
      updated.third = { ...EmptyPredicate };
    }

    if (!updated.third.type) {
      updated.third.type = updated.second.type;
    }
    if (type !== null && type !== undefined) {
      updated.third.type = type;
    }

    if (updated.third.type === complexValueTypes.Control) {
      updated.third.value = item.parentId || item.value;
      updated.third.property = item.property;
      updated.third.childProperty = item.childProperty;
    } else if (updated.third.type === complexValueTypes.Session) {
      updated.third.value = item.value;
    } else if (updated.third.type === complexValueTypes.YesNo) {
      updated.third.value = item;
    } else if (updated.third.type === complexValueTypes.Number) {
      updated.third.value = item;
      // Validate range for Between operation
      const secondNum = Number(updated.second.value);
      const thirdNum = Number(updated.third.value);
      if (
        updated.second.value !== '' &&
        updated.third.value !== '' &&
        !Number.isNaN(secondNum) &&
        !Number.isNaN(thirdNum) &&
        thirdNum <= secondNum
      ) {
        updated.invalid = true;
      } else {
        updated.invalid = false;
      }
    } else if (updated.third.type === complexValueTypes.DateRange) {
      updated.third.value = item;
    } else if (
      updated.third.type === complexValueTypes.DateTime ||
      updated.third.type === complexValueTypes.Date ||
      updated.third.type === complexValueTypes.Time
    ) {
      if (item && item !== -1 && item !== -2) {
        item.setHours(23, 59, 59, 999);
        updated.third.value = item.toISOString();
      } else {
        updated.third.value = null;
      }
    } else {
      updated.third.value = item;
    }

    onChange(internalPredicate.index, updated, internalPredicate.set);
    setInternalPredicate(updated);
  };

  const handleOperationChange = (operation) => {
    const updated = { ...internalPredicate };
    updated.operation = operation;
    updated.invalid = false;
    const type = getType(firstFieldType, updated.operation);
    if (
      operation !== basicOperationId.IsEmpty &&
      operation !== basicOperationId.IsNotEmpty &&
      operation !== basicOperationId.IsTrue &&
      operation !== basicOperationId.IsFalse
    ) {
      updated.second.type = type;
    }

    if (
      operation === basicOperationId.IsEmpty ||
      operation === basicOperationId.IsNotEmpty ||
      operation === basicOperationId.IsTrue ||
      operation === basicOperationId.IsFalse
    ) {
      updated.second = EmptyPredicate();
    }

    // Clear third value when switching away from Between operation
    if (operation !== basicOperationId.Between) {
      updated.third = null;
    }

    if (updated.second.type === complexValueTypes.DateTime || updated.second.type === complexValueTypes.Date) {
      if (updated.second && updated.second.value && updated.second.value !== -1 && updated.second.value !== -2) {
        const newDate = new Date(updated.second.value);
        if ([basicOperationId.Greater, basicOperationId.LessEqual].includes(operation)) {
          newDate.setHours(23, 59, 59, 999);
        } else {
          newDate.setHours(0, 0, 0, 0);
        }
        updated.second.value = newDate.toISOString();
      }
    }

    onChange(internalPredicate.index, updated, internalPredicate.set);
    setInternalPredicate(updated);
  };

  const handleKeyUp = (e) => {
    // Don't close on Enter if the predicate is invalid (e.g., invalid range in Between operation)
    if (e.key && e.key === 'Enter' && !internalPredicate.invalid) onClose(e);
  };

  return (
    <Popover
      id={`${id}-popover`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      marginHorizontal={0}
      marginVertical={48}
      style={{ border: 'none' }}
      disableClickOutside={keepOpen}
      height={400}
      relativeToParent
      width={280}
      inline
    >
      <Container
        borderless
        style={{ border: `1px solid ${content.border}`, borderRadius: 8, gap: 8, maxHeight: 400, padding: 8 }}
      >
        {internalPredicate.first.value && (
          <BuilderHeader
            displayPreferences={displayPreferences}
            fieldList={fieldList}
            first={internalPredicate.first}
            id={id}
            isMobile={isMobile}
            onClick={setCurrentTab}
            operation={internalPredicate.operation}
            second={internalPredicate.second}
            onFirstClick={() => setCurrentTab(0)}
            onOperationChange={handleOperationChange}
            onSecondClick={() => setCurrentTab(1)}
            firstFieldType={firstFieldType}
            onToggleOpen={setKeepOpen}
            onShowAdvancedEdit={onShowAdvancedEdit}
          />
        )}
        {currentTab === 0 && (
          <FieldListSelector
            id={`${id}-field-list-selector`}
            isMobile={isMobile}
            fieldList={cleanfieldList}
            value={internalPredicate.first}
            onChange={handleFieldChange}
            onShowAdvancedEdit={onShowAdvancedEdit}
          />
        )}
        {currentTab === 1 && (
          <ValueEditor
            id={`${id}-value-selector`}
            first={internalPredicate.first}
            operation={internalPredicate.operation}
            second={internalPredicate.second}
            third={internalPredicate.third}
            fieldType={firstFieldType}
            onChange={handleSecondChange}
            onChangeThird={handleThirdChange}
            onKeyUp={handleKeyUp}
            options={options}
            isLoading={isLoading}
            searchText={searchText}
            onSearch={onSearch}
            tagsList={tagsList}
            forcedTimeZone={forcedTimeZone}
            tooltipId={tooltipId}
            firstField={firstField}
          />
        )}
      </Container>
    </Popover>
  );
}

ChipBuilderPopup.propTypes = propTypes;
export default ChipBuilderPopup;
