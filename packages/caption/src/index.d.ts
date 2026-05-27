import React from 'react';

export interface CaptionProps {
  /**
   * Text alignment for the caption
   */
  align?: 'left' | 'center' | 'right';
  
  /**
   * Text color for the caption
   */
  color?: string;
  
  /**
   * The for attribute to associate with a form element
   */
  elFor?: string;
  
  /**
   * Unique identifier for the caption element
   */
  id?: string;
  
  /**
   * Whether the associated input element is focused
   */
  focused?: boolean;
  
  /**
   * Whether the component is being rendered on mobile
   */
  isMobile?: boolean;
  
  /**
   * The text content of the caption
   */
  label?: string;
  
  /**
   * Whether the field is required (shows red asterisk)
   */
  required?: boolean;
  
  /**
   * Additional CSS styles to apply
   */
  style?: React.CSSProperties;
  
  /**
   * Legacy CSS class name for backwards compatibility
   */
  legacyClass?: string;
  
  /**
   * Whether the associated field is valid (affects color)
   */
  isValid?: boolean;
  
  /**
   * Whether to use v4 design system styling
   */
  isV4Design?: boolean;
  
  /**
   * Whether the caption should float above the input
   */
  float?: boolean;
  
  /**
   * Whether the associated input is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the associated input is read-only
   */
  readOnly?: boolean;
  
  /**
   * Background color for the caption
   */
  background?: string;
  
  /**
   * Y position for floating caption
   */
  floatYPos?: number;
  
  /**
   * X position when focused for floating caption
   */
  floatXPosFocus?: string;
  
  /**
   * X position when unfocused for floating caption
   */
  floatXPosUnfocus?: string;
  
  /**
   * Whether the label text should be bolded
   */
  isLabelBolded?: boolean;
  
  /**
   * Whether to use narrow spacing
   */
  narrow?: boolean;
  
  /**
   * Click handler for the caption
   */
  onClick?: (event: React.MouseEvent<HTMLLabelElement>) => void;
}

/**
 * Caption component for form labels and descriptive text
 */
declare const Caption: React.FunctionComponent<CaptionProps>;

export default Caption;