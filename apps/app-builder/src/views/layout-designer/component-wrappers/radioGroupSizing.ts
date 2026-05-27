/**
 * Shared sizing utilities for RadioGroup components
 * Used by both radioGroupWrapper.tsx and RadioGroupEditor.tsx
 */

// Sizing constants (pixels)
// Each radio option: 16px indicator/text + internal padding = ~24px rendered height
export const RADIO_OPTION_HEIGHT_PX = 24;
// Gap between vertical options (gap prop default in RadioGroup.jsx)
export const RADIO_VERTICAL_GAP_PX = 16;
// Caption: 14px font + 10px margin-bottom + padding = ~28px
export const CAPTION_HEIGHT_PX = 28;
export const CHAR_WIDTH_PX = 6; // Average char width for 14px font
export const RADIO_INDICATOR_WIDTH_PX = 30; // Radio button indicator + padding
export const HORIZONTAL_GAP_PX = 10; // Gap between horizontal items
export const HORIZONTAL_PADDING_PX = 20; // Overall horizontal padding

// Grid constants from layout canvas (LayoutCanvasWrapper.tsx uses rowHeight=16)
const COLUMN_WIDTH = 75; // pixels per column (900px / 12 columns)
const ROW_HEIGHT = 16; // pixels per row - this is the actual value used in LayoutCanvasWrapper

export interface RadioGroupControlForSizing {
  radiobuttons?: (string | number)[];
  hideCaption?: boolean;
  caption?: string;
  width?: string | number | null;
  height?: string | number | null;
  position?: string;
}

/**
 * Calculate minimum pixel width for horizontal layout
 */
export function calculateRequiredHorizontalWidthPx(control: RadioGroupControlForSizing): number {
  if (!control?.radiobuttons?.length) return COLUMN_WIDTH; // Minimum 1 column worth

  let totalWidth = 0;
  control.radiobuttons.forEach((label: string | number, index: number) => {
    const labelStr = String(label);
    totalWidth += RADIO_INDICATOR_WIDTH_PX + (labelStr.length * CHAR_WIDTH_PX);
    if (index < control.radiobuttons!.length - 1) {
      totalWidth += HORIZONTAL_GAP_PX;
    }
  });

  return totalWidth + HORIZONTAL_PADDING_PX;
}

/**
 * Convert pixel width to columns (ceiling to ensure fit)
 */
export function pixelsToColumns(pixels: number): number {
  return Math.max(1, Math.ceil(pixels / COLUMN_WIDTH));
}

/**
 * Convert pixel height to rows (ceiling to ensure fit)
 */
export function pixelsToRows(pixels: number): number {
  return Math.max(1, Math.ceil(pixels / ROW_HEIGHT));
}

/**
 * Calculate required columns for horizontal layout (capped at 12)
 */
export function calculateRequiredHorizontalColumns(control: RadioGroupControlForSizing): number {
  const pixels = calculateRequiredHorizontalWidthPx(control);
  return Math.min(pixelsToColumns(pixels), 12);
}

/**
 * Calculate height in ROWS for vertical layout
 * Each option: ~24px height + 16px gap (except last which has no gap)
 * Caption adds ~28px when visible
 */
export function calculateVerticalHeightRows(control: RadioGroupControlForSizing): number {
  const optionCount = control?.radiobuttons?.length || 0;
  if (optionCount === 0) return 1;

  const captionHeightPx = !control?.hideCaption && control?.caption ? CAPTION_HEIGHT_PX : 0;
  // Each option: height + gap, but last option has no gap
  const optionsHeightPx = optionCount * RADIO_OPTION_HEIGHT_PX +
                          (optionCount - 1) * RADIO_VERTICAL_GAP_PX;
  const totalHeightPx = optionsHeightPx + captionHeightPx;
  return pixelsToRows(totalHeightPx);
}

/**
 * Calculate height in ROWS for horizontal layout
 * All options in one row, just need option height + caption
 */
export function calculateHorizontalHeightRows(control: RadioGroupControlForSizing): number {
  const captionHeightPx = !control?.hideCaption && control?.caption ? CAPTION_HEIGHT_PX : 0;
  const totalHeightPx = RADIO_OPTION_HEIGHT_PX + captionHeightPx;
  return pixelsToRows(totalHeightPx);
}

/**
 * Calculate required columns for vertical layout based on widest label
 * Width = indicator + longest label + padding
 */
export function calculateRequiredVerticalColumns(control: RadioGroupControlForSizing): number {
  if (!control?.radiobuttons?.length) return 2; // Minimum 2 columns

  // Find the longest label
  let maxLabelLength = 0;
  control.radiobuttons.forEach((label: string | number) => {
    const labelStr = String(label);
    if (labelStr.length > maxLabelLength) {
      maxLabelLength = labelStr.length;
    }
  });

  // Width = indicator + longest label width + padding
  const widthPx = RADIO_INDICATOR_WIDTH_PX + (maxLabelLength * CHAR_WIDTH_PX) + HORIZONTAL_PADDING_PX;
  return Math.max(2, pixelsToColumns(widthPx));
}
