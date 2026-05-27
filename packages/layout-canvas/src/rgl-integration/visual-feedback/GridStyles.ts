import { colors } from '@m-next/styles';

/**
 * Grid styles for React Grid Layout visual feedback
 * Decoupled from component styles for better maintainability
 */

export interface GridStyleConfig {
  /** Grid line color */
  lineColor: string;
  /** Grid line opacity */
  opacity: number;
  /** Grid line width in pixels */
  lineWidth: number;
  /** Whether to show the grid */
  visible: boolean;
}

/**
 * Default grid style configuration
 */
export const defaultGridStyle: GridStyleConfig = {
  lineColor: colors.blue || '#0D71C8',
  opacity: 0.15,
  lineWidth: 1,
  visible: false,
};

/**
 * Grid style themes for different interaction states
 */
export const gridStyleThemes = {
  default: {
    lineColor: '#ddd',
    opacity: 0.4,
    lineWidth: 1,
  },
  subtle: {
    lineColor: '#f0f0f0',
    opacity: 0.3,
    lineWidth: 1,
  },
  prominent: {
    lineColor: '#D9D9D9',
    opacity: 0.6,
    lineWidth: 2,
  },
  dragActive: {
    lineColor: '#D9D9D9',
    opacity: 1.0,
    lineWidth: 1,
  },
} as const;

/**
 * CSS for grid overlay that appears during drag operations
 */
export const createGridOverlayStyles = (
  colWidth: number,
  rowHeight: number,
  margin: number,
  config: Partial<GridStyleConfig> = {},
): string => {
  const { lineColor, opacity, lineWidth } = { ...defaultGridStyle, ...config };

  return `
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent ${colWidth - lineWidth}px,
        ${lineColor} ${colWidth - lineWidth}px,
        ${lineColor} ${colWidth}px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent ${rowHeight + margin - lineWidth}px,
        ${lineColor} ${rowHeight + margin - lineWidth}px,
        ${lineColor} ${rowHeight + margin}px
      );
    opacity: ${opacity};
  `;
};

/**
 * Injects global grid styles into the document
 */
export const injectGridStyles = () => {
  const styleId = 'layout-canvas-grid-styles';

  // Check if styles are already injected
  if (document.getElementById(styleId)) {
    return;
  }

  const styles = `
    /* Grid overlay container */
    .layout-canvas-grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    /* Show grid during drag operations */
    .layout-canvas-grid-overlay.visible {
      opacity: 1;
    }

    /* Grid background pattern */
    .layout-canvas-grid-background {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
};
