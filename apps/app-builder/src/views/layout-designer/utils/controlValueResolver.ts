/**
 * Resolves defaultValue, defaultValueWrapper, and value for new controls.
 *
 * Consolidates the 3x duplicated conditional logic from LayoutCanvasWrapper
 * into a single pure function.
 */

/** Input control types that should get null values rather than caption text */
const INPUT_TYPES = ['TXT', 'EDT', 'DRP', 'CHK', 'TGL', 'DTP', 'TXA', 'TAG', 'HTM', 'SIG', 'ADR','PIC','SYW'];

/** Types where value must always be null (backend parse errors otherwise) */
const NULL_VALUE_TYPES = ['TXT', 'EDT', 'DRP', 'CHK', 'TGL', 'DTP', 'TXA', 'TAG', 'HTM', 'SIG', 'PIC', 'CAL', 'CHT', 'ADR','SYW'];

interface ComponentValues {
  defaultValue?: unknown;
  value?: unknown;
  content?: string;
}

interface ResolvedValues {
  defaultValue: unknown;
  defaultValueWrapper: unknown;
  value: unknown;
}


/**
 * Resolves the defaultValue, defaultValueWrapper, and value properties
 * for a newly created control.
 *
 * @param componentType - The widget type code (e.g., 'BTN', 'TXT', 'GAL')
 * @param component - The component data containing potential values
 * @param defaultCaption - The default caption for this widget type
 */
export function resolveControlValues(
  componentType: string,
  component: ComponentValues,
  defaultCaption: string,
): ResolvedValues {
  // Gallery must ALWAYS have null values — backend tries to parse as JSON
  if (componentType === 'GAL') {
    return { defaultValue: null, defaultValueWrapper: null, value: null };
  }

  // defaultValue and defaultValueWrapper share identical logic
  let resolvedDefault: unknown;
  if (INPUT_TYPES.includes(componentType)) {
    resolvedDefault = component.defaultValue ?? null;
  } else if (componentType === 'CAL' || componentType === 'CHT') {
    resolvedDefault = defaultCaption;
  } else {
    resolvedDefault = component.content || defaultCaption;
  } 

  // value has slightly different logic (respects component.value, more types get null)
  let resolvedValue: unknown;
  if (component.value !== undefined) {
    resolvedValue = component.value;
  } else if (NULL_VALUE_TYPES.includes(componentType)) {
    resolvedValue = null;
  } else {
    resolvedValue = component.content || defaultCaption;
  }

  return {
    defaultValue: resolvedDefault,
    defaultValueWrapper: resolvedDefault,
    value: resolvedValue,
  };
}
