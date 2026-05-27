/**
 * Component Naming Utility
 *
 * Provides a comprehensive naming system for layout components that ensures:
 * - Unique identifiers across all components
 * - Sanitized, valid names following naming conventions
 * - Consistent incrementation patterns
 * - Reserved word protection
 * - Case-insensitive duplicate detection
 *
 * IMPORTANT: Component names are synchronized with labels but MUST remain unique.
 * When a label changes:
 * - If the new label is unique (after sanitization) → name updates to match
 * - If the new label conflicts with existing names → find next available incremented name
 * This applies to ALL components to ensure name uniqueness is always maintained.
 *
 * Based on legacy Method Platform naming system with modern TypeScript implementation.
 */

import { ResponsiveComponent, WidgetType } from '../rgl-integration/types';
import { WIDGETS } from '@m-next/runtime-interface';

/**
 * Reserved MAML (Method API Markup Language) words that cannot be used as control names
 */
const RESERVED_WORDS = ['screen', 'session', 'actionresult', 'field', 'sharedresult', 'grid'] as const;

/**
 * Type-to-display name mapping (PascalCase for proper incrementation)
 * Example: Button, Button2, Button3 (not Button, Button 1, Button 2)
 */
const WIDGET_TYPE_NAMES: Record<string, string> = {
  [WIDGETS.BUTTON]: 'Button',
  [WIDGETS.TEXTBOX]: 'TextInput',
  [WIDGETS.LABEL]: 'Label',
  [WIDGETS.DROPDOWN]: 'Dropdown',
  [WIDGETS.CHECKBOX]: 'Checkbox',
  [WIDGETS.HTMLEDITOR]: 'HTMLEditor',
  [WIDGETS.TOGGLE]: 'Toggle',
  [WIDGETS.TAGLIST]: 'Taglist',
  [WIDGETS.DOCUMENTSWIDGET]: 'Attachments',
  [WIDGETS.TEXTAREA]: 'TextArea',
  [WIDGETS.DATATABLE]: 'DataTable',
  [WIDGETS.SECTION]: 'Section',
  [WIDGETS.CHART]: 'Chart',
  [WIDGETS.RADIOBOX]: 'RadioButton',
  [WIDGETS.DATETIMEPICKER]: 'DateTimePicker',
  [WIDGETS.PICTURE]: 'Image',
  [WIDGETS.BUTTONGROUP]: 'ButtonMenu',
  [WIDGETS.FIELD_BLOCK]: 'FieldBlock',
  [WIDGETS.SIGNATURE]: 'Signature',
  [WIDGETS.RECURRENCE]: 'Recurrence',
  [WIDGETS.MAP]: 'Map',
  [WIDGETS.GALLERY]: 'Gallery',
  [WIDGETS.ADDRESSLOOKUP]: 'AddressLookup',
  [WIDGETS.CALENDAR]: 'Calendar',
  [WIDGETS.APPRIBBON]: 'AppRibbon',
  [WIDGETS.LAYOUT_CONTAINER]: 'Container',
  [WIDGETS.SYNCWIDGET]: 'SyncWidget',
};

/**
 * Interface for name uniqueness checker
 */
export interface NameUniquenessChecker {
  /**
   * Check if a name is unique among existing components
   * @param name - The name to check
   * @param excludeId - Optional component ID to exclude from check (for updates)
   */
  isUnique: (name: string, excludeId?: string) => boolean;
}

/**
 * Default implementation using component array
 */
export class ComponentNameChecker implements NameUniquenessChecker {
  constructor(private components: ResponsiveComponent[]) {}

  isUnique(name: string, excludeId?: string): boolean {
    const normalizedName = name.toLowerCase();

    return !this.components.some((component) => {
      if (excludeId && component.id === excludeId) {
        return false;
      }

      // Only check component.name - it's the source of truth for unique identifiers
      const componentName = (component.name || '').toLowerCase();
      return componentName === normalizedName;
    });
  }
}

/**
 * Get the human-readable display name for a widget type
 * @param widgetType - The widget type constant
 * @returns PascalCase display name (e.g., "Button", "RadioButton")
 */
export function getWidgetTypeName(widgetType: WidgetType): string {
  return WIDGET_TYPE_NAMES[widgetType as string] || 'Component';
}

/**
 * Sanitize a user-provided caption to create a valid control name
 *
 * Rules:
 * - Replace all whitespace with underscores
 * - Extract only alphanumeric characters and underscores
 * - Must contain at least one letter
 * - Maximum 50 characters
 *
 * @param caption - User-provided caption text
 * @returns Sanitized name or empty string if invalid
 */
export function sanitizeCaption(caption: string): string {
  if (!caption) {
    return '';
  }

  let sanitized = caption.replace(/\s/g, '_');

  const pattern = /[a-z0-9_]{0,100}[a-z][a-z0-9_]{0,100}/gi;
  const matches = sanitized.match(pattern);

  if (!matches || matches.length === 0) {
    return '';
  }

  sanitized = matches.join('');
  return sanitized.substring(0, 50);
}

/**
 * Check if a name is a reserved MAML word
 * @param name - The name to check
 * @returns True if the name is reserved
 */
export function isReservedWord(name: string): boolean {
  const normalized = name.toLowerCase();
  return RESERVED_WORDS.includes(normalized as (typeof RESERVED_WORDS)[number]);
}

/**
 * Extract the base name from a name that might have numeric suffixes
 *
 * Examples:
 * - "Button" → "Button"
 * - "Button_2" → "Button"
 * - "Button_2_2" → "Button"
 * - "screen_1" → "screen"
 * - "MyControl_3" → "MyControl"
 *
 * @param name - The name to extract base from
 * @returns The base name without any trailing underscore-number suffixes
 */
export function extractBaseName(name: string): string {
  return name.replace(/(_\d+)+$/, '');
}

/**
 * Find the next available incremented name
 *
 * Examples:
 * - If "Button" exists, try "Button_2", "Button_3", etc. (starts at 2)
 * - If "Button_2" exists, try "Button_2_2", "Button_2_3", etc. (starts at 2 for sub-sequences)
 * - If "Button", "Button_2", "Button_3" exist, return "Button_4"
 *
 * @param baseName - The base name without number suffix
 * @param checker - Uniqueness checker implementation
 * @param excludeId - Optional component ID to exclude from check
 * @param maxAttempts - Maximum number of incrementation attempts (default 200)
 * @returns Unique name with numeric suffix, or base name if already unique
 */
export function getIncrementedName(
  baseName: string,
  checker: NameUniquenessChecker,
  excludeId?: string,
  maxAttempts: number = 200,
): string {
  if (checker.isUnique(baseName, excludeId)) {
    return baseName;
  }

  for (let i = 2; i <= maxAttempts; i++) {
    const candidateName = `${baseName}_${i}`;
    if (checker.isUnique(candidateName, excludeId)) {
      return candidateName;
    }
  }

  return `${baseName}_${Date.now()}`;
}

/**
 * Calculate a valid, unique control name from a caption and widget type
 *
 * **WARNING**: This function should ONLY be called when CREATING a new component.
 * Component names are IMMUTABLE and should NEVER be recalculated after initial creation.
 * Do NOT use this function to update existing component names based on caption changes.
 *
 * This is the main entry point for component name generation.
 *
 * Process:
 * 1. Sanitize user caption (if provided)
 * 2. Fall back to widget type name if caption is invalid
 * 3. Check for reserved words and append "_1" if needed
 * 4. Ensure uniqueness with incrementation (Button, Button_2, Button_3, etc.)
 *
 * @param caption - User-provided caption (optional)
 * @param widgetType - The widget type constant
 * @param checker - Uniqueness checker implementation
 * @param componentId - ID of component being named (for updates - only used for uniqueness check)
 * @returns Valid, unique component name (IMMUTABLE - do not change after assignment)
 */
export function calculateComponentName(
  caption: string | undefined,
  widgetType: WidgetType,
  checker: NameUniquenessChecker,
  componentId?: string,
): string {
  let name = caption ? sanitizeCaption(caption) : '';

  if (!name) {
    name = getWidgetTypeName(widgetType);
  }

  if (isReservedWord(name)) {
    name = `${name}_1`;
  }

  return getIncrementedName(name, checker, componentId);
}

/**
 * Field interface for database field checking
 */
export interface Field {
  name: string;
}

/**
 * Generate a unique name for a newly created component
 *
 * This is a convenience function for the drag-and-drop flow.
 * The generated name is IMMUTABLE and should be assigned to the component's `name` field.
 * The name will NEVER change for the lifetime of the component.
 *
 * Examples:
 * - First button: "Button"
 * - Second button: "Button_2"
 * - Third button: "Button_3"
 *
 * @param widgetType - The widget type constant
 * @param existingComponents - Array of existing components to check against
 * @param fieldList - Optional array of database fields to check against
 * @returns Unique component name ready for use (assign to `name` field, NOT `caption`)
 */
export function generateUniqueComponentName(
  widgetType: WidgetType,
  existingComponents: ResponsiveComponent[],
  fieldList?: Field[] | null,
): string {
  const checker = new ComponentNameChecker(existingComponents);
  let proposedName = calculateComponentName(undefined, widgetType, checker);

  // Second pass: Check against fields and increment further if needed
  if (fieldList?.length) {
    proposedName = checkFieldConflictsAndIncrement(proposedName, fieldList, checker);
  }

  return proposedName;
}

/**
 * Check if proposed name conflicts with field names and increment if needed
 *
 * IMPORTANT: Field names without suffixes (e.g., "Button") are treated as if they occupy "_1" position.
 * This ensures that when a field "Button" exists, new components start at "Button_2".
 *
 * @param proposedName - The name proposed after checking components
 * @param fieldList - Array of database fields
 * @param checker - Optional component checker to ensure final name is also unique in components
 * @param excludeId - Optional component ID to exclude from uniqueness check (for renames)
 * @returns Incremented name if conflict exists, otherwise original name
 */
function checkFieldConflictsAndIncrement(
  proposedName: string,
  fieldList: Field[],
  checker?: NameUniquenessChecker,
  excludeId?: string,
): string {
  // Extract base name (without any _N suffixes) to check against field patterns
  const baseName = proposedName.replace(/_\d+$/, '');

  // Find all fields that match the base name pattern (e.g., "Button", "Button_2", "Button_10")
  const similarBaseFields = fieldList.filter((field) => new RegExp(`^${baseName}(_\\d+)?$`, 'i').test(field.name));

  if (similarBaseFields.length > 0) {
    // Extract max index from matching fields
    // IMPORTANT: Treat field names without suffix as if they have "_1" (implicit position 1)
    const maxFieldIndex = Math.max(
      ...similarBaseFields.map((field) => {
        const match = field.name.match(/_(\d+)$/);
        return match ? parseInt(match[1]!, 10) : 1;
      }),
    );

    // Extract current index from proposed name
    const proposedMatch = proposedName.match(/_(\d+)$/);
    const proposedIndex = proposedMatch ? parseInt(proposedMatch[1]!, 10) : 1;

    // If field index is higher or equal, increment beyond it
    if (maxFieldIndex >= proposedIndex) {
      const candidateName = `${baseName}_${maxFieldIndex + 1}`;

      // If checker provided, ensure the name is also unique in components
      if (checker && !checker.isUnique(candidateName, excludeId)) {
        // Find next available that's unique in both fields and components
        for (let i = maxFieldIndex + 2; i <= maxFieldIndex + 200; i++) {
          const nextCandidate = `${baseName}_${i}`;
          if (checker.isUnique(nextCandidate, excludeId)) {
            return nextCandidate;
          }
        }
      }

      return candidateName;
    }
  }

  return proposedName;
}

/**
 * Calculate the appropriate name when a label/caption is changed
 *
 * This function determines the correct name based on label changes:
 * - If the new label is unique (after sanitization), use it as the new name
 * - If the new label conflicts, find the next available incremented name using the base name
 * - This ensures names are always unique while allowing synchronization when possible
 *
 * Examples:
 * - Change "Button_3" to "HelloWorld" (unique) → name becomes "HelloWorld"
 * - Change "HelloWorld" to "Button" (conflicts with Button, Button_2) → name becomes "Button_3"
 * - Change "Button_3" to "Button_2" (conflicts) → extract base "Button", find next: "Button_3" or "Button_4"
 *
 * @param newLabel - The new label/caption the user wants to set
 * @param currentName - The component's current unique name
 * @param componentId - ID of the component being updated
 * @param existingComponents - Array of existing components
 * @param fieldList - Optional array of database fields to check against
 * @returns The name to use (either the new label or next available incremented name)
 */
export function calculateNameFromLabelChange(
  newLabel: string,
  currentName: string,
  componentId: string,
  existingComponents: ResponsiveComponent[],
  fieldList?: Field[] | null,
): string {
  if (currentName === 'TagList') {
    return currentName;
  }

  const sanitized = sanitizeCaption(newLabel);

  if (!sanitized) {
    return currentName;
  }

  const isReserved = isReservedWord(sanitized);

  let proposedName = sanitized;
  if (isReserved) {
    proposedName = `${proposedName}_1`;
  }

  const checker = new ComponentNameChecker(existingComponents);
  if (checker.isUnique(proposedName, componentId)) {
    // Even if unique among components, check against fields
    if (fieldList?.length) {
      proposedName = checkFieldConflictsAndIncrement(proposedName, fieldList, checker, componentId);
    }
    return proposedName;
  }

  proposedName = getIncrementedName(proposedName, checker, componentId);

  // Second pass: Check against fields and increment further if needed
  // IMPORTANT: Pass checker AND excludeId to ensure name is unique in BOTH components and fields
  if (fieldList?.length) {
    proposedName = checkFieldConflictsAndIncrement(proposedName, fieldList, checker, componentId);
  }

  return proposedName;
}

/**
 * Validate if a proposed name change is allowed
 *
 * @param proposedName - The new name to validate
 * @param componentId - ID of the component being renamed
 * @param existingComponents - Array of existing components
 * @returns Validation result with error message if invalid
 */
export function validateNameChange(
  proposedName: string,
  componentId: string,
  existingComponents: ResponsiveComponent[],
): { isValid: boolean; error?: string } {
  if (!proposedName || proposedName.trim() === '') {
    return { isValid: false, error: 'Name cannot be empty' };
  }

  const sanitized = sanitizeCaption(proposedName);
  if (!sanitized) {
    return {
      isValid: false,
      error: 'Name must contain at least one letter and only alphanumeric characters or underscores',
    };
  }

  if (sanitized.length > 50) {
    return { isValid: false, error: 'Name cannot exceed 50 characters' };
  }

  const checker = new ComponentNameChecker(existingComponents);
  if (!checker.isUnique(sanitized, componentId)) {
    return { isValid: false, error: 'This name is already in use' };
  }

  if (isReservedWord(sanitized)) {
    return {
      isValid: true,
      error: 'This is a reserved word. Consider using a different name or it will be suffixed with "_1"',
    };
  }

  return { isValid: true };
}

/**
 * Batch rename components (useful for copy/paste operations)
 *
 * @param components - Components to rename
 * @param existingComponents - Existing components to check against
 * @param nameSuffix - Optional suffix to add (e.g., "Copy")
 * @returns Components with new unique names
 */
export function batchRenameComponents(
  components: ResponsiveComponent[],
  existingComponents: ResponsiveComponent[],
  nameSuffix?: string,
): ResponsiveComponent[] {
  const checker = new ComponentNameChecker(existingComponents);

  return components.map((component) => {
    // Use component.name as the base - it's the source of truth
    const baseName = component.name || getWidgetTypeName(component.type);
    const nameWithSuffix = nameSuffix ? `${baseName}${nameSuffix}` : baseName;
    const uniqueName = getIncrementedName(nameWithSuffix, checker);

    return {
      ...component,
      name: uniqueName,
      content: uniqueName, // Mirror name for backward compatibility
    };
  });
}

/**
 * Split a PascalCase or camelCase name into individual words.
 * Handles acronyms (consecutive uppercase letters) as single words.
 *
 * @example
 * splitPascalCase('AccountNumber') // ['Account', 'Number']
 * splitPascalCase('HTMLEditor')    // ['HTML', 'Editor']
 * splitPascalCase('ID')            // ['ID']
 * splitPascalCase('Account_Number') // ['Account', 'Number']
 */
export function splitPascalCase(name: string): string[] {
  if (name === '') return [''];
  if (name.includes('_')) return name.split('_');
  return name.replace(/([a-z])([A-Z])/g, '$1\0$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1\0$2').split('\0');
}

/**
 * Convert a PascalCase field name to underscore-separated v4 field name.
 *
 * @example
 * toV4FieldName('AccountNumber') // 'Account_number'
 * toV4FieldName('AltPhone')      // 'Alt_phone'
 * toV4FieldName('ID')            // 'ID'
 */
export function toV4FieldName(fieldName: string): string {
  const words = splitPascalCase(fieldName);
  return words.map((word, i) => (i === 0 ? word : word.toLowerCase())).join('_');
}

/**
 * Convert a PascalCase field name to a human-readable v4 field label.
 *
 * @example
 * toV4FieldLabel('AccountNumber') // 'Account number'
 * toV4FieldLabel('HTMLEditor')    // 'HTML editor'
 * toV4FieldLabel('ID')            // 'ID'
 */
export function toV4FieldLabel(fieldName: string): string {
  const words = splitPascalCase(fieldName);
  return words.map((word, i) => (i === 0 ? word : word.toLowerCase())).join(' ');
}
