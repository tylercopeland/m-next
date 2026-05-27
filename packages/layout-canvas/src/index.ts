// Export Z-Index Constants (centralized layering hierarchy) — must be first to avoid
// barrel-loading issues where transitive dependencies fail before constants are defined.
export { Z_CANVAS, Z_COMPONENT, Z_UI, Z_POPUP, Z_MODAL } from './constants/zIndex';

// Main Component (New RGL-based approach)
export { default as LayoutCanvas } from './LayoutCanvas';

// Export RGL Integration Components (New Approach)
export * from './rgl-integration';

// Export Component System (Keep - still valid)
export { default as ComponentCard } from './component-palette/ComponentCard';
export { default as ComponentPalette } from './component-palette/ComponentPalette';
export { default as DragOverlay } from './component-palette/DragOverlay';
export {
  default as COMPONENT_CONFIG,
  getComponentsByCategory,
  getComponentConfig,
  getEnabledComponents,
  searchComponents,
  getAllCategories,
  getCategoryConfig,
  getWidgetIconName,
  ComponentCategory,
} from './component-palette/componentConfig';

// controlDefaults.ts exports
export * from './registry/controlDefaults';

// Re-export types from RGL integration
export type {
  ResponsiveComponent,
  LayoutCanvasWrapperProps as ReactGridLayoutWrapperProps,
  BreakpointConfig,
  FlowBehavior,
  ContainerConfig,
  GridComponent,
  WidgetType,
  RGLLayoutItem,
  RGLResponsiveLayouts,
} from './rgl-integration/types';

// Export Component Naming Utilities
export {
  generateUniqueComponentName,
  calculateComponentName,
  calculateNameFromLabelChange,
  getWidgetTypeName,
  sanitizeCaption,
  isReservedWord,
  extractBaseName,
  validateNameChange,
  batchRenameComponents,
  ComponentNameChecker,
  splitPascalCase,
  toV4FieldName,
  toV4FieldLabel,
} from './utils/componentNaming';

export type { NameUniquenessChecker } from './utils/componentNaming';

// Export Responsive Utilities (shared between App Builder and MethodUI Runtime)
export {
  DisplayLayout,
  SCREEN_BREAKPOINTS,
  getScreenTypeFromWidth,
  displayLayoutToResolution,
} from './utils/responsive';
export type { DisplayLayoutType, Resolution } from './utils/responsive';

// Export Registry Utilities (for widget type mapping and defaults)
export {
  mapWidgetToControlType,
  getComponentDefaultsFromRegistry,
  getDisplayRestrictionsFromRegistry,
} from './registry/registryUtils';

// Export Redux utilities (types and selectors to avoid circular dependency)
export * from './redux';

// Export Component Wrappers (Redux versions from app-builder)
export * from './wrappers';

// Export Runtime Context
export { RuntimeContextProvider, useRuntimeContext } from './contexts/RuntimeContext';
export { ScreenDataContextProvider, useScreenDataContext } from './contexts/ScreenDataContext';
export { DesignerContextProvider, useDesignerContext } from './contexts/DesignerContext';

// Export Canvas Configuration (shared constants for designer and runtime)
export {
  TAB_PANEL_WIDTH,
  CANVAS_DIMENSIONS,
  GRID_COLUMNS,
  getGridColumns,
  getCanvasWidth,
} from './config/canvasConfig';
// Note: Resolution type is already exported from './utils/responsive'

// Export Action Execution Infrastructure
export * from './actions';
export type { ActionHandler, ActionContext, ActionResult } from './actions';

// Export Dropdown Utilities (shared between App Builder designer and Runtime)
export { useDropdownSearch } from './hooks/useDropdownSearch';
export type { DropdownSearchConfig, DropdownSearchResult } from './hooks/useDropdownSearch';
export { parseDropdownData } from './utils/dropdownDataParser';

// Export Vertical Push Calculator (for static layout mode resize)
export {
  resolvePushCollisions,
  calculateResizePush,
  checkCollision,
  componentsToLayoutItems,
  applyLayoutToComponents,
} from './utils/verticalPushCalculator';
export type { LayoutItem, PushResult } from './utils/verticalPushCalculator';

// Export Layout Reflow Calculator (for tablet/mobile fallback without saved overrides)
export { buildReflowLookup, reflowItems, scaleWidth } from './utils/layoutReflowCalculator';
export type { ReflowItem } from './utils/layoutReflowCalculator';

// Export Compaction Algorithm (for row-based visibility collapse and height growth)
export { compact } from './utils/compaction';
export { collides } from './utils/compaction/compact';
export type { CompactionItemIn, CompactionItem, DynamicData } from './utils/compaction/compact';
export { componentsToGridItems, buildDynamicData, applyCompactedLayout } from './utils/compaction/compactionAdapters';
