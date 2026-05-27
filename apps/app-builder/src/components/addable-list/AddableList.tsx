import React, { useEffect, useMemo, useState } from 'react';
import { Text } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { DebouncedInput } from '@m-next/input';
import * as s from './AddableList.styles';
import ColorSelector from './component-selectors/ColorSelector';
import AlignmentSelector from './component-selectors/AlignmentSelector';
import FontWeightSelector from './component-selectors/FontWeightSelector';
import FontSizeSelector from './component-selectors/FontSizeSelector';
import BorderSizeSelector from './component-selectors/BorderSizeSelector';
import BorderStyleSelector from './component-selectors/BorderStyleSelector';

type ValueType = string | number | boolean;

type ComponentType =
  | 'text'
  | 'number'
  | 'color'
  | 'alignment'
  | 'font-color'
  | 'font-weight'
  | 'font-size'
  | 'fill-color'
  | 'border-size'
  | 'border-style'
  | 'boolean'
  | 'action';

export interface ValueItem {
  id: number;
  value: ValueType;
  canDelete?: boolean;
  maxValue?: number;
  label?: string;
  icon?: string;
  type?: ComponentType;
}

export interface OptionItem {
  value: ValueType;
  label?: string;
  icon?: string;
  canDelete?: boolean;
  type: ComponentType;
  hidden?: boolean;
}

export interface MergedLine extends ValueItem {
  label: string;
  type: ComponentType;
  canDelete: boolean;
  hidden?: boolean;
}

interface AddableListProps {
  id: string;
  onChange?: (values: ValueItem[]) => void;
  onActionButtonClick?: (option: MergedLine, index: number) => void;
  values?: ValueItem[];
  options?: OptionItem[];
  mode?: 'editable' | 'removable';
}

const AddableList: React.FC<AddableListProps> = ({
  id,
  onChange,
  onActionButtonClick,
  values = [],
  options = [],
  mode = 'editable',
}) => {
  const [valueUpdated, setValueUpdated] = useState(false);
  const mergedLines = useMemo((): MergedLine[] => {
    if (values?.length > 0) {
      if (options?.length > 0) {
        return values
          .filter((item) => options.find((option) => option.value === item.id))
          .map((item) => {
            const selectedOption = options.find((option) => option.value === item.id);
            if (!selectedOption) {
              throw new Error('Selected option not found');
            }
            return {
              value: item.value,
              label: selectedOption.label || '',
              icon: selectedOption.icon,
              id: item.id,
              type: selectedOption.type,
              canDelete: Boolean(item.canDelete && selectedOption.canDelete),
              maxValue: item.maxValue,
              hidden: selectedOption.hidden,
            };
          });
      }
      return values.map((item) => ({
        value: item.value,
        label: item.label || '',
        icon: item.icon,
        id: item.id,
        type: item.type || 'text',
        canDelete: Boolean(item.canDelete),
        maxValue: item.maxValue,
      }));
    }
    return [];
  }, [values, options]);

  const handleOnChange = (value: ValueType, valueId: number, maxValue?: number) => {
    const newValues = [...values];
    const targetIndex = values.findIndex((item) => item.id === valueId);
    const targetItem = newValues.find((item) => item.id === valueId);

    if (targetIndex !== -1 && targetItem) {
      let processedValue: ValueType = value;

      // Handle maxValue constraint for numeric values
      if (maxValue && maxValue > 0) {
        const numValue = typeof value === 'number' ? value : Number(value);
        if (!isNaN(numValue)) {
          processedValue = Math.min(numValue, maxValue);
        }
      }

      newValues.splice(targetIndex, 1, {
        ...targetItem,
        value: processedValue,
      });
    }

    if (onChange) {
      onChange(newValues);
    }
    setValueUpdated(true);
  };

  const handleActionButtonClick = (selectedOption: MergedLine, index: number) => {
    if (mode === 'removable') {
      const newValues = [...values];
      newValues.splice(
        values.findIndex((item) => item.id === selectedOption.id),
        1,
      );
      if (onChange) {
        onChange(newValues);
      }
    } else if (onActionButtonClick) {
      onActionButtonClick(selectedOption, index);
    }
  };

  useEffect(() => {
    if (valueUpdated) {
      setValueUpdated(false);
    }
  }, [valueUpdated]);

  const renderValue = (line: MergedLine): React.ReactNode => {
    switch (line.type) {
      case 'text':
      case 'number':
        return (
          <DebouncedInput
            id={`${id}-${line.id}`}
            value={line.value !== null ? String(line.value) : ''}
            onBlur={(value) => handleOnChange(String(value), line.id, line.maxValue)}
            type={line.type}
            updateRawValue={valueUpdated}
          />
        );
      case 'boolean':
        return null;

      case 'color':
      case 'font-color':
      case 'fill-color':
        return (
          <ColorSelector
            id={`${id}-${line.id}`}
            value={line.value ? String(line.value) : ''}
            onChange={(value) => handleOnChange(value, line.id)}
            width='100%'
            type={line.type}
            showLabel
          />
        );
      case 'alignment':
        return (
          <AlignmentSelector
            id={`${id}-${line.id}`}
            value={line.value ? String(line.value) : 'left'}
            onChange={(value) => handleOnChange(value, line.id)}
            width='100%'
          />
        );
      case 'font-weight':
        return (
          <FontWeightSelector
            id={`${id}-${line.id}`}
            value={line.value ? String(line.value) : 'regular'}
            onChange={(value) => handleOnChange(value, line.id)}
            width='100%'
          />
        );
      case 'font-size':
        return (
          <FontSizeSelector
            id={`${id}-${line.id}`}
            value={line.value ? String(line.value) : '14'}
            onChange={(value) => handleOnChange(value, line.id)}
            width='100%'
          />
        );
      case 'border-size':
        return (
          <BorderSizeSelector
            id={`${id}-${line.id}`}
            value={line.value ? String(line.value) : '0'}
            onChange={(value) => handleOnChange(value, line.id)}
            width='100%'
          />
        );
      case 'border-style':
        return (
          <BorderStyleSelector
            id={`${id}-${line.id}`}
            value={line.value ? String(line.value) : 'none'}
            onChange={(value) => handleOnChange(value, line.id)}
            width='100%'
          />
        );
      default:
        return <Text color={colors.grey}>{line.value} </Text>;
    }
  };

  return (
    <s.Wrapper id={id}>
      {mergedLines
        .filter((item) => !item.hidden)
        .map((line, index) => (
          <div key={`${id}-${line.id}`}>
            <s.Line>
              <s.LabelCell fullWidth={line.type === 'boolean'}>
                <Text color={colors.grey}>{line.label} </Text>
              </s.LabelCell>
              {line.type !== 'boolean' && <s.Cell>{renderValue(line)}</s.Cell>}
              <SvgIcon
                id={`${id}-${line.id}-action`}
                testId={`${id}-${line.id}-action`}
                name={mode === 'removable' ? 'trash-V4' : 'edit-V4'}
                color={colors.grey}
                size={16}
                style={{ padding: '0px 16px' }}
                onClick={() => handleActionButtonClick(line, index)}
                disabled={!line.canDelete}
              />
            </s.Line>
            {index !== mergedLines.filter((item) => !item.hidden).length - 1 && <s.Divider />}
          </div>
        ))}
    </s.Wrapper>
  );
};

export default AddableList;
