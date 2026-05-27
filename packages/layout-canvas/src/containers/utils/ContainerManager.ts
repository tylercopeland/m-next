/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ResponsiveComponent, WidgetType } from '../../rgl-integration/types';
import { WIDGETS } from '@m-next/runtime-interface';
import { CurrentState } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import { generateUniqueComponentName } from '../../utils/componentNaming';
import { getCustomComponentSize } from '../../utils/componentSizing';
import { mapWidgetToControlType, getDisplayRestrictionsFromRegistry } from '../../registry/registryUtils';
import { ContainerDropValidation, ContainerBounds, ContainerDropTarget, DragStopTarget } from '../ContainerTypes';
import { calculateInsertPush } from '../../utils/insertPushCalculator';
import { LayoutItem as PushLayoutItem } from '../../utils/verticalPushCalculator';
import { clientToGridCoords } from '../../utils/gridCoordinateUtils';

/**
 * Utility class for managing container operations and validations
 */
export class ContainerManager {
  /**
   * Validates if a component can be dropped into a container
   */
  static validateContainerDrop(
    container: ResponsiveComponent,
    componentType: string,
    components: ResponsiveComponent[],
  ): ContainerDropValidation {
    // Prevent containers inside containers (single-level nesting only)
    if (componentType === WIDGETS.LAYOUT_CONTAINER || componentType === WIDGETS.SECTION) {
      return {
        isValid: false,
        reason: 'Containers cannot be placed inside other containers',
      };
    }

    // Check if container has a maximum children limit
    const containerConfig = container.container;
    if (containerConfig?.maxChildren) {
      const childCount = components.filter((c) => c.containerId === container.id).length;
      if (childCount >= containerConfig.maxChildren) {
        return {
          isValid: false,
          reason: `Container is full (max ${containerConfig.maxChildren} children)`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Calculates container bounds using RGL's positioning formula
   */
  static calculateContainerBounds(
    container: ResponsiveComponent,
    colWidth: number,
    rowHeight: number,
    margin: number = 0,
    containerPadding: number = 8,
  ): ContainerBounds {
    const left = containerPadding + container.x * (colWidth + margin);
    const top = containerPadding + container.y * (rowHeight + margin);
    const width = container.width * colWidth + (container.width - 1) * margin;
    const height = container.height * rowHeight + (container.height - 1) * margin;

    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
    };
  }

  /**
   * Detects if a drop point is within container bounds
   */
  static isPointWithinContainer(dropX: number, dropY: number, containerBounds: ContainerBounds): boolean {
    return (
      dropX >= containerBounds.left &&
      dropX <= containerBounds.right &&
      dropY >= containerBounds.top &&
      dropY <= containerBounds.bottom
    );
  }

  /**
   * Finds the best container drop target for a given position
   * Uses direct container bounds so edge-to-edge drops remain possible
   * Accounts for component badge positioned above component to prevent false positives
   * Prevents last-row components from being detected as container drops
   * Uses 75% overlap rule for both existing component drags and palette drops
   */
  static detectDropTarget(
    dropX: number,
    dropY: number,
    draggedComponentType: string,
    components: ResponsiveComponent[],
    colWidth: number,
    rowHeight: number,
    draggedComponent?: ResponsiveComponent, // Optional: the component being dragged
    _paletteDropSize?: { width: number; height: number }, // Optional: size for palette drops
  ): ContainerDropTarget {
    // If dragging a component from the last row, NEVER allow container drop
    // This prevents the compaction issue where last-row components get pushed into containers
    if (draggedComponent) {
      // Find all non-container components on the main canvas
      const canvasComponents = components.filter((c) => !this.isContainer(c) && !c.containerId);

      if (canvasComponents.length > 0) {
        // Find the maximum Y position (last row)
        const maxY = Math.max(...canvasComponents.map((c) => c.y + c.height));

        // Check if the dragged component is in the last row
        const isInLastRow = draggedComponent.y + draggedComponent.height >= maxY;

        if (isInLastRow) {
          // Component is in last row - force canvas drop (no container detection)
          return {
            type: 'canvas',
            validDrop: true,
          };
        }
      }
    }

    const BADGE_HEIGHT = 40;

    // Find container components that might be drop targets
    const containerComponents = components.filter(
      (comp) => comp.type === WIDGETS.LAYOUT_CONTAINER || comp.type === WIDGETS.SECTION,
    );

    for (const container of containerComponents) {
      const containerBounds = this.calculateContainerBounds(container, colWidth, rowHeight);

      // Use true container bounds to avoid dead-zones along the edges.
      const candidateBounds = containerBounds;

      // Calculate component's actual top edge accounting for badge.
      // The badge offset only applies when dragging an existing component (which has a
      // visible badge above it). For palette drops there is no badge — the cursor
      // represents the component's top edge directly.
      const componentTopEdge = draggedComponent ? dropY + BADGE_HEIGHT : dropY;

      // For palette drags (no draggedComponent), use a point-based check: the cursor
      // position is the user's intent signal. The 75% area overlap rule causes the container
      // to "claim" the drag even when the cursor has clearly left, because the projected
      // component body still overlaps the container bounds.
      if (!draggedComponent) {
        if (this.isPointWithinContainer(dropX, componentTopEdge, candidateBounds)) {
          const validation = this.validateContainerDrop(container, draggedComponentType, components);

          return {
            type: 'container',
            containerId: container.id,
            containerComponent: container,
            containerBounds,
            validDrop: validation.isValid,
            reason: validation.reason,
          };
        }
        continue;
      }

      // 75% overlap rule: For existing component drags on the canvas
      const margin = 0;
      const componentPixelWidth = draggedComponent.width * (colWidth + margin);
      const componentPixelHeight = draggedComponent.height * (rowHeight + margin);

      // Calculate component bounds
      const componentBounds = {
        left: dropX,
        top: componentTopEdge,
        right: dropX + componentPixelWidth,
        bottom: componentTopEdge + componentPixelHeight,
      };

      // Calculate overlap area
      const overlapLeft = Math.max(componentBounds.left, candidateBounds.left);
      const overlapTop = Math.max(componentBounds.top, candidateBounds.top);
      const overlapRight = Math.min(componentBounds.right, candidateBounds.right);
      const overlapBottom = Math.min(componentBounds.bottom, candidateBounds.bottom);

      // Check if there's actual overlap
      if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
        const overlapWidth = overlapRight - overlapLeft;
        const overlapHeight = overlapBottom - overlapTop;
        const overlapArea = overlapWidth * overlapHeight;

        const componentArea = componentPixelWidth * componentPixelHeight;
        const overlapPercentage = overlapArea / componentArea;

        // Only consider it a container drop if 75% or more of component is inside
        if (overlapPercentage >= 0.75) {
          const validation = this.validateContainerDrop(container, draggedComponentType, components);

          return {
            type: 'container',
            containerId: container.id,
            containerComponent: container,
            containerBounds,
            validDrop: validation.isValid,
            reason: validation.reason,
          };
        }
      }
    }

    // Default to canvas drop (includes near-container drops that don't meet inset criteria)
    return {
      type: 'canvas',
      validDrop: true,
    };
  }

  /**
   * Gets child components for a container
   */
  static getChildComponents(containerId: string, components: ResponsiveComponent[]): ResponsiveComponent[] {
    return components.filter((comp) => comp.containerId === containerId);
  }

  /**
   * Checks if a container is empty
   */
  static isContainerEmpty(containerId: string, components: ResponsiveComponent[]): boolean {
    return this.getChildComponents(containerId, components).length === 0;
  }

  /**
   * Calculates relative position within container
   */
  static calculateRelativePosition(
    dropX: number,
    dropY: number,
    containerBounds: ContainerBounds,
    colWidth: number,
    rowHeight: number,
    margin: number = 0,
  ): { x: number; y: number } {
    const relativeX = dropX - containerBounds.left;
    const relativeY = dropY - containerBounds.top;

    return {
      x: Math.max(0, Math.floor(relativeX / (colWidth + margin))),
      y: Math.max(0, Math.floor(relativeY / (rowHeight + margin))),
    };
  }

  /**
   * Validates container configuration
   */
  static validateContainerConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.direction || !['row', 'column', 'row-reverse', 'column-reverse'].includes(config.direction)) {
      errors.push('Invalid direction: must be row, column, row-reverse, or column-reverse');
    }

    if (config.maxChildren && (typeof config.maxChildren !== 'number' || config.maxChildren < 1)) {
      errors.push('maxChildren must be a positive number');
    }

    if (config.gap && (typeof config.gap !== 'number' || config.gap < 0)) {
      errors.push('gap must be a non-negative number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Creates default container configuration
   */
  static createDefaultContainerConfig(): any {
    return {
      direction: 'column',
      children: [],
      wrap: true,
      gap: 4,
      alignItems: 'start',
      justifyContent: 'start',
      maxChildren: undefined,
    };
  }

  /**
   * Checks if a component is a container
   */
  static isContainer(component: ResponsiveComponent): boolean {
    return component.type === WIDGETS.LAYOUT_CONTAINER || component.type === WIDGETS.SECTION;
  }

  /**
   * Handles nested drop functionality like the blue canvas
   * Similar to the simplified implementation's onNestedDrop
   */
  static handleNestedDrop(
    e: React.DragEvent,
    targetContainerId: string,
    components: ResponsiveComponent[],
    onComponentsChange: (components: ResponsiveComponent[]) => void,
    fieldList?: any[],
    position?: { x: number; y: number; w: number; h: number }, // 🔧 FIX: Accept RGL-calculated position
  ): void {
    e.preventDefault();
    e.stopPropagation();

    const dataTransfer = e.dataTransfer;
    const data = dataTransfer?.getData('text/plain') || '';
    const componentType =
      dataTransfer?.getData('componentType') ||
      ((window as unknown as Record<string, unknown>).__draggedComponentType as string | undefined) ||
      '';
    const componentConfig =
      dataTransfer?.getData('componentConfig') ||
      ((window as unknown as Record<string, unknown>).__draggedComponentConfig as string | undefined) ||
      '';

    if (data.startsWith('move:')) {
      // Moving existing component
      const [, componentId, sourceParentId] = data.split(':');
      this.moveComponentBetweenContainers(
        componentId!,
        sourceParentId === 'main' ? null : sourceParentId || null,
        targetContainerId,
        components,
        onComponentsChange,
      );
    } else if (componentType) {
      // Adding new component from component palette

      // Prevent containers from being dropped into other containers
      const isContainerType = componentType === WIDGETS.LAYOUT_CONTAINER || componentType === WIDGETS.SECTION;
      if (isContainerType && targetContainerId !== 'main') {
        console.warn('Cannot drop a container into another container');
        return; // Reject the drop operation
      }

      // Parse component config if provided
      let config = {};
      try {
        if (componentConfig) {
          config = JSON.parse(componentConfig);
        }
      } catch (error) {
        console.warn('Failed to parse component config:', error);
      }

      // 🔧 FIX: Generate proper GUID and unique name like main canvas
      const properGuid = Guid.create();
      const uniqueName = generateUniqueComponentName(componentType as WidgetType, components, fieldList);
      const defaultSize = getCustomComponentSize(componentType as WidgetType);

      // Find the target container to determine appropriate sizing
      const targetContainer = components.find((c) => c.id === targetContainerId);
      const containerWidth = targetContainer?.width || 12;

      // 🔧 FIX: Get display restrictions from registry for proper min/max constraints
      const controlType = mapWidgetToControlType(componentType);
      const registryRestrictions = controlType ? getDisplayRestrictionsFromRegistry(controlType) : undefined;
      const displayRestrictions = registryRestrictions
        ? {
            minWidth: registryRestrictions.minWidth,
            maxWidth: registryRestrictions.maxWidth,
            minHeight: registryRestrictions.minHeight,
            maxHeight: registryRestrictions.maxHeight,
          }
        : undefined;

      const targetX = position?.x ?? 0;
      const targetY = position?.y ?? 0;
      const targetW = position?.w && position.w > 0 ? position.w : Math.min(defaultSize.width, containerWidth);
      const targetH = position?.h && position.h > 0 ? position.h : defaultSize.height;

      const newComponent: ResponsiveComponent = {
        id: properGuid, // ✅ Use GUID from the start
        x: targetX,
        y: targetY,
        width: targetW,
        height: targetH,
        type: componentType as WidgetType,
        content: uniqueName, // ✅ Use unique name (legacy field)
        name: uniqueName, // ✅ Unique identifier (source of truth)
        caption: uniqueName, // ✅ User-friendly label
        currentState: CurrentState.REGULAR,
        containerId: targetContainerId,
        static: false,
        container: isContainerType ? this.createDefaultContainerConfig() : undefined,
        displayRestrictions, // ✅ Attach display restrictions for proper min/max constraints in RGL
        ...config,
      };

      let adjustedComponents = components;
      if (targetContainerId && targetContainerId !== 'main') {
        const existingLayout: PushLayoutItem[] = components
          .filter((component) => component.containerId === targetContainerId)
          .map((component) => ({
            i: component.id,
            x: Number(component.x) || 0,
            y: Number(component.y) || 0,
            w: Number(component.width) || 1,
            h: Number(component.height) || 1,
          }));

        const insertedItem: PushLayoutItem = {
          i: properGuid,
          x: targetX,
          y: targetY,
          w: targetW,
          h: targetH,
        };

        const pushResult = calculateInsertPush(insertedItem, existingLayout);
        if (pushResult.hasPushed) {
          const pushedById = new Map(pushResult.layout.map((item) => [item.i, item]));
          adjustedComponents = components.map((component) => {
            if (component.containerId !== targetContainerId) return component;
            const pushed = pushedById.get(component.id);
            if (!pushed) return component;
            if (component.x === pushed.x && component.y === pushed.y) return component;
            return {
              ...component,
              x: pushed.x,
              y: pushed.y,
            };
          });
        }
      }

      const updatedComponents = [...adjustedComponents, newComponent];
      onComponentsChange(updatedComponents);
    } else if (data === 'basic') {
      // Legacy: Adding basic component from palette (fallback)
      const properGuid = Guid.create();
      const uniqueName = generateUniqueComponentName(WIDGETS.BUTTON, components, fieldList);

      const newComponent: ResponsiveComponent = {
        id: properGuid,
        x: 0, // 🔧 FIX: Place at left edge, let RGL vertical compaction stack components
        y: 0, // 🔧 FIX: Start at top, RGL vertical compaction will stack items properly
        width: 1,
        height: 1,
        type: WIDGETS.BUTTON,
        content: uniqueName,
        name: uniqueName,
        caption: uniqueName,
        currentState: CurrentState.REGULAR,
        containerId: targetContainerId,
        static: false,
        container: undefined,
      };

      onComponentsChange([...components, newComponent]);
    }
    // Remove 'canvas' legacy option that creates containers in containers
  }

  /**
   * Moves a component between containers
   * Similar to the simplified implementation's moveComponent
   */
  static moveComponentBetweenContainers(
    componentId: string,
    sourceParentId: string | null,
    targetParentId: string | null,
    components: ResponsiveComponent[],
    onComponentsChange: (components: ResponsiveComponent[]) => void,
  ): void {
    let componentToMove: ResponsiveComponent | null = null;

    // Find and remove the component from its current location
    const updatedComponents = components
      .map((item) => {
        // Check if this is the component we're moving - remove it from its current location
        if (item.id === componentId) {
          componentToMove = { ...item };
          return null;
        }

        if (sourceParentId === null) {
          // Moving from main canvas - component already handled above
          return item;
        } else {
          // Moving from nested container - update the container's children list
          if (item.id === sourceParentId && this.isContainer(item)) {
            // Remove from source container's children list
            return {
              ...item,
              container: {
                ...item.container,
                direction: item.container?.direction || 'column',
                children: (item.container?.children || []).filter((childId) => childId !== componentId),
              },
            } as ResponsiveComponent;
          }
        }
        return item;
      })
      .filter((item): item is ResponsiveComponent => item !== null);

    if (!componentToMove) return;

    // Type assertion to help TypeScript understand componentToMove is not null
    const component = componentToMove as ResponsiveComponent;

    // Prevent containers from being moved into other containers
    if (this.isContainer(component) && targetParentId !== null) {
      console.warn('Cannot move a container into another container');
      return; // Reject the move operation
    }

    // Add component to target location
    if (targetParentId === null) {
      // Moving to main canvas
      const movedComponent: ResponsiveComponent = {
        ...component,
        containerId: null,
        x: 0, // 🔧 FIX: Place at left edge, let RGL vertical compaction stack components
        y: 0, // 🔧 FIX: Start at top, RGL vertical compaction will stack items properly
        width: 2,
        height: 2,
      };
      onComponentsChange([...updatedComponents, movedComponent]);
    } else {
      // Moving to nested container
      const movedComponent: ResponsiveComponent = {
        ...component,
        containerId: targetParentId,
        x: 0, // 🔧 FIX: Place at left edge, let RGL vertical compaction stack components
        y: 0, // 🔧 FIX: Start at top, RGL vertical compaction will stack items properly
        width: 1,
        height: 1,
      };

      const finalComponents = updatedComponents.map((item) => {
        if (item.id === targetParentId && this.isContainer(item)) {
          return {
            ...item,
            container: {
              ...item.container,
              direction: item.container?.direction || 'column',
              children: [...(item.container?.children || []), movedComponent.id],
            },
          } as ResponsiveComponent;
        }
        return item;
      });

      onComponentsChange([...finalComponents, movedComponent]);
    }
  }

  /**
   * Handles drag over events for nested containers
   * Similar to the simplified implementation's onNestedDragOver
   */
  static handleNestedDragOver(
    e: React.DragEvent,
    canvasId: string,
    setDragOverCanvas: (canvasId: string | null) => void,
  ): void {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCanvas(canvasId);
  }

  /**
   * Handles drag leave events for nested containers
   */
  static handleNestedDragLeave(e: React.DragEvent, setDragOverCanvas: (canvasId: string | null) => void): void {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCanvas(null);
  }

  /**
   * Gets container-specific styling based on container style
   */
  static getContainerStyleClasses(containerStyle: string): string[] {
    const baseClasses = ['layout-container'];

    switch (containerStyle) {
      case 'card':
        return [...baseClasses, 'container-card'];
      case 'panel':
        return [...baseClasses, 'container-panel'];
      case 'group':
        return [...baseClasses, 'container-group'];
      case 'minimal':
        return [...baseClasses, 'container-minimal'];
      default:
        return [...baseClasses, 'container-default'];
    }
  }

  /**
   * Detects where a component should be moved when drag stops
   * Handles three cases: same container, another container, or main canvas
   */
  static detectDragStopTarget(
    mouseEvent: MouseEvent,
    draggedComponent: ResponsiveComponent,
    currentContainerElement: HTMLElement,
    currentContainerRect: DOMRect,
    rowHeight: number,
    boundaryBuffer: number = 30,
    containerDefinedHeight?: number, // Optional: for static mode, use defined height instead of rendered
  ): DragStopTarget | null {
    const { clientX, clientY } = mouseEvent;

    // For static mode (no compaction), use the container's DEFINED height to calculate
    // the intended bottom, since the rendered bottom expands when components are dragged below.
    // For non-static mode, use the rendered bounds as usual.
    let effectiveBottom = currentContainerRect.bottom;
    if (containerDefinedHeight !== undefined) {
      // Clamp to visible bounds so tall/scrollable containers don't treat off-screen
      // space as still "inside" during cross-grid drag-out.
      const definedBottom = currentContainerRect.top + Math.max(0, containerDefinedHeight) * rowHeight;
      effectiveBottom = Math.min(currentContainerRect.bottom, definedBottom);
    }

    // Check if dragged outside current container bounds
    const isOutsideBounds =
      clientX < currentContainerRect.left - boundaryBuffer ||
      clientX > currentContainerRect.right + boundaryBuffer ||
      clientY < currentContainerRect.top - boundaryBuffer ||
      clientY > effectiveBottom + boundaryBuffer;

    if (!isOutsideBounds) {
      // Still within the same container - no special handling needed
      return null;
    }

    // Dragged outside current container - check if over another container
    const elementsAtPoint = document.elementsFromPoint(clientX, clientY);

    // Find another container at the drop point (excluding current container).
    // `elementsFromPoint` may return nested children / drop-zone layers without the wrapper itself,
    // so walk up to the nearest container wrapper for each hit element.
    const seenContainers = new Set<HTMLElement>();
    const otherContainer = elementsAtPoint
      .map((el: Element) => {
        if (!(el instanceof HTMLElement)) return null;
        if (el.classList.contains('layout-container-wrapper')) return el;
        return el.closest('.layout-container-wrapper') as HTMLElement | null;
      })
      .find((candidate): candidate is HTMLElement => {
        if (!candidate) return false;
        if (candidate === currentContainerElement) return false;
        if (seenContainers.has(candidate)) return false;
        seenContainers.add(candidate);

        const targetDropZone = candidate.querySelector('.layout-container-drop-zone') as HTMLElement | null;
        const visibleRect = (targetDropZone ?? candidate).getBoundingClientRect();
        const isWithinVisibleBounds =
          clientX >= visibleRect.left &&
          clientX <= visibleRect.right &&
          clientY >= visibleRect.top &&
          clientY <= visibleRect.bottom;

        return isWithinVisibleBounds;
      });

    if (otherContainer) {
      // Dropped into ANOTHER container
      const targetContainerId = otherContainer.getAttribute('data-container-id');

      if (targetContainerId) {
        // Get the target container's bounds for position calculation
        const targetContainerRect = otherContainer.getBoundingClientRect();

        // Find the nested grid layout inside the target container.
        // Clamp projection to the visible drop-zone so overflowing nested content doesn't
        // produce "behind the container" positions.
        const targetDropZone = otherContainer.querySelector('.layout-container-drop-zone') as HTMLElement | null;
        const targetDropZoneRect = targetDropZone?.getBoundingClientRect();
        const targetGridLayout = otherContainer.querySelector('.nested-layout') as HTMLElement | null;
        const rawTargetGridRect = targetGridLayout?.getBoundingClientRect() ?? targetContainerRect;
        // DOMRect properties are prototype getters — spread operator won't copy them.
        // Explicitly destructure to create a plain object that clientToGridCoords can read.
        const targetGridRect =
          targetDropZoneRect && rawTargetGridRect.bottom > targetDropZoneRect.bottom
            ? ({
                x: rawTargetGridRect.x,
                y: rawTargetGridRect.y,
                left: rawTargetGridRect.left,
                top: rawTargetGridRect.top,
                right: rawTargetGridRect.right,
                width: rawTargetGridRect.width,
                bottom: targetDropZoneRect.bottom,
                height: Math.max(0, targetDropZoneRect.bottom - rawTargetGridRect.top),
                toJSON: () => ({}),
              } as DOMRect)
            : rawTargetGridRect;
        const targetContainerCols = Number(otherContainer.getAttribute('data-container-cols')) || 12;
        const targetContainerPadding = Number(otherContainer.getAttribute('data-container-padding')) || 0;

        const projection = clientToGridCoords({
          clientX,
          clientY,
          rect: targetGridRect,
          cols: targetContainerCols,
          rowHeight,
          padding: targetContainerPadding,
          itemWidth: Math.max(1, Number(draggedComponent.width) || 1),
          xRounding: 'round',
          yRounding: 'round',
        });

        return {
          type: 'other-container',
          targetContainerId,
          position: { x: projection.x, y: projection.y },
          component: draggedComponent,
        };
      }
    }

    // Not over another container - move to main canvas
    const mainCanvasWrapper = currentContainerElement.closest('.react-grid-layout')
      ?.parentElement as HTMLElement | null;

    if (mainCanvasWrapper) {
      const mainGrid = mainCanvasWrapper.querySelector('.react-grid-layout:not(.nested-layout)') as HTMLElement | null;
      if (!mainGrid) {
        return null;
      }

      const mainCanvasRect = mainGrid.getBoundingClientRect();
      const cols = 12;
      const containerPadding = 8;
      const componentWidth = Math.max(1, Number(draggedComponent.width) || 1);
      const projection = clientToGridCoords({
        clientX,
        clientY,
        rect: mainCanvasRect,
        cols,
        rowHeight,
        padding: containerPadding,
        itemWidth: componentWidth,
        xRounding: 'round',
        yRounding: 'round',
      });

      return {
        type: 'main-canvas',
        targetContainerId: null,
        position: { x: projection.x, y: projection.y },
        component: draggedComponent,
      };
    }

    return null;
  }

  /**
   * Applies the drag stop target result to update component positions
   */
  static applyDragStopTarget(target: DragStopTarget, childComponents: ResponsiveComponent[]): ResponsiveComponent[] {
    return childComponents.map((comp) => {
      if (comp.id === target.component.id) {
        return {
          ...comp,
          containerId: target.targetContainerId ?? null,
          x: target.position.x,
          y: target.position.y,
          width: comp.width || 2,
          height: comp.height || 2,
        };
      }
      return comp;
    });
  }
}
