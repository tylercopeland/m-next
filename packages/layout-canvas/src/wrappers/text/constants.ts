/**
 * Constants for TextWrapper component
 */

export const FONT_SIZE_MAP = {
  Small: { fontSize: '12px', lineHeightMultiplier: 1.5 },
  Normal: { fontSize: '14px', lineHeightMultiplier: 1.3 },
  Large: { fontSize: '16px', lineHeightMultiplier: 1.2 },
  'X-Large': { fontSize: '20px', lineHeightMultiplier: 1.2 },
  'XX-Large': { fontSize: '24px', lineHeightMultiplier: 1.1 },
  'XXX-Large': { fontSize: '26px', lineHeightMultiplier: 1.1 },
} as const;

export const DEFAULT_FONT_SIZE = '14px';
export const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.5;
export const DEFAULT_LINE_CLAMP = 999;
export const DESCENDER_PADDING_MULTIPLIER = 0.1;
export const LINE_CLAMP_BUFFER = 3;
export const MAX_LINE_CLAMP = 1000;
