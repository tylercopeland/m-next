declare module '@m-next/button' {
  import * as React from 'react';

  export type ButtonStyle = 'primary' | 'link' | 'v4-primary' | 'ghost' | 'plain' | 'radio' | 'radio-selected';
  export type IconPosition = 'left' | 'right';
  export type ButtonSize = 'small' | 'medium';

  export interface IconProps {
    name?: string;
    size?: number;
    color?: string;
    position?: IconPosition;
  }

  export interface ButtonStylesProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    color?: string;
  }

  export interface ButtonProps {
    id: string;
    buttonStyle?: ButtonStyle;
    classes?: string[]; // You confirmed it can stay as an array
    className?: string;
    disabled?: boolean;
    isMobile?: boolean;
    isV4Design?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    tabIndex?: number;
    type?: string;
    value?: string;
    visible?: boolean;
    width?: number | string;
    widthType?: string | null;
    icon?: IconProps;
    forwardRef?: React.Ref<any>;
    style?: React.CSSProperties;
    isDangerous?: boolean;
    tooltip?: string;
    tooltipId?: string;
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    borderRadius?: string;
    fontSize?: string;
    size?: ButtonSize;
    v4Styling?: ButtonStylesProps;
  }

  const Button: React.FC<ButtonProps>;
  export default Button;
}
