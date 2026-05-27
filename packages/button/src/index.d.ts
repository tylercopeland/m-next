import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;

  /** @deprecated Pass content as children. */
  value?: string;
  /** @deprecated Use `variant`. radio / radio-selected are no longer supported — use a SegmentedControl. */
  buttonStyle?: 'primary' | 'link' | 'v4-primary' | 'ghost' | 'plain' | 'radio' | 'radio-selected';
  /** @deprecated Use `leftIcon` / `rightIcon` ReactNodes. */
  icon?: { name?: string; size?: number; color?: string; position?: 'left' | 'right' };
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLButtonElement>;

  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — don't render the button instead. */
  visible?: boolean;
  /** @deprecated Use `className`. */
  classes?: string[];
  /** @deprecated Use `fullWidth` or `style={{ width }}`. */
  widthType?: string | null;
  /** @deprecated Use `fullWidth` or `style={{ width }}`. */
  width?: number | string;

  /** @deprecated Removed for security — pass ReactNode children, not HTML strings. */
  isDangerous?: boolean;
  /** @deprecated Compose with `<Tooltip>` from `@m-next/tooltip`. */
  tooltip?: string;
  /** @deprecated Compose with `<Tooltip>` from `@m-next/tooltip`. */
  tooltipId?: string;
  /** @deprecated Per-prop style overrides removed. Use `variant` or `style`. */
  backgroundColor?: string;
  /** @deprecated Per-prop style overrides removed. Use `variant` or `style`. */
  borderColor?: string;
  /** @deprecated Per-prop style overrides removed. Use `variant` or `style`. */
  borderRadius?: string;
  /** @deprecated Per-prop style overrides removed. Use `variant` or `style`. */
  fontSize?: string;
  /** @deprecated Per-prop style overrides removed. Use `variant` or `style`. */
  color?: string;
}

export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default Button;
