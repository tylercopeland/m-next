import React from 'react';
import { useSelector } from 'react-redux';
import ButtonGroup from '@m-next/button-group';
import { useButtonGroupTranslation } from '@m-next/runtime-interface';
import type { ButtonGroupControl } from '@m-next/runtime-interface';
import type { ButtonGroupWrapperProps } from './buttonGroupWrapper.types';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import { RootState } from '../../../types/screenLayoutTypes';

const ButtonGroupWrapper: React.FC<ButtonGroupWrapperProps> = ({ id, onControlClick }) => {
  const controls = useSelector((state: RootState) => selectControls(state));
  const control = controls?.[id] as ButtonGroupControl | undefined;

  // Call hook before any conditional returns
  const { widgetProps } = useButtonGroupTranslation(control || {} as ButtonGroupControl, () => {});

  if (!control) {
    return null;
  }

  const buttonData = Array.isArray(widgetProps.data) ? widgetProps.data : [];

  const dataWithHandlers = buttonData.map((btn, index) => ({
    ...btn,
    value: btn.label || '',
    onClick: () => onControlClick(`${widgetProps.id || id}-${index}`),
  }));

  return <ButtonGroup {...widgetProps} data={dataWithHandlers} />;
};

export default ButtonGroupWrapper;
