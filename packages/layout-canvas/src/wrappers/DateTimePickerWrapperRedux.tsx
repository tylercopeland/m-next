import React, { Suspense, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { format } from 'date-fns';
import { selectControls, RootState } from '../redux';
import { selectDisplayPreferences } from '../../../../apps/app-builder/src/common/services/sessionSlice';
import { complexValueTypes } from '@m-next/types';
import type { ActionHandler } from '../actions/types';
import type { DateTimePickerControl, DateTimePickerComplexValue } from '@m-next/runtime-interface';

const DatePicker = React.lazy(() => import('@m-next/datepicker'));

interface DateTimePickerWrapperProps {
  id: string;
  control?: DateTimePickerControl;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: Record<string, unknown>;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
}

function DateTimePickerWrapperRedux({
  id,
  control: controlProp,
  mode = 'designer',
  onControlClick,
  actionHandler,
  screenId,
  recordId,
  screenState,
  runtimeUpdateControlValue,
  runtimeUpdateControlProperty,
}: DateTimePickerWrapperProps) {
  const reduxContext = React.useContext(ReactReduxContext);

  // Use control from props if provided (runtime mode), otherwise fetch from Redux (designer mode)
  let controlList: Record<string, unknown> | null = null;

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

  // In runtime mode, also try to get displayPreferences if Redux context exists
  let displayPreferences: Record<string, string> | null = null;
  if (reduxContext) {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    displayPreferences = useSelector((state: any) => {
      try {
        return selectDisplayPreferences(state) ?? null;
      } catch {
        return null;
      }
    }) as Record<string, string> | null;
  }

  const control = (controlProp || (controlList?.[id] as DateTimePickerControl | undefined)) as
    | DateTimePickerControl
    | undefined;
  const controlData = control as Record<string, any> | undefined;

  const [selectedDate, setSelectedDate] = useState<Date | string | null>(null);
  const previousValueRef = useRef<Date | string | null>(null);
  const userClearedRef = useRef(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(controlData?.validationMessage || null);
  const [pickerKey, setPickerKey] = useState(0); // Key to force remount when cleared

  // Track wrapper dimensions for dynamic resizing
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pickerWidthPx, setPickerWidthPx] = useState(300);
  const useDynamicSizing = true; // Always use dynamic sizing in layout canvas

  const isRuntimeMode = mode === 'runtime';

  // Derive initial value from control
  const deriveInitialValue = useCallback((): Date | string | null => {
    if (!control) return null;

    // In runtime mode, prefer control.value over defaultValue
    if (isRuntimeMode && control.value !== undefined) {
      // If value is explicitly null and user cleared it, return null
      if (control.value === null && userClearedRef.current) {
        return null;
      }
      // If null but user didn't clear, fall through to default logic
      if (control.value !== null) {
        if (control.value instanceof Date) {
          return control.value;
        }
        if (typeof control.value === 'string') {
          return control.value === 'today' ? new Date() : new Date(control.value);
        }
      }
    }

    const defaultValue = control.defaultValue;
    if (typeof defaultValue === 'string') {
      if (defaultValue === 'none' || defaultValue === '') {
        return null;
      }
      return defaultValue === 'today' ? new Date() : new Date(defaultValue);
    } else {
      let complexValue: DateTimePickerComplexValue = defaultValue || {};
      let derivedValue = complexValue.Value || complexValue.value;
      let valueType = complexValue.ValueType ?? complexValue.valueType;

      // Follow control references to get the actual value
      while (valueType === complexValueTypes.Control) {
        const sisterControl = controlList?.[derivedValue as string] as DateTimePickerControl | undefined;
        complexValue = (sisterControl?.defaultValue as DateTimePickerComplexValue) || {};
        derivedValue = complexValue.Value || complexValue.value;
        valueType = complexValue.ValueType ?? complexValue.valueType;
      }

      // Handle "None" - empty string ValueType means None was selected
      if (valueType === '' || valueType === null || valueType === undefined) {
        return null;
      }

      // Handle "Current date" type
      if (valueType === complexValueTypes.CurrentDate) {
        return new Date();
      }

      if (derivedValue) {
        if (derivedValue === 'none') {
          return null;
        }
        return derivedValue === 'today' ? new Date() : new Date(derivedValue);
      } else {
        // No default value set - return null to show empty/placeholder
        return null;
      }
    }
  }, [control, controlList, isRuntimeMode]);

  // Initialize and sync date value
  useEffect(() => {
    const initialValue = deriveInitialValue();
    setSelectedDate(initialValue);
    previousValueRef.current = initialValue;
  }, [deriveInitialValue]);

  // Sync validation message from control data
  useEffect(() => {
    if (controlData?.validationMessage !== validationMessage) {
      setValidationMessage(controlData?.validationMessage || null);
    }
  }, [controlData?.validationMessage, validationMessage]);

  // Handle setFocusToControl action - focus date picker when hasFocus becomes true
  // Uses retry logic to handle timing issues when focus is triggered on page load
  // before the component's DOM element is fully mounted
  useEffect(() => {
    if (!isRuntimeMode || !controlData?.hasFocus) {
      return;
    }

    const controlId = control?.id || id;
    const inputId = `DTP-${controlId}`;

    let attempts = 0;
    const maxAttempts = 10;

    const tryFocus = () => {
      const datePickerInput = document.getElementById(inputId) || document.getElementById(controlId);
      if (datePickerInput) {
        datePickerInput.focus();
        // Only reset hasFocus after successful focus
        if (runtimeUpdateControlProperty) {
          runtimeUpdateControlProperty(id, 'hasFocus', false);
        }
        return;
      }

      // Retry if element not found and we haven't exceeded max attempts
      attempts += 1;
      if (attempts < maxAttempts) {
        requestAnimationFrame(tryFocus);
      } else if (runtimeUpdateControlProperty) {
        // Give up after max attempts - reset flag to prevent re-triggering
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    };

    // Start the focus attempt (defer to next frame to allow rendering)
    requestAnimationFrame(tryFocus);
  }, [controlData?.hasFocus, control?.id, id, isRuntimeMode, runtimeUpdateControlProperty]);

  // Use ResizeObserver to track wrapper dimension changes and calculate picker width
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (!currentWrapper) {
      return;
    }

    const updatePickerSize = () => {
      const wrapperWidth = currentWrapper.clientWidth;

      // Account for wrapper padding: 16px (8px left + 8px right)
      const horizontalReservedSpace = 16;

      const calculatedWidthPx = Math.max(100, wrapperWidth - horizontalReservedSpace);

      if (useDynamicSizing) {
        setPickerWidthPx(calculatedWidthPx);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updatePickerSize();
    });

    resizeObserver.observe(currentWrapper);

    // Initial calculation
    updatePickerSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [useDynamicSizing, id]);

  const pickerWidth = useMemo(() => {
    return useDynamicSizing ? `${pickerWidthPx}px` : '300px';
  }, [pickerWidthPx, useDynamicSizing]);

  // Transform display preferences to match runtime behavior
  const transformedDisplayPreferences = useMemo(() => {
    const transformed: Record<string, string> = {};
    if (!displayPreferences) return transformed;
    for (const [key, value] of Object.entries(displayPreferences)) {
      if (
        (key === 'timeFormat' ||
          key === 'hourFormat' ||
          key === 'dayFormat' ||
          key === 'monthFormat' ||
          key === 'yearFormat') &&
        value
      ) {
        transformed[key] = value.replace(/d/g, 'E').replace(/D/g, 'd').replace(/Y/g, 'y').replace(/A/g, 'a');
      } else {
        transformed[key] = value;
      }
    }
    return transformed;
  }, [displayPreferences]);

  const triggerAction = useCallback(
    async (eventName: 'onChange', data: { value?: unknown; oldValue?: unknown }) => {
      if (!isRuntimeMode || !actionHandler || !screenId) {
        return;
      }

      const actionId = control?.onChange;
      if (!actionId) {
        return;
      }

      try {
        await actionHandler.executeAction({
          componentId: id,
          actionName: eventName,
          actionData: data,
          screenId,
          recordId,
          screenState,
          metadata: {
            timestamp: Date.now(),
            componentType: control?.type || 'dateTimePicker',
          },
        });
      } catch (error) {
        // Action execution failed silently
      }
    },
    [isRuntimeMode, actionHandler, screenId, recordId, screenState, id, control],
  );

  const handleChange = useCallback(
    (date: Date | null) => {
      const previousValue = previousValueRef.current;
      setSelectedDate(date);

      // Track if user explicitly cleared the date and force remount to close calendar
      if (date === null) {
        userClearedRef.current = true;
        setPickerKey((k) => k + 1);
      }

      if (isRuntimeMode) {
        // Format date like legacy does: format(update, 'yyyy-MM-dd HH:mm:ss')
        const formattedValue = date === null ? null : format(date, 'yyyy-MM-dd HH:mm:ss');

        // Directly mutate control data to keep it in sync (like InputWrapper does)
        if (controlData) {
          controlData.value = formattedValue;
          controlData.Value = formattedValue;
          // Clear validation message when value changes
          controlData.validationMessage = null;
        }
        setValidationMessage(null);

        if (runtimeUpdateControlValue) {
          runtimeUpdateControlValue(id, formattedValue);
        }

        if (control?.onChange) {
          triggerAction('onChange', { value: formattedValue, oldValue: previousValue });
        }
      }

      previousValueRef.current = date;
    },
    [isRuntimeMode, runtimeUpdateControlValue, id, triggerAction, control?.onChange, controlData],
  );

  // Handle click in designer mode
  const handleDesignerClick = useCallback(() => {
    if (mode === 'designer' && onControlClick) {
      onControlClick(id);
    }
  }, [mode, onControlClick, id]);

  if (!control) {
    return (
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px',
          border: '1px dashed #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          color: '#666',
          textAlign: 'center',
          fontSize: '12px',
        }}
      >
        DateTimePicker Control (ID: {id}) - Control not found
      </div>
    );
  }

  // In designer mode, we need pointerEvents: none to allow drag handle to work
  // In runtime mode, we need pointerEvents: auto to allow clicking the date picker
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '8px',
    overflow: 'visible', // Changed from 'hidden' to allow dropdown to show
    pointerEvents: mode === 'designer' ? 'none' : 'auto',
  };

  return (
    <div
      ref={wrapperRef}
      style={wrapperStyle}
      className='dtp-wrapper'
      onClick={mode === 'designer' ? handleDesignerClick : undefined}
    >
      <Suspense fallback={<LoadingSkeleton count={1} height={40} />}>
        <div style={{ position: 'relative', width: pickerWidth }}>
          <DatePicker
            key={pickerKey}
            id={control.id}
            caption={control.hideCaption ? null : control.caption}
            value={selectedDate}
            onChange={handleChange}
            width={pickerWidth}
            legacyClass={control.classes}
            isV4Design
            disabled={control.disabled}
            placeholder={control.placeholder}
            useDateFormatPlaceholder={control.useDateFormatPlaceholder}
            formatType={control.formatType || 'Short Date'}
            compactStyle
            displayPreferences={transformedDisplayPreferences}
            required={
              controlData?.required ??
              controlData?.validationRules?.some((rule: { rule: number }) => rule.rule === 0) ??
              false
            }
            validationMessage={validationMessage ?? undefined}
          />
        </div>
      </Suspense>
    </div>
  );
}

export default DateTimePickerWrapperRedux;
