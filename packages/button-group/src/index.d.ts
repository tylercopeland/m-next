import * as React from 'react';

export interface ButtonGroupDataItem {
  value: string | number | boolean;
  label?: string | Element;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
}

export interface ButtonGroupProps {
  buttonStyle?: 'primary' | 'ghost' | 'plain' | 'calendarMenu';
  data: ButtonGroupDataItem[];
  disabled?: boolean;
  displayAuto?: boolean;
  id?: string;
  isDropdown?: boolean;
  label?: string;
  legacyClass?: string;
  margin?: string;
  onClick?: (item: ButtonGroupDataItem, index: number) => void;
  showCaption?: boolean;
  width?: string;
  forceOpenUp?: boolean;
  isMobile?: boolean;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  fontSize?: string;
  hasMenuLabel?: boolean;
  menuLabel?: string;
}

export interface ButtonGroupRowProps {
  data: ButtonGroupDataItem[];
  id?: string;
  selected?: string | number | boolean;
  onClick?: (item: ButtonGroupDataItem, index: number) => void;
  tooltipId?: string;
  tooltipPlace?: string;
  width?: string | number;
}

export declare const ButtonGroup: React.FC<ButtonGroupProps>;
export declare const ButtonGroupRow: React.FC<ButtonGroupRowProps>;
export default ButtonGroup; 