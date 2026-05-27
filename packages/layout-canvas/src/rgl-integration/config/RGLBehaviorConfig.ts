import { Layout } from 'react-grid-layout';
import { ResponsiveComponent } from '../types';

/**
 * Strategy for controlling layout compaction behavior.
 * All methods are optional — omit ones you don't need.
 */
export interface CompactionStrategy {
  /** Return a custom compact type per component (e.g. force vertical for some). */
  getCompactTypeForComponent?: (component: ResponsiveComponent) => 'vertical' | 'horizontal' | null;

  /** Post-process the layout after RGL's internal compaction. */
  postCompact?: (layout: Layout[], components: ResponsiveComponent[]) => Layout[];

  /** Return true to skip compaction entirely for this layout change. */
  shouldSkipCompaction?: (oldLayout: Layout[], newLayout: Layout[]) => boolean;
}

/**
 * Strategy for constraining drag behavior.
 * All methods are optional — omit ones you don't need.
 */
export interface DragConstraints {
  /** Return false to prevent a component from being dropped at this position. */
  isPositionAllowed?: (component: ResponsiveComponent, position: { x: number; y: number }) => boolean;

  /** Snap a dragged component to the nearest valid position. */
  snapToPosition?: (component: ResponsiveComponent, position: { x: number; y: number }) => { x: number; y: number };

  /** Return bounding box limits for a component's drag area. */
  getDragBounds?: (
    component: ResponsiveComponent,
    containerBounds: DOMRect,
  ) => { minX: number; maxX: number; minY: number; maxY: number };

  /** Restrict drag axis ('x' = horizontal only, 'y' = vertical only, 'both' = free, 'none' = locked). */
  getDragAxis?: (component: ResponsiveComponent) => 'x' | 'y' | 'both' | 'none';
}

/**
 * Strategy for controlling resize behavior.
 * All methods are optional — omit ones you don't need.
 */
export interface ResizeBehavior {
  /** Return min/max size constraints for a component during resize. */
  getResizeConstraints?: (
    component: ResponsiveComponent,
    currentLayout: Layout[],
  ) => { minW?: number; maxW?: number; minH?: number; maxH?: number };

  /** Maintain proportional sizing during resize (e.g. lock aspect ratio). */
  getProportionalResize?: (
    component: ResponsiveComponent,
    oldSize: { w: number; h: number },
    newSize: { w: number; h: number },
  ) => { w: number; h: number };

  /** Return size/position updates for other components that should resize in tandem. */
  getLinkedResizeUpdates?: (
    component: ResponsiveComponent,
    newSize: { w: number; h: number },
    allComponents: ResponsiveComponent[],
  ) => Map<string, { w?: number; h?: number; x?: number; y?: number }>;

  /** Return which resize handles to show for a specific component. */
  getResizeHandles?: (component: ResponsiveComponent) => string[];
}

/**
 * Base RGL props that are passed directly to <ReactGridLayout>.
 */
export interface RGLBaseConfig {
  compactType: 'vertical' | 'horizontal' | null;
  preventCollision: boolean;
  isDraggable: boolean;
  isResizable: boolean;
  isDroppable: boolean;
  draggableHandle: string;
  resizeHandles: string[];
  margin: [number, number];
  containerPadding: [number, number];
  useCSSTransforms: boolean;
}

/**
 * Full RGL behavior configuration combining base props with strategy interfaces.
 *
 * Design: Strategy interfaces use optional methods (ISP). A consumer implementing
 * custom compaction is not forced to also define drag or resize strategies.
 * The useRGLBehavior hook checks for each method before calling it,
 * falling back to default RGL behavior when absent.
 */
export interface RGLBehaviorConfig {
  base: RGLBaseConfig;
  compaction: CompactionStrategy;
  drag: DragConstraints;
  resize: ResizeBehavior;
  middleware?: {
    beforeLayoutChange?: (layout: Layout[]) => Layout[];
    afterLayoutChange?: (layout: Layout[]) => void;
    beforeDragStart?: (...args: unknown[]) => void;
    afterDragStop?: (...args: unknown[]) => void;
    beforeResizeStart?: (...args: unknown[]) => void;
    afterResizeStop?: (...args: unknown[]) => void;
  };
}

/**
 * Creates the default designer canvas config (main canvas - static layout).
 */
export function createDesignerCanvasConfig(overrides: Partial<RGLBaseConfig> = {}): RGLBehaviorConfig {
  return {
    base: {
      compactType: null,
      preventCollision: true,
      isDraggable: true,
      isResizable: true,
      isDroppable: true,
      draggableHandle: '.drag-handle',
      resizeHandles: ['s', 'e', 'w'],
      margin: [0, 0],
      containerPadding: [8, 8],
      useCSSTransforms: false,
      ...overrides,
    },
    compaction: {},
    drag: {},
    resize: {},
  };
}

/**
 * Creates the runtime canvas config (nothing draggable/resizable).
 */
export function createRuntimeCanvasConfig(overrides: Partial<RGLBaseConfig> = {}): RGLBehaviorConfig {
  return {
    base: {
      compactType: null,
      preventCollision: true,
      isDraggable: false,
      isResizable: false,
      isDroppable: false,
      draggableHandle: '.drag-handle',
      resizeHandles: [],
      margin: [0, 0],
      containerPadding: [8, 8],
      useCSSTransforms: false,
      ...overrides,
    },
    compaction: {},
    drag: {},
    resize: {},
  };
}

/**
 * Creates a container config with its specific settings.
 */
export function createContainerConfig(
  container: ResponsiveComponent,
  isDraggable: boolean,
  overrides: Partial<RGLBaseConfig> = {},
): RGLBehaviorConfig {
  return {
    base: {
      compactType: null,
      preventCollision: true,
      isDraggable,
      isResizable: isDraggable,
      isDroppable: false,
      draggableHandle: '.nested-drag-handle,.nested-component-drag-area',
      resizeHandles: isDraggable ? ['s', 'e', 'w'] : [],
      margin: [0, 0],
      containerPadding: container.showBorder ? [8, 8] : [0, 0],
      useCSSTransforms: false,
      ...overrides,
    },
    compaction: {},
    drag: {},
    resize: {},
  };
}
