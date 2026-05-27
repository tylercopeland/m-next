import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '@m-next/input';
import InputArea from '@m-next/input-area';
import { useInputTranslation, WIDGETS, createInputControl } from '@m-next/runtime-interface';
import type { InputWrapperProps } from './inputWrapper.types';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import type { RootState } from '../../../types/screenLayoutTypes';
// @ts-ignore
import AddressLookupDesignerWrapper from './addressLookupDesignerWrapper';

const InputWrapper: React.FC<InputWrapperProps> = ({ id }) => {
  const control = useSelector((state) => selectControls(state as RootState)?.[id]);

  // Initialize value with proper type handling
  // Fix Issue #3: Provide meaningful defaults when dragged from palette
  const getInitialValue = (): string | number | null => {
    if (control?.defaultValue) {
      if (typeof control.defaultValue === 'string' || typeof control.defaultValue === 'number') {
        return control.defaultValue;
      }
      
      // Handle object defaultValue - extract value property
      if (typeof control.defaultValue === 'object' && control.defaultValue !== null) {
        // Check if object has a 'value' property
        if ('value' in control.defaultValue && (typeof control.defaultValue.value === 'string' || typeof control.defaultValue.value === 'number')) {
          return control.defaultValue.value;
        }
      }
    }
    
    // Provide defaults when no value exists (palette drag scenario)
    return null;
  };
  
  const [value, setValue] = useState<string | number | null>(getInitialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const newValue = typeof e === 'string' ? e : e.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    // Handle blur event
  };

  const handleFocus = () => {
    // Handle focus event
  };

  // Create proper InputControl using the factory function - do this before early return
  // CRITICAL FIX: Check both lowercase and uppercase Type properties
  // Backend sends uppercase 'Type'/'TypeOverride', new controls have lowercase 'type'/'typeOverride'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlType = control?.type || (control as any)?.Type || 'input';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlTypeOverride = control?.typeOverride || (control as any)?.TypeOverride;

  const inputControl = control ? createInputControl({
    id: control.id,
    type: controlType,
    typeOverride: controlTypeOverride,
    hideCaption: control.hideCaption,
    caption: control.caption,
    classes: control.classes,
    name: control.name,
    widthType: control.widthType,
    width: control.width,
    height: control.height,
    visible: control.visible,
    disabled: control.disabled,
    isBound: control.isBound,
    defaultValue: control.defaultValue,
    // Input-specific properties - safely access unknown properties
    inputType: (control as unknown as Record<string, unknown>).inputType as string || 'text',
    rows: (control as unknown as Record<string, unknown>).rows as number,
    placeholder: (control as unknown as Record<string, unknown>).placeholder as string || '',
    validationRules: (control as unknown as Record<string, unknown>).validationRules as never[] || [],
  }) : createInputControl({ id: id || 'unknown' });

  const { widgetProps } = useInputTranslation(
    inputControl,
    value,
    handleChange,
    handleBlur,
    handleFocus,
  );

  if (!control) {
    return null;
  }

  // Check if this is an AddressLookup component - check both case variations
  const isAddressLookup = controlTypeOverride === WIDGETS.ADDRESSLOOKUP ||
                          controlType === WIDGETS.ADDRESSLOOKUP;

  if (isAddressLookup) {
    // Use the dedicated AddressLookup wrapper instead of generic input
    return <AddressLookupDesignerWrapper id={id} />;
  }

  // Determine if this should be a textarea - check both case variations
  const isTextArea = controlTypeOverride === WIDGETS.TEXTAREA ||
                    controlType === WIDGETS.TEXTAREA ||
                    (typeof (control as unknown as Record<string, unknown>).rows === 'number' &&
                     (control as unknown as Record<string, unknown>).rows as number > 1);

  if (isTextArea) {
    return <InputArea {...widgetProps} value={String(value || '')} />;
  }

  return <Input {...widgetProps} value={String(value || '')} />;
};

export default InputWrapper;
