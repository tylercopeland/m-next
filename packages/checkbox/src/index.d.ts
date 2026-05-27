import { RefObject } from 'react';

export interface CheckboxProps {
  /** Alignment of the checkbox and label */
  align?: 'left' | 'center' | 'right';
  /** Whether the checkbox should be focused on mount */
  autoFocus?: boolean;
  /** Whether the checkbox is checked */
  checked?: boolean | string;
  /** Additional CSS class name */
  className?: string;
  /** ID for the label element */
  controlId?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Ref to be forwarded to the checkbox input */
  forwardRef?: RefObject<HTMLInputElement>;
  /** Whether the checkbox is in an indeterminate state */
  halfChecked?: boolean;
  /** Whether to hide the caption/label */
  hideCaption?: boolean;
  /** Whether the checkbox is hidden */
  hidden?: boolean;
  /** Unique identifier for the checkbox */
  id: string;
  /** Whether the checkbox is being rendered on mobile */
  isMobile?: boolean;
  /** Label text or element */
  label?: string | React.ReactNode;
  /** Legacy CSS classes */
  legacyClasses?: string;
  /** Name attribute for the checkbox input */
  name?: string;
  /** Whether the checkbox has rounded corners */
  rounded?: boolean;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Width of the checkbox container */
  width?: number | string;
  /** Whether the label is disabled */
  disableLabel?: boolean;
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Change event handler */
  onChange?: (checked: boolean) => void;
  /** Focus event handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Key down event handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Whether the checkbox has narrow spacing */
  narrow?: boolean;
  /** Test ID for testing purposes */
  testId?: string;
  /** Whether the checkbox should take full width */
  fullWidth?: boolean;
  /** Whether the label should be bold */
  bold?: boolean;
}

declare const Checkbox: React.FC<CheckboxProps>;

export default Checkbox; 