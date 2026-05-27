/**
 * HtmlEditorBlockEditor
 * Block editor for HTML Editor control in AppBuilder.
 * - UI for Label, Show Label, Placeholder, Default State.
 * - Supports data source mapping to fields.
 * - Enforces business rules (required, max length, etc).
 *
 * @component
 * @param {object} props
 * @param {object} props.rawControl - The control model.
 * @param {function} props.onChange - Callback for control changes.
 * @returns {JSX.Element}
 */

import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import { Tooltip } from "react-tooltip";
import { Text, TextLine } from "@m-next/typeography";
import Toggle from "@m-next/toggle";
import { Guid, formatter, toCamelCase } from '@m-next/utilities';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { FieldTypeIds } from '@m-next/types';
import { ValidationRuleTypes, FieldTypeNames } from "@m-next/runtime-interface";
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import ComplexValue from '../../../../components/complex-value/ComplexValue';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import { selectBaseModel, selectControls } from '../../../../common/services/screenLayoutSlice';
import { createHtmlEditorControl, migrateHtmlEditorControl } from '../../control-classes/htmlEditorControl';
import ActionListSection from "../common/components/action-list-section/ActionListSection";
import CaptionInput from "../common/components/caption-input/CaptionInput";
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import MappedFieldSelector from "../common/components/mapped-field-selector/MappedFieldSelector";
import ValidationRulesList from "../common/components/validation-rules-list/ValidationRulesList";
import * as s from "../common/BlockEditor.styles";

const propTypes = {
  rawControl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddAction: PropTypes.func.isRequired,
};

const actions = [
  { value: `Change`, label: 'Change', source: 'onChange' },
  { value: `Focus`, label: 'On focus', source: 'onFocus' },
  { value: `Lose Focus`, label: 'Lose focus', source: 'onBlur' },
];

function HtmlEditorBlockEditor({ rawControl, onChange, onAddAction }) {
  const accountName = useSelector(selectAccountName);
  const screenBaseModel = useSelector(selectBaseModel);
  const [lastControlId, setLastControlId] = useState(null);
  const controlList = useSelector(selectControls);
  
  const control = useMemo(() => {
    const defaultControl = createHtmlEditorControl();
    if (lastControlId !== rawControl.id) {
      setLastControlId(rawControl.id);
    }

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateHtmlEditorControl(merged);
    return migrated ?? merged;
  }, [lastControlId, rawControl]);

  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: screenBaseModel, complexFields: false },
    { skip: !control || !screenBaseModel },
  );

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList, screenBaseModel, null, {}, null, null, true),
    [fieldList, screenBaseModel],
  );

  const handleLabelChange = (value, name) => {
    if(value){
      const updatedControl = { ...control };
      updatedControl.caption = value;
      if(!control.isBound && control.name !== value){
        updatedControl.name = name;
      }
      onChange(updatedControl);
    }
  };

  const handlePropertyChange = (property, value) => {
    const updatedControl = { ...control, [property]: value };
    onChange(updatedControl);
  }

  const handleAddAction = (property, eventName) => {
    // Create a new actionSetId if one doesn't exist
    const actionSetId = Guid.create();
    const updated = { ...control, [property]: actionSetId };

    onChange(updated);
    onAddAction(updated, eventName);
  };

  const events = useMemo(() => {
    const list = [];
    if (control.onChange) {
      list.push({ id: control.onChange, value: `Change`, label: 'Change' });
    }
    if (control.onFocus) {
      list.push({ id: control.onFocus, value: `Focus`, label: 'On focus' });
    }
    if (control.onBlur) {
      list.push({ id: control.onBlur, value: `Lose Focus`, label: 'Lose focus' });
    }
    return list;
  }, [control.onChange, control.onFocus, control.onBlur]);

  const filteredActions = useMemo(
    () => actions.filter((action) => !events.some((item) => item.value === action.value)),
    [events],
  );

  const handleShowLabelChange = (checked) => {
    onChange({ ...control, hideCaption: !checked });
  };

  return (
    <RumComponentContextProvider componentName='HtmlEditorBlockEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word'}} />
      <s.Wrapper padding={16} gutter={96}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextLine>Edit the configuration and styles of the html editor field.</TextLine>
          <MappedFieldSelector
            control={control}
            onChange={onChange}
            fieldTypes={[FieldTypeNames.Text]}
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
              id="label"
              controlId={control.id}
              label="Label"
              value={control.caption || ""}
              onChange={handleLabelChange}
              controlList={controlList}
              fieldList={fieldList}
            />
            <s.LineWrapper gap={8}>
              <SvgIcon name="arrow-elbow" size={12} color={colors.grey} />
              <Toggle
                id="show-label"
                checked={!control.hideCaption}
                onChange={handleShowLabelChange}
                label="Show label"
                width="100%"
                style={{ justifyContent: "flex-start" }}
                labelStyle={{ flexBasis: "100%" }}
              />
            </s.LineWrapper>
            <s.LineWrapper align='flex-start'>
              <Text style={{ lineHeight: '32px' }}>Default value</Text>
              <ComplexValue
                id='default-value'
                complexValue={control.defaultValue}
                fieldListOptions={fieldListOptions}
                fieldType={FieldTypeIds.Text}
                includeControls
                includeNone
                includeSessionVariables
                controlList={controlList}
                width={184}
                onChange={(e) => handlePropertyChange('defaultValue', e)}
                controlId={control.id}
              />
            </s.LineWrapper>
            <DefaultStateSelector onChange={onChange} control={control} />
          </Accordion>
          {!control.isLocked && <s.SettingDivider />}
          {!control.isLocked && (
            <ValidationRulesList
              standardOptions={[ValidationRuleTypes.Required, ValidationRuleTypes.MaxLength]}
              values={control.validationRules}
              onChange={(e) => handlePropertyChange('validationRules', e)}
            />
          )}
          <s.SettingDivider />

          <ActionListSection
            caption='Events'
            values={events}
            emptyMessage='No events applied'
            canAdd={filteredActions.length > 0}
            addLabel='Add'
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

HtmlEditorBlockEditor.propTypes = propTypes;
export default HtmlEditorBlockEditor;
