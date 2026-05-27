/**
 * Structure Converters - Hybrid Approach
 *
 * These utilities handle conversion between:
 * - Flat structure (internal processing) - uses containerId references
 * - Nested structure (API communication) - hierarchical with content arrays
 */

import type { ResponsiveComponent, WidgetType } from '../rgl-integration/types';
import { CurrentStateValue } from '@m-next/types';
import { buildReflowLookup, ReflowItem } from './layoutReflowCalculator';
import { getGridColumns, Resolution } from './responsive';
/** V4 Layout API structure - nested format for API communication */
export interface ResponsiveLayoutItem {
  id: string;
  containerId: string | null;
  desktop: {
    x: number;
    y: number;
    width: number;
    height: number;
    currentState: CurrentStateValue;
  };
  tabletOverride?: {
    x: number;
    y: number;
    width: number;
    height: number;
    currentState: CurrentStateValue;
  };
  mobileOverride?: {
    x: number;
    y: number;
    width: number;
    height: number;
    currentState: CurrentStateValue;
  };
  content: ResponsiveLayoutItem[]; // Nested children
}

export interface LayoutCanvas {
  canvasId: string | null;
  type: string;
  size: number;
  content: ResponsiveLayoutItem[]; // Top-level components only
}

/**
 * Builds nested V4 structure with responsive override preservation AND nested children
 * This is the enhanced version that solves the "content: []" problem by recursively building children
 */
export const buildNestedStructureWithResponsive = (
  flatComponents: ResponsiveComponent[],
  parentId: string | null,
  currentBreakpoint: string,
): ResponsiveLayoutItem[] => {
  // Filter components that belong to this parent level
  const childComponents = flatComponents.filter((component) => component.containerId === parentId);

  return childComponents.map((component) => {
    const existingResponsive = component.responsive || {
      desktop: undefined,
      tabletOverride: undefined,
      mobileOverride: undefined,
    };

    const baseStructure: ResponsiveLayoutItem = {
      id: component.id,
      // 🔧 CRITICAL: Preserve containerId - backend uses BOTH containerId AND nesting
      // This is a hybrid structure: flat (via containerId) AND hierarchical (via content arrays)
      containerId: component.containerId,
      desktop: {
        x: currentBreakpoint === 'desktop' ? component.x : (existingResponsive.desktop?.x ?? component.x),
        y: currentBreakpoint === 'desktop' ? component.y : (existingResponsive.desktop?.y ?? component.y),
        width:
          currentBreakpoint === 'desktop' ? component.width : (existingResponsive.desktop?.width ?? component.width),
        height:
          currentBreakpoint === 'desktop' ? component.height : (existingResponsive.desktop?.height ?? component.height),
        currentState:
          currentBreakpoint === 'desktop'
            ? component.currentState
            : (existingResponsive.desktop?.currentState ?? component.currentState),
      },
      // 🔧 CRITICAL: Recursively build nested children (not empty array!)
      content: buildNestedStructureWithResponsive(flatComponents, component.id, currentBreakpoint),
    };

    // Save the new component position into the active breakpoint's override.
    // Other breakpoints are preserved unchanged from existingResponsive.
    if (currentBreakpoint === 'tablet') {
      baseStructure.tabletOverride = {
        x: component.x,
        y: component.y,
        width: component.width,
        height: component.height,
        currentState: existingResponsive.tabletOverride?.currentState ?? component.currentState,
      };
      if (existingResponsive.mobileOverride) {
        baseStructure.mobileOverride = { ...existingResponsive.mobileOverride };
      }
    } else if (currentBreakpoint === 'mobile') {
      baseStructure.mobileOverride = {
        x: component.x,
        y: component.y,
        width: component.width,
        height: component.height,
        currentState: existingResponsive.mobileOverride?.currentState ?? component.currentState,
      };
      if (existingResponsive.tabletOverride) {
        baseStructure.tabletOverride = { ...existingResponsive.tabletOverride };
      }
    } else {
      // Desktop: preserve both overrides unchanged
      if (existingResponsive.tabletOverride) {
        baseStructure.tabletOverride = { ...existingResponsive.tabletOverride };
      }
      if (existingResponsive.mobileOverride) {
        baseStructure.mobileOverride = { ...existingResponsive.mobileOverride };
      }
    }

    return baseStructure;
  });
};

/**
 * Converts flat component structure to nested API structure
 * Used when saving to backend API
 */
export const buildNestedStructure = (
  flatComponents: ResponsiveComponent[],
  parentId: string | null = null,
): ResponsiveLayoutItem[] => {
  // Filter components that belong to this parent level
  const childComponents = flatComponents.filter((component) => component.containerId === parentId);

  return childComponents.map((component) => ({
    id: component.id,
    containerId: component.containerId,
    desktop: {
      x: component.x,
      y: component.y,
      width: component.width,
      height: component.height,
      // ComponentState enum: 0=Regular, 1=Hidden, 2=Disabled, 3=ReadOnly
      currentState: component.currentState,
    },
    tabletOverride: undefined,
    mobileOverride: undefined,
    // Recursively build nested children
    content: buildNestedStructure(flatComponents, component.id),
  }));
};

/**
 * Converts nested API structure to flat component structure
 * Used when loading from backend API
 */
export const flattenNestedStructure = (
  nestedItems: ResponsiveLayoutItem[],
  parentContainerId: string | null = null,
  display: string = 'desktop', // 'desktop', 'tablet', 'mobile'
): ResponsiveComponent[] => {
  const result: ResponsiveComponent[] = [];
  const traverse = (items: ResponsiveLayoutItem[], currentParentId: string | null) => {
    items.forEach((item) => {
      let responsiveData = item.desktop;
      if (display === 'tablet' && item.tabletOverride) {
        responsiveData = item.tabletOverride;
      } else if (display === 'mobile' && item.mobileOverride) {
        responsiveData = item.mobileOverride;
      }
      // Add the current item as a flat component
      // Ensure numeric values are numbers, not strings (API may return strings)
      const flatComponent: ResponsiveComponent = {
        id: item.id,
        type: 'UNKNOWN' as WidgetType, // Will be resolved from controls
        x: Number(responsiveData.x),
        y: Number(responsiveData.y),
        width: Number(responsiveData.width),
        height: Number(responsiveData.height),
        content: `Component ${item.id.slice(-8)}`,
        currentState: responsiveData.currentState,
        // Use item.containerId from backend (hybrid structure)
        // Backend sends BOTH containerId property AND nested structure
        // item.containerId is the source of truth - don't rebuild from tree traversal
        containerId: item.containerId ?? currentParentId,
        static: false,
        // @ts-ignore
        responsive: { desktop: item.desktop, tabletOverride: item.tabletOverride, mobileOverride: item.mobileOverride },
      };

      result.push(flatComponent);

      // Recursively process nested children
      if (item.content && item.content.length > 0) {
        traverse(item.content, item.id);
      }
    });
  };

  traverse(nestedItems, parentContainerId);
  return result;
};

/**
 * Extracts flat components from LayoutCanvas after API load
 */
export const extractFlatComponents = (
  layoutCanvas: LayoutCanvas,
  resolution: string = 'desktop',
): ResponsiveComponent[] => {
  if (!layoutCanvas?.content) {
    return [];
  }
  const result = flattenNestedStructure(layoutCanvas.content, null, resolution);

  // NCNG-831: Apply reflow for tablet/mobile when components lack saved overrides.
  // flattenNestedStructure falls back to desktop positions, which causes overlaps
  // when rendered in a smaller column grid (8 or 4 cols instead of 12).
  if (resolution === 'tablet' || resolution === 'mobile') {
    const sourceCols = getGridColumns('desktop'); // 12
    const targetCols = getGridColumns(resolution as Resolution);

    // Collect items that need reflow (no saved override for this resolution)
    const needsReflow: (ReflowItem & { containerId: string | null })[] = [];
    for (let i = 0; i < result.length; i++) {
      const comp = result[i];
      if (!comp) continue;
      const responsive = comp.responsive;
      const hasOverride =
        resolution === 'tablet'
          ? !!(responsive && responsive.tabletOverride)
          : !!(responsive && responsive.mobileOverride);
      if (!hasOverride) {
        needsReflow.push({
          id: comp.id,
          x: comp.x,
          y: comp.y,
          width: comp.width,
          height: comp.height,
          containerId: comp.containerId ?? null,
        });
      }
    }

    if (needsReflow.length > 0) {
      const lookup = buildReflowLookup(
        needsReflow,
        (item) => (item as ReflowItem & { containerId: string | null }).containerId,
        sourceCols,
        targetCols,
      );

      // Apply reflowed positions back to the result array
      for (let i = 0; i < result.length; i++) {
        const original = result[i];
        if (!original) continue;
        const reflowed = lookup.get(original.id);
        if (reflowed) {
          result[i] = { ...original, x: reflowed.x, y: reflowed.y, width: reflowed.width, height: reflowed.height };
        }
      }
    }
  }

  return result;
};

/**
 * Debug utility to validate structure consistency
 */
export const validateStructureConsistency = (
  components: ResponsiveComponent[],
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  const componentIds = new Set(components.map((c) => c.id));

  // Check for orphaned components (containerId references non-existent container)
  components.forEach((component) => {
    if (component.containerId && !componentIds.has(component.containerId)) {
      issues.push(`Component ${component.id} references non-existent container ${component.containerId}`);
    }
  });

  // Check for circular references
  const visited = new Set<string>();
  const checkCircular = (componentId: string, path: Set<string>): boolean => {
    if (path.has(componentId)) {
      issues.push(`Circular reference detected in path: ${Array.from(path).join(' -> ')} -> ${componentId}`);
      return true;
    }

    if (visited.has(componentId)) {
      return false; // Already checked this branch
    }

    visited.add(componentId);
    const component = components.find((c) => c.id === componentId);
    if (component?.containerId) {
      const newPath = new Set(path);
      newPath.add(componentId);
      return checkCircular(component.containerId, newPath);
    }

    return false;
  };

  components.forEach((component) => {
    if (!visited.has(component.id)) {
      checkCircular(component.id, new Set());
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
};
