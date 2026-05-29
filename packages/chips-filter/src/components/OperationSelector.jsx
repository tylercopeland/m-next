import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, MenuList } from '@m-next/menu';
import { Text } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { FieldTypeNames, basicOperationId, getOperationListChips, lookupOperationChips } from '@m-next/types';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';
import { useTheme } from '@emotion/react';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.number,
  onOperationChange: PropTypes.func,
  fieldType: PropTypes.string,
  onToggleOpen: PropTypes.func,
  fieldName: PropTypes.string,
  isReadOnly: PropTypes.bool,
};

function OperationSelector({ id, value, onOperationChange, fieldType, onToggleOpen, fieldName, isReadOnly }) {
  const ref = useRef();
  const { content: themeContent, background: themeBackground } = useTheme();
  const content = themeContent ?? lightTheme.content;
  const background = themeBackground ?? lightTheme.background;
  const internalValue = useMemo(() => {
    if (fieldType === FieldTypeNames.DropDown && value === basicOperationId.InList) return basicOperationId.Is;
    if (fieldType === FieldTypeNames.DropDown && value === basicOperationId.NotInList) return basicOperationId.IsNot;
    return value;
  }, [fieldType, value]);

  const operationLabel = useMemo(() => {
    if (value === null || value === undefined) return null;
    if (fieldType === FieldTypeNames.DropDown) {
      if (value === basicOperationId.InList) return 'is';
      if (value === basicOperationId.NotInList) return 'is not';
    }

    if (fieldType === FieldTypeNames.Tags || fieldName === 'TagList') {
      let label = lookupOperationChips(value, FieldTypeNames.Tags);
      label = label[0].toLowerCase() + label.slice(1);
      return label;
    }

    let label = lookupOperationChips(value, fieldType);
    label = label[0].toLowerCase() + label.slice(1);
    return label;
  }, [value, fieldType, fieldName]);

  const operationList = useMemo(() => {
    const type = fieldType === FieldTypeNames.Tags || fieldName === 'TagList' ? FieldTypeNames.Tags : fieldType;
    return getOperationListChips(type, false);
  }, [fieldName, fieldType]);

  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    setOpen(!open);
    if (onToggleOpen) onToggleOpen(!open);
  };

  const handleKeyUp = () => {};

  const handleClick = (operation) => {
    if (onToggleOpen) onToggleOpen(!open);
    if (onOperationChange) {
      if (operation === basicOperationId.Is && fieldType === FieldTypeNames.DropDown)
        onOperationChange(basicOperationId.InList);
      else if (operation === basicOperationId.IsNot && fieldType === FieldTypeNames.DropDown)
        onOperationChange(basicOperationId.NotInList);
      else onOperationChange(operation);
    }
    setOpen(false);
  };

  return (
    <div>
      <div
        ref={ref}
        onClick={handleToggleOpen}
        onKeyUp={handleKeyUp}
        role='button'
        tabIndex={0}
        style={{
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${open ? content.border : background.primary}`,
          borderRadius: 2,
          padding: '0px 4px',
          gap: 2,
        }}
      >
        <Text id={`${id}-condition-label`} fontSize='small'>
          {operationLabel}
        </Text>
        {!isReadOnly && <SvgIcon name={open ? 'chevron-up-V4' : 'chevron-down-V4'} size={16} color={colors.grey.base} />}
      </div>

      {!isReadOnly && (
        <MenuList
          id={`${id}-condition-list`}
          open={open}
          anchorEl={ref.current}
          onClose={() => {
            if (onToggleOpen) onToggleOpen(!open);
            setOpen(false);
          }}
          horizontalAlign='left'
          marginVertical={4}
          marginHorizontal={-16}
          inline
          relativeToParent
          width={140}
        >
          {operationList.map((operation) => (
            <MenuItem
              key={operation.value}
              value={operation.value}
              id={`${id}-condition-option-${operation.value}`}
              onClick={() => {
                handleClick(operation.value);
              }}
              selected={internalValue === operation.value}
            >
              {operation.label}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </div>
  );
}

OperationSelector.propTypes = propTypes;
export default OperationSelector;
