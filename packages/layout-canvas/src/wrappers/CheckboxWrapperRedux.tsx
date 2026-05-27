import React, { Suspense, useState, useEffect } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Div } from '@m-next/typeography/src/Typeography.styles';
import type { CheckboxControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';
import Checkbox from '@m-next/checkbox';
import { useDesignerContext } from '../contexts/DesignerContext';

interface CheckboxDesignerWrapperProps {
  id: string;
  control?: CheckboxControl; // Allow control to be passed directly (for runtime mode)
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
  // Runtime action props
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: unknown;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
}

/**
 * Converts a value to boolean, properly handling string values like "No", "false", "0"
 * that the backend may send for YesNo fields.
 */
const toBoolean = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    // Explicit false values
    if (lower === 'no' || lower === 'false' || lower === '0' || lower === '') {
      return false;
    }
    // Explicit true values
    if (lower === 'yes' || lower === 'true' || lower === '1') {
      return true;
    }
    // Any other non-empty string is truthy
    return value.length > 0;
  }
  // For any other type, use standard boolean coercion
  return Boolean(value);
};

const CheckboxDesignerWrapper: React.FC<CheckboxDesignerWrapperProps> = ({
  id,
  control: controlProp,
  mode,
  actionHandler,
  screenId,
  recordId,
  screenState,
  runtimeUpdateControlValue,
  runtimeUpdateControlProperty,
}) => {
  const designerContext = useDesignerContext();

  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control = isRuntimeMode ? controlProp : designerContext?.selectControlById(id);
  /**
   * Get the current value from the control.
   * In designer mode: defaultValue > value > checked (defaultValue takes priority)
   * In runtime mode: value > checked > defaultValue (value takes priority)
   * This handles both runtime (value) and designer (defaultValue) modes.
   */
  const getControlValue = (): boolean => {
    // In designer mode, prioritize defaultValue since value might be the initial false
    // that was set when the checkbox was first created
    if (!isRuntimeMode && control?.defaultValue != null) {
      return toBoolean(control.defaultValue);
    }

    // In runtime mode, the value property contains the current state
    // Use != null to check for both null AND undefined
    if (control?.value !== null && control?.value !== undefined) {
      return toBoolean(control.value);
    }
    // Fall back to checked property
    if (control?.checked !== null && control?.checked !== undefined) {
      return toBoolean(control.checked);
    }
    // Finally fall back to defaultValue (for runtime mode if value/checked are null)
    // Handle legacy bug where defaultValue was incorrectly set to control type name ("Checkbox")
    // Treat non-boolean defaultValue as false to fix screens saved before the bug fix
    const defaultVal = control?.defaultValue;
    if (typeof defaultVal === 'boolean') {
      return defaultVal;
    }
    // String "true"/"yes" should be true, anything else (including "Checkbox") should be false
    if (typeof defaultVal === 'string') {
      return defaultVal.toLowerCase() === 'true' || defaultVal.toLowerCase() === 'yes';
    }
    return false;
  };

  const [checked, setChecked] = useState<boolean>(getControlValue());

  // Sync local state when control value changes from parent (e.g., after action execution)
  useEffect(() => {
    setChecked(getControlValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control?.value, control?.checked, control?.defaultValue]);

  // Handle setFocusToControl action - focus checkbox when hasFocus becomes true
  useEffect(() => {
    if (isRuntimeMode && (control as any)?.hasFocus) {
      // Focus the checkbox element
      const element = document.getElementById(control?.id || id);
      if (element) {
        element.focus();
      }
      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [(control as any)?.hasFocus, control?.id, id, isRuntimeMode, runtimeUpdateControlProperty]);

  /**
   * Creates an updated screenState with the new control value.
   * This ensures the backend receives the current value when executing actions,
   * preventing race conditions where ShowMessage displays stale values.
   */
  const getUpdatedScreenState = (newValue: boolean): Record<string, unknown> | undefined => {
    if (!screenState || typeof screenState !== 'object') {
      return screenState as Record<string, unknown> | undefined;
    }

    const state = screenState as Record<string, unknown>;
    const objects = Array.isArray(state.Objects) ? [...state.Objects] : [];

    // Find existing control state or create new entry
    const existingIndex = objects.findIndex((obj: unknown) => (obj as Record<string, unknown>)?.Id === id);

    const controlState = {
      Id: id,
      Value: newValue,
      Visible: control?.visible ?? true,
      Disabled: control?.disabled ?? false,
      ControlType: control?.type || 'CHK',
    };

    if (existingIndex >= 0) {
      objects[existingIndex] = { ...(objects[existingIndex] as Record<string, unknown>), ...controlState };
    } else {
      objects.push(controlState);
    }

    return { ...state, Objects: objects };
  };

  const handleClick = async () => {
    const previousValue = checked;
    const newValue = !checked;
    setChecked(newValue);

    if (!isRuntimeMode) {
      return;
    }

    // Update control value in runtime state
    if (runtimeUpdateControlValue) {
      runtimeUpdateControlValue(id, newValue);
    }

    // Execute onChange action if in runtime mode and action is configured
    if (actionHandler && screenId && control?.onChange) {
      try {
        // Create updated screenState with the new value BEFORE executing action
        // This prevents race conditions where the backend sees stale values
        const updatedScreenState = getUpdatedScreenState(newValue);

        const result = await actionHandler.executeAction({
          componentId: id,
          actionName: 'onChange',
          screenId,
          recordId,
          actionData: {
            value: newValue,
            oldValue: previousValue,
            event: {
              type: 'change',
            },
          },
          screenState: updatedScreenState,
          metadata: {
            timestamp: Date.now(),
            componentType: (control?.type as string) || 'checkbox',
          },
        });

        if (!result.success && result.error) {
          console.error('[CheckboxWrapper] Action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[CheckboxWrapper] Error executing action:', error);
      }
    }
  };

  if (!control) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      {/* onClick on Div handles clicks on padding area, onChange handles clicks on checkbox/label, onKeyDown handles Enter key */}
      <Div style={{ height: '100%', paddingTop: 14, paddingBottom: 14, paddingLeft: 8, paddingRight: 8 }}>
        <Checkbox
          id={control.id}
          align={
            ((control as CheckboxControl).align?.toString().toLowerCase() as 'left' | 'right' | 'center') || 'left'
          }
          checked={checked}
          hideCaption={control.hideCaption}
          label={control.caption}
          disabled={control.disabled}
          legacyClasses={control.classes}
          style={{ height: 20, position: 'relative' }}
          narrow
          onChange={!control.disabled ? handleClick : undefined}
          onKeyDown={
            !control.disabled
              ? (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event from bubbling up and causing focus loss
                    handleClick();
                  }
                }
              : undefined
          }
        />
      </Div>
    </Suspense>
  );
};

export default CheckboxDesignerWrapper;
