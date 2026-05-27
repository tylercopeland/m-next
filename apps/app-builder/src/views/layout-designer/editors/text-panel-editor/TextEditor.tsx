/**
 * TextEditor
 * Block editor for Text Panel control in AppBuilder.
 * - UI for Content, Font Size, Font Color, Font Weight, etc.
 * - Allows customization of text appearance and layout.
 *
 * @component
 * @param {object} props
 * @param {object} props.rawControl - The control model.
 * @param {function} props.onChange - Callback for control changes.
 * @returns {JSX.Element}
 */

import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Tooltip } from "react-tooltip";
import { Text, TextLine } from "@m-next/typeography";
import { ButtonGroupRow } from '@m-next/button-group';
import Toggle from "@m-next/toggle";
import InputArea from '@m-next/input-area';
import Dropdown, { DropdownOption } from '@m-next/dropdown';
import { Guid, formatter, toCamelCase } from '@m-next/utilities';
import type { Field } from '@m-next/utilities';
import SvgIcon, { iconComponentMap, RuntimeSvgIconName } from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import {
  BaseControl,
  FieldTypeNames,
  FieldTypeIds,
  fieldTypeNameLookup,
  fieldTypeIdLookup,
  type FieldTypeId,
} from '@m-next/runtime-interface';
import { toV4FieldName, Z_POPUP } from '@m-next/layout-canvas';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';
import * as s from "../common/BlockEditor.styles";
import ActionListSection from "../common/components/action-list-section/ActionListSection";

import { selectBaseModel, selectControls, selectIsV4Screen, selectScreenFields } from '../../../../common/services/screenLayoutSlice';
import Accordion from '../../../../components/accordion/Accordion';
import ComplexValue from '../../../../components/complex-value/ComplexValue';
import { ValidationRuleValue } from "../common/components/validation-rules-list/ValidationRulesList";

// @ts-ignore stuff
import { createTextControl, migrateTextControl } from '../../control-classes/textControl';
import ColorSelector from "../../../../components/addable-list/component-selectors/ColorSelector";


// Define the interface for the TextControl model
interface TextControl extends BaseControl {
  id: string;
  name: string;
  caption?: string;
  content?: string;
  hrefFormat?: string; // This is used for auto-linking text
  icon?: RuntimeSvgIconName; // Use the SvgIconName type to enforce valid icon names
  iconAlign?: 'Left' | 'Right';
  autoLinkText?: boolean;
  linkFormat?: string;
  fieldType?: number;
  formatType?: string;
  formatRounding?: number;
  fontType?: string;
  center?: boolean;
  onClick?: string;
  classes?: string;
  isLocked: boolean;
  displayTag?: 'div' | 'h1';
  validationRules: ValidationRuleValue[];
  baseModel?: string; // Table name for mapped controls
  value?: string | number | null; // Runtime value (populated by data overlay); cleared when mapping
  styles?: {
    fontColor: string;
    textAlignment: string;
    fontWeight: string;
    fontSize: string;
  };
}

// Define the interface for the component props
interface TextEditorProps {
  rawControl: TextControl;
  onChange: (control: TextControl) => void;
  onAddAction: (control: TextControl, eventName: string) => void;
}

// Define the interface for the action items
interface ActionItem {
  value: string;
  label: string;
  source: string;
}

// Define the interface for the event items
interface EventItem {
  id: string;
  value: string;
  label: string;
}

const actions: ActionItem[] = [
  { value: `Click`, label: 'Click', source: 'onClick' },
];

const formatAsOptions = [
  { value: 'Short Date', label: 'Short Date' },
  { value: 'Short Date and Time', label: 'Short Date and Time' },
  { value: 'Long Date', label: 'Long Date' },
  { value: 'Long Date and Time', label: 'Long Date and Time' },
  { value: 'Time', label: 'Time' },
  { value: 'Hour', label: 'Hour' },
  { value: 'Day', label: 'Day' },
  { value: 'Day of Week', label: 'Day of Week' },
  { value: 'Month', label: 'Month' },
];

// These px values are an alias for the closest rem value we can support without the 
// standard root pixel size (ie. 16px = 1rem). We support 14px as the default (0.875rem).
const textSizeOptions = [
  { value: 'Small', label: 'S', secondary: '12px' },
  { value: 'Normal', label: 'M (Default)', secondary: '14px' },
  { value: 'Large', label: 'L', secondary: '16px' },
  { value: 'X-Large', label: 'XL', secondary: '20px' },
  { value: 'XX-Large', label: 'XXL', secondary: '24px' },
  { value: 'XXX-Large', label: '3XL', secondary: '26px' },
];


const fontWeightOptions = [
  { value: 'regular', icon: 'font-weight-regular' },
  { value: 'bold', icon: 'font-weight-bold' },
];

const linkFormatOptions = [
  { value: '', label: 'None' },
  { value: 'Email', label: 'Email' },
  { value: 'WebAddress', label: 'Web Address' },
  { value: 'Telephone', label: 'Telephone' },
  { value: 'GoogleMaps', label: 'Google Maps' },
];

const allowedFieldTypes = [
  FieldTypeNames.Text,
  FieldTypeNames.Integer,
  FieldTypeNames.Decimal,
  FieldTypeNames.DateTime,
  FieldTypeNames.Money,
  FieldTypeNames.YesNo,
  FieldTypeNames.DropDown,
  FieldTypeNames.Email,
  FieldTypeNames.Phone,
  FieldTypeNames.Address,
  FieldTypeNames.Date,
  FieldTypeNames.Time,
];

const normalizedFieldTypeValues = Object.values(FieldTypeNames);

const normalizeFieldType = (rawType: unknown, fieldName?: string): string | null => {
  if (rawType === null || rawType === undefined) return null;

  if (typeof rawType === 'number' && Number.isFinite(rawType)) {
    return fieldTypeNameLookup(rawType as FieldTypeId, fieldName);
  }

  if (typeof rawType === 'string') {
    const trimmed = rawType.trim();
    if (!trimmed) return null;

    const parsedNumber = Number(trimmed);
    if (!Number.isNaN(parsedNumber)) {
      return fieldTypeNameLookup(parsedNumber as FieldTypeId, fieldName);
    }

    if (trimmed.toLowerCase() === 'dropdown') {
      return FieldTypeNames.DropDown;
    }

    const normalized =
      normalizedFieldTypeValues.find((typeName) => typeName.toLowerCase() === trimmed.toLowerCase()) || trimmed;

    return normalized;
  }

  return null;
};

const toFieldTypeId = (fieldTypeName: string | null): number => {
  if (!fieldTypeName) return FieldTypeIds.Text;
  return fieldTypeIdLookup(fieldTypeName);
};

function TextEditor({ rawControl, onChange, onAddAction }: TextEditorProps) {

  const iconOptions = useMemo(() => Object.values(iconComponentMap).map(iconData => {
      const baseIconName = iconData.iconName.replace('mi-icon-', '');
      return {
        IconName: baseIconName,
        Icon: iconData.iconName,
        Name: iconData.name,
        Keywords: iconData.keywords || '',
        value: baseIconName,
        label: iconData.name,
        icon: iconData.iconName
      };
    }).sort((a, b) => a.Name.localeCompare(b.Name)), []);

  const screenBaseModel = useSelector(selectBaseModel);
  const isV4Screen = useSelector(selectIsV4Screen);
  const controlList = useSelector(selectControls);
  const fieldList = useSelector(selectScreenFields) as Field[];
  const [lastControlId, setLastControlId] = useState<string | null>(null);

  const control = useMemo(() => {
    const defaultControl = createTextControl();
    if (lastControlId !== rawControl.id) {
      setLastControlId(rawControl.id);
    }

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateTextControl(merged);
    return migrated ?? merged;
  }, [lastControlId, rawControl]);

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList ?? null, screenBaseModel, null, {}, undefined, undefined, true),
    [fieldList, screenBaseModel],
  );

  const selectedFieldType = useMemo(() => {
    if (!control.isBound || !fieldList) return null;
    // V4 stores the bound control name in underscore form (NCNG-160), so a
    // direct equality lookup misses the field. Reverse the transform when
    // matching on V4 screens — same pattern as MappedFieldSelector.selectedField.
    const field = fieldList.find((f) =>
      isV4Screen
        ? toV4FieldName(f.name).toLowerCase() === control.name.toLowerCase()
        : f.name.toLowerCase() === control.name.toLowerCase(),
    );
    return normalizeFieldType(field?.type, field?.name || control.name);
  }, [control.isBound, control.name, fieldList, isV4Screen]);

  const isDateFieldTypeSelected =
    selectedFieldType === FieldTypeNames.DateTime || selectedFieldType === FieldTypeNames.Date;

  const complexValueFieldType = useMemo(() => {
    if (selectedFieldType === FieldTypeNames.DateTime) return FieldTypeIds.DateTime;
    if (selectedFieldType === FieldTypeNames.Date) return FieldTypeIds.Date;
    if (selectedFieldType === FieldTypeNames.Decimal) return FieldTypeIds.Decimal;
    if (selectedFieldType === FieldTypeNames.Integer) return FieldTypeIds.Integer;
    if (selectedFieldType === FieldTypeNames.Money) return FieldTypeIds.Money;
    if (selectedFieldType === FieldTypeNames.YesNo) return FieldTypeIds.YesNo;
    if (selectedFieldType === FieldTypeNames.Phone) return FieldTypeIds.Phone;
    if (selectedFieldType === FieldTypeNames.Email) return FieldTypeIds.Email;
    return FieldTypeIds.Text;
  }, [selectedFieldType]);

  const handleMappedFieldChange = (updatedControl: TextControl) => {
    if (updatedControl.isBound) {
      updatedControl.baseModel = screenBaseModel;
      updatedControl.defaultValue = undefined;
      // Clear stale design-time value/content so runtime shows nothing when no active record.
      // control.value is the runtime data field; control.content is the caption fallback used by
      // savePayloadBuilder when reassembling the payload. Both must be cleared so neither leaks
      // through to MongoDB as a fake "Label_2" placeholder.
      updatedControl.value = undefined;
      updatedControl.content = undefined;

      // On V4 screens, NCNG-160 transforms the bound name via toV4FieldName
      // (e.g. "CompanyName" → "Company_name"), so a direct equality lookup against
      // fieldList no longer matches. Mirror MappedFieldSelector.selectedField and
      // compare the transformed field name when isV4Screen is true; otherwise the
      // V4 mapped field falls through, fieldType defaults to text, and date/decimal
      // formatting (formatType / formatRounding) is silently lost.
      const mappedField = fieldList?.find((f) =>
        isV4Screen
          ? toV4FieldName(f.name).toLowerCase() === updatedControl.name.toLowerCase()
          : f.name.toLowerCase() === updatedControl.name.toLowerCase(),
      );
      const mappedFieldType = normalizeFieldType(mappedField?.type, mappedField?.name || updatedControl.name);
      updatedControl.fieldType = toFieldTypeId(mappedFieldType);

      if (mappedFieldType === FieldTypeNames.DateTime || mappedFieldType === FieldTypeNames.Date) {
        updatedControl.formatType = updatedControl.formatType || 'Short Date';
      } else {
        updatedControl.formatType = undefined;
      }

      if (mappedFieldType !== FieldTypeNames.Decimal && mappedFieldType !== FieldTypeNames.Money) {
        updatedControl.formatRounding = undefined;
      }
    } else {
      updatedControl.defaultValue = { valueType: 9, value: '' };
      updatedControl.fieldType = FieldTypeIds.Text;
      updatedControl.formatType = undefined;
      updatedControl.formatRounding = undefined;
    }

    onChange(updatedControl);
  };

  const handlePropertyChange = (property: keyof TextControl, value: unknown) => {
    const updatedControl = { ...control, [property]: value };
    onChange(updatedControl);
  }

  useEffect(() => {
    if (!control.isBound) return;
    if (!isDateFieldTypeSelected) return;
    if (control.formatType && control.formatType !== '') return;

    onChange({ ...control, formatType: 'Short Date' });
  }, [control, isDateFieldTypeSelected, onChange]);

  const handleAddAction = (property: string, eventName: string) => {
    // Create a new actionSetId if one doesn't exist
    const actionSetId = Guid.create();
    const updated = { ...control, [property]: actionSetId };

    onChange(updated);
    onAddAction(updated, eventName);
  };

  const events = useMemo(() => {
    const list: EventItem[] = [];
    if (control.onClick) {
      list.push({ id: control.onClick, value: `Click`, label: 'Click' });
    }
    return list;
  }, [control.onClick]);

  const filteredActions = useMemo(
    () => actions.filter((action) => !events.some((item) => item.value === action.value)),
    [events],
  );

  const handleShowIconChange = (checked: boolean) => {
    if (checked) {
      onChange({ ...control, icon: control.icon || 'plus' });
    }
    else {
      onChange({ ...control, icon: undefined });
    }
  };

  const textAlignment = useMemo(() => control.styles?.textAlignment || 'left', [control.styles?.textAlignment]);

  const handleTextAlignmentChange = (value: string) => {
    const updatedControl = { 
      ...control, 
      styles: { 
        ...control.styles, 
        textAlignment: value 
      } 
    };
    onChange(updatedControl);
  };

  const handleTextSizeChange = (value: string) => {
    const updatedControl = {
      ...control, 
      styles: { 
        ...control.styles, 
        fontSize: value
      } 
    };
    onChange(updatedControl);
  };

  const fontWeight = useMemo(() => control.styles?.fontWeight || 'regular', [control.styles?.fontWeight]);

  const handleFontWeightChange = (value: string) => {
    const updatedControl = { 
      ...control, 
      styles: { 
        ...control.styles, 
        fontWeight: value 
      } 
    };
    onChange(updatedControl);
  };

  const fontColor = useMemo(() => control.styles?.fontColor || 'grey-darker', [control.styles?.fontColor]);

  const handleFontColorChange = (colorKey: string) => {
    const updatedControl = { 
      ...control, 
      styles: { 
        ...control.styles, 
        fontColor: colorKey 
      } 
    };
    onChange(updatedControl);
  };

  const selectedIcon = useMemo(() => {
    if (!control.icon) {
      return iconOptions.find((opt: DropdownOption) => opt.value === 'plus') || { value: 'plus', label: 'Plus' };
    }
    
    // Remove the 'mi-icon-' prefix to match our iconOptions format
    const baseIconName = control.icon.replace('mi-icon-', '');
    return iconOptions.find((opt: DropdownOption) => opt.value === baseIconName) || { value: 'plus', label: 'Plus' };
  }, [control.icon, iconOptions]);


  return (
    <RumComponentContextProvider componentName='TextEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word'}} />
      <s.Wrapper padding={16} gutter={96}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextLine>Edit the base configuration and styles of the text label.</TextLine>

          <MappedFieldSelector
            control={control}
            onChange={handleMappedFieldChange}
            fieldTypes={allowedFieldTypes}
            isLoading={false}
            unboundFallback={
              <InputArea
                value={(control.defaultValue && typeof control.defaultValue === 'object' && control.defaultValue.value) || ''}
                id='manual-text-input'
                label='Text'
                autoGrow={false}
                disableResize
                initialHeight={64}
                onChange={(value) => {
                  const updatedControl = {
                    ...control,
                    defaultValue: {
                      valueType: 9,
                      value
                    }
                  };
                  onChange(updatedControl);
                }}
              />
            }
          />
          
          <s.SettingDivider />
            
          <Accordion
            id='display-section' 
            caption='Display' 
            variant='left' 
            open 
            borderless
            >            
            <s.LineWrapper>
              <Text>Show icon</Text>
              <Toggle
                id="show-icon"
                checked={!!control.icon}
                onChange={handleShowIconChange}
                width="184px"
              />
            </s.LineWrapper>
            
            {!!control.icon && (
              <>
               <s.LineWrapper gap={8}>
                  <SvgIcon name="arrow-elbow" size={12} color={colors.grey} />
                  <Text style={{flex: 'auto' }} >Icon</Text>
                  <Dropdown
                    id='icon'
                    value={selectedIcon}
                    options={iconOptions}
                    dropdownStyle='multi-icon'
                    isV4Design
                    width={184}
                    onChange={(e) => handlePropertyChange('icon', `mi-icon-${e.value}`)}
                  />
                </s.LineWrapper>

                <s.LineWrapper gap={8}>
                  <SvgIcon name="arrow-elbow" size={12} color={colors.grey} />
                  <Text style={{flex: 'auto' }}>Icon position</Text>
                  <div style={{width: '184px', display: 'inline-block'}}>
                  <ButtonGroupRow
                    id='icon-position'
                    width="184px"
                    selected={control.iconAlign === 'Right' ? '>|' : '|<'}
                    data={[
                      { value: '|<', label: '|<' },
                      { value: '>|', label: '>|' }
                    ]}
                    onClick={(e) => {
                      // Ensure we're setting a valid value
                      const iconPosition = e.value === '>|' ? 'Right' : 'Left';
                      handlePropertyChange('iconAlign', iconPosition);
                    }}
                  />
                  </div>
                </s.LineWrapper>
              </>
            )}
            
            <s.LineWrapper>
              <Text
                tooltip='Converts text into a clickable link.'
                tooltipId='editor-tooltip'
                tooltipHighlighting
              >
                Link format
              </Text>
              <Dropdown
                id='link-format'
                value={{ value: control.hrefFormat || '', label: linkFormatOptions.find(opt => opt.value === (control.hrefFormat || ''))?.label || 'None' }}
                options={linkFormatOptions}
                dropdownStyle='multi-icon'
                isV4Design
                width={184}
                onChange={(e) => handlePropertyChange('hrefFormat', e.value)}
              />
            </s.LineWrapper>
            
            {control.isBound && isDateFieldTypeSelected && (
              <s.LineWrapper>
                <Text>Format As</Text>
                <Dropdown
                  id='format-as'
                  value={{ value: control.formatType || 'Short Date', label: control.formatType || 'Short Date' }}
                  options={formatAsOptions}
                  dropdownStyle='multi-icon'
                  isV4Design
                  width={184}
                  onChange={(e) => handlePropertyChange('formatType', e.value)}
                />
              </s.LineWrapper>
            )}
            {control.isBound && selectedFieldType === FieldTypeNames.Decimal && (
              <s.LineWrapper>
                <Text>Rounding</Text>
                <Dropdown
                  id='decimal-places'
                  width={184}
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
            {control.isBound && <s.LineWrapper align='flex-start'>
              <Text style={{ lineHeight: '32px' }}>Default value</Text>
              <ComplexValue
                id={`default-value-${control.id}`}
                complexValue={control.defaultValue}
                fieldListOptions={fieldListOptions ?? []}
                fieldType={complexValueFieldType as unknown as string}
                includeControls
                includeNone
                includeSessionVariables
                includeCurrentDate={isDateFieldTypeSelected}
                controlList={controlList}
                width={184}
                onChange={(e) => handlePropertyChange('defaultValue', e)}
                controlId={control.id}
              />
            </s.LineWrapper>
            }
            <DefaultStateSelector onChange={onChange} control={control} />
          </Accordion>
          
          <s.SettingDivider />
          
          <Accordion 
            id='styles-section' 
            caption='Styles' 
            variant='left' 
            open 
            borderless
          >
            <s.LineWrapper>
              <Text>Color</Text>
              <ColorSelector
                id='color'
                value={fontColor}
                onChange={handleFontColorChange}
                width={184}
                showLabel
                type='fill-color'
              />
            </s.LineWrapper>
            <s.LineWrapper>
              <Text>Text alignment</Text>
              <ButtonGroupRow
                id='column-alignment'
                width={184}
                selected={textAlignment}
                data={[
                  { value: 'left', icon: 'text-align-left' },
                  { value: 'center', icon: 'text-align-center' },
                  { value: 'right', icon: 'text-align-right' },
                  { value: 'justify', icon: 'text-align-justify' },
                ]}
                onClick={(e) => handleTextAlignmentChange(e.value as string)}
              />
            </s.LineWrapper>
            
            <s.LineWrapper>
              <Text>Text size</Text>
              <Dropdown
                id='text-size'
                value={textSizeOptions.find((opt) => opt.value === control.styles.fontSize) || { value: 'Normal', label: 'M', secondary: '14px' }}
                options={textSizeOptions}
                dropdownStyle='multi-icon'
                isV4Design
                width={184}
                onChange={(e) => handleTextSizeChange(e.value as string)}
              />
            </s.LineWrapper>

            <s.LineWrapper>
              <Text>Font weight</Text>
              <ButtonGroupRow
                id='font-weight'
                width={184}
                selected={fontWeight}
                data={fontWeightOptions}
                onClick={(e) => handleFontWeightChange(e.value as string)}
              />
            </s.LineWrapper>
          </Accordion>
          
          <s.SettingDivider />
          
          <ActionListSection
            caption='Events'
            values={events}
            emptyMessage='No events applied'
            canAdd={filteredActions.length > 0}
            addLabel='Add click'
            actions={filteredActions}
            onAddAction={handleAddAction}
            control={control}
            valueKey='value'
            optionKey='value'
          />
        </div>
      </s.Wrapper>
    </RumComponentContextProvider>
  );
}

export default TextEditor;
