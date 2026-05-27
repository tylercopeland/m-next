import React from 'react';
import { colors } from '@m-next/styles';
import { gridStyleThemes } from './GridStyles';
import { Z_CANVAS } from '../../constants/zIndex';

/**
 * Grid visualization types and configuration
 */
export interface GridVisualizationProps {
  /** Whether to show the grid overlay */
  visible: boolean;
  /** Number of columns in the grid */
  cols: number;
  /** Height of each row in pixels */
  rowHeight: number;
  /** Container width */
  width: number;
  /** Grid style theme */
  theme?: 'default' | 'subtle' | 'prominent' | 'dragActive';
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  /** Whether to show column numbers */
  showColumnNumbers?: boolean;
  /** Custom grid color override */
  gridColor?: string;
  /** Container padding */
  containerPadding?: number;
  /** Grid margin */
  margin?: number;
  /** Maximum row position of components (for calculating grid height) */
  maxRowPosition?: number;
}

/**
 * Enhanced Grid Visualization Component
 *
 * Provides improved grid overlay with better visual feedback
 * and optional row/column indicators for better UX.
 *
 * Memoized to prevent re-renders when props don't change
 */
export const GridVisualization: React.FC<GridVisualizationProps> = React.memo(
  ({
    visible,
    cols,
    rowHeight,
    width,
    theme = 'default',
    showRowNumbers = false,
    showColumnNumbers = false,
    gridColor,
    containerPadding = 8,
    margin = 4,
    maxRowPosition = 0,
  }) => {
    if (!visible) {
      return null;
    }

    // Get theme configuration
    const themeConfig = gridStyleThemes[theme] || gridStyleThemes.default;
    const currentTheme = {
      ...themeConfig,
      gridColor: gridColor || themeConfig.lineColor,
    };

    // 🔧 DYNAMIC GRID DIMENSIONS: Use row height + margin for vertical spacing
    const gridCellHeight = rowHeight + margin;
    const effectiveWidth = Math.max(width - containerPadding * 2, 0);
    const colWidth = cols > 0 ? effectiveWidth / cols : 0;

    // Only calculate explicit height if we have content that would overflow
    // Otherwise just fill 100% of parent (no forced height)
    const BUFFER_ROWS = 10; // Show 10 extra rows below content
    const contentBasedRows = maxRowPosition + BUFFER_ROWS;
    const contentHeight = contentBasedRows * gridCellHeight;

    // Use minHeight: 100% to fill parent, height extends when content overflows
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          minHeight: '100%', // Fill parent container at minimum
          height: maxRowPosition > 0 ? `${contentHeight}px` : '100%', // Extend only if there's content
          pointerEvents: 'none',
          zIndex: Z_CANVAS.ITEM_NORMAL,
        }}
      >
        {/* Main grid overlay using flex-based columns for perfect alignment */}
        <div
          style={{
            position: 'absolute',
            top: `${containerPadding}px`,
            left: `${containerPadding}px`,
            right: `${containerPadding}px`,
            bottom: 0, // No bottom padding so bottom border shows fully
            display: 'flex',
            opacity: currentTheme.opacity,
            borderBottom: `${currentTheme.lineWidth}px solid ${currentTheme.gridColor}`, // Bottom border line
          }}
        >
          {/* Create flex-grow columns that naturally divide the space */}
          {Array.from({ length: cols }, (_, colIndex) => (
            <div
              key={`col-${colIndex}`}
              style={{
                flex: '1 1 0',
                borderLeft: colIndex === 0 ? `${currentTheme.lineWidth}px solid ${currentTheme.gridColor}` : 'none',
                borderRight: `${currentTheme.lineWidth}px solid ${currentTheme.gridColor}`,
                position: 'relative',
                // Add horizontal row lines - repeating every (rowHeight + margin) pixels
                backgroundImage: `linear-gradient(to bottom, ${currentTheme.gridColor} ${currentTheme.lineWidth}px, transparent ${currentTheme.lineWidth}px)`,
                backgroundSize: `100% ${gridCellHeight}px`,
                backgroundPosition: '0 0',
                backgroundRepeat: 'repeat',
              }}
            />
          ))}
        </div>

        {/* Column numbers */}
        {showColumnNumbers && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${containerPadding}px`,
              right: `${containerPadding}px`,
              height: `${containerPadding}px`,
              display: 'flex',
            }}
          >
            {Array.from({ length: cols }, (_, i) => (
              <div
                key={`col-${i}`}
                style={{
                  width: `${colWidth}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#666',
                  fontWeight: 500,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Row numbers */}
        {showRowNumbers && (
          <div
            style={{
              position: 'absolute',
              top: `${containerPadding}px`,
              left: 0,
              width: `${containerPadding}px`,
              bottom: `${containerPadding}px`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Dynamic row numbers based on container height */}
            {Array.from({ length: Math.floor((window.innerHeight - 200) / (rowHeight + margin)) }, (_, i) => (
              <div
                key={`row-${i}`}
                style={{
                  height: `${rowHeight + margin}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#666',
                  fontWeight: 500,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for optimal re-rendering
    return (
      prevProps.visible === nextProps.visible &&
      prevProps.cols === nextProps.cols &&
      prevProps.rowHeight === nextProps.rowHeight &&
      prevProps.theme === nextProps.theme &&
      prevProps.maxRowPosition === nextProps.maxRowPosition
    );
  },
);

/**
 * Drop zone indicator for enhanced visual feedback
 */
export interface DropZoneIndicatorProps {
  /** Whether to show the drop zone */
  visible: boolean;
  /** Grid position where drop would occur */
  gridPosition: { x: number; y: number; w: number; h: number };
  /** Component type being dropped */
  componentType?: string;
  /** Row height for calculations */
  rowHeight: number;
  /** Column width for calculations */
  colWidth: number;
  /** Container padding */
  containerPadding?: number;
  /** Grid margin */
  margin?: number;
}

export const DropZoneIndicator: React.FC<DropZoneIndicatorProps> = ({
  visible,
  gridPosition,
  componentType,
  rowHeight,
  colWidth,
  containerPadding = 8,
  margin = 4,
}) => {
  if (!visible) {
    return null;
  }

  const { x, y, w, h } = gridPosition;

  // Match RGL's actual positioning and sizing calculation
  const left = containerPadding + x * (colWidth + margin);
  const top = containerPadding + y * (rowHeight + margin);
  const width = w * colWidth - margin;
  const height = h * rowHeight - margin;

  // Generate unique class name for animation
  const animationId = `dropzone-pulse-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {/* Inject keyframes CSS for animation */}
      <style>
        {`
          @keyframes ${animationId} {
            from {
              opacity: 0.3;
              transform: scale(1);
            }
            to {
              opacity: 0.7;
              transform: scale(1.01);
            }
          }
        `}
      </style>
      <div
        className={animationId}
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: `2px dashed ${colors.blue}`,
          background: `${colors.blue}1A`, // 10% opacity
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: Z_CANVAS.DROP_TARGET,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${animationId} 1s ease-in-out infinite alternate`,
        }}
      >
        {componentType && (
          <div
            style={{
              background: colors.blue,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: `0 2px 4px ${colors.blue}4D`, // 30% opacity
            }}
          >
            Drop {componentType}
          </div>
        )}
      </div>
    </>
  );
};

export default GridVisualization;
