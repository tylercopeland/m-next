/**
 * Radio Button Control Interface
 *
 * Defines the structure for radio button controls that allow users to select
 * one option from a group of mutually exclusive choices.
 */

import WIDGETS from '../types/widgetTypes';
import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

/**
 * Radio button option interface
 */
export interface RadioButtonOption {
  /**
   * The value of the option
   */
  value: string | number;

  /**
   * The display label for the option
   */
  label: string;

  /**
   * Whether this option is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional description or help text for the option
   */
  description?: string;

  /**
   * Custom CSS classes for this specific option
   */
  cssClass?: string;
}

/**
 * Radio button layout options
 */
export type RadioButtonLayout = 'vertical' | 'horizontal' | 'grid';

/**
 * Radio button control interface extending BaseControl
 * Used for single-selection from multiple options
 */
interface RadioButtonControl extends BaseControl {
  type: 'RAD';

  /**
   * Array of available options
   */
  radiobuttons: (string | number)[];

  /**
   * Currently selected value
   */
  value?: string | number;

  /**
   * Default selected value
   */
  defaultValue?: string | number;

  /**
   * Layout arrangement of radio buttons
   * @default 'vertical'
   */
  layout?: RadioButtonLayout;

  /**
   * Number of columns when using grid layout
   * @default 2
   */
  gridColumns?: number;

  /**
   * Whether selection is required
   * @default false
   */
  required?: boolean;

  /**
   * Custom validation message for required field
   */
  requiredMessage?: string;

  /**
   * Whether to show option descriptions
   * @default false
   */
  showDescriptions?: boolean;

  /**
   * Custom CSS classes to apply to the radio group
   */
  cssClass?: string;

  /**
   * Custom inline styles to apply to the radio group
   */
  style?: Record<string, string | number>;

  /**
   * Custom action to execute when selection changes
   */
  onChange?: string; // Action ID or expression

  /**
   * Custom action to execute on focus
   */
  onFocus?: string; // Action ID or expression

  /**
   * Custom action to execute on blur
   */
  onBlur?: string; // Action ID or expression

  /**
   * Parameters to pass to action handlers
   */
  actionParameters?: Record<string, unknown>;

  /**
   * Whether to allow deselection (clicking selected option deselects it)
   * @default false
   */
  allowDeselect?: boolean;

  /**
   * Custom spacing between radio button options
   */
  optionSpacing?: string | number;

  /**
   * Size of the radio button indicators
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Color theme for the radio buttons
   */
  color?: string;

  /**
   * Whether to show borders around the radio group
   * @default false
   */
  showBorder?: boolean;

  /**
   * Title for the radio button group
   */
  groupTitle?: string;

  position?: 'horizontal' | 'vertical';
}
export type { RadioButtonControl };

/**
 * Input interface for creating RadioButtonControl
 */
export interface RadioButtonControlInput extends BaseControlInput {
  radiobuttons?: string[];
  value?: string | number;
  defaultValue?: string | number;
  layout?: RadioButtonLayout;
  gridColumns?: number;
  required?: boolean;
  requiredMessage?: string;
  showDescriptions?: boolean;
  cssClass?: string;
  style?: Record<string, string | number>;
  onChange?: string;
  onFocus?: string;
  onBlur?: string;
  actionParameters?: Record<string, unknown>;
  allowDeselect?: boolean;
  optionSpacing?: string | number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showBorder?: boolean;
  groupTitle?: string;
}

/**
 * Type guard to check if a control is a RadioButtonControl
 * @param control - The control to check
 * @returns True if the control is a RadioButtonControl
 */
export function isRadioButtonControl(control: unknown): control is RadioButtonControl {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === 'radioButton'
  );
}

/**
 * Create a new RadioButtonControl with default values
 * @param data - Input data for creating the control
 * @returns A new RadioButtonControl instance
 */
export function createRadioButtonControl(data: RadioButtonControlInput = {}): RadioButtonControl {
  return {
    ...createBaseControl(data),
    type: WIDGETS.RADIOBOX,
    name: data.name || 'radioButton',
    radiobuttons: data.radiobuttons || [],
    value: data.value,
    defaultValue: data.defaultValue,
    layout: data.layout || 'vertical',
    gridColumns: data.gridColumns || 2,
    required: data.required || false,
    requiredMessage: data.requiredMessage,
    showDescriptions: data.showDescriptions || false,
    cssClass: data.cssClass,
    style: data.style,
    onChange: data.onChange,
    onFocus: data.onFocus,
    onBlur: data.onBlur,
    actionParameters: data.actionParameters,
    allowDeselect: data.allowDeselect || false,
    optionSpacing: data.optionSpacing,
    size: data.size || 'medium',
    color: data.color,
    showBorder: data.showBorder || false,
    groupTitle: data.groupTitle,
  };
}

/**
 * Validate RadioButtonControl properties
 * @param control - The RadioButtonControl to validate
 * @returns Array of validation error messages
 */
export function validateRadioButtonControl(control: RadioButtonControl): string[] {
  const errors: string[] = [];

  // Validate options array
  if (!control.radiobuttons || control.radiobuttons.length === 0) {
    errors.push('Radio button control must have at least one option');
  } else {
    // Check for duplicate values
    const values = control.radiobuttons;
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
      errors.push('Radio button options must have unique values');
    }

    // Validate each option
    control.radiobuttons.forEach((option, index) => {
      if (option === undefined || option === null || option === '') {
        errors.push(`Option ${index + 1} must have a value`);
      }

      if (!option || (typeof option === 'string' && option.trim() === '')) {
        errors.push(`Option ${index + 1} must have a label`);
      }
    });
  }

  // Validate selected value exists in options
  if (control.value !== undefined && control.radiobuttons) {
    const validValues = control.radiobuttons;
    if (!validValues.includes(control.value)) {
      errors.push('Selected value must match one of the available options');
    }
  }

  // Validate default value exists in options
  if (control.defaultValue !== undefined && control.radiobuttons) {
    const validValues = control.radiobuttons;
    if (!validValues.includes(control.defaultValue)) {
      errors.push('Default value must match one of the available options');
    }
  }

  // Validate layout
  const validLayouts: RadioButtonLayout[] = ['vertical', 'horizontal', 'grid'];
  if (control.layout && !validLayouts.includes(control.layout)) {
    errors.push(`Layout must be one of: ${validLayouts.join(', ')}`);
  }

  // Validate grid columns
  if (control.gridColumns !== undefined && (control.gridColumns < 1 || !Number.isInteger(control.gridColumns))) {
    errors.push('Grid columns must be a positive integer');
  }

  // Validate size
  const validSizes = ['small', 'medium', 'large'];
  if (control.size && !validSizes.includes(control.size)) {
    errors.push(`Size must be one of: ${validSizes.join(', ')}`);
  }

  // Validate required field has value
  if (control.required && (control.value === undefined || control.value === null || control.value === '')) {
    errors.push(control.requiredMessage || 'A selection is required');
  }

  return errors;
}

/**
 * Get the selected option object
 * @param control - The RadioButtonControl
 * @returns The selected option or undefined
 */
export function getSelectedOption(control: RadioButtonControl): string | number | undefined {
  if (!control.radiobuttons || control.value === undefined) {
    return undefined;
  }

  return control.radiobuttons.find((option) => option === control.value);
}

/**
 * Get the display label for the selected value
 * @param control - The RadioButtonControl
 * @returns The selected option's label or empty string
 */
export function getSelectedLabel(control: RadioButtonControl): string | number {
  const selectedOption = getSelectedOption(control);
  return selectedOption ? selectedOption : '';
}

/**
 * Default RadioButtonControl configuration
 */
export const DEFAULT_RADIOBUTTON_CONTROL: Readonly<RadioButtonControl> = Object.freeze(createRadioButtonControl());

export default createRadioButtonControl;
