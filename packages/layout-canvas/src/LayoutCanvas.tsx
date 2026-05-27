/**
 * Main Layout Canvas Component
 *
 * This is the primary Layout Canvas component that provides drag-and-drop
 * layout building functionality using React Grid Layout as the foundation.
 *
 * Export: Default export for the main LayoutCanvas component
 */

export { default as LayoutCanvas } from './rgl-integration/wrappers/LayoutCanvas';
export { default } from './rgl-integration/wrappers/LayoutCanvas';

// Re-export types for convenience
export type { LayoutCanvasWrapperProps as LayoutCanvasProps } from './rgl-integration/types';

// Re-export hybrid structure utilities
export {
  flattenNestedStructure,
  extractFlatComponents,
  validateStructureConsistency,
} from './utils/structureConverters';

export type { ResponsiveLayoutItem, LayoutCanvas as LayoutCanvasType } from './utils/structureConverters';
