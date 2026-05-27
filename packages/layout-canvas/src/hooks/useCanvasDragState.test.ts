import { renderHook, act } from '@testing-library/react-hooks';
import { useCanvasDragState } from './useCanvasDragState';

describe('useCanvasDragState', () => {
  afterEach(() => {
    // Clean up window global
    // @ts-expect-error - test cleanup
    delete (window as Record<string, unknown>).__draggedComponentType;
    // @ts-expect-error - test cleanup
    delete (window as Record<string, unknown>).__draggedComponentConfig;
  });

  it('initializes all state to default values', () => {
    const { result } = renderHook(() => useCanvasDragState());

    expect(result.current.dragPreview).toEqual({ visible: false });
    expect(result.current.isDragOver).toBe(false);
    expect(result.current.currentDraggedComponent).toBeNull();
    expect(result.current.activeDragComponentId).toBeNull();
    expect(result.current.draggedComponentType).toBeNull();
    expect(result.current.dragOverContainerId).toBeNull();
    expect(result.current.draggedComponentId).toBeNull();
    expect(result.current.invalidDropTargetId).toBeNull();
    expect(result.current.currentlyResizingComponentId).toBeNull();
    expect(result.current.dragOverCanvas).toBeNull();
  });

  it('clearAllDragStates resets all state variables to defaults', () => {
    const { result } = renderHook(() => useCanvasDragState());

    // Set various states
    act(() => {
      result.current.setIsDragOver(true);
      result.current.setDraggedComponentId('comp-1');
      result.current.setActiveDragComponentId('comp-2');
      result.current.setDraggedComponentType('BTN');
      result.current.setInvalidDropTargetId('container-1');
      result.current.setDragOverContainerId('container-2');
      result.current.setCurrentDraggedComponent({ id: 'comp-1' } as any);
    });

    // Verify states are set
    expect(result.current.isDragOver).toBe(true);
    expect(result.current.draggedComponentId).toBe('comp-1');

    // Clear all
    act(() => {
      result.current.clearAllDragStates();
    });

    expect(result.current.dragPreview).toEqual({ visible: false });
    expect(result.current.isDragOver).toBe(false);
    expect(result.current.currentDraggedComponent).toBeNull();
    expect(result.current.draggedComponentType).toBeNull();
    expect(result.current.dragOverContainerId).toBeNull();
    expect(result.current.draggedComponentId).toBeNull();
    expect(result.current.invalidDropTargetId).toBeNull();
    expect(result.current.activeDragComponentId).toBeNull();
  });

  it('clearAllDragStates removes window.__draggedComponentType', () => {
    // @ts-expect-error - test setup
    (window as Record<string, unknown>).__draggedComponentType = 'BTN';
    // @ts-expect-error - test setup
    (window as Record<string, unknown>).__draggedComponentConfig = '{"type":"BTN"}';

    const { result } = renderHook(() => useCanvasDragState());

    act(() => {
      result.current.clearAllDragStates();
    });

    // @ts-expect-error - test assertion
    expect((window as Record<string, unknown>).__draggedComponentType).toBeUndefined();
    // @ts-expect-error - test assertion
    expect((window as Record<string, unknown>).__draggedComponentConfig).toBeUndefined();
  });

  it('isDragInProgress is true when draggedComponentId is set', () => {
    const { result } = renderHook(() => useCanvasDragState());

    act(() => {
      result.current.setDraggedComponentId('comp-1');
    });

    expect(result.current.isDragInProgress).toBe(true);
  });

  it('isDragInProgress is true when activeDragComponentId is set', () => {
    const { result } = renderHook(() => useCanvasDragState());

    act(() => {
      result.current.setActiveDragComponentId('comp-2');
    });

    expect(result.current.isDragInProgress).toBe(true);
  });

  it('isDragInProgress is false when both are null', () => {
    const { result } = renderHook(() => useCanvasDragState());

    expect(result.current.isDragInProgress).toBe(false);
  });

  it('isResizeInProgress is true when currentlyResizingComponentId is set', () => {
    const { result } = renderHook(() => useCanvasDragState());

    act(() => {
      result.current.setCurrentlyResizingComponentId('comp-1');
    });

    expect(result.current.isResizeInProgress).toBe(true);
  });

  it('isResizeInProgress is false when currentlyResizingComponentId is null', () => {
    const { result } = renderHook(() => useCanvasDragState());

    expect(result.current.isResizeInProgress).toBe(false);
  });

  it('state setters update individual values correctly', () => {
    const { result } = renderHook(() => useCanvasDragState());

    act(() => {
      result.current.setDragOverCanvas('container-1');
    });
    expect(result.current.dragOverCanvas).toBe('container-1');

    act(() => {
      result.current.setDragPreview({ visible: true, componentType: 'BTN' });
    });
    expect(result.current.dragPreview).toEqual({ visible: true, componentType: 'BTN' });
  });
});
