/* eslint-disable no-unused-vars */
import * as React from 'react';
import { CSSProperties } from 'react';

export type RadioButtonDirection = 'row' | 'column';

export interface RadioButtonProps {
  id: string;
  label: string;
  name: string;
  value: string | number;
  checked: boolean;
  direction?: RadioButtonDirection;
  ariaChecked?: boolean;
  isV4Design?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
  isFocused?: boolean;
  widthType?: string;
  rowItemWidth?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tabIndex?: number;
  customColor?: string;
  customFontSize?: string;
  style?: CSSProperties;
  narrow?: boolean;
  labelStyle?: CSSProperties;
  hint?: string;
  bold?: boolean;
  marginBottom?: number;
}

export interface RadioGroupOption {
  id?: string;
  label: string;
  value: string | number;
  subtext?: React.ReactNode;
  disabled?: boolean;
  hint?: string;
}

export interface RadioGroupProps {
  id: string;
  name: string;
  options: RadioGroupOption[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number) => void;
  selectedValue?: string | number;
  isMobile?: boolean;
  disabled?: boolean;
  direction?: RadioButtonDirection;
  widthType?: string;
  width?: string;
  isV4Design?: boolean;
  isFocused?: boolean;
  isRuntime?: boolean;
  labelledBy?: string;
  customColor?: string;
  customFontSize?: string;
  legacyClass?: string;
  style?: CSSProperties;
  className?: string;
  wrapperStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  narrow?: boolean;
  bold?: boolean;
  gap?: number;
  caption?: string;
  hideCaption?: boolean;
  allowWrap?: boolean;
}

export interface IconRadioGroupOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface IconRadioGroupProps {
  id: string;
  options: IconRadioGroupOption[];
  onChange?: (item: IconRadioGroupOption) => void;
  selectedValue?: string | number;
  widthType?: string;
  width?: string;
  style?: CSSProperties;
  caption?: string;
  disabled?: boolean;
}

export interface ButtonRadioGroupOption {
  label: string;
  value: string | number;
}

export interface ButtonRadioGroupProps {
  id: string;
  options: ButtonRadioGroupOption[];
  onChange?: (item: ButtonRadioGroupOption) => void;
  selectedValue?: string | number;
  widthType?: string;
  width?: string;
  style?: CSSProperties;
  caption?: string;
  buttonWidth?: string | number;
  isOneLine?: boolean;
  disabled?: boolean;
}

export const RadioButton: React.FC<RadioButtonProps>;
export const IconRadioGroup: React.FC<IconRadioGroupProps>;
export const ButtonRadioGroup: React.FC<ButtonRadioGroupProps>;
export const RadioGroup: React.FC<RadioGroupProps>;
export default RadioGroup; 