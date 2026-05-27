import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { ContainerManager } from '../utils/ContainerManager';
import type { DragStopTarget } from '../ContainerTypes';
import { rglStateAdapter } from '../../rgl-integration/adapters/RGLStateAdapter';
import { ResponsiveComponent, RGLLayoutItem } from '../../rgl-integration/types';
import { getHiddenState, Resolution, ScreenMode } from '../../utils/currentStateHelper';
import type { DragPreview } from '../../hooks/useCanvasDragState';
import { calculateResizePush } from '../../utils/verticalPushCalculator';
import { clientToGridCoords } from '../../utils/gridCoordinateUtils';
import { compact, simpleGrow } from '../../utils/compaction';
import type { CompactionItem, CompactionItemIn } from '../../utils/compaction/compact';
import { toCompactionBaseItems, toRuntimeDynamicData } from '../../utils/compaction/compactionAdapters';
import { mapHiddenToDynamic } from '../../utils/compaction/reverseMapping';

export interface ContainerLayoutItem {
  isResizable?: boolean;
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
}

export interface UseContainerHandlerParams {
  container: Pick<ResponsiveComponent, 'id' | 'width' | 'height'>;
  childComponents: ResponsiveComponent[];
  controlRegistry?: Record<string, unknown>;
  rowHeight: number;
  resolution: Resolution;
  mode: ScreenMode;
  showHiddenComponents: boolean;
  onNestedComponentsChange?: (updatedComponents: ResponsiveComponent[]) => void;
  dragPreview?: DragPreview;
  dragPreviewRef?: React.MutableRefObject<DragPreview>;
  onDragPreviewChange?: React.Dispatch<React.SetStateAction<DragPreview>>;
  onDragPreviewClear?: () => void;
  onNestedDragComplete?: () => void;
  selectedComponentId?: string | null;
  observedHeights?: Map<string, number>;
  expandedComponentId?: string | null;
}

export interface ContainerLayoutHandlers {
  layout: ContainerLayoutItem[];
  handleLayoutChange: (layout: ContainerLayoutItem[]) => void;
  handleDrag: (
    layout: ContainerLayoutItem[],
    oldItem: ContainerLayoutItem,
    newItem: ContainerLayoutItem,
    placeholder: ContainerLayoutItem,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;
  handleDragStop: (
    layout: ContainerLayoutItem[],
    oldItem: ContainerLayoutItem,
    newItem: ContainerLayoutItem,
    placeholder: ContainerLayoutItem,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;
  handleResizeStart: (
    layout: ContainerLayoutItem[],
    oldItem: ContainerLayoutItem,
    newItem: ContainerLayoutItem,
    placeholder: ContainerLayoutItem,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;
  handleResizeStop: (
    layout: ContainerLayoutItem[],
    oldItem: ContainerLayoutItem,
    newItem: ContainerLayoutItem,
    placeholder: ContainerLayoutItem,
    e: MouseEvent,
    element: HTMLElement,
  ) => void;
}

interface NestedResizeTrackingState {
  startMouseY: number | null;
  startMouseX: number | null;
  startHeight: number | null;
  startWidth: number | null;
  startX: number | null;
  startY: number | null;
  startGridWidth: number | null;
  intendedHeight: number | null;
  intendedWidth: number | null;
  handleDirection: string | null;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

const initialNestedResizeState: NestedResizeTrackingState = {
  startMouseY: null,
  startMouseX: null,
  startHeight: null,
  startWidth: null,
  startX: null,
  startY: null,
  startGridWidth: null,
  intendedHeight: null,
  intendedWidth: null,
  handleDirection: null,
  minWidth: 1,
  maxWidth: 12,
  minHeight: 1,
  maxHeight: 1000,
};

const ROW_OVERFLOW_EJECT_EDGE_MULTIPLIER = 0.5;
const MAIN_CANVAS_COLS = 12;
const EXTERNAL_TARGET_STICKY_MS = 450;
const FULL_CANVAS_WIDTH_RATIO = 0.95;
const FULL_CANVAS_HEIGHT_RATIO = 0.85;
const FULL_CANVAS_EDGE_ESCAPE_PX = 24;
const PREVIEW_STALE_GRID_DELTA = 2;
const EXTERNAL_REENTRY_CLEAR_DELAY_MS = 140;
const EXTERNAL_REENTRY_CLEAR_INSET_PX = 24;
const CONTAINER_SEAM_HYSTERESIS_PX = 18;

function getVisibleContainerBottom(containerRect: DOMRect, containerDefinedHeight: number, rowHeight: number): number {
  const definedBottom = containerRect.top + Math.max(0, containerDefinedHeight) * rowHeight;
  return Math.min(containerRect.bottom, definedBottom);
}

function resolveContainerBoundsElement(containerElement: HTMLElement): HTMLElement {
  const dropZoneEl = containerElement.querySelector('.layout-container-drop-zone') as HTMLElement | null;
  return dropZoneEl ?? containerElement;
}

function toLayoutItems({
  childComponents,
  container,
  controlRegistry,
  showHiddenComponents,
  resolution,
  mode,
}: {
  childComponents: ResponsiveComponent[];
  container: Pick<ResponsiveComponent, 'width'>;
  controlRegistry?: Record<string, unknown>;
  showHiddenComponents: boolean;
  resolution: Resolution;
  mode: ScreenMode;
}): ContainerLayoutItem[] {
  return childComponents
    .filter((comp) => {
      if (showHiddenComponents) return true;
      // @ts-ignore - responsive shape is wider than helper's expected type in some wrapper paths
      const isHidden = getHiddenState(comp, comp.responsive, resolution, mode);
      // In designer mode, keep hidden components in the layout so they render as
      // collapsed labels (same pattern as the main canvas). Runtime mode removes them.
      if (isHidden && mode === 'designer') return true;
      return !isHidden;
    })
    .map((comp: ResponsiveComponent): ContainerLayoutItem => {
      // @ts-ignore
      const isCollapsed =
        !showHiddenComponents && mode === 'designer' && getHiddenState(comp, comp.responsive, resolution, mode);
      const numericComp = {
        ...comp,
        x: Number(comp.x) || 0,
        y: Number(comp.y) || 0,
        width: Number(comp.width) || 1,
        // Hidden items in designer mode collapse to h=0 (CSS provides the 4px strip)
        height: isCollapsed ? 0 : Number(comp.height) || 1,
      };

      const containerCols = Number(container.width) || 8;
      let componentWidth = numericComp.width;
      const componentX = numericComp.x;

      if (controlRegistry && comp.displayRestrictions) {
        const restrictions = comp.displayRestrictions as {
          minWidth?: number;
          maxWidth?: number;
        };

        if (restrictions.minWidth) {
          componentWidth = Math.max(componentWidth, restrictions.minWidth);
        }

        if (restrictions.maxWidth) {
          componentWidth = Math.min(componentWidth, restrictions.maxWidth);
        }
      }

      const adjustedX =
        componentX + componentWidth > containerCols
          ? Math.max(0, containerCols - componentWidth)
          : Math.max(0, componentX);

      const layoutItem: ContainerLayoutItem = {
        i: comp.id,
        x: adjustedX,
        y: Math.max(0, numericComp.y),
        w: componentWidth,
        h: numericComp.height,
        static: false,
      };

      if (controlRegistry && comp.displayRestrictions && !isCollapsed) {
        const restrictions = comp.displayRestrictions as {
          minWidth?: number;
          maxWidth?: number;
          minHeight?: number;
          maxHeight?: number;
        };

        layoutItem.minW = restrictions.minWidth;
        layoutItem.maxW = restrictions.maxWidth;
        layoutItem.minH = restrictions.minHeight;
        layoutItem.maxH = restrictions.maxHeight;
        if (restrictions.minWidth && restrictions.maxWidth && restrictions.minHeight && restrictions.maxHeight) {
          layoutItem.isResizable =
            restrictions.minWidth !== restrictions.maxWidth || restrictions.minHeight !== restrictions.maxHeight;
        }
      }

      return layoutItem;
    });
}

export function useContainerHandler({
  container,
  childComponents,
  controlRegistry,
  rowHeight,
  resolution,
  mode,
  showHiddenComponents,
  onNestedComponentsChange,
  dragPreview,
  dragPreviewRef,
  onDragPreviewChange,
  onDragPreviewClear,
  onNestedDragComplete,
  selectedComponentId,
  observedHeights,
  expandedComponentId,
}: UseContainerHandlerParams): ContainerLayoutHandlers {
  const resizeTrackingRef = useRef<NestedResizeTrackingState>({ ...initialNestedResizeState });
  const currentlyResizingComponentIdRef = useRef<string | null>(null);
  const skipNextLayoutChangeRef = useRef(false);
  const justEjectedRef = useRef(false);
  const ejectedChildIdRef = useRef<string | null>(null);
  const ejectionGuardUntilRef = useRef<number>(0);
  const lastExternalDragTargetRef = useRef<{
    target: DragStopTarget;
    seenAt: number;
  } | null>(null);
  const externalReentryClearStartedAtRef = useRef<number | null>(null);
  const containerRectCacheRef = useRef<{
    element: HTMLElement | null;
    rect: DOMRect | null;
    measuredAt: number;
  }>({
    element: null,
    rect: null,
    measuredAt: 0,
  });
  const mainCanvasRectCacheRef = useRef<{
    element: HTMLElement | null;
    rect: DOMRect | null;
    measuredAt: number;
  }>({
    element: null,
    rect: null,
    measuredAt: 0,
  });
  const dragAnchorComponentIdRef = useRef<string | null>(null);
  const dragAnchorOffsetColsRef = useRef<number | null>(null);

  const readCachedRect = useCallback(
    (
      element: HTMLElement,
      cacheRef: MutableRefObject<{
        element: HTMLElement | null;
        rect: DOMRect | null;
        measuredAt: number;
      }>,
      force = false,
    ): DOMRect => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const cached = cacheRef.current;
      if (!force && cached.element === element && cached.rect && now - cached.measuredAt < 80) {
        return cached.rect;
      }

      const rect = element.getBoundingClientRect();
      cacheRef.current = {
        element,
        rect,
        measuredAt: now,
      };
      return rect;
    },
    [],
  );

  const buildMainCanvasTarget = useCallback(
    (
      mouseEvent: MouseEvent,
      containerElement: HTMLElement,
      draggedComponent: ResponsiveComponent,
      w: number,
    ): DragStopTarget | null => {
      const mainCanvasWrapper = containerElement.closest('.react-grid-layout')?.parentElement as HTMLElement | null;
      if (!mainCanvasWrapper) return null;

      const mainGrid = mainCanvasWrapper.querySelector('.react-grid-layout:not(.nested-layout)') as HTMLElement | null;
      if (!mainGrid) return null;

      const mainCanvasRect = readCachedRect(mainGrid, mainCanvasRectCacheRef);
      const cols = 12;
      const containerPadding = 8;
      const projection = clientToGridCoords({
        clientX: mouseEvent.clientX,
        clientY: mouseEvent.clientY,
        rect: mainCanvasRect,
        cols,
        rowHeight,
        padding: containerPadding,
        itemWidth: w,
        xRounding: 'round',
        yRounding: 'round',
      });

      return {
        type: 'main-canvas',
        targetContainerId: null,
        position: { x: projection.x, y: projection.y },
        component: draggedComponent,
      };
    },
    [rowHeight, readCachedRect],
  );

  const isContainerProjectedAsMainCanvas = useCallback(
    (containerElement: HTMLElement, containerRect: DOMRect): boolean => {
      const mainCanvasWrapper = containerElement.closest('.react-grid-layout')?.parentElement as HTMLElement | null;
      if (!mainCanvasWrapper) return false;

      const mainGrid = mainCanvasWrapper.querySelector('.react-grid-layout:not(.nested-layout)') as HTMLElement | null;
      if (!mainGrid) return false;

      const mainCanvasRect = readCachedRect(mainGrid, mainCanvasRectCacheRef);
      const widthRatio = containerRect.width / Math.max(1, mainCanvasRect.width);
      const heightRatio = containerRect.height / Math.max(1, mainCanvasRect.height);
      return widthRatio >= FULL_CANVAS_WIDTH_RATIO && heightRatio >= FULL_CANVAS_HEIGHT_RATIO;
    },
    [readCachedRect],
  );

  const isNearContainerEscapeEdge = useCallback(
    (event: MouseEvent, containerRect: DOMRect, effectiveBottom: number): boolean =>
      event.clientX <= containerRect.left + FULL_CANVAS_EDGE_ESCAPE_PX ||
      event.clientX >= containerRect.right - FULL_CANVAS_EDGE_ESCAPE_PX ||
      event.clientY <= containerRect.top + FULL_CANVAS_EDGE_ESCAPE_PX ||
      event.clientY >= effectiveBottom - FULL_CANVAS_EDGE_ESCAPE_PX,
    [],
  );

  const updateDragAnchorOffset = useCallback(
    (event: MouseEvent, element: HTMLElement, draggedItemId: string, draggedWidth: number): number => {
      if (dragAnchorComponentIdRef.current !== draggedItemId) {
        dragAnchorComponentIdRef.current = draggedItemId;
        dragAnchorOffsetColsRef.current = null;
      }

      if (dragAnchorOffsetColsRef.current === null) {
        const draggedElementRect = element.getBoundingClientRect();
        const draggedElementWidth = Math.max(1, draggedElementRect.width);
        const relativeToDraggedElement = event.clientX - draggedElementRect.left;

        // Prefer element-local anchor capture; this is resilient to RGL x/y churn
        // during collisions and boundary transitions.
        if (relativeToDraggedElement >= 0 && relativeToDraggedElement <= draggedElementWidth) {
          const cellWidthInElement = draggedElementWidth / Math.max(1, draggedWidth);
          const pointerColInElement = Math.floor(relativeToDraggedElement / Math.max(1, cellWidthInElement));
          dragAnchorOffsetColsRef.current = Math.max(0, Math.min(draggedWidth - 1, pointerColInElement));
        }
      }

      if (dragAnchorOffsetColsRef.current === null) {
        // Restrictive fallback: use center anchor so cross-grid transitions are stable
        // even when pointer is on drag handles/outside element bounds.
        dragAnchorOffsetColsRef.current = Math.max(0, Math.min(draggedWidth - 1, Math.floor(draggedWidth / 2)));
      }

      return dragAnchorOffsetColsRef.current ?? 0;
    },
    [],
  );

  const baseItems = useMemo<CompactionItemIn[]>(
    () => toCompactionBaseItems(childComponents, resolution, mode),
    [childComponents, resolution, mode],
  );

  const effectiveItems = useMemo<CompactionItem[]>(() => {
    if (mode === 'designer') {
      const dynamic = mapHiddenToDynamic(
        childComponents,
        resolution,
        mode,
        showHiddenComponents,
        expandedComponentId ?? selectedComponentId ?? null,
      );
      return simpleGrow(baseItems, dynamic);
    }
    // runtime — toRuntimeDynamicData works on any pre-filtered set
    const dynamic = toRuntimeDynamicData(childComponents, resolution, mode, observedHeights);
    return compact(baseItems, dynamic);
  }, [
    mode,
    baseItems,
    childComponents,
    resolution,
    showHiddenComponents,
    selectedComponentId,
    observedHeights,
    expandedComponentId,
  ]);

  const presentedItemsRef = useRef<CompactionItem[]>([]);
  presentedItemsRef.current = effectiveItems;

  const needsReverseMap = useMemo(() => {
    const baseMap = new Map(baseItems.map((b) => [b.id, b]));
    return effectiveItems.some((eff) => {
      const base = baseMap.get(eff.id);
      return base && (eff.y !== base.y || eff.h !== base.h);
    });
  }, [baseItems, effectiveItems]);

  const layout = useMemo(() => {
    const base = toLayoutItems({
      childComponents,
      container,
      controlRegistry,
      showHiddenComponents,
      resolution,
      mode,
    });
    if (!needsReverseMap) return base;

    const effectiveMap = new Map(effectiveItems.map((ei) => [ei.id, ei]));

    return base
      .map((item) => {
        const eff = effectiveMap.get(item.i);
        if (!eff) return item;
        return { ...item, y: eff.y, h: eff.h };
      })
      .filter(
        (item) =>
          // runtime compact removes hidden items from output; filter them from RGL layout too
          mode !== 'runtime' || effectiveMap.has(item.i),
      );
  }, [
    childComponents,
    container,
    controlRegistry,
    showHiddenComponents,
    resolution,
    mode,
    needsReverseMap,
    effectiveItems,
  ]);

  useEffect(() => {
    if (!justEjectedRef.current) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const guardExpired = now > ejectionGuardUntilRef.current;
    const childStillInContainer = ejectedChildIdRef.current
      ? childComponents.some((component) => component.id === ejectedChildIdRef.current)
      : false;

    // Clear guard once the child has actually left this container, or after safety timeout.
    if (!childStillInContainer || guardExpired) {
      justEjectedRef.current = false;
      ejectedChildIdRef.current = null;
      ejectionGuardUntilRef.current = 0;
    }
  }, [childComponents]);

  // When selectedComponentId changes to/from a hidden child, RGL fires a stale onLayoutChange.
  // Block handleLayoutChange for one tick so those stale events are ignored.
  const prevSelectedIdRef = useRef<string | null | undefined>(selectedComponentId);
  useEffect(() => {
    const prev = prevSelectedIdRef.current;
    prevSelectedIdRef.current = selectedComponentId;
    if (prev === selectedComponentId) return;

    const toggledHidden =
      childComponents.some((c) => c.id === prev && getHiddenState(c, c.responsive, resolution, mode)) ||
      childComponents.some((c) => c.id === selectedComponentId && getHiddenState(c, c.responsive, resolution, mode));

    if (!toggledHidden) return;

    skipNextLayoutChangeRef.current = true;
    const t = setTimeout(() => {
      skipNextLayoutChangeRef.current = false;
    }, 200);
    return () => clearTimeout(t);
  }, [selectedComponentId, childComponents, resolution, mode]);

  const applyLayoutChanges = useCallback(
    (nextLayout: ContainerLayoutItem[], includeSizeChanges: boolean) => {
      if (!onNestedComponentsChange) return;

      const updatedFromLayout = rglStateAdapter.updateComponentsFromLayout(
        childComponents,
        nextLayout as unknown as RGLLayoutItem[],
        'desktop',
      );

      const presentedMap = needsReverseMap ? new Map(presentedItemsRef.current.map((pi) => [pi.id, pi])) : null;

      const mergedChildren = childComponents.map((component, index) => {
        const updated = updatedFromLayout[index];
        if (!updated) return component;

        // h=0 in the RGL layout is a display artifact: toLayoutItems deliberately collapses hidden
        // components to h=0 so they render as collapsed labels in designer mode. RGL echoes that 0
        // back in every onDragStop / onResizeStop callback. If we saved it, the designed height
        // would be permanently corrupted. Preserve the designed height whenever the layout reports
        // h=0 but the component has a positive designed height.
        const effectiveUpdatedHeight =
          updated.height === 0 && Number(component.height) > 0 ? Number(component.height) : updated.height;

        const positionChanged = component.x !== updated.x || component.y !== updated.y;
        const sizeChanged = component.width !== updated.width || component.height !== effectiveUpdatedHeight;
        const hasChanges = includeSizeChanges ? positionChanged || sizeChanged : positionChanged;

        if (!hasChanges) return component;

        if (!presentedMap) {
          // Direct path: compaction not active, save as-is
          if (!includeSizeChanges) return { ...component, x: updated.x, y: updated.y };
          return { ...component, x: updated.x, y: updated.y, width: updated.width, height: effectiveUpdatedHeight };
        }

        // Reverse-map path: translate presented delta → base space
        const presented = presentedMap.get(component.id);
        const presentedY = presented?.y ?? (Number(component.y) || 0);
        const dy = updated.y - presentedY;
        const newBaseY = Math.max(0, (Number(component.y) || 0) + dy);

        if (!includeSizeChanges) return { ...component, x: updated.x, y: newBaseY };
        return { ...component, x: updated.x, y: newBaseY, width: updated.width, height: effectiveUpdatedHeight };
      });

      const changed = mergedChildren.some((component, index) => component !== childComponents[index]);
      if (changed) {
        onNestedComponentsChange(mergedChildren);
      }
    },
    [childComponents, onNestedComponentsChange, needsReverseMap],
    // presentedItemsRef NOT in deps — it's a ref, read synchronously
  );

  const handleLayoutChange = useCallback(
    (nextLayout: ContainerLayoutItem[]) => {
      if (skipNextLayoutChangeRef.current || currentlyResizingComponentIdRef.current) {
        return;
      }

      if (justEjectedRef.current) {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (now <= ejectionGuardUntilRef.current) {
          return;
        }

        justEjectedRef.current = false;
        ejectedChildIdRef.current = null;
        ejectionGuardUntilRef.current = 0;
      }

      // When simpleGrow/compact is active (needsReverseMap=true), positions in nextLayout
      // are in presented space. Saves must come from the dedicated stop handlers that use
      // the full reverseMap pipeline — not from onLayoutChange. Mirrors main-canvas guard.
      if (needsReverseMap) return;

      applyLayoutChanges(nextLayout, false);
    },
    [applyLayoutChanges, needsReverseMap],
  );

  const handleDrag = useCallback(
    (
      _nextLayout: ContainerLayoutItem[],
      _oldItem: ContainerLayoutItem,
      newItem: ContainerLayoutItem,
      _placeholder: ContainerLayoutItem,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      if (!onDragPreviewChange) return;

      const draggedComponent = childComponents.find((comp) => comp.id === newItem.i);
      if (!draggedComponent) return;

      const containerElement = element.closest('.layout-container-wrapper') as HTMLElement | null;
      if (!containerElement) return;

      const boundsElement = resolveContainerBoundsElement(containerElement);
      const containerRect = readCachedRect(boundsElement, containerRectCacheRef, true);
      const containerDefinedHeight = Number(container.height) || 12;
      const effectiveBottom = getVisibleContainerBottom(containerRect, containerDefinedHeight, rowHeight);

      const w = Number(newItem.w) || Number(draggedComponent.width) || 1;
      const h = Number(newItem.h) || Number(draggedComponent.height) || 1;
      const anchorOffsetCols = updateDragAnchorOffset(e, element, newItem.i, w);
      const rowOverflow = (Number(newItem.y) || 0) + h > containerDefinedHeight;
      const isOutsideBounds =
        e.clientX < containerRect.left ||
        e.clientX > containerRect.right ||
        e.clientY < containerRect.top ||
        e.clientY > effectiveBottom;
      const bottomEjectThreshold = effectiveBottom - rowHeight * ROW_OVERFLOW_EJECT_EDGE_MULTIPLIER;
      const isNearBottomOverflowEdge = e.clientY >= bottomEjectThreshold;
      const isFullCanvasProjection = isContainerProjectedAsMainCanvas(containerElement, containerRect);
      const isNearEscapeEdge = isNearContainerEscapeEdge(e, containerRect, effectiveBottom);
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const recentExternalTarget =
        lastExternalDragTargetRef.current && now - lastExternalDragTargetRef.current.seenAt <= EXTERNAL_TARGET_STICKY_MS
          ? lastExternalDragTargetRef.current.target
          : null;

      let resolvedTarget: DragStopTarget | null = null;

      if (isOutsideBounds) {
        resolvedTarget = ContainerManager.detectDragStopTarget(
          e,
          draggedComponent,
          containerElement,
          containerRect,
          rowHeight,
          0,
          containerDefinedHeight,
        );
      }

      if (!resolvedTarget && rowOverflow && isNearBottomOverflowEdge) {
        resolvedTarget = buildMainCanvasTarget(e, containerElement, draggedComponent, w);
      }

      // When a hard-selected container is rendered as an almost full-canvas surface,
      // crossing the "true" boundary is impossible. Allow edge escape to eject.
      if (!resolvedTarget && isFullCanvasProjection && isNearEscapeEdge) {
        resolvedTarget = buildMainCanvasTarget(e, containerElement, draggedComponent, w);
      }

      if (resolvedTarget?.type === 'main-canvas' || resolvedTarget?.type === 'other-container') {
        resolvedTarget = {
          ...resolvedTarget,
          position: {
            ...resolvedTarget.position,
            x: Math.max(0, Number(resolvedTarget.position.x) - anchorOffsetCols),
          },
        };
      }

      const publishExternalPreview = (target: DragStopTarget) => {
        if (target.type !== 'main-canvas' && target.type !== 'other-container') return false;

        externalReentryClearStartedAtRef.current = null;
        lastExternalDragTargetRef.current = {
          target,
          seenAt: now,
        };

        if (target.type === 'main-canvas') {
          onDragPreviewChange((prev) => {
            return {
              ...prev,
              visible: true,
              targetType: 'canvas',
              containerId: undefined,
              componentType: draggedComponent.type,
              sourceContainerId: container.id,
              anchorOffsetCols,
              clientX: e.clientX,
              clientY: e.clientY,
              position: { x: target.position.x, y: target.position.y, w, h },
            };
          });
          return true;
        }

        onDragPreviewChange((prev) => {
          return {
            ...prev,
            visible: true,
            targetType: 'container',
            containerId: target.targetContainerId ?? undefined,
            componentType: draggedComponent.type,
            sourceContainerId: container.id,
            anchorOffsetCols,
            clientX: e.clientX,
            clientY: e.clientY,
            position: { x: target.position.x, y: target.position.y, w, h },
          };
        });
        return true;
      };

      if (resolvedTarget?.type === 'main-canvas') {
        publishExternalPreview(resolvedTarget);
        return;
      }

      if (resolvedTarget?.type === 'other-container') {
        publishExternalPreview(resolvedTarget);
        return;
      }

      if (recentExternalTarget) {
        const seamInset = Math.max(CONTAINER_SEAM_HYSTERESIS_PX, Math.round(rowHeight * 0.5));
        const isNearBoundaryBand =
          e.clientX <= containerRect.left + seamInset ||
          e.clientX >= containerRect.right - seamInset ||
          e.clientY <= containerRect.top + seamInset ||
          e.clientY >= effectiveBottom - seamInset;
        const clearInset = Math.max(EXTERNAL_REENTRY_CLEAR_INSET_PX, seamInset + 6);
        const isDeepInsideContainer =
          e.clientX > containerRect.left + clearInset &&
          e.clientX < containerRect.right - clearInset &&
          e.clientY > containerRect.top + clearInset &&
          e.clientY < effectiveBottom - clearInset;

        if (!rowOverflow && isDeepInsideContainer && !isNearBoundaryBand) {
          const startedAt = externalReentryClearStartedAtRef.current;
          if (startedAt === null) {
            externalReentryClearStartedAtRef.current = now;
          } else if (now - startedAt >= EXTERNAL_REENTRY_CLEAR_DELAY_MS) {
            lastExternalDragTargetRef.current = null;
            externalReentryClearStartedAtRef.current = null;
            onDragPreviewClear?.();
            return;
          }
        } else {
          externalReentryClearStartedAtRef.current = null;
        }

        if (publishExternalPreview(recentExternalTarget)) {
          return;
        }
      }

      const isClearlyInsideContainer =
        e.clientX > containerRect.left + 8 &&
        e.clientX < containerRect.right - 8 &&
        e.clientY > containerRect.top + 8 &&
        e.clientY < effectiveBottom - 8;
      if (isClearlyInsideContainer && !rowOverflow) {
        // User moved back into the container body; discard stale external target.
        lastExternalDragTargetRef.current = null;
      }
      externalReentryClearStartedAtRef.current = null;
      onDragPreviewClear?.();
    },
    [
      onDragPreviewChange,
      childComponents,
      container.id,
      container.height,
      rowHeight,
      onDragPreviewClear,
      buildMainCanvasTarget,
      isContainerProjectedAsMainCanvas,
      isNearContainerEscapeEdge,
      updateDragAnchorOffset,
      readCachedRect,
    ],
  );

  const handleDragStop = useCallback(
    (
      nextLayout: ContainerLayoutItem[],
      _oldItem: ContainerLayoutItem,
      newItem: ContainerLayoutItem,
      _placeholder: ContainerLayoutItem,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      const latestDragPreview = dragPreviewRef?.current ?? dragPreview;
      const anchorOffsetAtDrop =
        dragAnchorComponentIdRef.current === newItem.i ? (dragAnchorOffsetColsRef.current ?? 0) : 0;
      dragAnchorComponentIdRef.current = null;
      dragAnchorOffsetColsRef.current = null;
      onDragPreviewClear?.();

      const containerElement = element.closest('.layout-container-wrapper') as HTMLElement | null;
      if (containerElement && onNestedComponentsChange) {
        const boundsElement = resolveContainerBoundsElement(containerElement);
        const containerRect = readCachedRect(boundsElement, containerRectCacheRef, true);
        const componentToMove = childComponents.find((comp) => comp.id === newItem.i);

        if (componentToMove) {
          const w = Number(newItem.w) || Number(componentToMove.width) || 1;
          const h = Number(newItem.h) || Number(componentToMove.height) || 1;
          const containerDefinedHeight = Number(container.height) || 12;
          const adjustTargetForAnchor = (target: DragStopTarget | null): DragStopTarget | null => {
            if (!target) return null;
            if (target.type !== 'main-canvas' && target.type !== 'other-container') {
              return target;
            }
            return {
              ...target,
              position: {
                ...target.position,
                x: Math.max(0, Number(target.position.x) - anchorOffsetAtDrop),
              },
            };
          };

          const previewCanvasPosition =
            latestDragPreview?.sourceContainerId === container.id &&
            latestDragPreview.targetType === 'canvas' &&
            latestDragPreview.position
              ? latestDragPreview.position
              : null;

          // Prefer the rendered preview position so mouseup jitter doesn't move the
          // final drop one cell away from what the user sees.
          if (previewCanvasPosition) {
            const componentWidth = Math.max(1, Number(componentToMove.width) || Number(newItem.w) || 1);
            const liveCanvasTarget = adjustTargetForAnchor(
              buildMainCanvasTarget(e, containerElement, componentToMove, componentWidth),
            );
            const liveCanvasPosition =
              liveCanvasTarget && liveCanvasTarget.type === 'main-canvas' ? liveCanvasTarget.position : null;
            const previewCanvasX = Number(previewCanvasPosition.x);
            const previewCanvasY = Number(previewCanvasPosition.y);
            const liveCanvasX = liveCanvasPosition ? Number(liveCanvasPosition.x) : Number.NaN;
            const liveCanvasY = liveCanvasPosition ? Number(liveCanvasPosition.y) : Number.NaN;
            const hasLiveCanvasPosition = Number.isFinite(liveCanvasX) && Number.isFinite(liveCanvasY);
            const isPreviewStaleAgainstLiveTarget =
              hasLiveCanvasPosition &&
              (Math.abs(liveCanvasX - previewCanvasX) > PREVIEW_STALE_GRID_DELTA ||
                Math.abs(liveCanvasY - previewCanvasY) > PREVIEW_STALE_GRID_DELTA);
            const resolvedCanvasX = isPreviewStaleAgainstLiveTarget ? liveCanvasX : previewCanvasX;
            const resolvedCanvasY = isPreviewStaleAgainstLiveTarget ? liveCanvasY : previewCanvasY;
            const maxCanvasX = Math.max(0, MAIN_CANVAS_COLS - componentWidth);
            const targetX = Math.max(
              0,
              Math.min(maxCanvasX, Math.round(Number.isFinite(resolvedCanvasX) ? resolvedCanvasX : 0)),
            );
            const targetY = Math.max(0, Math.round(Number.isFinite(resolvedCanvasY) ? resolvedCanvasY : 0));

            justEjectedRef.current = true;
            ejectedChildIdRef.current = componentToMove.id;
            ejectionGuardUntilRef.current = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + 300;
            onNestedComponentsChange(
              childComponents.map((comp) =>
                comp.id === componentToMove.id ? { ...comp, containerId: null, x: targetX, y: targetY } : comp,
              ),
            );
            onNestedDragComplete?.();
            return;
          }

          const dragStopTarget = adjustTargetForAnchor(
            ContainerManager.detectDragStopTarget(
              e,
              componentToMove,
              containerElement,
              containerRect,
              rowHeight,
              0,
              containerDefinedHeight,
            ),
          );
          const rowOverflow = (Number(newItem.y) || 0) + h > containerDefinedHeight;
          const effectiveBottom = getVisibleContainerBottom(containerRect, containerDefinedHeight, rowHeight);
          const isFullCanvasProjection = isContainerProjectedAsMainCanvas(containerElement, containerRect);
          const isNearEscapeEdge = isNearContainerEscapeEdge(e, containerRect, effectiveBottom);
          const bottomEjectThreshold = effectiveBottom - rowHeight * ROW_OVERFLOW_EJECT_EDGE_MULTIPLIER;
          const isNearBottomOverflowEdge = e.clientY >= bottomEjectThreshold;
          const overflowCanvasTarget =
            !dragStopTarget && rowOverflow && isNearBottomOverflowEdge
              ? adjustTargetForAnchor(buildMainCanvasTarget(e, containerElement, componentToMove, w))
              : null;
          const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
          const recentExternalTarget =
            lastExternalDragTargetRef.current &&
            now - lastExternalDragTargetRef.current.seenAt <= EXTERNAL_TARGET_STICKY_MS
              ? lastExternalDragTargetRef.current.target
              : null;
          const bottomEscapeFallbackTarget =
            !dragStopTarget && !overflowCanvasTarget && !recentExternalTarget && e.clientY > effectiveBottom + 2
              ? adjustTargetForAnchor(buildMainCanvasTarget(e, containerElement, componentToMove, w))
              : null;
          const fullCanvasEdgeFallbackTarget =
            !dragStopTarget &&
            !overflowCanvasTarget &&
            !recentExternalTarget &&
            isFullCanvasProjection &&
            isNearEscapeEdge
              ? adjustTargetForAnchor(buildMainCanvasTarget(e, containerElement, componentToMove, w))
              : null;
          const resolvedTarget =
            dragStopTarget ??
            overflowCanvasTarget ??
            recentExternalTarget ??
            bottomEscapeFallbackTarget ??
            fullCanvasEdgeFallbackTarget;

          if (resolvedTarget) {
            justEjectedRef.current = true;
            ejectedChildIdRef.current = componentToMove.id;
            ejectionGuardUntilRef.current = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + 300;
            onNestedComponentsChange(ContainerManager.applyDragStopTarget(resolvedTarget, childComponents));
            onNestedDragComplete?.();
            lastExternalDragTargetRef.current = null;
            return;
          }

          lastExternalDragTargetRef.current = null;
        }
      }

      applyLayoutChanges(nextLayout, true);
      skipNextLayoutChangeRef.current = true;
      setTimeout(() => {
        skipNextLayoutChangeRef.current = false;
      }, 200);
      onNestedDragComplete?.();
    },
    [
      childComponents,
      onNestedComponentsChange,
      container.height,
      rowHeight,
      applyLayoutChanges,
      dragPreview,
      dragPreviewRef,
      onDragPreviewClear,
      buildMainCanvasTarget,
      isContainerProjectedAsMainCanvas,
      isNearContainerEscapeEdge,
      readCachedRect,
      onNestedDragComplete,
    ],
  );

  const clearResizeTracking = useCallback(() => {
    currentlyResizingComponentIdRef.current = null;
    resizeTrackingRef.current = { ...initialNestedResizeState };
  }, []);

  useEffect(() => {
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!currentlyResizingComponentIdRef.current) return;

      const rt = resizeTrackingRef.current;
      if (rt.startMouseY === null || rt.startHeight === null) return;

      const containerCols = Math.max(1, Number(container.width) || 8);
      const measuredGridWidth = rt.startGridWidth && rt.startGridWidth > 0 ? rt.startGridWidth : containerCols;
      const colWidthCalc = measuredGridWidth / containerCols;
      const handle = rt.handleDirection || '';

      const hasVerticalComponent = handle.includes('s') || handle.includes('n');
      if (hasVerticalComponent && rt.startMouseY !== null && rt.startHeight !== null) {
        const deltaY = e.clientY - rt.startMouseY;
        const isNorthHandle = handle.includes('n');
        const effectiveDeltaY = isNorthHandle ? -deltaY : deltaY;
        const deltaRows = Math.round(effectiveDeltaY / rowHeight);
        const intendedHeight = Math.max(rt.minHeight, Math.min(rt.maxHeight, rt.startHeight + deltaRows));
        rt.intendedHeight = intendedHeight;
      }

      const hasHorizontalComponent = handle.includes('e') || handle.includes('w');
      if (hasHorizontalComponent && rt.startMouseX !== null && rt.startWidth !== null) {
        const deltaX = e.clientX - rt.startMouseX;
        const isWestHandle = handle.includes('w');
        const effectiveDeltaX = isWestHandle ? -deltaX : deltaX;
        const deltaCols = Math.round(effectiveDeltaX / colWidthCalc);
        // Clamp to component's min/max width constraints (and container cols limit).
        // Also clamp based on container boundary in the direction of the drag:
        //   East handle: right edge can't exceed the container (containerCols - startX)
        //   West handle: left edge can't go below 0, so max width = startX + startWidth
        const startX = rt.startX ?? 0;
        const containerBoundaryMax = isWestHandle
          ? startX + rt.startWidth // west: left side moves, right side (startX+startWidth) is fixed
          : containerCols - startX; // east: right side moves, bounded by right container edge
        const intendedWidth = Math.max(
          rt.minWidth,
          Math.min(rt.maxWidth, containerCols, containerBoundaryMax, rt.startWidth + deltaCols),
        );
        rt.intendedWidth = intendedWidth;
      }
    };

    document.addEventListener('mousemove', handleResizeMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
    };
  }, [container.width, rowHeight]);

  const handleResizeStart = useCallback(
    (
      _layout: ContainerLayoutItem[],
      _oldItem: ContainerLayoutItem,
      newItem: ContainerLayoutItem,
      _placeholder: ContainerLayoutItem,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      const resizingComponent = childComponents.find((comp) => comp.id === newItem.i);
      if (!resizingComponent) return;

      const rt = resizeTrackingRef.current;
      const containerCols = Math.max(1, Number(container.width) || 8);
      const restrictions = resizingComponent.displayRestrictions as
        | {
            minWidth?: number;
            maxWidth?: number;
            minHeight?: number;
            maxHeight?: number;
          }
        | undefined;

      rt.startMouseY = e.clientY;
      rt.startMouseX = e.clientX;
      rt.startHeight = Number(resizingComponent.height) || 1;
      rt.startWidth = Number(resizingComponent.width) || 1;
      rt.startX = Number(resizingComponent.x) || 0;
      rt.startY = Number(resizingComponent.y) || 0;
      rt.intendedHeight = rt.startHeight;
      rt.intendedWidth = rt.startWidth;
      rt.minWidth = restrictions?.minWidth ?? 1;
      rt.maxWidth = restrictions?.maxWidth ?? containerCols;
      rt.minHeight = restrictions?.minHeight ?? 1;
      rt.maxHeight = restrictions?.maxHeight ?? 1000;

      const gridElement = element.closest('.react-grid-layout') as HTMLElement | null;
      rt.startGridWidth = gridElement?.getBoundingClientRect().width ?? null;

      const target = e.target as HTMLElement;
      const handleElement = target.closest('[class*="react-resizable-handle-"]');
      if (handleElement) {
        const classList = handleElement.className;
        const match = classList.match(/react-resizable-handle-([nsew]+)/);
        rt.handleDirection = match && match[1] ? match[1] : null;
      } else {
        rt.handleDirection = null;
      }

      currentlyResizingComponentIdRef.current = newItem.i;
    },
    [childComponents, container.width],
  );

  const handleResizeStop = useCallback(
    (
      nextLayout: ContainerLayoutItem[],
      oldItem: ContainerLayoutItem,
      newItem: ContainerLayoutItem,
      _placeholder: ContainerLayoutItem,
      _e: MouseEvent,
      _element: HTMLElement,
    ) => {
      try {
        const rt = resizeTrackingRef.current;
        const rglHeightWasLimited = rt.intendedHeight !== null && rt.intendedHeight > newItem.h;
        const rglWidthWasLimited = rt.intendedWidth !== null && rt.intendedWidth > newItem.w;
        const resolvedHeight = rglHeightWasLimited ? rt.intendedHeight! : newItem.h;
        const resolvedWidth = rglWidthWasLimited ? rt.intendedWidth! : newItem.w;

        const isWestResize = rt.handleDirection?.includes('w') ?? false;
        let resolvedX = newItem.x;
        if (rglWidthWasLimited && isWestResize && rt.startX !== null && rt.startWidth !== null) {
          resolvedX = Math.max(0, rt.startX - (resolvedWidth - rt.startWidth));
        }

        const isNorthResize = rt.handleDirection?.includes('n') ?? false;
        let resolvedY = newItem.y;
        if (rglHeightWasLimited && isNorthResize && rt.startY !== null && rt.startHeight !== null) {
          resolvedY = Math.max(0, rt.startY - (resolvedHeight - rt.startHeight));
        } else if (rglHeightWasLimited && rt.startY !== null) {
          resolvedY = rt.startY;
        }

        let mergedLayout = nextLayout.map((item) =>
          item.i === newItem.i
            ? {
                ...item,
                x: resolvedX,
                y: resolvedY,
                w: resolvedWidth,
                h: resolvedHeight,
              }
            : item,
        );

        const heightIncreased = resolvedHeight > oldItem.h;
        const widthIncreased = resolvedWidth > oldItem.w;
        const needsPush = heightIncreased || widthIncreased;

        if (needsPush) {
          const layoutForPush = mergedLayout.map((item) => ({
            i: item.i,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          }));

          const pushResult = calculateResizePush(
            {
              i: newItem.i,
              x: resolvedX,
              y: resolvedY,
              w: resolvedWidth,
              h: resolvedHeight,
            },
            oldItem.w,
            oldItem.h,
            layoutForPush,
          );

          if (pushResult.hasPushed) {
            const pushMap = new Map(pushResult.layout.map((item) => [item.i, item]));
            mergedLayout = mergedLayout.map((item) => {
              const pushed = pushMap.get(item.i);
              if (!pushed) return item;
              if (item.i === newItem.i) {
                return {
                  ...item,
                  x: resolvedX,
                  y: resolvedY,
                  w: resolvedWidth,
                  h: resolvedHeight,
                };
              }
              return {
                ...item,
                y: pushed.y,
              };
            });
          }
        }

        applyLayoutChanges(mergedLayout, true);
        skipNextLayoutChangeRef.current = true;
        setTimeout(() => {
          skipNextLayoutChangeRef.current = false;
        }, 200);
      } finally {
        clearResizeTracking();
      }
    },
    [applyLayoutChanges, clearResizeTracking],
  );

  return {
    layout,
    handleLayoutChange,
    handleDrag,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
  };
}

// Backward-compatible alias during migration from the old hook name.
export const useContainerLayoutHandlers = useContainerHandler;
