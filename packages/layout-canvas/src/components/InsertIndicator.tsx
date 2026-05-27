/**
 * Insert Indicator
 *
 * Visual indicator line shown during insert mode drag operations.
 * Displays a 2px horizontal blue line at the insertion point.
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import React from 'react';
import { colors } from '@m-next/styles';
import { Z_UI } from '../constants/zIndex';

export interface InsertIndicatorProps {
  /** X position in pixels */
  x: number;
  /** Y position in pixels */
  y: number;
  /** Width in pixels */
  width: number;
  /** Whether the indicator is visible */
  visible: boolean;
  /** Optional override for line thickness (defaults to INSERT_LINE_HEIGHT) */
  height?: number;
}

/** Insert indicator color per design spec */
export const INSERT_LINE_COLOR = colors.blue;

/** Insert indicator height in pixels */
export const INSERT_LINE_HEIGHT = 2;

/**
 * InsertIndicator Component
 *
 * Renders a horizontal line indicating where a component will be inserted.
 * The line appears at the top edge of where existing components would be pushed.
 */
export const InsertIndicator: React.FC<InsertIndicatorProps> = ({
  x,
  y,
  width,
  visible,
  height = INSERT_LINE_HEIGHT,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-testid='insert-indicator'
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: INSERT_LINE_COLOR,
        pointerEvents: 'none',
        zIndex: Z_UI.INSERT_INDICATOR,
        transition: 'top 0.1s ease-out, left 0.1s ease-out',
      }}
    />
  );
};

export default InsertIndicator;
