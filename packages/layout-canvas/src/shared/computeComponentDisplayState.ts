import type { ResponsiveComponent } from '../rgl-integration/types';
import { getHiddenState, type Resolution, type ScreenMode } from '../utils/currentStateHelper';
import { computeValidationError, getHandleColor, getHeightResizableWidgets } from './componentDisplayUtils';

// Widget type constants — using string literals to avoid coupling to a specific
// import source (@m-next/types vs @m-next/runtime-interface).
const LAYOUT_CONTAINER = 'L-CON';
const SECTION = 'SEC';

/**
 * Computed display state for a component in the designer/runtime canvas.
 * All fields are derived from the component and its context — no side effects.
 */
export interface ComponentDisplayState {
  isSelected: boolean;
  isHovered: boolean;
  isHidden: boolean;
  isNearTop: boolean;
  hasValidationError: boolean;
  supportsHeightResize: boolean;
  handleColor: string;
  isLayoutContainer: boolean;
  isStaticContainer: boolean;
  isInContainer: boolean;
  /** CSS class names derived from state */
  dragClassName: string;
  staticClassName: string;
  selectionClassName: string;
  hoveredClassName: string;
  hiddenClassName: string;
  heightResizeClass: string;
  topRowClass: string;
}

export interface ComponentDisplayContext {
  /** Whether designer mode is active (controls are draggable) */
  isDraggable: boolean;
  /** ID of the currently selected component */
  selectedComponentId: string | null | undefined;
  /** ID of the currently hovered component (optional — per-component via HoverStore) */
  hoveredComponentId?: string | null;
  /** Current responsive resolution */
  resolution: Resolution | string;
  /** Current screen mode */
  mode: ScreenMode | string;
}

/**
 * Pure function: computes all display-related state for a single component.
 * Used by both LayoutCanvas (main canvas) and LayoutContainer (nested children).
 */
export function computeComponentDisplayState(
  component: ResponsiveComponent,
  context: ComponentDisplayContext,
): ComponentDisplayState {
  const { isDraggable, selectedComponentId, hoveredComponentId, resolution, mode } = context;

  // Core boolean states
  const isSelected = isDraggable && selectedComponentId === component.id;
  const isHovered = isDraggable && hoveredComponentId === component.id;
  // @ts-ignore — responsive may have broader shape at runtime
  const isHidden = getHiddenState(component, component.responsive, resolution as Resolution, mode as ScreenMode);
  const isNearTop = component.y === 0;
  const hasValidationError = computeValidationError(component);
  const supportsHeightResize = getHeightResizableWidgets().includes(component.type as string);

  // Container type detection
  const isLayoutContainer = (component.type as string) === LAYOUT_CONTAINER;
  const isStaticContainer = (component.type as string) === SECTION;
  const isInContainer = !!component.containerId;

  // Derived values
  const handleColor = getHandleColor(hasValidationError, isSelected);

  // CSS class names
  // Nested components are dragged by LayoutContainer's own nested handle classes.
  // Avoid adding main-canvas .drag-handle to in-container components, otherwise
  // mousedown inside nested controls can trigger parent container dragging.
  const dragClassName = isDraggable && !isLayoutContainer && !isInContainer ? 'drag-handle' : '';
  const staticClassName = !isDraggable || isStaticContainer ? 'static' : '';
  const selectionClassName = isSelected ? 'selected' : '';
  const hoveredClassName = isHovered && !isSelected ? 'hovered' : '';
  const hiddenClassName = isHidden && !isSelected && !isHovered ? 'hidden-unselected' : '';
  const heightResizeClass = supportsHeightResize ? 'height-resizable' : 'height-fixed';
  const topRowClass = isNearTop ? 'top-row' : '';

  return {
    isSelected,
    isHovered,
    isHidden,
    isNearTop,
    hasValidationError,
    supportsHeightResize,
    handleColor,
    isLayoutContainer,
    isStaticContainer,
    isInContainer,
    dragClassName,
    staticClassName,
    selectionClassName,
    hoveredClassName,
    hiddenClassName,
    heightResizeClass,
    topRowClass,
  };
}
