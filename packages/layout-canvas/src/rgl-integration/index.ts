/**
 * RGL Integration Module
 *
 * This module provides React Grid Layout integration for the Layout Canvas,
 * enabling responsive drag-and-drop functionality while maintaining our
 * component interface and architectural patterns.
 */

// Types
export * from './types';

// State Adapters
export { rglStateAdapter, RGLStateAdapterImpl } from './adapters/RGLStateAdapter';

// Wrapper Components
export { default as LayoutCanvas } from './wrappers/LayoutCanvas';
export {
  WidthProviderEnhanced,
  withWidthProvider,
  useContainerWidth,
  calculateGridDimensions,
} from './wrappers/WidthProviderEnhanced';

// Re-export RGL types and components for convenience
export type { Layout, Layouts, ItemCallback } from 'react-grid-layout';
export { default as RGL } from 'react-grid-layout';

// CSS imports (to be included in consuming applications)
export const RGL_CSS_IMPORTS = ['react-grid-layout/css/styles.css', 'react-resizable/css/styles.css'];

/**
 * Default configuration constants
 */
export const DEFAULT_RGL_CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },
  cols: {
    mobile: 1,
    tablet: 6,
    desktop: 12,
  },
  rowHeight: 24,
  margin: [4, 4] as [number, number],
  containerPadding: [8, 8] as [number, number],
  compactType: 'vertical' as const,
  preventCollision: false,
  useCSSTransforms: true,
};

/**
 * Utility function to get RGL styles as CSS strings
 * Can be used for CSS-in-JS solutions or style injection
 */
export const RGL_CSS_RULES = {
  base: `
    .react-grid-layout {
      position: relative;
    }
    .react-grid-item {
      transition: all 200ms ease;
      transition-property: left, top, width, height;
    }
    .react-grid-item.cssTransforms {
      transition-property: transform, width, height;
    }
    .react-grid-item.resizing {
      opacity: 0.9;
      z-index: 3;
    }
    .react-grid-item.react-draggable-dragging {
      transition: none;
      z-index: 3;
    }
    .react-grid-item.dropping {
      visibility: hidden;
    }
    .react-grid-item.react-grid-placeholder {
      background: #4299e1;
      opacity: 0.3;
      transition-duration: 100ms;
      z-index: 2;
      border-radius: 4px;
    }
  `,
  resizableHandle: `
    .react-resizable-handle {
      position: absolute;
      width: 16px;
      height: 16px;
      bottom: 0;
      right: 0;
      cursor: se-resize;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjOTk5IiBjeD0iMSIgY3k9IjEiIHI9IjEiLz4KPGR0cyBmaWxsPSIjOTk5IiBjeD0iNSIgY3k9IjEiIHI9IjEiLz4KPGR0cyBmaWxsPSIjOTk5IiBjeD0iMSIgY3k9IjUiIHI9IjEiLz4KPGR0cyBmaWxsPSIjOTk5IiBjeD0iNSIgY3k9IjUiIHI9IjEiLz4KPC9zdmc+');
      background-size: contain;
    }
    .react-resizable-handle::after {
      content: '';
      position: absolute;
      right: 3px;
      bottom: 3px;
      width: 5px;
      height: 5px;
      border-right: 2px solid rgba(0, 0, 0, 0.4);
      border-bottom: 2px solid rgba(0, 0, 0, 0.4);
    }
  `,
};

/**
 * Integration status and info
 */
export const RGL_INTEGRATION_INFO = {
  version: '1.0.0',
  status: 'ready',
  features: [
    'Basic drag and drop layout',
    'Responsive breakpoint handling',
    'Component state adaptation',
    'Enhanced width provider',
    'Visual feedback and animations',
    'Collision detection support',
    'Container component support',
  ],
  dependencies: {
    'react-grid-layout': '^1.4.4',
  },
};
