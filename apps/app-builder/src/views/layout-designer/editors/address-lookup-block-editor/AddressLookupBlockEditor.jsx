/**
 * AddressLookupBlockEditor
 * Block editor for Address Lookup control in AppBuilder.
 * - UI for Label, Show Label, Placeholder, Default State.
 * - Enforces business rules (required, max length, etc).
 * - No datasource, filters, sorting, or validation sections.
 *
 * @component
 * @param {object} props
 * @param {object} props.rawControl - The control model.
 * @param {function} props.onChange - Callback for control changes.
 * @returns {JSX.Element}
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { TextLine } from "@m-next/typeography";
import Toggle from "@m-next/toggle";
import { Guid } from '@m-next/utilities';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import * as s from "../common/BlockEditor.styles";
import ActionListSection from "../common/components/action-list-section/ActionListSection";
import EditorInput from "../common/components/editor-input/EditorInput";
import CaptionInput from "../common/components/caption-input/CaptionInput";

const propTypes = {
  rawControl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddAction: PropTypes.func.isRequired,
};

const actions = [
  { value: `Change`, label: 'Change', source: 'onChange' },
];

function AddressLookupBlockEditor({ rawControl, onChange, onAddAction }) {
  const handleLabelChange = (value, name) => {
    const updated = { ...rawControl, caption: value };
    if (name && !rawControl.isBound) {
      updated.name = name;
    }
    onChange(updated);
  };

  const handleAddAction = (property, eventName) => {
    // Create a new actionSetId if one doesn't exist
    const actionSetId = Guid.create();
    const updated = { ...rawControl, [property]: actionSetId };

    onChange(updated);
    onAddAction(updated, eventName);
  };

  const events = useMemo(() => {
    const list = [];
    if (rawControl.onChange) {
      list.push({ id: rawControl.onChange, value: `Change`, label: 'Change' });
    }
    return list;
  }, [rawControl.onChange]);

  const filteredActions = useMemo(
    () => actions.filter((action) => !events.some((item) => item.value === action.value)),
    [events],
  );

  const handleShowLabelChange = (checked) => {
    onChange({ ...rawControl, hideCaption: !checked });
  };

  const handlePlaceholderChange = (value) => {
    onChange({ ...rawControl, placeholder: value });
  };

  return (
    <RumComponentContextProvider componentName='AddressLookupBlockEditor'>
      <s.Wrapper padding={16} gutter={96}>
        <TextLine>Editing the base configuration and styles of the address lookup field.</TextLine>
      <CaptionInput
        id="label"
        controlId={rawControl.id}
        label="Label"
        value={rawControl.caption || ""}
        onChange={handleLabelChange}
      />
      <s.LineWrapper gap={8}>
        <SvgIcon name="arrow-elbow" size={12} color={colors.grey} />
        <Toggle
          id="show-label"
          checked={!rawControl.hideCaption}
          onChange={handleShowLabelChange}
          label="Show label"
          width="100%"
          style={{ justifyContent: "flex-start" }}
          labelStyle={{ flexBasis: "100%" }}
        />
      </s.LineWrapper>
      <EditorInput
        id="placeholder"
        controlId={rawControl.id}
        label="Placeholder"
        value={rawControl.placeholder || ""}
        onChange={handlePlaceholderChange}
        width="184px"
        resetOnBlank={false}
      />
      <DefaultStateSelector onChange={onChange} control={rawControl} />
     
      <s.SettingDivider />
      
      <ActionListSection
        caption='Events'
        values={events}
        emptyMessage='No events applied'
        canAdd={filteredActions.length > 0}
        addLabel='Add change'
        actions={filteredActions}
        onAddAction={handleAddAction}
        control={rawControl}
        valueKey='value'
        optionKey='value'
      />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
}

AddressLookupBlockEditor.propTypes = propTypes;
export default AddressLookupBlockEditor;
