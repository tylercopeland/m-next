import { getDesignerCanvasStyle, getDesignerCanvasWidth, clampCanvasWidth } from './designerCanvasConfig';

// Mock the @m-next/layout-canvas module
jest.mock('@m-next/layout-canvas', () => ({
  TAB_PANEL_WIDTH: 440,
  CANVAS_DIMENSIONS: {
    desktop: { minWidth: 976, maxWidth: 1200 },
    tablet: { width: 768 },
    mobile: { width: 375 },
  },
  getCanvasWidth: jest.fn((resolution: string) => {
    switch (resolution) {
      case 'tablet': return 768;
      case 'mobile': return 375;
      default: return 1200;
    }
  }),
}));

describe('getDesignerCanvasStyle', () => {
  it('returns full width for appRibbonType 2 (outer container needs room for canvas + tab panel)', () => {
    const style = getDesignerCanvasStyle('desktop', 2);
    expect(style).toEqual({ width: '100%', minWidth: 976, maxWidth: 1200 });
  });

  it('returns full width for appRibbonType 1 (outer container needs room for canvas + ribbon)', () => {
    const style = getDesignerCanvasStyle('desktop', 1);
    expect(style).toEqual({ width: '100%', minWidth: 976, maxWidth: 1200 });
  });

  it('returns fixed tablet dimensions', () => {
    const style = getDesignerCanvasStyle('tablet');
    expect(style).toEqual({ width: 768, minWidth: 768, maxWidth: 768 });
  });

  it('returns fixed mobile dimensions', () => {
    const style = getDesignerCanvasStyle('mobile');
    expect(style).toEqual({ width: 375, minWidth: 375, maxWidth: 375 });
  });

  it('returns fluid desktop dimensions', () => {
    const style = getDesignerCanvasStyle('desktop');
    expect(style).toEqual({ width: '100%', minWidth: 976, maxWidth: 1200 });
  });

  it('appRibbonType 2 uses full width regardless of resolution', () => {
    const style = getDesignerCanvasStyle('tablet', 2);
    expect(style).toEqual({ width: '100%', minWidth: 976, maxWidth: 1200 });
  });
});

describe('getDesignerCanvasWidth', () => {
  it('returns 440 for tab panel layout', () => {
    expect(getDesignerCanvasWidth('desktop', 2)).toBe(440);
  });

  it('returns 1200 for desktop', () => {
    expect(getDesignerCanvasWidth('desktop')).toBe(1200);
  });

  it('returns 768 for tablet', () => {
    expect(getDesignerCanvasWidth('tablet')).toBe(768);
  });

  it('returns 375 for mobile', () => {
    expect(getDesignerCanvasWidth('mobile')).toBe(375);
  });

  it('returns 440 for mobile with tab panel', () => {
    expect(getDesignerCanvasWidth('mobile', 2)).toBe(440);
  });
});

describe('clampCanvasWidth (NCNG-831: right-aligned elements disappear on resize)', () => {
  it('AC1: returns containerMeasuredWidth when container is narrower than nominal (desktop)', () => {
    // When the designer pane is 800px but nominal desktop width is 1200px,
    // RGL must use 800 so elements are not positioned beyond the visible area.
    expect(clampCanvasWidth(1200, 800, 'desktop')).toBe(800);
  });

  it('AC1: returns nominalWidth when container is wider than nominal (desktop)', () => {
    // Container wider than 1200px — use the full nominal 1200 so layout stays consistent.
    expect(clampCanvasWidth(1200, 1300, 'desktop')).toBe(1200);
  });

  it('AC1: returns nominalWidth when container equals nominal width (desktop)', () => {
    expect(clampCanvasWidth(1200, 1200, 'desktop')).toBe(1200);
  });

  it('AC1: returns nominalWidth when containerMeasuredWidth is undefined (detector not yet fired)', () => {
    // useResizeDetector returns undefined before the first measurement — fall back to nominal.
    expect(clampCanvasWidth(1200, undefined, 'desktop')).toBe(1200);
  });

  it('AC1: returns nominalWidth when containerMeasuredWidth is 0 (guard against division-by-zero)', () => {
    expect(clampCanvasWidth(1200, 0, 'desktop')).toBe(1200);
  });

  it('does NOT clamp for tablet resolution (fixed width, always fully visible)', () => {
    // Tablet width is fixed at 768 — clamping would break the layout for no reason.
    expect(clampCanvasWidth(768, 600, 'tablet')).toBe(768);
  });

  it('does NOT clamp for mobile resolution (fixed width, always fully visible)', () => {
    expect(clampCanvasWidth(375, 300, 'mobile')).toBe(375);
  });
});
