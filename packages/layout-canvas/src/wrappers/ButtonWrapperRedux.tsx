import React, { useEffect } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import Button from '@m-next/button';
import { useButtonTranslation } from '@m-next/runtime-interface';
import type { ButtonControl, BackendControlStyles } from '@m-next/runtime-interface/src/types';
import type { ActionHandler } from '../actions/types';
// Import from local Redux utilities to avoid circular dependency
import { selectControls, RootState } from '../redux';

interface ButtonWrapperProps {
  id: string;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: unknown;
  control?: ButtonControl; // Allow control to be passed directly (for runtime mode)
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
  processAnalytics?: (eventName: string, attributes: Record<string, any>) => void;
  isStockScreen?: boolean;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  id,
  mode = 'designer',
  onControlClick,
  isSelected = false,
  actionHandler,
  screenId,
  recordId,
  screenState,
  control: controlProp,
  runtimeUpdateControlProperty,
  processAnalytics,
  isStockScreen,
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

  const control = controlProp || ((controlList ? controlList[id] : null) as ButtonControl | null);

  const handleControlClick = async () => {
    if (mode === 'designer') {
      // Designer mode: just notify parent of click
      if (onControlClick) {
        onControlClick(id);
      }
    } else if (mode === 'runtime') {
      // Runtime mode: execute action if handler and screenId are provided
      if (actionHandler && screenId && control?.onClick) {
        try {
          const result = await actionHandler.executeAction({
            componentId: id,
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
              componentType: control?.type || 'button',
            },
          });

          if (!result.success && result.error) {
            console.error('[ButtonWrapper] Action execution failed:', result.error);
          }
        } catch (error) {
          console.error('[ButtonWrapper] Error executing action:', error);
        }
        if (control?.onClick && processAnalytics) {
          processAnalytics('Runtime Button Clicked', {
            buttonCaption: control.caption,
            isCustomScreen: !isStockScreen,
            controlType: 'Button',
          });
        }
      }
    }
  };

  // Create a properly typed ButtonControl object with the correct types (or fallback for hooks)
  const buttonControl: ButtonControl = control
    ? {
        ...control,
        // Ensure properties are string or undefined, not null
        onClick: control.onClick || undefined,
        icon: control.icon || undefined,
        // Convert iconAlign to the correct union type
        iconAlign: control.iconAlign as 'Left' | 'Right' | 'False' | undefined,
        // Ensure styles is BackendControlStyles or undefined, not null
        styles: control.styles as BackendControlStyles | undefined,
      }
    : {
        // Minimal fallback control for hooks (should not happen with synchronous control creation)
        id: '',
        type: 'button',
        visible: true,
        disabled: false,
        isBound: false,
        isWorking: false,
        hideCaption: true,
        name: 'button',
        caption: 'Loading...',
        classes: '',
      };

  // Hook must be called before any conditional returns
  const { widgetProps } = useButtonTranslation(buttonControl, handleControlClick);

  // Handle setFocusToControl action - focus button when hasFocus becomes true
  useEffect(() => {
    if (mode === 'runtime' && (control as any)?.hasFocus) {
      // Focus the button element using the widget's ID
      const element = document.getElementById(widgetProps.id);
      if (element) {
        element.focus();
      }
      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [(control as any)?.hasFocus, widgetProps.id, id, mode, runtimeUpdateControlProperty]);

  // 🔧 SYNCHRONOUS CONTROL CREATION: Redux control should always exist now
  // If control doesn't exist, log error and return loading state
  if (!control) {
    return (
      <div
        style={{
          padding: '8px 16px',
          border: '1px dashed #ccc',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '12px',
        }}
      >
        Loading control...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 8,
        outline: isSelected ? '2px solid rgb(0, 102, 204)' : 'none',
        // In designer mode, disable pointer events so drag handle works on the wrapper
        pointerEvents: mode === 'designer' ? 'none' : 'auto',
      }}
    >
      <Button
        id={widgetProps.id}
        className={widgetProps.className}
        isV4Design={true}
        widthType={widgetProps.widthType ?? 'auto'}
        width={'100%'}
        classes={widgetProps.classes}
        onClick={handleControlClick}
        value={widgetProps.value}
        icon={widgetProps.icon}
        backgroundColor={widgetProps.backgroundColor}
        color={widgetProps.color}
        borderColor={widgetProps.borderColor}
        buttonStyle={widgetProps.buttonStyle}
        style={{ ...widgetProps.style, width: '100%', margin: 0, minHeight: 32 }}
        isDangerous
        disabled={widgetProps.disabled}
      />
    </div>
  );
};

export default ButtonWrapper;
