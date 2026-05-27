import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { colors } from '@m-next/styles';
import { dateFormatList } from '@m-next/datepicker/src/util';
import Dropdown from '@m-next/dropdown';
import SvgIcon from '@m-next/svg-icon';
import Toggle from '@m-next/toggle';
import { Text, TextLine } from '@m-next/typeography';
import { formatter, Guid, toCamelCase } from '@m-next/utilities';
import { DateTimePickerControl, FieldTypeIds, FieldTypeNames, ValidationRuleTypes } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import ComplexValue from '../../../../components/complex-value/ComplexValue';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { selectBaseModel, selectControls } from '../../../../common/services/screenLayoutSlice';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import { createDatetimePickerControl, migrateDatetimePickerControl } from '../../control-classes';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import EditorInput from '../common/components/editor-input/EditorInput';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';
import ValidationRulesList from '../common/components/validation-rules-list/ValidationRulesList';
import * as s from '../common/BlockEditor.styles';

interface DateTimePickerEditorProps {
  rawControl: DateTimePickerControl;
  onChange: (control: DateTimePickerControl) => void;
  onAddAction: (control: DateTimePickerControl, eventName: string) => void;
}

interface EventItem {
  id: string;
  value: string;
  label: string;
}

interface Control {
  id: string;
  name: string;
}

interface Field {
  type: string;
  name: string;
  caption: string;
}

function DateTimePickerEditor({ rawControl, onChange, onAddAction }: DateTimePickerEditorProps): JSX.Element {
  const accountName: string = useSelector(selectAccountName);
  const screenBaseModel: string = useSelector(selectBaseModel) || '';
  const [lastControlId, setLastControlId] = useState<string | null>(null);
  const controlList = useSelector(selectControls);

  const control = useMemo(() => {
    const defaultControl = createDatetimePickerControl();
    if (lastControlId !== rawControl.id) {
      setLastControlId(rawControl.id);
    }

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateDatetimePickerControl(merged);
    return migrated ?? merged;
  }, [lastControlId, rawControl]);

  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: screenBaseModel, complexFields: false },
    { skip: !control || !screenBaseModel },
  );

  const filteredControlList = useMemo(
    () => {
      const newControlList = Object.keys(controlList as Record<string, Control>)
        .filter((key) => key !== control.id)
        .reduce((acc, key) => {
          acc[key] = (controlList as Record<string, Control>)[key]!;
          return acc;
        }, {} as Record<string, Control>);
      return newControlList;
    },
    [control.id, controlList],
  );

  const filteredFieldList = useMemo(
    () => (fieldList as Field[])?.filter((item) => !item.name.includes('_RecordID') && item.name !== 'RecordID'),
    [fieldList],
  );

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(filteredFieldList, '', undefined, {}, {}, [], false, false, true) || [],
    [filteredFieldList],
  );

  const eventList = useMemo<EventItem[]>(() => {
    if (control.onChange) {
      return [{ id: control.onChange, value: 'Change', label: 'Change' }];
    }
    return [];
  }, [control.onChange]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePropertyChange = (property: string, value: any): void => {
    const updatedControl = { ...control, [property]: value };
    onChange(updatedControl);
  };

  const handleCaptionChange = (newCaption: string, newName: string): void => {
    // When control is mapped (isBound), preserve the field name - don't overwrite it
    const updated = { ...control, caption: newCaption, name: control.isBound ? control.name : newName };
    onChange(updated);
  };

  const handlePlaceholderChange = (newPlaceholder: string | number): void => {
    const updatedControl = { ...rawControl, placeholder: String(newPlaceholder) };
    onChange(updatedControl);
  };

  const handleAddAction = (property: string, eventName: string): void => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  };

  return (
    <RumComponentContextProvider componentName='DateTimePickerEditor'>
      <Tooltip id="editor-tooltip" opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <s.Wrapper padding={'16'} gutter={'96'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextLine>Edit the base configuration and styles of the date time picker.</TextLine>
          <MappedFieldSelector<DateTimePickerControl>
            control={control}
            onChange={onChange}
            fieldTypes={[FieldTypeNames.DateTime]}
            isLoading={loadingFieldList}
          />

          <s.SettingDivider />
          <Accordion
            id="display-section"
            caption="Display"
            variant="left"
            open
            borderless
          >
            <CaptionInput
              id="label-input"
              value={control.caption}
              label="Label"
              onChange={handleCaptionChange}
              controlId={control.id}
            />

            <s.LineWrapper gap={8}>
              <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
              <Toggle
                id='show-label'
                checked={!control.hideCaption}
                onChange={(checked: boolean) => handlePropertyChange('hideCaption', !checked)}
                label='Show label'
                width='100%'
                style={{ justifyContent: 'flex-start' }}
                labelStyle={{ flexBasis: '100%' }}
              />
            </s.LineWrapper>

            {/* Toggle for the date format placeholder and placeholder input */}
            <Toggle
              id='use-date-format-placeholder'
              checked={control.useDateFormatPlaceholder}
              onChange={(checked: boolean) => handlePropertyChange('useDateFormatPlaceholder', checked)}
              label='Use date format as placeholder'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />

            {!control.useDateFormatPlaceholder && (
              <EditorInput
                id="placeholder-input"
                value={control.placeholder || ''}
                label="Placeholder"
                onChange={handlePlaceholderChange}
                controlId={control.id}
                width="184px"
                resetOnBlank={false}
                showChildIcon={true}
                gap={8}
              />
            )}

            <s.LineWrapper>
              <Text>Format as</Text>
              <Dropdown
                id="format"
                value={dateFormatList.find((opt: { value: string }) => opt.value === control.formatType) || dateFormatList[0]}
                options={dateFormatList}
                dropdownStyle="multi-icon"
                isV4Design
                width={184}
                onChange={(option) => handlePropertyChange('formatType', option.value)}
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
              <ComplexValue
                id={`default-value-${control.id}`}
                complexValue={control.defaultValue}
                fieldListOptions={fieldListOptions}
                fieldType={FieldTypeIds.DateTime}
                includeControls
                includeNone
                includeCurrentDate
                controlList={filteredControlList}
                width={184}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => handlePropertyChange('defaultValue', e)}
                controlId={control.id}
                formatType={control.formatType}
              />
            </s.LineWrapper>

            <DefaultStateSelector control={control} onChange={onChange} />
          </Accordion>

          <s.SettingDivider />

          <ValidationRulesList
            values={control.validationRules}
            standardOptions={[ValidationRuleTypes.Required]}
            onChange={(e) => handlePropertyChange('validationRules', e)}
          />

          <s.SettingDivider />
          <ActionListSection
            caption="Events"
            values={eventList}
            emptyMessage="No events applied"
            canAdd
            actions={[{ value: 'Change', label: 'Change', source: 'onChange' }]}
            addLabel="Add event"
            onAddAction={handleAddAction}
            control={control}
          />
       </div>
      </s.Wrapper>
    </RumComponentContextProvider >
  );
}

export default DateTimePickerEditor;
