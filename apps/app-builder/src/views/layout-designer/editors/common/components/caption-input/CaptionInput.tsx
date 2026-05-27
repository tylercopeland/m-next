import React from 'react';
import { useSelector } from 'react-redux';
import { BaseControl, Field } from '@m-next/runtime-interface';
import { calculateNameFromLabelChange } from '@m-next/layout-canvas';
import EditorInput from '../editor-input/EditorInput';
import { selectControls, selectScreenFields } from '../../../../../../common/services/screenLayoutSlice';
import { convertControlsToComponents } from '../../../../utils/controlsToComponentsConverter';

interface ControlsMap {
  [key: string]: BaseControl;
}

interface CaptionInputProps {
  id: string;
  value?: string;
  label?: string;
  controlId: string;
  onChange: (value: string, sanitizedName: string) => void;
  maxLength?: number;
}

const CaptionInput: React.FC<CaptionInputProps> = ({
  id,
  value,
  label = 'Title',
  onChange,
  controlId,
  maxLength = 30,
}) => {
  const controlList = useSelector(selectControls) as ControlsMap;
  const fieldList = useSelector(selectScreenFields) as Field[] | null | undefined;

  // Use a ref to capture the latest fieldList value for use in callbacks
  const fieldListRef = React.useRef<Field[] | null | undefined>(fieldList);

  // Update ref whenever fieldList changes
  React.useEffect(() => {
    fieldListRef.current = fieldList;
  }, [fieldList]);

  const handleChange = (newValue: string | number | object): void => {
    const stringValue = typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue);

    // Get current control to find its current name
    // Fallback chain is OK here for READING legacy data where name might not exist yet
    const currentControl = controlList[controlId];
    const currentName = currentControl?.name || currentControl?.caption || '';

    // Convert controls to ResponsiveComponent format for the naming utility (using shared function)
    const existingComponents = convertControlsToComponents(controlList);

    // Calculate new unique name considering both controls and database fields
    const proposedName = calculateNameFromLabelChange(
      stringValue,
      currentName,
      controlId,
      existingComponents,
      fieldListRef.current
    );

    onChange(String(newValue), proposedName);
  };

  return (
    <EditorInput
      id='caption'
      label={label}
      controlId={id}
      onChange={handleChange}
      value={value || ''}
      maxLength={maxLength}
    />
  );
};

export default CaptionInput;
