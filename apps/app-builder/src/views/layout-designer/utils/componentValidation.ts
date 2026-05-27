/**
 * Component validation utilities.
 *
 * Consolidates the 5x duplicated validation checks from LayoutCanvasWrapper
 * into a single reusable function.
 */
import { WIDGETS } from '@m-next/runtime-interface';
import { WidgetType } from '@m-next/layout-canvas';

interface ValidatableComponent {
  type: WidgetType;
  isBound?: boolean;
  value?: string | null;
}

interface ValidatableControl {
  model?: unknown;
  [key: string]: unknown;
}

/**
 * Computes a validation error message for a component based on its type
 * and associated control data.
 *
 * Returns null if the component is valid.
 */
export const computeValidationError = (
  component: ValidatableComponent,
  control?: ValidatableControl | null,
): string | null => {
  if (component.type === WIDGETS.DROPDOWN && control) {
    const hasError = !(
      control.model &&
      typeof control.model === 'object' &&
      'viewName' in control.model &&
      (control.model as Record<string, unknown>).viewName
    );
    return hasError ? 'Table not configured' : null;
  }

  if (component.type === WIDGETS.PICTURE) {
    const hasError = !(component.isBound || component.value);
    return hasError ? 'Image source not configured' : null;
  }

  if (component.type === WIDGETS.GALLERY && control) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasError = !(control.model as any)?.imageField;
    return hasError ? 'Gallery not configured' : null;
  }

  return null;
};
