/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface InputAreaProps {
  ariaLabel?: string;
  autoGrow?: boolean;
  disabled?: boolean;
  disableResize?: boolean;
  forwardRef?: React.Ref<any>;
  id: string;
  label?: string | null;
  maxHeight?: number;
  name?: string | null;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  style?: React.CSSProperties;
  tabIndex?: number;
  value?: string | number | null;
  width?: string;
  onBlur?: (event: React.FocusEvent<any>) => void;
  onChange?: (value: string) => void;
  onFocus?: (event: React.FocusEvent<any>) => void;
  onKeyDown?: (event: React.KeyboardEvent<any>) => void;
  onKeyUp?: (event: React.KeyboardEvent<any>) => void;
  validationMessage?: string;
  displayAuto?: boolean;
  legacyClass?: string;
  isV4Design?: boolean;
  initialHeight?: number;
  selectOnFocus?: boolean;
  navigateGrid?: (direction: 'up' | 'down') => void;
  isBlurOnSubmit?: boolean;
  compactStyle?: boolean;
}

declare const InputArea: React.FC<InputAreaProps>;
export default InputArea;

declare const DebouncedInputArea: React.FC<InputAreaProps>;
export { DebouncedInputArea }; 