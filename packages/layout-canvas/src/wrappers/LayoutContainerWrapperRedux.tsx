import * as React from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import { WIDGETS } from '@m-next/runtime-interface';
import { LayoutContainer } from '@m-next/layout-canvas/src/containers/LayoutContainer';
import type { ResponsiveComponent } from '@m-next/layout-canvas/src/rgl-integration/types';
import type { DragPreview } from '@m-next/layout-canvas/src/hooks/useCanvasDragState';
import { getDisabledState } from '../utils/currentStateHelper';

// Define local types to avoid circular dependency
interface ControlData {
  type?: string;
  caption?: string;
  content?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

// RootState interface removed - we now use unknown type and defensive casting in useSelector

interface LayoutContainerWrapperProps {
  id: string;
  control?: ControlData; // Allow control to be passed directly (for runtime mode)
  container?: ResponsiveComponent; // The container component itself
  mode?: 'designer' | 'runtime';
  resolution: 'desktop' | 'tablet' | 'mobile';
  showHiddenComponents: boolean;
  onControlClick?: (controlId: string) => void;
  isSelected?: boolean;
  containerConfig?: unknown;
  childComponents?: unknown[];
  isEmpty?: boolean;
  onChildClick?: (childId: string) => void;
  selectedComponentId?: string | null;
  // Blue canvas functionality props
  dragOverCanvas?: string | null;
  onNestedDrop?: (
    e: React.DragEvent,
    targetContainerId: string,
    position?: { x: number; y: number; w: number; h: number },
  ) => void;
  onNestedDragOver?: (e: React.DragEvent, canvasId: string) => void;
  onNestedDragLeave?: (e: React.DragEvent) => void;
  onNestedDragComplete?: () => void;
  onComponentDragStart?: (e: React.DragEvent, componentId: string, parentId: string) => void;
  ResponsiveGridLayout?: React.ComponentType<unknown>;
  // Layout props to match main canvas
  rowHeight?: number;
  colWidth?: number;
  containerWidth?: number;
  isDraggable?: boolean; // Control drag/drop functionality
  isResizable?: boolean; // Control resize functionality
  // Component position save handler
  onNestedComponentsChange?: (updatedComponents: ResponsiveComponent[]) => void;
  // Control registry for display restrictions
  controlRegistry?: Record<string, unknown>;
  // 🔧 FIX: Render function for child components (passed from parent LayoutCanvas)
  renderChildComponent?: (component: ResponsiveComponent) => React.ReactElement;
  // 🔧 FIX: Indicates an existing component is being dragged over this container
  isDraggedOver?: boolean;
  dragPreview?: DragPreview;
  onDragPreviewChange?: React.Dispatch<React.SetStateAction<DragPreview>>;
  onDragPreviewClear?: () => void;
}

/**
 * LayoutContainerWrapper
 * Optimized wrapper that ALWAYS uses the LayoutContainer component from the layout-canvas package.
 * Maps App Builder props to the component interface with proper memoization to prevent re-renders.
 */
const LayoutContainerWrapper = React.memo<LayoutContainerWrapperProps>(
  ({
    id,
    control: controlProp,
    container: _containerProp, // Unused but kept for interface compatibility
    resolution,
    mode = 'runtime',
    showHiddenComponents,
    onControlClick,
    containerConfig,
    childComponents = [],
    onChildClick,
    selectedComponentId,
    dragOverCanvas,
    onNestedDrop,
    onNestedDragOver,
    onNestedDragLeave,
    onNestedDragComplete,
    rowHeight = 16,
    isDraggable = true,
    isResizable = true,
    onNestedComponentsChange,
    controlRegistry,
    renderChildComponent: renderChildComponentProp,
    isDraggedOver = false,
    dragPreview,
    onDragPreviewChange,
    onDragPreviewClear,
  }) => {
    // 🔧 FIX: Disable dragging and resizing in runtime mode
    const effectiveIsDraggable = mode === 'runtime' ? false : isDraggable;
    const effectiveIsResizable = mode === 'runtime' ? false : isResizable;
    // Check if Redux context exists - MUST be called before useSelector
    const reduxContext = React.useContext(ReactReduxContext);

    // Always fetch from Redux in designer mode to get full control properties
    // Only call useSelector if Redux context exists (to avoid "Provider not found" error)
    let controlFromRedux: unknown = null;

    if (reduxContext) {
      // Redux context is available - safe to use useSelector
      // Note: Conditional hook call is normally not allowed, but here it's safe because:
      // 1. reduxContext existence is stable per component mount (doesn't change mid-render)
      // 2. This prevents runtime crash when Redux Provider doesn't exist
      // eslint-disable-next-line react-hooks/rules-of-hooks
      controlFromRedux = useSelector((state: unknown) => {
        // Safely access Redux state - return null if structure doesn't match
        try {
          // Cast to any to bypass TypeScript checks for different Redux structures
          const stateObj = state as Record<string, unknown>;
          const screenLayout = stateObj?.screenLayout as Record<string, unknown> | undefined;
          const controls = screenLayout?.controls as Record<string, unknown> | undefined;

          if (!controls || typeof controls !== 'object') {
            return null;
          }
          return controls[id] || null;
        } catch {
          return null;
        }
      });
    }

    // Merge controlProp (layout info from canvas) with controlFromRedux (full control properties)
    // In designer mode: use Redux control properties, override with any layout props from controlProp
    // In runtime mode: use controlProp if provided, otherwise fallback to Redux
    const control = (controlFromRedux ? { ...controlFromRedux, ...controlProp } : controlProp) as ControlData | null;

    // 🔧 PERFORMANCE FIX: Memoize containerData to prevent recreation on every render
    const containerData = React.useMemo(() => {
      // Use caption only if it's been customized (not the default "Container")
      // Otherwise fall back to the unique control name (e.g., "Layout_Container_2")
      const displayCaption =
        control?.caption && control.caption !== 'Container' ? control.caption : control?.name || 'Container';

      return {
        id,
        type: control?.type || WIDGETS.LAYOUT_CONTAINER,
        x: 0,
        y: 0,
        width: Number(control?.width) || 8, // Ensure numeric value
        height: Number(control?.height) || 12, // Ensure numeric value
        content: displayCaption || control?.content || `Container ${id}`,
        isHidden: false,
        isDisabled: getDisabledState(control as ControlData, _containerProp?.responsive, resolution, mode),
        static: false,
        containerId: undefined,
        container: containerConfig || {},
        // Pass through container-specific properties
        hideCaption: control?.hideCaption ?? false,
        caption: displayCaption,
        showIcon: control?.showIcon ?? false,
        icon: control?.icon || null,
        showBorder: control?.showBorder ?? false,
        showShadow: control?.showShadow ?? false,
      };
    }, [
      id,
      control?.type,
      control?.caption,
      control?.name,
      control?.content,
      containerConfig,
      control?.width,
      control?.height,
      control?.hideCaption,
      control?.showIcon,
      control?.icon,
      control?.showBorder,
      control?.showShadow,
      control?.disabled,
      _containerProp?.responsive,
      resolution,
      mode,
    ]);

    // 🔧 PERFORMANCE FIX: Memoize callback handlers to prevent recreation
    const handleContainerClick = React.useCallback(() => {
      onControlClick?.(id);
    }, [onControlClick, id]);

    const handleChildClick = React.useCallback(
      (childId: string) => {
        onChildClick?.(childId);
      },
      [onChildClick],
    );

    // 🔧 FIX: Use parent's renderChildComponent if provided, otherwise fallback to simple div rendering
    const renderChildComponent = React.useCallback(
      (component: ResponsiveComponent) => {
        // If parent provided a render function, use it (enables proper component rendering)
        if (renderChildComponentProp) {
          return renderChildComponentProp(component);
        }

        // Fallback rendering to avoid circular dependency with unified control registry
        return React.createElement(
          'div',
          {
            key: String(component.id),
            style: {
              padding: '8px 12px',
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: '12px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none', // Prevent click interference with drag
            },
          },
          component.content || component.type || String(component.id),
        );
      },
      [renderChildComponentProp],
    ); // Depend on the prop so it updates when parent changes

    // 🔧 PERFORMANCE FIX: Memoize default handler functions
    const defaultDropHandler = React.useCallback(() => {}, []);
    const defaultDragOverHandler = React.useCallback(() => {}, []);
    const defaultDragLeaveHandler = React.useCallback(() => {}, []);
    return (
      <LayoutContainer
        container={containerData as unknown as ResponsiveComponent}
        childComponents={childComponents as ResponsiveComponent[]}
        selectedComponentId={selectedComponentId || undefined}
        onContainerClick={handleContainerClick}
        onChildClick={handleChildClick}
        rowHeight={rowHeight}
        isDraggable={effectiveIsDraggable}
        isResizable={effectiveIsResizable}
        renderChildComponent={renderChildComponent}
        dragOverCanvas={dragOverCanvas || null}
        onNestedDrop={onNestedDrop || defaultDropHandler}
        onNestedDragOver={onNestedDragOver || defaultDragOverHandler}
        onNestedDragLeave={onNestedDragLeave || defaultDragLeaveHandler}
        onNestedDragComplete={onNestedDragComplete}
        onNestedComponentsChange={onNestedComponentsChange}
        controlRegistry={controlRegistry}
        resolution={resolution}
        mode={mode}
        showHiddenComponents={showHiddenComponents}
        isDraggedOver={isDraggedOver}
        dragPreview={dragPreview}
        onDragPreviewChange={onDragPreviewChange}
        onDragPreviewClear={onDragPreviewClear}
      />
    );
  },
  (prevProps, nextProps) => {
    // 🔧 PERFORMANCE FIX: Custom comparison to prevent unnecessary re-renders
    // Only re-render if props that actually affect the component have changed

    // Core identity and state
    if (prevProps.id !== nextProps.id) return false;
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.selectedComponentId !== nextProps.selectedComponentId) return false;

    // Container configuration
    if (JSON.stringify(prevProps.containerConfig) !== JSON.stringify(nextProps.containerConfig)) return false;
    if (JSON.stringify(prevProps.childComponents) !== JSON.stringify(nextProps.childComponents)) return false;
    if (prevProps.isEmpty !== nextProps.isEmpty) return false;

    // Control properties - check if any container-specific props changed
    if (JSON.stringify(prevProps.control) !== JSON.stringify(nextProps.control)) return false;

    // Layout props
    if (prevProps.rowHeight !== nextProps.rowHeight) return false;
    if (prevProps.colWidth !== nextProps.colWidth) return false;
    if (prevProps.containerWidth !== nextProps.containerWidth) return false;

    // Blue canvas state
    if (prevProps.dragOverCanvas !== nextProps.dragOverCanvas) return false;
    if (prevProps.onNestedDragComplete !== nextProps.onNestedDragComplete) return false;

    if (prevProps.showHiddenComponents !== nextProps.showHiddenComponents) return false;

    // 🔧 FIX: Re-render when existing component drag hover state changes
    if (prevProps.isDraggedOver !== nextProps.isDraggedOver) return false;

    const isPreviewRelevantToContainer = (preview: DragPreview | undefined, containerId: string) => {
      if (!preview?.visible) return false;
      if (preview.targetType === 'container') {
        return preview.containerId === containerId || preview.sourceContainerId === containerId;
      }
      if (preview.targetType === 'canvas') {
        return preview.sourceContainerId === containerId;
      }
      return false;
    };

    const prevPreviewRelevant = isPreviewRelevantToContainer(prevProps.dragPreview, prevProps.id);
    const nextPreviewRelevant = isPreviewRelevantToContainer(nextProps.dragPreview, nextProps.id);

    if (prevPreviewRelevant !== nextPreviewRelevant) return false;

    if (prevPreviewRelevant && nextPreviewRelevant) {
      const prevPreview = prevProps.dragPreview;
      const nextPreview = nextProps.dragPreview;

      if (prevPreview?.targetType !== nextPreview?.targetType) return false;
      if (prevPreview?.containerId !== nextPreview?.containerId) return false;
      if (prevPreview?.sourceContainerId !== nextPreview?.sourceContainerId) return false;

      const prevPosition = prevPreview?.position;
      const nextPosition = nextPreview?.position;
      if (!!prevPosition !== !!nextPosition) return false;

      if (
        prevPosition &&
        nextPosition &&
        (prevPosition.x !== nextPosition.x ||
          prevPosition.y !== nextPosition.y ||
          prevPosition.w !== nextPosition.w ||
          prevPosition.h !== nextPosition.h)
      ) {
        return false;
      }
    }

    // renderChildComponent is recreated when components array updates in LayoutCanvas (e.g., after action updates visible)
    // Without this check, LayoutContainerWrapperRedux uses stale renderChildComponent with old component values
    if (prevProps.renderChildComponent !== nextProps.renderChildComponent) return false;

    // 🔧 FIX: Include onNestedComponentsChange to ensure we use the latest callback
    // This is critical for static mode ejection to work correctly
    if (prevProps.onNestedComponentsChange !== nextProps.onNestedComponentsChange) return false;

    return true; // Props are the same, skip re-render
  },
);

// Set display name for debugging
LayoutContainerWrapper.displayName = 'LayoutContainerWrapper';

export default LayoutContainerWrapper;
