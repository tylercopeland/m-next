import { ResponsiveComponent } from '../rgl-integration/types';

/**
 * Container-specific styling options
 */
export type ContainerStyle = 'default' | 'card' | 'panel' | 'group' | 'minimal';

/**
 * Container visual state
 */
export interface ContainerVisualState {
  isHovered: boolean;
  isSelected: boolean;
  isCollapsed: boolean;
  isDragOver: boolean;
  isEmpty: boolean;
}

/**
 * Container interaction callbacks
 */
export interface ContainerCallbacks {
  onContainerClick: (containerId: string) => void;
  onChildClick: (childId: string) => void;
  onContainerHover: (containerId: string, isHovered: boolean) => void;
  onToggleCollapse: (containerId: string) => void;
}

/**
 * Props for the main LayoutContainer component
 */
export interface LayoutContainerProps {
  /** Container component data */
  container: ResponsiveComponent;
  /** Child components within this container */
  childComponents: ResponsiveComponent[];
  /** Visual state of the container */
  visualState: ContainerVisualState;
  /** Interaction callbacks */
  callbacks: ContainerCallbacks;
  /** Container-specific styling */
  containerStyle?: ContainerStyle;
  /** Whether to show container border */
  showBorder?: boolean;
  /** Whether container is collapsible */
  collapsible?: boolean;
  /** Container title */
  title?: string;
  /** Custom CSS class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Container drop validation result
 */
export interface ContainerDropValidation {
  isValid: boolean;
  reason?: string;
  suggestedPosition?: { x: number; y: number };
}

/**
 * Container boundary information
 */
export interface ContainerBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Container drop target detection result
 */
export interface ContainerDropTarget {
  type: 'container' | 'canvas';
  containerId?: string;
  containerComponent?: ResponsiveComponent;
  containerBounds?: ContainerBounds;
  validDrop: boolean;
  reason?: string;
}

/**
 * Container rendering configuration
 */
export interface ContainerRenderConfig {
  showDropZone: boolean;
  showCollapseButton: boolean;
  showTitle: boolean;
  showEmptyState: boolean;
  enableHoverEffects: boolean;
  enableSelection: boolean;
}

/**
 * Container animation configuration
 */
export interface ContainerAnimationConfig {
  enableAnimations: boolean;
  collapseDuration: number;
  expandDuration: number;
  hoverTransitionDuration: number;
  selectionTransitionDuration: number;
}

/**
 * Drag stop target detection result
 */
export interface DragStopTarget {
  /** Type of target where component was dropped */
  type: 'same-container' | 'other-container' | 'main-canvas';
  /** Target container ID (if dropped into a container) */
  targetContainerId?: string | null;
  /** Calculated grid position in the target */
  position: {
    x: number;
    y: number;
  };
  /** Component being moved */
  component: ResponsiveComponent;
}
