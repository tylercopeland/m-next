import { act, renderHook } from '@testing-library/react-hooks';
import { useContainerHandler, type ContainerLayoutItem } from '../hooks/useContainerHandler';
import { ContainerManager } from '../utils/ContainerManager';

describe('useContainerHandler resize tracking', () => {
  const createChildComponent = (overrides: Record<string, unknown> = {}) =>
    ({
      id: 'child-1',
      type: 'BUTTON',
      x: 2,
      y: 0,
      width: 2,
      height: 2,
      containerId: 'container-1',
      static: false,
      ...overrides,
    }) as any;

  const createParams = (overrides: Record<string, unknown> = {}) =>
    ({
      container: { id: 'container-1', width: 8, height: 12 },
      childComponents: [createChildComponent()],
      rowHeight: 30,
      resolution: 'desktop',
      mode: 'designer',
      showHiddenComponents: true,
      onNestedComponentsChange: jest.fn(),
      ...overrides,
    }) as any;

  const createDomRect = (width: number): DOMRect =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 300,
      width,
      height: 300,
      toJSON: () => ({}),
    }) as DOMRect;

  const createNestedGridDom = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'layout-container-wrapper';
    Object.defineProperty(wrapper, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: 360,
          width: 320,
          height: 360,
          toJSON: () => ({}),
        }) as DOMRect,
    });

    const nestedLayout = document.createElement('div');
    nestedLayout.className = 'react-grid-layout nested-layout';
    wrapper.appendChild(nestedLayout);

    const gridItem = document.createElement('div');
    gridItem.className = 'react-grid-item';
    nestedLayout.appendChild(gridItem);

    document.body.appendChild(wrapper);
    return { wrapper, gridItem };
  };

  const createNestedGridDomWithMainCanvas = () => {
    const canvasWrapper = document.createElement('div');

    const mainGrid = document.createElement('div');
    mainGrid.className = 'react-grid-layout';
    Object.defineProperty(mainGrid, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 1200,
          bottom: 800,
          width: 1200,
          height: 800,
          toJSON: () => ({}),
        }) as DOMRect,
    });
    canvasWrapper.appendChild(mainGrid);

    const mainGridItem = document.createElement('div');
    mainGridItem.className = 'react-grid-item';
    mainGrid.appendChild(mainGridItem);

    const wrapper = document.createElement('div');
    wrapper.className = 'layout-container-wrapper';
    Object.defineProperty(wrapper, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: 360,
          width: 320,
          height: 360,
          toJSON: () => ({}),
        }) as DOMRect,
    });

    const dropZone = document.createElement('div');
    dropZone.className = 'layout-container-drop-zone';
    Object.defineProperty(dropZone, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: 360,
          width: 320,
          height: 360,
          toJSON: () => ({}),
        }) as DOMRect,
    });
    wrapper.appendChild(dropZone);

    const nestedLayout = document.createElement('div');
    nestedLayout.className = 'react-grid-layout nested-layout';
    dropZone.appendChild(nestedLayout);

    const gridItem = document.createElement('div');
    gridItem.className = 'react-grid-item';
    nestedLayout.appendChild(gridItem);

    mainGridItem.appendChild(wrapper);
    document.body.appendChild(canvasWrapper);
    return { canvasWrapper, wrapper, gridItem };
  };

  const createHardSelectedContainerDomWithMainCanvas = () => {
    const canvasWrapper = document.createElement('div');

    const mainGrid = document.createElement('div');
    mainGrid.className = 'react-grid-layout';
    Object.defineProperty(mainGrid, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 1200,
          bottom: 800,
          width: 1200,
          height: 800,
          toJSON: () => ({}),
        }) as DOMRect,
    });
    canvasWrapper.appendChild(mainGrid);

    const mainGridItem = document.createElement('div');
    mainGridItem.className = 'react-grid-item';
    mainGrid.appendChild(mainGridItem);

    const wrapper = document.createElement('div');
    wrapper.className = 'layout-container-wrapper';
    Object.defineProperty(wrapper, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 1200,
          bottom: 800,
          width: 1200,
          height: 800,
          toJSON: () => ({}),
        }) as DOMRect,
    });

    const dropZone = document.createElement('div');
    dropZone.className = 'layout-container-drop-zone';
    Object.defineProperty(dropZone, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 1200,
          bottom: 800,
          width: 1200,
          height: 800,
          toJSON: () => ({}),
        }) as DOMRect,
    });
    wrapper.appendChild(dropZone);

    const nestedLayout = document.createElement('div');
    nestedLayout.className = 'react-grid-layout nested-layout';
    dropZone.appendChild(nestedLayout);

    const gridItem = document.createElement('div');
    gridItem.className = 'react-grid-item';
    nestedLayout.appendChild(gridItem);

    mainGridItem.appendChild(wrapper);
    document.body.appendChild(canvasWrapper);
    return { canvasWrapper, gridItem };
  };

  it('uses intended width and x for west resize when RGL is collision-limited', () => {
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() => useContainerHandler(createParams({ onNestedComponentsChange })));

    const grid = document.createElement('div');
    grid.className = 'react-grid-layout nested-layout';
    Object.defineProperty(grid, 'getBoundingClientRect', {
      value: () => createDomRect(800),
    });

    const element = document.createElement('div');
    grid.appendChild(element);

    const handle = document.createElement('div');
    handle.className = 'react-resizable-handle react-resizable-handle-w';
    element.appendChild(handle);

    const startEvent = { clientX: 400, clientY: 100, target: handle } as unknown as MouseEvent;
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;

    act(() => {
      result.current.handleResizeStart([], oldItem, oldItem, {} as ContainerLayoutItem, startEvent, element);
    });

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 100 }));
    });

    const rglLimitedItem = { i: 'child-1', x: 1, y: 0, w: 3, h: 2 } as ContainerLayoutItem;
    const nextLayout = [rglLimitedItem];

    act(() => {
      result.current.handleResizeStop(
        nextLayout,
        oldItem,
        rglLimitedItem,
        {} as ContainerLayoutItem,
        startEvent,
        element,
      );
    });

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((comp: any) => comp.id === 'child-1');

    expect(updatedChild.width).toBe(4);
    expect(updatedChild.x).toBe(0);
  });

  // ============================================================================
  // NCNG-867: Container boundary clamping for horizontal resize handles
  // (Container variant of NCNG-571)
  // ============================================================================
  it('clamps west resize at left container edge when handle dragged off-container', () => {
    // Container: 8 cols × 800px wide → 100px per column.
    // Child at x:2, w:2 → max west width = startX + startWidth = 4
    // Drag west handle far past the left container edge.
    // Without the boundary clamp, intendedWidth would balloon to maxWidth (8),
    // and handleResizeStop would override RGL's w:4 back to w:8 — pushing the
    // right edge of the child past its original position (the bug).
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() => useContainerHandler(createParams({ onNestedComponentsChange })));

    const grid = document.createElement('div');
    grid.className = 'react-grid-layout nested-layout';
    Object.defineProperty(grid, 'getBoundingClientRect', {
      value: () => createDomRect(800),
    });

    const element = document.createElement('div');
    grid.appendChild(element);

    const handle = document.createElement('div');
    handle.className = 'react-resizable-handle react-resizable-handle-w';
    element.appendChild(handle);

    const startEvent = { clientX: 200, clientY: 100, target: handle } as unknown as MouseEvent;
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;

    act(() => {
      result.current.handleResizeStart([], oldItem, oldItem, {} as ContainerLayoutItem, startEvent, element);
    });

    // Drag mouse far left, well past x=0 — raw delta would imply +8 cols of width.
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: -600, clientY: 100 }));
    });

    // Simulate RGL clamping x to 0 and width to 4 on its own (no collisions).
    const rglItem = { i: 'child-1', x: 0, y: 0, w: 4, h: 2 } as ContainerLayoutItem;

    act(() => {
      result.current.handleResizeStop([rglItem], oldItem, rglItem, {} as ContainerLayoutItem, startEvent, element);
    });

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((comp: any) => comp.id === 'child-1');

    // With the clamp: intendedWidth = startX + startWidth = 4 → matches RGL → no override.
    // Without the clamp: intendedWidth would be 8 and would override RGL's w:4 to 8.
    expect(updatedChild.width).toBe(4);
    expect(updatedChild.x).toBe(0);
  });

  it('clamps east resize at right container edge when handle dragged off-container', () => {
    // Container: 8 cols × 800px wide → 100px per column.
    // Child at x:2, w:2 → max east width = containerCols - startX = 6
    // Drag east handle far past the right container edge.
    // Without the boundary clamp, intendedWidth would balloon to maxWidth (8),
    // and handleResizeStop would override RGL's w:6 back to w:8 — pushing the
    // right edge past the container's own boundary (the bug).
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() => useContainerHandler(createParams({ onNestedComponentsChange })));

    const grid = document.createElement('div');
    grid.className = 'react-grid-layout nested-layout';
    Object.defineProperty(grid, 'getBoundingClientRect', {
      value: () => createDomRect(800),
    });

    const element = document.createElement('div');
    grid.appendChild(element);

    const handle = document.createElement('div');
    handle.className = 'react-resizable-handle react-resizable-handle-e';
    element.appendChild(handle);

    const startEvent = { clientX: 400, clientY: 100, target: handle } as unknown as MouseEvent;
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;

    act(() => {
      result.current.handleResizeStart([], oldItem, oldItem, {} as ContainerLayoutItem, startEvent, element);
    });

    // Drag mouse far right, well past the container's right edge — raw delta would imply +11 cols.
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 1500, clientY: 100 }));
    });

    // Simulate RGL capping width at containerCols - x = 6 (it can't extend past col 8).
    const rglItem = { i: 'child-1', x: 2, y: 0, w: 6, h: 2 } as ContainerLayoutItem;

    act(() => {
      result.current.handleResizeStop([rglItem], oldItem, rglItem, {} as ContainerLayoutItem, startEvent, element);
    });

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((comp: any) => comp.id === 'child-1');

    // With the clamp: intendedWidth = containerCols - startX = 6 → matches RGL → no override.
    // Without the clamp: intendedWidth would be 8 and would override RGL's w:6 to 8.
    expect(updatedChild.width).toBe(6);
    expect(updatedChild.x).toBe(2);
  });

  it('uses active canvas drag preview target to eject child from container on drag stop', () => {
    const onNestedComponentsChange = jest.fn();
    const onNestedDragComplete = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onNestedComponentsChange,
          onNestedDragComplete,
          dragPreview: {
            visible: true,
            sourceContainerId: 'container-1',
            targetType: 'canvas',
            position: { x: 5, y: 7, w: 2, h: 2 },
          },
        }),
      ),
    );

    const { wrapper, gridItem } = createNestedGridDom();

    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    try {
      act(() => {
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 10, clientY: 10 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      document.body.removeChild(wrapper);
    }

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBe(5);
    expect(updatedChild.y).toBe(7);
    expect(onNestedDragComplete).toHaveBeenCalled();
  });

  it('recomputes canvas drop coordinates from mouseup when preview target is stale', () => {
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onNestedComponentsChange,
          dragPreview: {
            visible: true,
            sourceContainerId: 'container-1',
            targetType: 'canvas',
            position: { x: 1, y: 1, w: 2, h: 2 },
          },
        }),
      ),
    );

    const { canvasWrapper, gridItem } = createNestedGridDomWithMainCanvas();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    try {
      act(() => {
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 1000, clientY: 300 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      document.body.removeChild(canvasWrapper);
    }

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBe(10);
    expect(updatedChild.y).toBe(10);
  });

  it('clamps canvas preview X when preview target exceeds main canvas width', () => {
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onNestedComponentsChange,
          dragPreview: {
            visible: true,
            sourceContainerId: 'container-1',
            targetType: 'canvas',
            position: { x: 99, y: 4, w: 2, h: 2 },
          },
        }),
      ),
    );

    const { wrapper, gridItem } = createNestedGridDom();

    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    try {
      act(() => {
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 10, clientY: 10 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      document.body.removeChild(wrapper);
    }

    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBe(10); // 12 cols - 2 width
    expect(updatedChild.y).toBe(4);
  });

  it('uses recent external drag target when drag-stop hit test momentarily returns null', () => {
    const onNestedComponentsChange = jest.fn();
    const onDragPreviewChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onNestedComponentsChange,
          onDragPreviewChange,
        }),
      ),
    );

    const { wrapper, gridItem } = createNestedGridDom();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy
      .mockReturnValueOnce({
        type: 'main-canvas',
        targetContainerId: null,
        position: { x: 4, y: 6 },
        component: createChildComponent(),
      } as any)
      .mockReturnValueOnce(null);

    try {
      act(() => {
        // During drag, preview resolves to external canvas target.
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 500, clientY: 20 }) as unknown as MouseEvent,
          gridItem,
        );
      });

      act(() => {
        // On mouseup, hit test misses and returns null. Hook should still honor recent external target.
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 20, clientY: 20 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(wrapper);
    }

    expect(onDragPreviewChange).toHaveBeenCalled();
    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBe(3);
    expect(updatedChild.y).toBe(6);
  });

  it('keeps recent external target through a brief inside-container flicker before drag-stop', () => {
    const onNestedComponentsChange = jest.fn();
    const onDragPreviewChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onNestedComponentsChange,
          onDragPreviewChange,
        }),
      ),
    );

    const { wrapper, gridItem } = createNestedGridDom();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy
      .mockReturnValueOnce({
        type: 'main-canvas',
        targetContainerId: null,
        position: { x: 6, y: 4 },
        component: createChildComponent(),
      } as any)
      .mockReturnValueOnce(null);

    try {
      act(() => {
        // First drag tick escapes container and resolves an external canvas target.
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 500, clientY: 20 }) as unknown as MouseEvent,
          gridItem,
        );
      });

      act(() => {
        // Next tick momentarily lands back inside due event-order jitter; hook should not immediately clear.
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 140, clientY: 120 }) as unknown as MouseEvent,
          gridItem,
        );
      });

      act(() => {
        // Mouseup still misses external hit-test, but the recent external target should win.
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 140, clientY: 120 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(wrapper);
    }

    expect(onDragPreviewChange).toHaveBeenCalled();
    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBe(5);
    expect(updatedChild.y).toBe(4);
  });

  it('updates canvas preview coordinates from latest external target while dragging from container', () => {
    const onDragPreviewChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onDragPreviewChange,
        }),
      ),
    );

    const { wrapper, gridItem } = createNestedGridDom();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy.mockReturnValue({
      type: 'main-canvas',
      targetContainerId: null,
      position: { x: 1, y: 3 },
      component: createChildComponent(),
    } as any);

    try {
      act(() => {
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 500, clientY: 20 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(wrapper);
    }

    expect(onDragPreviewChange).toHaveBeenCalled();
    const setPreview = onDragPreviewChange.mock.calls[0][0] as (prev: any) => any;
    expect(typeof setPreview).toBe('function');

    const nextPreview = setPreview({
      visible: true,
      targetType: 'canvas',
      sourceContainerId: 'container-1',
      componentType: 'BUTTON',
      clientX: 10,
      clientY: 10,
      position: { x: 7, y: 9, w: 2, h: 2 },
    });

    expect(nextPreview.targetType).toBe('canvas');
    expect(nextPreview.position.x).toBe(0);
    expect(nextPreview.position.y).toBe(3);
    expect(nextPreview.clientX).toBe(500);
    expect(nextPreview.clientY).toBe(20);
  });

  it('preserves pointer grab offset when previewing drag from container to canvas', () => {
    const onDragPreviewChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          onDragPreviewChange,
        }),
      ),
    );

    const { canvasWrapper, gridItem } = createNestedGridDomWithMainCanvas();
    const nestedLayout = gridItem.closest('.nested-layout') as HTMLElement;
    Object.defineProperty(nestedLayout, 'getBoundingClientRect', {
      value: () =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: 360,
          width: 320,
          height: 360,
          toJSON: () => ({}),
        }) as DOMRect,
    });
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy.mockReturnValue({
      type: 'main-canvas',
      targetContainerId: null,
      position: { x: 5, y: 6 },
      component: createChildComponent(),
    } as any);

    try {
      act(() => {
        // Prime anchor offset while pointer is still inside the source container.
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 130, clientY: 60 }) as unknown as MouseEvent,
          gridItem,
        );
      });

      act(() => {
        // Drag outside to trigger cross-grid preview.
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 500, clientY: 60 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(canvasWrapper);
    }

    expect(onDragPreviewChange).toHaveBeenCalled();
    const setPreview = onDragPreviewChange.mock.calls[0][0] as (prev: any) => any;
    const nextPreview = setPreview({ visible: false });
    expect(nextPreview.visible).toBe(true);
    expect(nextPreview.targetType).toBe('canvas');
    expect(nextPreview.anchorOffsetCols).toBe(1);
    expect(nextPreview.position).toEqual({ x: 4, y: 6, w: 2, h: 2 });
  });

  it('treats pointer below visible container viewport as external for tall containers', () => {
    const onDragPreviewChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          container: { id: 'container-1', width: 8, height: 100 },
          onDragPreviewChange,
        }),
      ),
    );

    const { wrapper, gridItem } = createNestedGridDom();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy.mockReturnValue({
      type: 'main-canvas',
      targetContainerId: null,
      position: { x: 3, y: 5 },
      component: createChildComponent(),
    } as any);

    try {
      act(() => {
        result.current.handleDrag(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mousemove', { clientX: 160, clientY: 500 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(wrapper);
    }

    expect(onDragPreviewChange).toHaveBeenCalled();
    const setPreview = onDragPreviewChange.mock.calls[0][0] as (prev: any) => any;
    const nextPreview = setPreview({ visible: false });
    expect(nextPreview.visible).toBe(true);
    expect(nextPreview.targetType).toBe('canvas');
    expect(nextPreview.position).toEqual({ x: 2, y: 5, w: 2, h: 2 });
  });

  it('uses bottom escape fallback at drag-stop when hit-test returns null below visible viewport', () => {
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          container: { id: 'container-1', width: 8, height: 100 },
          onNestedComponentsChange,
        }),
      ),
    );

    const { canvasWrapper, gridItem } = createNestedGridDomWithMainCanvas();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy.mockReturnValue(null);

    try {
      act(() => {
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 160, clientY: 500 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(canvasWrapper);
    }

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBe(2);
    expect(updatedChild.y).toBe(16);
  });

  it('ejects child on drag-stop near canvas edge when hard-selected container fills canvas', () => {
    const onNestedComponentsChange = jest.fn();
    const { result } = renderHook(() =>
      useContainerHandler(
        createParams({
          container: { id: 'container-1', width: 8, height: 100 },
          onNestedComponentsChange,
        }),
      ),
    );

    const { canvasWrapper, gridItem } = createHardSelectedContainerDomWithMainCanvas();
    const oldItem = { i: 'child-1', x: 2, y: 0, w: 2, h: 2 } as ContainerLayoutItem;
    const newItem = { i: 'child-1', x: 2, y: 1, w: 2, h: 2 } as ContainerLayoutItem;

    const detectDragStopTargetSpy = jest.spyOn(ContainerManager, 'detectDragStopTarget');
    detectDragStopTargetSpy.mockReturnValue(null);

    try {
      act(() => {
        result.current.handleDragStop(
          [newItem],
          oldItem,
          newItem,
          {} as ContainerLayoutItem,
          new MouseEvent('mouseup', { clientX: 1190, clientY: 400 }) as unknown as MouseEvent,
          gridItem,
        );
      });
    } finally {
      detectDragStopTargetSpy.mockRestore();
      document.body.removeChild(canvasWrapper);
    }

    expect(onNestedComponentsChange).toHaveBeenCalledTimes(1);
    const updatedComponents = onNestedComponentsChange.mock.calls[0][0];
    const updatedChild = updatedComponents.find((component: any) => component.id === 'child-1');
    expect(updatedChild.containerId).toBeNull();
    expect(updatedChild.x).toBeGreaterThanOrEqual(0);
    expect(updatedChild.y).toBeGreaterThanOrEqual(0);
  });
});
