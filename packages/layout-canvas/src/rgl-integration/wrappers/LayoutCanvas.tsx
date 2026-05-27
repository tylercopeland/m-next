import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { widgets as WIDGETS } from '@m-next/types';

import { LayoutCanvasWrapperProps, ResponsiveComponent, RGLLayoutItem, WidgetType } from '../types';
import { rglStateAdapter } from '../adapters/RGLStateAdapter';
import { GridVisualization } from '../visual-feedback/GridVisualization';
import { getHiddenState } from '../../utils/currentStateHelper';
import type { ContainerPropsContext } from '../../containers/utils/buildContainerProps';
import type { RuntimePropsContext } from '../../shared/buildWrapperProps';
import { useGridItemClassManager } from '../../hooks/useGridItemClassManager';
import { useCanvasDragState } from '../../hooks/useCanvasDragState';
import { HoverContext_Provider } from '../../contexts/HoverContext';
import { usePreemptiveEventHandlers } from '../../hooks/usePreemptiveEventHandlers';
import { useCanvasResizeHandler } from '../../hooks/useCanvasResizeHandler';
import { useCanvasDragHandler } from '../../hooks/useCanvasDragHandler';
import { useCanvasDropHandler } from '../../hooks/useCanvasDropHandler';
import * as s from './LayoutCanvas.styles';
import { ContainerManager } from '../../containers';
import { mapWidgetToControlType } from '../../registry/registryUtils';
import { CanvasItem } from '../../runtime/CanvasItem';
import { RuntimeLayoutProvider } from '../../runtime/RuntimeLayoutProvider';

// Vertical Push Calculator - for static layout mode resize
import { calculateResizePush, LayoutItem as PushLayoutItem } from '../../utils/verticalPushCalculator';

// Compaction Algorithm - for row-based visibility collapse and height growth
import { compact, simpleGrow } from '../../utils/compaction';
import {
  componentsToGridItems,
  buildDynamicData,
  applyCompactedLayout,
} from '../../utils/compaction/compactionAdapters';
import { mapHiddenToDynamic } from '../../utils/compaction/reverseMapping';
// Insert Indicator - visual feedback for insert mode
import { InsertIndicator } from '../../components/InsertIndicator';

// Enhanced width provider for our fixed canvas width
const ReactGridLayout = WidthProvider(RGL);

function isWidgetTypeInRegistry(
  widgetType: string,
  controlRegistry: LayoutCanvasWrapperProps['controlRegistry'],
): boolean {
  const controlType = mapWidgetToControlType(widgetType);
  return controlType ? controlRegistry[controlType] !== undefined : false;
}

const DYNAMIC_HEIGHT_TYPES = ['DOC', 'EDT', 'GAL', 'GRD', 'LBL', 'SIG', 'SYW', 'TAG', 'L-CON'];

/**
 * Main Layout Canvas component using React Grid Layout
 * Provides our component interface while using RGL as the layout engine
 *
 * HYBRID APPROACH: This component works with FLAT structure internally
 * - All components use containerId references (not nested content arrays)
 * - Conversion to/from nested API structure happens in parent components
 */
export const LayoutCanvas: React.FC<LayoutCanvasWrapperProps> = ({
  components,
  width,
  cols,
  rowHeight,
  controlRegistry,
  isDraggable = true,
  isResizable = true,
  onLayoutChange,
  onComponentsChange,
  selectedComponentId,
  onComponentClick,
  isCanvasSelected = false,
  fieldList,
  onLayoutV4Change,
  mode = 'designer', // Default to designer mode, runtime must explicitly pass 'runtime'
  resolution = 'desktop',
  runtimeActionHandler = null,
  runtimeScreenId = null,
  runtimeRecordId = null,
  runtimeScreenState = null,
  runtimeUpdateControlValue = null,
  runtimeUpdateControlProperty = null,
  runtimeProcessAnalytics = null,
  isStockScreen = null,
  showHiddenComponents = false,
  defaultFocusControlName = null,
}) => {
  // Inject custom RGL styles on mount
  React.useEffect(() => {
    s.injectRGLStyles();
  }, []);

  // Memory leak fix: Track if component is mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 🔧 FIX: Keep a ref to the latest components to fix stale closure issue
  // onNestedComponentsChange callback captures `components` at creation time, but when called
  // (after RGL compaction), it needs access to the LATEST components including the newly added one
  const componentsRef = useRef(components);
  componentsRef.current = components; // Update synchronously every render

  // Runtime effective layout: in runtime mode, components may have different
  // heights/positions than their designed base layout due to data-driven content.
  // In designer mode this is unused — components pass directly to RGL.
  const isRuntimeMode = mode === 'runtime';

  // Centralised drag/drop/resize interaction state
  const {
    dragPreview,
    dragPreviewRef,
    setDragPreview,
    isDragOver,
    setIsDragOver,
    currentDraggedComponent,
    setCurrentDraggedComponent,
    activeDragComponentId,
    setActiveDragComponentId,
    setDraggedComponentType,
    dragOverContainerId,
    setDragOverContainerId,
    draggedComponentId,
    setDraggedComponentId,
    invalidDropTargetId,
    setInvalidDropTargetId,
    currentlyResizingComponentId,
    setCurrentlyResizingComponentId,
    dragOverCanvas,
    setDragOverCanvas,
    isDragInProgress,
    isResizeInProgress,
    isFirstDragOverRef,
    isResizingContainerRef,
    insertModeState,
    insertModeStateRef,
    setInsertMode,
    clearInsertMode,
    clearAllDragStates,
  } = useCanvasDragState();
  const [suppressPlaceholderUntilMoved, setSuppressPlaceholderUntilMoved] = useState(false);
  const wasInsertModeActiveRef = useRef(false);
  const placeholderBaselineSignatureRef = useRef<string | null>(null);
  const suppressRafRef = useRef<number | null>(null);

  const [heightMap, setHeightMap] = useState<Map<string, number>>(new Map());
  const handleHeightChange = useCallback((heights: Map<string, number>) => {
    setHeightMap(heights);
  }, []);

  // Track which hidden component is explicitly expanded for preview.
  // Toggles on re-click of the same hidden component; resets when
  // showHiddenComponents changes (bulk toggle supersedes individual expansion).
  const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);
  const expandedComponentIdRef = useRef<string | null>(null);
  expandedComponentIdRef.current = expandedComponentId; // synchronous update every render

  // Guard: when expandedComponentId changes, RGL fires onLayoutChange with stale positions.
  // Block handleLayoutChange for one animation frame so those stale events are ignored.
  const isExpansionTogglingRef = useRef(false);

  // Unified layout computation for both runtime and designer modes.
  // These modes are mutually exclusive, so a single memo handles both:
  //   Runtime: filters to registered widgets, applies dynamic heights from heightMap, compacts.
  //   Designer: compacts only when hidden components exist, collapsing or expanding them for preview.
  // Returns the base components unchanged when no compaction is necessary.
  const effectiveComponents: ResponsiveComponent[] = useMemo(() => {
    if (isRuntimeMode) {
      // Runtime path: skip during active drag; filter unregistered widgets, apply dynamic heights, compact
      if (isDragInProgress) return components;

      const filtered = components.filter((component) => isWidgetTypeInRegistry(component.type, controlRegistry));
      const base = componentsToGridItems(filtered, resolution, mode);
      // optimization potential - if dynamic data hasn't changed, no need to recompact
      const dynamic = buildDynamicData(filtered, resolution, mode, heightMap);
      const compacted = compact(base, dynamic);
      return applyCompactedLayout(filtered, compacted).filter(
        (c) => !c.containerId && compacted.some((item) => item.id === c.id && item.h > 0),
      );
    }

    // Designer path: compact only when hidden components need collapsing/expanding.
    // Uses mapHiddenToDynamic to determine which hidden components are expanded
    // (via showHiddenComponents toggle or selected component), then runs the
    // compaction algorithm to produce a WYSIWYG preview.
    const allMainCanvas = components.filter((c) => !c.containerId && isWidgetTypeInRegistry(c.type, controlRegistry));

    // If no hidden components exist at all, skip compaction overhead
    const hasAnyHidden = allMainCanvas.some((c) => getHiddenState(c, c.responsive, resolution, mode));
    if (!hasAnyHidden) return components;

    // Compute effective expand ID for main-canvas simpleGrow:
    // If no explicit expandedComponentId, check if selectedComponentId lives inside
    // a hidden container — if so, expand the container on the main canvas.
    let effectiveExpandId = expandedComponentId;
    if (!effectiveExpandId && selectedComponentId) {
      const selectedComp = components.find((c) => c.id === selectedComponentId);
      if (selectedComp?.containerId) {
        const parentContainer = allMainCanvas.find((c) => c.id === selectedComp.containerId);
        if (parentContainer && getHiddenState(parentContainer, parentContainer.responsive, resolution, mode)) {
          effectiveExpandId = selectedComp.containerId;
        }
      }
    }

    const base = componentsToGridItems(allMainCanvas, resolution, mode);
    const dynamic = mapHiddenToDynamic(allMainCanvas, resolution, mode, showHiddenComponents, effectiveExpandId);

    const compacted = simpleGrow(base, dynamic);

    // Map simpleGrow results back to ResponsiveComponent[]
    const compactedMap = new Map(compacted.map((item) => [item.id, item]));

    return components.map((comp) => {
      if (comp.containerId) return comp; // container children unchanged

      const compactedItem = compactedMap.get(comp.id);
      if (compactedItem) {
        // Component was placed by compaction — use compacted position
        return { ...comp, y: compactedItem.y, height: compactedItem.h };
      }

      // Component was removed by compaction (hidden and not expanded)
      // Set to h=0 so it's visible in the presented layout
      return { ...comp, height: 0 };
    });
  }, [
    components,
    resolution,
    mode,
    heightMap,
    isRuntimeMode,
    isDragInProgress,
    controlRegistry,
    showHiddenComponents,
    expandedComponentId,
    selectedComponentId,
  ]);

  // Ref to the current effective layout for delta computation in callbacks.
  // Updated synchronously every render (like componentsRef) so that when RGL fires
  // handleLayoutChange after an expansion transition, the ref already holds the new
  // effective layout — making the delta 0 and preventing incorrect saves.
  const presentedComponentsRef = useRef<ResponsiveComponent[]>(effectiveComponents);
  presentedComponentsRef.current = effectiveComponents;

  // Whether the effective layout differs from base (hidden components are collapsed or expanded).
  // Used to decide whether reverse-mapping is needed when translating RGL changes back to base.
  const needsReverseMap = useMemo(() => {
    return effectiveComponents !== components;
  }, [effectiveComponents, components]);

  // Bound reverse-map function for drag/resize/drop hooks.
  // When presented layout differs from base, maps hook-produced updates back to base space.
  //
  // Hooks build updatedComponents from base `components`, replacing only the
  // moved/resized item with RGL positions (presented space).  Unchanged items
  // keep their base positions.  We detect which items actually changed by
  // comparing to the base, then for those items compute the delta in presented
  // space and apply it to their base position.
  const expansionReverseMapFn = useCallback(
    (updatedComponents: ResponsiveComponent[]): ResponsiveComponent[] => {
      if (!needsReverseMap) return updatedComponents;

      const base = componentsRef.current;
      const presented = presentedComponentsRef.current;
      const baseMap = new Map(base.map((c) => [c.id, c]));
      const presentedMap = new Map(presented.map((c) => [c.id, c]));

      return updatedComponents.map((updated) => {
        const baseComp = baseMap.get(updated.id);

        if (!baseComp) {
          // New component (e.g. from drop) — use as-is
          return updated;
        }

        // Check if this component was actually modified by the hook
        const wasChanged =
          updated.x !== baseComp.x ||
          updated.y !== baseComp.y ||
          updated.width !== baseComp.width ||
          updated.height !== baseComp.height ||
          updated.containerId !== baseComp.containerId;

        if (!wasChanged) {
          // Not touched by the hook — keep base as-is
          return baseComp;
        }

        // This component was changed by the hook.
        // The hook set its position from RGL (presented space).
        // Compute delta vs the presented position and apply to base.
        const presentedComp = presentedMap.get(updated.id);

        if (!presentedComp) {
          // No presented equivalent — use the update directly
          return updated;
        }

        const dx = updated.x - presentedComp.x;
        const dy = updated.y - presentedComp.y;

        return {
          ...updated,
          x: baseComp.x + dx,
          y: baseComp.y + dy,
          // Width/height: use the new values directly (intended size)
          width: updated.width,
          height: updated.height,
        };
      });
    },
    [needsReverseMap],
  );

  const clearDragPreview = useCallback(() => {
    setDragPreview({ visible: false });
  }, [setDragPreview]);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const syntheticDropTargetRef = useRef<HTMLElement | null>(null);
  const syntheticDropTargetMetaRef = useRef<{
    key: string;
    element: HTMLElement;
    cols: number;
    padding: number;
  } | null>(null);

  const dispatchSyntheticDragEvent = useCallback(
    (target: HTMLElement, type: 'dragenter' | 'dragover' | 'dragleave', clientX: number, clientY: number) => {
      if (typeof DragEvent !== 'undefined') {
        target.dispatchEvent(
          new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX,
            clientY,
          }),
        );
        return;
      }

      const fallbackEvent = document.createEvent('Event');
      fallbackEvent.initEvent(type, true, true);
      Object.defineProperty(fallbackEvent, 'clientX', { value: clientX });
      Object.defineProperty(fallbackEvent, 'clientY', { value: clientY });
      target.dispatchEvent(fallbackEvent);
    },
    [],
  );

  const clearSyntheticDropTarget = useCallback(() => {
    const activeTarget = syntheticDropTargetRef.current;
    if (activeTarget) {
      dispatchSyntheticDragEvent(activeTarget, 'dragleave', 0, 0);
      syntheticDropTargetRef.current = null;
    }
    syntheticDropTargetMetaRef.current = null;

    delete (window as unknown as Record<string, unknown>).__rglCrossGridDragSize;
    delete (window as unknown as Record<string, unknown>).__rglCrossGridTargetType;
    delete (window as unknown as Record<string, unknown>).__rglCrossGridTargetContainerId;
    document.documentElement.style.removeProperty('--cross-grid-drag-client-x');
    document.documentElement.style.removeProperty('--cross-grid-drag-client-y');
  }, [dispatchSyntheticDragEvent]);

  // Shared grid-item class management (selected-item, top-row)
  useGridItemClassManager({
    selectedComponentId,
    components,
    onSelectionChange: undefined,
  });

  const getPlaceholderSignature = useCallback((): string | null => {
    const placeholder = document.querySelector('.react-grid-layout .react-grid-placeholder') as HTMLElement | null;
    if (!placeholder) return null;
    return [
      placeholder.style.transform || '',
      placeholder.style.top || '',
      placeholder.style.left || '',
      placeholder.style.width || '',
      placeholder.style.height || '',
    ].join('|');
  }, []);

  // Keep placeholder hidden until RGL has actually moved/repositioned it after insert mode exits.
  useEffect(() => {
    if (insertModeState.isActive) {
      wasInsertModeActiveRef.current = true;
      const signature = getPlaceholderSignature();
      if (signature) {
        placeholderBaselineSignatureRef.current = signature;
      }
      return;
    }

    if (wasInsertModeActiveRef.current) {
      wasInsertModeActiveRef.current = false;
      placeholderBaselineSignatureRef.current = getPlaceholderSignature();
      setSuppressPlaceholderUntilMoved(true);
    }
  }, [insertModeState.isActive, getPlaceholderSignature]);

  useEffect(() => {
    if (!suppressPlaceholderUntilMoved) return;

    const baseline = placeholderBaselineSignatureRef.current;
    if (!isDragInProgress) {
      setSuppressPlaceholderUntilMoved(false);
      return;
    }

    const checkForPlaceholderMove = () => {
      const current = getPlaceholderSignature();

      if (!isDragInProgress || current === null || baseline === null || current !== baseline) {
        setSuppressPlaceholderUntilMoved(false);
        suppressRafRef.current = null;
        return;
      }

      suppressRafRef.current = window.requestAnimationFrame(checkForPlaceholderMove);
    };

    suppressRafRef.current = window.requestAnimationFrame(checkForPlaceholderMove);

    return () => {
      if (suppressRafRef.current !== null) {
        window.cancelAnimationFrame(suppressRafRef.current);
        suppressRafRef.current = null;
      }
    };
  }, [suppressPlaceholderUntilMoved, isDragInProgress, getPlaceholderSignature]);

  // Track previous components count to detect when new components are added
  const prevComponentsCountRef = useRef<number>(components.length);

  // Clear drag states when components change (e.g., after successful container drop)
  useEffect(() => {
    const currentCount = components.length;
    const prevCount = prevComponentsCountRef.current;

    // If component count increased, a new component was added - clear drag states
    if (currentCount > prevCount && isMountedRef.current) {
      clearAllDragStates();
    }

    // Update the ref for next comparison
    prevComponentsCountRef.current = currentCount;
  }, [components.length]);

  // ============================================================================
  // PROGRAMMATIC DIMENSION CHANGE DETECTION (for auto-resize components like RadioButton)
  // ============================================================================
  // Track previous component dimensions to detect programmatic changes (not user resize).
  // TOP-LEFT CORNER PRECEDENCE: Component stays at original (x, y) position.
  // - When dimensions change, component stays at top-left, pushes overlapping components DOWN
  // - Example: RadioButton vertical→horizontal: gets wider, pushes components that now overlap
  const prevComponentDimensionsRef = useRef<Map<string, { width: number; height: number; x: number; y: number }>>(
    new Map(),
  );

  useEffect(() => {
    // Skip during active resize operations (those are handled by handleResizeStop)
    if (currentlyResizingComponentId) return;
    // Skip if no change handler
    if (!onComponentsChange) return;

    const mainCanvasComponents = components.filter((c) => !c.containerId);
    const prevDimensions = prevComponentDimensionsRef.current;
    let changedComponent: ResponsiveComponent | null = null;
    let oldWidth = 0;
    let oldHeight = 0;
    let originalX = 0;
    let originalY = 0;

    // Check for components with dimension changes (width OR height)
    for (const comp of mainCanvasComponents) {
      const prevDim = prevDimensions.get(comp.id);
      if (prevDim !== undefined && (comp.height !== prevDim.height || comp.width !== prevDim.width)) {
        // Skip if this component was just resized by user (not a programmatic change)
        if (comp.id === userResizedComponentIdRef.current) {
          userResizedComponentIdRef.current = null; // Clear the flag
          continue; // Skip this component, check others
        }
        // Component dimensions changed programmatically
        changedComponent = comp;
        oldWidth = prevDim.width;
        oldHeight = prevDim.height;
        originalX = prevDim.x; // TOP-LEFT: X anchor
        originalY = prevDim.y; // TOP-LEFT: Y anchor
        break; // Handle one at a time to avoid conflicts
      }
    }

    // Update stored dimensions for next comparison
    const newDimensions = new Map<string, { width: number; height: number; x: number; y: number }>();
    for (const comp of mainCanvasComponents) {
      newDimensions.set(comp.id, { width: comp.width, height: comp.height, x: comp.x, y: comp.y });
    }
    prevComponentDimensionsRef.current = newDimensions;

    // If a component's dimensions changed, ensure top-left stays fixed and push if needed
    if (changedComponent) {
      // Create layout items with original position for the changed component
      const layoutItems: PushLayoutItem[] = mainCanvasComponents.map((comp) => ({
        i: comp.id,
        x: comp.id === changedComponent!.id ? originalX : comp.x,
        y: comp.id === changedComponent!.id ? originalY : comp.y,
        w: comp.width,
        h: comp.height,
      }));

      const changedLayoutItem: PushLayoutItem = {
        i: changedComponent.id,
        x: originalX, // TOP-LEFT CORNER: Keep original X
        y: originalY, // TOP-LEFT CORNER: Keep original Y
        w: changedComponent.width,
        h: changedComponent.height,
      };

      // Calculate push - this handles both width and height increases
      // Components that now overlap with the changed component get pushed down
      const pushResult = calculateResizePush(changedLayoutItem, oldWidth, oldHeight, layoutItems);

      // Apply: changed component stays at original position, others get pushed if needed
      const updatedComponents = components.map((comp) => {
        if (comp.containerId) return comp;

        if (comp.id === changedComponent!.id) {
          // TOP-LEFT CORNER PRECEDENCE: Keep component at original position
          return { ...comp, x: originalX, y: originalY };
        }

        // Apply pushed positions to other components
        const pushedItem = pushResult.layout.find((l) => l.i === comp.id);
        if (pushedItem && pushedItem.y !== comp.y) {
          return { ...comp, y: pushedItem.y };
        }

        return comp;
      });

      // Check if anything changed
      const hasChanges = updatedComponents.some(
        (comp, idx) => comp.y !== components[idx]?.y || comp.x !== components[idx]?.x,
      );

      if (hasChanges) {
        onComponentsChange(updatedComponents);

        // Skip handleLayoutChange to prevent RGL from overwriting our positions
        skipNextLayoutChangeRef.current = true;
        setTimeout(() => {
          skipNextLayoutChangeRef.current = false;
        }, 200);
      }
    }
  }, [components, currentlyResizingComponentId, onComponentsChange]);

  // Maintain is-being-dragged class during active drag (persists through re-renders)
  React.useEffect(() => {
    if (activeDragComponentId) {
      const draggedElement = document.querySelector(`[data-testid="component-${activeDragComponentId}"]`);
      const gridItem = draggedElement?.closest('.react-grid-item');
      if (gridItem && !gridItem.classList.contains('is-being-dragged')) {
        gridItem.classList.add('is-being-dragged');
      }
    }
  }, [activeDragComponentId, components]); // Re-apply on every render during drag

  // Add/remove invalid-drop-target class when dragging a container over another container
  React.useEffect(() => {
    // Remove invalid-drop-target class from all grid items
    document.querySelectorAll('.react-grid-item.invalid-drop-target').forEach((item) => {
      item.classList.remove('invalid-drop-target');
    });

    // Add invalid-drop-target class to the hovered container
    if (invalidDropTargetId) {
      const targetElement = document.querySelector(`[data-testid="component-${invalidDropTargetId}"]`);
      const gridItem = targetElement?.closest('.react-grid-item');
      if (gridItem) {
        gridItem.classList.add('invalid-drop-target');
      }
    }
  }, [invalidDropTargetId]);

  // Convert components to RGL layout format with container collision protection
  // Only include components that are not inside containers
  // In runtime mode, ALL components should be static
  // In designer mode, layout containers and sections should be static only during drag operations
  const layout = effectiveComponents
    .filter((component) => !component.containerId)
    .map((component) => {
      const isContainer =
        (component.type as string) === 'L-CON' ||
        component.type === WIDGETS.LAYOUT_CONTAINER ||
        component.type === WIDGETS.SECTION;

      // Make static if:
      // - Runtime mode (nothing should move)
      // - Or container during drag (designer mode collision protection)
      const shouldBeStatic =
        !isDraggable ||
        (isContainer && isDragInProgress) ||
        (component.type === WIDGETS.SECTION && draggedComponentId !== null);

      const layoutItem = rglStateAdapter.componentToLayoutItem({
        ...component,
        static: shouldBeStatic,
      });

      return layoutItem;
    });

  // Calculate column width to match RGL's internal calculations
  const colWidth = useMemo(() => {
    const containerPadding = 8; // matches containerPadding={[8, 8]}
    console.log('calculated width', width, cols, 'colW', (width - containerPadding * 2) / cols);
    return (width - containerPadding * 2) / cols;
  }, [width, cols]);

  // 🔧 PERFORMANCE FIX: Add debounced layout change handler to prevent excessive re-renders
  const layoutChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔧 STATIC LAYOUT FIX: Track when we just did a manual position update (container drop)
  // This prevents handleLayoutChange from overwriting correct positions with compacted ones
  const skipNextLayoutChangeRef = useRef<boolean>(false);

  // Helper that sets expandedComponentId and synchronously arms the expansion guard,
  // preventing RGL's stale onLayoutChange (fired during componentDidUpdate, before useEffect)
  // from overwriting real user positions.
  const setExpansionWithGuard = useCallback((newId: string | null | ((prev: string | null) => string | null)) => {
    isExpansionTogglingRef.current = true;
    if (layoutChangeTimeoutRef.current) {
      clearTimeout(layoutChangeTimeoutRef.current);
      layoutChangeTimeoutRef.current = null;
    }
    requestAnimationFrame(() => {
      isExpansionTogglingRef.current = false;
    });
    setExpandedComponentId(newId);
  }, []);

  // Ref to access the latest onNestedDrop handler from handleGridDrop
  const onNestedDropRef = useRef<
    | ((
        e: React.DragEvent,
        targetContainerId: string,
        position?: { x: number; y: number; w: number; h: number },
      ) => void)
    | null
  >(null);

  // Handle layout changes from RGL with debouncing
  const handleLayoutChange = useCallback(
    (newLayout: RGLLayoutItem[]) => {
      // Clean and validate layout
      const cleanedLayout = rglStateAdapter.cleanLayout(newLayout);

      // Call RGL-specific callback immediately for visual updates
      if (onLayoutChange) {
        onLayoutChange(cleanedLayout);
      }

      // Do NOT call onLayoutV4Change here!
      // The specific event handlers (handleDragStop, handleResizeStop, etc.) already call it
      // with the correct context. Calling it here causes issues because:
      // 1. This runs before onComponentsChange state updates complete
      // 2. We don't have the updated containerId values yet
      // 3. It results in flattened structures being saved to Redux

      // SMOOTH RESIZE FIX: Skip onComponentsChange during active CONTAINER resize operations
      // This prevents containers from jumping in column sizes during resize drag
      // The visual resize still happens (RGL handles it), but we only commit the
      // column-based size changes when the user releases the handle (in handleResizeStop)
      // This makes containers behave like Chart - smooth visual resize with calculations only on release
      // NOTE: Only applies to containers - other components (Chart, etc.) resize normally
      // Use ref for synchronous checking to prevent initial jump when resize starts
      if (isResizingContainerRef.current) {
        // Container is being resized - skip onComponentsChange updates
        // Let RGL handle visual updates, only commit on resize stop
        return;
      }

      // Skip when compaction is active — positions are in compacted space.
      // Explicit handlers (handleDragStop, handleResizeStop) save base positions directly.
      if (isDragInProgress || isResizeInProgress) {
        return;
      }

      // 🔧 STATIC LAYOUT FIX: Skip debounced update after manual position updates (container drops)
      // This prevents handleLayoutChange from overwriting correct positions with compacted ones
      // RGL may trigger multiple layout changes after a drop, so we skip all within the window
      if (skipNextLayoutChangeRef.current) {
        // Clear any pending timeout but don't reset the flag yet
        // Flag will be reset by the timeout set in handleDragStop
        if (layoutChangeTimeoutRef.current) {
          clearTimeout(layoutChangeTimeoutRef.current);
          layoutChangeTimeoutRef.current = null;
        }
        return;
      }

      // Guard: skip RGL's stale onLayoutChange that fires immediately after
      // expandedComponentId changes (expansion toggling). The useEffect above
      // sets this ref true and clears it after one animation frame.
      if (isExpansionTogglingRef.current) {
        return;
      }

      // Capture the current presented snapshot NOW, before the
      // debounced timeout fires. By the time the timeout executes, a re-render may
      // have already updated presentedComponentsRef to reflect the new positions,
      // making the old→new delta zero and losing the change.
      const capturedPresented = presentedComponentsRef.current;
      const capturedBase = componentsRef.current;
      const capturedNeedsReverseMap = capturedPresented !== capturedBase;

      if (onComponentsChange) {
        // "First wins" debounce: if a timeout is already pending, don't replace it.
        // When expansion is active, RGL fires handleLayoutChange multiple times:
        // first with the real user change, then with the settled (no-change) layout.
        // The first fire captures the correct cleanedLayout in its closure.
        // Replacing it with the second (no-change) fire would lose the edit.
        if (layoutChangeTimeoutRef.current) {
          return;
        }

        // Set new timeout for batched update.
        // Use refs inside the timeout to avoid stale closure values.
        // Refs are always current.
        layoutChangeTimeoutRef.current = setTimeout(() => {
          layoutChangeTimeoutRef.current = null;

          // When expansion is active (hidden components are shown/collapsed), RGL fires
          // onLayoutChange in response to the layout prop changing — this is a view-only change.
          // All genuine user edits (drag/resize/drop) are handled by dedicated stop handlers
          // that call onComponentsChange directly and set skipNextLayoutChangeRef to suppress
          // this path. So when capturedNeedsReverseMap is true here, it's always from expansion,
          // not user action. The base positions have not changed — skip the save.
          if (capturedNeedsReverseMap) {
            return;
          }

          // No expansion: standard path — update base directly from RGL layout
          const newPresented = rglStateAdapter.updateComponentsFromLayout(capturedPresented, cleanedLayout, resolution);

          // Preserve latest containerId from current components.
          // RGL layout changes never affect containerId — only drag/drop handlers do.
          // The captured snapshots may have stale containerId values if an external
          // update (e.g. Redux dispatch) changed containerId between the capture and
          // this timeout firing.  componentsRef is updated synchronously every render,
          // so it always reflects the latest authoritative containerId.
          let result = newPresented;
          const latestComponents = componentsRef.current;
          const latestMap = new Map(latestComponents.map((c) => [c.id, c]));
          result = result.map((comp) => {
            const latest = latestMap.get(comp.id);
            if (latest && comp.containerId !== latest.containerId) {
              return { ...comp, containerId: latest.containerId };
            }
            return comp;
          });

          onComponentsChange(result);
        }, 150); // 150ms debounce delay
      }
    },
    [
      components,
      effectiveComponents,
      onLayoutChange,
      onComponentsChange,
      currentlyResizingComponentId,
      resolution,
      showHiddenComponents,
      isDragInProgress,
      isResizeInProgress,
      selectedComponentId,
    ],
  );

  // Container drop detection and validation - using ContainerManager
  const detectDropTarget = useCallback(
    (
      dropX: number,
      dropY: number,
      draggedComponentType: WidgetType,
      draggedComponent?: ResponsiveComponent,
      paletteDropSize?: { width: number; height: number },
    ) => {
      return ContainerManager.detectDropTarget(
        dropX,
        dropY,
        draggedComponentType,
        components,
        colWidth,
        rowHeight,
        draggedComponent,
        paletteDropSize,
      );
    },
    [components, colWidth, rowHeight],
  );

  // Pre-emptive event handling for container collision protection + global dragend cleanup
  usePreemptiveEventHandlers({
    isDraggable,
    onDragStart: useCallback(
      (componentId: string) => {
        setDraggedComponentId(componentId);
      },
      [setDraggedComponentId],
    ),
    onDragEnd: useCallback(() => {
      setDraggedComponentId(null);
      setInvalidDropTargetId(null);
    }, [setDraggedComponentId, setInvalidDropTargetId]),
    clearAllDragStates,
    isMountedRef,
  });

  // Drag handlers extracted to dedicated hook
  const { handleDragStart, handleDrag, handleDragStop } = useCanvasDragHandler({
    components,
    selectedComponentId: selectedComponentId ?? null,
    draggedComponentId,
    dragOverContainerId,
    setActiveDragComponentId,
    setCurrentDraggedComponent,
    setDraggedComponentId,
    setInvalidDropTargetId,
    setDragOverContainerId,
    clearAllDragStates,
    isFirstDragOverRef,
    onComponentsChange: onComponentsChange ?? null,
    onComponentClick: onComponentClick ?? null,
    onLayoutV4Change: onLayoutV4Change ?? null,
    resolution,
    rowHeight,
    detectDropTarget,
    skipNextLayoutChangeRef,
    layoutChangeTimeoutRef,
    dragPreview,
    dragPreviewRef,
    onDragPreviewChange: setDragPreview,
    onDragPreviewClear: clearDragPreview,
    insertModeStateRef,
    setInsertMode,
    clearInsertMode,
    cols,
    colWidth,
    reverseMapFn: needsReverseMap ? expansionReverseMapFn : null,
    presentedComponentsRef,
  });

  // Resize handlers extracted to dedicated hook
  const { handleResizeStart, handleResizeStop, userResizedComponentIdRef } = useCanvasResizeHandler({
    components,
    onComponentsChange: onComponentsChange ?? null,
    setCurrentlyResizingComponentId,
    isResizingContainerRef,
    // Needed for vertical push resize
    onLayoutV4Change: onLayoutV4Change ?? null,
    resolution,
    cols,
    width,
    rowHeight,
    skipNextLayoutChangeRef,
    currentlyResizingComponentId,
    reverseMapFn: needsReverseMap ? expansionReverseMapFn : null,
  });

  // Drop handlers extracted to dedicated hook
  const {
    handleDropDragOver,
    handleGridDrop,
    handleDragOverWithInsert,
    handleDragLeave,
    onNestedDrop,
    onNestedDragOver,
    onNestedDragLeave,
    onComponentDragStart,
  } = useCanvasDropHandler({
    components,
    onComponentsChange: onComponentsChange ?? null,
    fieldList: fieldList ?? null,
    isDragOver,
    setIsDragOver,
    setDragPreview,
    setInvalidDropTargetId,
    setDragOverCanvas,
    clearAllDragStates,
    isFirstDragOverRef,
    insertModeStateRef,
    setInsertMode,
    clearInsertMode,
    cols,
    colWidth,
    layoutChangeTimeoutRef,
    skipNextLayoutChangeRef,
    onNestedDropRef,
    rowHeight,
    detectDropTarget,
    presentedComponentsRef,
  });

  // Update ref to latest onNestedDrop callback
  React.useEffect(() => {
    onNestedDropRef.current = onNestedDrop;
  }, [onNestedDrop]);

  const handleComponentClickWithExpansion = useCallback(
    (componentId: string) => {
      // Determine if the clicked component is hidden
      const clickedComponent = componentsRef.current.find((c) => c.id === componentId);
      const isClickedHidden = clickedComponent
        ? getHiddenState(clickedComponent, clickedComponent.responsive, resolution, mode)
        : false;

      if (isClickedHidden && !isDragInProgress) {
        // Toggle: collapse if already expanded, expand if different
        // Guard: drag-end fires a synthetic click — don't let it mutate expandedComponentId
        setExpansionWithGuard((prev) => (prev === componentId ? null : componentId));
      } else if (!isClickedHidden && expandedComponentIdRef.current !== null) {
        // Clicking a non-hidden component collapses any currently expanded hidden component
        setExpansionWithGuard(null);
      }

      if (onComponentClick) {
        onComponentClick(componentId);
      }
    },
    [onComponentClick, resolution, mode, isDragInProgress, setExpansionWithGuard],
  );

  // Canvas click-away handler - deselect component and collapse any expanded hidden component
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Collapse any expanded hidden component on any canvas click.
      // CanvasItem calls stopPropagation(), so this only fires for genuine empty-canvas clicks
      // (the CanvasWrapper itself OR the .react-grid-layout div between grid items).
      if (expandedComponentIdRef.current !== null) {
        setExpansionWithGuard(null);
      }
      // Deselect only when clicking the exact canvas background (not between grid items)
      if (e.target === e.currentTarget && selectedComponentId) {
        if (onComponentClick) {
          onComponentClick(null as any); // Deselect
        }
      }
    },
    [selectedComponentId, onComponentClick, setExpansionWithGuard],
  );

  // Stable context objects for extracted helper functions
  const containerPropsCtx: ContainerPropsContext = useMemo(
    () => ({
      components,
      componentsRef,
      isDraggable,
      isResizable,
      resolution,
      mode,
      selectedComponentId,
      rowHeight,
      showHiddenComponents,
      dragOverContainerId,
      onComponentClick: handleComponentClickWithExpansion,
      dragPreview,
      dragPreviewRef,
      setDragPreview,
      skipNextLayoutChangeRef,
      layoutChangeTimeoutRef,
      onComponentsChange,
      onLayoutV4Change,
      dragOverCanvas,
      onNestedDrop,
      onNestedDragOver,
      onNestedDragLeave,
      onComponentDragStart,
      clearAllDragStates,
      ReactGridLayout,
    }),
    [
      components,
      isDraggable,
      isResizable,
      resolution,
      mode,
      selectedComponentId,
      rowHeight,
      showHiddenComponents,
      dragOverContainerId,
      handleComponentClickWithExpansion,
      dragPreview,
      dragPreviewRef,
      setDragPreview,
      skipNextLayoutChangeRef,
      layoutChangeTimeoutRef,
      onComponentClick,
      onComponentsChange,
      onLayoutV4Change,
      dragOverCanvas,
      onNestedDrop,
      onNestedDragOver,
      onNestedDragLeave,
      onComponentDragStart,
      clearAllDragStates,
    ],
  );

  const runtimeCtx: RuntimePropsContext | null = useMemo(
    () =>
      isDraggable
        ? null
        : {
            runtimeActionHandler,
            runtimeScreenId,
            runtimeRecordId,
            runtimeScreenState,
            runtimeUpdateControlValue,
            runtimeUpdateControlProperty,
            runtimeProcessAnalytics,
            isStockScreen,
          },
    [
      isDraggable,
      runtimeActionHandler,
      runtimeScreenId,
      runtimeRecordId,
      runtimeScreenState,
      runtimeUpdateControlValue,
      runtimeUpdateControlProperty,
      runtimeProcessAnalytics,
      isStockScreen,
    ],
  );

  const displayContext = useMemo(
    () => ({
      isDraggable,
      selectedComponentId,
      resolution,
      mode,
    }),
    [isDraggable, selectedComponentId, resolution, mode],
  );

  // Component rendering function — delegates to the CanvasItem component.
  // CanvasItem is a proper React component (with React.memo) which enables
  // per-component hooks (e.g. the runtime size observer) and prevents
  // sibling re-renders.
  const renderComponent = useCallback(
    (component: ResponsiveComponent) => (
      <CanvasItem
        key={component.id}
        component={component}
        displayContext={displayContext}
        containerPropsCtx={containerPropsCtx}
        runtimeCtx={runtimeCtx}
        controlRegistry={controlRegistry}
        showHiddenComponents={showHiddenComponents}
        dragOverContainerId={dragOverContainerId}
        currentDraggedComponent={currentDraggedComponent}
        isDragInProgress={isDragInProgress}
        isResizeInProgress={isResizeInProgress}
        onComponentClick={handleComponentClickWithExpansion}
        isRuntimeMode={isRuntimeMode}
        defaultFocusControlName={defaultFocusControlName}
        renderComponent={renderComponent}
      />
    ),
    [
      displayContext,
      containerPropsCtx,
      runtimeCtx,
      controlRegistry,
      showHiddenComponents,
      dragOverContainerId,
      currentDraggedComponent,
      handleComponentClickWithExpansion,
      isDragInProgress,
      isResizeInProgress,
      isRuntimeMode,
      defaultFocusControlName,
    ],
  );

  useEffect(() => {
    if (!isDraggable || !dragPreview.visible || !dragPreview.position || !dragPreview.targetType) {
      clearSyntheticDropTarget();
      // Clear container highlight when cross-grid drag preview is dismissed
      if (dragPreview.sourceContainerId) {
        setDragOverContainerId(null);
      }
      return;
    }

    // Sync dragOverContainerId so the target container shows its visual highlight
    // (mesh, isDraggedOver) during cross-grid drags originating from another container.
    if (dragPreview.targetType === 'container' && dragPreview.containerId) {
      setDragOverContainerId(dragPreview.containerId);
    } else if (dragPreview.targetType === 'canvas') {
      setDragOverContainerId(null);
    }

    const targetKey = dragPreview.targetType === 'container' ? `container:${dragPreview.containerId ?? ''}` : 'canvas';

    let resolvedTargetMeta = syntheticDropTargetMetaRef.current;
    const isCachedTargetValid =
      resolvedTargetMeta && resolvedTargetMeta.key === targetKey && document.contains(resolvedTargetMeta.element);

    if (!isCachedTargetValid) {
      let targetElement: HTMLElement | null = null;
      let targetCols = Number(cols) || 12;
      let targetPadding = 8;

      if (dragPreview.targetType === 'container') {
        if (!dragPreview.containerId) {
          clearSyntheticDropTarget();
          return;
        }

        const containerElement = document.querySelector(
          `[data-container-id="${dragPreview.containerId}"]`,
        ) as HTMLElement | null;
        targetElement = containerElement?.querySelector('.react-grid-layout.nested-layout') as HTMLElement | null;
        targetCols = Number(containerElement?.getAttribute('data-container-cols')) || 8;
        targetPadding = Number(containerElement?.getAttribute('data-container-padding')) || 0;
      } else {
        targetElement = canvasWrapperRef.current?.querySelector(
          '.react-grid-layout:not(.nested-layout)',
        ) as HTMLElement | null;
        targetCols = Number(cols) || 12;
        targetPadding = 8;
      }

      if (!targetElement) {
        clearSyntheticDropTarget();
        return;
      }

      resolvedTargetMeta = {
        key: targetKey,
        element: targetElement,
        cols: targetCols,
        padding: targetPadding,
      };
      syntheticDropTargetMetaRef.current = resolvedTargetMeta;
    }

    if (!resolvedTargetMeta) {
      clearSyntheticDropTarget();
      return;
    }

    const previewClientX = dragPreview.clientX;
    const previewClientY = dragPreview.clientY;
    const hasPointerCoords = typeof previewClientX === 'number' && typeof previewClientY === 'number';
    const targetRect = resolvedTargetMeta.element.getBoundingClientRect();
    const effectiveWidth = Math.max(1, targetRect.width - resolvedTargetMeta.padding * 2);
    const targetColWidth = effectiveWidth / resolvedTargetMeta.cols;
    console.log('targetColWidth', targetColWidth);
    const targetRowHeight = Number(rowHeight) || 30;
    const anchorOffsetCols = Math.max(0, Number(dragPreview.anchorOffsetCols) || 0);
    let fallbackClientX = 0;
    let fallbackClientY = 0;
    if (!hasPointerCoords) {
      fallbackClientX =
        targetRect.left +
        resolvedTargetMeta.padding +
        (dragPreview.position.x + Math.min(0.5, dragPreview.position.w / 2)) * targetColWidth;
      fallbackClientY =
        targetRect.top +
        resolvedTargetMeta.padding +
        (dragPreview.position.y + Math.min(0.5, dragPreview.position.h / 2)) * targetRowHeight;
    }

    const adjustedPointerClientX = hasPointerCoords ? Number(previewClientX) - anchorOffsetCols * targetColWidth : 0;
    const eventClientX = hasPointerCoords ? adjustedPointerClientX : fallbackClientX;
    const eventClientY = hasPointerCoords ? Number(previewClientY) : fallbackClientY;
    const activeDraggedSource = document.querySelector(
      '.nested-layout.cross-grid-drag-source > .react-grid-item.react-draggable-dragging',
    ) as HTMLElement | null;
    const activeDraggedSourceWidth = Math.max(
      1,
      activeDraggedSource?.getBoundingClientRect().width || dragPreview.position.w * targetColWidth,
    );
    // CSS uses translateX(-50%), so offset by half ghost width to keep its left edge
    // aligned to the same anchor-adjusted event X used for placeholder snapping.
    const visualClientX = hasPointerCoords ? adjustedPointerClientX + activeDraggedSourceWidth / 2 : fallbackClientX;
    const visualClientY = hasPointerCoords ? Number(previewClientY) : fallbackClientY;

    // Keep dragged source visuals following the pointer while synthetic RGL events
    // stay locked to the authoritative preview grid coordinates.
    document.documentElement.style.setProperty('--cross-grid-drag-client-x', `${visualClientX}px`);
    document.documentElement.style.setProperty('--cross-grid-drag-client-y', `${visualClientY}px`);

    (window as unknown as Record<string, unknown>).__rglCrossGridDragSize = {
      w: dragPreview.position.w,
      h: dragPreview.position.h,
    };
    (window as unknown as Record<string, unknown>).__rglCrossGridTargetType = dragPreview.targetType;
    (window as unknown as Record<string, unknown>).__rglCrossGridTargetContainerId = dragPreview.containerId ?? null;

    const activeTarget = syntheticDropTargetRef.current;
    if (activeTarget !== resolvedTargetMeta.element) {
      if (activeTarget) {
        dispatchSyntheticDragEvent(activeTarget, 'dragleave', eventClientX, eventClientY);
      }
      dispatchSyntheticDragEvent(resolvedTargetMeta.element, 'dragenter', eventClientX, eventClientY);
      syntheticDropTargetRef.current = resolvedTargetMeta.element;
    }

    dispatchSyntheticDragEvent(resolvedTargetMeta.element, 'dragover', eventClientX, eventClientY);
  }, [
    isDraggable,
    dragPreview,
    cols,
    rowHeight,
    clearSyntheticDropTarget,
    dispatchSyntheticDragEvent,
    setDragOverContainerId,
  ]);

  useEffect(() => {
    return () => {
      clearSyntheticDropTarget();
    };
  }, [clearSyntheticDropTarget]);

  return (
    <HoverContext_Provider>
      <s.CanvasWrapper
        ref={canvasWrapperRef}
        isCanvasSelected={isCanvasSelected}
        mode={mode}
        className={insertModeState.isActive || suppressPlaceholderUntilMoved ? 'insert-mode-active' : ''}
        onClick={handleCanvasClick}
        // 🔧 PERFORMANCE: Keep handleDragOver for visual feedback
        // But drop handling is now done by RGL's onDrop handler
        onDragOver={isDraggable ? handleDragOverWithInsert : undefined}
        onDragEnter={
          isDraggable
            ? () => {
                // Workaround for browser dataTransfer security restrictions
                // Read from window global set by handleComponentDragStart
                const componentType = (window as unknown as Record<string, unknown>).__draggedComponentType;
                if (componentType) {
                  setDraggedComponentType(componentType as string);
                  setIsDragOver(true);
                }
              }
            : undefined
        }
        onDragLeave={isDraggable ? handleDragLeave : undefined}
      >
        {/* Designer-only UI elements - hidden in runtime mode */}
        {isDraggable && (
          <>
            {/* Empty Canvas Guidance Text */}
            {components.length === 0 && (
              <s.EmptyCanvasWrapper>
                <s.EmptyCanvasText>Drag and drop components onto the canvas to start</s.EmptyCanvasText>
              </s.EmptyCanvasWrapper>
            )}

            {/* Grid Visualization - shows during drag and resize operations */}
            <GridVisualization
              key={`grid-viz-${isDragOver}-${draggedComponentId || currentlyResizingComponentId}`}
              visible={isDragOver || draggedComponentId !== null || currentlyResizingComponentId !== null}
              cols={cols}
              rowHeight={rowHeight}
              width={width}
              theme='dragActive'
              containerPadding={8}
              margin={0}
              maxRowPosition={layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)}
            />

            {/* Insert Indicator - shows during insert mode when dropping would cause push */}
            <InsertIndicator
              x={insertModeState.indicatorX} // Add horizontal container padding offset
              y={insertModeState.indicatorY} // Add vertical container padding offset
              width={insertModeState.indicatorWidth}
              visible={insertModeState.isActive}
            />
          </>
        )}
        {(() => {
          const gridContent = (
            <ReactGridLayout
              layout={layout}
              cols={Number(cols) || 12}
              rowHeight={Number(rowHeight) || 30}
              width={Number(width) || 300}
              isDraggable={isDraggable}
              isResizable={isResizable}
              resizeHandles={isDraggable ? ['s', 'e', 'w'] : []}
              onLayoutChange={isDraggable ? handleLayoutChange : undefined}
              onDragStart={isDraggable ? handleDragStart : undefined}
              onDrag={isDraggable ? handleDrag : undefined}
              onDragStop={isDraggable ? handleDragStop : undefined}
              onResizeStart={isResizable ? handleResizeStart : undefined}
              onResizeStop={isResizable ? handleResizeStop : undefined}
              // 🔧 PERFORMANCE FIX: Use RGL's built-in drop handlers for smooth drag-and-drop
              onDrop={isDraggable ? handleGridDrop : undefined}
              // @ts-expect-error - onDropDragOver is not a valid prop for ReactGridLayout
              onDropDragOver={isDraggable ? handleDropDragOver : undefined}
              isDroppable={isDraggable}
              // RGL configuration
              autoSize={isDraggable}
              compactType={null}
              preventCollision={true} // Prevent collision when compaction is disabled (static layout)
              margin={[0, 0]}
              containerPadding={[8, 8]}
              useCSSTransforms={false}
              draggableHandle='.drag-handle'
              className='react-grid-layout'
            >
              {effectiveComponents
                .filter((component) => !component.containerId)
                .filter((component) => isWidgetTypeInRegistry(component.type, controlRegistry))
                .map((component) => renderComponent(component))}
            </ReactGridLayout>
          );

          // In runtime mode, wrap with RuntimeLayoutProvider to enable size observation
          // and effective layout computation. In designer mode, render directly.
          return isRuntimeMode ? (
            <RuntimeLayoutProvider
              componentIds={components
                .filter((comp) => DYNAMIC_HEIGHT_TYPES.includes(comp.type))
                .map((comp) => comp.id)}
              rowHeight={rowHeight}
              onHeightChange={handleHeightChange}
            >
              {gridContent}
            </RuntimeLayoutProvider>
          ) : (
            gridContent
          );
        })()}
      </s.CanvasWrapper>
    </HoverContext_Provider>
  );
};

export default LayoutCanvas;
