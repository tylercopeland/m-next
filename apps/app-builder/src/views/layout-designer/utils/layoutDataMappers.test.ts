/* eslint-disable @typescript-eslint/no-explicit-any */
import { WIDGETS } from '@m-next/runtime-interface';
import { CurrentState } from '@m-next/types';
import {
  mapLayoutToComponents,
  mapControlsToComponents,
  buildNestedLookup,
  mapLayoutV4ToComponents,
  Layout,
  Controls,
} from './layoutDataMappers';

// ---------------------------------------------------------------------------
// mapLayoutToComponents
// ---------------------------------------------------------------------------

describe('mapLayoutToComponents', () => {
  it('returns empty array for undefined layout', () => {
    expect(mapLayoutToComponents(undefined)).toEqual([]);
  });

  it('returns empty array for layout with no entries', () => {
    expect(mapLayoutToComponents({ entries: [] })).toEqual([]);
  });

  it('maps layout entries to ResponsiveComponent format', () => {
    const layout: Layout = {
      entries: [
        { controlId: 'ctrl-1', type: 'button', size: 4, content: 'Save' },
        { controlId: 'ctrl-2', type: 'textbox', size: 3, content: 'Name' },
      ],
    };
    const result = mapLayoutToComponents(layout);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('ctrl-1');
    expect(result[0].type).toBe(WIDGETS.BUTTON);
    expect(result[0].width).toBe(4);
    expect(result[0].content).toBe('Save');
    expect(result[0].currentState).toBe(CurrentState.REGULAR);
    expect(result[0].containerId).toBeNull();
  });

  it('filters out section and buttongroupitem entries', () => {
    const layout: Layout = {
      entries: [
        { controlId: 'ctrl-1', type: 'button' },
        { controlId: 'ctrl-2', type: 'section' },
        { controlId: 'ctrl-3', type: 'BGI' },
      ],
    };
    const result = mapLayoutToComponents(layout);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ctrl-1');
  });

  it('generates fallback IDs when controlId is missing', () => {
    const layout: Layout = {
      entries: [{ type: 'button' }],
    };
    const result = mapLayoutToComponents(layout);
    expect(result[0].id).toBe('component-0');
  });
});

// ---------------------------------------------------------------------------
// mapControlsToComponents
// ---------------------------------------------------------------------------

describe('mapControlsToComponents', () => {
  const makeControls = (overrides: Partial<Controls[string]>[] = []): Controls => {
    const base: Controls = {
      'c1': { id: 'c1', type: 'button', caption: 'Save', name: 'btnSave', x: 0, y: 0, width: 4, height: 2 },
      'c2': { id: 'c2', type: 'textbox', caption: 'Name', name: 'txtName', x: 4, y: 0, width: 6, height: 1 },
    };
    overrides.forEach((o, i) => {
      const key = `c${i + 1}`;
      base[key] = { ...base[key], ...o };
    });
    return base;
  };

  it('returns empty array for undefined controls', () => {
    expect(mapControlsToComponents(undefined)).toEqual([]);
  });

  it('returns empty array for empty controls', () => {
    expect(mapControlsToComponents({})).toEqual([]);
  });

  it('maps controls to ResponsiveComponent format with saved positions', () => {
    const controls = makeControls();
    const result = mapControlsToComponents(controls);

    expect(result).toHaveLength(2);
    const btn = result.find(r => r.id === 'c1')!;
    expect(btn.type).toBe(WIDGETS.BUTTON);
    expect(btn.x).toBe(0);
    expect(btn.y).toBe(0);
    expect(btn.width).toBe(4);
    expect(btn.height).toBe(2);
  });

  it('filters out section and buttongroupitem controls', () => {
    const controls: Controls = {
      c1: { id: 'c1', type: 'button' },
      c2: { id: 'c2', type: 'SEC' },
      c3: { id: 'c3', type: 'BGI' },
    };
    const result = mapControlsToComponents(controls);
    expect(result).toHaveLength(1);
  });

  it('respects typeOverride via shouldRenderItem/mapToWidgetType', () => {
    const controls: Controls = {
      c1: { id: 'c1', type: 'TXT', typeOverride: 'HTM', caption: 'Editor' },
    };
    const result = mapControlsToComponents(controls);
    expect(result[0].type).toBe(WIDGETS.HTMLEDITOR);
  });

  it('filters out nested components when includeNestedComponents is false', () => {
    const controls: Controls = {
      c1: { id: 'c1', type: 'button' },
      c2: { id: 'c2', type: 'textbox', containerId: 'container-1' },
    };
    const result = mapControlsToComponents(controls, false);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c1');
  });

  it('includes nested components when includeNestedComponents is true', () => {
    const controls: Controls = {
      c1: { id: 'c1', type: 'button' },
      c2: { id: 'c2', type: 'textbox', containerId: 'container-1' },
    };
    const result = mapControlsToComponents(controls, true);
    expect(result).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// buildNestedLookup
// ---------------------------------------------------------------------------

describe('buildNestedLookup', () => {
  it('returns empty map for empty items', () => {
    const result = buildNestedLookup([]);
    expect(result.size).toBe(0);
  });

  it('indexes flat items by id', () => {
    const items = [
      { id: 'a', x: 0, y: 0, width: 4, height: 2, content: [] },
      { id: 'b', x: 4, y: 0, width: 4, height: 2, content: [] },
    ] as any;
    const result = buildNestedLookup(items);
    expect(result.size).toBe(2);
    expect(result.get('a')!.id).toBe('a');
    expect(result.get('b')!.id).toBe('b');
  });

  it('recursively indexes nested items', () => {
    const items = [
      {
        id: 'parent',
        x: 0, y: 0, width: 12, height: 4,
        content: [
          { id: 'child1', x: 0, y: 0, width: 6, height: 2, content: [] },
          { id: 'child2', x: 6, y: 0, width: 6, height: 2, content: [] },
        ],
      },
    ] as any;
    const result = buildNestedLookup(items);
    expect(result.size).toBe(3);
    expect(result.has('parent')).toBe(true);
    expect(result.has('child1')).toBe(true);
    expect(result.has('child2')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// mapLayoutV4ToComponents
// ---------------------------------------------------------------------------

describe('mapLayoutV4ToComponents', () => {
  it('returns empty array for undefined layoutCanvas', () => {
    expect(mapLayoutV4ToComponents(undefined)).toEqual([]);
  });

  it('returns empty array for layoutCanvas with empty content', () => {
    const layoutCanvas = { canvasId: 'c1', type: 'desktop', size: 12, versionId: 'v1', content: [] } as any;
    expect(mapLayoutV4ToComponents(layoutCanvas)).toEqual([]);
  });

  it('maps V4 layout items to ResponsiveComponent format', () => {
    const layoutCanvas = {
      canvasId: 'c1',
      type: 'desktop',
      size: 12,
      versionId: 'v1',
      content: [
        {
          id: 'ctrl-1',
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          currentState: CurrentState.REGULAR,
          desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
          content: [],
        },
      ],
    } as any;

    const controls: Controls = {
      'ctrl-1': { id: 'ctrl-1', type: 'BTN', caption: 'Click me', name: 'btnClick' },
    };

    const result = mapLayoutV4ToComponents(layoutCanvas, controls, 'desktop');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ctrl-1');
    expect(result[0].type).toBe(WIDGETS.BUTTON);
    expect(result[0].name).toBe('btnClick');
  });

  it('uses canvasComponents containerId over reduxControls', () => {
    const layoutCanvas = {
      canvasId: 'c1', type: 'desktop', size: 12, versionId: 'v1',
      content: [
        {
          id: 'ctrl-1', x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR,
          desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
          content: [],
        },
      ],
    } as any;

    const controls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN' } };
    const reduxControls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN', containerId: 'old-container' } };
    const canvasComponents = [
      { id: 'ctrl-1', type: WIDGETS.BUTTON, x: 0, y: 0, width: 4, height: 2, containerId: 'new-container', static: false },
    ] as any;

    const result = mapLayoutV4ToComponents(layoutCanvas, controls, 'desktop', reduxControls, canvasComponents);
    expect(result[0].containerId).toBe('new-container');
  });

  it('falls back to reduxControls containerId when canvasComponents lacks the component', () => {
    const layoutCanvas = {
      canvasId: 'c1', type: 'desktop', size: 12, versionId: 'v1',
      content: [
        {
          id: 'ctrl-1', x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR,
          desktop: { x: 0, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
          content: [],
        },
      ],
    } as any;

    const controls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN' } };
    const reduxControls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN', containerId: 'redux-container' } };

    const result = mapLayoutV4ToComponents(layoutCanvas, controls, 'desktop', reduxControls, []);
    expect(result[0].containerId).toBe('redux-container');
  });

  it('reflows positions when falling back to desktop on tablet (no naive clamping)', () => {
    // A single component at x=10, w=4 in a 12-col desktop layout.
    // Old behaviour: naive clamp → x=4, w=4.
    // New behaviour: whole-layout reflow → single item in its row is left-packed
    // (x=0) and width scaled proportionally (round(4*8/12)=3).
    const layoutCanvas = {
      canvasId: 'c1', type: 'desktop', size: 12, versionId: 'v1',
      content: [
        {
          id: 'ctrl-1', x: 10, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR,
          desktop: { x: 10, y: 0, width: 4, height: 2, currentState: CurrentState.REGULAR },
          // no tabletOverride — falls back to reflow of desktop positions
          content: [],
        },
      ],
    } as any;

    const controls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN' } };
    const result = mapLayoutV4ToComponents(layoutCanvas, controls, 'tablet', undefined, undefined, 8);

    // Reflow: single item → left-packed at x=0, width proportionally scaled
    expect(result[0].x).toBe(0);
    expect(result[0].width).toBe(3); // round(4*8/12) = round(2.67) = 3
    // Must not overflow the 8-col grid
    expect(result[0].x + result[0].width).toBeLessThanOrEqual(8);
  });

  it('uses tablet override positions when available', () => {
    const layoutCanvas = {
      canvasId: 'c1', type: 'desktop', size: 12, versionId: 'v1',
      content: [
        {
          id: 'ctrl-1', x: 0, y: 0, width: 6, height: 2, currentState: CurrentState.REGULAR,
          desktop: { x: 0, y: 0, width: 6, height: 2, currentState: CurrentState.REGULAR },
          tabletOverride: { x: 1, y: 2, width: 4, height: 3, currentState: CurrentState.REGULAR },
          content: [],
        },
      ],
    } as any;

    const controls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN' } };
    const result = mapLayoutV4ToComponents(layoutCanvas, controls, 'tablet', undefined, undefined, 8);

    expect(result[0].x).toBe(1);
    expect(result[0].y).toBe(2);
    expect(result[0].width).toBe(4);
    expect(result[0].height).toBe(3);
  });

  it('builds responsive overrides from nested structure', () => {
    const layoutCanvas = {
      canvasId: 'c1', type: 'desktop', size: 12, versionId: 'v1',
      content: [
        {
          id: 'ctrl-1', x: 0, y: 0, width: 6, height: 2, currentState: CurrentState.REGULAR,
          desktop: { x: 0, y: 0, width: 6, height: 2, currentState: CurrentState.REGULAR },
          tabletOverride: { x: 0, y: 0, width: 8, height: 2, currentState: CurrentState.REGULAR },
          mobileOverride: { x: 0, y: 0, width: 4, height: 3, currentState: CurrentState.REGULAR },
          content: [],
        },
      ],
    } as any;

    const controls: Controls = { 'ctrl-1': { id: 'ctrl-1', type: 'BTN', caption: 'Test' } };
    const result = mapLayoutV4ToComponents(layoutCanvas, controls, 'desktop');

    expect(result[0].responsive).toBeDefined();
    expect(result[0].responsive!.desktop).toBeDefined();
    expect(result[0].responsive!.tabletOverride).toBeDefined();
    expect(result[0].responsive!.mobileOverride).toBeDefined();
    expect(result[0].responsive!.tabletOverride!.width).toBe(8);
    expect(result[0].responsive!.mobileOverride!.width).toBe(4);
  });
});
