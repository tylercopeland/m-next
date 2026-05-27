import {
  Resolution,
  TAB_PANEL_WIDTH,
  CANVAS_DIMENSIONS,
  GRID_COLUMNS,
  getGridColumns,
  getCanvasWidth,
} from './canvasConfig';

describe('canvasConfig constants', () => {
  it('TAB_PANEL_WIDTH is 440', () => {
    expect(TAB_PANEL_WIDTH).toBe(440);
  });

  it('CANVAS_DIMENSIONS has correct desktop values', () => {
    expect(CANVAS_DIMENSIONS.desktop.minWidth).toBe(976);
    expect(CANVAS_DIMENSIONS.desktop.maxWidth).toBe(1200);
  });

  it('CANVAS_DIMENSIONS has correct tablet value', () => {
    expect(CANVAS_DIMENSIONS.tablet.width).toBe(768);
  });

  it('CANVAS_DIMENSIONS has correct mobile value', () => {
    expect(CANVAS_DIMENSIONS.mobile.width).toBe(375);
  });

  it('GRID_COLUMNS has correct values', () => {
    expect(GRID_COLUMNS.desktop).toBe(12);
    expect(GRID_COLUMNS.tablet).toBe(8);
    expect(GRID_COLUMNS.mobile).toBe(4);
  });
});

describe('getGridColumns', () => {
  it('returns 12 for desktop', () => {
    expect(getGridColumns('desktop')).toBe(12);
  });

  it('returns 8 for tablet', () => {
    expect(getGridColumns('tablet')).toBe(8);
  });

  it('returns 4 for mobile', () => {
    expect(getGridColumns('mobile')).toBe(4);
  });

  it('returns desktop default for unknown resolution', () => {
    expect(getGridColumns('unknown' as Resolution)).toBe(12);
  });
});

describe('getCanvasWidth', () => {
  it('returns 1200 for desktop', () => {
    expect(getCanvasWidth('desktop')).toBe(1200);
  });

  it('returns 768 for tablet', () => {
    expect(getCanvasWidth('tablet')).toBe(768);
  });

  it('returns 375 for mobile', () => {
    expect(getCanvasWidth('mobile')).toBe(375);
  });
});
