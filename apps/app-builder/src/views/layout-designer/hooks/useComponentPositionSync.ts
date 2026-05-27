/**
 * Hook that manages canvas component state synchronization.
 *
 * Extracted from LayoutCanvasWrapper.tsx to reduce file size and isolate:
 * - Canvas component state management
 * - External data sync (layoutV4, controls, Redux → canvas components)
 * - Initial load protection (prevents auto-save during mount)
 * - Debounce timer management for component updates
 */
import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveComponent } from '@m-next/layout-canvas';
import {
  mapLayoutV4ToComponents,
  mapLayoutToComponents,
  mapControlsToComponents,
  Control,
  Controls,
  LayoutCanvas,
  Layout,
} from '../utils/layoutDataMappers';
import { UnifiedControlRegistry, mapWidgetToControlType } from '../unified-control-registry';
import { computeValidationError } from '../utils/componentValidation';

declare function setTimeout(callback: () => void, delay: number): NodeJS.Timeout;
declare function clearTimeout(timeoutId: NodeJS.Timeout | null): void;

/**
 * Returns true if any item in the layoutV4 tree has a changed currentState
 * compared to the previous version. Used to bypass the drag-guard when the
 * RHP changes a component's defaultState — a property edit that must always
 * propagate to the canvas regardless of recent drag activity.
 */
function hasLayoutV4CurrentStateChanges(newLayout?: LayoutCanvas, oldLayout?: LayoutCanvas): boolean {
  if (!newLayout || !oldLayout) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkItems = (newItems: any[], oldItems: any[]): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldMap = new Map(oldItems.map((item: any) => [item.id, item]));
    for (const newItem of newItems) {
      const oldItem = oldMap.get(newItem.id);
      if (!oldItem) continue;
      if (newItem.desktop?.currentState !== oldItem.desktop?.currentState) return true;
      if (newItem.tabletOverride?.currentState !== oldItem.tabletOverride?.currentState) return true;
      if (newItem.mobileOverride?.currentState !== oldItem.mobileOverride?.currentState) return true;
      if (newItem.content?.length && oldItem.content?.length) {
        if (checkItems(newItem.content, oldItem.content)) return true;
      }
    }
    return false;
  };
  return checkItems(newLayout.content || [], oldLayout.content || []);
}

interface UseComponentPositionSyncParams {
  /** Pre-computed initial components from the useMemo in LayoutCanvasWrapper */
  initialComponents: ResponsiveComponent[];
  /** V4 layout data structure */
  layoutV4?: LayoutCanvas;
  /** Legacy layout structure */
  layout?: Layout;
  /** Controls from props */
  controls?: Controls;
  /** Controls from Redux (more up-to-date) */
  reduxControls: Controls;
  /** Current resolution breakpoint */
  resolution: string;
  /** Grid column count */
  gridColumns: number;
}

interface UseComponentPositionSyncReturn {
  /** Current canvas components array */
  canvasComponents: ResponsiveComponent[];
  /** Setter for canvas components */
  setCanvasComponents: React.Dispatch<React.SetStateAction<ResponsiveComponent[]>>;
  /** Whether the component is in initial load period (prevents auto-save) */
  isInitialLoad: boolean;
  /** Ref tracking when handleComponentsChange last ran (prevents useEffect overwrite) */
  handleComponentsChangeTimeRef: React.MutableRefObject<number>;
  /** Ref for debounced component update timeout */
  componentUpdateTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  /** Ref for last components (deduplication) */
  lastComponentsRef: React.MutableRefObject<ResponsiveComponent[]>;
}

export function useComponentPositionSync({
  initialComponents,
  layoutV4,
  layout,
  controls,
  reduxControls,
  resolution,
  gridColumns,
}: UseComponentPositionSyncParams): UseComponentPositionSyncReturn {
  // State for managing components in the canvas
  const [canvasComponents, setCanvasComponents] = useState<ResponsiveComponent[]>(initialComponents);

  // Performance tracking refs
  const lastDataRef = useRef<{
    layoutV4?: LayoutCanvas;
    layout?: Layout;
    controls?: Controls;
    components?: ResponsiveComponent[];
  }>({});

  const controlsChangedTimeRef = useRef<number>(0);
  const handleComponentsChangeTimeRef = useRef<number>(0);
  const lastResolutionRef = useRef<string>(resolution);

  // Prevent auto-save during initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Debounce ref for component updates
  const componentUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastComponentsRef = useRef<ResponsiveComponent[]>([]);

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (componentUpdateTimeoutRef.current) {
        clearTimeout(componentUpdateTimeoutRef.current);
      }
    },
    [],
  );

  // Sync from external data sources (layoutV4, controls, Redux) to canvas components
  useEffect(() => {
    const currentData = { layoutV4, layout, controls, reduxControls };
    const lastData = lastDataRef.current;

    // Deep comparison to check if data actually changed
    const hasLayoutV4Changed = JSON.stringify(currentData.layoutV4) !== JSON.stringify(lastData.layoutV4);
    const hasLayoutChanged = JSON.stringify(currentData.layout) !== JSON.stringify(lastData.layout);
    const hasControlsChanged = JSON.stringify(currentData.controls) !== JSON.stringify(lastData.controls);
    const hasReduxControlsChanged =
      JSON.stringify(currentData.reduxControls) !== JSON.stringify((lastData as typeof currentData).reduxControls);

    // Track resolution changes separately
    const hasResolutionChanged = resolution !== lastResolutionRef.current;
    if (hasResolutionChanged) {
      lastResolutionRef.current = resolution;
    }

    if (
      !hasLayoutV4Changed &&
      !hasLayoutChanged &&
      !hasControlsChanged &&
      !hasReduxControlsChanged &&
      !hasResolutionChanged
    ) {
      return;
    }

    // Don't override if handleComponentsChange just ran (within 1000ms)
    // EXCEPT when resolution changes, new items exist, or dimensions are locked
    const timeSinceHandleComponentsChange = Date.now() - handleComponentsChangeTimeRef.current;

    // Check if there are new items in layoutV4 that aren't in canvasComponents.
    // Must check recursively since duplicated container children are nested inside their parent's content.
    const canvasIds = new Set(canvasComponents.map((c) => c.id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasNewItemInTree = (items: any[]): boolean =>
      items.some((item) => !canvasIds.has(item.id) || (item.content?.length > 0 && hasNewItemInTree(item.content)));
    const hasNewLayoutItems = (layoutV4?.content && hasNewItemInTree(layoutV4.content)) || false;

    // Check if any control has locked dimensions (editor just changed them)
    const hasLockedDimensions = Object.values(reduxControls).some(
      (ctrl: Control) => ctrl.__dimensionsLockedUntil && ctrl.__dimensionsLockedUntil > Date.now(),
    );

    // Check if layoutV4 changed specifically in currentState fields (RHP property edit).
    // Drag operations only change x/y/width/height, never currentState, so this is safe
    // to use as a bypass condition: property edits must always reach the canvas regardless
    // of recent drag activity.
    const hasCurrentStateChange = hasLayoutV4Changed && hasLayoutV4CurrentStateChanges(layoutV4, lastData.layoutV4 as LayoutCanvas | undefined);

    // Check if any control's containerId changed externally in Redux (vs props).
    // When Redux is updated directly (e.g. external eject), we must bypass the drag guard
    // so the canvas is updated before LayoutCanvas's 150ms layout timeout fires with stale data.
    const hasContainerIdChange =
      hasReduxControlsChanged &&
      controls != null &&
      Object.keys(reduxControls).some((id) => {
        const reduxCtrl = reduxControls[id];
        const propsCtrl = controls[id];
        return propsCtrl != null && reduxCtrl.containerId !== propsCtrl.containerId;
      });

    if (
      timeSinceHandleComponentsChange < 1500 &&
      !hasResolutionChanged &&
      !hasNewLayoutItems &&
      !hasLockedDimensions &&
      !hasCurrentStateChange &&
      !hasContainerIdChange
    ) {
      return;
    }

    // Mark when controls changed to detect external updates
    if (hasControlsChanged || hasReduxControlsChanged) {
      controlsChangedTimeRef.current = Date.now();
    }

    let newComponents: ResponsiveComponent[] = [];

    if (layoutV4) {
      newComponents = mapLayoutV4ToComponents(
        layoutV4,
        controls,
        resolution,
        reduxControls,
        canvasComponents,
        gridColumns,
      );
    } else if (layout && layout.entries && layout.entries.length > 0) {
      newComponents = mapLayoutToComponents(layout);
    } else {
      newComponents = mapControlsToComponents(controls) || [];
    }

    // Merge Redux updates when they differ from controls prop
    // Skip position merging when resolution changed — positions are breakpoint-specific
    newComponents = newComponents.map((component) => {
      const reduxControl = reduxControls[component.id];
      const propsControl = controls?.[component.id];

      if (reduxControl && propsControl) {
        const dimensionsLocked =
          reduxControl.__dimensionsLockedUntil && reduxControl.__dimensionsLockedUntil > Date.now();

        // When resolution changes, don't override x/y/width/height from Redux
        if (hasResolutionChanged) {
          return {
            ...component,
            containerId:
              reduxControl.containerId !== propsControl.containerId
                ? (reduxControl.containerId as string | null)
                : component.containerId,
          };
        }

        // Merge Redux values that differ from props
        return {
          ...component,
          x: reduxControl.x !== propsControl.x ? (reduxControl.x as number) : component.x,
          y: reduxControl.y !== propsControl.y ? (reduxControl.y as number) : component.y,
          containerId:
            reduxControl.containerId !== propsControl.containerId
              ? (reduxControl.containerId as string | null)
              : component.containerId,
          width: dimensionsLocked ? (reduxControl.width as number) : component.width,
          height: dimensionsLocked ? (reduxControl.height as number) : component.height,
        };
      }
      return component;
    });

    // Re-attach display restrictions and validation errors
    newComponents = newComponents.map((component) => {
      const controlType = mapWidgetToControlType(String(component.type));
      const restrictions = controlType ? UnifiedControlRegistry[controlType]?.displayRestrictions : undefined;

      const control = reduxControls?.[component.id] || controls?.[component.id];
      const validationError = computeValidationError(component, control);

      return {
        ...component,
        displayRestrictions: restrictions,
        validationError,
      };
    });
    // Only update canvas components if they actually changed
    const componentsChanged = JSON.stringify(newComponents) !== JSON.stringify(lastData.components);
    if (componentsChanged) {
      setCanvasComponents(newComponents);
      lastDataRef.current = { ...currentData, components: newComponents };
    }
  }, [layoutV4, layout, controls, resolution, reduxControls, canvasComponents, gridColumns]);

  return {
    canvasComponents,
    setCanvasComponents,
    isInitialLoad,
    handleComponentsChangeTimeRef,
    componentUpdateTimeoutRef,
    lastComponentsRef,
  };
}
