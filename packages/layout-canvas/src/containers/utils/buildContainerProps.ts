import React from 'react';
import type { ResponsiveComponent } from '../../rgl-integration/types';
import { ContainerManager } from './ContainerManager';
import { getDisabledState, type Resolution, type ScreenMode } from '../../utils/currentStateHelper';
import { buildNestedStructureWithResponsive, type LayoutCanvas } from '../../utils/structureConverters';
import type { DragPreview } from '../../hooks/useCanvasDragState';
import { calculateInsertPush } from '../../utils/insertPushCalculator';
import { LayoutItem as PushLayoutItem } from '../../utils/verticalPushCalculator';

/**
 * Context object containing all the closure variables that buildContainerProps needs.
 * Avoids threading 20+ individual parameters.
 */
export interface ContainerPropsContext {
  /** All components in the canvas (for finding children) */
  components: ResponsiveComponent[];
  /** Ref to latest components (for stale closure fix in callbacks) */
  componentsRef: React.MutableRefObject<ResponsiveComponent[]>;
  /** Whether drag is enabled (designer mode) */
  isDraggable: boolean;
  /** Whether resize is enabled */
  isResizable: boolean;
  /** Current responsive resolution */
  resolution: string;
  /** Current screen mode */
  mode: string;
  /** Currently selected component ID */
  selectedComponentId: string | null | undefined;
  /** Row height for nested grid */
  rowHeight: number;
  /** Whether to show hidden components in designer */
  showHiddenComponents: boolean;
  /** ID of the container being dragged over */
  dragOverContainerId: string | null;
  /** Global drag preview state used for custom drop-shadow rendering */
  dragPreview?: DragPreview;
  /** Synchronous drag preview ref used by drag-stop handlers */
  dragPreviewRef?: React.MutableRefObject<DragPreview>;
  /** Sets global drag preview state */
  setDragPreview?: React.Dispatch<React.SetStateAction<DragPreview>>;
  /** Suppresses immediate main-canvas onLayoutChange echoes after manual commits */
  skipNextLayoutChangeRef?: React.MutableRefObject<boolean>;
  /** Debounced main-canvas layout timeout that should be cancelled before manual commits */
  layoutChangeTimeoutRef?: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;

  // Callbacks (passed through from LayoutCanvas props)
  onComponentClick: ((componentId: string) => void) | null | undefined;
  onComponentsChange: ((components: ResponsiveComponent[]) => void) | null | undefined;
  onLayoutV4Change: ((layout: LayoutCanvas) => void) | null | undefined;

  // Canvas functionality props (for nested containers)
  dragOverCanvas: string | null;
  onNestedDrop: ((e: React.DragEvent, targetContainerId: string) => void) | undefined;
  onNestedDragOver: ((e: React.DragEvent, canvasId: string) => void) | undefined;
  onNestedDragLeave: ((e: React.DragEvent) => void) | undefined;
  onComponentDragStart: ((e: React.DragEvent, componentId: string, parentId: string) => void) | undefined;
  /** Clears global drag state after nested drag-stop transitions */
  clearAllDragStates: () => void;

  /** The ReactGridLayout component to pass to nested containers */
  ReactGridLayout: unknown;
}

/**
 * Builds the additional props object needed to render a container component
 * (LayoutContainer or Section). Returns an empty object for non-container components.
 *
 * This is a pure function extracted from LayoutCanvas.renderComponent to
 * isolate the container-specific prop assembly logic (SRP).
 */
export function buildContainerProps(
  component: ResponsiveComponent,
  ctx: ContainerPropsContext,
  renderComponent: (component: ResponsiveComponent) => React.ReactElement,
): Record<string, unknown> {
  if (!ContainerManager.isContainer(component)) {
    return {};
  }

  const childComponents = ContainerManager.getChildComponents(component.id, ctx.components);

  // Compute disabled state from responsive data / control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabled = getDisabledState(
    component as any,
    component.responsive,
    ctx.resolution as Resolution,
    ctx.mode as ScreenMode,
  );
  childComponents.forEach((child) => {
    // @ts-ignore
    child.disabledParent = disabled;
  });

  // Ensure container dimensions are numeric before passing
  const containerWithNumericProps = {
    ...component,
    width: Number(component.width) || 8,
    height: Number(component.height) || 12,
    x: Number(component.x) || 0,
    y: Number(component.y) || 0,
  };

  return {
    container: containerWithNumericProps,
    // @ts-ignore
    disabledParent: disabled,
    containerConfig: component.container,
    childComponents,
    isEmpty: ContainerManager.isContainerEmpty(component.id, ctx.components),
    onContainerClick: (containerId: string) => ctx.onComponentClick?.(containerId),
    onChildClick: (childId: string) => ctx.onComponentClick?.(childId),
    selectedComponentId: ctx.selectedComponentId,
    isDraggable: ctx.isDraggable,
    isResizable: ctx.isResizable,
    mode: ctx.mode,
    resolution: ctx.resolution,
    showHiddenComponents: ctx.showHiddenComponents,
    onNestedComponentsChange: (updatedChildren: ResponsiveComponent[]) => {
      if (!ctx.onComponentsChange) return;

      if (ctx.layoutChangeTimeoutRef?.current) {
        clearTimeout(ctx.layoutChangeTimeoutRef.current);
        ctx.layoutChangeTimeoutRef.current = null;
      }

      // Use componentsRef.current to get the LATEST components.
      // This callback may be called with a stale closure, but
      // componentsRef.current is always updated synchronously on every render.
      const latestComponents = ctx.componentsRef.current;

      // Merge updated children back into main components array
      let updatedComponents = latestComponents.map((comp) => {
        const updatedChild = updatedChildren.find((c) => c.id === comp.id);
        return updatedChild ?? comp;
      });

      // Cross-grid container -> canvas drop:
      // apply insert-push on the main canvas against full latest state.
      const ejectedChildren = updatedChildren.filter((updated) => {
        if (updated.containerId !== null) return false;
        const previous = latestComponents.find((comp) => comp.id === updated.id);
        return previous?.containerId === component.id;
      });

      ejectedChildren.forEach((ejectedChild) => {
        const insertedItem: PushLayoutItem = {
          i: ejectedChild.id,
          x: Number(ejectedChild.x) || 0,
          y: Number(ejectedChild.y) || 0,
          w: Number(ejectedChild.width) || 1,
          h: Number(ejectedChild.height) || 1,
        };

        const existingCanvasLayout: PushLayoutItem[] = updatedComponents
          .filter((comp) => !comp.containerId && comp.id !== ejectedChild.id)
          .map((comp) => ({
            i: comp.id,
            x: Number(comp.x) || 0,
            y: Number(comp.y) || 0,
            w: Number(comp.width) || 1,
            h: Number(comp.height) || 1,
          }));

        const pushResult = calculateInsertPush(insertedItem, existingCanvasLayout);
        const pushedById = new Map(pushResult.layout.map((item) => [item.i, item]));

        updatedComponents = updatedComponents.map((comp) => {
          if (comp.containerId) return comp;
          const pushed = pushedById.get(comp.id);
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
      });

      // Persist child changes with responsive data preservation
      if (ctx.onLayoutV4Change) {
        const nestedStructure = buildNestedStructureWithResponsive(updatedComponents, null, ctx.resolution);

        const layoutCanvasStructure = {
          canvasId: null,
          type: 'Grid',
          size: 12,
          content: nestedStructure,
        };

        ctx.onLayoutV4Change(layoutCanvasStructure);
      }

      ctx.onComponentsChange(updatedComponents);

      if (ejectedChildren.length > 0 && ctx.skipNextLayoutChangeRef) {
        const skipRef = ctx.skipNextLayoutChangeRef;
        skipRef.current = true;
        setTimeout(() => {
          skipRef.current = false;
        }, 200);
      }
    },
    // Blue canvas functionality props — disabled in runtime mode
    dragOverCanvas: ctx.isDraggable ? ctx.dragOverCanvas : null,
    onNestedDrop: ctx.isDraggable ? ctx.onNestedDrop : undefined,
    onNestedDragOver: ctx.isDraggable ? ctx.onNestedDragOver : undefined,
    onNestedDragLeave: ctx.isDraggable ? ctx.onNestedDragLeave : undefined,
    onNestedDragComplete: ctx.isDraggable ? ctx.clearAllDragStates : undefined,
    onComponentDragStart: ctx.isDraggable ? ctx.onComponentDragStart : undefined,
    ResponsiveGridLayout: ctx.ReactGridLayout,
    rowHeight: ctx.rowHeight,
    compactType: null,
    renderChildComponent: renderComponent,
    dragPreview: ctx.dragPreview,
    dragPreviewRef: ctx.dragPreviewRef,
    onDragPreviewChange: ctx.setDragPreview,
    onDragPreviewClear: () => ctx.setDragPreview?.({ visible: false }),
  };
}
