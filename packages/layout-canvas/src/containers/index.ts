// Main container components
export { LayoutContainer } from './LayoutContainer';
export { useContainerState } from './hooks/useContainerState';
export { withContainer } from './utils/withContainer';
export { containerMemoComparison } from './utils/containerMemoComparison';
export type { LayoutContainerWrapperProps } from './utils/containerMemoComparison';
export {
  computeContainerGridMetrics,
  buildLayoutItemsFromComponents,
  computeInsertDetection,
} from './utils/containerInsertDetection';

// Utils
export { ContainerManager } from './utils/ContainerManager';
export { buildContainerProps } from './utils/buildContainerProps';
export type { ContainerPropsContext } from './utils/buildContainerProps';

// Hooks
export { useContainerHandler, useContainerLayoutHandlers } from './hooks/useContainerHandler';
export type {
  ContainerLayoutItem,
  UseContainerHandlerParams,
  ContainerLayoutHandlers,
} from './hooks/useContainerHandler';
export { useContainerPreemptiveEventHandlers } from './hooks/useContainerPreemptiveEventHandlers';
export type { UseContainerPreemptiveEventHandlersParams } from './hooks/useContainerPreemptiveEventHandlers';

// Types
export type {
  ContainerStyle,
  ContainerVisualState,
  ContainerCallbacks,
  LayoutContainerProps,
  ContainerDropValidation,
  ContainerBounds,
  ContainerDropTarget,
  ContainerRenderConfig,
  ContainerAnimationConfig,
} from './ContainerTypes';

// Re-export container-related types from main types
export type { ResponsiveComponent, ContainerConfig } from '../rgl-integration/types';
