/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import { usePreemptiveEventHandlers } from './usePreemptiveEventHandlers';

function createGridLayout(): HTMLElement {
  const layout = document.createElement('div');
  layout.className = 'react-grid-layout';
  document.body.appendChild(layout);
  return layout;
}

function createGridItem(id: string, parent: HTMLElement): HTMLElement {
  const gridItem = document.createElement('div');
  gridItem.className = 'react-grid-item';
  gridItem.setAttribute('data-grid-item-id', id);
  parent.appendChild(gridItem);
  return gridItem;
}

describe('usePreemptiveEventHandlers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('canvas-drag-in-progress');
  });

  it('attaches mousedown/touchstart listeners with capture to grid layout', () => {
    const layout = createGridLayout();
    const addSpy = jest.spyOn(layout, 'addEventListener');

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), expect.objectContaining({ capture: true }));
    expect(addSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true }),
    );
  });

  it('attaches mouseup/touchend listeners to document', () => {
    createGridLayout();
    const addSpy = jest.spyOn(document, 'addEventListener');

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function), expect.objectContaining({ capture: true }));
    expect(addSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true }),
    );
  });

  it('calls onDragStart with componentId when mousedown on grid item', () => {
    const layout = createGridLayout();
    const gridItem = createGridItem('comp-1', layout);
    const onDragStart = jest.fn();

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart,
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    // Simulate mousedown on the grid item
    const event = new MouseEvent('mousedown', { bubbles: true });
    gridItem.dispatchEvent(event);

    expect(onDragStart).toHaveBeenCalledWith('comp-1');
  });

  it('calls onDragEnd when mouseup occurs', () => {
    createGridLayout();
    const onDragEnd = jest.fn();

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd,
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(onDragEnd).toHaveBeenCalled();
  });

  it('adds canvas-drag-in-progress class to body on mousedown', () => {
    const layout = createGridLayout();
    const gridItem = createGridItem('comp-1', layout);

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    gridItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(document.body.classList.contains('canvas-drag-in-progress')).toBe(true);
  });

  it('removes canvas-drag-in-progress class on mouseup', () => {
    const layout = createGridLayout();
    const gridItem = createGridItem('comp-1', layout);

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    gridItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(document.body.classList.contains('canvas-drag-in-progress')).toBe(true);

    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(document.body.classList.contains('canvas-drag-in-progress')).toBe(false);
  });

  it('cleans up listeners on unmount', () => {
    const layout = createGridLayout();
    const removeSpy = jest.spyOn(layout, 'removeEventListener');
    const docRemoveSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    );
    expect(removeSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true }),
    );
    expect(docRemoveSpy).toHaveBeenCalledWith(
      'mouseup',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    );
    expect(docRemoveSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true }),
    );
  });

  it('does NOT attach listeners when isDraggable is false', () => {
    const layout = createGridLayout();
    const addSpy = jest.spyOn(layout, 'addEventListener');

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: false,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates: jest.fn(),
        isMountedRef: { current: true },
      }),
    );

    // No mousedown/touchstart listeners should be attached to the grid layout
    const captureListenerCalls = addSpy.mock.calls.filter(([event, , options]) => {
      if (event !== 'mousedown' && event !== 'touchstart') return false;
      if (options === true) return true;
      return typeof options === 'object' && options !== null && 'capture' in options && options.capture === true;
    });
    expect(captureListenerCalls).toHaveLength(0);
  });

  it('calls clearAllDragStates on global dragend event', () => {
    createGridLayout();
    const clearAllDragStates = jest.fn();

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates,
        isMountedRef: { current: true },
      }),
    );

    document.dispatchEvent(new Event('dragend'));

    expect(clearAllDragStates).toHaveBeenCalled();
  });

  it('does not call clearAllDragStates on dragend when unmounted', () => {
    createGridLayout();
    const clearAllDragStates = jest.fn();
    const isMountedRef = { current: true };

    renderHook(() =>
      usePreemptiveEventHandlers({
        isDraggable: true,
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        clearAllDragStates,
        isMountedRef,
      }),
    );

    isMountedRef.current = false;
    document.dispatchEvent(new Event('dragend'));

    expect(clearAllDragStates).not.toHaveBeenCalled();
  });
});
