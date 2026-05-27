import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import Input from '@m-next/input';
import InputArea from '@m-next/input-area';
import { useInputTranslation, WIDGETS, createInputControl } from '@m-next/runtime-interface';
import type { InputWrapperProps } from './inputWrapper.types';
import { selectControls, RootState } from '../redux';
import { useRuntimeContext } from '../contexts/RuntimeContext';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AddressLookupDesignerWrapper from './addressLookupWrapper';

const InputWrapper: React.FC<InputWrapperProps> = ({
  id,
  control: controlProp,
  mode = 'designer',
  actionHandler,
  screenId,
  recordId,
  screenState,
  runtimeUpdateControlValue = null,
  runtimeUpdateControlProperty = null,
}) => {
  // Check if Redux context exists - MUST be called before useSelector
  const reduxContext = React.useContext(ReactReduxContext);

  // Use control from props if provided (runtime mode), otherwise fetch from Redux (designer mode)
  let controlList = null;

  if (reduxContext && !controlProp) {
    // Redux context is available and control not provided via props - safe to use useSelector
    // eslint-disable-next-line react-hooks/rules-of-hooks
    controlList = useSelector((state) => {
      try {
        return selectControls(state as RootState);
      } catch {
        return null;
      }
    });
  }

  const control = controlProp || (controlList?.[id] as Record<string, unknown> | undefined);
  const controlData = control as Record<string, any> | undefined;
  const controlId = (controlData?.id as string) || id;
  const controlType = (controlData?.type as string) || (controlData?.Type as string) || 'input';
  const controlTypeOverride = (controlData?.typeOverride as string) || (controlData?.TypeOverride as string);
  const isRuntimeMode = mode === 'runtime';
  const runtimeActionHandler = isRuntimeMode ? (actionHandler ?? null) : null;

  const deriveInitialValue = useCallback((): string | number | null => {
    if (!controlData) {
      return null;
    }

    const extractValue = (val: any): string | number | null => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'string' || typeof val === 'number') return val;

      if (typeof val === 'object') {
        const valueType = val.ValueType ?? val.valueType;
        const extractedValue = val.value ?? val.Value;

        // ValueType 5 = control reference - resolve from screenState
        if (valueType === 5 && typeof extractedValue === 'string' && screenState) {
          const referencedControl = (screenState[extractedValue] ??
            (screenState.controls as Record<string, unknown> | undefined)?.[extractedValue]) as
            | Record<string, unknown>
            | undefined;

          if (referencedControl) {
            const refValue = referencedControl.value ?? referencedControl.Value;

            if (refValue && typeof refValue === 'object') {
              const refValueObj = refValue as Record<string, unknown>;
              const resolvedValue = refValueObj.value ?? refValueObj.Value;
              if (typeof resolvedValue === 'string' || typeof resolvedValue === 'number') {
                return resolvedValue;
              }
            } else if (typeof refValue === 'string' || typeof refValue === 'number') {
              return refValue;
            }
          }

          // Control reference but couldn't resolve - return null, not the ID
          return null;
        }

        if (typeof extractedValue === 'string' || typeof extractedValue === 'number') {
          return extractedValue;
        }
      }
      return null;
    };

    // Use actual value first if available
    if (controlData.value !== null && controlData.value !== undefined) {
      const extracted = extractValue(controlData.value);
      if (extracted !== null) return extracted;
    }

    // Fall back to defaultValue (check both lowercase and uppercase)
    const defaultVal = controlData.defaultValue ?? controlData.DefaultValue;
    if (defaultVal !== null && defaultVal !== undefined) {
      const extracted = extractValue(defaultVal);
      if (extracted !== null) return extracted;
    }

    return null;
  }, [controlData, screenState, isRuntimeMode, controlId]);

  const initialValue = useMemo(() => deriveInitialValue(), [deriveInitialValue]);
  const [value, setValue] = useState<string | number | null>(initialValue);
  const [validationError, setValidationError] = useState<string | null>(controlData?.validationMessage || null);
  const previousValueRef = useRef<string | number | null>(initialValue);
  const focusTriggeredRef = useRef<boolean>(false);
  // Ref that can hold either HTML element (Input) or imperative handle (InputArea)
  const inputRef = useRef<HTMLInputElement | { focus: () => void } | null>(null);

  // Get runtime context for updating control properties (clearing hasFocus)
  const runtimeContext = useRuntimeContext();

  useEffect(() => {
    setValue(initialValue);
    previousValueRef.current = initialValue;
  }, [initialValue]);

  // Handle programmatic focus from screen load action (hasFocus property)
  useEffect(() => {
    if (isRuntimeMode && controlData?.hasFocus && inputRef.current) {
      // Focus the input element (works for both HTMLInputElement and imperative handle)
      if (typeof inputRef.current.focus === 'function') {
        inputRef.current.focus();
      }
      // Clear the hasFocus flag to prevent re-triggering
      if (runtimeContext?.updateControlProperty) {
        runtimeContext.updateControlProperty(controlId, 'hasFocus', false);
      }
    }
  }, [isRuntimeMode, controlData?.hasFocus, controlId, runtimeContext]);

  // Handle setFocusToControl action - focus input when hasFocus becomes true
  useEffect(() => {
    if (isRuntimeMode && controlData?.hasFocus) {
      // Input component uses `${id}-Input` for the actual input element
      const inputElement = document.getElementById(`${controlId}-Input`) || document.getElementById(controlId);
      if (inputElement) {
        inputElement.focus();
      }
      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [controlData?.hasFocus, controlId, id, isRuntimeMode, runtimeUpdateControlProperty]);

  // Sync validation error from control data (read from validationMessage property)
  useEffect(() => {
    if (controlData?.validationMessage !== validationError) {
      setValidationError(controlData?.validationMessage || null);
    }
  }, [controlData?.validationMessage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | string) => {
    const newValue = typeof e === 'string' ? e : e.target.value;
    setValue(newValue);
  }, []);

  const triggerAction = useCallback(
    (eventName: 'onChange' | 'onBlur' | 'onFocus', data: { value?: unknown; oldValue?: unknown }) => {
      if (!isRuntimeMode || !runtimeActionHandler || !screenId) {
        return;
      }

      void runtimeActionHandler
        .executeAction({
          componentId: controlId,
          actionName: eventName,
          actionData: data,
          screenId,
          recordId: recordId ?? undefined,
          screenState,
          metadata: {
            componentType: controlType,
            timestamp: Date.now(),
          },
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(`[InputWrapper:${controlId}] Failed to execute ${eventName}`, error);
        });
    },
    [isRuntimeMode, runtimeActionHandler, screenId, recordId, screenState, controlId, controlType],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      focusTriggeredRef.current = false;
      let newValue = e.target.value;

      // Apply decimal rounding for number inputs with formatRounding configured
      const inputType = controlData?.inputType as string;
      const formatRounding = controlData?.formatRounding ?? (inputType === 'number' ? 2 : undefined);
      if (inputType === 'number' && formatRounding !== undefined && formatRounding !== null && newValue !== '') {
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          const decimalPlaces = typeof formatRounding === 'string' ? parseInt(formatRounding, 10) : formatRounding;
          if (!isNaN(decimalPlaces) && decimalPlaces >= 0) {
            newValue = numValue.toFixed(decimalPlaces);
          }
        }
      }

      setValue(newValue);

      const previousValue = previousValueRef.current;
      if (newValue !== previousValue) {
        if (controlData) {
          controlData.value = newValue;
          controlData.Value = newValue;
          // Only clear backend validation error, not client-side one
          controlData.validationError = null;
          controlData.validationMessage = null;
        }

        if (runtimeUpdateControlValue) {
          runtimeUpdateControlValue(controlId, newValue);
        }
        triggerAction('onChange', { value: newValue, oldValue: previousValue });
      }

      triggerAction('onBlur', { value: newValue, oldValue: previousValue });
      previousValueRef.current = newValue;
    },
    [triggerAction, controlData, runtimeUpdateControlValue, controlId],
  );

  const handleFocus = useCallback(() => {
    if (focusTriggeredRef.current) {
      return;
    }

    focusTriggeredRef.current = true;
    triggerAction('onFocus', { value });
  }, [triggerAction, value]);

  // Create proper InputControl using the factory function - do this before early return
  // CRITICAL FIX: Check both lowercase and uppercase Type properties
  // Backend sends uppercase 'Type'/'TypeOverride', new controls have lowercase 'type'/'typeOverride'
  const inputControl = controlData
    ? createInputControl({
        id: controlData.id as string,
        type: controlType as string,
        typeOverride: controlTypeOverride as string | undefined,
        hideCaption: controlData.hideCaption as boolean,
        caption: controlData.caption as string,
        classes: controlData.classes as string,
        name: controlData.name as string,
        widthType: controlData.widthType as any,
        width: controlData.width as string | number,
        height: controlData.height as string | number,
        visible: controlData.visible as boolean,
        disabled: controlData.disabled as boolean,
        isBound: controlData.isBound as boolean,
        defaultValue: controlData.defaultValue as any,
        inputType: (controlData.inputType as string) || 'text',
        rows: controlData.rows as number | undefined,
        placeholder: (controlData.placeholder as string) || '',
        validationRules: (controlData.validationRules as any[]) || [],
      })
    : createInputControl({ id: id || 'unknown' });

  // Apply validation error from state (clears when value changes)
  if (inputControl && validationError) {
    (inputControl as any).validationError = validationError;
  }

  const { widgetProps } = useInputTranslation(inputControl, value, handleChange, handleBlur, handleFocus);

  if (!controlData) {
    return null;
  }

  // Check if this is an AddressLookup component - check both case variations
  const isAddressLookup = controlTypeOverride === WIDGETS.ADDRESSLOOKUP || controlType === WIDGETS.ADDRESSLOOKUP;

  if (isAddressLookup) {
    // Use the dedicated AddressLookup wrapper instead of generic input
    return (
      <AddressLookupDesignerWrapper
        id={id}
        control={{
          ...controlData,
          id: controlId,
          type: controlType,
        }}
        mode={mode}
        runtimeUpdateControlValue={runtimeUpdateControlValue}
        screenState={screenState}
        actionHandler={runtimeActionHandler}
        screenId={screenId}
        recordId={recordId}
      />
    );
  }

  // Determine if this should be a textarea - check both case variations
  const isTextArea =
    controlTypeOverride === WIDGETS.TEXTAREA ||
    controlType === WIDGETS.TEXTAREA ||
    (typeof controlData?.rows === 'number' && controlData.rows > 1);

  const resolvedValue = value ?? '';

  if (isTextArea) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
          paddingBottom: 16,
          boxSizing: 'border-box',
          overflow: 'hidden', // 🔧 FIX: Prevent content from extending beyond wrapper
          // 🔧 FIX: In designer mode, disable pointer events so drag handle works
          pointerEvents: mode === 'designer' ? 'none' : 'auto',
        }}
      >
        <InputArea
          {...widgetProps}
          validationMessage={widgetProps.validationMessage ?? undefined}
          isV4Design={true}
          compactStyle={true}
          disableResize={true} // 🎯 USER REQUEST: Disable HTML corner resizing via prop
          value={String(resolvedValue)}
          forwardRef={inputRef}
          style={{
            ...widgetProps.style,
            resize: 'none', // 🎯 USER REQUEST: Additional CSS disable resizing
            width: '100%',
            height: '100%', // 🔧 FIX: Fill available space exactly
            minHeight: 0, // 🔧 FIX: Allow flex shrinking
            boxSizing: 'border-box',
            paddingBottom: 8,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <Input {...widgetProps} isV4Design={true} value={String(resolvedValue)} forwardRef={inputRef} />
    </div>
  );
};

export default InputWrapper;
