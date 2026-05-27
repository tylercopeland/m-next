import React, { useCallback, useEffect, useRef } from 'react';
import { Layout } from 'react-grid-layout';
import { CurrentState } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import { ResponsiveComponent, WidgetType } from '../rgl-integration/types';
import { ContainerManager } from '../containers/utils/ContainerManager';
import { ContainerDropTarget } from '../containers/ContainerTypes';
import { getCustomComponentSize } from '../utils/componentSizing';
import { generateUniqueComponentName, Field } from '../utils/componentNaming';
import { getComponentDefaultsFromRegistry, getDisplayRestrictionsFromRegistry } from '../registry/registryUtils';
import { ValidControlType } from '@m-next/runtime-interface';
import { DragPreview, InsertModeState } from './useCanvasDragState';
import { calculateInsertPush } from '../utils/insertPushCalculator';
import { LayoutItem as PushLayoutItem } from '../utils/verticalPushCalculator';
import { detectInsertPosition, calculateInsertIndicator } from '../utils/insertDetection';
import { clientToGridCoords } from '../utils/gridCoordinateUtils';

// Throttle settings for insert detection during drag
const INSERT_DETECTION_THROTTLE_MS = 50; // Minimum time between insert detection calculations
const INSERT_DETECTION_POSITION_THRESHOLD = 5; // Minimum pixel movement to trigger recalculation
const MAIN_CANVAS_GRID_PADDING_PX = 8;

export interface UseCanvasDropHandlerParams {
  components: ResponsiveComponent[];
  onComponentsChange: ((components: ResponsiveComponent[]) => void) | null;
  fieldList: Field[] | null;

  // Drag state (from useCanvasDragState)
  isDragOver: boolean;
  setIsDragOver: React.Dispatch<React.SetStateAction<boolean>>;
  setDragPreview: React.Dispatch<React.SetStateAction<DragPreview>>;
  setInvalidDropTargetId: React.Dispatch<React.SetStateAction<string | null>>;
  setDragOverCanvas: React.Dispatch<React.SetStateAction<string | null>>;
  clearAllDragStates: () => void;
  isFirstDragOverRef: React.MutableRefObject<boolean>;

  // Insert mode state (from useCanvasDragState)
  insertModeStateRef: React.MutableRefObject<InsertModeState>;
  setInsertMode: (state: InsertModeState) => void;
  clearInsertMode: () => void;

  // Grid configuration for insert detection
  cols: number;
  colWidth: number;

  // Refs for coordination
  layoutChangeTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  skipNextLayoutChangeRef: React.MutableRefObject<boolean>;
  onNestedDropRef: React.MutableRefObject<
    | ((
        e: React.DragEvent,
        targetContainerId: string,
        position?: { x: number; y: number; w: number; h: number },
      ) => void)
    | null
  >;

  // Configuration
  rowHeight: number;

  // Ref to the current presented layout (with hidden components collapsed to h=0)
  // Used to build push layout items with the correct (presented) heights
  presentedComponentsRef: React.RefObject<ResponsiveComponent[]>;

  // Drop detection
  detectDropTarget: (
    dropX: number,
    dropY: number,
    draggedComponentType: WidgetType,
    draggedComponent?: ResponsiveComponent,
    paletteDropSize?: { width: number; height: number },
  ) => ContainerDropTarget;
}

export interface CanvasDropHandlers {
  handleDropDragOver: (e: React.DragEvent) => { w: number; h: number } | false;
  handleGridDrop: (layout: Layout[], layoutItem: Layout, e: Event) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragOverWithInsert: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  onNestedDrop: (
    e: React.DragEvent,
    targetContainerId: string,
    position?: { x: number; y: number; w: number; h: number },
  ) => void;
  onNestedDragOver: (e: React.DragEvent, canvasId: string) => void;
  onNestedDragLeave: (e: React.DragEvent) => void;
  onComponentDragStart: (e: React.DragEvent, componentId: string, parentId: string) => void;
}

function getVisibleContainerDropTarget(
  target: HTMLElement | null,
  clientX?: number,
  clientY?: number,
): HTMLElement | null {
  if (!target) return null;

  const directDropZone = target.closest('.layout-container-drop-zone') as HTMLElement | null;
  const containerWrapper = target.closest('.layout-container-wrapper') as HTMLElement | null;
  if (!containerWrapper && !directDropZone) return null;

  const hasPointerCoords = Number.isFinite(clientX) && Number.isFinite(clientY);
  if (!hasPointerCoords) {
    return containerWrapper ?? directDropZone;
  }

  const dropZone =
    directDropZone ?? (containerWrapper?.querySelector('.layout-container-drop-zone') as HTMLElement | null);
  const rect = dropZone?.getBoundingClientRect() ?? containerWrapper?.getBoundingClientRect();
  if (!rect) {
    return containerWrapper ?? directDropZone;
  }
  const x = Number(clientX);
  const y = Number(clientY);

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    return null;
  }

  return containerWrapper ?? directDropZone;
}

function isVisibleContainerDropZoneTarget(target: HTMLElement | null, clientX?: number, clientY?: number): boolean {
  return getVisibleContainerDropTarget(target, clientX, clientY) !== null;
}

/**
 * Extracts palette-drop and container-drop handlers from LayoutCanvas.
 *
 * Handles:
 *   - handleDropDragOver: tells RGL what size placeholder to show
 *   - handleGridDrop: creates a new component on canvas or forwards to container
 *   - handleDragOver / handleDragLeave: visual drag-over state
 *   - onNestedDrop / onNestedDragOver / onNestedDragLeave: container drop delegation
 *   - onComponentDragStart: initiates intra-canvas component drag
 */
export function useCanvasDropHandler({
  components,
  onComponentsChange,
  fieldList,
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
  presentedComponentsRef,
  detectDropTarget,
}: UseCanvasDropHandlerParams): CanvasDropHandlers {
  const getComponentDefaults = useCallback(getComponentDefaultsFromRegistry, []);

  // Throttle refs for insert detection - prevents excessive calculations during palette drag
  const lastInsertDetectionTime = useRef<number>(0);
  const lastInsertDetectionPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const nestedDragOverClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lazy cache for layout items built from components — avoids filter+map on every dragover tick
  const layoutItemsCacheRef = useRef<{
    sourceComponents: typeof components;
    // TODO: convert to layout type when ResponsiveComponent is split into (Controls, Layout[])
    sourcePresentedComponents: ResponsiveComponent[] | null;
    items: Array<{ i: string; x: number; y: number; w: number; h: number }>;
  } | null>(null);

  // Cache for component size by type — registry lookup is expensive at 60/s
  const componentSizeCacheRef = useRef<{ type: string; size: { width: number; height: number } } | null>(null);

  // RGL's onDropDragOver handler — returns placeholder size AND handles insert mode detection
  const handleDropDragOver = useCallback(
    (e: React.DragEvent) => {
      const dropTarget = e.target as HTMLElement;
      const isContainerDropZone = isVisibleContainerDropZoneTarget(dropTarget, e.clientX, e.clientY);

      const crossGridSize =
        ((window as unknown as Record<string, unknown>).__rglCrossGridDragSize as
          | { w?: number; h?: number }
          | undefined) ?? null;
      const crossGridTargetType = (window as unknown as Record<string, unknown>).__rglCrossGridTargetType as
        | 'canvas'
        | 'container'
        | undefined;

      if (
        crossGridTargetType === 'canvas' &&
        typeof crossGridSize?.w === 'number' &&
        typeof crossGridSize?.h === 'number'
      ) {
        const crossGridWidth = crossGridSize.w;
        const crossGridHeight = crossGridSize.h;
        const pointerClientX = Number.isFinite(e.clientX) ? e.clientX : 0;
        const pointerClientY = Number.isFinite(e.clientY) ? e.clientY : 0;
        const now = Date.now();
        const lastPos = lastInsertDetectionPos.current;
        const dx = Math.abs(pointerClientX - lastPos.x);
        const dy = Math.abs(pointerClientY - lastPos.y);
        const timeSinceLastDetection = now - lastInsertDetectionTime.current;
        const shouldRunInsertDetection =
          timeSinceLastDetection >= INSERT_DETECTION_THROTTLE_MS ||
          dx >= INSERT_DETECTION_POSITION_THRESHOLD ||
          dy >= INSERT_DETECTION_POSITION_THRESHOLD;

        const dropTargetEl = e.target as HTMLElement;
        const rglElement = dropTargetEl.closest('.react-grid-layout');
        const activeInsertState = insertModeStateRef.current;
        // Keep the preview aligned with the currently rendered insert line between throttled detection ticks.
        let targetCol: number | null = activeInsertState.isActive ? activeInsertState.targetCol : null;
        let targetRow: number | null = activeInsertState.isActive ? activeInsertState.targetRow : null;

        if (shouldRunInsertDetection) {
          lastInsertDetectionTime.current = now;
          lastInsertDetectionPos.current = { x: pointerClientX, y: pointerClientY };

          if (rglElement) {
            const canvasRect = rglElement.getBoundingClientRect();
            const mouseX = pointerClientX - canvasRect.left - MAIN_CANVAS_GRID_PADDING_PX;
            const mouseY = pointerClientY - canvasRect.top - MAIN_CANVAS_GRID_PADDING_PX;
            const actualColWidth = (canvasRect.width - MAIN_CANVAS_GRID_PADDING_PX * 2) / cols;

            // Use layout items cache (Change 5)
            const currentPresented = presentedComponentsRef.current ?? null;
            if (
              !layoutItemsCacheRef.current ||
              layoutItemsCacheRef.current.sourceComponents !== components ||
              layoutItemsCacheRef.current.sourcePresentedComponents !== currentPresented
            ) {
              const presentedMap = new Map((currentPresented ?? []).map((c) => [c.id, c]));
              layoutItemsCacheRef.current = {
                sourceComponents: components,
                sourcePresentedComponents: currentPresented,
                items: components
                  .filter((c) => !c.containerId)
                  .map((c) => {
                    const presented = presentedMap.get(c.id);
                    return {
                      i: c.id,
                      x: presented?.x ?? c.x,
                      y: presented?.y ?? c.y,
                      w: presented?.width ?? c.width,
                      h: presented?.height ?? c.height,
                    };
                  })
                  .filter((item) => item.h > 0),
              };
            }
            const layoutItems = layoutItemsCacheRef.current.items;

            const insertPosition = detectInsertPosition(
              mouseX,
              mouseY,
              crossGridWidth,
              crossGridHeight,
              layoutItems,
              rowHeight,
              actualColWidth,
              cols,
              mouseY,
              mouseX,
            );
            targetCol = insertPosition.col;
            targetRow = insertPosition.row;

            if (insertPosition.wouldCausePush) {
              const indicatorState = calculateInsertIndicator({
                insertPosition,
                draggedWidth: crossGridWidth,
                rowHeight,
                fallbackColWidth: actualColWidth,
                rglElement,
                components,
              });
              // Change 4: dedup — only update if state actually changed
              const prev = insertModeStateRef.current;
              const changed =
                !prev.isActive ||
                prev.indicatorX !== indicatorState.indicatorX ||
                prev.indicatorY !== indicatorState.indicatorY ||
                prev.indicatorWidth !== indicatorState.indicatorWidth ||
                prev.targetRow !== indicatorState.targetRow ||
                prev.targetCol !== indicatorState.targetCol;
              if (changed) {
                setInsertMode(indicatorState);
              }
            } else {
              clearInsertMode();
            }
          }
        }

        setDragPreview((prev) => {
          if (!prev.visible || prev.targetType !== 'canvas' || !prev.position) return prev;
          const nextX = targetCol ?? prev.position.x;
          const nextY = targetRow ?? prev.position.y;
          if (
            prev.position.x === nextX &&
            prev.position.y === nextY &&
            prev.position.w === crossGridWidth &&
            prev.position.h === crossGridHeight
          ) {
            return prev;
          }
          return {
            ...prev,
            position: {
              ...prev.position,
              x: nextX,
              y: nextY,
              w: crossGridWidth,
              h: crossGridHeight,
            },
          };
        });

        return { w: crossGridWidth, h: crossGridHeight };
      }

      if (isContainerDropZone) {
        clearInsertMode();
        return false;
      }

      const componentType = (e.dataTransfer?.getData('componentType') ||
        // @ts-expect-error - __draggedComponentType is not a standard window property
        (window as Record<string, unknown>).__draggedComponentType) as WidgetType;

      if (!componentType) {
        clearInsertMode();
        return { w: 2, h: 2 };
      }

      // Palette-only wrapper handoff: if the pointer is over a container wrapper (including header/top strip),
      // yield from main-canvas insert mode immediately so container visuals can take over.
      // Existing canvas/cross-grid drags keep the separate seam behavior.
      if (!crossGridTargetType) {
        const wrapperTarget = dropTarget.closest('.layout-container-wrapper') as HTMLElement | null;
        if (wrapperTarget) {
          const wrapperRect = wrapperTarget.getBoundingClientRect();
          const withinWrapper =
            e.clientX >= wrapperRect.left &&
            e.clientX <= wrapperRect.right &&
            e.clientY >= wrapperRect.top &&
            e.clientY <= wrapperRect.bottom;
          if (withinWrapper) {
            const wrapperContainerId = wrapperTarget.getAttribute('data-container-id');
            if (wrapperContainerId) {
              setDragOverCanvas(wrapperContainerId);
            }
            clearInsertMode();
            return false;
          }
        }
      }

      // Geometric check: if the pointer is over a container area, skip insert detection
      // for palette drags. The DOM-based isContainerDropZone check above can miss cases
      // where the event target is the main canvas grid but the pointer is geometrically
      // over a container (e.g. dragging into a container from the top).
      const paletteCanvasEl = dropTarget.closest('.react-grid-layout')?.parentElement as HTMLElement | null;
      if (paletteCanvasEl) {
        const paletteCanvasRect = paletteCanvasEl.getBoundingClientRect();
        const geoDropX = e.clientX - paletteCanvasRect.left + paletteCanvasEl.scrollLeft;
        const geoDropY = e.clientY - paletteCanvasRect.top + paletteCanvasEl.scrollTop;
        // Use cached size (same cache populated inside throttle gate below)
        if (!componentSizeCacheRef.current || componentSizeCacheRef.current.type !== componentType) {
          componentSizeCacheRef.current = { type: componentType, size: getCustomComponentSize(componentType) };
        }
        const geoTarget = detectDropTarget(
          geoDropX,
          geoDropY,
          componentType,
          undefined,
          componentSizeCacheRef.current.size,
        );
        if (geoTarget.type === 'container' && geoTarget.validDrop) {
          if (geoTarget.containerId) {
            setDragOverCanvas(geoTarget.containerId);
          }
          clearInsertMode();
          return false;
        }
      }

      // --- Insert mode detection (throttled) ---
      // Throttle insert detection to avoid excessive calculations
      const now = Date.now();
      const lastPos = lastInsertDetectionPos.current;
      const dx = Math.abs(e.clientX - lastPos.x);
      const dy = Math.abs(e.clientY - lastPos.y);
      const timeSinceLastDetection = now - lastInsertDetectionTime.current;

      // Only run insert detection if enough time has passed OR mouse moved significantly
      const shouldRunInsertDetection =
        timeSinceLastDetection >= INSERT_DETECTION_THROTTLE_MS ||
        dx >= INSERT_DETECTION_POSITION_THRESHOLD ||
        dy >= INSERT_DETECTION_POSITION_THRESHOLD;

      if (shouldRunInsertDetection) {
        // Update throttle tracking
        lastInsertDetectionTime.current = now;
        lastInsertDetectionPos.current = { x: e.clientX, y: e.clientY };

        // Get canvas element and calculate position
        const rglElement = dropTarget.closest('.react-grid-layout');
        if (rglElement) {
          const canvasRect = rglElement.getBoundingClientRect();
          const mouseX = e.clientX - canvasRect.left - MAIN_CANVAS_GRID_PADDING_PX;
          const mouseY = e.clientY - canvasRect.top - MAIN_CANVAS_GRID_PADDING_PX;
          const actualColWidth = (canvasRect.width - MAIN_CANVAS_GRID_PADDING_PX * 2) / cols;

          // Registry lookup cached per component type (Change 6: runs ~20/s instead of 60/s)
          if (!componentSizeCacheRef.current || componentSizeCacheRef.current.type !== componentType) {
            componentSizeCacheRef.current = { type: componentType, size: getCustomComponentSize(componentType) };
          }
          const defaultSize = componentSizeCacheRef.current.size;
          const draggedWidth = defaultSize.width;
          const draggedHeight = defaultSize.height;

          // Build layout items using cache (Change 5: avoids filter+map on every tick)
          const currentPresented = presentedComponentsRef.current ?? null;
          if (
            !layoutItemsCacheRef.current ||
            layoutItemsCacheRef.current.sourceComponents !== components ||
            layoutItemsCacheRef.current.sourcePresentedComponents !== currentPresented
          ) {
            const presentedMap = new Map((currentPresented ?? []).map((c) => [c.id, c]));
            layoutItemsCacheRef.current = {
              sourceComponents: components,
              sourcePresentedComponents: currentPresented,
              items: components
                .filter((c) => !c.containerId)
                .map((c) => {
                  const presented = presentedMap.get(c.id);
                  return {
                    i: c.id,
                    x: presented?.x ?? c.x,
                    y: presented?.y ?? c.y,
                    w: presented?.width ?? c.width,
                    h: presented?.height ?? c.height,
                  };
                })
                .filter((item) => item.h > 0),
            };
          }
          const layoutItems = layoutItemsCacheRef.current.items;

          // Detect insert position
          const insertPosition = detectInsertPosition(
            mouseX,
            mouseY,
            draggedWidth,
            draggedHeight,
            layoutItems,
            rowHeight,
            actualColWidth,
            cols,
            mouseY,
            mouseX,
          );

          // Change 4: compare before updating to avoid redundant state updates
          if (insertPosition.wouldCausePush) {
            const indicatorState = calculateInsertIndicator({
              insertPosition,
              draggedWidth,
              rowHeight,
              fallbackColWidth: actualColWidth,
              rglElement,
              components,
            });
            const prev = insertModeStateRef.current;
            const changed =
              !prev.isActive ||
              prev.indicatorX !== indicatorState.indicatorX ||
              prev.indicatorY !== indicatorState.indicatorY ||
              prev.indicatorWidth !== indicatorState.indicatorWidth ||
              prev.targetRow !== indicatorState.targetRow ||
              prev.targetCol !== indicatorState.targetCol;
            if (changed) {
              setInsertMode(indicatorState);
            }
          } else {
            clearInsertMode();
          }
        }
      }

      // Return placeholder size using cache (avoids registry lookup when throttle gate didn't run)
      if (!componentSizeCacheRef.current || componentSizeCacheRef.current.type !== componentType) {
        componentSizeCacheRef.current = { type: componentType, size: getCustomComponentSize(componentType) };
      }
      const { width, height } = componentSizeCacheRef.current.size;
      return { w: width, h: height };
    },
    [components, rowHeight, colWidth, cols, setInsertMode, clearInsertMode, setDragPreview, insertModeStateRef],
  );

  // RGL's onDrop handler — creates new component
  const handleGridDrop = useCallback(
    (_layout: Layout[], layoutItem: Layout, e: Event) => {
      const event = e as DragEvent;
      const componentType = (event.dataTransfer?.getData('componentType') ||
        (window as unknown as Record<string, unknown>).__draggedComponentType) as WidgetType;

      if (!componentType || !onComponentsChange) {
        return;
      }

      // Check if the drop target is a container's drop zone
      const dropTarget = event.target as HTMLElement;
      const containerWrapper = getVisibleContainerDropTarget(dropTarget, event.clientX, event.clientY);
      const isContainerDropZone = Boolean(containerWrapper);

      if (isContainerDropZone) {
        // Forward drop to container via onNestedDrop with calculated position
        if (containerWrapper && onNestedDropRef.current) {
          const containerId = containerWrapper.getAttribute('data-container-id');
          if (containerId) {
            const nestedGrid = containerWrapper.querySelector('.react-grid-layout.nested-layout') as HTMLElement | null;
            const dropZone = containerWrapper.querySelector('.layout-container-drop-zone');
            const rect =
              nestedGrid?.getBoundingClientRect() ||
              dropZone?.getBoundingClientRect() ||
              containerWrapper.getBoundingClientRect();

            const containerComponent = components.find((c) => c.id === containerId);
            const containerCols = containerComponent?.width || 8;
            const containerRowH = rowHeight || 30;
            const targetPadding = Number(containerWrapper.getAttribute('data-container-padding')) || 0;
            const projection = clientToGridCoords({
              clientX: event.clientX,
              clientY: event.clientY,
              rect,
              cols: containerCols,
              rowHeight: containerRowH,
              padding: targetPadding,
            });

            const defaultSize = getCustomComponentSize(componentType);
            const position = { x: projection.x, y: projection.y, w: defaultSize.width, h: defaultSize.height };

            // Create synthetic event with mocked dataTransfer
            const mockDataTransfer = {
              getData: (key: string) => {
                if (key === 'componentType') return componentType;
                if (key === 'componentConfig') return event.dataTransfer?.getData('componentConfig') || '';
                if (key === 'text/plain') return event.dataTransfer?.getData('text/plain') || '';
                return '';
              },
              setData: () => {},
              clearData: () => {},
              effectAllowed: event.dataTransfer?.effectAllowed || 'all',
              dropEffect: event.dataTransfer?.dropEffect || 'none',
              files: event.dataTransfer?.files || ([] as unknown as FileList),
              items: event.dataTransfer?.items || ([] as unknown as DataTransferItemList),
              types: event.dataTransfer?.types || [],
            };

            const syntheticEvent = {
              ...event,
              preventDefault: () => event.preventDefault(),
              stopPropagation: () => event.stopPropagation(),
              dataTransfer: mockDataTransfer,
            } as unknown as React.DragEvent;

            onNestedDropRef.current(syntheticEvent, containerId, position);
          }
        }

        clearAllDragStates();
        isFirstDragOverRef.current = true;
        return;
      }

      // Detect if dropping into a container via geometric detection
      const canvasElement = document.querySelector('.react-grid-layout')?.parentElement;
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const dropX = event.clientX - canvasRect.left + canvasElement.scrollLeft;
      const dropY = event.clientY - canvasRect.top + canvasElement.scrollTop;

      const componentDefaults = getComponentDefaults(componentType as ValidControlType);
      const uniqueName = generateUniqueComponentName(componentType, components, fieldList);
      const displayRestrictions = getDisplayRestrictionsFromRegistry(componentType as ValidControlType);
      const defaultSize = getCustomComponentSize(componentType);

      const containerDropTarget = detectDropTarget(dropX, dropY, componentType, undefined, defaultSize);

      const properGuid = Guid.create();

      // Check if insert mode is active - if so, use insert position instead of RGL placeholder position.
      // Insert mode only applies to canvas drops — container drops use RGL's layout position.
      const insertState = insertModeStateRef.current;
      const isContainerDrop = containerDropTarget.type === 'container' && containerDropTarget.validDrop;
      const useInsertMode = insertState.isActive && !isContainerDrop;

      // Determine final position - use insert mode position if active, otherwise RGL position
      const finalX = useInsertMode ? insertState.targetCol : layoutItem.x;
      const finalY = useInsertMode ? insertState.targetRow : layoutItem.y;

      let newComponent: ResponsiveComponent;
      if (isContainerDrop) {
        newComponent = {
          ...componentDefaults,
          id: properGuid,
          type: componentType,
          x: finalX,
          y: finalY,
          width: defaultSize.width,
          height: defaultSize.height,
          content: uniqueName,
          name: uniqueName,
          caption: uniqueName,
          currentState: CurrentState.REGULAR,
          containerId: containerDropTarget.containerId!,
          static: false,
          displayRestrictions,
        };
      } else {
        newComponent = {
          ...componentDefaults,
          id: properGuid,
          type: componentType,
          x: finalX,
          y: finalY,
          width: defaultSize.width,
          height: defaultSize.height,
          content: uniqueName,
          name: uniqueName,
          caption: uniqueName,
          currentState: CurrentState.REGULAR,
          containerId: null,
          static: false,
          displayRestrictions,
        };
      }

      // Clear pending debounced layout updates before adding new component
      if (layoutChangeTimeoutRef.current) {
        clearTimeout(layoutChangeTimeoutRef.current);
        layoutChangeTimeoutRef.current = null;
      }

      let updatedComponents: ResponsiveComponent[];

      // If insert mode is active, calculate and apply push
      if (useInsertMode && !newComponent.containerId) {
        // Build layout items for push calculation (main canvas only)
        // Use presented heights so hidden components (h=0) are not incorrectly
        // treated as full-height items during collision detection.
        const presentedMap = new Map((presentedComponentsRef.current ?? []).map((c) => [c.id, c]));
        const mainCanvasComponents = components.filter((c) => !c.containerId);
        const layoutItems: PushLayoutItem[] = mainCanvasComponents.map((comp) => {
          const presented = presentedMap.get(comp.id);
          return {
            i: comp.id,
            x: presented?.x ?? comp.x,
            y: presented?.y ?? comp.y,
            w: presented?.width ?? comp.width,
            h: presented?.height ?? comp.height,
          };
        });

        // Create inserted item for push calculation
        const insertedItem: PushLayoutItem = {
          i: newComponent.id,
          x: newComponent.x,
          y: newComponent.y,
          w: newComponent.width,
          h: newComponent.height,
        };

        // Calculate push - this will move overlapping components down
        const pushResult = calculateInsertPush(insertedItem, layoutItems);

        // Apply pushed positions to existing components
        updatedComponents = components.map((comp) => {
          if (comp.containerId) return comp; // Skip container children

          const pushedItem = pushResult.layout.find((l) => l.i === comp.id);
          if (pushedItem && pushedItem.y !== comp.y) {
            return { ...comp, y: pushedItem.y };
          }
          return comp;
        });

        // Add the new component
        updatedComponents = [...updatedComponents, newComponent];

        // Skip next layout change to prevent RGL from overwriting our positions
        skipNextLayoutChangeRef.current = true;
        setTimeout(() => {
          skipNextLayoutChangeRef.current = false;
        }, 200);
      } else {
        // No insert mode - just add the component normally
        updatedComponents = [...components, newComponent];
      }

      onComponentsChange(updatedComponents);
      clearInsertMode();
      clearAllDragStates();
    },
    [components, onComponentsChange, getComponentDefaults, fieldList, clearAllDragStates, clearInsertMode],
  );

  // Enhanced drag over with visual feedback
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (!isDragOver) {
        setIsDragOver(true);
      }

      const componentType = (window as unknown as Record<string, unknown>).__draggedComponentType || null;
      if (componentType) {
        e.dataTransfer.dropEffect = 'copy';
      }
    },
    [isDragOver],
  );

  // Simplified drag over handler: insert detection is handled by handleDropDragOver (RGL's onDropDragOver).
  // This handler only needs to set dropEffect so the browser shows the correct cursor.
  const handleDragOverWithInsert = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // @ts-expect-error - __draggedComponentType is not a standard window property
    const componentType = (window as Record<string, unknown>).__draggedComponentType;
    if (componentType) e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragPreview({ visible: false });
      setInvalidDropTargetId(null);
    }
  }, []);

  // Container nested drop handler
  const onNestedDrop = useCallback(
    (e: React.DragEvent, targetContainerId: string, position?: { x: number; y: number; w: number; h: number }) => {
      if (onComponentsChange) {
        if (nestedDragOverClearTimeoutRef.current) {
          clearTimeout(nestedDragOverClearTimeoutRef.current);
          nestedDragOverClearTimeoutRef.current = null;
        }
        // Clear pending debounced layout updates before adding new component
        if (layoutChangeTimeoutRef.current) {
          clearTimeout(layoutChangeTimeoutRef.current);
          layoutChangeTimeoutRef.current = null;
        }

        ContainerManager.handleNestedDrop(
          e,
          targetContainerId,
          components,
          onComponentsChange,
          fieldList || undefined,
          position,
        );

        clearAllDragStates();
      }
    },
    [components, onComponentsChange, fieldList, clearAllDragStates],
  );

  const onNestedDragOver = useCallback(
    (e: React.DragEvent, canvasId: string) => {
      if (nestedDragOverClearTimeoutRef.current) {
        clearTimeout(nestedDragOverClearTimeoutRef.current);
      }
      nestedDragOverClearTimeoutRef.current = setTimeout(() => {
        setDragOverCanvas(null);
        nestedDragOverClearTimeoutRef.current = null;
      }, 140);

      const targetEl = e.target as HTMLElement | null;
      const dropZoneEl =
        (e.currentTarget as HTMLElement | null) ??
        (targetEl?.closest('.layout-container-drop-zone') as HTMLElement | null);
      const containerWrapperEl = dropZoneEl?.closest('.layout-container-wrapper') as HTMLElement | null;

      const eventComponentType = e.dataTransfer?.getData('componentType');
      const windowComponentType = (window as unknown as Record<string, unknown>).__draggedComponentType as
        | WidgetType
        | undefined;
      const componentType = (eventComponentType || windowComponentType || '') as WidgetType | '';

      const crossGridSize = (window as unknown as Record<string, unknown>).__rglCrossGridDragSize as
        | { w?: number; h?: number }
        | undefined;
      const crossGridTargetType = (window as unknown as Record<string, unknown>).__rglCrossGridTargetType as
        | 'canvas'
        | 'container'
        | undefined;
      const defaultSize =
        componentType && componentType !== ('' as WidgetType) ? getCustomComponentSize(componentType) : null;
      const dragHeightRows =
        (typeof crossGridSize?.h === 'number' && crossGridSize.h > 0 ? crossGridSize.h : undefined) ??
        (defaultSize?.height && defaultSize.height > 0 ? defaultSize.height : undefined) ??
        0;

      let isConfirmedPaletteDropIntoThisContainer = false;
      if (componentType && !crossGridTargetType) {
        const mainCanvasWrapper = document.querySelector('.react-grid-layout')?.parentElement as HTMLElement | null;
        if (mainCanvasWrapper) {
          const canvasRect = mainCanvasWrapper.getBoundingClientRect();
          const dropX = e.clientX - canvasRect.left + mainCanvasWrapper.scrollLeft;
          const dropY = e.clientY - canvasRect.top + mainCanvasWrapper.scrollTop;
          const paletteDropTarget = detectDropTarget(dropX, dropY, componentType, undefined, defaultSize ?? undefined);
          isConfirmedPaletteDropIntoThisContainer =
            paletteDropTarget.type === 'container' &&
            paletteDropTarget.containerId === canvasId &&
            paletteDropTarget.validDrop;
        }
      }

      const isPaletteDrag = Boolean(componentType) && !crossGridTargetType;
      let shouldPreserveTopBandInsert = false;
      if (!isPaletteDrag && !isConfirmedPaletteDropIntoThisContainer && containerWrapperEl && dragHeightRows > 0) {
        const wrapperRect = containerWrapperEl.getBoundingClientRect();
        const topBandPx = Math.max(0, dragHeightRows * rowHeight);
        shouldPreserveTopBandInsert = e.clientY <= wrapperRect.top + topBandPx;
      }

      if (!shouldPreserveTopBandInsert) {
        clearInsertMode();
      }

      if (
        containerWrapperEl &&
        dropZoneEl &&
        typeof crossGridSize?.w === 'number' &&
        typeof crossGridSize?.h === 'number'
      ) {
        const targetContainerId = containerWrapperEl.getAttribute('data-container-id') ?? canvasId;
        const targetCols = Number(containerWrapperEl.getAttribute('data-container-cols')) || 8;
        const targetPadding = Number(containerWrapperEl.getAttribute('data-container-padding')) || 0;
        const nestedLayoutEl = dropZoneEl.querySelector('.nested-layout') as HTMLElement | null;
        const projectionRect = (nestedLayoutEl ?? dropZoneEl).getBoundingClientRect();
        const projection = clientToGridCoords({
          clientX: e.clientX,
          clientY: e.clientY,
          rect: projectionRect,
          cols: targetCols,
          rowHeight,
          padding: targetPadding,
          itemWidth: Math.max(1, crossGridSize.w),
          xRounding: 'floor',
          yRounding: 'floor',
        });

        setDragPreview((prev) => {
          if (!prev.visible || !prev.sourceContainerId) return prev;
          if (prev.sourceContainerId === targetContainerId) return prev;
          const nextPosition = {
            x: projection.x,
            y: projection.y,
            w: Math.max(1, crossGridSize.w ?? 1),
            h: Math.max(1, crossGridSize.h ?? 1),
          };
          if (
            prev.targetType === 'container' &&
            prev.containerId === targetContainerId &&
            prev.position &&
            prev.position.x === nextPosition.x &&
            prev.position.y === nextPosition.y &&
            prev.position.w === nextPosition.w &&
            prev.position.h === nextPosition.h
          ) {
            return prev;
          }
          return {
            ...prev,
            targetType: 'container',
            containerId: targetContainerId,
            clientX: e.clientX,
            clientY: e.clientY,
            position: nextPosition,
          };
        });
      }

      ContainerManager.handleNestedDragOver(e, canvasId, setDragOverCanvas);
    },
    [clearInsertMode, rowHeight, setDragOverCanvas, setDragPreview, detectDropTarget],
  );

  const onNestedDragLeave = useCallback((e: React.DragEvent) => {
    if (nestedDragOverClearTimeoutRef.current) {
      clearTimeout(nestedDragOverClearTimeoutRef.current);
      nestedDragOverClearTimeoutRef.current = null;
    }
    ContainerManager.handleNestedDragLeave(e, setDragOverCanvas);
  }, []);

  const onComponentDragStart = useCallback((e: React.DragEvent, componentId: string, parentId: string) => {
    e.dataTransfer.setData('text/plain', `move:${componentId}:${parentId || 'main'}`);
    e.stopPropagation();
  }, []);

  useEffect(() => {
    return () => {
      if (nestedDragOverClearTimeoutRef.current) {
        clearTimeout(nestedDragOverClearTimeoutRef.current);
        nestedDragOverClearTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const clearDragOverContainer = () => {
      setDragOverCanvas(null);
    };

    const handleDocumentDragOver = (event: DragEvent) => {
      const target = event.target as HTMLElement | null;
      const visibleContainerTarget = getVisibleContainerDropTarget(target, event.clientX, event.clientY);
      if (visibleContainerTarget) return;

      // Fallback for cases where event.target is an inner node or stale during native DnD.
      const elementAtPoint =
        typeof document.elementFromPoint === 'function'
          ? document.elementFromPoint(event.clientX, event.clientY)
          : null;
      if (getVisibleContainerDropTarget(elementAtPoint as HTMLElement | null, event.clientX, event.clientY)) {
        return;
      }

      clearDragOverContainer();
    };

    document.addEventListener('dragover', handleDocumentDragOver);
    document.addEventListener('drop', clearDragOverContainer, true);
    document.addEventListener('dragend', clearDragOverContainer, true);

    return () => {
      document.removeEventListener('dragover', handleDocumentDragOver);
      document.removeEventListener('drop', clearDragOverContainer, true);
      document.removeEventListener('dragend', clearDragOverContainer, true);
    };
  }, [setDragOverCanvas]);

  return {
    handleDropDragOver,
    handleGridDrop,
    handleDragOver,
    handleDragOverWithInsert,
    handleDragLeave,
    onNestedDrop,
    onNestedDragOver,
    onNestedDragLeave,
    onComponentDragStart,
  };
}
