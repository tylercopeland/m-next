import { ReactNode } from 'react';

export interface ButtonMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}

export interface ButtonMenuSectionProps {
  title?: string;
  items?: ButtonMenuItem[];
  children?: ReactNode;
  className?: string;
  // Calendar editor specific props
  control?: import('@m-next/runtime-interface').CalendarControl;
  onChange?: (control: import('@m-next/runtime-interface').CalendarControl) => void;
  onAddAction?: (control: import('@m-next/runtime-interface').BaseControl, eventName: string) => void;
}

declare const ButtonMenuSection: React.FC<ButtonMenuSectionProps>;
export default ButtonMenuSection;
