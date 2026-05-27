/**
 * Shared utility for converting Redux controls to ResponsiveComponent format
 * Used for name uniqueness checking across the codebase
 */

import { ResponsiveComponent, WidgetType, mapWidgetToControlType, getDisplayRestrictionsFromRegistry } from '@m-next/layout-canvas';

/**
 * Control object structure (flexible for Redux compatibility)
 * Made compatible with BaseControl from @m-next/runtime-interface
 */
interface ControlData {
  id: string;
  Type?: string;
  type?: string | null;
  name?: string;
  content?: string;
  caption?: string;
  x?: number | string | null;
  y?: number | string | null;
  width?: number | string | null;
  height?: number | string | null;
  visible?: boolean;
  containerId?: string | null;
}
/**
 * Convert Redux controls to ResponsiveComponent format for naming checks
 * Used across the codebase to ensure consistent name checking
 *
 * @param controls - Redux controls map (compatible with BaseControl or ControlData)
 * @returns Array of ResponsiveComponent objects suitable for name checking
 */
export const convertControlsToComponents = (controls?: Record<string, ControlData> | Record<string, unknown>): ResponsiveComponent[] => {
  if (!controls) return [];

  return Object.values(controls)
    .filter((control): control is ControlData => {
      // Type guard to ensure control has required properties
      if (typeof control !== 'object' || control === null) return false;
      if (!('id' in control)) return false;

      const hasType = ('Type' in control && control.Type) || ('type' in control && control.type);
      return Boolean(hasType);
    })
    .map((control) => {
      // Get default height from registry if control has no height specified
      const widgetType = (control.Type || control.type) as WidgetType;
      const controlType = mapWidgetToControlType(String(widgetType));
      const restrictions = controlType ? getDisplayRestrictionsFromRegistry(controlType) : null;
      const defaultHeight = restrictions?.defaultHeight || 1;

      return {
        id: control.id,
        type: widgetType, // Cast to WidgetType since we filtered out null/undefined
        // Each field has its own distinct value - no fallback chains
        name: control.name, // Unique identifier (source of truth)
        content: control.content || '', // Legacy field (should mirror name) - provide default empty string for GridComponent requirement
        caption: control.caption, // User-friendly label
        x: Number(control.x) || 0,
        y: Number(control.y) || 0,
        width: Number(control.width) || 1,
        height: Number(control.height) || defaultHeight, // ✅ Use defaultHeight from registry instead of hardcoded 1
        isHidden: !control.visible,
        containerId: control.containerId ?? null, // 🔧 Preserve containerId from Redux control
        static: false,
      };
    });
};
