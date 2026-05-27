import type { ResponsiveComponent } from '../../rgl-integration/types';
import type { DragPreview } from '../../hooks/useCanvasDragState';
import type { ContainerAnimationConfig } from '../ContainerTypes';
import type { WidgetType } from '../../rgl-integration/types';
import type { Resolution, ScreenMode } from '../../utils/currentStateHelper';

/**
 * Props interface matching LayoutContainerWrapperProps for the memo comparison.
 * Kept in sync with LayoutContainer's prop type.
 */
export interface LayoutContainerWrapperProps {
  container: ResponsiveComponent & {
    hideCaption?: boolean;
    caption?: string;
    showIcon?: boolean;
    icon?: string;
    showBorder?: boolean;
    showShadow?: boolean;
  };
  childComponents: ResponsiveComponent[];
  selectedComponentId?: string;
  onContainerClick: (containerId: string) => void;
  onChildClick: (childId: string) => void;
  renderChildComponent: (component: ResponsiveComponent) => React.ReactElement;
  containerStyle?: string;
  title?: string;
  collapsible?: boolean;
  showBorder?: boolean;
  className?: string;
  style?: React.CSSProperties;
  animationConfig?: Partial<ContainerAnimationConfig>;
  dragOverCanvas?: string | null;
  onNestedDrop?: (
    e: React.DragEvent,
    targetContainerId: string,
    position?: { x: number; y: number; w: number; h: number },
  ) => void;
  onNestedDragOver?: (e: React.DragEvent, canvasId: string) => void;
  onNestedDragLeave?: (e: React.DragEvent) => void;
  onNestedDragComplete?: () => void;
  onNestedComponentsChange?: (updatedComponents: ResponsiveComponent[]) => void;
  rowHeight?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
  allComponents?: ResponsiveComponent[];
  mapWidgetType?: (type: string) => WidgetType;
  controlRegistry?: Record<string, unknown>;
  resolution: Resolution;
  mode: ScreenMode;
  showHiddenComponents?: boolean;
  isDraggedOver?: boolean;
  dragPreview?: DragPreview;
  dragPreviewRef?: React.MutableRefObject<DragPreview>;
  onDragPreviewChange?: React.Dispatch<React.SetStateAction<DragPreview>>;
  onDragPreviewClear?: () => void;
}

/**
 * Checks whether a drag preview is relevant to a specific container.
 */
const isPreviewRelevantToContainer = (preview: DragPreview | undefined, containerId: string): boolean => {
  if (!preview?.visible) return false;
  if (preview.targetType === 'container') {
    return preview.containerId === containerId || preview.sourceContainerId === containerId;
  }
  if (preview.targetType === 'canvas') {
    return preview.sourceContainerId === containerId;
  }
  return false;
};

/**
 * Custom React.memo comparison function for LayoutContainer.
 * Returns true to skip rerender, false to allow rerender.
 */
export const containerMemoComparison = (
  prevProps: LayoutContainerWrapperProps,
  nextProps: LayoutContainerWrapperProps,
): boolean => {
  // Core props that should trigger rerenders
  if (prevProps.container.id !== nextProps.container.id) return false;
  if (prevProps.rowHeight !== nextProps.rowHeight) return false;

  // Check isDraggedOver for visual feedback during drag
  if (prevProps.isDraggedOver !== nextProps.isDraggedOver) return false;

  // SELECTION OPTIMIZATION: Only rerender for selection changes that affect THIS container or its children
  const prevSelection = prevProps.selectedComponentId;
  const nextSelection = nextProps.selectedComponentId;

  const prevSelectsThisContainer = prevSelection === prevProps.container.id;
  const nextSelectsThisContainer = nextSelection === nextProps.container.id;
  const prevSelectsChild = prevProps.childComponents.some((child) => child.id === prevSelection);
  const nextSelectsChild = nextProps.childComponents.some((child) => child.id === nextSelection);

  const selectionChangeIsRelevant =
    prevSelectsThisContainer !== nextSelectsThisContainer ||
    prevSelectsChild !== nextSelectsChild ||
    (prevSelectsChild && nextSelectsChild && prevSelection !== nextSelection);

  if (selectionChangeIsRelevant) return false;

  // Check if childComponents actually changed (not just reference)
  if (prevProps.childComponents.length !== nextProps.childComponents.length) return false;

  // Deep check child components for actual changes
  const childrenChanged = prevProps.childComponents.some((prevChild: ResponsiveComponent, index: number) => {
    const nextChild = nextProps.childComponents[index];
    return (
      !nextChild ||
      prevChild.id !== nextChild.id ||
      prevChild.x !== nextChild.x ||
      prevChild.y !== nextChild.y ||
      prevChild.width !== nextChild.width ||
      prevChild.height !== nextChild.height ||
      // @ts-ignore - visible property exists on ResponsiveComponent
      prevChild.visible !== nextChild.visible ||
      // @ts-ignore - disabled property exists on ResponsiveComponent
      prevChild.disabled !== nextChild.disabled
    );
  });

  if (childrenChanged) return false;

  // Style changes
  if (JSON.stringify(prevProps.style) !== JSON.stringify(nextProps.style)) return false;

  // Container properties that matter for rendering
  if (prevProps.container.width !== nextProps.container.width) return false;
  if (prevProps.container.height !== nextProps.container.height) return false;
  if (prevProps.container.currentState !== nextProps.container.currentState) return false;

  if (prevProps.showHiddenComponents !== nextProps.showHiddenComponents) return false;

  const prevPreviewRelevant = isPreviewRelevantToContainer(prevProps.dragPreview, prevProps.container.id);
  const nextPreviewRelevant = isPreviewRelevantToContainer(nextProps.dragPreview, nextProps.container.id);

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

  // renderChildComponent is recreated when components array updates
  if (prevProps.renderChildComponent !== nextProps.renderChildComponent) return false;

  return true;
};
