import { useCallback, useRef } from 'react';
import { Layout, ItemCallback } from 'react-grid-layout';
import { ResponsiveComponent, WidgetType } from '../rgl-integration/types';
import { ContainerManager } from '../containers/utils/ContainerManager';
import { ContainerDropTarget } from '../containers/ContainerTypes';
import { buildNestedStructureWithResponsive, LayoutCanvas } from '../utils/structureConverters';
import type { DragPreview } from './useCanvasDragState';
import { InsertModeState } from './useCanvasDragState';
import { detectInsertPosition, calculateInsertIndicator } from '../utils/insertDetection';
import { calculateInsertPush } from '../utils/insertPushCalculator';
import { LayoutItem as PushLayoutItem } from '../utils/verticalPushCalculator';
import { clientToGridCoords } from '../utils/gridCoordinateUtils';

// Throttle settings for insert detection during drag
const INSERT_DETECTION_THROTTLE_MS = 50; // Minimum time between insert detection calculations
const INSERT_DETECTION_POSITION_THRESHOLD = 5; // Minimum pixel movement to trigger recalculation
const CONTAINER_TARGET_COMMIT_DWELL_MS = 120;
const CONTAINER_TARGET_ENTER_OVERLAP_Y_PX = 10;
const CONTAINER_TARGET_EXIT_OVERLAP_Y_PX = 4;
const CONTAINER_TARGET_ENTER_OVERLAP_X_PX = 6;
const CONTAINER_TARGET_EXIT_OVERLAP_X_PX = 2;
const MAIN_CANVAS_GRID_PADDING_PX = 8;

export interface UseCanvasDragHandlerParams {
  // TODO: convert to layout type when ResponsiveComponent is split into (Controls, Layout[])
  components: ResponsiveComponent[];
  selectedComponentId: string | null;

  // Drag state values (read-only, from useCanvasDragState)
  draggedComponentId: string | null;
  dragOverContainerId: string | null;

  // State setters (from useCanvasDragState)
  setActiveDragComponentId: (id: string | null) => void;
  setCurrentDraggedComponent: (comp: ResponsiveComponent | null) => void;
  setDraggedComponentId: (id: string | null) => void;
  setInvalidDropTargetId: (id: string | null) => void;
  setDragOverContainerId: (id: string | null) => void;
  clearAllDragStates: () => void;
  isFirstDragOverRef: React.MutableRefObject<boolean>;

  // External callbacks
  onComponentsChange: ((components: ResponsiveComponent[]) => void) | null;
  onComponentClick: ((componentId: string) => void) | null;
  onLayoutV4Change: ((layout: LayoutCanvas) => void) | null;

  // Configuration
  resolution: string;
  rowHeight: number;

  // Drop detection
  detectDropTarget: (
    dropX: number,
    dropY: number,
    draggedComponentType: WidgetType,
    draggedComponent?: ResponsiveComponent,
    paletteDropSize?: { width: number; height: number },
  ) => ContainerDropTarget;

  // Refs for coordination with other handlers
  skipNextLayoutChangeRef: React.MutableRefObject<boolean>;
  layoutChangeTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  dragPreview?: DragPreview;
  dragPreviewRef?: React.MutableRefObject<DragPreview>;
  onDragPreviewChange?: React.Dispatch<React.SetStateAction<DragPreview>>;
  onDragPreviewClear?: () => void;

  // Insert mode state (from useCanvasDragState)
  insertModeStateRef: React.MutableRefObject<InsertModeState>;
  setInsertMode: (state: InsertModeState) => void;
  clearInsertMode: () => void;

  // Grid configuration for insert detection
  cols: number;
  colWidth: number;

  // Reverse mapping function for hidden component expansion
  reverseMapFn: ((updated: ResponsiveComponent[]) => ResponsiveComponent[]) | null;

  // Ref to the current presented layout (with hidden components collapsed to h=0)
  // Used to build push layout items with the correct (presented) heights
  presentedComponentsRef: React.RefObject<ResponsiveComponent[]>;
}

export interface CanvasDragHandlers {
  handleDragStart: ItemCallback;
  handleDrag: ItemCallback;
  handleDragStop: ItemCallback;
}

interface OverlapMetrics {
  overlapX: number;
  overlapY: number;
  overlapArea: number;
}

interface ContainerOverlapCandidate {
  wrapper: HTMLElement;
  containerId: string;
  rect: DOMRect;
  overlap: OverlapMetrics;
  centerInside: boolean;
}

interface ContainerIntentState {
  candidateId: string | null;
  candidateSince: number;
  committedId: string | null;
}

/**
 * Extracts drag start/move/stop handlers from LayoutCanvas.
 *
 * handleDragStart marks which component is being dragged and adds CSS classes.
 *
 * handleDrag detects container hover during movement (via elementsFromPoint).
 *
 * handleDragStop is the largest handler — it determines where a component
 * lands and handles:
 *   - Click detection (same-position = click, not drag)
 *   - Container-into-container prevention
 *   - Component-into-container drops (with compaction awareness)
 *   - Component-out-of-container moves
 *   - Regular canvas repositioning via onLayoutV4Change
 */
export function useCanvasDragHandler({
  components,
  selectedComponentId,
  draggedComponentId,
  dragOverContainerId,
  setActiveDragComponentId,
  setCurrentDraggedComponent,
  setDraggedComponentId,
  setInvalidDropTargetId,
  setDragOverContainerId,
  clearAllDragStates,
  isFirstDragOverRef,
  onComponentsChange,
  onComponentClick,
  onLayoutV4Change,
  resolution,
  rowHeight,
  detectDropTarget,
  skipNextLayoutChangeRef,
  layoutChangeTimeoutRef,
  dragPreview,
  dragPreviewRef,
  onDragPreviewChange,
  onDragPreviewClear,
  insertModeStateRef,
  setInsertMode,
  clearInsertMode,
  cols,
  colWidth,
  reverseMapFn,
  presentedComponentsRef,
}: UseCanvasDragHandlerParams): CanvasDragHandlers {
  // Cache for RGL element ref — populated at drag start, avoids querySelector on every tick
  const rglElementRef = useRef<Element | null>(null);
  // Pre-built container bounds for coordinate-based hit testing (avoids elementsFromPoint)
  const containerBoundsRef = useRef<
    Array<{
      id: string;
      left: number;
      top: number;
      right: number;
      bottom: number;
    }>
  >([]);
  // Pre-built layout items for the main canvas (populated at drag start)
  const dragSessionLayoutItemsRef = useRef<Array<{ i: string; x: number; y: number; w: number; h: number }>>([]);

  const dragPreviewRectCacheRef = useRef<{
    containerId: string;
    containerElement: HTMLElement;
    rect: DOMRect;
    measuredAt: number;
  } | null>(null);
  const containerTargetRectCacheRef = useRef<{
    containerId: string;
    containerElement: HTMLElement;
    rect: DOMRect;
    measuredAt: number;
  } | null>(null);

  const readCachedContainerRect = useCallback((containerId: string, containerElement: HTMLElement): DOMRect => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const cached = dragPreviewRectCacheRef.current;

    if (
      cached &&
      cached.containerId === containerId &&
      cached.containerElement === containerElement &&
      now - cached.measuredAt < 80
    ) {
      return cached.rect;
    }

    const nestedGrid = containerElement.querySelector('.react-grid-layout.nested-layout') as HTMLElement | null;
    const dropZone = containerElement.querySelector('.layout-container-drop-zone') as HTMLElement | null;
    const rect =
      nestedGrid?.getBoundingClientRect() ||
      dropZone?.getBoundingClientRect() ||
      containerElement.getBoundingClientRect();
    dragPreviewRectCacheRef.current = {
      containerId,
      containerElement,
      rect,
      measuredAt: now,
    };

    return rect;
  }, []);

  const readCachedContainerTargetRect = useCallback((containerId: string, containerElement: HTMLElement): DOMRect => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const cached = containerTargetRectCacheRef.current;

    if (
      cached &&
      cached.containerId === containerId &&
      cached.containerElement === containerElement &&
      now - cached.measuredAt < 80
    ) {
      return cached.rect;
    }

    // Targeting must use the visible viewport of the container body, not the nested grid content rect,
    // because nested content can extend beyond the visible area when the container scrolls.
    const dropZone = containerElement.querySelector('.layout-container-drop-zone') as HTMLElement | null;
    const rect = dropZone?.getBoundingClientRect() || containerElement.getBoundingClientRect();
    containerTargetRectCacheRef.current = {
      containerId,
      containerElement,
      rect,
      measuredAt: now,
    };

    return rect;
  }, []);

  const containerIntentRef = useRef<ContainerIntentState>({
    candidateId: null,
    candidateSince: 0,
    committedId: null,
  });

  const dragAnchorOffsetPxYRef = useRef<number>(0);
  const hasDragMovementRef = useRef<boolean>(false);

  const resetContainerIntent = useCallback(() => {
    containerIntentRef.current = {
      candidateId: null,
      candidateSince: 0,
      committedId: null,
    };
  }, []);

  const nowMs = useCallback(() => (typeof performance !== 'undefined' ? performance.now() : Date.now()), []);

  const getOverlapMetrics = useCallback((a: DOMRect, b: DOMRect): OverlapMetrics => {
    const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return {
      overlapX,
      overlapY,
      overlapArea: overlapX * overlapY,
    };
  }, []);

  const getDraggedBodyRect = useCallback((element?: HTMLElement | null): DOMRect | null => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) {
      return null;
    }
    return rect;
  }, []);

  const findBestContainerOverlapCandidate = useCallback(
    (draggedBodyRect: DOMRect | null): ContainerOverlapCandidate | null => {
      if (!draggedBodyRect) return null;

      const centerX = draggedBodyRect.left + draggedBodyRect.width / 2;
      const centerY = draggedBodyRect.top + draggedBodyRect.height / 2;
      const wrappers = Array.from(document.querySelectorAll('.layout-container-wrapper')) as HTMLElement[];

      let best: ContainerOverlapCandidate | null = null;
      for (const wrapper of wrappers) {
        const containerId = wrapper.getAttribute('data-container-id');
        if (!containerId) continue;

        const rect = readCachedContainerTargetRect(containerId, wrapper);
        const overlap = getOverlapMetrics(rect, draggedBodyRect);
        if (overlap.overlapArea <= 0) continue;

        const centerInside =
          centerX >= rect.left && centerX <= rect.right && centerY >= rect.top && centerY <= rect.bottom;
        const candidate: ContainerOverlapCandidate = {
          wrapper,
          containerId,
          rect,
          overlap,
          centerInside,
        };

        if (
          !best ||
          candidate.overlap.overlapArea > best.overlap.overlapArea ||
          (candidate.overlap.overlapArea === best.overlap.overlapArea &&
            candidate.overlap.overlapY > best.overlap.overlapY)
        ) {
          best = candidate;
        }
      }

      return best;
    },
    [getOverlapMetrics, readCachedContainerTargetRect],
  );

  const canCommitContainerCandidate = useCallback(
    (candidate: ContainerOverlapCandidate, draggedBodyRect: DOMRect, allowDwell: boolean): boolean => {
      const dynamicEnterOverlapYPx = Math.max(
        CONTAINER_TARGET_ENTER_OVERLAP_Y_PX,
        Math.round(Math.min((Number(rowHeight) || 30) * 0.5, draggedBodyRect.height * 0.25)),
      );
      const dynamicEnterOverlapXPx = Math.max(
        CONTAINER_TARGET_ENTER_OVERLAP_X_PX,
        Math.round(Math.min(16, draggedBodyRect.width * 0.2)),
      );
      const hasStrongOverlap =
        candidate.overlap.overlapY >= dynamicEnterOverlapYPx && candidate.overlap.overlapX >= dynamicEnterOverlapXPx;
      if (candidate.centerInside || hasStrongOverlap) {
        return true;
      }
      if (!allowDwell) {
        return false;
      }
      const intent = containerIntentRef.current;
      const sameCandidate = intent.candidateId === candidate.containerId;
      const dwellElapsed = sameCandidate ? nowMs() - intent.candidateSince : 0;
      const hasDwellOverlap =
        candidate.overlap.overlapY >= CONTAINER_TARGET_ENTER_OVERLAP_Y_PX &&
        candidate.overlap.overlapX >= CONTAINER_TARGET_ENTER_OVERLAP_X_PX;
      return sameCandidate && hasDwellOverlap && dwellElapsed >= CONTAINER_TARGET_COMMIT_DWELL_MS;
    },
    [nowMs, rowHeight],
  );

  const resolveCommittedContainerTarget = useCallback(
    (params: {
      draggedBodyRect: DOMRect | null;
      pointerContainerWrapper?: HTMLElement | null;
      allowDwell: boolean;
    }): HTMLElement | null => {
      const { draggedBodyRect, pointerContainerWrapper = null, allowDwell } = params;

      // Fail-open for unit tests / callers that provide degenerate DOM geometry.
      if (!draggedBodyRect) {
        if (pointerContainerWrapper) {
          const pointerContainerId = pointerContainerWrapper.getAttribute('data-container-id');
          if (pointerContainerId) {
            containerIntentRef.current = {
              candidateId: pointerContainerId,
              candidateSince: nowMs(),
              committedId: pointerContainerId,
            };
          }
        } else {
          resetContainerIntent();
        }
        return pointerContainerWrapper;
      }

      const intent = containerIntentRef.current;
      const bestCandidate = findBestContainerOverlapCandidate(draggedBodyRect);

      // Keep committed target with hysteresis while overlap remains meaningful.
      if (intent.committedId) {
        if (bestCandidate && bestCandidate.containerId === intent.committedId) {
          const dynamicExitOverlapYPx = Math.max(
            CONTAINER_TARGET_EXIT_OVERLAP_Y_PX,
            Math.round(Math.min((Number(rowHeight) || 30) * 0.2, draggedBodyRect.height * 0.1)),
          );
          const keepCommitted =
            bestCandidate.centerInside ||
            (bestCandidate.overlap.overlapY >= dynamicExitOverlapYPx &&
              bestCandidate.overlap.overlapX >= CONTAINER_TARGET_EXIT_OVERLAP_X_PX);

          if (keepCommitted) {
            intent.candidateId = bestCandidate.containerId;
            intent.candidateSince = nowMs();
            return bestCandidate.wrapper;
          }
        }
        intent.committedId = null;
      }

      if (!bestCandidate) {
        resetContainerIntent();
        return null;
      }

      if (intent.candidateId !== bestCandidate.containerId) {
        intent.candidateId = bestCandidate.containerId;
        intent.candidateSince = nowMs();
      }

      if (canCommitContainerCandidate(bestCandidate, draggedBodyRect, allowDwell)) {
        intent.committedId = bestCandidate.containerId;
        return bestCandidate.wrapper;
      }

      return null;
    },
    [canCommitContainerCandidate, findBestContainerOverlapCandidate, nowMs, resetContainerIntent, rowHeight],
  );

  // Throttle refs for insert detection - prevents excessive calculations during drag
  const lastInsertDetectionTime = useRef<number>(0);
  const lastInsertDetectionPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragAnchorOffsetColsRef = useRef<number | null>(null);
  const dragActualColWidthRef = useRef<number | null>(null);

  const handleDragStart: ItemCallback = useCallback(
    (
      _layout: Layout[],
      _oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      // Prevent stale debounced onLayoutChange commits from previous drags
      // from replaying while a new drag interaction starts.
      if (layoutChangeTimeoutRef.current) {
        clearTimeout(layoutChangeTimeoutRef.current);
        layoutChangeTimeoutRef.current = null;
      }

      // Set active drag component ID to maintain class through re-renders
      setActiveDragComponentId(newItem.i);
      resetContainerIntent();
      hasDragMovementRef.current = false;

      // Note: setDraggedComponentId is NOT set here to avoid showing grid on mousedown
      // It will be set in handleDrag when actual movement occurs

      // Cache RGL element and pre-build container bounds for coordinate hit testing during drag
      rglElementRef.current = element.closest('.react-grid-layout');

      const newItemComp = components.find((c) => c.id === newItem.i);
      if (rglElementRef.current && newItemComp) {
        const CANVAS_PADDING = MAIN_CANVAS_GRID_PADDING_PX;
        const actualCanvasWidth = rglElementRef.current.getBoundingClientRect().width;
        dragActualColWidthRef.current = (actualCanvasWidth - MAIN_CANVAS_GRID_PADDING_PX * 2) / cols;
        const actualCW = dragActualColWidthRef.current;
        containerBoundsRef.current = components
          .filter((c) => !c.containerId && ContainerManager.isContainer(c) && c.id !== newItem.i)
          .map((c) => ({
            id: c.id,
            left: CANVAS_PADDING + c.x * actualCW,
            top: CANVAS_PADDING + c.y * rowHeight,
            right: CANVAS_PADDING + (c.x + c.width) * actualCW,
            bottom: CANVAS_PADDING + (c.y + c.height) * rowHeight,
          }));
        const presentedMap = new Map((presentedComponentsRef.current ?? []).map((c) => [c.id, c]));
        dragSessionLayoutItemsRef.current = components
          .filter((c) => !c.containerId && c.id !== newItem.i)
          .map((c) => {
            const p = presentedMap.get(c.id);
            return { i: c.id, x: p?.x ?? c.x, y: p?.y ?? c.y, w: p?.width ?? c.width, h: p?.height ?? c.height };
          })
          .filter((item) => item.h > 0);
      } else {
        containerBoundsRef.current = [];
        dragSessionLayoutItemsRef.current = [];
      }

      // Add unique drag class for styling
      element.classList.add('is-being-dragged');
      element.classList.add('rgl-dragging');
      // Always add selected-item class during drag to prevent hover
      element.classList.add('selected-item');

      // If this component is actually selected, keep it selected during drag
      const draggedId = newItem.i;
      if (draggedId === selectedComponentId) {
        element.classList.add('selected-item');
      }

      // Capture pointer-to-component column anchor so insert tracking follows cursor
      // even when RGL placeholder coordinates stop updating during collision scenarios.
      const draggedElementRect = element.getBoundingClientRect();
      const draggedElementWidth = Math.max(0, draggedElementRect.width);
      const pointerRelativeToElement = e.clientX - draggedElementRect.left;
      dragAnchorOffsetPxYRef.current = e.clientY - draggedElementRect.top;

      if (draggedElementWidth > 0 && pointerRelativeToElement >= 0 && pointerRelativeToElement <= draggedElementWidth) {
        const elementCellWidth = draggedElementWidth / Math.max(1, Number(newItem.w) || 1);
        const pointerColInElement = Math.floor(pointerRelativeToElement / Math.max(1, elementCellWidth));
        dragAnchorOffsetColsRef.current = Math.max(0, Math.min((Number(newItem.w) || 1) - 1, pointerColInElement));
      } else {
        const rglElement = element.closest('.react-grid-layout') as HTMLElement | null;
        if (rglElement) {
          const canvasRect = rglElement.getBoundingClientRect();
          const mouseX = e.clientX - canvasRect.left - MAIN_CANVAS_GRID_PADDING_PX;
          const pointerCol = Math.floor(mouseX / colWidth);
          dragAnchorOffsetColsRef.current = Math.max(0, Math.min(newItem.w - 1, pointerCol - newItem.x));
        } else {
          dragAnchorOffsetColsRef.current = Math.max(0, Math.min(newItem.w - 1, Math.floor(newItem.w / 2)));
        }
      }
    },
    [components, selectedComponentId, colWidth, rowHeight, resetContainerIntent],
  );

  const handleDrag: ItemCallback = useCallback(
    (
      _layout: Layout[],
      _oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      // Set draggedComponentId on first actual drag movement to show grid
      if (!draggedComponentId) {
        setDraggedComponentId(newItem.i);
      }

      const draggedComponent = components.find((comp) => comp.id === newItem.i);
      if (!hasDragMovementRef.current && draggedComponent) {
        hasDragMovementRef.current = true;
        // Only mark dragged component after actual movement to avoid click-flash invalid target warnings.
        setCurrentDraggedComponent(draggedComponent);
      }
      const isContainerDrag = Boolean(draggedComponent && ContainerManager.isContainer(draggedComponent));
      const draggedBodyRect = getDraggedBodyRect(element);

      // Use pre-built container bounds for hit testing instead of elementsFromPoint (Change 3)
      const rglEl = rglElementRef.current;
      const canvasRectForHit = rglEl?.getBoundingClientRect();
      const mouseXInCanvas = canvasRectForHit ? e.clientX - canvasRectForHit.left : e.clientX;
      const mouseYInCanvas = canvasRectForHit ? e.clientY - canvasRectForHit.top : e.clientY;
      const hitContainer = containerBoundsRef.current.find(
        (b) =>
          mouseXInCanvas >= b.left &&
          mouseXInCanvas <= b.right &&
          mouseYInCanvas >= b.top &&
          mouseYInCanvas <= b.bottom,
      );
      const pointerContainerWrapper = hitContainer
        ? (document.querySelector(`[data-container-id="${hitContainer.id}"]`) as HTMLElement | null)
        : null;
      const containerWrapper = resolveCommittedContainerTarget({
        draggedBodyRect,
        pointerContainerWrapper,
        allowDwell: true,
      });
      const canPreviewContainerTarget = Boolean(containerWrapper && draggedComponent && !isContainerDrag);

      if (canPreviewContainerTarget && containerWrapper) {
        const containerId = containerWrapper.getAttribute('data-container-id');
        if (containerId && containerId !== dragOverContainerId) {
          setDragOverContainerId(containerId);
        }

        // Cross-grid drag preview is only for non-container components.
        // For container drags, showing nested preview hides the main-canvas placeholder
        // and can produce incorrect inner drop shadows.
        if (containerId && draggedComponent) {
          const rect = readCachedContainerRect(containerId, containerWrapper);
          const targetContainer = components.find((component) => component.id === containerId);
          const targetCols = Number(targetContainer?.width) || 8;
          const targetPadding = Number(containerWrapper.getAttribute('data-container-padding')) || 0;
          const targetRowHeight = Number(rowHeight) || 30;

          const w = Number(newItem.w) || Number(draggedComponent.width) || 1;
          const h = Number(newItem.h) || Number(draggedComponent.height) || 1;
          const pointerProjection = clientToGridCoords({
            clientX: e.clientX,
            clientY: e.clientY - dragAnchorOffsetPxYRef.current,
            rect,
            cols: targetCols,
            rowHeight: targetRowHeight,
            padding: targetPadding,
            itemWidth: w,
          });
          const pointerCol = pointerProjection.pointerCol;
          const anchorOffset =
            dragAnchorOffsetColsRef.current ?? Math.max(0, Math.min(w - 1, pointerCol - (Number(newItem.x) || 0)));
          dragAnchorOffsetColsRef.current = anchorOffset;
          const targetProjection = clientToGridCoords({
            clientX: e.clientX,
            clientY: e.clientY - dragAnchorOffsetPxYRef.current,
            rect,
            cols: targetCols,
            rowHeight: targetRowHeight,
            padding: targetPadding,
            itemWidth: w,
            anchorOffsetCols: anchorOffset,
          });
          const x = targetProjection.x;
          const y = targetProjection.y;

          onDragPreviewChange?.((prev) => {
            return {
              ...prev,
              visible: true,
              targetType: 'container',
              containerId,
              componentType: draggedComponent.type,
              anchorOffsetCols: anchorOffset,
              clientX: e.clientX,
              clientY: e.clientY,
              position: { x, y, w, h },
            };
          });
        } else {
          onDragPreviewClear?.();
        }
        // Don't show insert indicator when over container
        clearInsertMode();
      } else if (dragOverContainerId) {
        dragPreviewRectCacheRef.current = null;
        setDragOverContainerId(null);
        onDragPreviewClear?.();
      } else if (!containerWrapper && !pointerContainerWrapper) {
        // Fully outside container candidates; reset intent so a stale dwell timer doesn't commit later.
        resetContainerIntent();
      }

      // --- Insert mode detection for existing component drag ---
      if (!draggedComponent || canPreviewContainerTarget) {
        return;
      }

      // For container drags, never show container-target preview overlays,
      // but still allow insert behavior on the main canvas.
      if (isContainerDrag) {
        onDragPreviewClear?.();
      }

      // Throttle insert detection to avoid excessive calculations
      const now = Date.now();
      const lastPos = lastInsertDetectionPos.current;
      const dx = Math.abs(e.clientX - lastPos.x);
      const dy = Math.abs(e.clientY - lastPos.y);
      const timeSinceLastDetection = now - lastInsertDetectionTime.current;

      // Skip if not enough time has passed AND mouse hasn't moved significantly
      if (
        timeSinceLastDetection < INSERT_DETECTION_THROTTLE_MS &&
        dx < INSERT_DETECTION_POSITION_THRESHOLD &&
        dy < INSERT_DETECTION_POSITION_THRESHOLD
      ) {
        return;
      }

      // Update throttle tracking
      lastInsertDetectionTime.current = now;
      lastInsertDetectionPos.current = { x: e.clientX, y: e.clientY };

      // Use cached RGL element ref from drag start (Change 3: avoids querySelector on every tick)
      const rglElement = rglElementRef.current;
      if (!rglElement) {
        clearInsertMode();
        return;
      }

      const canvasRect = rglElement.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left - MAIN_CANVAS_GRID_PADDING_PX;
      const mouseY = e.clientY - canvasRect.top - MAIN_CANVAS_GRID_PADDING_PX;

      const draggedWidth = draggedComponent.width;
      const draggedHeight = draggedComponent.height;
      const effectiveColWidth = dragActualColWidthRef.current ?? colWidth;
      const pointerCol = Math.floor(mouseX / effectiveColWidth);
      const anchorOffset =
        dragAnchorOffsetColsRef.current ?? Math.max(0, Math.min(draggedWidth - 1, pointerCol - newItem.x));
      const alignedTargetCol = Math.max(0, Math.min(pointerCol - anchorOffset, cols - draggedWidth));
      const alignedMouseX = alignedTargetCol * effectiveColWidth;

      // Use pre-built layout items from drag start (Change 3: avoids filter+map on every tick)
      const layoutItems = dragSessionLayoutItemsRef.current;

      // Detect insert position
      const insertPosition = detectInsertPosition(
        alignedMouseX,
        mouseY,
        draggedWidth,
        draggedHeight,
        layoutItems,
        rowHeight,
        effectiveColWidth,
        cols,
        mouseY,
        mouseX,
      );

      // If collision would occur, activate insert mode
      if (insertPosition.wouldCausePush) {
        const indicatorState = calculateInsertIndicator({
          insertPosition,
          draggedWidth,
          rowHeight,
          fallbackColWidth: effectiveColWidth,
          rglElement,
          components,
        });
        // Change 4: compare before updating to avoid redundant state updates
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
    },
    [
      draggedComponentId,
      components,
      dragOverContainerId,
      rowHeight,
      colWidth,
      cols,
      setDraggedComponentId,
      setDragOverContainerId,
      readCachedContainerRect,
      getDraggedBodyRect,
      resolveCommittedContainerTarget,
      resetContainerIntent,
      onDragPreviewChange,
      onDragPreviewClear,
      setInsertMode,
      clearInsertMode,
      insertModeStateRef,
    ],
  );

  const handleDragStop: ItemCallback = useCallback(
    (
      _layout: Layout[],
      oldItem: Layout,
      newItem: Layout,
      _placeholder: Layout,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      const latestDragPreview = dragPreviewRef?.current ?? dragPreview;
      const anchorOffsetAtDrop = dragAnchorOffsetColsRef.current;
      const anchorOffsetYAtDrop = dragAnchorOffsetPxYRef.current;
      const lastHoveredContainerId = dragOverContainerId;
      // Capture insert mode state BEFORE clearing any state
      // (clearInsertMode is called later, but we need the state now)
      const insertState = insertModeStateRef.current;
      const wasInsertModeActive = insertState.isActive;
      const insertTargetRow = insertState.targetRow;
      const insertTargetCol = insertState.targetCol;
      const isCrossGridContainerToCanvasDrag = Boolean(
        latestDragPreview?.targetType === 'canvas' && latestDragPreview.sourceContainerId,
      );

      // Clear drag state - containers collision protection ends
      document.body.classList.remove('canvas-drag-in-progress');
      setCurrentDraggedComponent(null);
      setDraggedComponentId(null);
      setInvalidDropTargetId(null);
      setDragOverContainerId(null);
      dragPreviewRectCacheRef.current = null;
      onDragPreviewClear?.();

      // Clear active drag component ID
      setActiveDragComponentId(null);
      dragAnchorOffsetColsRef.current = null;
      dragActualColWidthRef.current = null;
      dragAnchorOffsetPxYRef.current = 0;
      hasDragMovementRef.current = false;

      // Remove drag feedback classes
      element.classList.remove('is-being-dragged');
      element.classList.remove('rgl-dragging');

      // Find the component that was moved
      const movedComponentId = newItem.i;
      const movedComponent = components.find((comp) => comp.id === movedComponentId);
      if (!movedComponent) {
        return;
      }

      const wasActuallyClicked = oldItem.x === newItem.x && oldItem.y === newItem.y;

      // Remove selected-item class for non-click drags unless component is actually selected
      // (Click handling is resolved after drop-target detection below.)
      if (!wasActuallyClicked && movedComponentId !== selectedComponentId) {
        element.classList.remove('selected-item');
      }
      const canvasElement = element.closest('.react-grid-layout')?.parentElement;
      if (!canvasElement) {
        clearInsertMode();
        return;
      }

      const canvasRect = canvasElement.getBoundingClientRect();
      // Account for scroll when calculating drop coordinates
      const dropX = e.clientX - canvasRect.left + canvasElement.scrollLeft;
      const dropY = e.clientY - canvasRect.top + canvasElement.scrollTop;

      // Check if dropping into a container using DOM elements (more reliable than geometric detection)
      const draggedBodyRect = getDraggedBodyRect(element);
      const hasReliableDraggedBodyRect = Boolean(draggedBodyRect);
      const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
      const containerDropZone = elementsAtPoint.find(
        (el: Element) =>
          el.classList.contains('layout-container-drop-zone') ||
          el.classList.contains('nested-layout') ||
          el.classList.contains('layout-container-wrapper'),
      ) as HTMLElement | undefined;
      const pointerContainerWrapper =
        (containerDropZone?.closest('.layout-container-wrapper') as HTMLElement | null) ?? null;
      const committedContainerWrapperAtDrop = resolveCommittedContainerTarget({
        draggedBodyRect,
        pointerContainerWrapper,
        allowDwell: false,
      });
      const committedContainerIdAtDrop = committedContainerWrapperAtDrop?.getAttribute('data-container-id') ?? null;

      let dropTarget = detectDropTarget(dropX, dropY, movedComponent.type, movedComponent);
      // Found a container at drop point - get its ID
      let targetContainerWrapper = committedContainerWrapperAtDrop;
      let targetContainerId = targetContainerWrapper?.getAttribute('data-container-id') ?? null;

      // Ignore point-based container results unless the intent gate committed to that container.
      if (
        hasReliableDraggedBodyRect &&
        dropTarget.type === 'container' &&
        (!committedContainerIdAtDrop || dropTarget.containerId !== committedContainerIdAtDrop)
      ) {
        dropTarget = {
          type: 'canvas',
          validDrop: true,
        };
      }

      // Fallback: preserve the last container-hover target from drag move frames.
      // This prevents edge cases where elementsFromPoint misses the container on mouseup.
      if (!targetContainerId && lastHoveredContainerId) {
        if (!hasReliableDraggedBodyRect || containerIntentRef.current.committedId === lastHoveredContainerId) {
          const hoveredContainer = components.find((c) => c.id === lastHoveredContainerId);
          if (hoveredContainer && ContainerManager.isContainer(hoveredContainer)) {
            targetContainerId = lastHoveredContainerId;
            const escapedId =
              typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
                ? CSS.escape(lastHoveredContainerId)
                : lastHoveredContainerId.replace(/"/g, '\\"');
            targetContainerWrapper = document.querySelector(`[data-container-id="${escapedId}"]`) as HTMLElement | null;
          }
        }
      }

      // Secondary fallback: geometric hit-test against container bounds with a small tolerance.
      // This handles edge-to-edge canvas/container seams where pointer hit-testing can miss on mouseup.
      if (!targetContainerId) {
        if (hasReliableDraggedBodyRect) {
          targetContainerWrapper = null;
          targetContainerId = null;
        } else {
          const EDGE_TOLERANCE_PX = 12;
          const candidateWrappers = Array.from(document.querySelectorAll('.layout-container-wrapper')) as HTMLElement[];
          const geometricMatch = candidateWrappers.find((wrapper) => {
            const rect = wrapper.getBoundingClientRect();
            return (
              e.clientX >= rect.left - EDGE_TOLERANCE_PX &&
              e.clientX <= rect.right + EDGE_TOLERANCE_PX &&
              e.clientY >= rect.top - EDGE_TOLERANCE_PX &&
              e.clientY <= rect.bottom + EDGE_TOLERANCE_PX
            );
          });

          if (geometricMatch) {
            targetContainerWrapper = geometricMatch;
            targetContainerId = geometricMatch.getAttribute('data-container-id');
          }
        }
      }

      if (targetContainerId) {
        const targetContainer = components.find((c) => c.id === targetContainerId);
        if (targetContainer) {
          // Validate the drop
          const validation = ContainerManager.validateContainerDrop(targetContainer, movedComponent.type, components);
          dropTarget = {
            type: 'container' as const,
            containerId: targetContainerId,
            validDrop: validation.isValid,
            reason: validation.reason,
          };
        }
      }

      // Fallback to geometric detection if DOM detection didn't find a container
      dropTarget = dropTarget ?? detectDropTarget(dropX, dropY, movedComponent.type, movedComponent);
      const isContainerComponentDrag = ContainerManager.isContainer(movedComponent);

      // Existing container components can only move on the main canvas.
      // If hit-testing reports a container under pointer, interpret that as canvas placement.
      if (isContainerComponentDrag && dropTarget.type === 'container') {
        dropTarget = {
          type: 'canvas',
          validDrop: true,
        };
      }

      // Treat same-position interaction as click only when no container transfer is intended.
      const isContainerTransferAttempt =
        dropTarget.type === 'container' || (dropTarget.type === 'canvas' && Boolean(movedComponent.containerId));
      if (wasActuallyClicked && !wasInsertModeActive && !isContainerTransferAttempt && onComponentClick) {
        if (movedComponentId !== selectedComponentId) {
          onComponentClick(movedComponent.id);
        }
        return;
      }

      // Regular component movement handling

      if (dropTarget.type === 'container' && dropTarget.validDrop) {
        // Component moved INTO container
        if (onComponentsChange) {
          // Clear pending debounced layout updates
          if (layoutChangeTimeoutRef.current) {
            clearTimeout(layoutChangeTimeoutRef.current);
            layoutChangeTimeoutRef.current = null;
          }

          // Suppress immediate onLayoutChange echoes before commit to prevent snap-back to canvas.
          skipNextLayoutChangeRef.current = true;

          const targetContainer = components.find((c) => c.id === dropTarget.containerId);

          // Calculate position from mouse coordinates relative to container
          let dropPositionX = 0;
          let dropPositionY = 0;
          const containerCols = Math.max(1, Number(targetContainer?.width) || 8);
          const movedComponentWidth = Math.max(1, Number(newItem.w) || Number(movedComponent.width) || 1);
          const maxX = Math.max(0, containerCols - movedComponentWidth);

          const hasPreviewPosition =
            latestDragPreview?.visible &&
            latestDragPreview.targetType === 'container' &&
            latestDragPreview.containerId === dropTarget.containerId &&
            !!latestDragPreview.position;

          if (hasPreviewPosition && latestDragPreview?.position) {
            // Prefer the actively rendered preview position so drop lands where placeholder/preview shows.
            dropPositionX = Math.max(0, Math.min(maxX, Math.floor(Number(latestDragPreview.position.x) || 0)));
            dropPositionY = Math.max(0, Math.floor(Number(latestDragPreview.position.y) || 0));
          } else if (targetContainerWrapper) {
            const nestedGridEl = targetContainerWrapper.querySelector(
              '.react-grid-layout.nested-layout',
            ) as HTMLElement | null;
            const dropZoneEl = targetContainerWrapper.querySelector('.layout-container-drop-zone');
            const rect =
              nestedGridEl?.getBoundingClientRect() ||
              dropZoneEl?.getBoundingClientRect() ||
              targetContainerWrapper.getBoundingClientRect();
            const targetPadding = Number(targetContainerWrapper.getAttribute('data-container-padding')) || 0;

            const containerRowH = rowHeight || 30;
            const pointerProjection = clientToGridCoords({
              clientX: e.clientX,
              clientY: e.clientY - anchorOffsetYAtDrop,
              rect,
              cols: containerCols,
              rowHeight: containerRowH,
              padding: targetPadding,
              itemWidth: movedComponentWidth,
            });
            const pointerCol = pointerProjection.pointerCol;
            const fallbackAnchorOffset =
              anchorOffsetAtDrop ??
              Math.max(0, Math.min(movedComponentWidth - 1, pointerCol - (Number(newItem.x) || 0)));
            const targetProjection = clientToGridCoords({
              clientX: e.clientX,
              clientY: e.clientY - anchorOffsetYAtDrop,
              rect,
              cols: containerCols,
              rowHeight: containerRowH,
              padding: targetPadding,
              itemWidth: movedComponentWidth,
              anchorOffsetCols: fallbackAnchorOffset,
            });
            dropPositionX = Math.max(0, Math.min(maxX, targetProjection.x));
            dropPositionY = targetProjection.y;
          }

          const movedComponentHeight = Math.max(1, Number(newItem.h) || Number(movedComponent.height) || 1);
          const targetContainerId = dropTarget.containerId!;
          const existingTargetLayout: PushLayoutItem[] = components
            .filter((comp) => comp.containerId === targetContainerId && comp.id !== movedComponent.id)
            .map((comp) => ({
              i: comp.id,
              x: Number(comp.x) || 0,
              y: Number(comp.y) || 0,
              w: Number(comp.width) || 1,
              h: Number(comp.height) || 1,
            }));

          const insertedInContainer: PushLayoutItem = {
            i: movedComponent.id,
            x: dropPositionX,
            y: dropPositionY,
            w: movedComponentWidth,
            h: movedComponentHeight,
          };
          const containerPushResult = calculateInsertPush(insertedInContainer, existingTargetLayout);
          const containerPushMap = new Map(containerPushResult.layout.map((item) => [item.i, item]));

          const updatedComponents = components.map((comp) => {
            if (comp.id === movedComponent.id) {
              const pushedMoved = containerPushMap.get(comp.id);
              return {
                ...comp,
                containerId: targetContainerId,
                x: pushedMoved?.x ?? dropPositionX,
                y: pushedMoved?.y ?? dropPositionY,
                width: pushedMoved?.w ?? movedComponentWidth,
                height: pushedMoved?.h ?? movedComponentHeight,
              };
            }

            if (comp.containerId === targetContainerId) {
              const pushed = containerPushMap.get(comp.id);
              if (pushed) {
                return {
                  ...comp,
                  x: pushed.x,
                  y: pushed.y,
                  width: pushed.w,
                  height: pushed.h,
                };
              }
            }

            return comp;
          });

          // Static layout (compactType = null): Save immediately - position won't change
          if (onLayoutV4Change) {
            const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);
            const layoutCanvasStructure = {
              canvasId: null,
              type: 'Grid',
              size: 12,
              content: nestedStructure,
            };
            onLayoutV4Change(layoutCanvasStructure);
          }

          onComponentsChange(updatedComponents);

          // Keep suppression window briefly after commit.
          setTimeout(() => {
            skipNextLayoutChangeRef.current = false;
          }, 200);

          // Clear ALL drag/grid visualization states after container drop
          clearAllDragStates();
          isFirstDragOverRef.current = true;
        }
        return; // Return early to prevent further processing
      } else if (dropTarget.type === 'canvas' && (movedComponent.containerId || isCrossGridContainerToCanvasDrag)) {
        // Component moved OUT of container onto canvas
        if (onComponentsChange) {
          // Clear pending debounced layout updates
          if (layoutChangeTimeoutRef.current) {
            clearTimeout(layoutChangeTimeoutRef.current);
            layoutChangeTimeoutRef.current = null;
          }

          const componentWidth = Math.max(1, Number(newItem.w) || Number(movedComponent.width) || 1);
          const maxCanvasX = Math.max(0, cols - componentWidth);
          const hasCanvasPreviewPosition =
            isCrossGridContainerToCanvasDrag &&
            latestDragPreview?.visible &&
            latestDragPreview.targetType === 'canvas' &&
            !!latestDragPreview.position;
          const dropCanvasX = hasCanvasPreviewPosition
            ? Math.max(0, Math.min(maxCanvasX, Math.floor(Number(latestDragPreview?.position?.x) || 0)))
            : newItem.x;
          const dropCanvasY = hasCanvasPreviewPosition
            ? Math.max(0, Math.floor(Number(latestDragPreview?.position?.y) || 0))
            : newItem.y;

          const componentHeight = Math.max(1, Number(newItem.h) || Number(movedComponent.height) || 1);
          const presentedMap = new Map((presentedComponentsRef.current ?? []).map((c) => [c.id, c]));
          const existingCanvasLayout: PushLayoutItem[] = components
            .filter((comp) => !comp.containerId && comp.id !== movedComponent.id)
            .map((comp) => {
              const p = presentedMap.get(comp.id);
              return {
                i: comp.id,
                x: p?.x ?? (Number(comp.x) || 0),
                y: p?.y ?? (Number(comp.y) || 0),
                w: p?.width ?? (Number(comp.width) || 1),
                h: p?.height ?? (Number(comp.height) || 1),
              };
            })
            .filter((item) => item.h > 0);

          const insertedOnCanvas: PushLayoutItem = {
            i: movedComponent.id,
            x: dropCanvasX,
            y: dropCanvasY,
            w: componentWidth,
            h: componentHeight,
          };
          const canvasPushResult = calculateInsertPush(insertedOnCanvas, existingCanvasLayout);
          const canvasPushMap = new Map(canvasPushResult.layout.map((item) => [item.i, item]));

          const updatedComponents = components.map((comp) => {
            if (comp.id === movedComponent.id) {
              const pushedMoved = canvasPushMap.get(comp.id);
              return {
                ...comp,
                containerId: null,
                x: pushedMoved?.x ?? dropCanvasX,
                y: pushedMoved?.y ?? dropCanvasY,
                width: pushedMoved?.w ?? componentWidth,
                height: pushedMoved?.h ?? componentHeight,
              };
            }
            if (!comp.containerId) {
              const pushed = canvasPushMap.get(comp.id);
              if (pushed) {
                return {
                  ...comp,
                  x: pushed.x,
                  y: pushed.y,
                  width: pushed.w,
                  height: pushed.h,
                };
              }
            }
            return comp;
          });

          // Call onLayoutV4Change to persist to database
          if (onLayoutV4Change) {
            const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);

            const layoutCanvasStructure = {
              canvasId: null,
              type: 'Grid',
              size: 12,
              content: nestedStructure,
            };
            onLayoutV4Change(layoutCanvasStructure);
          }

          onComponentsChange(reverseMapFn ? reverseMapFn(updatedComponents) : updatedComponents);

          // Skip handleLayoutChange calls to prevent position overwrite
          skipNextLayoutChangeRef.current = true;
          setTimeout(() => {
            skipNextLayoutChangeRef.current = false;
          }, 200);

          // Clear ALL drag/grid visualization states
          clearAllDragStates();
          isFirstDragOverRef.current = true;
        }
        clearInsertMode();
        return; // Return early
      }

      // --- Insert mode handling for regular canvas moves ---
      // If insert mode was active, apply push calculation instead of RGL's default positioning
      if (wasInsertModeActive && onComponentsChange && !isCrossGridContainerToCanvasDrag) {
        // Clear insert mode now that we've captured the values
        clearInsertMode();

        // Clear pending debounced layout updates
        if (layoutChangeTimeoutRef.current) {
          clearTimeout(layoutChangeTimeoutRef.current);
          layoutChangeTimeoutRef.current = null;
        }

        // Build layout items for push calculation (exclude the moved component)
        // Use presented heights so hidden components (h=0) are not incorrectly
        // treated as full-height items during collision detection.
        const presentedMap = new Map((presentedComponentsRef.current ?? []).map((c) => [c.id, c]));
        const mainCanvasComponents = components.filter((c) => !c.containerId && c.id !== movedComponent.id);
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

        // Create the moved item at the insert position
        const movedItem: PushLayoutItem = {
          i: movedComponent.id,
          x: insertTargetCol,
          y: insertTargetRow,
          w: movedComponent.width,
          h: movedComponent.height,
        };

        // Calculate push
        const pushResult = calculateInsertPush(movedItem, layoutItems);

        // Apply pushed positions to existing components
        const updatedComponents = components.map((comp) => {
          if (comp.containerId) return comp; // Skip container children

          if (comp.id === movedComponent.id) {
            // Move the dragged component to insert position
            return { ...comp, x: insertTargetCol, y: insertTargetRow };
          }

          const pushedItem = pushResult.layout.find((l) => l.i === comp.id);
          if (pushedItem && pushedItem.y !== comp.y) {
            return { ...comp, y: pushedItem.y };
          }
          return comp;
        });

        // Call onLayoutV4Change to persist
        if (onLayoutV4Change) {
          const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);
          const layoutCanvasStructure = {
            canvasId: null,
            type: 'Grid',
            size: 12,
            content: nestedStructure,
          };
          onLayoutV4Change(layoutCanvasStructure);
        }

        onComponentsChange(reverseMapFn ? reverseMapFn(updatedComponents) : updatedComponents);

        // Skip next layout change to prevent RGL from overwriting our positions
        skipNextLayoutChangeRef.current = true;
        setTimeout(() => {
          skipNextLayoutChangeRef.current = false;
        }, 200);

        clearAllDragStates();
        isFirstDragOverRef.current = true;
        return;
      }

      // If insert mode wasn't active, just clear it anyway for safety
      // (RGL will handle the normal position update via onLayoutChange)
      clearInsertMode();

      // Top-level canvas reposition for an existing canvas component.
      // Commit final drag-stop coordinates immediately so RGL's debounced
      // onLayoutChange cannot briefly replay stale coordinates.
      if (dropTarget.type === 'canvas' && !movedComponent.containerId && onComponentsChange) {
        if (layoutChangeTimeoutRef.current) {
          clearTimeout(layoutChangeTimeoutRef.current);
          layoutChangeTimeoutRef.current = null;
        }

        const updatedComponents = components.map((comp) => {
          if (comp.id === movedComponent.id) {
            return {
              ...comp,
              x: newItem.x,
              y: newItem.y,
              width: newItem.w,
              // When a hidden component (h=0 in presented space) is dragged, RGL
              // reports newItem.h=0 which would permanently corrupt the base height.
              // Preserve the base height in that case; use RGL's value otherwise.
              height: newItem.h === 0 ? comp.height : newItem.h,
            };
          }
          return comp;
        });

        onComponentsChange(reverseMapFn ? reverseMapFn(updatedComponents) : updatedComponents);

        // Preserve immediate persistence for container moves on the main canvas.
        if (isContainerComponentDrag && onLayoutV4Change) {
          const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, resolution);
          const layoutCanvasStructure = {
            canvasId: null,
            type: 'Grid',
            size: 12,
            content: nestedStructure,
          };
          onLayoutV4Change(layoutCanvasStructure);
        }

        // Suppress immediate onLayoutChange echoes for this drag-stop commit.
        skipNextLayoutChangeRef.current = true;
        setTimeout(() => {
          skipNextLayoutChangeRef.current = false;
        }, 200);
      }
    },
    [
      components,
      detectDropTarget,
      dragOverContainerId,
      onComponentsChange,
      onComponentClick,
      onLayoutV4Change,
      resolution,
      selectedComponentId,
      dragPreview,
      dragPreviewRef,
      onDragPreviewClear,
      clearInsertMode,
      getDraggedBodyRect,
      resolveCommittedContainerTarget,
      cols,
      colWidth,
      rowHeight,
      insertModeStateRef,
      reverseMapFn,
    ],
  );

  return { handleDragStart, handleDrag, handleDragStop };
}
