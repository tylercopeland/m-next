/**
 * Layout data mapping utilities.
 *
 * Pure functions that transform backend layout/control data into
 * ResponsiveComponent[] consumed by LayoutCanvas.
 *
 * Extracted from LayoutCanvasWrapper to satisfy SRP.
 */
import { ResponsiveComponent } from '@m-next/layout-canvas';
import { WIDGETS } from '@m-next/runtime-interface';
import { CurrentState } from '@m-next/types';
import { getCustomComponentSize } from '@m-next/layout-canvas/src/utils/componentSizing';
import {
  extractFlatComponents,
  ResponsiveLayoutItem as V4ResponsiveLayoutItem,
  LayoutCanvas as V4LayoutCanvas,
} from '@m-next/layout-canvas/src/utils/structureConverters';
import { getHiddenState, getDisabledState, Resolution } from '@m-next/layout-canvas/src/utils/currentStateHelper';
import { getGridColumns } from '@m-next/layout-canvas/src/utils/responsive';
import { buildReflowLookup } from '@m-next/layout-canvas';
import type { ReflowItem } from '@m-next/layout-canvas';
import { mapToWidgetType, shouldRenderItem } from './widgetTypeMapping';

// ---------------------------------------------------------------------------
// Shared type definitions
// ---------------------------------------------------------------------------

/** Layout entry structure from the existing App Builder */
export interface LayoutEntry {
  /** Size of the component */
  size?: number;
  /** Control ID */
  controlId?: string;
  /** Component type */
  type?: string;
  /** Content for the component */
  content?: string;
}

/** Layout object structure */
export interface Layout {
  /** Array of layout entries */
  entries?: LayoutEntry[];
}

/** Control object structure from Redux */
export interface Control {
  /** Control ID */
  id: string;
  /** Control type */
  type?: string;
  /** Control caption/content */
  caption?: string;
  /** Temporary lock timestamp for dimension changes (used during type override changes) */
  __dimensionsLockedUntil?: number;
  /** Other control properties */
  [key: string]: unknown;
}

/** Controls dictionary from Redux */
export interface Controls {
  [controlId: string]: Control;
}

/** ResponsiveLayoutItem from V4 Layout API */
export type ResponsiveLayoutItem = V4ResponsiveLayoutItem;

/** LayoutCanvas structure from V4 Layout API */
export type LayoutCanvas = V4LayoutCanvas;

// ---------------------------------------------------------------------------
// mapLayoutToComponents — legacy layout entries → ResponsiveComponent[]
// ---------------------------------------------------------------------------

/**
 * Maps layout entries to ResponsiveComponent format expected by LayoutCanvas
 */
export const mapLayoutToComponents = (layout?: Layout): ResponsiveComponent[] => {
  if (!layout || !layout.entries || layout.entries.length === 0) {
    return [];
  }

  return layout.entries
    .filter((c) => shouldRenderItem(c.type))
    .map((entry, index): ResponsiveComponent => {
      const componentId = entry.controlId || `component-${index}`;

      return {
        id: componentId,
        type: mapToWidgetType(entry.type),
        x: (index % 12) * 2, // Simple grid positioning - will be enhanced
        y: Math.floor(index / 6) * 2,
        width: entry.size || 2,
        height: 2,
        content: entry.content || entry.type || 'Component',
        currentState: CurrentState.REGULAR,
        containerId: null,
        static: false,
      };
    });
};

// ---------------------------------------------------------------------------
// mapControlsToComponents — Redux controls → ResponsiveComponent[]
// ---------------------------------------------------------------------------

/**
 * Maps controls from Redux to ResponsiveComponent format expected by LayoutCanvas.
 * Uses saved position/size data from controls when available.
 */
export const mapControlsToComponents = (controls?: Controls, includeNestedComponents = true): ResponsiveComponent[] => {
  if (!controls || Object.keys(controls).length === 0) {
    return [];
  }

  const controlEntries = Object.values(controls);

  return controlEntries
    .filter(c => shouldRenderItem(c.type, c))
    // filter out nested components from main canvas when includeNestedComponents = false
    .filter(c => includeNestedComponents || !c.containerId)
    .map((control, index): ResponsiveComponent => {

    const componentType = mapToWidgetType(control.type, control);
    const customSize = getCustomComponentSize(componentType);
    // Use saved position/size data if available, fallback to defaults
    const hasSavedPosition = typeof control.x === 'number' && typeof control.y === 'number';
    const hasSavedSize = typeof control.width === 'number' && typeof control.height === 'number';

    // Use mapToWidgetType to handle typeOverride consistently
    // This ensures typeOverride (like TXT->HTM) is respected during initial load
    const widgetType = mapToWidgetType(control.type, control);

    return {
      id: control.id, // Use the actual control ID
      type: widgetType, // Use consistently mapped widget type that respects typeOverride
      // Use saved position if available, otherwise use fallback
      x: hasSavedPosition ? (control.x as number) : (index % 12) * 2,
      y: hasSavedPosition ? (control.y as number) : Math.floor(index / 6) * 2,
      // Use saved size if available, otherwise use defaults
      width: hasSavedSize ? (control.width as number) : customSize.width,
      height: hasSavedSize ? (control.height as number) : customSize.height,
      content: String(control.caption || control.content || control.type || 'Component'),
      name: String(control.name || control.caption || control.content || 'Component'),
      // Use saved visibility state if available
      currentState: CurrentState.REGULAR,
      containerId: (typeof control.containerId === 'string' ? control.containerId : null),
      static: false,
    };
  });
};

// ---------------------------------------------------------------------------
// buildNestedLookup — helper for V4 nested layout items
// ---------------------------------------------------------------------------

/**
 * Helper to get nested ResponsiveLayoutItem structure with breakpoint data.
 * Needed to access tabletOverride and mobileOverride which aren't in the flat structure.
 */
export const buildNestedLookup = (items: ResponsiveLayoutItem[]): Map<string, ResponsiveLayoutItem> => {
  const lookup = new Map<string, ResponsiveLayoutItem>();

  const traverse = (currentItems: ResponsiveLayoutItem[]) => {
    currentItems.forEach((item) => {
      lookup.set(item.id, item);
      if (item.content && item.content.length > 0) {
        traverse(item.content);
      }
    });
  };

  traverse(items);
  return lookup;
};

// ---------------------------------------------------------------------------
// mapLayoutV4ToComponents — V4 LayoutCanvas → ResponsiveComponent[]
// ---------------------------------------------------------------------------

/**
 * V4 LAYOUT API: Maps LayoutV4 ResponsiveLayoutItems to ResponsiveComponent format.
 * HYBRID APPROACH: Uses structure converter utilities.
 */
export const mapLayoutV4ToComponents = (
  layoutCanvas?: LayoutCanvas,
  controls?: Controls,
  resolution?: string,
  reduxControls?: Controls,
  canvasComponents?: ResponsiveComponent[],
  gridColumns: number = 12,
): ResponsiveComponent[] => {
  if (!layoutCanvas || !layoutCanvas.content || layoutCanvas.content.length === 0) {
    return [];
  }

  // Use the new hybrid approach to flatten the structure
  const flatComponents = extractFlatComponents(layoutCanvas, resolution);

  // Merge containerId from canvasComponents (most up-to-date!)
  // canvasComponents is synchronously updated by handleComponentsChange, so it has the latest values
  // Redux dispatch is async, so reduxControls may lag behind
  const componentsWithMergedContainerId = flatComponents.map((flatComp) => {
    const reduxControl = reduxControls?.[flatComp.id];
    const canvasComponent = canvasComponents?.find(c => c.id === flatComp.id);
    // Use canvasComponents first (highest priority - synchronously updated)
    if (canvasComponent && typeof canvasComponent.containerId === 'string') {
      return {
        ...flatComp,
        responsive: {...canvasComponent.responsive},
        containerId: canvasComponent.containerId
      };
    }
    if (canvasComponent && canvasComponent.containerId === null) {
      // canvasComponents explicitly has null containerId - use it
      return {
        ...flatComp,
        responsive: {...canvasComponent.responsive},
        containerId: null
      };
    }

    // Fallback to Redux if canvasComponents doesn't have the component
    if (reduxControl && typeof reduxControl.containerId === 'string') {
      return {
        ...flatComp,
        containerId: reduxControl.containerId,
      };
    }
    if (reduxControl && reduxControl.containerId === null) {
      return {
        ...flatComp,
        containerId: null,
      };
    }

    // No source has containerId - use layoutV4 value
    return flatComp;
  });

  // Build lookup for accessing breakpoint override data from nested structure
  const nestedLookup = buildNestedLookup(layoutCanvas.content);

  // Pre-compute reflow lookup for tablet/mobile fallback (whole-layout algorithm).
  // Only built when the resolution requires a fallback (no saved override for some items).
  // Using desktop positions of all items as the source, grouped by container scope.
  const desktopReflowItems: (ReflowItem & { containerId: string | null })[] = componentsWithMergedContainerId.map(
    (flatComp) => {
      const nestedItemForReflow = nestedLookup.get(flatComp.id);
      const desktopPos = nestedItemForReflow?.desktop || {
        x: flatComp.x,
        y: flatComp.y,
        width: flatComp.width,
        height: flatComp.height,
      };
      return {
        id: flatComp.id,
        x: desktopPos.x,
        y: desktopPos.y,
        width: desktopPos.width,
        height: desktopPos.height,
        containerId: flatComp.containerId ?? null,
      };
    },
  );

  // Determine source (desktop=12) and target column counts for the current resolution
  const sourceColumns = getGridColumns('desktop'); // 12
  const targetColumns = gridColumns; // 8 for tablet, 4 for mobile (passed in or defaulted)

  // Build the reflow lookup keyed by component id (grouped by containerId scope)
  const reflowLookup =
    resolution === 'tablet' || resolution === 'mobile'
      ? buildReflowLookup(
          desktopReflowItems,
          (item) => (item as ReflowItem & { containerId: string | null }).containerId,
          sourceColumns,
          targetColumns,
        )
      : null;


  // Enhance flat components with control data, proper widget types, and breakpoint-specific positioning
  const enhancedComponents = componentsWithMergedContainerId.map((flatComp): ResponsiveComponent => {
    const control = controls?.[flatComp.id];
    const nestedItem = nestedLookup.get(flatComp.id);

    // Get breakpoint data from nested structure
    const desktop = nestedItem?.desktop || {
      x: flatComp.x,
      y: flatComp.y,
      width: flatComp.width,
      height: flatComp.height,
      currentState: flatComp.currentState
    };
    const tabletOverride = nestedItem?.tabletOverride;
    const mobileOverride = nestedItem?.mobileOverride;

    // Get current breakpoint position.
    // When a saved override exists, use it directly.
    // When falling back to desktop positions for a smaller breakpoint, use the
    // whole-layout reflow algorithm (prevents overlaps and disappearing components).
    const getCurrentBreakpointPosition = () => {
      switch (resolution) {
        case 'tablet':
          if (tabletOverride) {
            return tabletOverride;
          }
          // Fall back to reflowed desktop position
          return reflowLookup?.get(flatComp.id) ?? desktop;
        case 'mobile':
          if (mobileOverride) {
            return mobileOverride;
          }
          // Fall back to reflowed desktop position
          return reflowLookup?.get(flatComp.id) ?? desktop;
        default:
          return desktop;
      }
    };

    const currentPosition = getCurrentBreakpointPosition();

    // Determine if this is a container (has nested children)
    const isContainer = nestedItem?.content && nestedItem.content.length > 0;
    const fallbackType = isContainer ? WIDGETS.LAYOUT_CONTAINER : WIDGETS.BUTTON;

    // Build responsive overrides using FRESH V4 data directly
    // Don't filter based on differences - always include all breakpoint data that exists
    const responsive: ResponsiveComponent['responsive'] = {
      desktop: {
        id: flatComp.id,
        type: control?.type ? mapToWidgetType(control.type as string, control) : fallbackType,
        x: desktop.x,
        y: desktop.y,
        width: desktop.width,
        height: desktop.height,
        content: (control?.caption as string) || (control?.content as string) || `Component ${flatComp.id.slice(-8)}`,
        currentState: desktop.currentState,
        containerId: flatComp.containerId,
        static: false,
      },
    };

    // Always include tablet override if it exists (using FRESH V4 data)
    if (tabletOverride) {
      responsive.tabletOverride = {
        id: flatComp.id,
        type: control?.type ? mapToWidgetType(control.type as string, control) : fallbackType,
        x: tabletOverride.x,
        y: tabletOverride.y,
        width: tabletOverride.width,
        height: tabletOverride.height,
        content: (control?.caption as string) || (control?.content as string) || `Component ${flatComp.id.slice(-8)}`,
        currentState: tabletOverride.currentState,
        containerId: flatComp.containerId,
        static: false,
      };
    }

    // Always include mobile override if it exists (using FRESH V4 data)
    if (mobileOverride) {
      responsive.mobileOverride = {
        id: flatComp.id,
        type: control?.type ? mapToWidgetType(control.type as string, control) : fallbackType,
        x: mobileOverride.x,
        y: mobileOverride.y,
        width: mobileOverride.width,
        height: mobileOverride.height,
        content: (control?.caption as string) || (control?.content as string) || `Component ${flatComp.id.slice(-8)}`,
        currentState: mobileOverride.currentState,
        containerId: flatComp.containerId,
        static: false,
      };
    }

    // Derive currentState from control and responsive data
    const responsiveData = {
      desktop,
      tabletOverride,
      mobileOverride,
    };
    // TODO: change top-level type
    const isHidden = getHiddenState(control ?? {}, responsiveData, (resolution ?? 'desktop') as Resolution, 'designer');
    const isDisabled = getDisabledState(control ?? {}, responsiveData, (resolution ?? 'desktop') as Resolution, 'designer');

    // Convert derived state back to CurrentState enum
    let derivedCurrentState = CurrentState.REGULAR;
    if (isHidden) {
      derivedCurrentState = CurrentState.HIDDEN;
    } else if (isDisabled) {
      derivedCurrentState = CurrentState.DISABLED;
    }

    return {
      id: flatComp.id,
      type: control?.type ? mapToWidgetType(control.type as string, control) : fallbackType,
      // Use current breakpoint position for rendering
      x: currentPosition.x,
      y: currentPosition.y,
      width: currentPosition.width,
      height: currentPosition.height,
      content: (control?.caption as string) || (control?.content as string) || `Component ${flatComp.id.slice(-8)}`,
      name: control?.name as string,
      // Use derived currentState based on control and responsive data
      currentState: derivedCurrentState,
      containerId: flatComp.containerId, // Properly set by extractFlatComponents based on nesting
      static: false,
      // Include responsive overrides
      responsive: Object.keys(responsive).length > 0 ? responsive : undefined,
      // Pass through validation state from control
      isBound: control?.isBound as boolean,
      value: control?.value as string | null | undefined,
      validationError: control?.validationError as string | null | undefined,
    };
  });

  return enhancedComponents;
};
