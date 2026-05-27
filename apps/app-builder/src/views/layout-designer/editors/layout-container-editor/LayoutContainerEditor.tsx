import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import SvgIcon, { iconList } from '@m-next/svg-icon';
import Dropdown, { DropdownOption } from '@m-next/dropdown';
import { toCamelCase } from '@m-next/utilities';
import Toggle from '@m-next/toggle';
import { Tooltip } from 'react-tooltip';
import { LayoutContainerControl, createLayoutContainerControl } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';

import { colors } from '@m-next/styles';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import Accordion from '../../../../components/accordion/Accordion';

import * as s from '../common/BlockEditor.styles';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';

interface LayoutContainerEditorProps {
  rawControl: LayoutContainerControl;
  onChange: (control: LayoutContainerControl) => void;
}

const LayoutContainerEditor = ({ rawControl, onChange }: LayoutContainerEditorProps) => {
  const control: LayoutContainerControl = useMemo(() => {
    const defaultControl = createLayoutContainerControl({
      caption: 'Container',
      name: 'container',
    });

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) }) as LayoutContainerControl;

    return merged;
  }, [rawControl]);

  const icons = useMemo(
    () => iconList().map((icon) => ({ value: icon.value, label: icon?.label, icon: icon.value })),
    [],
  );

  const selectedIcon = useMemo(() => {
    const name = control.icon?.replace('mi-icon-', '');
    const found = icons.find((x) => x.value === name);
    if (found) return { value: name, label: found.label, icon: name };
    return { value: 'account-files', label: 'Account files', icon: 'account-files' };
  }, [control.icon, icons]);

  const handlePropertyChange = (property: string, value: unknown) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleIconChange = (param: { value: string; label: string; icon: string }) => {
    handlePropertyChange('icon', param.icon);
  };
  
  const handleCaptionChange = (newCaption: string, newName: string) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  // Display the control name if caption is the default "Container"
  const displayCaption = useMemo(() => {
    return control.caption && control.caption !== 'Container'
      ? control.caption
      : control.name || '';
  }, [control.caption, control.name]);

  return (
    <RumComponentContextProvider componentName='LayoutContainerEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} place='top' />
      <s.Wrapper padding={16}>
        <TextLine>Editing the base configuration and styles of the container.</TextLine>

        <Accordion id='display' caption='Display' variant='left' open borderless>
          <s.LineWrapper>
            <Toggle
              id='show-header'
              checked={!control.hideCaption}
              onChange={(e) => {
                // When header is toggled on, also enable the border
                if (e) {
                  const updated = { ...control, hideCaption: !e, showBorder: true };
                  onChange(updated);
                } else {
                  handlePropertyChange('hideCaption', !e);
                }
              }}
              label='Show header'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
          </s.LineWrapper>

          {!control.hideCaption && (
            <>
              <s.LineWrapper gap={8}>
                <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                <div style={{ flex: 1 }}>
                  <CaptionInput
                    id='label'
                    label='Title'
                    controlId={control.id}
                    value={displayCaption}
                    onChange={handleCaptionChange}
                    maxLength={40}
                  />
                </div>
              </s.LineWrapper>

              <s.LineWrapper gap={8}>
                <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                <Toggle
                  id='show-icon'
                  checked={control.showIcon || false}
                  onChange={(e) => {
                    // When enabling showIcon, also set default icon if not already set
                    if (e && !control.icon) {
                      const updated = { ...control, showIcon: e, icon: 'account-files' };
                      onChange(updated);
                    } else {
                      handlePropertyChange('showIcon', e);
                    }
                  }}
                  label='Show icon'
                  width='100%'
                  style={{ justifyContent: 'flex-start' }}
                  labelStyle={{ flexBasis: '100%' }}
                />
              </s.LineWrapper>

              {control.showIcon && (
                <s.LineWrapper>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                    <Text>Icon</Text>
                  </div>
                  <Dropdown
                    id='icon'
                    isV4Design
                    options={icons}
                    value={selectedIcon as DropdownOption}
                    dropdownStyle='icon'
                    width={184}
                     
                    onChange={handleIconChange as (value: DropdownOption, actionMeta: unknown) => void}
                    ariaLabel='Icon'
                  />
                </s.LineWrapper>
              )}
            </>
          )}

          <DefaultStateSelector control={control} onChange={onChange} />
        </Accordion>

        <s.SettingDivider />

        <Accordion id='styles' caption='Styles' variant='left' open borderless>
          <s.LineWrapper>
            <Toggle
              id='show-border'
              checked={control.showBorder || false}
              onChange={(e) => {
                // When border is toggled off, also hide the header and shadow
                if (!e) {
                  const updated = { ...control, showBorder: e, hideCaption: true, showShadow: false };
                  onChange(updated);
                } else {
                  handlePropertyChange('showBorder', e);
                }
              }}
              label='Border'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
          </s.LineWrapper>

          {control.showBorder && (
            <s.LineWrapper>
              <Toggle
                id='show-shadow'
                checked={control.showShadow || false}
                onChange={(e) => handlePropertyChange('showShadow', e)}
                label='Drop shadow'
                width='100%'
                style={{ justifyContent: 'flex-start' }}
                labelStyle={{ flexBasis: '100%' }}
              />
            </s.LineWrapper>
          )}
        </Accordion>
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

LayoutContainerEditor.propTypes = {
  rawControl: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default LayoutContainerEditor;
