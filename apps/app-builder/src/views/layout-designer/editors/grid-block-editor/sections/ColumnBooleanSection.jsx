import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import Toggle from '@m-next/toggle';
import Dropdown from '@m-next/dropdown';
import { colors } from '@m-next/styles';
import { iconList } from '@m-next/svg-icon';

import * as s from '../GridBlockEditor.styles';
import { GridColumnModel } from '../type';
import ColorSelector from '../../../../../components/addable-list/component-selectors/ColorSelector';
import EditorInput from '../../common/components/editor-input/EditorInput';

const propTypes = {
  column: GridColumnModel,
  onChange: PropTypes.func,
};

const ColumnBooleanSection = ({ column, onChange }) => {
  const icons = useMemo(() => iconList().map((icon) => ({ value: icon, label: icon, icon })), []);
  const [trueValue, setTrueValue] = React.useState(column.displayOptions?.trueValue || 'True');
  const [falseValue, setFalseValue] = React.useState(column.displayOptions?.falseValue || 'False');

  const boolType = useMemo(() => {
    if (column.displayAs === 'custom') return true;
    return false;
  }, [column.displayAs]);

  const trueOption = useMemo(
    () =>
      column.displayOptions && column.displayOptions.trueIcon
        ? {
            value: column.displayOptions.trueIcon.name,
            label: column.displayOptions.trueIcon.name,
            icon: column.displayOptions.trueIcon.name,
            color: column.displayOptions.trueIcon.color,
          }
        : null,
    [column.displayOptions],
  );

  const falseOption = useMemo(
    () =>
      column.displayOptions && column.displayOptions.falseIcon
        ? {
            value: column.displayOptions.falseIcon.name,
            label: column.displayOptions.falseIcon.name,
            icon: column.displayOptions.falseIcon.name,
            color: column.displayOptions.falseIcon.color,
          }
        : null,
    [column.displayOptions],
  );

  const handleChangeDisplayAs = (option) => {
    const updated = { ...column, displayAs: option ? 'custom' : null };
    if (!updated.displayOptions) {
      updated.displayOptions = {};
    }

    if (option === true && !updated.displayOptions.trueValue) {
      updated.displayOptions = { ...updated.displayOptions, trueValue: 'True', falseValue: 'False' };
    } else if (option.value === 'icon' && !updated.displayOptions.trueIcon) {
      updated.displayOptions = {
        ...updated.displayOptions,
        trueIcon: { name: 'check-circle-1-v4', color: colors['grey-darker'] },
        falseIcon: { name: 'remove-circle-v4', color: colors['grey-darker'] },
      };
    }

    onChange(updated);
  };

  const handlePropertyChange = (property, value) => {
    const updated = { ...column, displayOptions: { ...column.displayOptions, [property]: value } };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = {
      ...column,
      displayOptions: {
        ...column.displayOptions,
        [property]: { ...column.displayOptions[property], [child]: value },
      },
    };
    onChange(updated);
  };

  const handleCustomTrueValueChange = (e) => {
    setTrueValue(e);
    if (e) {
      handlePropertyChange('trueValue', e);
    }
  };

  const handleCustomFalseValueChange = (e) => {
    setFalseValue(e);
    if (e) {
      handlePropertyChange('falseValue', e);
    }
  };

  // hide icon options until we have a use case for it
  return (
    <s.ContentWrapper padding={0}>
      <Toggle
        id='display-value'
        checked={boolType}
        onChange={handleChangeDisplayAs}
        label='Show alternative Yes/No'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      {column.displayAs === 'custom' && (
        <EditorInput
          id='true-value'
          value={trueValue}
          label='Value for true'
          onChange={handleCustomTrueValueChange}
          controlId={column.field}
          maxLength={30}
        />
      )}
      {column.displayAs === 'custom' && (
        <EditorInput
          id='false-value'
          value={falseValue}
          label='Value for false'
          onChange={handleCustomFalseValueChange}
          controlId={column.field}
          maxLength={30}
        />
      )}
      {false && column.displayAs === 'icon' && (
        <s.LineWrapper>
          <Text>True icon</Text>
          <Dropdown
            id='true-icon'
            isV4Design
            options={icons}
            value={trueOption}
            dropdownStyle='icon'
            width={184}
            onChange={(e) => handleChildPropertyChange('trueIcon', 'name', e.value)}
            ariaLabel='True icon'
          />
        </s.LineWrapper>
      )}
      {false && column.displayAs === 'icon' && (
        <s.LineWrapper>
          <Text>True color</Text>
          <ColorSelector
            id='true-icon-color'
            value={column.displayOptions.trueIcon.color}
            onChange={(e) => handleChildPropertyChange('trueIcon', 'color', e)}
            width={184}
            showLabel
          />
        </s.LineWrapper>
      )}
      {false && column.displayAs === 'icon' && (
        <s.LineWrapper>
          <Text>False icon</Text>
          <Dropdown
            id='false-icon'
            isV4Design
            options={icons}
            value={falseOption}
            dropdownStyle='icon'
            width={184}
            onChange={(e) => handleChildPropertyChange('falseIcon', 'name', e.value)}
            ariaLabel='False icon'
          />
        </s.LineWrapper>
      )}
      {false && column.displayAs === 'icon' && (
        <s.LineWrapper>
          <Text>False color</Text>
          <ColorSelector
            id='false-icon-color'
            value={column.displayOptions.falseIcon.color}
            onChange={(e) => handleChildPropertyChange('falseIcon', 'color', e)}
            width={184}
            showLabel
          />
        </s.LineWrapper>
      )}
    </s.ContentWrapper>
  );
};

ColumnBooleanSection.propTypes = propTypes;
export default ColumnBooleanSection;
