import * as React from "react";
import { useSelector } from 'react-redux';
import { WIDGETS } from '@m-next/runtime-interface';
import { LayoutContainer } from '@m-next/layout-canvas/src/containers/LayoutContainer';
import type { ResponsiveComponent } from '@m-next/layout-canvas/src/rgl-integration/types';
import { mapWidgetToControlType, getWrapperComponent } from '../unified-control-registry/index';
import { selectControls, selectShowHiddenComponents } from '../../../common/services/screenLayoutSlice';

// Import the types from our types file
import type { RootState } from '../../../types/screenLayoutTypes';

interface LayoutContainerWrapperProps {
  id: string;
  onControlClick?: (controlId: string) => void;
  isSelected?: boolean;
  containerConfig?: unknown;
  childComponents?: unknown[];
  isEmpty?: boolean;
  onChildClick?: (childId: string) => void;
  selectedChildId?: string | null;
  // Blue canvas functionality props
  dragOverCanvas?: string | null;
  onNestedDrop?: (e: React.DragEvent, targetContainerId: string) => void;
  onNestedDragOver?: (e: React.DragEvent, canvasId: string) => void;
  onNestedDragLeave?: (e: React.DragEvent) => void;
  onComponentDragStart?: (e: React.DragEvent, componentId: string, parentId: string) => void;
  ResponsiveGridLayout?: React.ComponentType<unknown>;
  // Layout props to match main canvas
  rowHeight?: number;
  colWidth?: number;
  containerWidth?: number;
  // Component position save handler
  onNestedComponentsChange?: (updatedComponents: ResponsiveComponent[]) => void;
  // Control registry for display restrictions
  controlRegistry?: Record<string, unknown>;
  // Responsive behavior props
  resolution?: 'desktop' | 'tablet' | 'mobile';
  mode?: 'designer' | 'runtime';
}

/**
 * LayoutContainerWrapper
 * Optimized wrapper that ALWAYS uses the LayoutContainer component from the layout-canvas package.
 * Maps App Builder props to the component interface with proper memoization to prevent re-renders.
 */
const LayoutContainerWrapper = React.memo<LayoutContainerWrapperProps>(({
  id,
  onControlClick,
  containerConfig,
  childComponents = [],
  onChildClick,
  selectedChildId,
  dragOverCanvas,
  onNestedDrop,
  onNestedDragOver,
  onNestedDragLeave,
  rowHeight = 16,
  onNestedComponentsChange,
  controlRegistry,
  resolution = 'desktop',
  mode = 'designer'
}) => {
  // Get the control data from Redux store
  const control = useSelector((state) => selectControls(state as RootState)?.[id]);
  // 🔧 FIX: Get showHiddenComponents from Redux state
  const showHiddenComponents = useSelector(selectShowHiddenComponents);

  // 🔧 PERFORMANCE FIX: Memoize containerData to prevent recreation on every render
  const containerData = React.useMemo(() => ({
    id,
    type: control?.type || WIDGETS.LAYOUT_CONTAINER,
    x: 0,
    y: 0,
    width: control?.width || 8,
    height: 12,
    content: control?.caption || control?.content || `Container ${id}`,
    static: false,
    containerId: undefined,
    container: containerConfig || {},
  }), [id, control?.type, control?.caption, control?.content, containerConfig, control?.width]);

  // 🔧 PERFORMANCE FIX: Memoize callback handlers to prevent recreation
  const handleContainerClick = React.useCallback(() => {
    onControlClick?.(id);
  }, [onControlClick, id]);

  const handleChildClick = React.useCallback((childId: string) => {
    onChildClick?.(childId);
  }, [onChildClick]);

  // 🔧 PERFORMANCE FIX: Memoize renderChildComponent function to prevent re-renders
  const renderChildComponent = React.useCallback((component: ResponsiveComponent) => {
    // Use unified control registry for consistent styling
    const controlType = mapWidgetToControlType(String(component.type));

    if (controlType) {
      try {
        const WrapperComponent = getWrapperComponent(controlType);
        return React.createElement(WrapperComponent, {
          key: String(component.id),
          id: String(component.id),
          // The click handler is needed for selection to work inside containers
          onControlClick: onChildClick
        });
      } catch {
        console.warn('⚠️ Failed to render component via registry');
        // Fall through to fallback rendering
      }
    }

    // Enhanced fallback rendering with better styling for unmapped types
    return React.createElement('div', {
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
        pointerEvents: 'none' // Prevent click interference with drag
      }
    }, component.content || component.type || component.id);
  }, [onChildClick]);

  // 🔧 PERFORMANCE FIX: Memoize default handler functions
  const defaultDropHandler = React.useCallback(() => {}, []);
  const defaultDragOverHandler = React.useCallback(() => {}, []);
  const defaultDragLeaveHandler = React.useCallback(() => {}, []);

  // ALWAYS use the LayoutContainer component from the package - NO fallback logic
  return (
    <LayoutContainer
      container={containerData as unknown as ResponsiveComponent}
      childComponents={childComponents as ResponsiveComponent[]}
      selectedComponentId={selectedChildId || undefined}
      onContainerClick={handleContainerClick}
      onChildClick={handleChildClick}
      rowHeight={rowHeight}
      renderChildComponent={renderChildComponent}
      dragOverCanvas={dragOverCanvas || null}
      onNestedDrop={onNestedDrop || defaultDropHandler}
      onNestedDragOver={onNestedDragOver || defaultDragOverHandler}
      onNestedDragLeave={onNestedDragLeave || defaultDragLeaveHandler}
      onNestedComponentsChange={onNestedComponentsChange}
      controlRegistry={controlRegistry}
      resolution={resolution}
      mode={mode}
      showHiddenComponents={showHiddenComponents}
    />
  );
}, (prevProps, nextProps) => {
  // 🔧 PERFORMANCE FIX: Custom comparison to prevent unnecessary re-renders
  // Only re-render if props that actually affect the component have changed

  // Core identity and state
  if (prevProps.id !== nextProps.id) return false;
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.selectedChildId !== nextProps.selectedChildId) return false;

  // Container configuration
  if (JSON.stringify(prevProps.containerConfig) !== JSON.stringify(nextProps.containerConfig)) return false;
  if (JSON.stringify(prevProps.childComponents) !== JSON.stringify(nextProps.childComponents)) return false;
  if (prevProps.isEmpty !== nextProps.isEmpty) return false;

  // Layout props
  if (prevProps.rowHeight !== nextProps.rowHeight) return false;
  if (prevProps.colWidth !== nextProps.colWidth) return false;
  if (prevProps.containerWidth !== nextProps.containerWidth) return false;

  // Blue canvas state
  if (prevProps.dragOverCanvas !== nextProps.dragOverCanvas) return false;

  // Responsive behavior props
  if (prevProps.resolution !== nextProps.resolution) return false;
  if (prevProps.mode !== nextProps.mode) return false;

  // Callbacks are stable (useCallback), so don't compare them unless they're undefined/null
  // This prevents re-renders when parent components update but pass the same callbacks

  return true; // Props are the same, skip re-render
});

// Set display name for debugging
LayoutContainerWrapper.displayName = 'LayoutContainerWrapper';

export default LayoutContainerWrapper;
