import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasDropHandler } from './useCanvasDropHandler';
import { ContainerManager } from '../containers/utils/ContainerManager';
import { ResponsiveComponent } from '../rgl-integration/types';
import { Field } from '../utils/componentNaming';
import { Layout } from 'react-grid-layout';

// Mock dependencies
jest.mock('../containers/utils/ContainerManager', () => ({
  ContainerManager: {
    handleNestedDrop: jest.fn(),
    handleNestedDragOver: jest.fn(),
    handleNestedDragLeave: jest.fn(),
  },
}));

jest.mock('../utils/componentSizing', () => ({
  getCustomComponentSize: jest.fn(() => ({ width: 3, height: 2 })),
}));

jest.mock('../utils/componentNaming', () => ({
  generateUniqueComponentName: jest.fn(() => 'Button 1'),
}));

jest.mock('../registry/registryUtils', () => ({
  getComponentDefaultsFromRegistry: jest.fn(() => ({})),
  getDisplayRestrictionsFromRegistry: jest.fn(() => undefined),
}));

// Mock Guid
jest.mock('@m-next/utilities', () => ({
  Guid: { create: jest.fn(() => 'mock-guid-123') },
}));

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

function createDefaultParams(overrides: Record<string, unknown> = {}) {
  return {
    components: [createMockComponent()] as ResponsiveComponent[],
    onComponentsChange: jest.fn() as ((comps: ResponsiveComponent[]) => void) | null,
    fieldList: null as Field[] | null,
    isDragOver: false,
    setIsDragOver: jest.fn(),
    setDragPreview: jest.fn(),
    setInvalidDropTargetId: jest.fn(),
    setDragOverCanvas: jest.fn(),
    clearAllDragStates: jest.fn(),
    isFirstDragOverRef: { current: true },
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
    layoutChangeTimeoutRef: { current: null } as { current: ReturnType<typeof setTimeout> | null },
    skipNextLayoutChangeRef: { current: false },
    onNestedDropRef: { current: null } as React.MutableRefObject<
      | ((
          e: React.DragEvent,
          targetContainerId: string,
          position?: { x: number; y: number; w: number; h: number },
        ) => void)
      | null
    >,
    rowHeight: 30,
    detectDropTarget: jest.fn(() => ({ type: 'canvas' as const, validDrop: true })),
    presentedComponentsRef: { current: [] },
    ...overrides,
  };
}

describe('useCanvasDropHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error - test setup
    delete (window as Record<string, unknown>).__draggedComponentType;
    // @ts-expect-error - test setup
    delete (window as Record<string, unknown>).__rglCrossGridTargetType;
    // @ts-expect-error - test setup
    delete (window as Record<string, unknown>).__rglCrossGridDragSize;
  });

  describe('handleDropDragOver', () => {
    it('returns default size {w:2, h:2} when no type available', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {
        target: document.createElement('div'),
        dataTransfer: { getData: jest.fn(() => '') },
      } as unknown as React.DragEvent;

      const size = result.current.handleDropDragOver(mockEvent);
      expect(size).toEqual({ w: 2, h: 2 });
    });

    it('returns component size from registry for known type', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {
        target: document.createElement('div'),
        dataTransfer: { getData: jest.fn(() => 'BTN') },
      } as unknown as React.DragEvent;

      const size = result.current.handleDropDragOver(mockEvent);
      expect(size).toEqual({ w: 3, h: 2 }); // From mocked getCustomComponentSize
    });

    it('returns false when dropping over container drop zone', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const containerDropZone = document.createElement('div');
      containerDropZone.classList.add('layout-container-drop-zone');
      const child = document.createElement('div');
      containerDropZone.appendChild(child);

      const mockEvent = {
        target: child,
        dataTransfer: { getData: jest.fn(() => 'BTN') },
      } as unknown as React.DragEvent;

      const returnValue = result.current.handleDropDragOver(mockEvent);
      expect(returnValue).toBe(false);
    });

    it('does not treat nested overflow spill below visible container body as a container drop zone', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const containerWrapper = document.createElement('div');
      containerWrapper.classList.add('layout-container-wrapper');
      const dropZone = document.createElement('div');
      dropZone.classList.add('layout-container-drop-zone');
      const nestedLayout = document.createElement('div');
      nestedLayout.classList.add('react-grid-layout', 'nested-layout');
      const nestedChild = document.createElement('div');
      nestedLayout.appendChild(nestedChild);
      containerWrapper.appendChild(dropZone);
      containerWrapper.appendChild(nestedLayout);

      Object.defineProperty(dropZone, 'getBoundingClientRect', {
        value: jest.fn(() => ({ left: 100, right: 300, top: 100, bottom: 200 })),
      });

      const mockEvent = {
        target: nestedChild,
        clientX: 150,
        clientY: 240, // below visible dropZone but could still hit nested overflow
        dataTransfer: { getData: jest.fn(() => 'BTN') },
      } as unknown as React.DragEvent;

      const returnValue = result.current.handleDropDragOver(mockEvent);
      expect(returnValue).toEqual({ w: 3, h: 2 });
    });

    it('returns cross-grid size for container-to-canvas drags', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__rglCrossGridTargetType = 'canvas';
      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__rglCrossGridDragSize = { w: 4, h: 3 };

      const mockEvent = {
        target: document.createElement('div'),
        dataTransfer: { getData: jest.fn(() => '') },
      } as unknown as React.DragEvent;

      const size = result.current.handleDropDragOver(mockEvent);
      expect(size).toEqual({ w: 4, h: 3 });
    });

    it('keeps preview position aligned to active insert target between throttled cross-grid updates', () => {
      const params = createDefaultParams({
        insertModeStateRef: {
          current: {
            isActive: true,
            indicatorX: 0,
            indicatorY: 0,
            indicatorWidth: 0,
            targetRow: 8,
            targetCol: 6,
          },
        },
      });
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__rglCrossGridTargetType = 'canvas';
      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__rglCrossGridDragSize = { w: 4, h: 3 };

      const mockEvent = {
        target: document.createElement('div'),
        clientX: 420,
        clientY: 330,
        dataTransfer: { getData: jest.fn(() => '') },
      } as unknown as React.DragEvent;

      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1000);
      try {
        // First call seeds throttle refs.
        result.current.handleDropDragOver(mockEvent);
        // Second call is within throttle window and should keep insert target.
        result.current.handleDropDragOver(mockEvent);
      } finally {
        nowSpy.mockRestore();
      }

      const setPreviewCallCount = (params.setDragPreview as jest.Mock).mock.calls.length;
      expect(setPreviewCallCount).toBeGreaterThan(0);
      const setPreview = (params.setDragPreview as jest.Mock).mock.calls[setPreviewCallCount - 1][0] as (
        prev: any,
      ) => any;

      const nextPreview = setPreview({
        visible: true,
        targetType: 'canvas',
        sourceContainerId: 'container-1',
        position: { x: 1, y: 2, w: 4, h: 3 },
      });

      expect(nextPreview.position.x).toBe(6);
      expect(nextPreview.position.y).toBe(8);
    });

    it('does not call setInsertMode when hovering over a hidden component (h=0 in presented layout)', () => {
      // Raw component at y=2, height=3 — but presented layout collapses it to h=0
      const hiddenComponent = createMockComponent({
        id: 'hidden-comp',
        x: 0,
        y: 2,
        width: 4,
        height: 3,
        containerId: null,
      });
      const presentedHidden = { ...hiddenComponent, height: 0 };

      const params = createDefaultParams({
        components: [hiddenComponent],
        presentedComponentsRef: { current: [presentedHidden] },
        rowHeight: 30,
        colWidth: 50,
        cols: 12,
      });
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__draggedComponentType = 'BTN';

      // Set up an rglElement so insert detection code path is reached
      const rgl = document.createElement('div');
      rgl.classList.add('react-grid-layout');
      const child = document.createElement('div');
      rgl.appendChild(child);
      document.body.appendChild(rgl);
      Object.defineProperty(rgl, 'getBoundingClientRect', {
        value: jest.fn(() => ({ left: 0, right: 600, top: 0, bottom: 400, width: 600, height: 400 })),
        configurable: true,
      });

      try {
        // clientY=70 → mouseY=62 → row 2 (rowHeight=30), directly over the hidden component
        const mockEvent = {
          target: child,
          clientX: 50,
          clientY: 70,
          dataTransfer: { getData: jest.fn(() => '') },
        } as unknown as React.DragEvent;

        result.current.handleDropDragOver(mockEvent);

        // Hidden component is excluded from layoutItems (h=0) → detectInsertPosition sees
        // no obstacles → wouldCausePush: false → setInsertMode must NOT be called
        expect(params.setInsertMode).not.toHaveBeenCalled();
      } finally {
        document.body.removeChild(rgl);
      }
    });
  });

  describe('handleGridDrop', () => {
    it('creates new component with correct defaults', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // Set window type for component detection
      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__draggedComponentType = 'BTN';

      const mockEvent = {
        dataTransfer: { getData: jest.fn(() => 'BTN') },
        target: document.createElement('div'),
        clientX: 100,
        clientY: 100,
      } as unknown as Event;

      const layoutItem = { i: '__dropping-elem__', x: 2, y: 3, w: 3, h: 2 } as Layout;

      // Set up canvas element in DOM
      const canvas = document.createElement('div');
      const rgl = document.createElement('div');
      rgl.classList.add('react-grid-layout');
      canvas.appendChild(rgl);
      document.body.appendChild(canvas);

      act(() => {
        result.current.handleGridDrop([], layoutItem, mockEvent);
      });

      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0];
      const newComp = updatedComponents[updatedComponents.length - 1];
      expect(newComp.id).toBe('mock-guid-123');
      expect(newComp.type).toBe('BTN');
      expect(newComp.x).toBe(2);
      expect(newComp.y).toBe(3);
      expect(newComp.containerId).toBeNull();

      document.body.removeChild(canvas);
    });

    it('clears pending layout updates before adding component', () => {
      const timeoutId = setTimeout(() => {}, 10000);
      const params = createDefaultParams({
        layoutChangeTimeoutRef: { current: timeoutId },
      });
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__draggedComponentType = 'BTN';

      const mockEvent = {
        dataTransfer: { getData: jest.fn(() => 'BTN') },
        target: document.createElement('div'),
        clientX: 100,
        clientY: 100,
      } as unknown as Event;

      const canvas = document.createElement('div');
      const rgl = document.createElement('div');
      rgl.classList.add('react-grid-layout');
      canvas.appendChild(rgl);
      document.body.appendChild(canvas);

      act(() => {
        result.current.handleGridDrop([], { i: '__dropping-elem__', x: 0, y: 0, w: 2, h: 2 } as Layout, mockEvent);
      });

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
      clearTimeoutSpy.mockRestore();
      document.body.removeChild(canvas);
    });

    it('clears drag states after successful drop', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__draggedComponentType = 'BTN';

      const mockEvent = {
        dataTransfer: { getData: jest.fn(() => 'BTN') },
        target: document.createElement('div'),
        clientX: 100,
        clientY: 100,
      } as unknown as Event;

      const canvas = document.createElement('div');
      const rgl = document.createElement('div');
      rgl.classList.add('react-grid-layout');
      canvas.appendChild(rgl);
      document.body.appendChild(canvas);

      act(() => {
        result.current.handleGridDrop([], { i: '__dropping-elem__', x: 0, y: 0, w: 2, h: 2 } as Layout, mockEvent);
      });

      expect(params.clearAllDragStates).toHaveBeenCalled();
      document.body.removeChild(canvas);
    });

    it('drops on canvas when event target is nested overflow outside visible container drop zone', () => {
      const nestedDropSpy = jest.fn();
      const params = createDefaultParams({
        onNestedDropRef: { current: nestedDropSpy },
      });
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__draggedComponentType = 'BTN';

      const mainCanvas = document.createElement('div');
      const mainRgl = document.createElement('div');
      mainRgl.classList.add('react-grid-layout');
      Object.defineProperty(mainCanvas, 'getBoundingClientRect', {
        value: jest.fn(() => ({ left: 0, top: 0, right: 800, bottom: 600 })),
      });
      mainCanvas.appendChild(mainRgl);
      document.body.appendChild(mainCanvas);

      const containerWrapper = document.createElement('div');
      containerWrapper.classList.add('layout-container-wrapper');
      containerWrapper.setAttribute('data-container-id', 'container-1');
      const dropZone = document.createElement('div');
      dropZone.classList.add('layout-container-drop-zone');
      Object.defineProperty(dropZone, 'getBoundingClientRect', {
        value: jest.fn(() => ({ left: 100, right: 300, top: 100, bottom: 200 })),
      });
      const nestedLayout = document.createElement('div');
      nestedLayout.classList.add('react-grid-layout', 'nested-layout');
      const nestedChild = document.createElement('div');
      nestedLayout.appendChild(nestedChild);
      containerWrapper.appendChild(dropZone);
      containerWrapper.appendChild(nestedLayout);
      document.body.appendChild(containerWrapper);

      const mockEvent = {
        dataTransfer: { getData: jest.fn(() => 'BTN') },
        target: nestedChild, // hit nested overflow element
        clientX: 150,
        clientY: 240, // outside visible container dropZone
      } as unknown as Event;

      act(() => {
        result.current.handleGridDrop([], { i: '__dropping-elem__', x: 2, y: 6, w: 3, h: 2 } as Layout, mockEvent);
      });

      expect(nestedDropSpy).not.toHaveBeenCalled();
      expect(params.onComponentsChange).toHaveBeenCalled();
      const updatedComponents = (params.onComponentsChange as jest.Mock).mock.calls[0][0];
      const newComp = updatedComponents[updatedComponents.length - 1];
      expect(newComp.containerId).toBeNull();
      expect(newComp.x).toBe(2);
      expect(newComp.y).toBe(6);

      document.body.removeChild(containerWrapper);
      document.body.removeChild(mainCanvas);
    });
  });

  describe('handleDragOver', () => {
    it('sets isDragOver state', () => {
      const params = createDefaultParams({ isDragOver: false });
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {
        preventDefault: jest.fn(),
        dataTransfer: { dropEffect: 'none' },
      } as unknown as React.DragEvent;

      act(() => {
        result.current.handleDragOver(mockEvent);
      });

      expect(params.setIsDragOver).toHaveBeenCalledWith(true);
    });
  });

  describe('handleDragLeave', () => {
    it('clears isDragOver only when leaving canvas entirely', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const currentTarget = document.createElement('div');
      const relatedTarget = document.createElement('div');
      // relatedTarget is NOT inside currentTarget -> leaving canvas

      const mockEvent = {
        currentTarget,
        relatedTarget,
      } as unknown as React.DragEvent;

      act(() => {
        result.current.handleDragLeave(mockEvent);
      });

      expect(params.setIsDragOver).toHaveBeenCalledWith(false);
      expect(params.setDragPreview).toHaveBeenCalledWith({ visible: false });
      expect(params.setInvalidDropTargetId).toHaveBeenCalledWith(null);
    });

    it('does NOT clear isDragOver when moving within canvas', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const currentTarget = document.createElement('div');
      const child = document.createElement('div');
      currentTarget.appendChild(child);

      const mockEvent = {
        currentTarget,
        relatedTarget: child, // still inside currentTarget
      } as unknown as React.DragEvent;

      act(() => {
        result.current.handleDragLeave(mockEvent);
      });

      expect(params.setIsDragOver).not.toHaveBeenCalled();
    });
  });

  describe('onNestedDrop', () => {
    it('delegates to ContainerManager.handleNestedDrop', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {} as React.DragEvent;

      act(() => {
        result.current.onNestedDrop(mockEvent, 'container-1');
      });

      expect(ContainerManager.handleNestedDrop).toHaveBeenCalledWith(
        mockEvent,
        'container-1',
        params.components,
        params.onComponentsChange,
        undefined,
        undefined,
      );
    });

    it('clears all drag states after drop', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      act(() => {
        result.current.onNestedDrop({} as React.DragEvent, 'container-1');
      });

      expect(params.clearAllDragStates).toHaveBeenCalled();
    });

    it('clears pending layout updates before drop', () => {
      const timeoutId = setTimeout(() => {}, 10000);
      const params = createDefaultParams({
        layoutChangeTimeoutRef: { current: timeoutId },
      });
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result } = renderHook(() => useCanvasDropHandler(params));

      act(() => {
        result.current.onNestedDrop({} as React.DragEvent, 'container-1');
      });

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('onNestedDragOver', () => {
    it('delegates to ContainerManager.handleNestedDragOver', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {} as React.DragEvent;

      act(() => {
        result.current.onNestedDragOver(mockEvent, 'canvas-1');
      });

      expect(ContainerManager.handleNestedDragOver).toHaveBeenCalledWith(
        mockEvent,
        'canvas-1',
        params.setDragOverCanvas,
      );
    });

    it('promotes cross-grid drag preview to target container immediately', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__rglCrossGridDragSize = { w: 3, h: 2 };
      // @ts-expect-error - test setup
      (window as Record<string, unknown>).__rglCrossGridTargetType = 'canvas';

      const wrapper = document.createElement('div');
      wrapper.className = 'layout-container-wrapper';
      wrapper.setAttribute('data-container-id', 'container-2');
      wrapper.setAttribute('data-container-cols', '8');
      wrapper.setAttribute('data-container-padding', '0');

      const dropZone = document.createElement('div');
      dropZone.className = 'layout-container-drop-zone';
      Object.defineProperty(dropZone, 'getBoundingClientRect', {
        value: jest.fn(() => ({ left: 100, top: 100, right: 420, bottom: 460, width: 320, height: 360 })),
      });
      wrapper.appendChild(dropZone);

      const nestedLayout = document.createElement('div');
      nestedLayout.className = 'nested-layout';
      Object.defineProperty(nestedLayout, 'getBoundingClientRect', {
        value: jest.fn(() => ({ left: 100, top: 100, right: 420, bottom: 460, width: 320, height: 360 })),
      });
      dropZone.appendChild(nestedLayout);

      const mockEvent = {
        target: nestedLayout,
        currentTarget: dropZone,
        clientX: 220,
        clientY: 190,
        dataTransfer: { getData: jest.fn(() => '') },
      } as unknown as React.DragEvent;

      act(() => {
        result.current.onNestedDragOver(mockEvent, 'container-2');
      });

      const setPreviewCalls = (params.setDragPreview as jest.Mock).mock.calls;
      const updaterCall = setPreviewCalls.find(([arg]) => typeof arg === 'function');
      expect(updaterCall).toBeDefined();
      const updater = updaterCall?.[0] as (prev: any) => any;

      const nextPreview = updater({
        visible: true,
        sourceContainerId: 'container-1',
        targetType: 'canvas',
        containerId: null,
        position: { x: 0, y: 0, w: 3, h: 2 },
      });

      expect(nextPreview.targetType).toBe('container');
      expect(nextPreview.containerId).toBe('container-2');
      expect(nextPreview.position.w).toBe(3);
      expect(nextPreview.position.h).toBe(2);
    });
  });

  describe('onNestedDragLeave', () => {
    it('delegates to ContainerManager.handleNestedDragLeave', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {} as React.DragEvent;

      act(() => {
        result.current.onNestedDragLeave(mockEvent);
      });

      expect(ContainerManager.handleNestedDragLeave).toHaveBeenCalledWith(mockEvent, params.setDragOverCanvas);
    });
  });

  describe('onComponentDragStart', () => {
    it('sets dataTransfer data and stops propagation', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {
        dataTransfer: { setData: jest.fn() },
        stopPropagation: jest.fn(),
      } as unknown as React.DragEvent;

      act(() => {
        result.current.onComponentDragStart(mockEvent, 'comp-1', 'parent-1');
      });

      expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'move:comp-1:parent-1');
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('uses "main" as parent when parentId is empty', () => {
      const params = createDefaultParams();
      const { result } = renderHook(() => useCanvasDropHandler(params));

      const mockEvent = {
        dataTransfer: { setData: jest.fn() },
        stopPropagation: jest.fn(),
      } as unknown as React.DragEvent;

      act(() => {
        result.current.onComponentDragStart(mockEvent, 'comp-1', '');
      });

      expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'move:comp-1:main');
    });
  });
});
