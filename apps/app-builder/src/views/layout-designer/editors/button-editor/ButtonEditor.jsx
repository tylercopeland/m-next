import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import { iconList } from '@m-next/svg-icon';
import Dropdown from '@m-next/dropdown';
import { Guid, toCamelCase } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import { Tooltip } from 'react-tooltip';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import ColorSelector from '../../../../components/addable-list/component-selectors/ColorSelector';
import Accordion from '../../../../components/accordion/Accordion';
import ActionListSection from '../common/components/action-list-section/ActionListSection';

import * as s from '../common/BlockEditor.styles';
import { migrateButtonControl } from '../../control-classes';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';

const ButtonStyles = {
  TEXT: 0,
  ICON: 1,
  BOTH: 2,
};

const ButtonEditor = ({ rawControl, onChange, onAddAction }) => {
  const [previousIcon, setPreviousIcon] = useState('add-circle-v4');
  const control = useMemo(() => {
    const defaultControl = {
      caption: 'Button',
      hideCaption: false,
      name: '',
      visible: true,
      disabled: false,
      icon: null,
      iconPosition: 'left',
    };

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateButtonControl(merged);

    return migrated ?? merged;
  }, [rawControl]);

  const [buttonStyle, setButtonStyle] = useState(
    control.icon ? (control.hideCaption ? ButtonStyles.ICON : ButtonStyles.BOTH) : ButtonStyles.TEXT, // 0: text, 1: icon, 2: both
  );

  const icons = useMemo(
    () => iconList().map((icon) => ({ value: icon.value, label: icon?.label, icon: icon.value })),
    [],
  );

  const selectedIcon = useMemo(() => {
    const name = control.icon?.replace('mi-icon-', '');
    const found = icons.find((x) => x.value === name);
    if (found) return { value: name, label: found.label, icon: name };
    return { value: 'add-circle-v4', label: 'Add circle', icon: 'add-circle-v4' };
  }, [control.icon, icons]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...control, [property]: { ...control[property], [child]: value } };
    onChange(updated);
  };

  const handleButtonStyleChange = (e) => {
    setButtonStyle(e.value);
    const updated = { ...control };
    switch (e.value) {
      case ButtonStyles.TEXT:
        updated.icon = null;
        updated.hideCaption = false;
        break;
      case ButtonStyles.ICON:
        updated.hideCaption = true;
        updated.icon = control.icon || previousIcon;
        break;
      case ButtonStyles.BOTH:
        updated.hideCaption = false;
        updated.icon = control.icon || previousIcon;
        break;
      default:
        break;
    }

    onChange(updated);
  };

  const handleIconChange = (param) => {
    setPreviousIcon(param.icon);
    handlePropertyChange('icon', param.icon);
  }; // param: value, label, icon

  const events = useMemo(() => {
    if (control.onClick) {
      return [{ id: control.onClick, value: 'Click', label: 'Click' }];
    }
  }, [control.onClick]);

  const handleAddAction = (property, eventName) => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  };

  const handleCaptionChange = (newCaption, newName) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  return (
    <RumComponentContextProvider componentName='ButtonEditor' /* context={analyticsContext} */>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word'}} />
      <s.Wrapper padding={16}>
        <TextLine>Editing the base configuration and styles of the button.</TextLine>
        <Accordion id='display' caption='Display' variant='left' open borderless>
          <s.LineWrapper>
            <Text>Variant</Text>
            <ButtonGroupRow
              id='button-variant'
              width={184}
              selected={control.styles.variant}
              data={[
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'tertiary', label: 'Tertiary' },
              ]}
              onClick={(e) => handleChildPropertyChange('styles', 'variant', e.value)}
            />
          </s.LineWrapper>

          <s.LineWrapper>
            <Text>Color</Text>
            <ColorSelector
              id='color'
              value={control.styles.color}
              onChange={(value) => handleChildPropertyChange('styles', 'color', value)}
              width={184}
              showLabel
              type='fill-color'
            />
          </s.LineWrapper>
          <s.LineWrapper>
            <Text>Button style</Text>
            <ButtonGroupRow
              id='button-style'
              width={184}
              selected={buttonStyle}
              data={[
                { value: ButtonStyles.TEXT, label: 'Text' },
                { value: ButtonStyles.ICON, label: 'Icon' },
                { value: ButtonStyles.BOTH, label: 'Both' },
              ]}
              onClick={handleButtonStyleChange}
            />
          </s.LineWrapper>

          {buttonStyle !== ButtonStyles.ICON && (
            <CaptionInput
              id='label'
              label='Label'
              controlId={control.id}
              value={control.caption}
              onChange={handleCaptionChange}
              maxLength={30}
            />
          )}

          {buttonStyle !== ButtonStyles.TEXT && (
            <s.LineWrapper>
              <Text>Icon type</Text>
              <Dropdown
                id='icon'
                isV4Design
                options={icons}
                value={selectedIcon}
                dropdownStyle='icon'
                width={184}
                onChange={handleIconChange} // param: value, label, icon
                ariaLabel='Icon'
              />
            </s.LineWrapper>
          )}

          {buttonStyle === ButtonStyles.BOTH && (
            <s.LineWrapper>
              <Text>Icon position</Text>
              <ButtonGroupRow
                id='button-style'
                width={184}
                selected={control.iconAlign?.toLowerCase() ?? 'left'}
                data={[
                  { value: 'left', label: '|<' },
                  { value: 'right', label: '>|' },
                ]}
                onClick={(e) => handlePropertyChange('iconAlign', e.value)}
              />
            </s.LineWrapper>
          )}

          <DefaultStateSelector control={control} onChange={onChange} />
        </Accordion>

        <ActionListSection
          caption='Events'
          values={events}
          emptyMessage='No button events applied'
          canAdd
          actions={[{ value: 'Click', label: 'Click', source: 'onClick' }]}
          addLabel='Add click'
          onAddAction={handleAddAction}
          control={control}
        />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

ButtonEditor.propTypes = {
  rawControl: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
};

export default ButtonEditor;
