/**
 * Component for editing column settings in a grid.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onChange - Callback function to handle changes to the column settings.
 * @param {GridColumnModel} props.column - The column model object.
 * @param {GridColumnModel[]} props.columns - Array of column model objects.
 * @param {string} props.viewFriendlyName - The friendly name of the view.
 * @param {Object[]} props.fieldList - Array of field objects.
 * @param {Object} props.controlList - Object containing control list.
 * @param {Object} props.displayPreferences - Object containing display preferences.
 * @returns {JSX.Element} The rendered component.
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import { fieldTypeIdIcons, FieldTypeIds } from '@m-next/types';
import SvgIcon from '@m-next/svg-icon';
import Toggle from '@m-next/toggle';
import { formatter, Guid } from '@m-next/utilities';
import { colors } from '@m-next/styles';

import { ValidationRuleTypes } from '@m-next/runtime-interface';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import * as s from './GridBlockEditor.styles';
import { GridColumnModel } from './type';

import Accordion from '../../../../components/accordion/Accordion';
import ValidationRulesList from '../common/components/validation-rules-list/ValidationRulesList';
import ColumnBooleanSection from './sections/ColumnBooleanSection';
import ColumnNumberSection from './sections/ColumnNumberSection';
import ColumnFormulaSection from './sections/ColumnFormulaSection';
import ColumnDropdownSection from './sections/ColumnDropdownSection';
import ComplexValue from '../../../../components/complex-value/ComplexValue';
import ColumnDateTimeSection from './sections/ColumnDateTimeSection';
import ColumnButtonDisplaySection from './sections/ColumnButtonDisplaySection';
import ColumnCardSection from './sections/ColumnCardSection';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import EditorInput from '../common/components/editor-input/EditorInput';

// types
const propTypes = {
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
  column: GridColumnModel,
  columns: PropTypes.arrayOf(GridColumnModel),
  viewFriendlyName: PropTypes.string,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  onSelectChild: PropTypes.func,
  selectedChildColumn: PropTypes.string,
  control: PropTypes.instanceOf(Object),
};

function ColumnSettings({
  column,
  columns,
  onChange,
  viewFriendlyName,
  fieldList,
  controlList,
  displayPreferences,
  onSelectChild,
  selectedChildColumn,
  control,
  onAddAction,
}) {
  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList, viewFriendlyName, null, {}, displayPreferences, null, true),
    [displayPreferences, fieldList, viewFriendlyName],
  );

  const validationOptions = useMemo(() => {
    const options = [ValidationRuleTypes.Required, ValidationRuleTypes.MaliciousValues];
    if (column.fieldType === FieldTypeIds.Text) {
      options.push(
        ValidationRuleTypes.IsValidEmailAddress,
        ValidationRuleTypes.MinLength,
        ValidationRuleTypes.MaxLength,
      );
    }
    if (
      column.fieldType === FieldTypeIds.Integer ||
      column.fieldType === FieldTypeIds.Decimal ||
      column.fieldType === FieldTypeIds.Money
    ) {
      options.push(ValidationRuleTypes.LessThan, ValidationRuleTypes.GreaterThan);
    }
    return options;
  }, [column]);

  const validationRules = useMemo(() => {
    const updated = [...column.validationRules];
    const maxLengthRule = updated.find((x) => x.rule === ValidationRuleTypes.MaxLength && !x.canDelete);
    if (maxLengthRule && fieldList && fieldList.length > 0) {
      const field = fieldList.find((x) => x.name === column.field);
      if (field) {
        maxLengthRule.maxValue = field.size;
      }
    }
    return updated;
  }, [column.field, column.validationRules, fieldList]);

  const availableEvents = useMemo(() => {
    if (column.fieldType === FieldTypeIds.Formula || column.field === 'RecordID') {
      return null;
    }

    if (column.fieldType === FieldTypeIds.Button) {
      return [{ value: `${column.field} Change`, label: 'Click', source: 'onChangeEvent' }];
    }

    return [{ value: `${column.field} Change`, label: 'Change', source: 'onChangeEvent' }];

  }, [column.fieldType, column.field]);

  const events = useMemo(() => {
    const list = [];
    
    if (column.onChangeEvent) {
      list.push({
        id: column.onChangeEvent, 
        value: `${column.field} Change`, 
        label: column.fieldType === FieldTypeIds.Button ? 'Click' : 'Change' 
      });
    }
    if (column.onClickEvent) {
      list.push({ id: column.onClickEvent, value: `${column.field} Column Click`, label: 'Column click' });
    }
    return list;
  }, [column.field, column.fieldType, column.onChangeEvent, column.onClickEvent]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...column, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...column, [property]: { ...column[property], [child]: value } };
    onChange(updated);
  };

  const handleHeaderChange = (e) => {
    handlePropertyChange('header', e);
  };

  const handleWidthChange = (e) => {
    if (e.value === 'fixed') {
      let widthFixed = 141;
      if (column.fieldType === FieldTypeIds.DateTime) {
        switch (column.format?.dateType) {
          case 'Short Date':
          case 'Long Date':
          case 'Day':
          case 'Day of Week':
          case 'Month':
          case 'Month and Year':
          case 'Year':
          case 'Time':
          case 'Hour':
            widthFixed = 64;
            break;
          default:
            widthFixed = 128;
            break;
        }
      }

      if (
        column.fieldType === FieldTypeIds.Money ||
        column.fieldType === FieldTypeIds.Decimal ||
        column.fieldType === FieldTypeIds.Integer
      ) {
        widthFixed = 96;
      }

      if (column.fieldType === FieldTypeIds.Picture || column.fieldType === FieldTypeIds.YesNo) {
        widthFixed = 40;
      }

      const updated = { ...column, format: { ...column.format, width: e.value, widthFixed } };
      onChange(updated);
    } else {
      handleChildPropertyChange('format', 'width', e.value);
    }
  };

  const handleAddAction = (property, eventName) => {
    const updated = { ...column, [property]: Guid.create() };
    onAddAction(updated, eventName);
  };

  const showActionList = (
    // show if one of the || fields
    column.fieldType === FieldTypeIds.Button ||
    column.fieldType === FieldTypeIds.DropDown || (
      // else exclude some fields and locked columns
      column.fieldType !== FieldTypeIds.CardColumn &&
      column.fieldType !== FieldTypeIds.Formula &&
      !column.isLocked)
  );

  return (
    <RumComponentContextProvider componentName='ColumnSettings'>
      <div style={{ paddingBottom: 240 }}>
        <s.Wrapper padding={16}>
          {column.fieldType === FieldTypeIds.Button && (
            <ColumnButtonDisplaySection
              column={column}
              onChange={onChange}
            />
          )}
          {column.fieldType === FieldTypeIds.CardColumn && (
            <ColumnCardSection
              column={column}
              onChange={onChange}
              onSelectChild={onSelectChild}
              fieldList={fieldList}
              viewFriendlyName={viewFriendlyName}
              selectedChildColumn={selectedChildColumn}
            />
          )}
          {column.fieldType === FieldTypeIds.DropDown && (
            <ColumnDropdownSection
              column={column}
              onChange={onChange}
              columns={columns}
            />
          )}

          {column.fieldType !== FieldTypeIds.Button &&
            column.fieldType !== FieldTypeIds.CardColumn &&
            column.fieldType !== FieldTypeIds.DropDown && (
              <>
                <TextLine>Edit a column in the parent grid.</TextLine>
                <s.HeaderIconWrapper gap={4}>
                  <Text style={{ flexBasis: '46%' }}>Name in database</Text>
                  <SvgIcon id='field-type' size={12} name={fieldTypeIdIcons[column.fieldType]} />
                  <Text style={{ fontStyle: 'italic' }}>{column.field}</Text>
                </s.HeaderIconWrapper>

                <s.LineWrapper>
                  <Text
                    tooltip='Determines if this column can be edited when the grid is set to an editable state.'
                    tooltipId='editor-tooltip'
                    tooltipHighlighting
                  >
                    Column type
                  </Text>
                  <ButtonGroupRow
                    id='column-type'
                    width={184}
                    selected={column.readOnly}
                    data={
                      column.isLocked
                        ? [{ value: true, label: 'Read only' }]
                        : [
                          { value: true, label: 'Read only' },
                          { value: false, label: 'Editable' },
                        ]
                    }
                    onClick={column.isLocked ? null : (e) => handlePropertyChange('readOnly', e.value)}
                  />
                </s.LineWrapper>

                <s.SettingDivider />
                <Accordion id='display' caption='Display' variant='left' open borderless>
                  <EditorInput
                    id='header'
                    value={column.header}
                    label='Header title'
                    onChange={handleHeaderChange}
                    controlId={column.field}
                    maxLength={40}
                  />

                  <s.LineWrapper gap={8}>
                    <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                    <Toggle
                      id='show-header'
                      checked={column.showHeader}
                      onChange={(e) => handlePropertyChange('showHeader', e)}
                      label='Show title'
                      width='100%'
                      style={{ justifyContent: 'flex-start' }}
                      labelStyle={{ flexBasis: '100%' }}
                    />
                  </s.LineWrapper>

                  <s.LineWrapper>
                    <Text
                      tooltip="Choose between 'Auto' which adjusts width dynamically with size presets, or 'Fixed' which specifies a pixel width."
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
                  {column.fieldType === FieldTypeIds.Text && column.format.width === 'dynamic' && (
                    <s.LineWrapper>
                      <Text style={{ flexGrow: 1 }} />
                      <ButtonGroupRow
                        id='column-auto-width'
                        width={184}
                        selected={column.format.widthAutoSize}
                        data={[
                          { value: 'sm', label: 'Small' },
                          { value: 'md', label: 'Medium' },
                          { value: 'lg', label: 'Large' },
                        ]}
                        onClick={(e) => handleChildPropertyChange('format', 'widthAutoSize', e.value)}
                      />
                    </s.LineWrapper>
                  )}
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
                  <s.LineWrapper>
                    <Text
                      tooltip='Aligns both the header and content in the cell.'
                      tooltipId='editor-tooltip'
                      tooltipHighlighting
                    >
                      Alignment
                    </Text>
                    <ButtonGroupRow
                      id='column-alignment'
                      width={184}
                      selected={column.format.alignment}
                      data={[
                        { value: 'left', icon: 'align-left' },
                        { value: 'center', icon: 'align-center' },
                        { value: 'right', icon: 'align-right' },
                      ]}
                      onClick={(e) => handleChildPropertyChange('format', 'alignment', e.value)}
                    />
                  </s.LineWrapper>

                  {column.readOnly && [
                    FieldTypeIds.DateTime, FieldTypeIds.Date, FieldTypeIds.Time,
                    FieldTypeIds.Decimal, FieldTypeIds.Integer, FieldTypeIds.Linked,
                    FieldTypeIds.Money, FieldTypeIds.Text,
                  ].includes(column.fieldType) && (
                    <s.LineWrapper>
                      <Text
                        tooltip='Sets the font weight for the cells in this column (regular, semibold, or bold).'
                        tooltipId='editor-tooltip'
                        tooltipHighlighting
                      >
                        Font weight
                      </Text>
                      <ButtonGroupRow
                        id='column-font-weight'
                        width={184}
                        selected={column.format.fontWeight || 'normal'}
                        data={[
                          { value: 'normal', label: 'Ag', labelStyle: { fontWeight: 400, fontSize: 14 } },
                          { value: '600', label: 'Ag', labelStyle: { fontWeight: 600, fontSize: 14 } },
                          { value: 'bold', label: 'Ag', labelStyle: { fontWeight: 700, fontSize: 14 } },
                        ]}
                        onClick={(e) => handleChildPropertyChange('format', 'fontWeight', e.value)}
                      />
                    </s.LineWrapper>
                  )}

                  {(column.fieldType === FieldTypeIds.Integer ||
                    column.fieldType === FieldTypeIds.Decimal ||
                    column.fieldType === FieldTypeIds.Money) && (
                      <ColumnNumberSection
                        column={column}
                        onChange={onChange}
                        fieldListOptions={fieldListOptions}
                        controlList={controlList}
                      />
                    )}

                  {column.fieldType === FieldTypeIds.Formula && (
                    <>
                      <s.SettingDivider style={{ padding: '8px 0px' }} />
                      <ColumnFormulaSection column={column} onChange={onChange} viewFriendlyName={viewFriendlyName} />
                    </>
                  )}

                  { !column.isLocked && (column.fieldType === FieldTypeIds.Text || column.fieldType === FieldTypeIds.YesNo) && (
                    <s.LineWrapper align='flex-start'>
                      <Text style={{ lineHeight: '32px' }}>Default value</Text>
                      <ComplexValue
                        id='default-value'
                        complexValue={column.defaultValue}
                        fieldListOptions={fieldListOptions}
                        fieldType={column.fieldType}
                        includeControls
                        includeNone
                        includeSessionVariables
                        controlList={controlList}
                        width={184}
                        onChange={(e) => handlePropertyChange('defaultValue', e)}
                        controlId={column.controlId}
                      />
                    </s.LineWrapper>
                  )}

                  {(column.fieldType === FieldTypeIds.DateTime ||
                    column.fieldType === FieldTypeIds.Date ||
                    column.fieldType === FieldTypeIds.Time) && (
                      <ColumnDateTimeSection
                        column={column}
                        onChange={onChange}
                        fieldListOptions={fieldListOptions}
                        controlList={controlList}
                      />
                    )}
                  {column.fieldType === FieldTypeIds.YesNo && (
                    <ColumnBooleanSection column={column} onChange={onChange} />
                  )}
                </Accordion>
                {!column.isLocked &&
                  column.fieldType !== FieldTypeIds.Formula &&
                  column.fieldType !== FieldTypeIds.Button &&
                  column.fieldType !== FieldTypeIds.CardColumn &&
                  column.fieldType !== FieldTypeIds.FileAttachment &&
                  column.fieldType !== FieldTypeIds.Picture &&
                  column.fieldType !== FieldTypeIds.YesNo && (
                    <>
                      <s.SettingDivider style={{ padding: '8px 0px' }} />
                      <ValidationRulesList
                        standardOptions={validationOptions}
                        values={validationRules}
                        onChange={(e) => handlePropertyChange('validationRules', e)}
                      />
                    </>
                  )}
              </>
            )}
          {showActionList && (
            <ActionListSection
              caption='Column events'
              values={events}
              emptyMessage='No column events applied'
              canAdd
              actions={availableEvents}
              addLabel={availableEvents.length === 1 ? `Add ${availableEvents[0].label}` : 'Add'}
              control={control}
              onAddAction={handleAddAction}
            />
          )}
        </s.Wrapper>
      </div>
    </RumComponentContextProvider>
  );
}

ColumnSettings.propTypes = propTypes;
export default ColumnSettings;
