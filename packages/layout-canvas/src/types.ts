import React from 'react';
import { ResponsiveComponent } from './rgl-integration/types';

/**
 * Props for ComponentSelector component
 */
export interface ComponentSelectorProps {
  /** The grid component data */
  component: ResponsiveComponent;
  /** The child component to wrap */
  children: React.ReactNode;
  /** Base ID for generating consistent test IDs (defaults to component.id) */
  id?: string;
  /** Whether the component is selected (shows blue border and resize handles) */
  isSelected?: boolean;
  /** Whether the component is in alert state (shows red border when selected) */
  isAlert?: boolean;
  /** Whether the component is hidden (shows dashed grey border) */
  isHidden?: boolean;
  /** Component name shown in handle label */
  name?: string;
  /** Whether to show target icon indicating this component is a focus target */
  focusTarget?: boolean;
  /** ARIA label for the component selector container */
  ariaLabel?: string;
  /** ARIA description for the component selector */
  ariaDescription?: string;
  /** Callback when component drag starts */
  onDragStart?: (component: ResponsiveComponent) => void;
  /** Callback when component is being dragged */
  onDrag?: (component: ResponsiveComponent, event: MouseEvent | TouchEvent) => void;
  /** Callback when component drag ends */
  onDragEnd?: (component: ResponsiveComponent) => void;
  /** Whether drag is enabled for this component */
  isDraggable?: boolean;
  /** Callback when component resize starts */
  onResizeStart?: (component: ResponsiveComponent, handle: 'n' | 's' | 'e' | 'w') => void;
  /** Whether resize is enabled for this component */
  isResizable?: boolean;
  /** Which resize handles to show (default: ['n', 's', 'e', 'w']) */
  resizeHandles?: Array<'n' | 's' | 'e' | 'w'>;
}
