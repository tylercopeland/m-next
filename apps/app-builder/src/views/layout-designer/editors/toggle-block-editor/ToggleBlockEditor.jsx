import React, { useMemo } from 'react';
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import { Tooltip } from "react-tooltip";

import { ButtonGroupRow } from '@m-next/button-group';
import Dropdown from '@m-next/dropdown';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Toggle from '@m-next/toggle';
import { Text, TextLine } from '@m-next/typeography';
import { Guid } from '@m-next/utilities';
import { FieldTypeNames } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';

import Accordion from '../../../../components/accordion/Accordion';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import { selectBaseModel, selectControls } from '../../../../common/services/screenLayoutSlice';

import ActionListSection from '../common/components/action-list-section/ActionListSection';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';
import * as s from '../common/BlockEditor.styles';

const propTypes = {
  control: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
}

function ToggleBlockEditor({ control, onChange, onAddAction }) {
  const accountName = useSelector(selectAccountName);
  const screenBaseModel = useSelector(selectBaseModel);
  const controlList = useSelector(selectControls);

  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: screenBaseModel, complexFields: false },
    { skip: !control || !screenBaseModel },
  );

  const selectedField = useMemo(() => {
    if (!fieldList) return undefined;
    const field = fieldList.find((x) => new RegExp(`^${x.name}(\\d+)?$`, 'i').test(control.name));
    if (field) {
      return { value: control.name, label: field.caption ?? field.name };
    }
    return undefined;
  }, [control, fieldList]);

  const eventList = useMemo(() => {
    if (control.onChange) {
      return [{ id: control.onChange, value: 'Change', label: 'Change' }];
    }
  }, [control.onChange]);

  const selectedLabelPosition = useMemo(() => control.classes?.toLowerCase().indexOf('mi-caption-float-right') >= 0 ? 'right' : 'left', [control.classes]);

  // Parse defaultValue correctly - handle string "false"/"no" which are truthy in JS
  const parseBoolValue = (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      return lower === 'true' || lower === 'yes' || lower === '1';
    }
    return Boolean(val);
  };

  const selectedDefaultValue = useMemo(() => {
    if (parseBoolValue(control.defaultValue)) {
      return { value: true, label: 'Yes' };
    }
    return { value: false, label: 'No' };
  }, [control]);

  const formattedFieldList = useMemo(() => {
    if (!fieldList || !controlList) {
      return [];
    }
    const formatted = [];
    fieldList.forEach((field) => {
      if (field.type === FieldTypeNames.YesNo && !Object.values(controlList).some((existingControl) => control.id !== existingControl.id && existingControl.name === field.name)) {
        formatted.push({ value: field.name, label: field.caption });
      }
    });
    return formatted;
  }, [control.id, fieldList, controlList]);

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

  const handleLabelPositionChange = (value) => {
    const updatedControl = { ...control };
    updatedControl.classes = control.classes.replace(/(\s?)mi-caption-float-[a-z]+(\s?)/, '');
    updatedControl.classes = `${updatedControl.classes} mi-caption-float-${value}`;
    onChange(updatedControl);
  }

  const handleAddAction = (property, eventName) => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  }

  const sanitizeControlName = (name) => {
    const cleanedName = name.trim().replace(/\s+/g, '');
    const similarControls = Object.values(controlList).filter(
      (ctr) => new RegExp(`^${cleanedName}(\\d+)?$`, 'i').test(ctr.name) && ctr.id !== control.id,
    );
    const similarBaseFields = fieldList
      ? fieldList.filter((field) => new RegExp(`^${cleanedName}(\\d+)?$`, 'i').test(field.name))
      : [];

    const maxControlIndex =
      similarControls.length > 0
        ? Math.max(
          ...similarControls.map((ctr) => {
            const match = ctr.name.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : 0;
          }),
        )
        : 0;

    const maxFieldIndex =
      similarBaseFields?.length > 0
        ? Math.max(
          ...similarBaseFields.map((field) => {
            const match = field.name.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : 0;
          }),
        )
        : 0;

    if ((!similarBaseFields || similarBaseFields.length === 0) &&
      (!similarControls || similarControls.length === 0)) {
      return cleanedName;
    }

    // Increment the index by 1 to create a new unique name
    const maxIndex = Math.max(maxControlIndex, maxFieldIndex);

    return `${cleanedName}${maxIndex + 1}`;
  };

  const handleDataSourceChange = (value) => {
    const updatedControl = { ...control };
    updatedControl.isBound = value;
    if (value) {
      updatedControl.type = 'CHK';
      updatedControl.name = selectedField?.value || formattedFieldList[0].value;
      updatedControl.align = control.classes.toLowerCase().includes('mi-caption-float-right') ? 'Left' : 'Right';
    } else {
      updatedControl.type = 'TGL';
      updatedControl.name = sanitizeControlName(control.name);
      updatedControl.classes = `${updatedControl.classes || ""} mi-caption-float-${selectedLabelPosition}`.trim();
      updatedControl.textOpt = updatedControl.textOpt !== '-1' ? updatedControl.textOpt : 'Blank';
    }
    onChange(updatedControl);
  }

  return (
    <>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <Tooltip id='mapped-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '118px', wordBreak: 'break-word' }} />
      <s.Wrapper padding={16} gutter={96}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextLine>Edit the base configuration and styles of the toggle.</TextLine>
          <MappedFieldSelector
            control={control}
            onChange={onChange}
            fieldTypes={[FieldTypeNames.YesNo]}
            isLoading={loadingFieldList}
            customDataSourceChange={handleDataSourceChange}
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
              value={control.caption}
              label='Label'
              onChange={handleLabelChange}
              controlId={control.id}
              controlList={controlList}
              fieldList={fieldList}
              style={{ flexGrow: 1 }}
            />
            <s.LineWrapper gap={8}>
              <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
              <Toggle
                id='show-label'
                checked={!control.hideCaption}
                onChange={(e) => handlePropertyChange('hideCaption', !e)}
                label='Show label'
                width='100%'
                style={{ justifyContent: 'flex-start' }}
                labelStyle={{ flexBasis: '100%' }}
              />
            </s.LineWrapper>
            {!control.hideCaption && (
              <s.LineWrapper gap={8}>
                <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                <Text style={{ width: 136 }}>
                  Label position
                </Text>
                <ButtonGroupRow
                  id='label-position'
                  width={184}
                  selected={selectedLabelPosition}
                  data={[
                    { value: 'left', label: '|<' },
                    { value: 'right', label: '>|' },
                  ]}
                  onClick={(e) => handleLabelPositionChange(e.value)}
                />
              </s.LineWrapper>
            )}
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
  )
}

ToggleBlockEditor.propTypes = propTypes;
export default ToggleBlockEditor;