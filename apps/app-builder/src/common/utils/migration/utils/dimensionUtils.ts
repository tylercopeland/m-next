/**
 * Dimension calculation utilities for migration
 */

import { DesignerControl } from '../types';
import { CONTROL_HEIGHTS, DEFAULT_CONTROL_HEIGHT } from '../constants';

/**
 * Display restrictions for controls
 */
interface ControlDisplayRestrictions {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

/**
 * Widget type to display restrictions mapping
 * Based on unified control registry defaults
 */
const WIDGET_DISPLAY_RESTRICTIONS: Record<string, ControlDisplayRestrictions> = {
  // Buttons
  BTN: { minWidth: 1, maxWidth: 6, minHeight: 1, maxHeight: 3, defaultWidth: 2, defaultHeight: 3 },
  BGR: { minWidth: 1, maxWidth: 6, minHeight: 2, maxHeight: 6, defaultWidth: 2, defaultHeight: 4 },

  // Inputs
  TXT: { minWidth: 2, maxWidth: 8, minHeight: 3, maxHeight: 3, defaultWidth: 3, defaultHeight: 3 },
  TXA: { minWidth: 2, maxWidth: 12, minHeight: 2, maxHeight: 16, defaultWidth: 3, defaultHeight: 16 },
  ADR: { minWidth: 2, maxWidth: 8, minHeight: 3, maxHeight: 3, defaultWidth: 3, defaultHeight: 3 },

  // Selectors
  DRP: { minWidth: 2, maxWidth: 8, minHeight: 3, maxHeight: 3, defaultWidth: 3, defaultHeight: 3 },
  CHK: { minWidth: 1, maxWidth: 6, minHeight: 3, maxHeight: 3, defaultWidth: 2, defaultHeight: 3 },
  TGL: { minWidth: 1, maxWidth: 4, minHeight: 3, maxHeight: 3, defaultWidth: 2, defaultHeight: 3 },
  RAD: { minWidth: 2, maxWidth: 8, minHeight: 2, maxHeight: 8, defaultWidth: 3, defaultHeight: 4 },
  DTP: { minWidth: 2, maxWidth: 6, minHeight: 3, maxHeight: 3, defaultWidth: 3, defaultHeight: 3 },

  // Display
  LBL: { minWidth: 1, maxWidth: 8, minHeight: 2, maxHeight: 8, defaultWidth: 3, defaultHeight: 4 },
  PIC: { minWidth: 1, maxWidth: 12, minHeight: 2, maxHeight: 100, defaultWidth: 2, defaultHeight: 6 },

  // Grids
  GRD: { minWidth: 4, maxWidth: 12, minHeight: 20, maxHeight: 1000, defaultWidth: 12, defaultHeight: 20 },
  EDT: { minWidth: 4, maxWidth: 12, minHeight: 20, maxHeight: 1000, defaultWidth: 12, defaultHeight: 20 },

  // Complex widgets
  HTM: { minWidth: 3, maxWidth: 12, minHeight: 10, maxHeight: 40, defaultWidth: 6, defaultHeight: 20 },
  MAP: { minWidth: 3, maxWidth: 12, minHeight: 6, maxHeight: 48, defaultWidth: 4, defaultHeight: 12 },
  CHT: { minWidth: 3, maxWidth: 12, minHeight: 8, maxHeight: 40, defaultWidth: 6, defaultHeight: 20 },
  GAL: { minWidth: 6, maxWidth: 12, minHeight: 42, maxHeight: 42, defaultWidth: 12, defaultHeight: 42 },
  CAL: { minWidth: 6, maxWidth: 12, minHeight: 35, maxHeight: 48, defaultWidth: 12, defaultHeight: 36 },
  SIG: { minWidth: 2, maxWidth: 10, minHeight: 6, maxHeight: 16, defaultWidth: 3, defaultHeight: 10 },
  DOC: { minWidth: 2, maxWidth: 12, minHeight: 10, maxHeight: 1000, defaultWidth: 3, defaultHeight: 10 },
  TAG: { minWidth: 3, maxWidth: 8, minHeight: 3, maxHeight: 3, defaultWidth: 3, defaultHeight: 3 },
  REC: { minWidth: 3, maxWidth: 6, minHeight: 2, maxHeight: 6, defaultWidth: 3, defaultHeight: 4 },
  // Sync Widget is a pill; migrated layouts should clamp to 1 row tall.
  SYW: { minWidth: 1, maxWidth: 4, minHeight: 1, maxHeight: 1, defaultWidth: 1, defaultHeight: 1 },

  // Containers
  SEC: { minWidth: 2, maxWidth: 8, minHeight: 2, maxHeight: 8, defaultWidth: 3, defaultHeight: 4 },
  'L-CON': { minWidth: 3, maxWidth: 12, minHeight: 3, maxHeight: 40, defaultWidth: 12, defaultHeight: 12 },
  'F-BLOCK': { minWidth: 3, maxWidth: 12, minHeight: 4, maxHeight: 36, defaultWidth: 12, defaultHeight: 6 },
};

/**
 * Get display restrictions for a control type
 */
export function getDisplayRestrictions(controlType: string): ControlDisplayRestrictions {
  return WIDGET_DISPLAY_RESTRICTIONS[controlType] || {
    minWidth: 1,
    maxWidth: 12,
    minHeight: 2,
    maxHeight: 100,
  };
}

/**
 * Clamp dimension to min/max constraints
 */
export function clampDimension(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined) {
    result = Math.max(result, min);
  }
  if (max !== undefined) {
    result = Math.min(result, max);
  }
  return result;
}

/**
 * Clamp control dimensions to display restrictions
 */
export function clampControlDimensions(
  width: number,
  height: number,
  controlType: string
): { width: number; height: number } {
  const restrictions = getDisplayRestrictions(controlType);

  return {
    width: clampDimension(width, restrictions.minWidth, restrictions.maxWidth),
    height: clampDimension(height, restrictions.minHeight, restrictions.maxHeight),
  };
}

/**
 * Parse width string to grid columns
 */
export function parseWidth(widthStr: string, parentWidth: number): number | null {
  if (!widthStr || !widthStr.trim()) {
    return null;
  }

  const trimmed = widthStr.trim();

  if (trimmed.includes('%')) {
    try {
      const percentage = parseFloat(trimmed.replace('%', ''));
      return Math.max(1, Math.floor((parentWidth * percentage) / 100));
    } catch {
      return null;
    }
  }

  if (trimmed.includes('px')) {
    try {
      const pixels = parseFloat(trimmed.replace('px', ''));
      return Math.max(1, Math.floor(pixels / 100));
    } catch {
      return null;
    }
  }

  try {
    return Math.max(1, Math.floor(parseFloat(trimmed)));
  } catch {
    return null;
  }
}

/**
 * Extract width from CSS class string
 */
export function extractWidthFromCss(cssClass: string): number | null {
  if (!cssClass) {
    return null;
  }

  const match = cssClass.match(/\bcell-(\d+)\b/);
  if (match) {
    return parseInt(match[1], 10);
  }

  if (cssClass.includes('cell-pull-right') || cssClass.includes('cell-pull-left')) {
    return 3;
  }

  return null;
}

/**
 * Calculate column widths for a row
 */
export function calculateColumnWidths(columns: DesignerControl[], parentWidth: number): number[] {
  const numCols = columns.length;
  if (numCols === 0) {
    return [];
  }

  const widths: (number | null)[] = [];
  const explicitWidths: (number | null)[] = [];

  for (const col of columns) {
    let width = parseWidth(col.LegacyDataWidth || '', parentWidth);
    if (width === null) {
      const legacyClass = col.LegacyClass || '';
      width = extractWidthFromCss(legacyClass);
    }
    explicitWidths.push(width);
  }

  let remainingWidth = parentWidth;
  let remainingCols = numCols;

  for (const width of explicitWidths) {
    if (width !== null) {
      widths.push(Math.min(width, remainingWidth));
      remainingWidth -= widths[widths.length - 1]!;
      remainingCols -= 1;
    } else {
      widths.push(null);
    }
  }

  if (remainingCols > 0) {
    const defaultWidth = Math.max(1, Math.floor(remainingWidth / remainingCols));
    for (let i = 0; i < widths.length; i++) {
      if (widths[i] === null) {
        widths[i] = defaultWidth;
      }
    }
  }

  return widths.map((w) => Math.max(1, w || 1));
}

/**
 * Get control height in grid units
 */
export function getControlHeight(control: DesignerControl, controlType: string): number {
  const legacyHeight = control.LegacyDataHeight || '';
  if (legacyHeight && legacyHeight.includes('px')) {
    try {
      const pxHeight = parseInt(legacyHeight.replace('px', ''), 10);
      return Math.max(2, Math.floor(pxHeight / 24));
    } catch {
      // Fall through to default heights
    }
  }

  return CONTROL_HEIGHTS[controlType] || DEFAULT_CONTROL_HEIGHT;
}
