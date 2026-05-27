import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { ButtonGroupRow } from '@m-next/button-group';
import Dropdown from '@m-next/dropdown';
import { FieldTypeNames } from '@m-next/runtime-interface';
import { Text, TextLine } from '@m-next/typeography';
import { Guid } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import { selectBaseModel } from '../../../../common/services/screenLayoutSlice';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';


const propTypes = {
  control: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
}


function CheckboxBlockEditor({ control, onChange, onAddAction }) {
  const accountName = useSelector(selectAccountName);
  const screenBaseModel = useSelector(selectBaseModel);

  const { isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: screenBaseModel, complexFields: false },
    { skip: !control || !screenBaseModel },
  );

  const eventList = useMemo(() => {
    if (control.onChange) {
      return [{ id: control.onChange, value: 'Change', label: 'Change' }];
    }
  }, [control.onChange]);

  const selectedDefaultValue = useMemo(() => {
    if (control.defaultValue === true) {
      return { value: true, label: 'Yes' };
    }
    return { value: false, label: 'No' };
  }, [control.defaultValue]);


  const handlePropertyChange = (property, value) => {
    const updatedControl = { ...control, [property]: value };
    onChange(updatedControl);
  }

  const handleLabelChange = (value, name) => {
    if (value) {
      const updatedControl = { ...control };
      updatedControl.caption = value;
      if (!control.isBound && control.name !== value) {
        updatedControl.name = name;
      }
      onChange(updatedControl);
    }
  }

  const handleAddAction = (property, eventName) => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  }

  return (
    <>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <s.Wrapper padding={16} gutter={96}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextLine>Edit the base configuration and styles of the checkbox.</TextLine>
          <MappedFieldSelector
            control={control}
            onChange={onChange}
            fieldTypes={[FieldTypeNames.YesNo]}
            isLoading={loadingFieldList}
          />
          <s.SettingDivider />
          <Accordion
            id='display-section'
            caption='Display'
            variant='left'
            open
            borderless
          >
            <CaptionInput
              id='label-input'
              value={control.caption ?? ""}
              label='Label'
              onChange={handleLabelChange}
              controlId={control.id}
            />
            <s.LineWrapper>
              <Text>
                Label position
              </Text>
              <ButtonGroupRow
                id='label-position'
                width={184}
                selected={control.align}
                data={[
                  { value: 'Right', label: '|<' },
                  { value: 'Left', label: '>|' },
                ]}
                onClick={(e) => handlePropertyChange('align', e.value)}
              />
            </s.LineWrapper>
            <s.LineWrapper align='flex-start'>
              <div style={{ lineHeight: '32px' }}>
                <Text
                  tooltip='Sets the initial value of the input.'
                  tooltipId='editor-tooltip'
                  tooltipHighlighting
                >
                  Default value
                </Text>
              </div>
              <Dropdown
                id='default-value-type'
                value={selectedDefaultValue}
                options={[{ value: false, label: 'No' }, { value: true, label: 'Yes' }]}
                dropdownStyle='multi-icon'
                isV4Design
                width={184}
                onChange={(e) => handlePropertyChange('defaultValue', e.value)}
              />
            </s.LineWrapper>
            <DefaultStateSelector control={control} onChange={onChange} />
          </Accordion>
          <s.SettingDivider />
          <ActionListSection
            caption='Events'
            values={eventList}
            emptyMessage='No events applied'
            canAdd
            actions={[{ value: 'Change', label: 'Change', source: 'onChange' }]}
            addLabel='Add change'
            onAddAction={handleAddAction}
            control={control}
            valueKey='value'
            optionKey='value'
          />
        </div>
      </s.Wrapper>
    </>
  );
}

CheckboxBlockEditor.propTypes = propTypes;
export default CheckboxBlockEditor;