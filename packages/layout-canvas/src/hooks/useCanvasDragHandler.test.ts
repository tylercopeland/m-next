import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasDragHandler, UseCanvasDragHandlerParams } from './useCanvasDragHandler';
import { ContainerManager } from '../containers/utils/ContainerManager';
import { ResponsiveComponent } from '../rgl-integration/types';
import { ContainerDropTarget } from '../containers/ContainerTypes';
import { LayoutCanvas } from '../utils/structureConverters';
import { Layout } from 'react-grid-layout';
import { detectInsertPosition } from '../utils/insertDetection';
import { calculateInsertPush } from '../utils/insertPushCalculator';

// Mock ContainerManager
jest.mock('../containers/utils/ContainerManager', () => ({
  ContainerManager: {
    isContainer: jest.fn(),
    validateContainerDrop: jest.fn(),
  },
}));

// Mock buildNestedStructureWithResponsive
jest.mock('../utils/structureConverters', () => ({
  buildNestedStructureWithResponsive: jest.fn(() => []),
}));

// Mock insertDetection
jest.mock('../utils/insertDetection', () => ({
  detectInsertPosition: jest.fn(() => ({
    row: 0,
    col: 0,
    wouldCausePush: false,
    indicatorY: 0,
    indicatorX: 0,
    componentsToPush: [],
  })),
  calculateInsertIndicator: jest.fn(() => ({
    isActive: true,
    indicatorX: 8,
    indicatorY: 8,
    indicatorWidth: 100,
    targetRow: 0,
    targetCol: 0,
  })),
}));

// Mock insertPushCalculator
jest.mock('../utils/insertPushCalculator', () => ({
  calculateInsertPush: jest.fn(() => ({
    layout: [],
    pushedCount: 0,
  })),
}));

// Mock verticalPushCalculator
jest.mock('../utils/verticalPushCalculator', () => ({
  calculateResizePush: jest.fn(() => ({
    layout: [],
    pushedCount: 0,
  })),
}));

function createMockElement(): HTMLElement {
  const el = document.createElement('div');
  el.classList.add('react-grid-item');
  const parent = document.createElement('div');
  parent.classList.add('react-grid-layout');
  const grandparent = document.createElement('div');
  grandparent.appendChild(parent);
  parent.appendChild(el);
  return el;
}

function createMockLayout(overrides: Partial<Layout> = {}): Layout {
  return { i: 'comp-1', x: 0, y: 0, w: 2, h: 2, ...overrides } as Layout;
}

function createMockComponent(overrides: Partial<ResponsiveComponent> = {}): ResponsiveComponent {
  return {
    id: 'comp-1',
    type: 'BTN',
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    containerId: null,
    ...overrides,
  } as ResponsiveComponent;
}

function createDefaultParams(overrides: Omit<Partial<UseCanvasDragHandlerParams>, 'detectDropTarget'> = {}) {
  const detectDropTarget = jest.fn((): ContainerDropTarget => ({ type: 'canvas', validDrop: true }));
  return {
    components: [createMockComponent()],
    selectedComponentId: null as string | null,
    draggedComponentId: null as string | null,
    dragOverContainerId: null as string | null,
    setActiveDragComponentId: jest.fn(),
    setCurrentDraggedComponent: jest.fn(),
    setDraggedComponentId: jest.fn(),
    setInvalidDropTargetId: jest.fn(),
    setDragOverContainerId: jest.fn(),
    clearAllDragStates: jest.fn(),
    isFirstDragOverRef: { current: true },
    onComponentsChange: jest.fn() as ((comps: ResponsiveComponent[]) => void) | null,
    onComponentClick: jest.fn() as ((id: string) => void) | null,
    onLayoutV4Change: jest.fn() as ((layout: LayoutCanvas) => void) | null,
    resolution: 'desktop' as string,
    rowHeight: 30,
    detectDropTarget,
    skipNextLayoutChangeRef: { current: false },
    layoutChangeTimeoutRef: { current: null } as { current: ReturnType<typeof setTimeout> | null },
    insertModeStateRef: {
      current: {
        isActive: false,
        indicatorX: 0,
        indicatorY: 0,
        indicatorWidth: 0,
        targetRow: 0,
        targetCol: 0,
      },
    },
    setInsertMode: jest.fn(),
    clearInsertMode: jest.fn(),
    cols: 12,
    colWidth: 50,
    reverseMapFn: null,
    presentedComponentsRef: { current: [] },
    ...overrides,
  };
}

describe('useCanvasDragHandler', () => {
  const mockLayout: Layout[] = [];
  const mockPlaceholder = createMockLayout();

  beforeEach(() => {
    jest.clearAllMocks();
    (ContainerManager.isContainer as jest.Mock).mockReturnValue(false);
    (ContainerManager.validateContainerDrop as jest.Mock).mockReturnValue({
      isValid: true,
      reason: undefined,
    });
    document.body.classList.remove('canvas-drag-in-progress');
    // @ts-expect-error - test setup
    delete (window as Record<string, unknown>).__rglCrossGridTargetType;
    // @ts-expect-error - test setup
    delete (window as Record<string, unknown>).__rglCrossGridTargetContainerId;
    // @ts-expect-error - test setup
    delete (window as Record<string, unknown>).__rglCrossGridDragSize;
  });

  describe('handleDragStart', () => {
    it('sets activeDragComponentId', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      act(() => {
        result.current.handleDragStart(
          mockLayout,
          createMockLayout(),
          createMockLayout({ i: 'comp-1' }),
          mockPlaceholder,
          new MouseEvent('mousedown') as unknown as MouseEvent,
          element,
        );
      });

      expect(params.setActiveDragComponentId).toHaveBeenCalledWith('comp-1');
    });

    it('adds drag CSS classes to element', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      act(() => {
        result.current.handleDragStart(
          mockLayout,
          createMockLayout(),
          createMockLayout({ i: 'comp-1' }),
          mockPlaceholder,
          new MouseEvent('mousedown') as unknown as MouseEvent,
          element,
        );
      });

      expect(element.classList.contains('is-being-dragged')).toBe(true);
      expect(element.classList.contains('rgl-dragging')).toBe(true);
      expect(element.classList.contains('selected-item')).toBe(true);
    });

    it('does not track currentDraggedComponent on mousedown before movement', () => {
      const comp = createMockComponent({ id: 'comp-1' });
      const params = createDefaultParams({ components: [comp] });
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      act(() => {
        result.current.handleDragStart(
          mockLayout,
          createMockLayout({ i: 'comp-1' }),
          createMockLayout({ i: 'comp-1' }),
          mockPlaceholder,
          new MouseEvent('mousedown') as unknown as MouseEvent,
          element,
        );
      });

      expect(params.setCurrentDraggedComponent).not.toHaveBeenCalled();
    });

    it('clears pending debounced layout timeout from previous drag', () => {
      const timeoutId = setTimeout(() => {}, 10000);
      const params = createDefaultParams({
        layoutChangeTimeoutRef: { current: timeoutId },
      });
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      act(() => {
        result.current.handleDragStart(
          mockLayout,
          createMockLayout(),
          createMockLayout({ i: 'comp-1' }),
          mockPlaceholder,
          new MouseEvent('mousedown') as unknown as MouseEvent,
          element,
        );
      });

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
      expect(params.layoutChangeTimeoutRef.current).toBeNull();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('handleDrag', () => {
    it('sets draggedComponentId on first movement', () => {
      const comp = createMockComponent({ id: 'comp-1' });
      const params = createDefaultParams({ draggedComponentId: null, components: [comp] });
      const { result } = renderHook(() => useCanvasDragHandler(params));

      // Mock elementsFromPoint to return empty array (no container)
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDrag(
          mockLayout,
          createMockLayout(),
          createMockLayout({ i: 'comp-1' }),
          mockPlaceholder,
          new MouseEvent('mousemove', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          createMockElement(),
        );
      });

      expect(params.setDraggedComponentId).toHaveBeenCalledWith('comp-1');
      expect(params.setCurrentDraggedComponent).toHaveBeenCalledWith(comp);
    });

    it('detects container hover via coordinate hit test', () => {
      // Container at x=0,y=0 width=4,height=4 — with colWidth=50/rowHeight=30,
      // its canvas bounds are [8..208] x [8..128], so clientX=100, clientY=100 hits it.
      const containerComp = createMockComponent({ id: 'container-1', type: 'L-CON', x: 0, y: 0, width: 4, height: 4 });
      const draggingComp = createMockComponent({ id: 'comp-1', x: 0, y: 5, width: 2, height: 2 });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((c: ResponsiveComponent) => c.type === 'L-CON');
      const params = createDefaultParams({
        draggedComponentId: 'comp-1',
        components: [containerComp, draggingComp],
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));

      // Add container wrapper to DOM so querySelector('[data-container-id]') can find it
      const containerWrapper = document.createElement('div');
      containerWrapper.classList.add('layout-container-wrapper');
      containerWrapper.setAttribute('data-container-id', 'container-1');
      document.body.appendChild(containerWrapper);

      const element = createMockElement();
      // Mock canvas width so actualCW = (616-16)/12 = 50, matching the comment above
      const rglForElement = element.closest('.react-grid-layout') as HTMLElement;
      jest.spyOn(rglForElement, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 616,
        bottom: 400,
        width: 616,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);
      try {
        // Populate rglElementRef and containerBoundsRef via handleDragStart
        act(() => {
          result.current.handleDragStart(
            mockLayout,
            createMockLayout({ i: 'comp-1' }),
            createMockLayout({ i: 'comp-1' }),
            mockPlaceholder,
            new MouseEvent('mousedown', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
            element,
          );
        });

        act(() => {
          result.current.handleDrag(
            mockLayout,
            createMockLayout(),
            createMockLayout({ i: 'comp-1' }),
            mockPlaceholder,
            new MouseEvent('mousemove', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
            element,
          );
        });
      } finally {
        document.body.removeChild(containerWrapper);
      }

      expect(params.setDragOverContainerId).toHaveBeenCalledWith('container-1');
    });

    it('does not commit container targeting when dragged body only overlaps by a seam sliver', () => {
      const onDragPreviewChange = jest.fn();
      const params = createDefaultParams({
        draggedComponentId: 'comp-1',
        dragOverContainerId: null,
        onDragPreviewChange,
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));

      const containerWrapper = document.createElement('div');
      containerWrapper.classList.add('layout-container-wrapper');
      containerWrapper.setAttribute('data-container-id', 'container-1');
      Object.defineProperty(containerWrapper, 'getBoundingClientRect', {
        configurable: true,
        value: () =>
          ({
            left: 0,
            top: 0,
            right: 200,
            bottom: 120,
            width: 200,
            height: 120,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }) as DOMRect,
      });
      document.body.appendChild(containerWrapper);
      document.elementsFromPoint = jest.fn(() => [containerWrapper]);

      const element = createMockElement();
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        left: 10,
        top: 119, // Only 1px overlap into the container
        right: 110,
        bottom: 179,
        width: 100,
        height: 60,
        x: 10,
        y: 119,
        toJSON: () => ({}),
      } as DOMRect);

      try {
        act(() => {
          result.current.handleDrag(
            mockLayout,
            createMockLayout({ i: 'comp-1' }),
            createMockLayout({ i: 'comp-1' }),
            mockPlaceholder,
            new MouseEvent('mousemove', { clientX: 30, clientY: 80 }) as unknown as MouseEvent,
            element,
          );
        });
      } finally {
        document.body.removeChild(containerWrapper);
      }

      expect(params.setDragOverContainerId).not.toHaveBeenCalledWith('container-1');
      expect(onDragPreviewChange).not.toHaveBeenCalled();
    });

    it('ignores nested-grid overflow spill outside the visible container drop zone', () => {
      const onDragPreviewChange = jest.fn();
      const params = createDefaultParams({
        draggedComponentId: 'comp-1',
        dragOverContainerId: null,
        onDragPreviewChange,
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));

      const containerWrapper = document.createElement('div');
      containerWrapper.classList.add('layout-container-wrapper');
      containerWrapper.setAttribute('data-container-id', 'container-1');
      Object.defineProperty(containerWrapper, 'getBoundingClientRect', {
        configurable: true,
        value: () =>
          ({
            left: 0,
            top: 0,
            right: 220,
            bottom: 220,
            width: 220,
            height: 220,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }) as DOMRect,
      });

      const dropZone = document.createElement('div');
      dropZone.classList.add('layout-container-drop-zone');
      Object.defineProperty(dropZone, 'getBoundingClientRect', {
        configurable: true,
        value: () =>
          ({
            left: 10,
            top: 10,
            right: 210,
            bottom: 110, // visible viewport ends here
            width: 200,
            height: 100,
            x: 10,
            y: 10,
            toJSON: () => ({}),
          }) as DOMRect,
      });

      const nestedGrid = document.createElement('div');
      nestedGrid.classList.add('react-grid-layout', 'nested-layout');
      Object.defineProperty(nestedGrid, 'getBoundingClientRect', {
        configurable: true,
        value: () =>
          ({
            left: 10,
            top: 10,
            right: 210,
            bottom: 510, // overflowing content rect (scroll spill)
            width: 200,
            height: 500,
            x: 10,
            y: 10,
            toJSON: () => ({}),
          }) as DOMRect,
      });

      containerWrapper.appendChild(dropZone);
      containerWrapper.appendChild(nestedGrid);
      document.body.appendChild(containerWrapper);
      document.elementsFromPoint = jest.fn(() => [containerWrapper]);

      const element = createMockElement();
      jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        left: 20,
        top: 130, // overlaps nestedGrid spill but NOT visible dropZone viewport
        right: 120,
        bottom: 190,
        width: 100,
        height: 60,
        x: 20,
        y: 130,
        toJSON: () => ({}),
      } as DOMRect);

      try {
        act(() => {
          result.current.handleDrag(
            mockLayout,
            createMockLayout({ i: 'comp-1' }),
            createMockLayout({ i: 'comp-1' }),
            mockPlaceholder,
            new MouseEvent('mousemove', { clientX: 60, clientY: 150 }) as unknown as MouseEvent,
            element,
          );
        });
      } finally {
        document.body.removeChild(containerWrapper);
      }

      expect(params.setDragOverContainerId).not.toHaveBeenCalledWith('container-1');
      expect(onDragPreviewChange).not.toHaveBeenCalled();
    });

    it('allows insert detection for container drags over container wrappers on main canvas', () => {
      const draggedContainer = createMockComponent({ id: 'container-1', type: 'L-CON', width: 4, height: 4 });
      const otherComp = createMockComponent({ id: 'comp-2', x: 4, y: 0, width: 2, height: 2 });
      const params = createDefaultParams({
        draggedComponentId: 'container-1',
        components: [draggedContainer, otherComp],
      });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((candidate: ResponsiveComponent) => {
        return candidate.type === 'L-CON';
      });
      const detectInsertPositionMock = detectInsertPosition as jest.Mock;
      detectInsertPositionMock.mockReturnValue({
        row: 2,
        col: 3,
        wouldCausePush: true,
        indicatorY: 60,
        indicatorX: 150,
        componentsToPush: [],
      });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      // Populate rglElementRef so insert detection can proceed
      act(() => {
        result.current.handleDragStart(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0, w: 4, h: 4 }),
          createMockLayout({ i: 'container-1', x: 0, y: 0, w: 4, h: 4 }),
          mockPlaceholder,
          new MouseEvent('mousedown', { clientX: 200, clientY: 120 }) as unknown as MouseEvent,
          element,
        );
      });

      act(() => {
        result.current.handleDrag(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0, w: 4, h: 4 }),
          createMockLayout({ i: 'container-1', x: 1, y: 1, w: 4, h: 4 }),
          mockPlaceholder,
          new MouseEvent('mousemove', { clientX: 200, clientY: 120 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(detectInsertPositionMock).toHaveBeenCalled();
      expect(params.setInsertMode).toHaveBeenCalled();
    });

    it('clears container hover when not over container', () => {
      const params = createDefaultParams({
        draggedComponentId: 'comp-1',
        dragOverContainerId: 'container-1',
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDrag(
          mockLayout,
          createMockLayout(),
          createMockLayout({ i: 'comp-1' }),
          mockPlaceholder,
          new MouseEvent('mousemove', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          createMockElement(),
        );
      });

      expect(params.setDragOverContainerId).toHaveBeenCalledWith(null);
    });

    it('preserves pointer grab offset when calculating insert detection column', () => {
      const params = createDefaultParams({
        draggedComponentId: 'comp-1',
        colWidth: 50,
        cols: 12,
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));
      document.elementsFromPoint = jest.fn(() => []);

      const rglElement = document.createElement('div');
      rglElement.classList.add('react-grid-layout');
      document.body.appendChild(rglElement);
      const element = createMockElement();
      const rglForElement = element.closest('.react-grid-layout') as HTMLElement;
      // Width 616 so that actualCW = (616-16)/12 = 50, matching colWidth prop
      jest.spyOn(rglForElement, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 616,
        bottom: 400,
        width: 616,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);

      act(() => {
        // Start drag grabbing the right column of a 2-col component (offset = 1 col).
        result.current.handleDragStart(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
          createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mousedown', { clientX: 75, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      act(() => {
        result.current.handleDrag(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 1, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mousemove', { clientX: 325, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      const detectInsertPositionMock = detectInsertPosition as jest.Mock;
      expect(detectInsertPositionMock).toHaveBeenCalled();
      const lastCall = detectInsertPositionMock.mock.calls[detectInsertPositionMock.mock.calls.length - 1];
      expect(lastCall[0]).toBe(250); // pointer col 6 - offset 1 => target col 5 => 5 * 50
      expect(lastCall[9]).toBe(317); // raw mouseX (clientX 325 - 8px canvas padding)

      document.body.removeChild(rglElement);
    });

    it('preserves pointer grab offset for cross-grid preview into containers', () => {
      const onDragPreviewChange = jest.fn();
      const draggedComp = createMockComponent({ id: 'comp-1', x: 0, y: 0, width: 2, height: 2 });
      // Use L-CON type so ContainerManager.isContainer returns true and containerBoundsRef is populated
      const targetContainer = createMockComponent({
        id: 'container-1',
        type: 'L-CON',
        x: 0,
        y: 0,
        width: 8,
        height: 8,
      });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((c: ResponsiveComponent) => c.type === 'L-CON');
      const params = createDefaultParams({
        draggedComponentId: 'comp-1',
        components: [draggedComp, targetContainer],
        colWidth: 50,
        onDragPreviewChange,
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));

      const element = createMockElement();
      const rglForElement = element.closest('.react-grid-layout') as HTMLElement;
      jest.spyOn(rglForElement, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);

      const containerWrapper = document.createElement('div');
      containerWrapper.classList.add('layout-container-wrapper');
      containerWrapper.setAttribute('data-container-id', 'container-1');
      Object.defineProperty(containerWrapper, 'getBoundingClientRect', {
        value: () =>
          ({
            left: 0,
            top: 0,
            right: 320,
            bottom: 320,
            width: 320,
            height: 320,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }) as DOMRect,
      });
      // Add to DOM so querySelector('[data-container-id="container-1"]') can find it
      document.body.appendChild(containerWrapper);

      try {
        act(() => {
          result.current.handleDragStart(
            mockLayout,
            createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
            createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
            mockPlaceholder,
            new MouseEvent('mousedown', { clientX: 75, clientY: 100 }) as unknown as MouseEvent,
            element,
          );
        });

        act(() => {
          result.current.handleDrag(
            mockLayout,
            createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
            createMockLayout({ i: 'comp-1', x: 2, y: 0, w: 2, h: 2 }),
            mockPlaceholder,
            new MouseEvent('mousemove', { clientX: 200, clientY: 80 }) as unknown as MouseEvent,
            element,
          );
        });
      } finally {
        document.body.removeChild(containerWrapper);
      }

      expect(onDragPreviewChange).toHaveBeenCalled();
      const setPreview = onDragPreviewChange.mock.calls[0][0] as (prev: any) => any;
      expect(typeof setPreview).toBe('function');
      const nextPreview = setPreview({ visible: false });
      expect(nextPreview).toEqual(
        expect.objectContaining({
          visible: true,
          targetType: 'container',
          containerId: 'container-1',
          anchorOffsetCols: 1,
          position: expect.objectContaining({ x: 4, y: 0, w: 2, h: 2 }),
        }),
      );
    });
  });

  describe('handleDragStop', () => {
    it('clears drag state variables', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.setCurrentDraggedComponent).toHaveBeenCalledWith(null);
      expect(params.setDraggedComponentId).toHaveBeenCalledWith(null);
      expect(params.setInvalidDropTargetId).toHaveBeenCalledWith(null);
      expect(params.setDragOverContainerId).toHaveBeenCalledWith(null);
      expect(params.setActiveDragComponentId).toHaveBeenCalledWith(null);
    });

    it('removes drag feedback classes from element', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      element.classList.add('is-being-dragged');
      element.classList.add('rgl-dragging');

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(element.classList.contains('is-being-dragged')).toBe(false);
      expect(element.classList.contains('rgl-dragging')).toBe(false);
    });

    it('treats same-position drag as click and calls onComponentClick', () => {
      const comp = createMockComponent({ id: 'comp-1' });
      const params = createDefaultParams({
        components: [comp],
        selectedComponentId: null,
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }), // Same position
          mockPlaceholder,
          new MouseEvent('mouseup') as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentClick).toHaveBeenCalledWith('comp-1');
    });

    it('does not treat same-position drag as click when dropping into a container', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, type: 'BTN' });
      const targetContainer = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({
        components: [comp, targetContainer],
      });
      params.detectDropTarget.mockReturnValue({
        type: 'container',
        containerId: 'container-1',
        validDrop: true,
      });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((candidate: ResponsiveComponent) => {
        return candidate.type === 'L-CON';
      });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }), // same position
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentClick).not.toHaveBeenCalled();
      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBe('container-1');
    });

    it('does NOT call onComponentClick for already-selected component', () => {
      const comp = createMockComponent({ id: 'comp-1' });
      const params = createDefaultParams({
        components: [comp],
        selectedComponentId: 'comp-1', // Already selected
      });
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }), // Same position
          mockPlaceholder,
          new MouseEvent('mouseup') as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentClick).not.toHaveBeenCalled();
    });

    it('treats container-over-container drop as canvas move (no nesting)', () => {
      const containerComp = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({ components: [containerComp] });
      (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);

      params.detectDropTarget.mockReturnValue({ type: 'container', containerId: 'other-container', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0 }),
          createMockLayout({ i: 'container-1', x: 2, y: 3 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0];
      expect(updatedComponents[0].x).toBe(2);
      expect(updatedComponents[0].y).toBe(3);
    });

    it('moves container on canvas (updates position only)', () => {
      const containerComp = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({ components: [containerComp] });
      (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0 }),
          createMockLayout({ i: 'container-1', x: 4, y: 5 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0];
      expect(updatedComponents[0].x).toBe(4);
      expect(updatedComponents[0].y).toBe(5);
    });

    it('clears pending layout timeout before position change', () => {
      const containerComp = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const timeoutId = setTimeout(() => {}, 10000);
      const params = createDefaultParams({
        components: [containerComp],
        layoutChangeTimeoutRef: { current: timeoutId },
      });
      (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0 }),
          createMockLayout({ i: 'container-1', x: 4, y: 5 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
      clearTimeoutSpy.mockRestore();
    });

    it('calls onLayoutV4Change to persist container position', () => {
      const containerComp = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({ components: [containerComp] });
      (ContainerManager.isContainer as jest.Mock).mockReturnValue(true);
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0 }),
          createMockLayout({ i: 'container-1', x: 4, y: 5 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onLayoutV4Change).toHaveBeenCalled();
    });

    it('applies insert push when moving a container on canvas', () => {
      const movedContainer = createMockComponent({
        id: 'container-1',
        type: 'L-CON',
        x: 0,
        y: 0,
        width: 4,
        height: 4,
      });
      const otherComp = createMockComponent({ id: 'comp-2', type: 'BTN', x: 4, y: 0, width: 2, height: 2 });
      const params = createDefaultParams({
        components: [movedContainer, otherComp],
        insertModeStateRef: {
          current: {
            isActive: true,
            indicatorX: 0,
            indicatorY: 0,
            indicatorWidth: 0,
            targetRow: 6,
            targetCol: 5,
          },
        },
      });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((candidate: ResponsiveComponent) => {
        return candidate.type === 'L-CON';
      });
      params.detectDropTarget.mockReturnValue({ type: 'container', containerId: 'other-container', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'container-1', x: 0, y: 0, w: 4, h: 4 }),
          createMockLayout({ i: 'container-1', x: 2, y: 2, w: 4, h: 4 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 180, clientY: 120 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(calculateInsertPush).toHaveBeenCalled();
      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const updatedContainer = updatedComponents.find((c) => c.id === 'container-1');
      expect(updatedContainer?.x).toBe(5);
      expect(updatedContainer?.y).toBe(6);
      expect(params.clearInsertMode).toHaveBeenCalled();
    });

    it('moves component out of container onto canvas', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: 'container-1' });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({ components: [comp, container] });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 4, y: 5 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0];
      const movedComp = updatedComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(movedComp.containerId).toBeNull();
      expect(movedComp.x).toBe(4);
      expect(movedComp.y).toBe(5);
    });

    it('applies container-to-canvas insert calculation and uses preview position', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, width: 2, height: 2 });
      const other = createMockComponent({ id: 'comp-2', containerId: null, x: 3, y: 3, width: 2, height: 2 });
      const params = createDefaultParams({
        components: [comp, other],
        dragPreview: {
          visible: true,
          targetType: 'canvas',
          sourceContainerId: 'container-1',
          position: { x: 6, y: 7, w: 2, h: 2 },
        },
        insertModeStateRef: {
          current: {
            isActive: true,
            indicatorX: 0,
            indicatorY: 0,
            indicatorWidth: 0,
            targetRow: 20,
            targetCol: 9,
          },
        },
      });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
          createMockLayout({ i: 'comp-1', x: 1, y: 1, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(calculateInsertPush).toHaveBeenCalled();
      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBeNull();
      expect(movedComp?.x).toBe(6);
      expect(movedComp?.y).toBe(7);
      expect(params.clearInsertMode).toHaveBeenCalled();
    });

    it('prefers dragPreviewRef over stale dragPreview state for cross-grid container-to-canvas placement', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, width: 2, height: 2 });
      const other = createMockComponent({ id: 'comp-2', containerId: null, x: 3, y: 3, width: 2, height: 2 });
      const params = createDefaultParams({
        components: [comp, other],
        dragPreview: { visible: false },
        dragPreviewRef: {
          current: {
            visible: true,
            targetType: 'canvas',
            sourceContainerId: 'container-1',
            position: { x: 6, y: 7, w: 2, h: 2 },
          },
        },
        insertModeStateRef: {
          current: {
            isActive: true,
            indicatorX: 0,
            indicatorY: 0,
            indicatorWidth: 0,
            targetRow: 20,
            targetCol: 9,
          },
        },
      });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0, w: 2, h: 2 }),
          createMockLayout({ i: 'comp-1', x: 1, y: 1, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBeNull();
      expect(movedComp?.x).toBe(6);
      expect(movedComp?.y).toBe(7);
    });

    it('uses last hovered container as fallback target when mouseup misses container DOM hit', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, type: 'BTN' });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({
        components: [comp, container],
        dragOverContainerId: 'container-1',
      });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((candidate: ResponsiveComponent) => {
        return candidate.type === 'L-CON';
      });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 3, y: 2 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBe('container-1');
    });

    it('uses geometric container fallback near edges when hit-test and hover id are missing', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, type: 'BTN' });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({
        components: [comp, container],
        dragOverContainerId: null,
      });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });
      (ContainerManager.isContainer as jest.Mock).mockImplementation((candidate: ResponsiveComponent) => {
        return candidate.type === 'L-CON';
      });

      const containerWrapper = document.createElement('div');
      containerWrapper.className = 'layout-container-wrapper';
      containerWrapper.setAttribute('data-container-id', 'container-1');
      const dropZone = document.createElement('div');
      dropZone.className = 'layout-container-drop-zone';
      containerWrapper.appendChild(dropZone);
      containerWrapper.getBoundingClientRect = jest.fn(
        () =>
          ({
            left: 100,
            top: 100,
            right: 300,
            bottom: 300,
            width: 200,
            height: 200,
          }) as DOMRect,
      );
      dropZone.getBoundingClientRect = jest.fn(
        () =>
          ({
            left: 100,
            top: 100,
            right: 300,
            bottom: 300,
            width: 200,
            height: 200,
          }) as DOMRect,
      );
      document.body.appendChild(containerWrapper);

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      try {
        act(() => {
          result.current.handleDragStop(
            mockLayout,
            createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
            createMockLayout({ i: 'comp-1', x: 3, y: 2 }),
            mockPlaceholder,
            new MouseEvent('mouseup', { clientX: 100, clientY: 110 }) as unknown as MouseEvent,
            element,
          );
        });
      } finally {
        document.body.removeChild(containerWrapper);
      }

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBe('container-1');
    });

    it('uses drag preview position for canvas-to-container drop placement', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, type: 'BTN', width: 2, height: 2 });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON', width: 8, height: 8 });
      const params = createDefaultParams({
        components: [comp, container],
        dragPreview: {
          visible: true,
          targetType: 'container',
          containerId: 'container-1',
          position: { x: 3, y: 6, w: 2, h: 2 },
        },
      });
      params.detectDropTarget.mockReturnValue({ type: 'container', containerId: 'container-1', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 1, y: 1, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 5, clientY: 5 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBe('container-1');
      expect(movedComp?.x).toBe(3);
      expect(movedComp?.y).toBe(6);
    });

    it('prefers dragPreviewRef over stale dragPreview state for canvas-to-container placement', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, type: 'BTN', width: 2, height: 2 });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON', width: 8, height: 8 });
      const params = createDefaultParams({
        components: [comp, container],
        dragPreview: { visible: false },
        dragPreviewRef: {
          current: {
            visible: true,
            targetType: 'container',
            containerId: 'container-1',
            position: { x: 4, y: 5, w: 2, h: 2 },
          },
        },
      });
      params.detectDropTarget.mockReturnValue({ type: 'container', containerId: 'container-1', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 1, y: 1, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 5, clientY: 5 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBe('container-1');
      expect(movedComp?.x).toBe(4);
      expect(movedComp?.y).toBe(5);
    });

    it('clamps preview X when preview exceeds target container width', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, type: 'BTN', width: 2, height: 2 });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON', width: 4, height: 8 });
      const params = createDefaultParams({
        components: [comp, container],
        dragPreview: {
          visible: true,
          targetType: 'container',
          containerId: 'container-1',
          position: { x: 99, y: 2, w: 2, h: 2 },
        },
      });
      params.detectDropTarget.mockReturnValue({ type: 'container', containerId: 'container-1', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 1, y: 1, w: 2, h: 2 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 5, clientY: 5 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0] as ResponsiveComponent[];
      const movedComp = updatedComponents.find((c) => c.id === 'comp-1');
      expect(movedComp?.containerId).toBe('container-1');
      expect(movedComp?.x).toBe(2); // maxX = 4 cols - 2 width
      expect(movedComp?.y).toBe(2);
    });

    it('sets skipNextLayoutChange flag after container-to-canvas move', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: 'container-1' });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({ components: [comp, container] });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 4, y: 5 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.skipNextLayoutChangeRef.current).toBe(true);
    });

    it('clears all drag states after container drop operations', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: 'container-1' });
      const container = createMockComponent({ id: 'container-1', type: 'L-CON' });
      const params = createDefaultParams({ components: [comp, container] });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 4, y: 5 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.clearAllDragStates).toHaveBeenCalled();
      expect(params.isFirstDragOverRef.current).toBe(true);
    });

    it('removes canvas-drag-in-progress class from body', () => {
      document.body.classList.add('canvas-drag-in-progress');
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();

      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 0, y: 0 }),
          createMockLayout({ i: 'comp-1', x: 2, y: 3 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(document.body.classList.contains('canvas-drag-in-progress')).toBe(false);
    });

    it('commits final top-level canvas position on drag stop to prevent snapback', () => {
      const comp = createMockComponent({ id: 'comp-1', containerId: null, x: 1, y: 1, width: 2, height: 2 });
      const params = createDefaultParams({ components: [comp] });
      params.detectDropTarget.mockReturnValue({ type: 'canvas', validDrop: true });

      const { result } = renderHook(() => useCanvasDragHandler(params));
      const element = createMockElement();
      document.elementsFromPoint = jest.fn(() => []);

      act(() => {
        result.current.handleDragStop(
          mockLayout,
          createMockLayout({ i: 'comp-1', x: 1, y: 1, w: 2, h: 2 }),
          createMockLayout({ i: 'comp-1', x: 5, y: 6, w: 3, h: 4 }),
          mockPlaceholder,
          new MouseEvent('mouseup', { clientX: 100, clientY: 100 }) as unknown as MouseEvent,
          element,
        );
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0];
      expect(updatedComponents[0].x).toBe(5);
      expect(updatedComponents[0].y).toBe(6);
      expect(updatedComponents[0].width).toBe(3);
      expect(updatedComponents[0].height).toBe(4);
      expect(params.skipNextLayoutChangeRef.current).toBe(true);
    });
  });
});
