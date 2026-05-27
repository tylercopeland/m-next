import { Layout, Layouts } from 'react-grid-layout';
import { WIDGETS } from '@m-next/runtime-interface';
import { UnifiedControlRegistryType } from '@m-next/runtime-interface';
import React from 'react';
import { LayoutCanvas } from '../../utils/structureConverters';
import type { ActionHandler } from '../../actions/types';
import type { CurrentStateValue } from '@m-next/types';

/**
 * Widget types from @m-next/runtime-interface
 */
export type WidgetType = (typeof WIDGETS)[keyof typeof WIDGETS];

/**
 * Base grid component interface
 */
export interface GridComponent {
  /** Unique identifier for the component */
  id: string;
  /** Type of widget/component from the runtime interface */
  type: WidgetType;
  /** X position in grid units (0-based, left to right) */
  x: number;
  /** Y position in grid units (0-based, top to bottom) */
  y: number;
  /** Width in grid units */
  width: number;
  /** Height in grid units */
  height: number;
  /** Display content/text for the component */
  content: string;
  /** ID of parent container if this component is nested, null if top-level */
  // visible: boolean;
  currentState: CurrentStateValue;
  containerId: string | null;
  /** Whether the component is static (non-draggable) */
  static: boolean;
}

/**
 * Flow behavior type for responsive components
 */
export type FlowBehavior = 'wrap' | 'compress' | 'fixed';

export type ResponsiveDisplayData = {
  /** Desktop layout configuration (required/default) */
  desktop: GridComponent;
  /** Tablet override configuration (optional) */
  tabletOverride?: GridComponent;
  /** Mobile override configuration (optional) */
  mobileOverride?: GridComponent;
};
/**
 * RGL Integration Types for Responsive Layout Canvas
 */

/**
 * Display restrictions for component resizing
 */
export interface ComponentDisplayRestrictions {
  minWidth?: number; // Min columns (1-12)
  maxWidth?: number; // Max columns (1-12)
  minHeight?: number; // Min rows (minimum 2)
  maxHeight?: number; // Max rows (undefined = no limit)
}

/**
 * Responsive component extending GridComponent with breakpoint overrides
 */
export interface ResponsiveComponent extends GridComponent {
  /** Responsive overrides for different breakpoints */
  responsive?: ResponsiveDisplayData;
  /** Container configuration if this is a container component */
  container?: ContainerConfig;
  /** How the component behaves during responsive layout changes */
  flowBehavior?: 'wrap' | 'compress' | 'fixed';
  /** Relative position within parent container (for nested components) */
  relativePosition?: { x: number; y: number };
  /** Unique name identifier for the component */
  name?: string;
  /** Caption text for the component (alternative to content) */
  caption?: string;
  /** Whether the component is bound to data */
  isBound?: boolean;
  /** Value of the component */
  value?: string | null | undefined;
  /** Display restrictions for resizing this component */
  displayRestrictions?: ComponentDisplayRestrictions;
  /** Validation error message if validation fails */
  validationError?: string | null;
  /** Validation rules for the component */
  validationRules?: Array<{ rule: number; value: unknown; canDelete: boolean }>;
  /** For containers: whether a visible border is shown (affects padding) */
  showBorder?: boolean;
}

/**
 * Container configuration for directional layout containers
 */
export interface ContainerConfig {
  /** Layout direction within the container */
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Child component IDs within this container */
  children: string[];
  /** Whether container children wrap when space is limited */
  wrap?: boolean;
  /** Gap between child components in grid units */
  gap?: number;
  /** Alignment of children within container */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Justification of children within container */
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  /** Maximum number of children allowed in this container */
  maxChildren?: number;
}

/**
 * Breakpoint configuration for responsive behavior
 */
export interface BreakpointConfig {
  /** Mobile breakpoint in pixels */
  mobile: number;
  /** Tablet breakpoint in pixels */
  tablet: number;
  /** Desktop breakpoint in pixels */
  desktop: number;
  /** Index signature for RGL compatibility */
  [key: string]: number;
}

/**
 * RGL Layout item that maps to our ResponsiveComponent
 */
export interface RGLLayoutItem extends Layout {
  /** Component type for rendering */
  componentType: WidgetType;
  /** Component content/label */
  content: string;
  /** Container ID if nested */
  containerId: string | null;
  /** Container config if this is a container */
  container?: ContainerConfig;
}

/**
 * RGL Layouts object containing layouts for each breakpoint
 */
export interface RGLResponsiveLayouts extends Layouts {
  mobile: RGLLayoutItem[];
  tablet: RGLLayoutItem[];
  desktop: RGLLayoutItem[];
}

/**
 * State adapter interface for converting between our format and RGL format
 */
export interface RGLStateAdapter {
  breakpoints: BreakpointConfig;
  /** Convert ResponsiveComponent to RGL layout item */
  componentToLayoutItem: (component: ResponsiveComponent) => RGLLayoutItem;
  /** Convert RGL layout item to ResponsiveComponent */
  layoutItemToComponent: (item: RGLLayoutItem) => ResponsiveComponent;
  /** Convert component array to RGL layouts */
  componentsToLayouts: (components: ResponsiveComponent[], currentBreakpoint: string) => RGLResponsiveLayouts;
  /** Convert RGL layouts to component array */
  layoutsToComponents: (layouts: RGLResponsiveLayouts, currentBreakpoint: string) => ResponsiveComponent[];
}

export interface ResponsiveData {
  x: number;
  y: number;
  width: number;
  height: number;
  currentState: CurrentStateValue;
}

/**
 * LayoutCanvas structure from V4 Layout API
 */
/**
 * ResponsiveLayoutItem from V4 Layout API - CORRECTED to match actual API response
 */
export interface ResponsiveLayoutItem {
  id: string; // API uses lowercase 'id'
  containerId: string | null; // API uses camelCase
  desktop: ResponsiveData;
  tabletOverride?: ResponsiveData;
  mobileOverride?: ResponsiveData;
  content: ResponsiveLayoutItem[]; // API uses lowercase 'content'
}

/**
 * Props for ReactGridLayoutWrapper
 */
export interface LayoutCanvasWrapperProps {
  /** Components to render */
  components: ResponsiveComponent[];
  /** Canvas width in pixels */
  width: number;
  /** Number of grid columns */
  cols: number;
  /** Row height in pixels */
  rowHeight: number;
  /** Control registry for rendering components */
  controlRegistry: UnifiedControlRegistryType;
  /** Whether drag is enabled */
  isDraggable?: boolean;
  /** Whether resize is enabled */
  isResizable?: boolean;
  /** Callback when layout changes */
  onLayoutChange?: (layout: RGLLayoutItem[]) => void;
  /** Callback when components change */
  onComponentsChange?: (components: ResponsiveComponent[]) => void;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Custom drag handle selector */
  dragHandleSelector?: string;
  /** ID of the currently selected component */
  selectedComponentId?: string;
  /** Callback when a component is clicked */
  onComponentClick?: (componentId: string) => void;
  /** Whether the canvas itself is selected */
  isCanvasSelected?: boolean;
  /** Optional field list for name conflict checking */
  fieldList?: Array<{ name: string }> | null;
  /** Callback when layout changes in V4 nested format */
  onLayoutV4Change?: (layout: LayoutCanvas) => void;
  /** Current active breakpoint */
  resolution: 'desktop' | 'tablet' | 'mobile'; // TODO: use Resolution type
  /** Runtime action handler used when canvas renders in runtime mode */
  runtimeActionHandler?: ActionHandler | null;
  /** Runtime screen identifier for action execution */
  runtimeScreenId?: string | null;
  /** Runtime active record identifier for action execution */
  runtimeRecordId?: string | null;
  /** Runtime screen state passed through to action handler */
  runtimeScreenState?: Record<string, unknown> | null;
  /** Mode: designer (editable) or runtime (read-only) */
  mode?: 'designer' | 'runtime';
  /** Runtime control value update callback (MethodUI integration) */
  runtimeUpdateControlValue?: ((componentId: string, value: unknown) => void) | null;
  /** Runtime control property update callback (MethodUI integration) - for properties like hasFocus */
  runtimeUpdateControlProperty?: ((componentId: string, property: string, value: unknown) => void) | null;
  /** Runtime analytics tracking callback (MethodUI integration) */
  runtimeProcessAnalytics?: ((eventName: string, attributes: Record<string, any>) => void) | null;
  /** Runtime stock screen flag (determines if custom or stock screen for analytics) */
  isStockScreen?: boolean | null;
  showHiddenComponents?: boolean;
  /** Compaction type: 'vertical' (default), 'horizontal', or null to disable compaction */
  compactType?: 'vertical' | 'horizontal' | null;
  /** Name of the control set as the default focus target */
  defaultFocusControlName?: string | null;
}

/**
 * Props for WidthProviderEnhanced
 */
export interface WidthProviderEnhancedProps {
  /** Child component to provide width to */
  children: React.ReactNode;
  /** Fixed canvas width (overrides auto-detection) */
  fixedWidth?: number;
  /** Whether to measure width on mount */
  measureBeforeChildren?: boolean;
}

/**
 * Collision detection result
 */
export interface CollisionResult {
  /** Whether collision occurred */
  hasCollision: boolean;
  /** Components that are colliding */
  collidingComponents: ResponsiveComponent[];
  /** Suggested positions to resolve collision */
  suggestedPositions?: Array<{ id: string; x: number; y: number }>;
}

/**
 * Push engine calculation result
 */
export interface PushCalculationResult {
  /** Components that need to be moved */
  componentsToMove: Array<{
    component: ResponsiveComponent;
    newX: number;
    newY: number;
    pushDirection: 'up' | 'down' | 'left' | 'right';
  }>;
  /** Whether push operation is possible */
  isPossible: boolean;
  /** Reason if push is not possible */
  reason?: string;
}

/**
 * Reflow calculation result
 */
export interface ReflowResult {
  /** Components with their new positions after reflow */
  newComponents: ResponsiveComponent[];
  /** Animation sequence for smooth transitions */
  animationSequence: Array<{
    componentId: string;
    delay: number;
    duration: number;
    fromPosition: { x: number; y: number };
    toPosition: { x: number; y: number };
  }>;
}

/**
 * Visual feedback state for drag operations
 */
export interface DragFeedbackState {
  /** Whether feedback is active */
  isActive: boolean;
  /** Preview position during drag */
  previewPosition?: { x: number; y: number; width: number; height: number };
  /** Components that will be pushed */
  pushPreviews: Array<{
    componentId: string;
    fromPosition: { x: number; y: number };
    toPosition: { x: number; y: number };
    pushDirection: 'up' | 'down' | 'left' | 'right';
  }>;
  /** Snap guide lines */
  snapGuides: Array<{
    type: 'vertical' | 'horizontal';
    position: number;
    length: number;
  }>;
  /** Collision warnings */
  collisionWarnings: Array<{
    componentId: string;
    severity: 'warning' | 'error';
    message: string;
  }>;
}

/**
 * Animation state for components
 */
export interface ComponentAnimationState {
  /** Component ID */
  componentId: string;
  /** Animation type */
  animationType: 'move' | 'push' | 'reflow' | 'compress' | 'wrap';
  /** Animation duration in ms */
  duration: number;
  /** Animation delay in ms */
  delay: number;
  /** Starting position */
  fromPosition: { x: number; y: number };
  /** Ending position */
  toPosition: { x: number; y: number };
  /** Animation easing function */
  easing: string;
}
