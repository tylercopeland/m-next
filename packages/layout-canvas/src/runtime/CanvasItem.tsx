import React, { useCallback } from 'react';
import { widgets as WIDGETS } from '@m-next/types';
import { useHoverStore, useIsHovered } from '../contexts/HoverContext';

import type { ResponsiveComponent, LayoutCanvasWrapperProps } from '../rgl-integration/types';
import type { ComponentDisplayContext } from '../shared/computeComponentDisplayState';
import type { ContainerPropsContext } from '../containers/utils/buildContainerProps';
import type { RuntimePropsContext } from '../shared/buildWrapperProps';
import { computeComponentDisplayState } from '../shared/computeComponentDisplayState';
import { buildContainerProps } from '../containers/utils/buildContainerProps';
import { buildWrapperProps } from '../shared/buildWrapperProps';
import { ComponentVisualFeedback } from '../shared/ComponentVisualFeedback';
import { ContainerManager } from '../containers';
import { mapWidgetToControlType } from '../registry/registryUtils';
import * as s from '../rgl-integration/wrappers/LayoutCanvas.styles';
import { useSizeObserver } from './useSizeObserver';

function renderRegistryWrapper(
  controlRegistry: LayoutCanvasWrapperProps['controlRegistry'],
  widgetType: string,
  props: Record<string, unknown>,
): React.ReactElement | null {
  const controlType = mapWidgetToControlType(widgetType);
  if (!controlType) {
    return null;
  }

  const WrapperComponent = controlRegistry[controlType].wrapper;
  if (!WrapperComponent) {
    return null;
  }

  return React.createElement(WrapperComponent as React.ComponentType<Record<string, unknown>>, props);
}

export interface CanvasItemProps {
  component: ResponsiveComponent;
  displayContext: ComponentDisplayContext;
  containerPropsCtx: ContainerPropsContext;
  runtimeCtx: RuntimePropsContext | null;
  controlRegistry: LayoutCanvasWrapperProps['controlRegistry'];
  showHiddenComponents: boolean;
  dragOverContainerId: string | null;
  currentDraggedComponent: ResponsiveComponent | null;
  isDragInProgress: boolean;
  isResizeInProgress: boolean;
  onComponentClick?: (componentId: string) => void;
  /** Whether the canvas is in runtime mode (enables size observation) */
  isRuntimeMode: boolean;
  /** Name of the control that should receive default focus */
  defaultFocusControlName?: string | null;
  /** Render function for child components (for containers) */
  renderComponent: (component: ResponsiveComponent) => React.ReactElement;
  /** className injected by RGL's GridItem via React.cloneElement */
  className?: string;
  /** style injected by RGL's GridItem via React.cloneElement (position, size) */
  style?: React.CSSProperties;
  /** Children injected by react-resizable via React.cloneElement (resize handles) */
  children?: React.ReactNode;
  /**
   * Additional props injected by RGL's cloneElement chain.
   * DraggableCore injects onMouseDown/onMouseUp/onTouchEnd via Resizable's
   * prop forwarding. These must reach the DOM element for drag to work.
   */
  [key: string]: unknown;
}

/**
 * Individual canvas item component.
 *
 * Extracted from the `renderComponent` callback in LayoutCanvas.tsx to be
 * a proper React component. This enables per-component hooks (like the
 * runtime size observer) and benefits from React.memo to prevent sibling
 * re-renders.
 *
 * Uses React.forwardRef because RGL's GridItem uses React.cloneElement to
 * inject a ref, className (.react-grid-item), and style (position/size)
 * onto each direct child. Without forwardRef, these props would be silently
 * dropped and the grid items wouldn't be positioned or styled correctly.
 *
 * In runtime mode, attaches a ResizeObserver to measure content height
 * and report it to the SizeObserverContext.
 */
export const CanvasItem = React.memo(
  React.forwardRef<HTMLDivElement, CanvasItemProps>(
    (
      {
        component,
        displayContext,
        containerPropsCtx,
        runtimeCtx,
        controlRegistry,
        showHiddenComponents,
        dragOverContainerId,
        currentDraggedComponent,
        isDragInProgress,
        isResizeInProgress,
        onComponentClick,
        isRuntimeMode,
        defaultFocusControlName = null,
        renderComponent,
        className: rglClassName,
        style: rglStyle,
        children: rglChildren,
        ...rglEventHandlers
      },
      ref,
    ) => {
      const isContainerComponent = ContainerManager.isContainer(component);

      // 1. Size observer (runtime only - no-op in designer mode)
      const sizeObserverRef = useSizeObserver({
        componentId: component.id,
        enabled: isRuntimeMode && !isContainerComponent,
      });

      // 1b. Per-component hover state from HoverStore (avoids Redux re-render on every mouse-over)
      const shouldObserveWithCanvasItem = isRuntimeMode && !isContainerComponent;

      // 1b. Per-component hover state from HoverStore (avoids Redux re-render on every mouse-over)
      const hoverStore = useHoverStore();
      const isHovered = useIsHovered(component.id);
      // Build a per-component displayContext that includes the local hover state
      const displayContextWithHover = { ...displayContext, hoveredComponentId: isHovered ? component.id : null };

      // 2. Compute all display state via shared utility
      const ds = computeComponentDisplayState(component, displayContextWithHover);

      // 3. Click handlers (defined early for use in collapsed label)
      const handleControlClick = useCallback(
        (controlId: string) => {
          if (!onComponentClick) return;
          onComponentClick(controlId);
        },
        [onComponentClick],
      );

      const handleWrapperClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleControlClick(component.id);
      };

      // Stable badge callbacks — defined before both render branches to satisfy hooks rules
      const handleBadgeMouseEnter = useCallback(() => {
        if (displayContext.isDraggable && component.id !== displayContext.selectedComponentId) {
          hoverStore.setHovered(component.id);
        }
      }, [displayContext.isDraggable, displayContext.selectedComponentId, component.id, hoverStore]);

      const handleBadgeClick = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          handleControlClick(component.id);
        },
        [component.id, handleControlClick],
      );

      // Render collapsed gridline label for hidden components with h=0 in designer mode
      if (component.height === 0 && ds.isHidden && displayContext.mode === 'designer') {
        return (
          <s.CollapsedLabelWrapper
            ref={ref}
            key={component.id}
            {...rglEventHandlers}
            className={`${rglClassName || ''} collapsed-hidden-label ${displayContext.isDraggable ? 'drag-handle' : ''} ${ds.hiddenClassName} ${ds.selectionClassName} ${ds.hoveredClassName}`.trim()}
            style={rglStyle}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleControlClick(component.id);
            }}
            onMouseEnter={
              displayContext.isDraggable
                ? () => {
                    if (component.id !== displayContext.selectedComponentId) {
                      hoverStore.setHovered(component.id);
                    }
                  }
                : undefined
            }
            onMouseLeave={
              displayContext.isDraggable
                ? (e) => {
                    const relatedTarget = e.relatedTarget as Element | null;
                    const isMovingToBadge = relatedTarget?.closest?.(`[data-component-id="${component.id}"]`);
                    if (isMovingToBadge) return;
                    hoverStore.scheduleUnhover(50);
                  }
                : undefined
            }
            data-testid={`component-${component.id}`}
            data-component-type={component.type}
            data-component-id={component.id}
          >
            <ComponentVisualFeedback
              componentId={component.id}
              isSelected={ds.isSelected}
              isHovered={ds.isHovered}
              isHidden={ds.isHidden}
              hasValidationError={ds.hasValidationError}
              isNearTop={ds.isNearTop}
              supportsHeightResize={ds.supportsHeightResize}
              isDragInProgress={isDragInProgress}
              isBeingDragged={false}
              isDraggable={displayContext.isDraggable}
              isResizeInProgress={isResizeInProgress}
              componentName={component.name || component.content || `Component ${component.id.slice(-8)}`}
              isDesignerMode={displayContext.isDraggable}
              isInContainer={ds.isInContainer}
              isInvalidDropTarget={false}
              isLayoutContainer={false}
              isStaticContainer={false}
              isDefaultFocus={component.name === defaultFocusControlName}
              onBadgeMouseEnter={handleBadgeMouseEnter}
              onBadgeClick={handleBadgeClick}
            />
          </s.CollapsedLabelWrapper>
        );
      }

      // 4. Invalid drop target detection (depends on window global and drag state)
      // @ts-expect-error - __draggedComponentType is not a standard window property
      const paletteDragType = (window as Record<string, unknown>).__draggedComponentType as string | undefined;

      const isContainerBeingDragged =
        (currentDraggedComponent && ContainerManager.isContainer(currentDraggedComponent)) ||
        paletteDragType === WIDGETS.LAYOUT_CONTAINER ||
        paletteDragType === WIDGETS.SECTION;

      const isInvalidDropTarget =
        ContainerManager.isContainer(component) &&
        isContainerBeingDragged &&
        component.id !== currentDraggedComponent?.id;

      // 5. Build container props via extracted utility (returns {} for non-containers)
      const isDraggable = displayContext.isDraggable;
      const containerProps = buildContainerProps(component, containerPropsCtx, renderComponent);

      // 6. Build wrapper props via extracted utility (handles designer vs runtime)
      const wrapperProps = buildWrapperProps(
        component,
        ds.isSelected,
        displayContext.mode,
        isDraggable,
        containerProps,
        handleControlClick,
        runtimeCtx,
      );

      // 7. Container-specific extra props
      if (ds.isLayoutContainer || ds.isStaticContainer) {
        wrapperProps.showHiddenComponents = showHiddenComponents;
        wrapperProps.isDraggedOver = dragOverContainerId === component.id;
      }

      // 8. Registry rendering + fallback
      const renderedComponent = renderRegistryWrapper(controlRegistry, component.type, wrapperProps);

      if (!renderedComponent) {
        return (
          <s.FallbackWrapper
            ref={ref}
            key={component.id}
            {...rglEventHandlers}
            className={`${rglClassName || ''} ${ds.staticClassName}`.trim()}
            style={rglStyle}
            data-component-id={component.id}
            data-component-type={component.type}
            data-selected={ds.isSelected}
            onClick={handleWrapperClick}
          >
            <div>
              <s.FallbackText>Component type {component.type} not found in registry</s.FallbackText>
              {ds.isLayoutContainer && <s.FallbackSubtext>(LAYOUT CONTAINER)</s.FallbackSubtext>}
            </div>
            {rglChildren}
          </s.FallbackWrapper>
        );
      }

      // 9. Visual wrapper with mouse event handlers
      // Merge RGL-injected style (position/size) with component-specific style
      const mergedStyle: React.CSSProperties = {
        ...rglStyle,
        ...(!isDraggable ? { cursor: 'default' } : undefined),
      };

      // HOTFIX: for CHT and PIC, set height: 100% on the observer wrapper so it fills the container and reports correct heights.
      const observerStyle: React.CSSProperties = { width: '100%' };
      if (component.type === 'CHT' || component.type === 'PIC') {
        observerStyle.height = '100%';
      }

      return (
        <s.ComponentWrapper
          ref={ref}
          key={component.id}
          {...rglEventHandlers}
          className={`${rglClassName || ''} ${ds.dragClassName} ${ds.staticClassName} ${ds.selectionClassName} ${ds.hoveredClassName} ${ds.heightResizeClass} ${ds.topRowClass} selection-click-zone ${ds.hiddenClassName}`.trim()}
          isInContainer={ds.isInContainer}
          handleColor={ds.handleColor}
          data-testid={`component-${component.id}`}
          data-component-type={component.type}
          style={mergedStyle}
          onClick={isDraggable ? handleWrapperClick : undefined}
          onMouseEnter={
            isDraggable
              ? () => {
                  if (component.id !== displayContext.selectedComponentId) {
                    hoverStore.setHovered(component.id);
                  }
                }
              : undefined
          }
          onMouseMove={
            isDraggable
              ? (e) => {
                  if (ContainerManager.isContainer(component) && component.id !== displayContext.selectedComponentId) {
                    const target = e.target as HTMLElement;
                    const isOnNestedLayout =
                      target.closest('.layout-container-wrapper') && !target.closest('.nested-drag-handle');
                    if (isOnNestedLayout) {
                      hoverStore.setHovered(component.id);
                    }
                  }
                }
              : undefined
          }
          onMouseLeave={
            isDraggable
              ? (e) => {
                  const relatedTarget = e.relatedTarget as Element | null;
                  const isMovingToBadge = relatedTarget?.closest?.(`[data-component-id="${component.id}"]`);
                  if (isMovingToBadge) return;
                  hoverStore.scheduleUnhover(50);
                }
              : undefined
          }
        >
          <ComponentVisualFeedback
            componentId={component.id}
            isSelected={ds.isSelected}
            isHovered={ds.isHovered}
            isHidden={ds.isHidden}
            hasValidationError={ds.hasValidationError}
            isNearTop={ds.isNearTop}
            supportsHeightResize={ds.supportsHeightResize}
            isDragInProgress={isDragInProgress}
            isBeingDragged={currentDraggedComponent?.id === component.id}
            isDraggable={isDraggable}
            isResizeInProgress={isResizeInProgress}
            componentName={component.name || component.content || `Component ${component.id.slice(-8)}`}
            isDesignerMode={isDraggable}
            isInContainer={ds.isInContainer}
            isInvalidDropTarget={isInvalidDropTarget}
            isLayoutContainer={ds.isLayoutContainer}
            isStaticContainer={ds.isStaticContainer}
            isDefaultFocus={component.name === defaultFocusControlName}
            onBadgeMouseEnter={handleBadgeMouseEnter}
            onBadgeClick={isDraggable ? handleBadgeClick : undefined}
          />

          {/* Size observer wrapper - only in runtime mode */}
          {shouldObserveWithCanvasItem ? (
            <div ref={sizeObserverRef} data-size-observer='true' style={observerStyle}>
              {renderedComponent}
            </div>
          ) : (
            renderedComponent
          )}

          {/* Resize handles injected by react-resizable via cloneElement children prop */}
          {rglChildren}
        </s.ComponentWrapper>
      );
    },
  ),
);

CanvasItem.displayName = 'CanvasItem';
