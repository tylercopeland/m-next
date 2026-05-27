import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { formatter, Guid, toCamelCase } from '@m-next/utilities';
import { Tooltip } from 'react-tooltip';
import {
  BaseControl,
  Field,
  FieldTypeNames,
  InputControl,
  ValidationRule,
  ValidationRuleType,
  ValidationRuleTypes,
  createInputControl,
} from '@m-next/runtime-interface';
import SvgIcon from '@m-next/svg-icon';
import Toggle from '@m-next/toggle';
import { colors } from '@m-next/styles';
import { Z_POPUP } from '@m-next/layout-canvas';
import { useSelector } from 'react-redux';
import { Text } from '@m-next/typeography';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import Accordion from '../../../../components/accordion/Accordion';
import ActionListSection from '../common/components/action-list-section/ActionListSection';

import * as s from '../common/BlockEditor.styles';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import EditorInput from '../common/components/editor-input/EditorInput';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';
import ValidationRulesList from '../common/components/validation-rules-list/ValidationRulesList';
import { selectScreenFields, selectControls, selectBaseModel } from '../../../../common/services/screenLayoutSlice';
import ComplexValue from '../../../../components/complex-value/ComplexValue';

interface InputControlWithEvents extends InputControl {
  onFocus?: string | null;
  onChange?: string | null;
  onBlur?: string | null;
}

interface InputEditorProps {
  rawControl: InputControlWithEvents;
  onChange: (control: InputControlWithEvents) => void;
  onAddAction: (control: InputControlWithEvents, eventName: string) => void;
}

const inputTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password', singleLineOnly: true },
  { value: 'number', label: 'Number', singleLineOnly: true },
  { value: 'tel', label: 'Telephone' },
  { value: 'url', label: 'URL' },
  { value: 'search', label: 'Search' },
];

const allowedFieldTypes = [
  FieldTypeNames.Text,
  FieldTypeNames.Integer,
  FieldTypeNames.Decimal,
  FieldTypeNames.Money,
  FieldTypeNames.Email,
  FieldTypeNames.Phone,
];

const actions = [
  { value: 'Focus', label: 'Focus', source: 'onFocus' },
  { value: 'Change', label: 'Change', source: 'onChange' },
  { value: 'Lose Focus', label: 'Lose focus', source: 'onBlur' },
];

const InputEditor = ({ rawControl, onChange, onAddAction }: InputEditorProps) => {
  const fieldList = useSelector(selectScreenFields) as Field[];
  const controlList = useSelector(selectControls);
  const screenBaseModel = useSelector(selectBaseModel) as string;
  const [hasMultipleLines, setHasMultipleLines] = useState(rawControl.rows && rawControl.rows > 1);

  const control: InputControlWithEvents = useMemo(() => {
    const defaultControl = createInputControl({
      caption: 'Input',
      name: 'input',
    });

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    return merged;
  }, [rawControl]);

  useEffect(() => {
    setHasMultipleLines(control.rows && control.rows > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control.id]);

  const fieldListOptions = useMemo(() => {
    if (!fieldList || !screenBaseModel) {
      return [];
    }
    const formattedList = formatter.formatFieldList(
      fieldList,
      screenBaseModel,
      null,
      {},
      {},
      allowedFieldTypes,
      false,
      false,
      true,
    );
    return formattedList?.flatMap((section) => section.options) ?? [];
  }, [fieldList, screenBaseModel]);

  const handlePropertyChange = (property: string, value: unknown) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const events = useMemo(() => {
    const eventList = [];
    if (control.onFocus) {
      eventList.push({ id: control.onFocus, value: 'Focus', label: 'Focus' });
    }
    if (control.onChange) {
      eventList.push({ id: control.onChange, value: 'Change', label: 'Change' });
    }
    if (control.onBlur) {
      eventList.push({ id: control.onBlur, value: 'Lose Focus', label: 'Lose focus' });
    }
    return eventList;
  }, [control.onFocus, control.onChange, control.onBlur]);

  const handleAddAction = (source: string, value: string) => {
    const updated = { ...control, [source]: Guid.create() };
    onAddAction(updated, value);
  };

  const handleCaptionChange = (newCaption: string, newName: string) => {
    // When control is mapped (isBound), preserve the field name - don't overwrite it
    const updated = { ...control, caption: newCaption, name: control.isBound ? control.name : newName };
    onChange(updated);
  };

  const selectedInputType = useMemo(() => inputTypeOptions.find((o) => o.value === control.inputType) ?? inputTypeOptions[0], [control.inputType]);

  // Filter out number/password options when in multi-line mode (not supported)
  const filteredInputTypeOptions = useMemo(() => {
    if (hasMultipleLines) {
      return inputTypeOptions.filter((o) => !o.singleLineOnly);
    }
    return inputTypeOptions;
  }, [hasMultipleLines]);

  const selectedField = useMemo(() => {
    const field = fieldList?.find((x) => x.name === control.name);
    return field;
  }, [control, fieldList]);

  const validationOptions = useMemo(() => {
    let type = selectedField?.type;
    if (!selectedField) {
      type = FieldTypeNames.Text; // Default to Text if no field is selected
      if (control.inputType === 'number') {
        type = FieldTypeNames.Decimal; // Default to Integer for number input type
      }
    }
    const options = [ValidationRuleTypes.Required, ValidationRuleTypes.MaliciousValues] as ValidationRuleType[];
    if (type === FieldTypeNames.Text) {
      options.push(
        ValidationRuleTypes.IsValidEmailAddress,
        ValidationRuleTypes.MinLength,
        ValidationRuleTypes.MaxLength,
      );
    }
    if (type === FieldTypeNames.Integer || type === FieldTypeNames.Decimal || type === FieldTypeNames.Money) {
      options.push(ValidationRuleTypes.LessThan, ValidationRuleTypes.GreaterThan);
    }
    return options;
  }, [control.inputType, selectedField]);

  const validationRules = useMemo(() => {
    const updated = [...(control.validationRules ?? [])] as ValidationRule[];

    if (selectedField) {
      const maxLengthRule = updated.find((x) => x.rule === ValidationRuleTypes.MaxLength && !x.canDelete);
      const requiredRule = updated.find((x) => x.rule === ValidationRuleTypes.Required);
      if (!requiredRule && selectedField.isRequired) {
        updated.push({ rule: ValidationRuleTypes.Required, canDelete: false });
      }
      if (maxLengthRule) {
        maxLengthRule.maxValue = selectedField.size;
      }
    }
    return updated;
  }, [control.validationRules, selectedField]);

  const safeValidationRules = validationRules.map((rule) => ({
    ...rule,
    value: rule.value !== undefined ? rule.value : '',
  }));

  const filteredActions = useMemo(
    () => actions.filter((action) => !events.some((item) => item.value === action.value)),
    [events],
  );


  const handleMappedFieldChange = (updatedControl: BaseControl) => {
    const updated = { ...updatedControl } as InputControlWithEvents;
    if (updated.isBound) {
      const field = fieldList.find((x) => x.name === updatedControl.name);
      updated.validationRules = [];
      if (field) {
        if (field.isRequired) {
          updated.validationRules.push({ rule: ValidationRuleTypes.Required, canDelete: false });
        }
        // Check if field is a numeric type (Decimal, Integer, Money)
        const isNumericField = field.type === FieldTypeNames.Decimal ||
                               field.type === FieldTypeNames.Integer ||
                               field.type === FieldTypeNames.Money;
        updated.inputType = isNumericField ? 'number' : 'text';
        if (field.size && field.size > 0 && !isNumericField) {
          updated.validationRules.push({
            rule: ValidationRuleTypes.MaxLength,
            canDelete: false,
            value: field.size,
          });
        }
      }
    } else {
      updated.validationRules = validationRules.map((rule) => ({
        ...rule,
        canDelete: true,
      }));
    }
    onChange(updated);
  };

  return (
    <RumComponentContextProvider componentName='InputEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <s.Wrapper padding={16}>
        <p>Editing the base configuration and styles of the input field.</p>
        <MappedFieldSelector 
          control={control} 
          onChange={handleMappedFieldChange} 
          fieldTypes={allowedFieldTypes} 
          isLoading={false}
        />
        <s.SettingDivider />

        <Accordion id='display' caption='Display' variant='left' open borderless>
          <CaptionInput
            id='label'
            label='Label'
            controlId={control.id}
            value={control.caption || ''}
            onChange={handleCaptionChange}
            maxLength={40}
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
          <EditorInput
            id='placeholder'
            value={control.placeholder || ''}
            onChange={(value) => handlePropertyChange('placeholder', value)}
            controlId={control.id}
            label='Placeholder'
            resetOnBlank={false}
          />
          <s.LineWrapper>
            <span>Input type</span>
            <Dropdown
              id='input-type'
              isV4Design
              options={filteredInputTypeOptions}
              value={selectedInputType}
              width={184}
              onChange={(option) => handlePropertyChange('inputType', option.value)}
              ariaLabel='Input type'
            />
          </s.LineWrapper>

          {selectedField?.type === FieldTypeNames.Decimal && (
            <s.LineWrapper>
              <Text>Rounding</Text>
              <Dropdown
                id='decimal-places'
                width='184px'
                value={{ value: control.formatRounding ?? 2, label: String(control.formatRounding ?? 2) }}
                onChange={(option) => handlePropertyChange('formatRounding', option.value)}
                isV4Design
                options={[
                  { value: 0, label: '0' },
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                ]}
              />
            </s.LineWrapper>
          )}
          <s.LineWrapper align='flex-start'>
            <div style={{ lineHeight: '32px' }}>
              <Text tooltip='Sets the initial value of the input.' tooltipId='editor-tooltip' tooltipHighlighting>
                Default value
              </Text>
            </div>
            <ComplexValue
              id={`default-value-${control.id}`}
              complexValue={control.defaultValue}
              fieldListOptions={fieldListOptions}
              fieldType={control.inputType === 'number' ? FieldTypeNames.Decimal : FieldTypeNames.Text}
              includeControls
              includeNone
              includeSessionVariables
              controlList={controlList ?? {}}
              width={184}
              onChange={(e) => handlePropertyChange('defaultValue', e)}
              controlId={control.id}
            />
          </s.LineWrapper>
          <DefaultStateSelector control={control} onChange={onChange} />
        </Accordion>
        <s.SettingDivider />
        <ValidationRulesList
          standardOptions={validationOptions}
          values={safeValidationRules}
          onChange={(e) => handlePropertyChange('validationRules', e)}
        />

        <s.SettingDivider />
        <ActionListSection
          caption='Events'
          values={events}
          emptyMessage='No events applied'
          canAdd={filteredActions.length > 0}
          actions={filteredActions}
          addLabel='Add'
          onAddAction={handleAddAction}
          control={control as unknown as { [key: string]: unknown }}
          optionKey='value'
        />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

InputEditor.propTypes = {
  rawControl: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onAddAction: PropTypes.func.isRequired,
};

export default InputEditor;
