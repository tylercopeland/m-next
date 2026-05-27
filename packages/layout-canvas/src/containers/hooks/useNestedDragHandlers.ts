import React, { useState, useCallback } from 'react';
import { WIDGETS } from '@m-next/runtime-interface';
import type { ResponsiveComponent, WidgetType } from '../../rgl-integration/types';
import type { InsertModeState, DragPreview } from '../../hooks/useCanvasDragState';
import type { ContainerLayoutHandlers } from './useContainerHandler';
import { getCustomComponentSize } from '../../utils/componentSizing';
import { calculateInsertPush } from '../../utils/insertPushCalculator';
import { LayoutItem as PushLayoutItem } from '../../utils/verticalPushCalculator';
import { computeInsertDetection, buildLayoutItemsFromComponents } from '../utils/containerInsertDetection';

const initialInsertModeState: InsertModeState = {
  isActive: false,
  indicatorX: 0,
  indicatorY: 0,
  indicatorWidth: 0,
  targetRow: 0,
  targetCol: 0,
};

const INSERT_DETECTION_THROTTLE_MS = 50;
const INSERT_DETECTION_POSITION_THRESHOLD = 5;
const isContainerWidgetType = (componentType: WidgetType | undefined): boolean =>
  componentType === WIDGETS.LAYOUT_CONTAINER || componentType === WIDGETS.SECTION;

export interface UseNestedDragHandlersParams {
  container: ResponsiveComponent & {
    showBorder?: boolean;
    showShadow?: boolean;
  };
  childComponents: ResponsiveComponent[];
  dropZoneRef: React.RefObject<HTMLDivElement>;
  dropZoneWidth: number;
  rowHeight: number;
  dragPreview?: DragPreview;
  onDragPreviewChange?: React.Dispatch<React.SetStateAction<DragPreview>>;
  onNestedComponentsChange?: (updatedComponents: ResponsiveComponent[]) => void;
  onDragPreviewClear?: () => void;
  onNestedDragComplete?: () => void;
  handleDrag: ContainerLayoutHandlers['handleDrag'];
  handleDragStop: ContainerLayoutHandlers['handleDragStop'];
}

export interface NestedDragHandlersResult {
  /** Insert mode indicator state for rendering */
  insertModeState: InsertModeState;
  /** Ref holding the latest insert mode state (for use in event handlers) */
  insertModeStateRef: React.MutableRefObject<InsertModeState>;
  /** Height of the insert preview in rows */
  insertPreviewHeight: number;
  /** Whether a nested drag is currently active */
  isNestedDragActive: boolean;
  /** ID of the child currently being dragged */
  draggingChildId: string | null;
  /** Whether the container is the source of a cross-grid drag */
  isCrossGridDragSource: boolean | undefined;
  /** Ref to skip the next layout change event */
  skipNextNestedLayoutChangeRef: React.MutableRefObject<boolean>;
  /** Clear the insert mode indicator */
  clearInsertMode: () => void;
  /** Reset all nested drag state (insert mode, active drag, dragging child) */
  resetNestedDragState: () => void;
  /** Handler for external drag-over (palette/cross-grid drops) */
  handleNestedDropDragOver: (e: React.DragEvent) => { w: number; h: number } | false;
  /** Handler for nested item drag (internal rearrange) */
  handleNestedItemDrag: ContainerLayoutHandlers['handleDrag'];
  /** Handler for nested item drag stop */
  handleNestedItemDragStop: ContainerLayoutHandlers['handleDragStop'];
}

/**
 * Encapsulates all nested drag handling logic:
 * - Insert mode state management (indicator position, throttling)
 * - handleNestedDropDragOver (external drag-over detection)
 * - handleNestedItemDrag (internal drag with insert detection)
 * - handleNestedItemDragStop (drop with push calculation)
 */
export const useNestedDragHandlers = ({
  container,
  childComponents,
  dropZoneRef,
  dropZoneWidth,
  rowHeight,
  dragPreview,
  onDragPreviewChange,
  onNestedComponentsChange,
  onDragPreviewClear,
  onNestedDragComplete,
  handleDrag,
  handleDragStop,
}: UseNestedDragHandlersParams): NestedDragHandlersResult => {
  const [isNestedDragActive, setIsNestedDragActive] = useState(false);
  const [draggingChildId, setDraggingChildId] = useState<string | null>(null);
  const [insertModeState, setInsertModeStateInternal] = useState<InsertModeState>(initialInsertModeState);
  const insertModeStateRef = React.useRef<InsertModeState>(initialInsertModeState);
  const [insertPreviewHeight, setInsertPreviewHeight] = useState<number>(0);
  const skipNextNestedLayoutChangeRef = React.useRef<boolean>(false);
  const lastInsertDetectionTimeRef = React.useRef<number>(0);
  const lastInsertDetectionPosRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragAnchorOffsetColsRef = React.useRef<number | null>(null);

  const isCrossGridDragSource =
    dragPreview?.visible &&
    dragPreview.sourceContainerId === container.id &&
    (dragPreview.targetType === 'canvas' ||
      (dragPreview.targetType === 'container' && dragPreview.containerId !== container.id));

  const setInsertMode = useCallback((state: InsertModeState, draggedHeight: number) => {
    const normalizedState: InsertModeState = {
      ...state,
      indicatorX: Math.round(state.indicatorX),
      indicatorY: Math.round(state.indicatorY),
      indicatorWidth: Math.max(1, Math.round(state.indicatorWidth)),
    };
    insertModeStateRef.current = normalizedState;
    setInsertModeStateInternal(normalizedState);
    const normalizedHeight = Math.max(1, draggedHeight);
    setInsertPreviewHeight(normalizedHeight);
  }, []);

  const clearInsertMode = useCallback(() => {
    insertModeStateRef.current = initialInsertModeState;
    setInsertModeStateInternal(initialInsertModeState);
    setInsertPreviewHeight(0);
  }, []);

  const resetNestedDragState = useCallback(() => {
    setIsNestedDragActive(false);
    setDraggingChildId(null);
    insertModeStateRef.current = initialInsertModeState;
    setInsertModeStateInternal(initialInsertModeState);
    setInsertPreviewHeight(0);
  }, []);

  const isPointerWithinVisibleDropZone = useCallback(
    (clientX: number, clientY: number): boolean => {
      const dropZoneEl = dropZoneRef.current;
      if (!dropZoneEl) return true;
      const rect = dropZoneEl.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    },
    [dropZoneRef],
  );

  // --- handleNestedDropDragOver ---
  const handleNestedDropDragOver = React.useCallback(
    (e: React.DragEvent) => {
      if (!isPointerWithinVisibleDropZone(e.clientX, e.clientY)) {
        clearInsertMode();
        return false;
      }

      const containerCols = Number(container.width) || 8;
      const containerPadding = container.showBorder ? 8 : 0;
      const nestedLayoutEl = dropZoneRef.current?.querySelector('.nested-layout') as HTMLElement | null;
      const nestedRect = nestedLayoutEl?.getBoundingClientRect();
      const effectiveWidth = Math.max(1, ((nestedRect?.width ?? dropZoneWidth) || 1) - containerPadding * 2);
      const nestedColWidth = effectiveWidth / Math.max(1, containerCols);

      const componentType = (e.dataTransfer?.getData('componentType') ||
        (window as unknown as Record<string, unknown>).__draggedComponentType) as WidgetType;
      const crossGridTargetContainerId = (window as unknown as Record<string, unknown>)
        .__rglCrossGridTargetContainerId as string | undefined;
      const crossGridSize = (window as unknown as Record<string, unknown>).__rglCrossGridDragSize as
        | { w?: number; h?: number }
        | undefined;

      const isCrossGridDragForThisContainer =
        crossGridTargetContainerId === container.id &&
        typeof crossGridSize?.w === 'number' &&
        typeof crossGridSize?.h === 'number';

      const applyExternalInsertDetection = (draggedWidth: number, draggedHeight: number) => {
        const relX = Math.max(0, e.clientX - (nestedRect?.left ?? 0) - containerPadding);
        const relY = Math.max(0, e.clientY - (nestedRect?.top ?? 0) - containerPadding);

        const fallbackCol = Math.max(
          0,
          Math.min(containerCols - draggedWidth, Math.floor(relX / Math.max(1, nestedColWidth))),
        );
        const fallbackRow = Math.max(0, Math.floor(relY / Math.max(1, rowHeight)));

        let targetCol = fallbackCol;
        let targetRow = fallbackRow;

        if (nestedLayoutEl) {
          const insertState = computeInsertDetection({
            mouseX: relX,
            mouseY: relY,
            draggedWidth: Math.max(1, draggedWidth),
            draggedHeight: Math.max(1, draggedHeight),
            layoutItems: buildLayoutItemsFromComponents(childComponents),
            rowHeight,
            colWidth: nestedColWidth,
            containerCols,
            containerPadding,
            rglElement: nestedLayoutEl,
            components: childComponents.map((comp) => ({ id: comp.id, width: Number(comp.width) || 1 })),
          });

          if (insertState) {
            setInsertMode(insertState, draggedHeight);
            targetCol = insertState.targetCol;
            targetRow = insertState.targetRow;
          } else {
            clearInsertMode();
          }
        } else {
          clearInsertMode();
        }

        return { targetCol, targetRow };
      };

      if (componentType && !isCrossGridDragForThisContainer) {
        if (isContainerWidgetType(componentType)) {
          // Container-in-container drops are invalid: suppress nested RGL placeholder entirely.
          clearInsertMode();
          return false;
        }

        const size = getCustomComponentSize(componentType);
        // Palette drags should show the same insert-line targeting as other nested drops so
        // placement is predictable before drop.
        applyExternalInsertDetection(Math.max(1, size.width), Math.max(1, size.height));
        lastInsertDetectionTimeRef.current = Date.now();
        lastInsertDetectionPosRef.current = { x: e.clientX, y: e.clientY };

        return { w: size.width, h: size.height };
      }

      const fallbackType = (window as unknown as Record<string, unknown>).__draggedComponentType as
        | WidgetType
        | undefined;
      if (isContainerWidgetType(fallbackType)) {
        clearInsertMode();
        return false;
      }

      if (isCrossGridDragForThisContainer) {
        const crossGridWidth = Math.max(1, Number(crossGridSize.w) || 1);
        const crossGridHeight = Math.max(1, Number(crossGridSize.h) || 1);
        // Cross-grid canvas/container drags use nested insert detection so the container
        // insert line stays visible and the drag preview aligns to the computed target.
        const { targetCol, targetRow } = applyExternalInsertDetection(crossGridWidth, crossGridHeight);

        onDragPreviewChange?.((prev) => {
          if (!prev.visible || prev.targetType !== 'container' || prev.containerId !== container.id || !prev.position) {
            return prev;
          }
          if (prev.position.x === targetCol && prev.position.y === targetRow) {
            return prev;
          }
          return {
            ...prev,
            position: {
              ...prev.position,
              x: targetCol,
              y: targetRow,
              w: crossGridWidth,
              h: crossGridHeight,
            },
          };
        });

        return { w: crossGridWidth, h: crossGridHeight };
      }

      // Keep nested drops permissive when browsers restrict payload reads during dragover.
      if (fallbackType) {
        const fallbackSize = getCustomComponentSize(fallbackType);
        applyExternalInsertDetection(Math.max(1, fallbackSize.width), Math.max(1, fallbackSize.height));
        return { w: fallbackSize.width, h: fallbackSize.height };
      }

      clearInsertMode();
      return { w: 2, h: 2 };
    },
    [
      container.id,
      container.width,
      container.showBorder,
      dropZoneWidth,
      childComponents,
      rowHeight,
      setInsertMode,
      clearInsertMode,
      dropZoneRef,
      onDragPreviewChange,
      isPointerWithinVisibleDropZone,
    ],
  );

  // --- handleNestedItemDrag ---
  const handleNestedItemDrag = React.useCallback<ContainerLayoutHandlers['handleDrag']>(
    (layoutItems, oldItem, newItem, placeholder, e, element) => {
      // Check if pointer is still inside the container drop zone.
      // When dragging back toward the palette, the pointer leaves the container
      // but RGL keeps firing onDrag — hide the grid mesh in that case.
      const dropZoneEl = dropZoneRef.current;
      const isPointerInside = dropZoneEl
        ? (() => {
            const rect = dropZoneEl.getBoundingClientRect();
            return (
              e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
            );
          })()
        : true;

      if (isPointerInside) {
        if (!isNestedDragActive) {
          setIsNestedDragActive(true);
        }
      } else {
        if (isNestedDragActive) {
          setIsNestedDragActive(false);
        }
      }

      // RGL's internal drop placeholder — outer canvas handles the actual drop,
      // so onDragStop never fires for this item. Allow isNestedDragActive (mesh)
      // but skip draggingChildId and insert detection to avoid stuck state.
      // Cleanup happens via document-level drop/dragend/mouseup listeners.
      if (newItem.i === '__dropping-elem__') {
        return;
      }

      if (draggingChildId !== newItem.i) {
        setDraggingChildId(newItem.i);
      }
      handleDrag(layoutItems, oldItem, newItem, placeholder, e, element);

      if (isCrossGridDragSource || !isPointerInside) {
        clearInsertMode();
        return;
      }

      const draggedComponent = childComponents.find((comp) => comp.id === newItem.i);
      if (!draggedComponent) {
        clearInsertMode();
        return;
      }

      const nestedLayoutEl = element.closest('.nested-layout') as HTMLElement | null;
      if (!nestedLayoutEl) {
        clearInsertMode();
        return;
      }

      const now = Date.now();
      const lastPos = lastInsertDetectionPosRef.current;
      const dx = Math.abs(e.clientX - lastPos.x);
      const dy = Math.abs(e.clientY - lastPos.y);
      const timeSinceLastDetection = now - lastInsertDetectionTimeRef.current;
      if (
        timeSinceLastDetection < INSERT_DETECTION_THROTTLE_MS &&
        dx < INSERT_DETECTION_POSITION_THRESHOLD &&
        dy < INSERT_DETECTION_POSITION_THRESHOLD
      ) {
        return;
      }
      lastInsertDetectionTimeRef.current = now;
      lastInsertDetectionPosRef.current = { x: e.clientX, y: e.clientY };

      const cols = Number(container.width) || 8;
      const containerPadding = container.showBorder ? 8 : 0;
      const rect = nestedLayoutEl.getBoundingClientRect();
      const colWidth = Math.max(1, (rect.width - containerPadding * 2) / Math.max(1, cols));

      const mouseX = Math.max(0, e.clientX - rect.left - containerPadding);
      const mouseY = Math.max(0, e.clientY - rect.top - containerPadding);
      const draggedWidth = Math.max(1, Number(newItem.w) || Number(draggedComponent.width) || 1);
      const draggedHeight = Math.max(1, Number(newItem.h) || Number(draggedComponent.height) || 1);

      const pointerCol = Math.floor(mouseX / colWidth);
      const anchorOffset =
        dragAnchorOffsetColsRef.current ??
        Math.max(0, Math.min(draggedWidth - 1, pointerCol - (Number(newItem.x) || 0)));
      dragAnchorOffsetColsRef.current = anchorOffset;
      const alignedTargetCol = Math.max(0, Math.min(pointerCol - anchorOffset, cols - draggedWidth));
      const alignedMouseX = alignedTargetCol * colWidth;

      const layoutForDetection = layoutItems
        .filter((item) => item.i !== newItem.i)
        .map((item) => ({
          i: item.i,
          x: Number(item.x) || 0,
          y: Number(item.y) || 0,
          w: Number(item.w) || 1,
          h: Number(item.h) || 1,
        }));

      const insertState = computeInsertDetection({
        mouseX: alignedMouseX,
        mouseY,
        draggedWidth,
        draggedHeight,
        layoutItems: layoutForDetection,
        rowHeight,
        colWidth,
        containerCols: cols,
        containerPadding,
        rglElement: nestedLayoutEl,
        components: childComponents.map((comp) => ({ id: comp.id, width: Number(comp.width) || 1 })),
      });

      if (insertState) {
        setInsertMode(insertState, draggedHeight);
      } else {
        clearInsertMode();
      }
    },
    [
      handleDrag,
      isNestedDragActive,
      draggingChildId,
      isCrossGridDragSource,
      clearInsertMode,
      childComponents,
      container.width,
      container.showBorder,
      rowHeight,
      setInsertMode,
      dropZoneRef,
    ],
  );

  // --- handleNestedItemDragStop ---
  const handleNestedItemDragStop = React.useCallback<ContainerLayoutHandlers['handleDragStop']>(
    (layoutItems, oldItem, newItem, placeholder, e, element) => {
      setIsNestedDragActive(false);
      setDraggingChildId(null);
      const anchorOffsetAtDrop = dragAnchorOffsetColsRef.current;

      const activeInsertState = insertModeStateRef.current;
      const movedComponent = childComponents.find((comp) => comp.id === newItem.i);
      // Use only currently visible/active insert state; otherwise recompute from final pointer.
      let insertStateForDrop: InsertModeState | null = activeInsertState.isActive ? activeInsertState : null;

      // Recompute insert target from final pointer position as a fallback.
      if (!insertStateForDrop && movedComponent) {
        const nestedLayoutEl = element.closest('.nested-layout') as HTMLElement | null;
        if (nestedLayoutEl) {
          const cols = Number(container.width) || 8;
          const containerPadding = container.showBorder ? 8 : 0;
          const rect = nestedLayoutEl.getBoundingClientRect();
          const colWidth = Math.max(1, (rect.width - containerPadding * 2) / Math.max(1, cols));
          const mouseX = Math.max(0, e.clientX - rect.left - containerPadding);
          const mouseY = Math.max(0, e.clientY - rect.top - containerPadding);

          const draggedWidth = Math.max(1, Number(newItem.w) || Number(movedComponent.width) || 1);
          const draggedHeight = Math.max(1, Number(newItem.h) || Number(movedComponent.height) || 1);
          const pointerCol = Math.floor(mouseX / colWidth);
          const anchorOffset =
            anchorOffsetAtDrop ?? Math.max(0, Math.min(draggedWidth - 1, pointerCol - (Number(newItem.x) || 0)));
          const alignedTargetCol = Math.max(0, Math.min(pointerCol - anchorOffset, cols - draggedWidth));
          const alignedMouseX = alignedTargetCol * colWidth;

          const layoutForDetection = layoutItems
            .filter((item) => item.i !== newItem.i)
            .map((item) => ({
              i: item.i,
              x: Number(item.x) || 0,
              y: Number(item.y) || 0,
              w: Number(item.w) || 1,
              h: Number(item.h) || 1,
            }));

          const recomputedInsert = computeInsertDetection({
            mouseX: alignedMouseX,
            mouseY,
            draggedWidth,
            draggedHeight,
            layoutItems: layoutForDetection,
            rowHeight,
            colWidth,
            containerCols: cols,
            containerPadding,
            rglElement: nestedLayoutEl,
            components: childComponents.map((comp) => ({ id: comp.id, width: Number(comp.width) || 1 })),
          });

          if (recomputedInsert) {
            insertStateForDrop = recomputedInsert;
          }
        }
      }

      dragAnchorOffsetColsRef.current = null;

      const containerElement = element.closest('.layout-container-wrapper') as HTMLElement | null;
      const dropZoneElement = containerElement?.querySelector('.layout-container-drop-zone') as HTMLElement | null;
      const containerDefinedHeight = Number(container.height) || 12;
      const containerRect = (dropZoneElement ?? containerElement)?.getBoundingClientRect();
      const effectiveBottom = containerRect
        ? Math.min(containerRect.bottom, containerRect.top + Math.max(0, containerDefinedHeight) * rowHeight)
        : 0;
      const EDGE_TOLERANCE_PX = 12;
      const pointerWithinContainer =
        !!containerRect &&
        e.clientX >= containerRect.left - EDGE_TOLERANCE_PX &&
        e.clientX <= containerRect.right + EDGE_TOLERANCE_PX &&
        e.clientY >= containerRect.top - EDGE_TOLERANCE_PX &&
        e.clientY <= effectiveBottom + EDGE_TOLERANCE_PX;

      const shouldApplyInsertPush = Boolean(
        !isCrossGridDragSource &&
          insertStateForDrop &&
          movedComponent &&
          onNestedComponentsChange &&
          pointerWithinContainer,
      );

      if (shouldApplyInsertPush && movedComponent && insertStateForDrop && onNestedComponentsChange) {
        const draggedWidth = Math.max(1, Number(newItem.w) || Number(movedComponent.width) || 1);
        const draggedHeight = Math.max(1, Number(newItem.h) || Number(movedComponent.height) || 1);

        const existingLayout: PushLayoutItem[] = layoutItems
          .filter((item) => item.i !== movedComponent.id)
          .map((item) => ({
            i: item.i,
            x: Number(item.x) || 0,
            y: Number(item.y) || 0,
            w: Number(item.w) || 1,
            h: Number(item.h) || 1,
          }));

        const insertedItem: PushLayoutItem = {
          i: movedComponent.id,
          x: insertStateForDrop.targetCol,
          y: insertStateForDrop.targetRow,
          w: draggedWidth,
          h: draggedHeight,
        };

        const pushResult = calculateInsertPush(insertedItem, existingLayout);
        const pushMap = new Map(pushResult.layout.map((item) => [item.i, item]));

        const pushedChildren = childComponents.map((comp) => {
          const pushed = pushMap.get(comp.id);
          if (!pushed) return comp;
          if (comp.x === pushed.x && comp.y === pushed.y && comp.width === pushed.w && comp.height === pushed.h) {
            return comp;
          }
          return {
            ...comp,
            x: pushed.x,
            y: pushed.y,
            width: pushed.w,
            height: pushed.h,
          };
        });

        const hasChanges = pushedChildren.some((comp, index) => comp !== childComponents[index]);
        if (hasChanges) {
          skipNextNestedLayoutChangeRef.current = true;
          setTimeout(() => {
            skipNextNestedLayoutChangeRef.current = false;
          }, 200);
          onNestedComponentsChange(pushedChildren);
        }
        onDragPreviewClear?.();
        clearInsertMode();
        onNestedDragComplete?.();
        return;
      }

      handleDragStop(layoutItems, oldItem, newItem, placeholder, e, element);
      clearInsertMode();
    },
    [
      handleDragStop,
      childComponents,
      onNestedComponentsChange,
      container.height,
      container.width,
      container.showBorder,
      rowHeight,
      clearInsertMode,
      onDragPreviewClear,
      onNestedDragComplete,
      isCrossGridDragSource,
    ],
  );

  return {
    insertModeState,
    insertModeStateRef,
    insertPreviewHeight,
    isNestedDragActive,
    draggingChildId,
    isCrossGridDragSource,
    skipNextNestedLayoutChangeRef,
    clearInsertMode,
    resetNestedDragState,
    handleNestedDropDragOver,
    handleNestedItemDrag,
    handleNestedItemDragStop,
  };
};
