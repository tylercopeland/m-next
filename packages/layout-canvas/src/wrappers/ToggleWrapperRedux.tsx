import React, { Suspense, useState, useEffect, useMemo } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useSelector, ReactReduxContext } from 'react-redux';
import { Div } from '@m-next/typeography/src/Typeography.styles';
import { selectControls, RootState } from '../redux';
import { ToggleControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';
import type { ToggleProps } from '@m-next/toggle';

/**
 * Lazy-loaded Toggle. With default + named exports, TS infers dynamic import
 * default as the module type; we narrow it to the component type (no any).
 */
const Toggle = React.lazy(
  (): Promise<{ default: React.ComponentType<ToggleProps> }> =>
    import('@m-next/toggle').then((m) => ({
      default: m.default as unknown as React.ComponentType<ToggleProps>,
    })),
);

interface ToggleWrapperReduxProps {
  id: string;
  control?: ToggleControl; // Allow control to be passed directly (for runtime mode)
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

const ToggleDesignerWrapper: React.FC<ToggleWrapperReduxProps> = ({
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
  // Check if Redux context exists - MUST be called before useSelector
  const reduxContext = React.useContext(ReactReduxContext);
  const isRuntimeMode = !!controlProp || mode === 'runtime';

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

  const control = controlProp || ((controlList ? controlList[id] : null) as ToggleControl | null);

  /**
   * Parse a value that could be boolean, string, or other type into a boolean.
   * Handles string "false"/"no" correctly (they should return false, not true).
   * This fixes the issue where Boolean("false") returns true in JavaScript.
   */
  const parseBoolValue = (val: unknown): boolean => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      return lower === 'true' || lower === 'yes' || lower === '1';
    }
    if (typeof val === 'number') return val !== 0;
    return Boolean(val);
  };

  /**
   * Get the current value from the control.
   * In designer mode: defaultValue > value > checked (defaultValue takes priority)
   * In runtime mode: value > checked > defaultValue (value takes priority)
   * This handles both runtime (value) and designer (defaultValue) modes.
   *
   * CRITICAL: Use `!= null` (loose equality) instead of `!== undefined`
   * because new toggles have `value: null` from LayoutCanvasWrapper.
   * `null !== undefined` is TRUE, so it would return false instead of checking defaultValue.
   */
  const getControlValue = (): boolean => {
    // In designer mode, prioritize defaultValue since value might be the initial false
    // that was set when the toggle was first created
    if (!isRuntimeMode && control?.defaultValue != null) {
      return parseBoolValue(control.defaultValue);
    }

    // In runtime mode, the value property contains the current state
    // Use != null to check for both null AND undefined
    if (control?.value != null) {
      return parseBoolValue(control.value);
    }
    // Fall back to checked property
    if (control?.checked != null) {
      return parseBoolValue(control.checked);
    }
    // Finally fall back to defaultValue (for runtime mode if value/checked are null)
    if (control?.defaultValue != null) {
      return parseBoolValue(control.defaultValue);
    }
    return false;
  };

  const [toggled, setToggled] = useState<boolean>(getControlValue());

  // Sync local state when control changes (e.g. side panel property edits in designer, or value/action in runtime)
  useEffect(() => {
    setToggled(getControlValue());
  }, [id, control]);

  // Handle setFocusToControl action - focus toggle when hasFocus becomes true
  useEffect(() => {
    if (isRuntimeMode && (control as any)?.hasFocus) {
      // Toggle component uses `${id}-Toggle` for the input element in v4 design
      const controlId = control?.id || id;
      const toggleInput = document.getElementById(`${controlId}-Toggle`) || document.getElementById(controlId);
      if (toggleInput) {
        toggleInput.focus();
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
      ControlType: control?.type || 'TGL',
    };

    if (existingIndex >= 0) {
      objects[existingIndex] = { ...(objects[existingIndex] as Record<string, unknown>), ...controlState };
    } else {
      objects.push(controlState);
    }

    return { ...state, Objects: objects };
  };

  const handleClick = async (newValue?: boolean) => {
    const resolvedNewValue = newValue !== undefined ? newValue : !toggled;
    const previousValue = toggled;
    setToggled(resolvedNewValue);

    // Update control value in runtime state
    if (isRuntimeMode && runtimeUpdateControlValue) {
      runtimeUpdateControlValue(id, resolvedNewValue);
    }

    // Execute onChange action if in runtime mode and action is configured
    if (isRuntimeMode && actionHandler && screenId && control?.onChange) {
      try {
        // Create updated screenState with the new value BEFORE executing action
        // This prevents race conditions where the backend sees stale values
        const updatedScreenState = getUpdatedScreenState(resolvedNewValue);

        const result = await actionHandler.executeAction({
          componentId: id,
          actionName: 'onChange',
          screenId,
          recordId,
          actionData: {
            value: resolvedNewValue,
            oldValue: previousValue,
            event: {
              type: 'change',
            },
          },
          screenState: updatedScreenState,
          metadata: {
            timestamp: Date.now(),
            componentType: (control?.type as string) || 'toggle',
          },
        });

        if (!result.success && result.error) {
          console.error('[ToggleWrapper] Action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[ToggleWrapper] Error executing action:', error);
      }
    }
  };

  if (!control) {
    return null;
  }

  const alignRight = useMemo(
    () => (control.classes || '')?.toLowerCase().indexOf('mi-caption-float-right') >= 0,
    [control.classes],
  );

  // Hide label if hideCaption is true OR if width is 1 column
  const controlWidth = (control as any).width;
  const shouldHideLabel = control.hideCaption || controlWidth === 1;

  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      <Div style={{ height: 24, marginTop: 4, marginBottom: 4, width: 'fit-content', padding: 8 }}>
        <Toggle
          id={control.id}
          checked={toggled as boolean}
          onChange={!control.disabled ? (newValue: boolean) => handleClick(newValue) : undefined}
          label={shouldHideLabel ? null : control.caption}
          disabled={control.disabled}
          legacyClass={control.classes}
          alignRight={alignRight}
          isV4Design
          style={{ display: 'inline-flex', maxWidth: '100%' }}
          labelStyle={shouldHideLabel ? undefined : { float: alignRight ? 'right' : 'left' }}
          bold
        />
      </Div>
    </Suspense>
  );
};

export default ToggleDesignerWrapper;
