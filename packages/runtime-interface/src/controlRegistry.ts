/**
 * Control Type Registry
 *
 * This file establishes the single source of truth for all valid control types
 * following the pattern from SvgIconNames.ts to ensure every component is
 * defined in every place that is required.
 */

export const validControlTypes = [
  // Core input controls
  'button',
  'buttonGroup',
  'attachments',
  'input',
  'dropdown',
  'checkbox',
  'toggle',
  'dateTimePicker',
  'label',
  'radioButton',

  // Display controls
  'grid',
  'chart',
  'image',
  'map',
  'signature',
  'textArea',

  // Advanced controls (newly implemented)
  'recurrence',
  'tagList',
  'section',
  'layoutContainer',
  'htmlEditor',
  'gallery',
  'fieldBlock',
  'appRibbon',
  'calendar',
  'syncWidget',
  'addressLookup',

  // Special types
  'screen',
] as const;

export type ValidControlType = (typeof validControlTypes)[number];

/**
 * Type guard for runtime validation of control types
 * @param type - String to validate as a control type
 * @returns True if the type is a valid control type
 */
export function isValidControlType(type: string): type is ValidControlType {
  return (validControlTypes as readonly string[]).includes(type);
}

/**
 * Get all valid control types as an array
 * Useful for iteration and validation
 */
export function getAllValidControlTypes(): readonly ValidControlType[] {
  return validControlTypes;
}
