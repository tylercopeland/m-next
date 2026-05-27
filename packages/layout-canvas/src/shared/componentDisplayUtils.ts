import { colors } from '@m-next/styles';

// Widget type constants — using string literals to avoid coupling to a specific
// import source (@m-next/types vs @m-next/runtime-interface).
// Both packages define identical values for these constants.
const PICTURE = 'PIC';

const HEIGHT_RESIZABLE_WIDGETS: readonly string[] = [
  'CAL', // CALENDAR
  'CHT', // CHART
  'SEC', // SECTION
  'EDT', // DATATABLE
  'GAL', // GALLERY
  'HTM', // HTMLEDITOR
  'PIC', // PICTURE
  'MAP', // MAP
  'TXA', // TEXTAREA
  'L-CON', // LAYOUT_CONTAINER
  'LBL', // LABEL
];

/**
 * Returns the border/badge color based on component state.
 *
 * Priority: validation error (red) > selected (blue) > hovered (light blue)
 */
export function getHandleColor(hasValidationError: boolean, isSelected: boolean): string {
  if (hasValidationError) return colors.red || '#DA211E';
  if (isSelected) return colors.blue || '#0D71C8';
  return '#84C3F5';
}

/**
 * Returns the list of widget types that support height resizing.
 * Returns a stable reference (same array on each call).
 */
export function getHeightResizableWidgets(): readonly string[] {
  return HEIGHT_RESIZABLE_WIDGETS;
}

/**
 * Determines whether a component has a validation error that should be
 * visually indicated in the designer.
 *
 * Two cases produce a validation error:
 * 1. An explicit `validationError` string is set on the component.
 * 2. A PICTURE widget has no image value and is not bound to a data field.
 */
export function computeValidationError(component: {
  type: string;
  validationError?: string | null;
  isBound?: boolean | null;
  value?: unknown;
  defaultValue?: string;
}): boolean {
  // Case 1: explicit validation error string
  if (component.validationError && typeof component.validationError === 'string' && component.validationError.trim()) {
    return true;
  }

  // Case 2: PICTURE with no image value and not bound
  if (component.type === PICTURE) {
    const isBound = component.isBound ?? false;
    const imageValue = component.value || component.defaultValue;
    const hasImage = imageValue && typeof imageValue === 'string' && imageValue.trim();
    return !(isBound || hasImage);
  }

  return false;
}

/**
 * Determines the badge position relative to the component.
 *
 * - `'inside'`: near the top AND height-resizable — badge renders inside to
 *   avoid overlapping the resize handle above.
 * - `'bottom'`: near the top but NOT height-resizable — badge renders below.
 * - `'top'`: default — badge renders above the component.
 */
export function getBadgePosition(isNearTop: boolean): 'inside' | 'bottom' | 'top' {
  if (!isNearTop) return 'top';
  return 'bottom';
}
