/* eslint-disable @typescript-eslint/no-explicit-any */
import { CurrentState } from '@m-next/types';
import {
  buildNestedFromFlat,
  assembleLayoutCanvas,
  buildFlatLayoutItems,
  buildFlatLayoutItemsSimple,
} from './v4LayoutPersistence';

// ---------------------------------------------------------------------------
// buildNestedFromFlat
// ---------------------------------------------------------------------------

describe('buildNestedFromFlat', () => {
  it('returns empty array for empty input', () => {
    expect(buildNestedFromFlat([], null)).toEqual([]);
  });

  it('returns top-level items (containerId === null)', () => {
    const items = [
      { id: 'a', containerId: null, desktop: { x: 0, y: 0, width: 4, height: 2 }, content: [] },
      { id: 'b', containerId: null, desktop: { x: 4, y: 0, width: 4, height: 2 }, content: [] },
    ] as any;
    const result = buildNestedFromFlat(items, null);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('a');
    expect(result[1].id).toBe('b');
  });

  it('nests children under their parent', () => {
    const items = [
      { id: 'parent', containerId: null, desktop: { x: 0, y: 0, width: 12, height: 4 }, content: [] },
      { id: 'child1', containerId: 'parent', desktop: { x: 0, y: 0, width: 6, height: 2 }, content: [] },
      { id: 'child2', containerId: 'parent', desktop: { x: 6, y: 0, width: 6, height: 2 }, content: [] },
    ] as any;
    const result = buildNestedFromFlat(items, null);
    expect(result).toHaveLength(1);
    expect(result[0].content).toHaveLength(2);
    expect(result[0].content[0].id).toBe('child1');
    expect(result[0].content[1].id).toBe('child2');
  });

  it('handles deeply nested items', () => {
    const items = [
      { id: 'root', containerId: null, desktop: { x: 0, y: 0, width: 12, height: 6 }, content: [] },
      { id: 'mid', containerId: 'root', desktop: { x: 0, y: 0, width: 12, height: 4 }, content: [] },
      { id: 'leaf', containerId: 'mid', desktop: { x: 0, y: 0, width: 6, height: 2 }, content: [] },
    ] as any;
    const result = buildNestedFromFlat(items, null);
    expect(result[0].content[0].content[0].id).toBe('leaf');
  });
});

// ---------------------------------------------------------------------------
// assembleLayoutCanvas
// ---------------------------------------------------------------------------

describe('assembleLayoutCanvas', () => {
  it('creates LayoutCanvas with nested content from flat items', () => {
    const flat = [
      { id: 'a', containerId: null, desktop: { x: 0, y: 0, width: 4, height: 2 }, content: [] },
    ] as any;
    const layoutV4 = { canvasId: 'c1', type: 'Grid', size: 12, content: [] } as any;

    const result = assembleLayoutCanvas(flat, layoutV4, 'v1');
    expect(result.canvasId).toBe('c1');
    expect(result.type).toBe('Grid');
    expect(result.size).toBe(12);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].id).toBe('a');
  });

  it('falls back to versionId when layoutV4 has no canvasId', () => {
    const flat = [] as any;
    const result = assembleLayoutCanvas(flat, undefined, 'version-123');
    expect(result.canvasId).toBe('version-123');
    expect(result.type).toBe('Grid');
    expect(result.size).toBe(12);
  });

  it('nests children inside parents', () => {
    const flat = [
      { id: 'parent', containerId: null, desktop: { x: 0, y: 0, width: 12, height: 4 }, content: [] },
      { id: 'child', containerId: 'parent', desktop: { x: 0, y: 0, width: 6, height: 2 }, content: [] },
    ] as any;
    const result = assembleLayoutCanvas(flat, undefined, 'v1');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].content).toHaveLength(1);
    expect(result.content[0].content[0].id).toBe('child');
  });
});

// ---------------------------------------------------------------------------
// buildFlatLayoutItems (Pattern A — full merge with layoutV4 search)
// ---------------------------------------------------------------------------

describe('buildFlatLayoutItems', () => {
  const makeComponent = (overrides = {}) => ({
    id: 'comp1',
    type: 'BTN',
    x: 2,
    y: 3,
    width: 4,
    height: 2,
    containerId: null,
    static: false,
    ...overrides,
  });

  const makeCanvasComponent = (overrides = {}) => ({
    id: 'comp1',
    type: 'BTN',
    x: 0,
    y: 0,
    width: 4,
    height: 2,
    containerId: null,
    static: false,
    responsive: {
      desktop: { x: 0, y: 0, width: 4, height: 2 },
      tabletOverride: { x: 0, y: 0, width: 8, height: 2 },
      mobileOverride: { x: 0, y: 0, width: 4, height: 3 },
    },
    ...overrides,
  });

  it('builds flat items for desktop resolution', () => {
    const components = [makeComponent()] as any;
    const canvas = [makeCanvasComponent()] as any;
    const result = buildFlatLayoutItems(components, canvas, undefined, 'desktop');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('comp1');
    // Desktop should be updated with component position
    expect(result[0].desktop.x).toBe(2);
    expect(result[0].desktop.y).toBe(3);
    // Tablet/mobile should preserve existing responsive data
    expect(result[0].tabletOverride).toBeDefined();
    expect(result[0].tabletOverride!.x).toBe(0);
    expect(result[0].mobileOverride).toBeDefined();
  });

  it('applies update to tablet resolution only', () => {
    const components = [makeComponent({ x: 1, y: 5 })] as any;
    const canvas = [makeCanvasComponent()] as any;
    const result = buildFlatLayoutItems(components, canvas, undefined, 'tablet');

    // Desktop should NOT be updated
    expect(result[0].desktop.x).toBe(0);
    // Tablet SHOULD be updated
    expect(result[0].tabletOverride!.x).toBe(1);
    expect(result[0].tabletOverride!.y).toBe(5);
  });

  it('preserves currentState from layoutV4 when available', () => {
    const layoutV4 = {
      canvasId: 'c1', type: 'Grid', size: 12,
      content: [{
        id: 'comp1', x: 0, y: 0, width: 4, height: 2,
        desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.HIDDEN },
        content: [],
      }],
    } as any;
    const components = [makeComponent()] as any;
    const canvas = [makeCanvasComponent()] as any;

    const result = buildFlatLayoutItems(components, canvas, layoutV4, 'desktop');
    expect(result[0].desktop.currentState).toBe(CurrentState.HIDDEN);
  });

  it('defaults currentState to REGULAR when no layoutV4', () => {
    const components = [makeComponent()] as any;
    // No existing responsive data
    const canvas = [{ ...makeComponent(), responsive: undefined }] as any;

    const result = buildFlatLayoutItems(components, canvas, undefined, 'desktop');
    expect(result[0].desktop.currentState).toBe(CurrentState.REGULAR);
  });
});

// ---------------------------------------------------------------------------
// buildFlatLayoutItemsSimple (Pattern B — responsive-aware, no search)
// ---------------------------------------------------------------------------

describe('buildFlatLayoutItemsSimple', () => {
  const makeComponent = (overrides = {}) => ({
    id: 'comp1',
    type: 'BTN',
    x: 2,
    y: 3,
    width: 4,
    height: 2,
    containerId: null,
    static: false,
    ...overrides,
  });

  const makeCanvasComponent = (responsive?: any) => ({
    id: 'comp1',
    type: 'BTN',
    x: 0,
    y: 0,
    width: 4,
    height: 2,
    containerId: null,
    static: false,
    responsive,
  });

  it('builds base structure without responsive when no existing responsive', () => {
    const components = [makeComponent()] as any;
    const canvas = [makeCanvasComponent(undefined)] as any;

    const result = buildFlatLayoutItemsSimple(components, canvas, 'desktop');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('comp1');
    expect(result[0].desktop.x).toBe(2);
    expect(result[0].tabletOverride).toBeUndefined();
    expect(result[0].mobileOverride).toBeUndefined();
  });

  it('applies position to desktop when resolution is desktop', () => {
    const responsive = {
      desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
      tabletOverride: { x: 0, y: 0, width: 8, height: 2 },
      mobileOverride: { x: 0, y: 0, width: 4, height: 3 },
    };
    const components = [makeComponent({ x: 5, y: 6 })] as any;
    const canvas = [makeCanvasComponent(responsive)] as any;

    const result = buildFlatLayoutItemsSimple(components, canvas, 'desktop');
    // Desktop gets component's position
    expect(result[0].desktop.x).toBe(5);
    expect(result[0].desktop.y).toBe(6);
    // Other breakpoints preserved
    expect(result[0].tabletOverride).toBeDefined();
    expect(result[0].mobileOverride).toBeDefined();
  });

  it('applies position to tablet when resolution is tablet', () => {
    const responsive = {
      desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
      tabletOverride: { x: 0, y: 0, width: 8, height: 2 },
      mobileOverride: { x: 0, y: 0, width: 4, height: 3 },
    };
    const components = [makeComponent({ x: 1, y: 2 })] as any;
    const canvas = [makeCanvasComponent(responsive)] as any;

    const result = buildFlatLayoutItemsSimple(components, canvas, 'tablet');
    // Desktop preserves existing
    expect(result[0].desktop.x).toBe(0);
    // Tablet gets component's position
    expect(result[0].tabletOverride!.x).toBe(1);
    expect(result[0].tabletOverride!.y).toBe(2);
    // Mobile preserved
    expect(result[0].mobileOverride).toBeDefined();
  });

  it('applies position to mobile when resolution is mobile', () => {
    const responsive = {
      desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
      tabletOverride: { x: 0, y: 0, width: 8, height: 2 },
      mobileOverride: { x: 0, y: 0, width: 4, height: 3 },
    };
    const components = [makeComponent({ x: 0, y: 5 })] as any;
    const canvas = [makeCanvasComponent(responsive)] as any;

    const result = buildFlatLayoutItemsSimple(components, canvas, 'mobile');
    // Desktop preserves existing
    expect(result[0].desktop.x).toBe(0);
    // Tablet preserved
    expect(result[0].tabletOverride).toBeDefined();
    // Mobile gets component's position
    expect(result[0].mobileOverride!.x).toBe(0);
    expect(result[0].mobileOverride!.y).toBe(5);
  });
});
