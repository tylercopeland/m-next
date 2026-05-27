import { WidgetType } from '../rgl-integration/types';
import { mapWidgetToControlType, getDisplayRestrictionsFromRegistry } from '../registry/registryUtils';

/**
 * Gets custom default size for a component type from the local registry utilities
 * This centralizes sizing logic to ensure consistency across the application
 */
export const getCustomComponentSize = (componentType: WidgetType): { width: number; height: number } => {
  // Map widget type to control type using local registry utils (no app-builder dependency!)
  const controlType = mapWidgetToControlType(String(componentType));

  if (!controlType) {
    return { width: 3, height: 2 }; // Default for unknown components
  }

  // Get display restrictions from the local registry
  const restrictions = getDisplayRestrictionsFromRegistry(controlType);

  if (!restrictions) {
    return { width: 3, height: 2 }; // Default if no config found
  }

  const { defaultWidth = 3, defaultHeight = 2 } = restrictions;

  return { width: defaultWidth, height: defaultHeight };
};
