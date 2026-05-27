import React, { useState, useCallback } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { WidgetType } from '../rgl-integration/types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { injectRGLStyles } from '../rgl-integration/wrappers/LayoutCanvas.styles';
import { ComponentVisualFeedback } from '../shared/ComponentVisualFeedback';
import { computeComponentDisplayState } from '../shared/computeComponentDisplayState';
import { useGridItemClassManager } from '../hooks/useGridItemClassManager';
import { useContainerPreemptiveEventHandlers } from './hooks/useContainerPreemptiveEventHandlers';
import { useContainerHandler, type ContainerLayoutHandlers } from './hooks/useContainerHandler';
import { useContainerState } from './hooks/useContainerState';
import { useNestedDragHandlers } from './hooks/useNestedDragHandlers';
import { getCustomComponentSize } from '../utils/componentSizing';
import type { InsertModeState } from '../hooks/useCanvasDragState';
import { GridVisualization } from '../rgl-integration/visual-feedback/GridVisualization';
import { InsertIndicator } from '../components/InsertIndicator';
import { containerMemoComparison, type LayoutContainerWrapperProps } from './utils/containerMemoComparison';
import { computeInsertDetection, buildLayoutItemsFromComponents } from './utils/containerInsertDetection';
import { Z_CANVAS } from '../constants/zIndex';
import * as s from './LayoutContainer.styles';
import { CollapsedLabelWrapper } from '../rgl-integration/wrappers/LayoutCanvas.styles';
import { RuntimeLayoutProvider } from '../runtime/RuntimeLayoutProvider';
import { useSizeObserverContext } from '../runtime/SizeObserverContext';
import { NestedRuntimeItem } from './NestedRuntimeItem';

// Create basic grid layout like the main canvas
const ReactGridLayout = WidthProvider(RGL);
const containerScrollTopById = new Map<string, number>();
const NESTED_DRAG_CANCEL_SELECTOR = [
  'input:not(.dd-wrapper input):not(.adr-wrapper input)',
  'select',
  'textarea',
  'button:not(.btn-group-wrapper button)',
  'a[href]',
  '[contenteditable="true"]',
].join(', ');

/**
 * Main LayoutContainer component with direct canvas implementation
 */
export const LayoutContainer: React.FC<LayoutContainerWrapperProps> = React.memo(
  ({
    container,
    childComponents,
    selectedComponentId,
    onContainerClick,
    onChildClick,
    renderChildComponent,
    style = {},
    onNestedDrop,
    onNestedDragOver,
    onNestedDragLeave,
    onNestedDragComplete,
    onNestedComponentsChange,
    rowHeight = 30,
    isDraggable = true,
    isResizable = true,
    controlRegistry,
    resolution,
    mode,
    showHiddenComponents = false,
    isDraggedOver = false, //  FIX: For existing component drag highlight
    dragPreview,
    dragPreviewRef,
    onDragPreviewChange,
    onDragPreviewClear,
  }) => {
    // Track if component is mounted to prevent state updates after unmount
    const isMountedRef = React.useRef(true);
    const { reportSize: reportParentSize } = useSizeObserverContext();
    const [observedHeights, setObservedHeights] = useState<Map<string, number>>(() => new Map());
    const handleHeightChange = useCallback((heights: Map<string, number>) => {
      setObservedHeights(heights);
    }, []);

    const [expandedComponentId, setExpandedComponentId] = useState<string | null>(null);
    const expandedComponentIdRef = React.useRef<string | null>(null);
    expandedComponentIdRef.current = expandedComponentId; // synchronous every render

    // Prevents RGL's stale onLayoutChange (fired synchronously after expansion toggle)
    // from overwriting layout positions. Cleared after one animation frame.
    const isExpansionTogglingRef = React.useRef(false);

    const setExpansionWithGuard = useCallback((newId: string | null | ((prev: string | null) => string | null)) => {
      isExpansionTogglingRef.current = true;
      requestAnimationFrame(() => {
        isExpansionTogglingRef.current = false;
      });
      setExpandedComponentId(newId);
    }, []);

    // Track actual rendered height for real-time header visibility
    const containerRef = React.useRef<HTMLDivElement>(null);
    const dropZoneRef = React.useRef<HTMLDivElement>(null);
    const lastAppliedScrollTopRef = React.useRef<number | null>(null);
    const dragOverStaleClearTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastReportedRuntimeHeightRef = React.useRef(0);
    const [actualHeight, setActualHeight] = useState<number>(0);
    const [dropZoneWidth, setDropZoneWidth] = useState<number>(0);
    const [isNestedResizeActive, setIsNestedResizeActive] = useState(false);

    // Use ResizeObserver to track real-time height changes during resize
    React.useEffect(() => {
      const element = containerRef.current;
      if (!element) return;

      const resizeObserver = new ResizeObserver((entries) => {
        if (!isMountedRef.current) return;
        for (const entry of entries) {
          const height = entry.contentRect.height;
          setActualHeight(height);
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Track drop-zone width so nested grid mesh aligns exactly with container columns
    React.useEffect(() => {
      const dropZoneElement = dropZoneRef.current;
      if (!dropZoneElement) return;

      setDropZoneWidth(dropZoneElement.getBoundingClientRect().width);

      const resizeObserver = new ResizeObserver((entries) => {
        if (!isMountedRef.current) return;
        for (const entry of entries) {
          setDropZoneWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(dropZoneElement);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Auto-hide header when container height is too small (in real-time!)
    // Header takes ~50px (padding + font + border), so hide if actual height < 120px
    const shouldHideHeader = React.useMemo(() => {
      const minHeightForHeader = 120; // Minimum pixels needed to show header comfortably
      return actualHeight > 0 && actualHeight < minHeightForHeader;
    }, [actualHeight]);

    // Use compact mode for empty state text when container is very small
    const isCompactEmptyState = React.useMemo(() => {
      return actualHeight > 0 && actualHeight <= 50;
    }, [actualHeight]);

    // Hover state management for child components
    const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

    // Track if mouse is over a child component (to distinguish from container background hover)
    const [isOverChildComponent, setIsOverChildComponent] = useState(false);

    // Ref for hover clear timeout (prevents flickering when moving between component and badge)
    const hoverClearTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        isMountedRef.current = false;
        const dropZoneEl = dropZoneRef.current;
        if (dropZoneEl) {
          containerScrollTopById.set(container.id, dropZoneEl.scrollTop);
        }
        // Clear any pending hover timeout on unmount
        if (hoverClearTimeoutRef.current) {
          clearTimeout(hoverClearTimeoutRef.current);
          hoverClearTimeoutRef.current = null;
        }
        if (dragOverStaleClearTimeoutRef.current) {
          clearTimeout(dragOverStaleClearTimeoutRef.current);
          dragOverStaleClearTimeoutRef.current = null;
        }
      };
    }, [container.id]);

    React.useEffect(() => {
      setExpandedComponentId(null);
    }, [showHiddenComponents]);

    // Inject custom RGL styles on mount
    React.useEffect(() => {
      injectRGLStyles();
    }, []);

    // Shared grid-item class management (selected-item, top-row, hovered) scoped to nested layout
    useGridItemClassManager({
      scope: '.nested-layout',
      selectedComponentId,
      components: childComponents,
      onSelectionChange: () => setHoveredComponentId(null),
      hoveredComponentId,
      isOverChildComponent,
    });

    // State to track container dragging
    const [isContainerDragEnabled, setIsContainerDragEnabled] = useState(false);

    // Container visual state management
    const { visualState, setHovered, setDragOver } = useContainerState(
      container.id,
      childComponents,
      selectedComponentId,
    );

    const { layout, handleLayoutChange, handleDrag, handleDragStop, handleResizeStart, handleResizeStop } =
      useContainerHandler({
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
      });

    const {
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
    } = useNestedDragHandlers({
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
    });

    const shouldHideNativePlaceholder =
      insertModeState.isActive ||
      (dragPreview?.visible &&
        dragPreview.sourceContainerId === container.id &&
        (dragPreview.targetType !== 'container' || dragPreview.containerId !== container.id));

    const nestedLayoutMaxRowPosition = React.useMemo(() => {
      return layout.reduce((maxRow, item) => {
        const itemBottom = (Number(item.y) || 0) + (Number(item.h) || 0);
        return Math.max(maxRow, itemBottom);
      }, 0);
    }, [layout]);

    const nestedPreviewMaxRowPosition = React.useMemo(() => {
      if (!dragPreview?.visible || !dragPreview.position) return 0;
      if (dragPreview.targetType !== 'container' || dragPreview.containerId !== container.id) return 0;
      return (Number(dragPreview.position.y) || 0) + (Number(dragPreview.position.h) || 0);
    }, [dragPreview, container.id]);

    const nestedInsertMaxRowPosition = insertModeState.isActive
      ? insertModeState.targetRow + Math.max(1, insertPreviewHeight)
      : 0;

    const nestedGridMaxRowPosition = Math.max(
      nestedLayoutMaxRowPosition,
      nestedPreviewMaxRowPosition,
      nestedInsertMaxRowPosition,
    );

    const reportRuntimeHeightToParent = React.useCallback(() => {
      if (mode !== 'runtime') return;

      const containerEl = containerRef.current;
      const dropZoneEl = dropZoneRef.current;
      if (!containerEl || !dropZoneEl) return;

      const containerHeightPx = Math.ceil(
        containerEl.getBoundingClientRect().height || containerEl.offsetHeight || containerEl.clientHeight || 0,
      );
      const dropZoneHeightPx = Math.ceil(
        dropZoneEl.getBoundingClientRect().height || dropZoneEl.offsetHeight || dropZoneEl.clientHeight || 0,
      );
      const chromeHeightPx = Math.max(0, containerHeightPx - dropZoneHeightPx);
      const contentHeightPx = Math.max(dropZoneEl.scrollHeight, dropZoneEl.clientHeight, dropZoneHeightPx);
      const requiredHeightPx = Math.ceil(chromeHeightPx + contentHeightPx);

      if (requiredHeightPx <= 0) return;
      if (Math.abs(requiredHeightPx - lastReportedRuntimeHeightRef.current) < 1) return;

      lastReportedRuntimeHeightRef.current = requiredHeightPx;
      reportParentSize(container.id, requiredHeightPx);
    }, [mode, reportParentSize, container.id]);

    React.useLayoutEffect(() => {
      reportRuntimeHeightToParent();
    }, [
      reportRuntimeHeightToParent,
      nestedGridMaxRowPosition,
      childComponents.length,
      actualHeight,
      shouldHideHeader,
      container.showBorder,
      container.hideCaption,
    ]);

    React.useLayoutEffect(() => {
      const dropZoneEl = dropZoneRef.current;
      if (!dropZoneEl) return;

      const savedScrollTop = containerScrollTopById.get(container.id);
      if (savedScrollTop === undefined) return;

      // Avoid repeatedly writing the same value on every render.
      if (lastAppliedScrollTopRef.current === savedScrollTop && Math.abs(dropZoneEl.scrollTop - savedScrollTop) <= 1) {
        return;
      }

      dropZoneEl.scrollTop = savedScrollTop;
      lastAppliedScrollTopRef.current = dropZoneEl.scrollTop;
    }, [
      container.id,
      childComponents.length,
      nestedGridMaxRowPosition,
      isCrossGridDragSource,
      isNestedDragActive,
      insertModeState.isActive,
    ]);

    const isNestedGridMeshVisible =
      isDraggable &&
      mode !== 'runtime' &&
      !isCrossGridDragSource &&
      (visualState.isDragOver ||
        isDraggedOver ||
        isNestedDragActive ||
        isNestedResizeActive ||
        insertModeState.isActive);

    React.useEffect(() => {
      const shouldWatchExternalDragState =
        isDraggable && mode !== 'runtime' && (visualState.isDragOver || insertModeState.isActive || isNestedDragActive);
      if (!shouldWatchExternalDragState) return;

      const clearStaleContainerDragVisuals = () => {
        if (dragOverStaleClearTimeoutRef.current) {
          clearTimeout(dragOverStaleClearTimeoutRef.current);
          dragOverStaleClearTimeoutRef.current = null;
        }
        setDragOver(false);
        clearInsertMode();
      };

      const handleDocumentDragOver = (event: DragEvent) => {
        const dropZoneEl = dropZoneRef.current;
        if (!dropZoneEl) {
          clearStaleContainerDragVisuals();
          return;
        }

        const rect = dropZoneEl.getBoundingClientRect();
        const isWithinVisibleDropZone =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!isWithinVisibleDropZone) {
          clearStaleContainerDragVisuals();
        }
      };

      const handleDocumentDragEndLike = () => {
        clearStaleContainerDragVisuals();
        resetNestedDragState();
      };

      document.addEventListener('dragover', handleDocumentDragOver);
      document.addEventListener('drop', handleDocumentDragEndLike, true);
      document.addEventListener('dragend', handleDocumentDragEndLike, true);
      // RGL uses mouseup (not HTML5 dragend) — listen to clear insert state after RGL drags.
      document.addEventListener('mouseup', handleDocumentDragEndLike, true);

      return () => {
        document.removeEventListener('dragover', handleDocumentDragOver);
        document.removeEventListener('drop', handleDocumentDragEndLike, true);
        document.removeEventListener('dragend', handleDocumentDragEndLike, true);
        document.removeEventListener('mouseup', handleDocumentDragEndLike, true);
      };
    }, [
      isDraggable,
      mode,
      visualState.isDragOver,
      insertModeState.isActive,
      isNestedDragActive,
      setDragOver,
      clearInsertMode,
      resetNestedDragState,
    ]);

    const handleNestedLayoutChange = React.useCallback(
      (nextLayout: ContainerLayoutHandlers['layout']) => {
        if (skipNextNestedLayoutChangeRef.current || isExpansionTogglingRef.current) {
          return;
        }
        handleLayoutChange(nextLayout);
      },
      [handleLayoutChange],
    );

    const handleNestedItemResizeStart = React.useCallback<ContainerLayoutHandlers['handleResizeStart']>(
      (layoutItems, oldItem, newItem, placeholder, e, element) => {
        clearInsertMode();
        setIsNestedResizeActive(true);
        handleResizeStart(layoutItems, oldItem, newItem, placeholder, e, element);
      },
      [handleResizeStart, clearInsertMode],
    );

    const handleNestedItemResizeStop = React.useCallback<ContainerLayoutHandlers['handleResizeStop']>(
      (layoutItems, oldItem, newItem, placeholder, e, element) => {
        setIsNestedResizeActive(false);
        handleResizeStop(layoutItems, oldItem, newItem, placeholder, e, element);
      },
      [handleResizeStop],
    );

    // Clear container hover and handle/border classes when a child is selected
    React.useEffect(() => {
      const isChildSelected = childComponents.some((child) => child.id === selectedComponentId);
      if (isChildSelected) {
        // Clear internal container hover state
        setHovered(false);

        // Find the container's grid item in the main canvas and remove hovered class
        const containerElement = document.querySelector(`[data-testid="component-${container.id}"]`);
        const containerGridItem = containerElement?.closest('.react-grid-item');
        if (containerGridItem) {
          containerGridItem.classList.remove('hovered');
        }
      }
    }, [selectedComponentId, childComponents, setHovered, container.id]);

    useContainerPreemptiveEventHandlers({
      containerId: container.id,
      isDraggable,
      isMountedRef,
      setIsContainerDragEnabled,
      clearHoveredComponent: () => setHoveredComponentId(null),
    });

    // Main layout container implementation with direct canvas functionality
    const childComponentIds = React.useMemo(() => childComponents.map((c) => c.id), [childComponents]);

    return (
      <div
        id={`layout-container-${container.id}`}
        ref={containerRef}
        style={{
          padding: container.showBorder ? '8px' : '0px',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <s.ContainerWrapper
          id={`container-wrapper-${container.id}`}
          className={isContainerDragEnabled ? 'drag-handle layout-container-wrapper' : 'layout-container-wrapper'}
          data-container-id={container.id}
          data-container-cols={Number(container.width) || 8}
          data-container-padding={container.showBorder ? 8 : 0}
          isDragEnabled={isContainerDragEnabled}
          showBorder={container.showBorder ?? false}
          showShadow={container.showShadow ?? false}
          style={style}
          onClick={(e: React.MouseEvent) => {
            // Only select container if clicking container background, not child components
            // Check if click target is a child component or inside one
            const target = e.target as HTMLElement;
            const isChildComponent = target.closest('.nested-component-drag-area');
            const isDropZone = target.closest('.layout-container-drop-zone');

            // Only call onContainerClick if NOT clicking a child component
            // but still within the drop zone (empty space in container)
            if (!isChildComponent && isDropZone) {
              onContainerClick(container.id);
              if (expandedComponentIdRef.current !== null) {
                setExpansionWithGuard(null);
              }
            }
          }}
        >
          {/* Header - shown when hideCaption is false AND container is tall enough */}
          {!container.hideCaption && !shouldHideHeader && (
            // @ts-ignore
            <s.Header id={`container-header-${container.id}`} isDisabled={container.isDisabled ?? false}>
              {container.showIcon && container.icon && <SvgIcon name={container.icon} size={16} color={colors.grey} />}
              {container.caption || 'Container'}
            </s.Header>
          )}
          {/* Drop zone with canvas functionality - RGL handles actual drops, this is for visual feedback */}
          <s.DropZone
            id={`container-dropzone-${container.id}`}
            ref={dropZoneRef}
            className='layout-container-drop-zone'
            mode={mode}
            onScroll={(e) => {
              const nextScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
              containerScrollTopById.set(container.id, nextScrollTop);
              lastAppliedScrollTopRef.current = nextScrollTop;
            }}
            onDragOver={(e) => {
              e.preventDefault(); // Required for drop to work
              onNestedDragOver?.(e, container.id);
              setDragOver(true);
              if (dragOverStaleClearTimeoutRef.current) {
                clearTimeout(dragOverStaleClearTimeoutRef.current);
              }
              dragOverStaleClearTimeoutRef.current = setTimeout(() => {
                setDragOver(false);
                clearInsertMode();
                dragOverStaleClearTimeoutRef.current = null;
              }, 140);
            }}
            onDragLeave={(e) => {
              // Match main canvas pattern: only suppress leave when moving to a child element
              if (e.currentTarget.contains(e.relatedTarget as Node)) {
                return;
              }

              if (dragOverStaleClearTimeoutRef.current) {
                clearTimeout(dragOverStaleClearTimeoutRef.current);
                dragOverStaleClearTimeoutRef.current = null;
              }
              onNestedDragLeave?.(e);
              setDragOver(false);
              onDragPreviewClear?.();
              clearInsertMode();
            }}
            onDrop={() => {
              setDragOver(false);
              clearInsertMode();
              if (dragOverStaleClearTimeoutRef.current) {
                clearTimeout(dragOverStaleClearTimeoutRef.current);
                dragOverStaleClearTimeoutRef.current = null;
              }
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            isDragOver={visualState.isDragOver || isDraggedOver}
            isHovered={visualState.isHovered}
            isEmpty={childComponents.length === 0}
            suppressInternalScroll={Boolean(isCrossGridDragSource)}
          >
            <GridVisualization
              visible={isNestedGridMeshVisible}
              cols={Number(container.width) || 8}
              rowHeight={Number(rowHeight) || 30}
              width={Math.max(1, Math.round(dropZoneWidth))}
              theme='dragActive'
              containerPadding={container.showBorder ? 8 : 0}
              margin={0}
              maxRowPosition={nestedGridMaxRowPosition}
            />
            <InsertIndicator
              x={insertModeState.indicatorX}
              y={insertModeState.indicatorY}
              width={insertModeState.indicatorWidth}
              visible={insertModeState.isActive}
              height={3}
            />

            {/* Nested grid layout - always render in designer mode for drop handling, only when has children in runtime */}
            {(() => {
              const nestedGrid =
                childComponents.length > 0 || (isDraggable && mode !== 'runtime') ? (
                  <ReactGridLayout
                    key={`container-${container.id}-cols-${container.width || 8}`}
                    className={`nested-layout ${!isOverChildComponent ? 'hovering-container-bg' : ''} ${
                      shouldHideNativePlaceholder ? 'hide-drop-placeholder' : ''
                    } ${isCrossGridDragSource ? 'cross-grid-drag-source' : ''}
                `}
                    style={{ width: '100%', minHeight: '100%' }}
                    layout={layout}
                    onLayoutChange={handleNestedLayoutChange}
                    onDrag={handleNestedItemDrag}
                    onDragStop={handleNestedItemDragStop}
                    onResizeStart={handleNestedItemResizeStart}
                    onResizeStop={handleNestedItemResizeStop}
                    onDrop={(_layout: Layout[], layoutItem: Layout, event: Event) => {
                      const dropEvent = event as DragEvent;
                      const visibleDropZoneRect = dropZoneRef.current?.getBoundingClientRect();
                      const isWithinVisibleDropZone =
                        !visibleDropZoneRect ||
                        (dropEvent.clientX >= visibleDropZoneRect.left &&
                          dropEvent.clientX <= visibleDropZoneRect.right &&
                          dropEvent.clientY >= visibleDropZoneRect.top &&
                          dropEvent.clientY <= visibleDropZoneRect.bottom);

                      // Nested grid content can overflow the visible container body. If the pointer is
                      // outside the visible drop zone, do not swallow the drop; let the main canvas handle it.
                      if (!isWithinVisibleDropZone) {
                        clearInsertMode();
                        onDragPreviewClear?.();
                        return;
                      }

                      dropEvent.preventDefault();
                      dropEvent.stopPropagation();

                      const eventComponentType = dropEvent.dataTransfer?.getData('componentType');
                      const windowComponentType = (window as unknown as Record<string, unknown>)
                        .__draggedComponentType as WidgetType | undefined;
                      const componentType = (eventComponentType || windowComponentType || '') as WidgetType | '';

                      const componentConfig =
                        dropEvent.dataTransfer?.getData('componentConfig') ||
                        ((window as unknown as Record<string, unknown>).__draggedComponentConfig as
                          | string
                          | undefined) ||
                        '';

                      const movePayload = dropEvent.dataTransfer?.getData('text/plain') || '';

                      // Some valid drops (especially moves) may only carry text/plain payload.
                      if (!componentType && !movePayload) {
                        clearInsertMode();
                        return;
                      }

                      const defaultSize = componentType
                        ? getCustomComponentSize(componentType as WidgetType)
                        : {
                            width: Math.max(1, Number(layoutItem.w) || 1),
                            height: Math.max(1, Number(layoutItem.h) || 1),
                          };

                      const mockDataTransfer = {
                        getData: (key: string) => {
                          if (key === 'componentType') return componentType || '';
                          if (key === 'componentConfig') return componentConfig;
                          if (key === 'text/plain') return movePayload;
                          return '';
                        },
                        setData: () => {},
                        clearData: () => {},
                        effectAllowed: dropEvent.dataTransfer?.effectAllowed || 'all',
                        dropEffect: dropEvent.dataTransfer?.dropEffect || 'none',
                        files: dropEvent.dataTransfer?.files || ([] as unknown as FileList),
                        items: dropEvent.dataTransfer?.items || ([] as unknown as DataTransferItemList),
                        types: dropEvent.dataTransfer?.types || [],
                      };

                      const syntheticEvent = {
                        ...dropEvent,
                        preventDefault: () => dropEvent.preventDefault(),
                        stopPropagation: () => dropEvent.stopPropagation(),
                        dataTransfer: mockDataTransfer,
                      } as unknown as React.DragEvent;

                      const activeInsertState = insertModeStateRef.current;
                      // Do not use recently hidden insert state; prefer active indicator or final-pointer recompute.
                      let effectiveInsertState: InsertModeState | null = activeInsertState.isActive
                        ? activeInsertState
                        : null;

                      // Recompute at final pointer position for palette drops, and prefer this authoritative target.
                      // Dragover insert state can be stale/cleared by browser drag events right before drop.
                      if (componentType) {
                        const nestedLayoutEl = dropZoneRef.current?.querySelector(
                          '.nested-layout',
                        ) as HTMLElement | null;
                        const nestedRect = nestedLayoutEl?.getBoundingClientRect();
                        const containerCols = Number(container.width) || 8;
                        const containerPadding = container.showBorder ? 8 : 0;

                        if (nestedLayoutEl && nestedRect) {
                          const effectiveWidth = Math.max(1, nestedRect.width - containerPadding * 2);
                          const nestedColWidth = effectiveWidth / Math.max(1, containerCols);
                          const relX = Math.max(0, dropEvent.clientX - nestedRect.left - containerPadding);
                          const relY = Math.max(0, dropEvent.clientY - nestedRect.top - containerPadding);

                          const recomputedInsert = computeInsertDetection({
                            mouseX: relX,
                            mouseY: relY,
                            draggedWidth: defaultSize.width,
                            draggedHeight: defaultSize.height,
                            layoutItems: buildLayoutItemsFromComponents(childComponents),
                            rowHeight,
                            colWidth: nestedColWidth,
                            containerCols,
                            containerPadding,
                            rglElement: nestedLayoutEl,
                            components: childComponents.map((comp) => ({
                              id: comp.id,
                              width: Number(comp.width) || 1,
                            })),
                          });

                          if (recomputedInsert) {
                            effectiveInsertState = recomputedInsert;
                          }
                        }
                      }

                      const targetX = effectiveInsertState ? effectiveInsertState.targetCol : Number(layoutItem.x) || 0;
                      const targetY = effectiveInsertState ? effectiveInsertState.targetRow : Number(layoutItem.y) || 0;

                      onNestedDrop?.(syntheticEvent, container.id, {
                        x: targetX,
                        y: targetY,
                        w: defaultSize.width,
                        h: defaultSize.height,
                      });

                      clearInsertMode();
                      setDragOver(false);
                      resetNestedDragState();
                      onDragPreviewClear?.();
                      if (dragOverStaleClearTimeoutRef.current) {
                        clearTimeout(dragOverStaleClearTimeoutRef.current);
                        dragOverStaleClearTimeoutRef.current = null;
                      }
                    }}
                    cols={Number(container.width) || 8}
                    draggableHandle='.nested-drag-handle,.nested-component-drag-area'
                    draggableCancel={NESTED_DRAG_CANCEL_SELECTOR}
                    isDraggable={isDraggable}
                    isResizable={isResizable}
                    resizeHandles={isDraggable ? ['s', 'e', 'w'] : []}
                    compactType={null}
                    preventCollision={true} // Always prevent collisions - static layout
                    margin={[0, 0]}
                    containerPadding={container.showBorder ? [8, 8] : [0, 0]}
                    rowHeight={Number(rowHeight) || 30}
                    useCSSTransforms={false}
                    isDroppable={isDraggable}
                    // @ts-expect-error - onDropDragOver is supported by react-grid-layout at runtime
                    onDropDragOver={isDraggable ? handleNestedDropDragOver : undefined}
                  >
                    {childComponents.map((nestedItem) => {
                      // Compute all display state via shared utility
                      const ds = computeComponentDisplayState(nestedItem, {
                        isDraggable,
                        selectedComponentId,
                        hoveredComponentId,
                        resolution,
                        mode,
                      });

                      if (ds.isHidden && !showHiddenComponents && nestedItem.id !== expandedComponentId) {
                        // Runtime: completely remove hidden components (no visual)
                        if (mode !== 'designer') return null;

                        // Designer: render a collapsed label so the component is visible,
                        // selectable, and repositionable — matching main-canvas behaviour.
                        return (
                          <CollapsedLabelWrapper
                            key={nestedItem.id}
                            id={`container-${container.id}-component-${nestedItem.id}`}
                            className={`nested-drag-handle nested-component-drag-area collapsed-hidden-label ${ds.hiddenClassName} ${ds.selectionClassName}`.trim()}
                            onClick={(e: React.MouseEvent) => {
                              if (isDraggable) {
                                e.stopPropagation();
                                onChildClick?.(nestedItem.id);
                                setExpansionWithGuard((prev) => (prev === nestedItem.id ? null : nestedItem.id));
                              }
                            }}
                            onMouseEnter={() => {
                              if (hoverClearTimeoutRef?.current) {
                                clearTimeout(hoverClearTimeoutRef.current);
                                hoverClearTimeoutRef.current = null;
                              }
                              setIsOverChildComponent(true);
                              if (isDraggable && nestedItem.id !== selectedComponentId) {
                                setHoveredComponentId(nestedItem.id);
                              }
                            }}
                            onMouseLeave={() => {
                              setIsOverChildComponent(false);
                              if (isDraggable && hoveredComponentId === nestedItem.id && hoverClearTimeoutRef) {
                                hoverClearTimeoutRef.current = setTimeout(() => {
                                  setHoveredComponentId(null);
                                  hoverClearTimeoutRef.current = null;
                                }, 50);
                              }
                            }}
                            data-testid={`component-${nestedItem.id}`}
                            data-component-id={nestedItem.id}
                          >
                            <ComponentVisualFeedback
                              isSelected={ds.isSelected}
                              isHovered={ds.isHovered && isOverChildComponent}
                              isBeingDragged={false}
                              isHidden={ds.isHidden}
                              hasValidationError={ds.hasValidationError}
                              isNearTop={ds.isNearTop}
                              supportsHeightResize={false}
                              isDragInProgress={false}
                              isResizeInProgress={false}
                              componentName={nestedItem.name || nestedItem.content || 'Component'}
                              isDesignerMode={isDraggable}
                              unconfiguredBadgeOffset={4}
                              isDraggable={isDraggable}
                              componentId={nestedItem.id}
                              isNestedComponent={true}
                              onBadgeMouseEnter={() => {
                                if (hoverClearTimeoutRef?.current) {
                                  clearTimeout(hoverClearTimeoutRef.current);
                                  hoverClearTimeoutRef.current = null;
                                }
                              }}
                              onBadgeClick={
                                isDraggable
                                  ? (e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      onChildClick?.(nestedItem.id);
                                      setExpansionWithGuard((prev) => (prev === nestedItem.id ? null : nestedItem.id));
                                    }
                                  : undefined
                              }
                            />
                          </CollapsedLabelWrapper>
                        );
                      }

                      const inheritDisable = {
                        ...nestedItem,
                        // @ts-ignore
                        disabled: !!nestedItem.disabled || !!nestedItem.disabledParent,
                      };

                      // LayoutContainer-specific: hoveredClassName is further gated by isOverChildComponent
                      const hoveredClassName = ds.isHovered && !ds.isSelected && isOverChildComponent ? 'hovered' : '';

                      // Nested containers use different drag handle class than main canvas
                      const dragHandleClass = isDraggable ? 'nested-drag-handle nested-component-drag-area' : '';

                      return (
                        <s.NestedComponentWrapper
                          key={nestedItem.id}
                          id={`container-${container.id}-component-${nestedItem.id}`}
                          className={`${dragHandleClass} selection-click-zone ${ds.selectionClassName} ${hoveredClassName} ${ds.heightResizeClass} ${ds.topRowClass} ${ds.hiddenClassName}`}
                          onClick={(e: React.MouseEvent) => {
                            if (isDraggable) {
                              e.stopPropagation();
                              onChildClick?.(nestedItem.id);
                              if (expandedComponentIdRef.current !== null) {
                                setExpansionWithGuard(null);
                              }
                            }
                          }}
                          onMouseEnter={() => {
                            // Clear any pending hover clear timeout
                            if (hoverClearTimeoutRef?.current) {
                              clearTimeout(hoverClearTimeoutRef.current);
                              hoverClearTimeoutRef.current = null;
                            }
                            setIsOverChildComponent(true);
                            if (isDraggable && nestedItem.id !== selectedComponentId) {
                              setHoveredComponentId(nestedItem.id);
                            }
                          }}
                          onMouseLeave={(e: React.MouseEvent) => {
                            // Check if mouse is moving to the badge (which is outside the component)
                            const relatedTarget = e.relatedTarget as HTMLElement | null;
                            const isMovingToBadge = relatedTarget?.closest('[data-component-id]') !== null;

                            if (isMovingToBadge) {
                              // Don't immediately clear hover - the badge mouse enter will maintain it
                              return;
                            }

                            setIsOverChildComponent(false);
                            if (isDraggable && hoveredComponentId === nestedItem.id && hoverClearTimeoutRef) {
                              // Use small delay to allow for badge interaction
                              hoverClearTimeoutRef.current = setTimeout(() => {
                                setHoveredComponentId(null);
                                hoverClearTimeoutRef.current = null;
                              }, 50);
                            }
                          }}
                          handleColor={ds.handleColor}
                          data-testid={`component-${nestedItem.id}`}
                        >
                          <ComponentVisualFeedback
                            isSelected={ds.isSelected}
                            isHovered={ds.isHovered}
                            isBeingDragged={draggingChildId === nestedItem.id}
                            isHidden={ds.isHidden}
                            hasValidationError={ds.hasValidationError}
                            isNearTop={ds.isNearTop}
                            supportsHeightResize={ds.supportsHeightResize}
                            isDragInProgress={isNestedDragActive || isDraggedOver || visualState.isDragOver}
                            isResizeInProgress={isNestedResizeActive}
                            componentName={nestedItem.name || nestedItem.content || 'Component'}
                            isDesignerMode={isDraggable}
                            unconfiguredBadgeOffset={4}
                            isDraggable={isDraggable}
                            componentId={nestedItem.id}
                            isNestedComponent={true}
                            onBadgeMouseEnter={() => {
                              // Clear any pending hover clear timeout when entering badge
                              if (hoverClearTimeoutRef?.current) {
                                clearTimeout(hoverClearTimeoutRef.current);
                                hoverClearTimeoutRef.current = null;
                              }
                            }}
                            onBadgeClick={
                              isDraggable
                                ? (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    onChildClick?.(nestedItem.id);
                                    if (expandedComponentIdRef.current !== null) {
                                      setExpansionWithGuard(null);
                                    }
                                  }
                                : undefined
                            }
                          />

                          <NestedRuntimeItem
                            componentId={nestedItem.id}
                            isRuntimeMode={mode === 'runtime'}
                            enablePointerEvents={!isDraggable}
                            allowDesignerDropdownInteractions={isDraggable}
                          >
                            {renderChildComponent(inheritDisable)}
                          </NestedRuntimeItem>
                        </s.NestedComponentWrapper>
                      );
                    })}
                  </ReactGridLayout>
                ) : null;
              return mode === 'runtime' && nestedGrid ? (
                <RuntimeLayoutProvider
                  componentIds={childComponentIds}
                  rowHeight={Number(rowHeight) || 30}
                  onHeightChange={handleHeightChange}
                >
                  {nestedGrid}
                </RuntimeLayoutProvider>
              ) : (
                nestedGrid
              );
            })()}
            {/* Empty state text - shown when no children in designer mode */}
            {childComponents.length === 0 && mode !== 'runtime' && (
              <s.EmptyStateText
                isCompact={isCompactEmptyState}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: Z_CANVAS.ITEM_NORMAL,
                  pointerEvents: 'none',
                }}
              >
                {isCompactEmptyState ? (
                  'Drag & drop components'
                ) : (
                  <>
                    Drag and drop components
                    <br />
                    into the container
                  </>
                )}
              </s.EmptyStateText>
            )}
          </s.DropZone>
        </s.ContainerWrapper>
      </div>
    );
  },
  containerMemoComparison,
);

export default LayoutContainer;
