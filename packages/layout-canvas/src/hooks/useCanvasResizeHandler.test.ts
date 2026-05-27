import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasResizeHandler } from './useCanvasResizeHandler';
import { ContainerManager } from '../containers/utils/ContainerManager';

// Mock ContainerManager
jest.mock('../containers/utils/ContainerManager', () => ({
  ContainerManager: {
    isContainer: jest.fn(),
  },
}));

// Mock verticalPushCalculator
jest.mock('../utils/verticalPushCalculator', () => ({
  calculateResizePush: jest.fn(() => ({ layout: [], hasPushed: false, iterations: 0 })),
  componentsToLayoutItems: jest.fn((comps: any[]) =>
    comps.map((c: any) => ({ i: c.id, x: c.x, y: c.y, w: c.width, h: c.height })),
  ),
}));

// Mock structureConverters
jest.mock('../utils/structureConverters', () => ({
  buildNestedStructureWithResponsive: jest.fn(() => []),
}));

// Mock registryUtils
jest.mock('../registry/registryUtils', () => ({
  getDisplayRestrictionsFromRegistry: jest.fn(() => null),
}));

const mockLayout = [] as any[];
const mockPlaceholder = {} as any;
const mockEvent = { clientX: 100, clientY: 100, target: { closest: jest.fn(() => null) } } as any;

function mockElement(): HTMLElement {
  const el = document.createElement('div');
  return el;
}

// Default params for the expanded hook interface
function defaultParams(overrides: Partial<Parameters<typeof useCanvasResizeHandler>[0]> = {}) {
  return {
    components: [] as any[],
    onComponentsChange: jest.fn(),
    setCurrentlyResizingComponentId: jest.fn(),
    isResizingContainerRef: { current: false },
    onLayoutV4Change: null,
    resolution: 'desktop',
    cols: 12,
    width: 960,
    rowHeight: 32,
    skipNextLayoutChangeRef: { current: false },
    currentlyResizingComponentId: null,
    reverseMapFn: null,
    ...overrides,
  };
}

// Helper to simulate handleResizeMouseMove via document mousemove
function fireMoveEvent(clientX: number, clientY: number) {
  const event = new MouseEvent('mousemove', { clientX, clientY, bubbles: true });
  document.dispatchEvent(event);
}

// Helper to build a handle element whose className satisfies the regex
function makeHandleElement(direction: string): HTMLElement {
  const el = document.createElement('div');
  el.className = `react-resizable-handle react-resizable-handle-${direction}`;
  // closest() checks the element and its ancestors — make the event target BE the handle
  return el;
}

describe('useCanvasResizeHandler', () => {
  beforeEach(() => {
    (ContainerManager.isContainer as jest.Mock).mockReturnValue(false);
  });

  it('handleResizeStart sets currentlyResizingComponentId', () => {
    const setCurrentlyResizingComponentId = jest.fn();

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'comp-1', type: 'BTN', x: 0, y: 0, width: 4, height: 2 }] as any[],
          setCurrentlyResizingComponentId,
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStart(
        mockLayout,
        {} as any,
        { i: 'comp-1', x: 0, y: 0, w: 4, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(setCurrentlyResizingComponentId).toHaveBeenCalledWith('comp-1');
  });

  it('handleResizeStart sets isResizingContainerRef for container components', () => {
    (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);
    const ref = { current: false };

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'cont-1', type: 'L-CON', x: 0, y: 0, width: 8, height: 6 }] as any[],
          isResizingContainerRef: ref,
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStart(
        mockLayout,
        {} as any,
        { i: 'cont-1', x: 0, y: 0, w: 8, h: 6 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(ref.current).toBe(true);
  });

  it('handleResizeStart does NOT set isResizingContainerRef for non-containers', () => {
    (ContainerManager.isContainer as jest.Mock).mockReturnValue(false);
    const ref = { current: false };

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'comp-1', type: 'BTN', x: 0, y: 0, width: 4, height: 2 }] as any[],
          isResizingContainerRef: ref,
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStart(
        mockLayout,
        {} as any,
        { i: 'comp-1', x: 0, y: 0, w: 4, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(ref.current).toBe(false);
  });

  it('handleResizeStop clears currentlyResizingComponentId', () => {
    const setCurrentlyResizingComponentId = jest.fn();

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'comp-1', type: 'BTN', x: 0, y: 0, width: 4, height: 2 }] as any[],
          setCurrentlyResizingComponentId,
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'comp-1', x: 0, y: 0, w: 4, h: 2 } as any,
        { i: 'comp-1', x: 0, y: 0, w: 6, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(setCurrentlyResizingComponentId).toHaveBeenCalledWith(null);
  });

  it('handleResizeStop clears isResizingContainerRef even on error', () => {
    const ref = { current: true };

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [], // Empty — will cause resizedComponent to be undefined
          isResizingContainerRef: ref,
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'nonexistent', x: 0, y: 0, w: 4, h: 2 } as any,
        { i: 'nonexistent', x: 0, y: 0, w: 6, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(ref.current).toBe(false);
  });

  it('handleResizeStop scales child x/width proportionally when container width changes', () => {
    (ContainerManager.isContainer as jest.Mock).mockImplementation((comp: any) => comp.type === 'L-CON');
    const onComponentsChange = jest.fn();

    const components = [
      { id: 'cont-1', type: 'L-CON', x: 0, y: 0, width: 8, height: 6 },
      { id: 'child-1', type: 'BTN', x: 2, y: 0, width: 4, height: 2, containerId: 'cont-1' },
    ] as any[];

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components,
          onComponentsChange,
          isResizingContainerRef: { current: true },
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'cont-1', x: 0, y: 0, w: 8, h: 6 } as any, // old
        { i: 'cont-1', x: 0, y: 0, w: 12, h: 6 } as any, // new (grew from 8 to 12)
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(onComponentsChange).toHaveBeenCalled();
    const updated = onComponentsChange.mock.calls[0][0];
    const child = updated.find((c: any) => c.id === 'child-1');
    // Scale factor: 12/8 = 1.5
    // x: round(2 * 1.5) = 3, width: round(4 * 1.5) = 6
    expect(child.x).toBe(3);
    expect(child.width).toBe(6);
  });

  it('handleResizeStop updates container dimensions when only height changes', () => {
    (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);
    const onComponentsChange = jest.fn();

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'cont-1', type: 'L-CON', x: 0, y: 0, width: 8, height: 6 }] as any[],
          onComponentsChange,
          isResizingContainerRef: { current: true },
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'cont-1', x: 0, y: 0, w: 8, h: 6 } as any,
        { i: 'cont-1', x: 0, y: 0, w: 8, h: 8 } as any, // only height changed
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    // Now the hook updates container dimensions even for height-only changes
    expect(onComponentsChange).toHaveBeenCalled();
    const updated = onComponentsChange.mock.calls[0][0];
    const container = updated.find((c: any) => c.id === 'cont-1');
    expect(container.height).toBe(8);
  });

  it('handleResizeStop removes rgl-resizing class from element', () => {
    const el = mockElement();
    el.classList.add('rgl-resizing');

    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'comp-1', type: 'BTN', x: 0, y: 0, width: 4, height: 2 }] as any[],
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'comp-1', x: 0, y: 0, w: 4, h: 2 } as any,
        { i: 'comp-1', x: 0, y: 0, w: 6, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        el,
      );
    });

    expect(el.classList.contains('rgl-resizing')).toBe(false);
  });

  it('handleResizeStop marks userResizedComponentIdRef after resize', () => {
    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'comp-1', type: 'BTN', x: 0, y: 0, width: 4, height: 2 }] as any[],
        }),
      ),
    );

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'comp-1', x: 0, y: 0, w: 4, h: 2 } as any,
        { i: 'comp-1', x: 0, y: 0, w: 6, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(result.current.userResizedComponentIdRef.current).toBe('comp-1');
  });

  it('handleResizeStop clears resizeTracking in finally block', () => {
    const { result } = renderHook(() =>
      useCanvasResizeHandler(
        defaultParams({
          components: [{ id: 'comp-1', type: 'BTN', x: 0, y: 0, width: 4, height: 2 }] as any[],
        }),
      ),
    );

    // Pre-populate resize tracking
    result.current.resizeTrackingRef.current.startMouseY = 100;
    result.current.resizeTrackingRef.current.startHeight = 2;

    act(() => {
      result.current.handleResizeStop(
        mockLayout,
        { i: 'comp-1', x: 0, y: 0, w: 4, h: 2 } as any,
        { i: 'comp-1', x: 0, y: 0, w: 6, h: 2 } as any,
        mockPlaceholder,
        mockEvent,
        mockElement(),
      );
    });

    expect(result.current.resizeTrackingRef.current.startMouseY).toBeNull();
    expect(result.current.resizeTrackingRef.current.startHeight).toBeNull();
  });

  // ============================================================================
  // NCNG-571: Canvas boundary clamping for horizontal resize handles
  // ============================================================================
  describe('canvas boundary clamping (NCNG-571)', () => {
    // Canvas: 12 cols × 960px wide → 80px per column.
    // Component: x=5, w=2 (occupies columns 6-7 in 1-based terms).
    // startMouseX = 500 (arbitrary reference point).
    const COLS = 12;
    const WIDTH = 960; // 80px per col
    const COL_W = WIDTH / COLS; // 80
    const START_MOUSE_X = 500;
    const START_X = 5; // component left edge (0-indexed)
    const START_W = 2; // component width in cols

    function setupHookForMoveTest(direction: string) {
      const handleElement = makeHandleElement(direction);
      // mockEvent with target.closest returning our handle element
      const startEvent = {
        clientX: START_MOUSE_X,
        clientY: 100,
        target: { closest: jest.fn(() => handleElement) },
      } as any;

      const components = [{ id: 'comp-1', type: 'TXT', x: START_X, y: 0, width: START_W, height: 1 }] as any[];

      const params = defaultParams({ components, cols: COLS, width: WIDTH });
      const { result, rerender } = renderHook((p: any) => useCanvasResizeHandler(p), {
        initialProps: params,
      });

      // Trigger handleResizeStart to populate resize tracking state
      act(() => {
        result.current.handleResizeStart(
          mockLayout,
          {} as any,
          { i: 'comp-1', x: START_X, y: 0, w: START_W, h: 1 } as any,
          mockPlaceholder,
          startEvent,
          mockElement(),
        );
      });

      // Re-render with currentlyResizingComponentId set so the useEffect registers the listener
      rerender({ ...params, currentlyResizingComponentId: 'comp-1' });

      return { result };
    }

    it('east handle dragged far past right canvas edge clamps intendedWidth to (cols - startX)', () => {
      // Component at x=5, w=2 → max east width = 12 - 5 = 7
      // Drag 900px to the right (11.25 cols) — far past the right edge
      const { result } = setupHookForMoveTest('e');

      act(() => {
        fireMoveEvent(START_MOUSE_X + 900, 100); // huge rightward drag
      });

      // Should be clamped to cols - startX = 12 - 5 = 7, not 12
      expect(result.current.resizeTrackingRef.current.intendedWidth).toBe(7);
    });

    it('east handle dragged normally (within bounds) is not affected by boundary clamp', () => {
      // Component at x=5, w=2. Drag 1 col to the right → w=3 (within bounds).
      const { result } = setupHookForMoveTest('e');

      act(() => {
        fireMoveEvent(START_MOUSE_X + COL_W, 100); // one col rightward
      });

      expect(result.current.resizeTrackingRef.current.intendedWidth).toBe(3);
    });

    it('west handle dragged far past left canvas edge clamps intendedWidth to (startX + startWidth)', () => {
      // Component at x=5, w=2 → max west width = 5 + 2 = 7 (reaching left edge x=0)
      // Drag 900px to the left (11.25 cols) — far past the left edge
      const { result } = setupHookForMoveTest('w');

      act(() => {
        fireMoveEvent(START_MOUSE_X - 900, 100); // huge leftward drag
      });

      // Should be clamped to startX + startWidth = 5 + 2 = 7, not 12
      expect(result.current.resizeTrackingRef.current.intendedWidth).toBe(7);
    });

    it('west handle dragged normally (within bounds) is not affected by boundary clamp', () => {
      // Component at x=5, w=2. Drag 1 col to the left → w=3 (within bounds).
      const { result } = setupHookForMoveTest('w');

      act(() => {
        fireMoveEvent(START_MOUSE_X - COL_W, 100); // one col leftward
      });

      expect(result.current.resizeTrackingRef.current.intendedWidth).toBe(3);
    });

    it('east handle at right edge of canvas: intendedWidth stays at current width', () => {
      // Component already at right edge: x=10, w=2 → right edge = 12.
      // Any eastward drag should yield intendedWidth = cols - startX = 12 - 10 = 2.
      const handleElement = makeHandleElement('e');
      const startEvent = {
        clientX: START_MOUSE_X,
        clientY: 100,
        target: { closest: jest.fn(() => handleElement) },
      } as any;
      const components = [{ id: 'edge-comp', type: 'TXT', x: 10, y: 0, width: 2, height: 1 }] as any[];
      const params = defaultParams({ components, cols: COLS, width: WIDTH });
      const { result, rerender } = renderHook((p: any) => useCanvasResizeHandler(p), {
        initialProps: params,
      });

      act(() => {
        result.current.handleResizeStart(
          mockLayout,
          {} as any,
          { i: 'edge-comp', x: 10, y: 0, w: 2, h: 1 } as any,
          mockPlaceholder,
          startEvent,
          mockElement(),
        );
      });
      rerender({ ...params, currentlyResizingComponentId: 'edge-comp' });

      act(() => {
        fireMoveEvent(START_MOUSE_X + 500, 100); // drag right
      });

      // max = cols - startX = 12 - 10 = 2, component already fills to edge
      expect(result.current.resizeTrackingRef.current.intendedWidth).toBe(2);
    });

    it('west handle at left edge of canvas: intendedWidth stays at current width', () => {
      // Component at left edge: x=0, w=3. Any leftward drag → max = 0 + 3 = 3.
      const handleElement = makeHandleElement('w');
      const startEvent = {
        clientX: START_MOUSE_X,
        clientY: 100,
        target: { closest: jest.fn(() => handleElement) },
      } as any;
      const components = [{ id: 'left-comp', type: 'TXT', x: 0, y: 0, width: 3, height: 1 }] as any[];
      const params = defaultParams({ components, cols: COLS, width: WIDTH });
      const { result, rerender } = renderHook((p: any) => useCanvasResizeHandler(p), {
        initialProps: params,
      });

      act(() => {
        result.current.handleResizeStart(
          mockLayout,
          {} as any,
          { i: 'left-comp', x: 0, y: 0, w: 3, h: 1 } as any,
          mockPlaceholder,
          startEvent,
          mockElement(),
        );
      });
      rerender({ ...params, currentlyResizingComponentId: 'left-comp' });

      act(() => {
        fireMoveEvent(START_MOUSE_X - 500, 100); // drag left
      });

      // max = startX + startWidth = 0 + 3 = 3
      expect(result.current.resizeTrackingRef.current.intendedWidth).toBe(3);
    });

    it('handleResizeStop with east handle off canvas does not shift left edge (x unchanged)', () => {
      // Component at x=5, w=2. East handle dragged so intendedWidth=7 (canvas edge).
      // After stop, x should remain 5 (only right side expanded).
      (ContainerManager.isContainer as jest.Mock).mockReturnValue(false);
      const onComponentsChange = jest.fn();

      const components = [{ id: 'comp-east', type: 'TXT', x: 5, y: 0, width: 2, height: 1 }] as any[];
      const params = defaultParams({ components, cols: COLS, width: WIDTH, onComponentsChange });
      const { result } = renderHook(() => useCanvasResizeHandler(params));

      // Simulate resize tracking: east handle dragged past edge → intendedWidth=7
      result.current.resizeTrackingRef.current.startMouseX = START_MOUSE_X;
      result.current.resizeTrackingRef.current.startWidth = 2;
      result.current.resizeTrackingRef.current.startX = 5;
      result.current.resizeTrackingRef.current.startY = 0;
      result.current.resizeTrackingRef.current.startHeight = 1;
      result.current.resizeTrackingRef.current.intendedHeight = 1;
      result.current.resizeTrackingRef.current.intendedWidth = 7; // clamped to cols - startX
      result.current.resizeTrackingRef.current.handleDirection = 'e';

      act(() => {
        result.current.handleResizeStop(
          mockLayout,
          { i: 'comp-east', x: 5, y: 0, w: 2, h: 1 } as any, // old
          { i: 'comp-east', x: 5, y: 0, w: 4, h: 1 } as any, // RGL allowed partial (4 cols)
          mockPlaceholder,
          mockEvent,
          mockElement(),
        );
      });

      expect(onComponentsChange).toHaveBeenCalled();
      const updated = onComponentsChange.mock.calls[0][0];
      const comp = updated.find((c: any) => c.id === 'comp-east');
      // Left edge must be unchanged at x=5
      expect(comp.x).toBe(5);
      // Width should be the intended 7 (pushed past RGL's partial 4)
      expect(comp.width).toBe(7);
    });

    it('container east handle off canvas does not shift left edge (x unchanged)', () => {
      // Same scenario for a container
      (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);
      const onComponentsChange = jest.fn();

      const components = [{ id: 'cont-east', type: 'L-CON', x: 5, y: 0, width: 2, height: 3 }] as any[];
      const params = defaultParams({ components, cols: COLS, width: WIDTH, onComponentsChange });
      const { result } = renderHook(() => useCanvasResizeHandler(params));

      result.current.resizeTrackingRef.current.startMouseX = START_MOUSE_X;
      result.current.resizeTrackingRef.current.startWidth = 2;
      result.current.resizeTrackingRef.current.startX = 5;
      result.current.resizeTrackingRef.current.startY = 0;
      result.current.resizeTrackingRef.current.startHeight = 3;
      result.current.resizeTrackingRef.current.intendedHeight = 3;
      result.current.resizeTrackingRef.current.intendedWidth = 7;
      result.current.resizeTrackingRef.current.handleDirection = 'e';

      act(() => {
        result.current.handleResizeStop(
          mockLayout,
          { i: 'cont-east', x: 5, y: 0, w: 2, h: 3 } as any,
          { i: 'cont-east', x: 5, y: 0, w: 4, h: 3 } as any,
          mockPlaceholder,
          mockEvent,
          mockElement(),
        );
      });

      expect(onComponentsChange).toHaveBeenCalled();
      const updated = onComponentsChange.mock.calls[0][0];
      const cont = updated.find((c: any) => c.id === 'cont-east');
      expect(cont.x).toBe(5);
      expect(cont.width).toBe(7);
    });
  });
});
