import React, { useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import { iconList } from '@m-next/svg-icon';
import Dropdown from '@m-next/dropdown';

import * as s from '../GridBlockEditor.styles';
import { GridColumnModel } from '../type';
import ColorSelector from '../../../../../components/addable-list/component-selectors/ColorSelector';
import Accordion from '../../../../../components/accordion/Accordion';
import EditorInput from '../../common/components/editor-input/EditorInput';

const propTypes = {
  column: GridColumnModel,
  onChange: PropTypes.func,
  control: PropTypes.instanceOf(Object),
};

const ColumnButtonDisplaySection = ({ column, onChange }) => {
  const icons = useMemo(
    () => iconList().map((icon) => ({ value: icon.value, label: icon.label, icon: icon.value })),
    [],
  );
  const [icon, setIcon] = useState(column.displayOptions?.icon?.name || 'phone');

  const selectedIcon = useMemo(() => {
    const name = column.displayOptions?.icon?.name;
    if (name) return { value: name, label: icons.find((x) => x.value === name).label, icon: name };
    return null;
  }, [column.displayOptions?.icon?.name, icons]);

  const [buttonStyle, setButtonStyle] = useState(column.displayAs === 'icon' ? 1 : column.displayOptions?.icon ? 2 : 0);

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...column, [property]: { ...column[property], [child]: value } };
    onChange(updated);
  };

  const handleCaptionChange = (e) => {
    const updated = { ...column, control: { ...column.control, caption: e }, header: e };
    onChange(updated);
  };

  const handleIconChange = (option) => {
    const updated = { ...column, displayOptions: { ...column.displayOptions } };
    if (!updated.displayOptions.icon) {
      updated.displayOptions.icon = {
        name: option.value,
        color: updated.format.textColor,
      };
    } else {
      updated.displayOptions.icon = {
        ...updated.displayOptions.icon,
        name: option.value,
      };
    }

    setIcon(option.value);
    onChange(updated);
  };

  const handleTextColorChange = (color) => {
    const updated = {
      ...column,
      format: { ...column.format, textColor: color },
      displayOptions: { ...column.displayOptions },
    };
    if(!column.displayOptions)
    {
      updated.displayOptions = {};
    }

    if (column.displayOptions?.icon) {
      updated.displayOptions.icon = { ...column.displayOptions.icon, color };
    }

    onChange(updated);
  };

  const handleButtonStyleChange = (e) => {
    setButtonStyle(e.value);
    const updated = { ...column, displayAs: e.value === 1 ? 'icon' : '' };
    updated.displayOptions = { ...column.displayOptions };
    if (e.value === 1 || e.value === 2) {
      if (!column.displayOptions?.icon) {
        updated.displayOptions.icon = {
          name: icon,
          color: column.format.textColor,
        };
      }
    } else {
      updated.displayOptions.icon = null;
    }

    onChange(updated);
  };

  const handleWidthChange = (e) => {
    if (e.value === 'fixed') {
      const updated = { ...column, format: { ...column.format, width: e.value, widthFixed: 120 } };
      onChange(updated);
    } else {
      handleChildPropertyChange('format', 'width', e.value);
    }
  };

  // hide icon options until we have a use case for it
  return (
    <>
      <TextLine>Edit a column in the parent grid.</TextLine>
      <Accordion id='display' caption='Display' variant='left' open borderless>
        <s.LineWrapper>
          <Text>Button type</Text>
          <ButtonGroupRow
            id='button-type'
            width={184}
            selected={column.format.type || ''}
            data={[
              { value: 'link', label: 'Link' },
              { value: '', label: 'Button' },
            ]}
            onClick={(e) => handleChildPropertyChange('format', 'type', e.value)}
          />
        </s.LineWrapper>

        <s.LineWrapper>
          <Text>Button style</Text>
          <ButtonGroupRow
            id='button-style'
            width={184}
            selected={buttonStyle}
            data={[
              { value: 0, label: 'Text' },
              { value: 1, label: 'Icon' },
              { value: 2, label: 'Both' },
            ]}
            onClick={handleButtonStyleChange}
          />
        </s.LineWrapper>
        {(buttonStyle === 0 || buttonStyle === 2) && (
          <EditorInput
            id='header'
            value={column.control.caption}
            label='Caption'
            onChange={handleCaptionChange}
            controlId={column.field}
            maxLength={30}
          />
        )}
        <s.LineWrapper>
          <Text
            tooltip="Choose between 'Auto,' which adjusts width dynamically or 'Fixed,' which specifies a pixel width"
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Width
          </Text>
          <ButtonGroupRow
            id='column-width'
            width={184}
            selected={column.format.width}
            data={[
              { value: 'dynamic', label: 'Auto' },
              { value: 'fixed', label: 'Fixed' },
            ]}
            onClick={handleWidthChange}
          />
        </s.LineWrapper>

        {column.format.width === 'fixed' && (
          <EditorInput
            id='width'
            value={column.format.widthFixed}
            onChange={(e) => handleChildPropertyChange('format', 'widthFixed', e)}
            controlId={column.field}
            maxLength={400}
            suffixText='px'
            type='number'
          />
        )}

        {(buttonStyle === 0 || buttonStyle === 2) && (
          <s.LineWrapper>
            <Text>Background</Text>
            <ColorSelector
              id='background-color'
              value={column.format.backgroundColor}
              onChange={(e) => handleChildPropertyChange('format', 'backgroundColor', e)}
              width={184}
              showLabel
              type='fill-color'
            />
          </s.LineWrapper>
        )}
        <s.LineWrapper>
          <Text>Font Color</Text>
          <ColorSelector
            id='font-color'
            value={column.format.textColor}
            onChange={handleTextColorChange}
            width={184}
            showLabel
            type='font-color'
          />
        </s.LineWrapper>

        {(buttonStyle === 1 || buttonStyle === 2) && (
          <s.LineWrapper>
            <Text>Icon type</Text>
            <Dropdown
              id='icon'
              isV4Design
              options={icons}
              value={selectedIcon}
              dropdownStyle='icon'
              width={184}
              onChange={handleIconChange}
              ariaLabel='Icon'
            />
          </s.LineWrapper>
        )}
        <s.LineWrapper>
          <Text
            tooltip='Sets the initial state of the component on page load.'
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Default state
          </Text>
          <ButtonGroupRow
            id='display-state'
            width={184}
            selected={column.format.disabled}
            data={[
              { value: false, label: 'Regular' },
              { value: true, label: 'Disabled' },
            ]}
            onClick={(e) => handleChildPropertyChange('format', 'disabled', e.value)}
          />
        </s.LineWrapper>
      </Accordion>
      <s.SettingDivider />
    </>
  );
};

ColumnButtonDisplaySection.propTypes = propTypes;
export default ColumnButtonDisplaySection;
