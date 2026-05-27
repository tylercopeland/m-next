/**
 * Hook that encapsulates layout-container drag-and-drop handlers.
 *
 * Extracted from LayoutCanvasWrapper.tsx to reduce file size and isolate
 * container-level drag/drop operations:
 * - onContainerDrop: Handles dropping new components into containers
 * - onContainerDragOver/Leave: Visual drag feedback for containers
 * - onComponentDragStart: Initiates component move within/between containers
 * - onContainerComponentsChange: Syncs child component position changes
 */
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ResponsiveComponent } from '@m-next/layout-canvas';
import { ContainerManager } from '@m-next/layout-canvas/src/containers/utils/ContainerManager';
import { calculateInsertPush } from '@m-next/layout-canvas/src/utils/insertPushCalculator';
import { LayoutItem as PushLayoutItem } from '@m-next/layout-canvas/src/utils/verticalPushCalculator';
import { Controls, LayoutCanvas } from '../utils/layoutDataMappers';
import {
  buildFlatLayoutItemsSimple,
  assembleLayoutCanvas,
} from '../utils/v4LayoutPersistence';
import { controlUpdated } from '../../../common/services/screenLayoutSlice';

interface UseContainerCanvasHandlersParams {
  /** Current canvas components */
  canvasComponents: ResponsiveComponent[];
  /** Setter for canvas components state */
  setCanvasComponents: React.Dispatch<React.SetStateAction<ResponsiveComponent[]>>;
  /** Controls from props */
  controls?: Controls;
  /** Controls from Redux (more up-to-date) */
  reduxControls: Controls;
  /** V4 layout change callback */
  onLayoutV4Change?: (layoutCanvas: LayoutCanvas) => void;
  /** V4 layout data */
  layoutV4?: LayoutCanvas;
  /** Version ID for layout persistence */
  versionId?: string;
  /** Current resolution breakpoint */
  resolution: string;
  /** The main handleComponentsChange from LayoutCanvasWrapper */
  handleComponentsChange: (components: ResponsiveComponent[]) => void;
  /** Ref to field list for name uniqueness checks */
  fieldListRef: React.MutableRefObject<{ name: string }[] | null | undefined>;
  /** Whether the component is in initial load period */
  isInitialLoad: boolean;
  /** Ref tracking when handleComponentsChange last ran (to avoid sync overwrite) */
  handleComponentsChangeTimeRef: React.MutableRefObject<number>;
  /** Ref for last components snapshot used by dedupe/sync logic */
  lastComponentsRef: React.MutableRefObject<ResponsiveComponent[]>;
  /** Ref for pending debounced component updates from LayoutCanvasWrapper */
  componentUpdateTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

interface UseContainerCanvasHandlersReturn {
  /** Handle drop into a container */
  onContainerDrop: (
    e: React.DragEvent,
    targetContainerId: string,
    position?: { x: number; y: number; w: number; h: number },
  ) => void;
  /** Handle drag over a container (visual feedback) */
  onContainerDragOver: (e: React.DragEvent, containerId: string) => void;
  /** Handle drag leaving a container */
  onContainerDragLeave: (e: React.DragEvent) => void;
  /** Handle starting a component drag within a container */
  onComponentDragStart: (e: React.DragEvent, componentId: string, parentId: string) => void;
  /** Handle child component position changes within containers */
  onContainerComponentsChange: (updatedComponents: ResponsiveComponent[]) => void;
  /** ID of the container currently being dragged over (for visual highlight) */
  dragOverContainerId: string | null;
}

export function useContainerCanvasHandlers({
  canvasComponents,
  setCanvasComponents,
  controls,
  reduxControls,
  onLayoutV4Change,
  layoutV4,
  versionId,
  resolution,
  handleComponentsChange,
  fieldListRef,
  isInitialLoad,
  handleComponentsChangeTimeRef,
  lastComponentsRef,
  componentUpdateTimeoutRef,
}: UseContainerCanvasHandlersParams): UseContainerCanvasHandlersReturn {
  const dispatch = useDispatch();
  const [dragOverContainerId, setDragOverContainerId] = useState<string | null>(null);

  const persistContainerDropUpdate = useCallback(
    (updatedComponents: ResponsiveComponent[]) => {
      handleComponentsChangeTimeRef.current = Date.now();
      setCanvasComponents(updatedComponents);

      // Keep existing wrapper-side control creation/update pipeline.
      handleComponentsChange(updatedComponents);
      lastComponentsRef.current = updatedComponents;

      // Persist V4 layout immediately to avoid stale overwrite after container drops.
      if (onLayoutV4Change) {
        const flatWithResponsive = buildFlatLayoutItemsSimple(updatedComponents, canvasComponents, resolution, layoutV4);
        onLayoutV4Change(assembleLayoutCanvas(flatWithResponsive, layoutV4, versionId));
      }
    },
    [
      handleComponentsChangeTimeRef,
      setCanvasComponents,
      handleComponentsChange,
      lastComponentsRef,
      onLayoutV4Change,
      canvasComponents,
      resolution,
      layoutV4,
      versionId,
    ],
  );

  const onContainerDrop = useCallback(
    (
      e: React.DragEvent,
      targetContainerId: string,
      position?: { x: number; y: number; w: number; h: number },
    ) => {
      e.preventDefault();
      e.stopPropagation();

      // Clear stale pending debounced updates so container drag/drop changes
      // cannot be overwritten by an older timeout callback.
      if (componentUpdateTimeoutRef.current) {
        clearTimeout(componentUpdateTimeoutRef.current);
        componentUpdateTimeoutRef.current = null;
      }

      // Route BOTH move and palette container drops through layout-canvas ContainerManager.
      // This preserves insert-push behavior and keeps drag logic consistent with the shared package.
      ContainerManager.handleNestedDrop(
        e,
        targetContainerId,
        canvasComponents,
        persistContainerDropUpdate,
        fieldListRef.current || undefined,
        position,
      );

      setDragOverContainerId(null);
    },
    [
      canvasComponents,
      persistContainerDropUpdate,
      fieldListRef,
      componentUpdateTimeoutRef,
    ],
  );

  const onContainerDragOver = useCallback((e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverContainerId(containerId);
  }, []);

  const onContainerDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverContainerId(null);
  }, []);

  const onComponentDragStart = useCallback((e: React.DragEvent, componentId: string, parentId: string) => {
    e.dataTransfer.setData('text/plain', `move:${componentId}:${parentId || 'main'}`);
    e.stopPropagation();
  }, []);

  const onContainerComponentsChange = useCallback(
    (updatedChildComponents: ResponsiveComponent[]) => {
      const previousById = new Map(canvasComponents.map((comp) => [comp.id, comp]));
      // Create a map of updated child components for efficient lookup
      const updatedChildMap = new Map(updatedChildComponents.map((comp) => [comp.id, comp]));

      // Update the full components array with the new positions for child components
      let updatedAllComponents = canvasComponents.map((comp) => {
        const updatedChild = updatedChildMap.get(comp.id);
        return updatedChild || comp;
      });

      // Container -> canvas ejection path:
      // apply insert-push on full canvas layout so final placement matches preview intent.
      const ejectedChildren = updatedChildComponents.filter((updated) => {
        if (updated.containerId !== null) return false;
        const previous = previousById.get(updated.id);
        return Boolean(previous?.containerId);
      });

      ejectedChildren.forEach((ejectedChild) => {
        const insertedItem: PushLayoutItem = {
          i: ejectedChild.id,
          x: Number(ejectedChild.x) || 0,
          y: Number(ejectedChild.y) || 0,
          w: Number(ejectedChild.width) || 1,
          h: Number(ejectedChild.height) || 1,
        };

        const existingCanvasLayout: PushLayoutItem[] = updatedAllComponents
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

        updatedAllComponents = updatedAllComponents.map((comp) => {
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

      // Clear stale pending debounced updates so container ejection/move
      // doesn't get reverted by an older timeout callback.
      if (componentUpdateTimeoutRef.current) {
        clearTimeout(componentUpdateTimeoutRef.current);
        componentUpdateTimeoutRef.current = null;
      }

      // Update local state immediately to prevent snapping during save
      handleComponentsChangeTimeRef.current = Date.now();
      lastComponentsRef.current = updatedAllComponents;
      setCanvasComponents(updatedAllComponents);

      // Update Redux directly for all components changed by this nested action
      // (includes ejected child + any main-canvas components moved by insert-push).
      const changedComponents = updatedAllComponents.filter((component) => {
        const previous = previousById.get(component.id);
        if (!previous) return false;
        return (
          previous.x !== component.x ||
          previous.y !== component.y ||
          previous.width !== component.width ||
          previous.height !== component.height ||
          previous.containerId !== component.containerId
        );
      });

      changedComponents.forEach((component) => {
        const existingControl = controls?.[component.id];
        const reduxControl = reduxControls[component.id];
        const sourceControl = existingControl || reduxControl;

        if (sourceControl) {
          const dimensionsLocked =
            reduxControl?.__dimensionsLockedUntil && reduxControl.__dimensionsLockedUntil > Date.now();

          const updatedControl = {
            ...sourceControl,
            x: component.x,
            y: component.y,
            width: dimensionsLocked ? reduxControl.width : component.width,
            height: dimensionsLocked ? reduxControl.height : component.height,
            containerId: component.containerId,
          };

          dispatch(controlUpdated(updatedControl));
        }
      });

      if (!isInitialLoad && onLayoutV4Change) {
        const flatWithResponsive = buildFlatLayoutItemsSimple(updatedAllComponents, canvasComponents, resolution);
        onLayoutV4Change(assembleLayoutCanvas(flatWithResponsive, layoutV4, versionId));
      }
    },
    [
      canvasComponents,
      controls,
      reduxControls,
      dispatch,
      isInitialLoad,
      onLayoutV4Change,
      versionId,
      resolution,
      layoutV4,
      setCanvasComponents,
      handleComponentsChangeTimeRef,
      lastComponentsRef,
      componentUpdateTimeoutRef,
    ],
  );

  return {
    onContainerDrop,
    onContainerDragOver,
    onContainerDragLeave,
    onComponentDragStart,
    onContainerComponentsChange,
    dragOverContainerId,
  };
}
