import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@m-next/button';
import { useButtonTranslation } from '@m-next/runtime-interface';
import type { ButtonControl, BackendControlStyles } from '@m-next/runtime-interface/src/types';
// Import from the slice file
import { selectControls } from '../../../common/services/screenLayoutSlice';
import { RootState } from '../../../types/screenLayoutTypes';
// import type { ButtonWrapperProps } from './buttonWrapper.types';

interface ButtonWrapperProps {
  id: string;
  onControlClick: (id: string) => void;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({ id, onControlClick }) => {
    const controlList = useSelector((state) => selectControls(state as RootState))
    const control = (controlList ? controlList[id] : null) as ButtonControl | null;

  const handleControlClick = () => {
    onControlClick(id);
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

  // 🔧 SYNCHRONOUS CONTROL CREATION: Redux control should always exist now
  // If control doesn't exist, log error and return loading state
  if (!control) {
    return (
      <div style={{ 
        padding: '8px 16px', 
        border: '1px dashed #ccc', 
        backgroundColor: '#f5f5f5',
        color: '#666',
        fontSize: '12px'
      }}>
        Loading control...
      </div>
    );
  }

  return (
    <Button
      id={widgetProps.id}
      className={widgetProps.className}
      isV4Design={widgetProps.isV4Design}
      widthType={widgetProps.widthType ?? 'auto'}
      width={widgetProps.width}
      classes={widgetProps.classes}
      onClick={handleControlClick}
      value={widgetProps.value}
      icon={widgetProps.icon}
      backgroundColor={widgetProps.backgroundColor}
      color={widgetProps.color}
      borderColor={widgetProps.borderColor}
      buttonStyle={widgetProps.buttonStyle}
      style={widgetProps.style}
      isDangerous
      disabled={widgetProps.disabled}
    />
  );
};

export default ButtonWrapper;
