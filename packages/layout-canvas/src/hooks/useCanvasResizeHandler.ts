import { useCallback, useRef, useEffect } from 'react';
import { Layout, ItemCallback } from 'react-grid-layout';
import { ResponsiveComponent } from '../rgl-integration/types';
import { ContainerManager } from '../containers/utils/ContainerManager';
import {
  calculateResizePush,
  componentsToLayoutItems,
  LayoutItem as PushLayoutItem,
} from '../utils/verticalPushCalculator';
import {
  buildNestedStructureWithResponsive,
  LayoutCanvas as LayoutCanvasStructure,
} from '../utils/structureConverters';
import { getDisplayRestrictionsFromRegistry } from '../registry/registryUtils';
import { ValidControlType } from '@m-next/runtime-interface';

// ============================================================================
// RESIZE TRACKING TYPES
// ============================================================================

// Resize tracking state for static mode where preventCollision blocks RGL updates
export interface ResizeTrackingState {
  startMouseY: number | null;
  startMouseX: number | null;
  startHeight: number | null;
  startWidth: number | null;
  startX: number | null; // Original X position (for west resize)
  startY: number | null; // Original Y position (for north resize)
  intendedHeight: number | null;
  intendedWidth: number | null;
  handleDirection: string | null;
  // Component size constraints from display restrictions
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

export const initialResizeState: ResizeTrackingState = {
  startMouseY: null,
  startMouseX: null,
  startHeight: null,
  startWidth: null,
  startX: null,
  startY: null,
  intendedHeight: null,
  intendedWidth: null,
  handleDirection: null,
  minWidth: 1,
  maxWidth: 12,
  minHeight: 1,
  maxHeight: 1000,
};

// ============================================================================
// HOOK INTERFACE
// ============================================================================

export interface UseCanvasResizeHandlerParams {
  components: ResponsiveComponent[];
  onComponentsChange: ((components: ResponsiveComponent[]) => void) | null;
  setCurrentlyResizingComponentId: (id: string | null) => void;
  isResizingContainerRef: React.MutableRefObject<boolean>;
  // Needed for vertical push resize
  onLayoutV4Change: ((layout: LayoutCanvasStructure) => void) | null;
  resolution: string;
  cols: number;
  width: number;
  rowHeight: number;
  skipNextLayoutChangeRef: React.MutableRefObject<boolean>;
  currentlyResizingComponentId: string | null;

  // Reverse mapping function for hidden component expansion
  reverseMapFn: ((updated: ResponsiveComponent[]) => ResponsiveComponent[]) | null;
}

export interface CanvasResizeHandlers {
  handleResizeStart: ItemCallback;
  handleResizeStop: ItemCallback;
  // Refs exposed for programmatic resize detection (LayoutCanvas.tsx useEffect)
  resizeTrackingRef: React.MutableRefObject<ResizeTrackingState>;
  userResizedComponentIdRef: React.MutableRefObject<string | null>;
}

/**
 * Extracts resize start/stop handlers from LayoutCanvas.
 *
 * handleResizeStart marks which component is being resized and whether
 * it's a container (for synchronous ref-based checks during layout).
 * Also captures starting mouse position, dimensions, and handle direction
 * for resize tracking in static mode.
 *
 * handleResizeStop handles proportional child scaling when a container
 * width changes, vertical push when height or width increases, and
 * V4 API persistence.
 */
export function useCanvasResizeHandler({
  components,
  onComponentsChange,
  setCurrentlyResizingComponentId,
  isResizingContainerRef,
  onLayoutV4Change,
  resolution,
  cols,
  width,
  rowHeight,
  skipNextLayoutChangeRef,
  currentlyResizingComponentId,
  reverseMapFn,
}: UseCanvasResizeHandlerParams): CanvasResizeHandlers {
  // ============================================================================
  // RESIZE TRACKING REFS
  // ============================================================================
  const resizeTracking = useRef<ResizeTrackingState>({ ...initialResizeState });
  // Track component ID that was just resized by user (to distinguish from programmatic changes)
  const userResizedComponentIdRef = useRef<string | null>(null);

  // ============================================================================
  // RESIZE TRACKING: Track mouse position during RESIZE (independent of RGL)
  // This is needed because preventCollision=true blocks RGL's resize updates
  // when the resize would cause overlap with components below.
  // We track mouse position ourselves to calculate the INTENDED new dimensions.
  // ============================================================================
  useEffect(() => {
    // Only track resize in static mode when actively resizing
    if (!currentlyResizingComponentId) return;
    const rt = resizeTracking.current;
    // Need starting values to calculate delta
    if (rt.startMouseY === null || rt.startHeight === null) return;

    const colWidthCalc = width / cols;
    const handle = rt.handleDirection || '';

    const handleResizeMouseMove = (e: MouseEvent) => {
      // Pure horizontal handles (e, w) should NOT affect height
      const hasVerticalComponent = handle.includes('s') || handle.includes('n');

      if (hasVerticalComponent && rt.startMouseY !== null && rt.startHeight !== null) {
        const deltaY = e.clientY - rt.startMouseY;
        const isNorthHandle = handle.includes('n');
        // For north handles, invert the delta (dragging up = negative delta = increase height)
        const effectiveDeltaY = isNorthHandle ? -deltaY : deltaY;
        const deltaRows = Math.round(effectiveDeltaY / rowHeight);
        // Clamp to component's min/max height constraints
        const intendedHeight = Math.max(rt.minHeight, Math.min(rt.maxHeight, rt.startHeight + deltaRows));
        rt.intendedHeight = intendedHeight;
      }

      // Pure vertical handles (s, n) should NOT affect width
      const hasHorizontalComponent = handle.includes('e') || handle.includes('w');

      if (hasHorizontalComponent && rt.startMouseX !== null && rt.startWidth !== null) {
        const deltaX = e.clientX - rt.startMouseX;
        const isWestHandle = handle.includes('w');
        // For west handles, invert the delta (dragging left = negative delta = increase width)
        const effectiveDeltaX = isWestHandle ? -deltaX : deltaX;
        const deltaCols = Math.round(effectiveDeltaX / colWidthCalc);
        // Clamp to component's min/max width constraints (and grid cols limit).
        // Also clamp based on canvas boundary in the direction of the drag:
        //   East handle: right edge can't exceed the canvas (cols - startX)
        //   West handle: left edge can't go below 0, so max width = startX + startWidth
        const startX = rt.startX ?? 0;
        const canvasBoundaryMax = isWestHandle
          ? startX + rt.startWidth // west: left side moves, right side (startX+startWidth) is fixed
          : cols - startX; // east: right side moves, bounded by right canvas edge
        const intendedWidth = Math.max(
          rt.minWidth,
          Math.min(rt.maxWidth, cols, canvasBoundaryMax, rt.startWidth + deltaCols),
        );
        rt.intendedWidth = intendedWidth;
      }
    };

    document.addEventListener('mousemove', handleResizeMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
    };
  }, [currentlyResizingComponentId, rowHeight, width, cols]);

  // ============================================================================
  // HANDLE RESIZE START
  // ============================================================================
  const handleResizeStart: ItemCallback = useCallback(
    (
      _layout: Layout[],
      _oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
      element: HTMLElement,
    ) => {
      // Check if this is a container and set ref IMMEDIATELY (synchronously)
      const resizingComponent = components.find((comp) => comp.id === newItem.i);
      if (resizingComponent && ContainerManager.isContainer(resizingComponent)) {
        isResizingContainerRef.current = true;
      } else {
        isResizingContainerRef.current = false;
      }

      // Track which component is currently being resized
      setCurrentlyResizingComponentId(newItem.i);

      // ============================================================================
      // RESIZE TRACKING: Capture starting mouse position, dimensions, and handle direction
      // When preventCollision is true, RGL blocks resize that would cause overlap.
      // We track mouse movement ourselves to calculate the INTENDED new dimensions.
      // ============================================================================
      if (resizingComponent) {
        const rt = resizeTracking.current;
        rt.startMouseY = _e.clientY;
        rt.startMouseX = _e.clientX;
        rt.startHeight = resizingComponent.height;
        rt.startWidth = resizingComponent.width;
        rt.startX = resizingComponent.x; // For west resize X calculation
        rt.startY = resizingComponent.y; // For north resize Y calculation
        rt.intendedHeight = resizingComponent.height;
        rt.intendedWidth = resizingComponent.width;

        // Capture component's size constraints from display restrictions
        // Prefer component-level overrides (e.g., dynamic min-height) over registry defaults
        const componentRestrictions = resizingComponent.displayRestrictions;
        const registryRestrictions = getDisplayRestrictionsFromRegistry(resizingComponent.type as ValidControlType);
        if (componentRestrictions || registryRestrictions) {
          rt.minWidth = componentRestrictions?.minWidth ?? registryRestrictions?.minWidth ?? 1;
          rt.maxWidth = componentRestrictions?.maxWidth ?? registryRestrictions?.maxWidth ?? cols;
          rt.minHeight = componentRestrictions?.minHeight ?? registryRestrictions?.minHeight ?? 1;
          rt.maxHeight = componentRestrictions?.maxHeight ?? registryRestrictions?.maxHeight ?? 1000;
        } else {
          // Fallback to grid limits if no restrictions defined
          rt.minWidth = 1;
          rt.maxWidth = cols;
          rt.minHeight = 1;
          rt.maxHeight = 1000;
        }

        // Detect resize handle direction from the DOM element
        // RGL adds classes like 'react-resizable-handle-se', 'react-resizable-handle-w', etc.
        const target = _e.target as HTMLElement;
        const handleElement = target.closest('[class*="react-resizable-handle-"]');
        if (handleElement) {
          const classList = handleElement.className;
          const match = classList.match(/react-resizable-handle-([nsew]+)/);
          rt.handleDirection = match && match[1] ? match[1] : null;
        } else {
          rt.handleDirection = null;
        }
      }

      // Add resize feedback classes
      element.classList.add('rgl-resizing');
    },
    [components, cols, setCurrentlyResizingComponentId, isResizingContainerRef],
  );

  // ============================================================================
  // HANDLE RESIZE STOP
  // ============================================================================
  const handleResizeStop: ItemCallback = useCallback(
    (
      _newLayout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      _e: MouseEvent,
      element: HTMLElement,
    ) => {
      try {
        // Clear the ref flag FIRST (synchronously)
        isResizingContainerRef.current = false;

        // Clear the currently resizing component state
        setCurrentlyResizingComponentId(null);

        // Remove resize feedback classes
        element.classList.remove('rgl-resizing');

        // 🆕 DYNAMIC COLUMNS: Handle container resize with child position/width scaling
        // Also handles vertical push when container dimensions increase (static mode)
        const resizedComponent = components.find((comp) => comp.id === newItem.i);

        if (resizedComponent && ContainerManager.isContainer(resizedComponent) && onComponentsChange) {
          const oldWidth = oldItem.w;
          const oldHeight = oldItem.h;
          const rt = resizeTracking.current;
          // 🔧 FIX: Use mouse-tracked values when RGL limited the resize (partial OR full block).
          // RGL may allow partial resize up to collision point, but we want to push past it.
          // Check if intended > actual (RGL gave us less than we wanted).
          const rglHeightWasLimited = rt.intendedHeight !== null && rt.intendedHeight > newItem.h;
          const rglWidthWasLimited = rt.intendedWidth !== null && rt.intendedWidth > newItem.w;
          // Use intended dimensions when RGL limited us, otherwise use RGL's values (from callback)
          const newHeight = rglHeightWasLimited ? rt.intendedHeight! : newItem.h;
          const newWidth = rglWidthWasLimited ? rt.intendedWidth! : newItem.w;
          const widthChanged = oldWidth !== newWidth;
          const heightIncreased = newHeight > oldHeight;
          const widthIncreased = newWidth > oldWidth;
          // Push when height OR width increases (vertical push down)
          const needsPush = heightIncreased || widthIncreased;

          // 🔧 FIX: Trust RGL's newItem.x for west resize - RGL handles it correctly.
          // Only override X when we're pushing past RGL's collision limits.
          const isWestResize = rt.handleDirection?.includes('w') ?? false;
          let newX = newItem.x; // RGL handles west resize X correctly
          if (rglWidthWasLimited && isWestResize && rt.startX !== null && rt.startWidth !== null) {
            // West resize past collision: X = startX - (newWidth - startWidth)
            newX = Math.max(0, rt.startX - (newWidth - rt.startWidth));
          }

          // 🔧 FIX: Trust RGL's newItem.y - only override when pushing past collision
          const newY = rglHeightWasLimited && rt.startY !== null ? rt.startY : newItem.y;

          // Start with current components
          let updatedComponents = [...components];

          // Handle width change - scale children proportionally
          if (widthChanged) {
            const scaleFactor = newWidth / oldWidth;
            const isGrowing = newWidth > oldWidth;

            updatedComponents = updatedComponents.map((comp) => {
              if (comp.id === resizedComponent.id) {
                // Update container size AND position (critical for West handle resize)
                return {
                  ...comp,
                  x: newX,
                  y: newY,
                  width: newWidth,
                  height: newHeight,
                };
              } else if (comp.containerId === resizedComponent.id) {
                // 🔧 PROPORTIONAL SCALING: Scale child width and position based on container resize
                let scaledWidth = Math.round(comp.width * scaleFactor);
                let scaledX = Math.round(comp.x * scaleFactor);

                if (isGrowing) {
                  scaledWidth = Math.min(scaledWidth, newWidth);
                  const maxX = newWidth - scaledWidth;
                  scaledX = Math.min(scaledX, maxX);
                } else {
                  scaledWidth = Math.min(scaledWidth, newWidth);
                  const maxX = newWidth - scaledWidth;
                  scaledX = Math.min(Math.max(0, scaledX), maxX);
                }

                return {
                  ...comp,
                  x: scaledX,
                  width: scaledWidth,
                };
              }
              return comp;
            });
          } else {
            // Width didn't change, just update container dimensions
            updatedComponents = updatedComponents.map((comp) => {
              if (comp.id === resizedComponent.id) {
                return {
                  ...comp,
                  x: newX,
                  y: newY,
                  width: newWidth,
                  height: newHeight,
                };
              }
              return comp;
            });
          }

          // ============================================================================
          // VERTICAL PUSH: Push components when height OR width increases (static mode)
          // ============================================================================
          if (needsPush) {
            // Get main canvas components for push calculation
            const mainCanvasComponents = updatedComponents.filter((c) => !c.containerId);
            const layoutItems = componentsToLayoutItems(mainCanvasComponents);

            // Create the resized container at its new dimensions (using correct X/Y)
            const resizedLayoutItem: PushLayoutItem = {
              i: newItem.i,
              x: newX,
              y: newY,
              w: newWidth,
              h: newHeight,
            };

            // Calculate push (handles both height and width increase)
            const pushResult = calculateResizePush(resizedLayoutItem, oldWidth, oldHeight, layoutItems);

            if (pushResult.hasPushed) {
              // Apply pushed positions to main canvas components
              updatedComponents = updatedComponents.map((comp) => {
                // Skip container children - they move with their container
                if (comp.containerId) return comp;
                // Skip the resized container itself - already updated
                if (comp.id === resizedComponent.id) return comp;

                // Find pushed position
                const pushedItem = pushResult.layout.find((l) => l.i === comp.id);
                if (pushedItem) {
                  return { ...comp, y: pushedItem.y };
                }

                return comp;
              });
            }

            // Skip handleLayoutChange to prevent RGL from overwriting pushed positions
            skipNextLayoutChangeRef.current = true;
            setTimeout(() => {
              skipNextLayoutChangeRef.current = false;
            }, 200);
          }

          // Persist to V4 API
          if (onLayoutV4Change) {
            const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);
            const layoutCanvasStructure = {
              canvasId: null,
              type: 'Grid',
              size: 12,
              content: nestedStructure,
            };
            onLayoutV4Change(layoutCanvasStructure as any);
          }

          // Mark this component as user-resized so programmatic change detection skips it
          userResizedComponentIdRef.current = newItem.i;

          onComponentsChange(reverseMapFn ? reverseMapFn(updatedComponents) : updatedComponents);

          // Clear resize tracking state
          resizeTracking.current = { ...initialResizeState };

          return; // Container resize handled, exit early
        }

        // ============================================================================
        // VERTICAL PUSH: Handle non-container resize in static mode
        // ============================================================================
        if (resizedComponent && !ContainerManager.isContainer(resizedComponent) && !resizedComponent.containerId) {
          const rt = resizeTracking.current;
          // 🔧 FIX: Use mouse-tracked values when RGL limited the resize (partial OR full block).
          // RGL may allow partial resize up to collision point, but we want to push past it.
          // Check if intended > actual (RGL gave us less than we wanted).
          const rglHeightWasLimited = rt.intendedHeight !== null && rt.intendedHeight > newItem.h;
          const rglWidthWasLimited = rt.intendedWidth !== null && rt.intendedWidth > newItem.w;
          // Use intended dimensions when RGL limited us, otherwise use RGL's values (from callback)
          const intendedHeight = rglHeightWasLimited ? rt.intendedHeight! : newItem.h;
          const intendedWidth = rglWidthWasLimited ? rt.intendedWidth! : newItem.w;
          const heightIncreased = intendedHeight > oldItem.h;
          const widthIncreased = intendedWidth > oldItem.w;
          // Push when height OR width increases (vertical push down)
          const needsPush = heightIncreased || widthIncreased;

          // 🔧 FIX: Trust RGL's newItem.x for west resize - RGL handles it correctly.
          // Only override X when we're pushing past RGL's collision limits.
          const isWestResize = rt.handleDirection?.includes('w') ?? false;
          let intendedX = newItem.x; // RGL handles west resize X correctly
          if (rglWidthWasLimited && isWestResize && rt.startX !== null && rt.startWidth !== null) {
            intendedX = Math.max(0, rt.startX - (intendedWidth - rt.startWidth));
          }

          if (needsPush && onComponentsChange) {
            // Get main canvas components for push calculation
            const mainCanvasComponents = components.filter((c) => !c.containerId);
            const layoutItems = componentsToLayoutItems(mainCanvasComponents);

            // 🔧 FIX: Trust RGL's newItem.y - only override when pushing past collision
            const resizedY = rglHeightWasLimited && rt.startY !== null ? rt.startY : newItem.y;

            // Create the resized item at its new dimensions (using correct X for west resize)
            const resizedLayoutItem: PushLayoutItem = {
              i: newItem.i,
              x: intendedX,
              y: resizedY,
              w: intendedWidth,
              h: intendedHeight,
            };

            // Calculate push (handles both height and width increase)
            const pushResult = calculateResizePush(resizedLayoutItem, oldItem.w, oldItem.h, layoutItems);

            // Apply resize and pushed positions to components
            // IMPORTANT: Always apply the resize, even if no other items were pushed
            const updatedComponents = components.map((comp) => {
              // Skip components in containers
              if (comp.containerId) return comp;

              if (comp.id === resizedComponent.id) {
                // Update the resized component with intended dimensions
                return {
                  ...comp,
                  x: intendedX,
                  y: resizedY,
                  width: intendedWidth,
                  height: intendedHeight,
                };
              }

              // Find pushed position (only if push happened)
              if (pushResult.hasPushed) {
                const pushedItem = pushResult.layout.find((l) => l.i === comp.id);
                if (pushedItem) {
                  return { ...comp, y: pushedItem.y };
                }
              }

              return comp;
            });

            // Persist to V4 API
            if (onLayoutV4Change) {
              const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);
              const layoutCanvasStructure = {
                canvasId: null,
                type: 'Grid',
                size: 12,
                content: nestedStructure,
              };
              onLayoutV4Change(layoutCanvasStructure as any);
            }

            // Mark this component as user-resized so programmatic change detection skips it
            userResizedComponentIdRef.current = newItem.i;

            onComponentsChange(reverseMapFn ? reverseMapFn(updatedComponents) : updatedComponents);

            // Skip handleLayoutChange to prevent RGL from overwriting our positions
            skipNextLayoutChangeRef.current = true;
            setTimeout(() => {
              skipNextLayoutChangeRef.current = false;
            }, 200);

            // Clear resize tracking state
            resizeTracking.current = { ...initialResizeState };

            return; // Resize applied, exit early
          }
        }

        // For non-push resize (shrinking/no collision), save position explicitly.
        // handleLayoutChange is guarded against saving compacted positions when the
        // visibility toggle is OFF, so we must save directly from the stop handler.
        if (resizedComponent) {
          userResizedComponentIdRef.current = resizedComponent.id;

          if (!resizedComponent.containerId && onComponentsChange) {
            const sizeChanged =
              newItem.w !== oldItem.w || newItem.h !== oldItem.h || newItem.x !== oldItem.x || newItem.y !== oldItem.y;

            if (sizeChanged) {
              const updatedComponents = components.map((comp) => {
                if (comp.id === resizedComponent.id) {
                  return { ...comp, x: newItem.x, y: newItem.y, width: newItem.w, height: newItem.h };
                }
                return comp;
              });

              if (onLayoutV4Change) {
                const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);
                onLayoutV4Change({
                  canvasId: null,
                  type: 'Grid',
                  size: 12,
                  content: nestedStructure,
                } as any);
              }

              onComponentsChange(reverseMapFn ? reverseMapFn(updatedComponents) : updatedComponents);

              skipNextLayoutChangeRef.current = true;
              setTimeout(() => {
                skipNextLayoutChangeRef.current = false;
              }, 200);
            }
          }
        }

        // Clear resize tracking state (if needsPush was false - shrinking or no change)
        resizeTracking.current = { ...initialResizeState };
      } catch (error) {
        console.error('Error in handleResizeStop:', error);
      } finally {
        // 🔧 CRITICAL: Always ensure refs are cleared, even if there's an error
        isResizingContainerRef.current = false;
        // Also clear resize tracking state in case of error
        resizeTracking.current = { ...initialResizeState };
      }
    },
    [
      components,
      onComponentsChange,
      onLayoutV4Change,
      resolution,
      cols,
      setCurrentlyResizingComponentId,
      isResizingContainerRef,
      skipNextLayoutChangeRef,
    ],
  );

  return { handleResizeStart, handleResizeStop, resizeTrackingRef: resizeTracking, userResizedComponentIdRef };
}
