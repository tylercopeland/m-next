import React from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import ButtonGroup from '@m-next/button-group';
import { useButtonGroupTranslation } from '@m-next/runtime-interface';
import type { ButtonGroupControl, BaseControl } from '@m-next/runtime-interface';
import type { ButtonGroupWrapperProps } from './buttonGroupWrapper.types';
import { selectControls, RootState } from '../redux';
import { useRuntimeContext } from '../contexts/RuntimeContext';

const ButtonGroupWrapper: React.FC<ButtonGroupWrapperProps> = ({
  id,
  onControlClick,
  control: controlProp,
  mode = 'designer',
  actionHandler,
  screenId,
  recordId,
  screenState,
  runtimeUpdateControlProperty,
}) => {
  // Check if Redux context exists - MUST be called before useSelector
  const reduxContext = React.useContext(ReactReduxContext);
  const runtimeContext = useRuntimeContext();
  const isRuntimeMode = mode === 'runtime' || !!controlProp;

  // Use control from props if provided (runtime mode), otherwise fetch from Redux (designer mode)
  let controlList: Record<string, unknown> | null = null;

  if (reduxContext && !controlProp) {
    // Designer mode: Redux context is available and control not provided via props
    // eslint-disable-next-line react-hooks/rules-of-hooks
    controlList = useSelector((state) => {
      try {
        return selectControls(state as RootState);
      } catch {
        return null;
      }
    });
  } else if (controlProp && runtimeContext) {
    // Runtime mode: Get all controls from RuntimeContext to look up button controls by ID
    // Build controlList by getting each control individually
    const buttonIds = Array.isArray(controlProp.buttons) ? (controlProp.buttons as unknown[]) : [];
    controlList = {};
    buttonIds.forEach((btnId) => {
      const btnIdString = typeof btnId === 'string' ? btnId : String(btnId);
      const btnControl = runtimeContext.getControl(btnIdString);
      if (btnControl) {
        controlList![btnIdString] = btnControl;
      }
    });
  }

  let control = controlProp || ((controlList ? controlList[id] : null) as ButtonGroupControl | null);

  // In runtime mode, resolve button IDs to actual button objects
  if (controlProp && control && Array.isArray(control.buttons) && controlList) {
    const resolvedButtons = (control.buttons as unknown[])
      .map((btnId) => {
        const btnIdString = typeof btnId === 'string' ? btnId : String(btnId);
        return controlList![btnIdString];
      })
      .filter((btn) => btn != null) as BaseControl[];

    control = {
      ...control,
      buttons: resolvedButtons,
    };
  }

  // Call hook before any conditional returns
  const { widgetProps } = useButtonGroupTranslation(control || ({} as ButtonGroupControl), () => {});

  // Handle SetFocusToControl action - focus the first button in the group
  React.useEffect(() => {
    if (isRuntimeMode && (control as { hasFocus?: boolean })?.hasFocus === true) {
      // Find the first button in the group and focus it
      const buttonGroupContainer = document.querySelector(`[data-control-id="${id}"] button, #${id} button`);
      if (buttonGroupContainer) {
        (buttonGroupContainer as HTMLElement).focus();
      }
      // Reset hasFocus to prevent re-focusing on subsequent renders
      if (runtimeUpdateControlProperty && id) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [(control as { hasFocus?: boolean })?.hasFocus, id, isRuntimeMode, runtimeUpdateControlProperty]);

  if (!control) {
    return null;
  }

  const buttonData = Array.isArray(widgetProps.data) ? widgetProps.data : [];

  // Get the original button controls (before translation) to access onClick action IDs
  const originalButtons = control?.buttons || [];

  // Create a mapping from displayed button index to original button ID
  // This is necessary because hidden buttons are filtered out during translation,
  // so the displayed index doesn't match the original button index
  const buttonIdMapping: (string | undefined)[] = React.useMemo(() => {
    const visibleOriginalButtons = (originalButtons || []).filter(
      (btn) => (btn as { visible?: boolean }).visible !== false,
    );
    return visibleOriginalButtons.map((btn) => (btn as { id?: string }).id);
  }, [originalButtons]);

  // ButtonGroup component uses a single onClick handler at the component level
  // It passes (item, index) to this handler when any button is clicked
  const handleButtonClick = async (_item: { label?: string; value?: string; disabled?: boolean }, index: number) => {
    // Use the mapping to get the correct original button ID
    // This handles cases where hidden buttons shift the indices
    const mappedButtonId = buttonIdMapping[index];

    // Find the original button by ID, falling back to index if mapping fails
    const originalButton = mappedButtonId
      ? (originalButtons.find((b) => (b as { id?: string }).id === mappedButtonId) as
          | { id?: string; onClick?: string; caption?: string; type?: string; disabled?: boolean }
          | undefined)
      : (originalButtons[index] as
          | { id?: string; onClick?: string; caption?: string; type?: string; disabled?: boolean }
          | undefined);

    // Don't execute action if button is disabled (defensive check)
    if (_item.disabled || originalButton?.disabled) {
      return;
    }

    const buttonId = originalButton?.id;
    if (
      isRuntimeMode &&
      actionHandler &&
      screenId &&
      buttonId &&
      originalButton?.onClick &&
      originalButton.disabled !== true
    ) {
      // Runtime mode: execute the button's onClick action
      // componentId is the button's control ID - actionHandler will look up controls[componentId].onClick
      try {
        const result = await actionHandler.executeAction({
          componentId: buttonId,
          actionName: 'onClick',
          screenId,
          recordId,
          actionData: {
            event: {
              type: 'click',
            },
          },
          screenState: screenState as Record<string, unknown> | undefined,
          metadata: {
            timestamp: Date.now(),
            componentType: originalButton?.type || 'button',
          },
        });

        if (!result.success && result.error) {
          console.error('[ButtonGroupWrapper] Action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[ButtonGroupWrapper] Error executing action:', error);
      }
    } else {
      // Designer mode: just notify parent of click
      onControlClick(`${widgetProps.id || id}-${index}`);
    }
  };

  // Prepare button data with proper disabled state from original buttons
  // The translation may not preserve the disabled state set by runtime actions
  const dataWithValues = buttonData.map((btn, index) => {
    // Get the original button to check its disabled state
    const mappedButtonId = buttonIdMapping[index];
    const originalButton = mappedButtonId
      ? (originalButtons.find((b) => (b as { id?: string }).id === mappedButtonId) as
          | { disabled?: boolean }
          | undefined)
      : (originalButtons[index] as { disabled?: boolean } | undefined);

    return {
      ...btn,
      value: btn.label || '',
      // Merge disabled state from original button (runtime actions set this)
      disabled: btn.disabled || originalButton?.disabled || false,
    };
  });

  const buttonGroupProps = {
    ...widgetProps,
    data: dataWithValues,
    onClick: handleButtonClick, // Single onClick handler at component level
    showCaption: false,
    width: '100%',
    fillWidth: true,
    isV4Design: true, // Always use V4 design in layout-canvas for center alignment and text truncation
  };

  return (
    <div className='btn-group-wrapper' style={{ paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}>
      <ButtonGroup {...(buttonGroupProps as any)} />
    </div>
  );
};

export default ButtonGroupWrapper;
