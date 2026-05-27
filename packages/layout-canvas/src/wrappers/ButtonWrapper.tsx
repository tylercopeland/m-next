/**
 * ButtonWrapper - Runtime-ready wrapper for Button control
 *
 * Translates backend control configuration to M-One Button component props.
 * Now prop-based (no Redux) for use in both designer and runtime contexts.
 */

import React from 'react';
import Button from '@m-next/button';
import { useButtonTranslation } from '@m-next/runtime-interface';
import type { ButtonControl, BackendControlStyles } from '@m-next/runtime-interface/src/types';

/**
 * Props for ButtonWrapper component
 * @property control - Button control configuration from backend
 * @property onControlClick - Click handler for designer selection (optional)
 * @property isSelected - Whether this control is selected in designer (optional)
 */
export interface ButtonWrapperProps {
  control: ButtonControl;
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * ButtonWrapper Component
 *
 * Wraps the M-One Button component with backend control translation.
 * Used by both designer (app-builder) and runtime (MethodUI).
 *
 * @param control - Button control data from backend
 * @param onControlClick - Optional click handler for designer mode
 * @param isSelected - Optional selection state for designer mode
 */
const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ control, onControlClick, isSelected = false }) => {
  const handleControlClick = () => {
    if (onControlClick && control?.id) {
      onControlClick(control.id);
    }
  };

  // Create a properly typed ButtonControl object with the correct types
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

  // If control doesn't exist, return loading state
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
        outline: isSelected ? '2px solid #0066cc' : 'none',
        outlineOffset: -2,
      }}
    >
      <Button
        id={widgetProps.id}
        className={widgetProps.className}
        widthType={widgetProps.widthType ?? 'auto'}
        width={'100%'}
        classes={widgetProps.classes}
        onClick={handleControlClick}
        isV4Design={widgetProps.isV4Design}
        value={widgetProps.value}
        icon={widgetProps.icon}
        backgroundColor={widgetProps.backgroundColor}
        color={widgetProps.color}
        borderColor={widgetProps.borderColor}
        buttonStyle={widgetProps.buttonStyle}
        style={{ ...widgetProps.style, width: '100%', margin: 0 }}
        isDangerous
        disabled={widgetProps.disabled}
      />
    </div>
  );
};

export default ButtonWrapper;
