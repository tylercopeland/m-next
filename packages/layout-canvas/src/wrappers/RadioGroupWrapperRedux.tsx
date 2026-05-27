import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { selectControls, RootState } from '../redux';
import { controlUpdated } from '../../../../apps/app-builder/src/common/services/screenLayoutSlice';
import { RadioGroupContainer } from './RadioGroupWrapperRedux.styles';
import type { ActionHandler } from '../actions/types';
import RadioGroup from '@m-next/radio-button';

// Sizing constants for auto-collapse calculation
// Each radio option: 16px indicator/text + internal padding = ~24px rendered height
const RADIO_OPTION_HEIGHT_PX = 24;
// Gap between vertical options (gap prop default in RadioGroup.jsx)
const RADIO_VERTICAL_GAP_PX = 16;
// Caption: 14px font + 10px margin-bottom + padding = ~28px
const CAPTION_HEIGHT_PX = 28;
const ROW_HEIGHT_PX = 16; // Actual rowHeight used in LayoutCanvasWrapper
// Container padding (8px top + 8px bottom from RadioGroupContainer styles)
const CONTAINER_PADDING_PX = 16;
// Column width in pixels (from LayoutCanvasWrapper)
const COLUMN_WIDTH_PX = 75;

function calculateVerticalHeightRows(control: Record<string, unknown>): number {
  const radiobuttons = control?.radiobuttons as (string | number)[] | undefined;
  const optionCount = radiobuttons?.length || 0;
  if (optionCount === 0) return 1;

  const captionHeightPx = !control?.hideCaption && control?.caption ? CAPTION_HEIGHT_PX : 0;
  // Each option: height + gap, but last option has no gap
  const optionsHeightPx = optionCount * RADIO_OPTION_HEIGHT_PX + (optionCount - 1) * RADIO_VERTICAL_GAP_PX;
  const totalHeightPx = optionsHeightPx + captionHeightPx;
  return Math.max(1, Math.ceil(totalHeightPx / ROW_HEIGHT_PX));
}

interface RadioGroupWrapperProps {
  id: string;
  onControlClick?: (controlId: string) => void;
  control?: Record<string, unknown>;
  mode?: 'runtime' | 'designer';
  // Runtime action props
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: unknown;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
}

const RadioGroupWrapper: React.FC<RadioGroupWrapperProps> = ({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track the last position we dispatched to prevent loops
  const lastDispatchedPosition = useRef<string | null>(null);

  // Check if Redux context exists
  const reduxContext = React.useContext(ReactReduxContext);
  const isRuntimeMode = !!controlProp || mode === 'runtime';

  // Get dispatch from context (only available in designer mode)
  const dispatch = reduxContext?.store?.dispatch;

  // Only use Redux selectors in designer mode
  let controlList: Record<string, unknown> | null = null;

  if (reduxContext && !isRuntimeMode) {
    // Designer mode - fetch from Redux
    // eslint-disable-next-line react-hooks/rules-of-hooks
    controlList = useSelector((state) => selectControls(state as RootState));
  }

  const control = (controlProp || (controlList && id ? controlList[id] : null)) as Record<string, unknown> | undefined;

  // Determine initial value: prefer control.value (from dataReducer), then defaultValue, then first option
  const getInitialValue = () => {
    // If control.value is set (e.g., from updatecontrolsonscreen action), use it
    if (control?.value !== undefined && control?.value !== null && control?.value !== '') {
      return control.value;
    }
    // Otherwise, use defaultValue if it's a valid option
    if (((control?.radiobuttons as any[]) || []).includes(control?.defaultValue)) {
      return control?.defaultValue;
    }
    // Fall back to first option
    return (control?.radiobuttons as any[])?.[0];
  };

  const [selectedValue, setSelectedValue] = useState(getInitialValue);

  // Update selectedValue when control.value changes (e.g., from updatecontrolsonscreen action)
  useEffect(() => {
    if (control?.value !== undefined && control?.value !== null && control?.value !== '') {
      setSelectedValue(control.value);
    }
  }, [control?.value]);

  // Also handle defaultValue and radiobuttons changes for initial load
  useEffect(() => {
    // Only apply default if no explicit value is set
    if (control?.value === undefined || control?.value === null || control?.value === '') {
      const defaultOption = ((control?.radiobuttons as any[]) || []).includes(control?.defaultValue)
        ? control?.defaultValue
        : (control?.radiobuttons as any[])?.[0];
      setSelectedValue(defaultOption);
    }
  }, [control?.defaultValue, control?.radiobuttons, control?.value]);

  // Handle setFocusToControl action - focus radio group when hasFocus becomes true
  useEffect(() => {
    if (isRuntimeMode && (control as any)?.hasFocus) {
      // RadioGroup component uses `${id}-RadioGroup` as container ID
      const controlId = (control as any)?.id || id;
      const radioGroupElement = document.getElementById(`${controlId}-RadioGroup`);
      const firstRadio = radioGroupElement?.querySelector('input[type="radio"]') as HTMLElement;

      if (firstRadio) {
        firstRadio.focus();
      } else if (radioGroupElement) {
        radioGroupElement.focus();
      }

      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [(control as any)?.hasFocus, id, isRuntimeMode, runtimeUpdateControlProperty]);

  // Reset lastDispatchedPosition when user changes position via editor
  // This allows auto-collapse to work again after user switches back to horizontal
  useEffect(() => {
    const currentPosition = ((control?.position as string) || 'vertical').toLowerCase();
    // If the control is now horizontal and we previously dispatched vertical,
    // reset so we can auto-collapse again if needed
    if (currentPosition === 'horizontal' && lastDispatchedPosition.current === 'vertical') {
      lastDispatchedPosition.current = null;
    }
  }, [control?.position]);

  // Auto-collapse horizontal → vertical when container is too narrow
  useEffect(() => {
    if (!containerRef.current || !control || isRuntimeMode || !dispatch) return;

    const checkAndUpdateDirection = () => {
      if (!containerRef.current || !control) return;

      // Skip if dimensions are locked (editor just changed them, waiting for canvas to resize)
      const dimensionsLocked =
        (control.__dimensionsLockedUntil as number) && (control.__dimensionsLockedUntil as number) > Date.now();
      if (dimensionsLocked) {
        return;
      }

      const containerWidth = containerRef.current.clientWidth;
      const currentPosition = ((control.position as string) || 'vertical').toLowerCase();

      // Only check for collapse when in horizontal mode
      if (currentPosition !== 'horizontal') return;

      // Query the actual RadioGroupInnerWrapper - this is the flex container with the options
      // Use :last-of-type because Caption (when visible) is also a div child before RadioGroupInnerWrapper
      const radioGroupInner = containerRef.current.querySelector('div[role="radiogroup"] > div:last-of-type');
      if (!radioGroupInner) return;

      // Get the actual rendered width of the flex content
      const actualContentWidth = radioGroupInner.scrollWidth;
      // Available width is container minus padding (8px on each side)
      const availableWidth = containerWidth - CONTAINER_PADDING_PX;

      // Auto-switch horizontal → vertical when content overflows available space
      if (actualContentWidth > availableWidth) {
        if (lastDispatchedPosition.current !== 'vertical') {
          lastDispatchedPosition.current = 'vertical';

          const heightRows = calculateVerticalHeightRows(control);

          const updatedControl = {
            ...control,
            id,
            position: 'vertical',
            layout: 'vertical',
            height: heightRows,
            __dimensionsLockedUntil: Date.now() + 1700,
          };

          dispatch(controlUpdated(updatedControl));
        }
      } else {
        // Content fits - check if we can shrink the width to fit content
        // Required width = actual content width + padding (8px each side)
        const requiredWidthPx = actualContentWidth + CONTAINER_PADDING_PX;
        const requiredColumns = Math.max(1, Math.ceil(requiredWidthPx / COLUMN_WIDTH_PX));
        const currentColumns = (control.width as number) || 4;

        // Only shrink if we have more columns than needed
        if (currentColumns > requiredColumns) {
          const updatedControl = {
            ...control,
            id,
            width: requiredColumns,
            __dimensionsLockedUntil: Date.now() + 1700,
          };

          dispatch(controlUpdated(updatedControl));
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize checks
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(checkAndUpdateDirection, 100);
    });

    resizeObserver.observe(containerRef.current);
    // Initial check
    checkAndUpdateDirection();

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [control, dispatch, id, isRuntimeMode]);

  if (!control) {
    return null;
  }

  /**
   * Creates an updated screenState with the new control value.
   * This ensures the backend receives the current value when executing actions,
   * preventing race conditions where ShowMessage displays stale values.
   */
  const getUpdatedScreenState = (newValue: string | number): Record<string, unknown> | undefined => {
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
      ControlType: control?.type || 'RAD',
    };

    if (existingIndex >= 0) {
      objects[existingIndex] = { ...(objects[existingIndex] as Record<string, unknown>), ...controlState };
    } else {
      objects.push(controlState);
    }

    return { ...state, Objects: objects };
  };

  const handleChange = async (_e: React.ChangeEvent<HTMLInputElement>, value: string | number) => {
    const previousValue = selectedValue;
    setSelectedValue(value);

    // Update control value in Redux for runtime mode
    if (isRuntimeMode && runtimeUpdateControlValue) {
      runtimeUpdateControlValue(id, value);
    }

    // Execute onChange action if in runtime mode and action is configured
    if (isRuntimeMode && actionHandler && screenId && control?.onChange) {
      try {
        // Create updated screenState with the new value BEFORE executing action
        // This prevents race conditions where the backend sees stale values
        const updatedScreenState = getUpdatedScreenState(value);

        const result = await actionHandler.executeAction({
          componentId: id,
          actionName: 'onChange',
          screenId,
          recordId,
          actionData: {
            value,
            oldValue: previousValue,
            event: {
              type: 'change',
            },
          },
          screenState: updatedScreenState,
          metadata: {
            timestamp: Date.now(),
            componentType: (control?.type as string) || 'radioButton',
          },
        });

        if (!result.success && result.error) {
          console.error('[RadioGroupWrapper] Action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[RadioGroupWrapper] Error executing action:', error);
      }
    }
  };

  const isHorizontal = ((control.position as string) || '').toLowerCase() === 'horizontal';

  return (
    <RadioGroupContainer ref={containerRef} data-orientation={isHorizontal ? 'horizontal' : 'vertical'}>
      <Suspense fallback={<LoadingSkeleton count={1} height={40} />}>
        <RadioGroup
          id={control.id as string}
          name={control.id as string}
          selectedValue={selectedValue as string | number}
          options={((control.radiobuttons as any[]) || [])?.map((item: string) => ({ label: item, value: item })) ?? []}
          caption={control.caption as string}
          hideCaption={control.hideCaption as boolean}
          disabled={control.disabled as boolean}
          direction={isHorizontal ? 'row' : 'column'}
          widthType={control.widthType as string}
          width={control.rowItemWidth as string}
          onChange={handleChange}
          allowWrap={isRuntimeMode}
        />
      </Suspense>
    </RadioGroupContainer>
  );
};

export default RadioGroupWrapper;
