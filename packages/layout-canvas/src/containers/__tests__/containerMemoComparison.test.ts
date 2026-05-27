import type { DragPreview } from '../../hooks/useCanvasDragState';
import type { ResponsiveComponent } from '../../rgl-integration/types';
import { containerMemoComparison } from '../utils/containerMemoComparison';

// Stable callback references so memo comparison doesn't trip on callback identity
const stableOnContainerClick = jest.fn();
const stableOnChildClick = jest.fn();
const stableRenderChildComponent = jest.fn();

// Helper to create a minimal LayoutContainerWrapperProps-like object
const createProps = (overrides: Record<string, unknown> = {}) => ({
  container: {
    id: 'c1',
    type: 'CONTAINER' as const,
    x: 0,
    y: 0,
    width: 8,
    height: 12,
    content: '',
    isHidden: false,
    containerId: null,
    static: false,
    currentState: 'normal',
    ...((overrides.container as Record<string, unknown>) || {}),
  },
  childComponents: [] as ResponsiveComponent[],
  selectedComponentId: undefined as string | undefined,
  onContainerClick: stableOnContainerClick,
  onChildClick: stableOnChildClick,
  renderChildComponent: stableRenderChildComponent,
  resolution: 'desktop' as const,
  mode: 'designer' as const,
  rowHeight: 30,
  isDraggable: true,
  isResizable: true,
  isDraggedOver: false,
  showHiddenComponents: false,
  style: {},
  dragPreview: undefined as DragPreview | undefined,
  ...overrides,
});

const makeChild = (id: string, x = 0, y = 0, width = 2, height = 2): ResponsiveComponent =>
  ({
    id,
    type: 'BTN',
    x,
    y,
    width,
    height,
    content: '',
    isHidden: false,
    containerId: 'c1',
    static: false,
  }) as unknown as ResponsiveComponent;

describe('containerMemoComparison', () => {
  it('should return true (skip rerender) when props are identical', () => {
    const props = createProps();
    expect(containerMemoComparison(props as any, props as any)).toBe(true);
  });

  it('should return false when container.id changes', () => {
    const prev = createProps();
    const next = createProps({ container: { id: 'c2' } });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  it('should return false when rowHeight changes', () => {
    const prev = createProps({ rowHeight: 30 });
    const next = createProps({ rowHeight: 50 });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  it('should return false when isDraggedOver changes', () => {
    const prev = createProps({ isDraggedOver: false });
    const next = createProps({ isDraggedOver: true });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  describe('selection changes', () => {
    it('should return false when container becomes selected', () => {
      const prev = createProps({ selectedComponentId: undefined });
      const next = createProps({ selectedComponentId: 'c1' });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return false when a child becomes selected', () => {
      const children = [makeChild('child-1')];
      const prev = createProps({ childComponents: children, selectedComponentId: undefined });
      const next = createProps({ childComponents: children, selectedComponentId: 'child-1' });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return true when selection changes to unrelated component', () => {
      const children = [makeChild('child-1')];
      const prev = createProps({ childComponents: children, selectedComponentId: 'other-1' });
      const next = createProps({ childComponents: children, selectedComponentId: 'other-2' });
      expect(containerMemoComparison(prev as any, next as any)).toBe(true);
    });

    it('should return false when different child is selected', () => {
      const children = [makeChild('child-1'), makeChild('child-2', 2, 0)];
      const prev = createProps({ childComponents: children, selectedComponentId: 'child-1' });
      const next = createProps({ childComponents: children, selectedComponentId: 'child-2' });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });
  });

  describe('childComponents changes', () => {
    it('should return false when child count changes', () => {
      const prev = createProps({ childComponents: [makeChild('child-1')] });
      const next = createProps({ childComponents: [makeChild('child-1'), makeChild('child-2', 2, 0)] });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return false when child position changes', () => {
      const prev = createProps({ childComponents: [makeChild('child-1', 0, 0)] });
      const next = createProps({ childComponents: [makeChild('child-1', 1, 0)] });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return false when child size changes', () => {
      const prev = createProps({ childComponents: [makeChild('child-1', 0, 0, 2, 2)] });
      const next = createProps({ childComponents: [makeChild('child-1', 0, 0, 3, 2)] });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return true when children are identical', () => {
      const children = [makeChild('child-1', 0, 0, 2, 2)];
      const prev = createProps({ childComponents: children });
      const next = createProps({ childComponents: children });
      expect(containerMemoComparison(prev as any, next as any)).toBe(true);
    });
  });

  it('should return false when style changes', () => {
    const prev = createProps({ style: { zIndex: '1' } });
    const next = createProps({ style: { zIndex: '2' } });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  it('should return false when container width changes', () => {
    const prev = createProps();
    const next = createProps({ container: { width: 12 } });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  it('should return false when container height changes', () => {
    const prev = createProps();
    const next = createProps({ container: { height: 20 } });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  it('should return false when showHiddenComponents changes', () => {
    const prev = createProps({ showHiddenComponents: false });
    const next = createProps({ showHiddenComponents: true });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  describe('dragPreview changes', () => {
    it('should return false when dragPreview becomes relevant to this container', () => {
      const prev = createProps({ dragPreview: undefined });
      const next = createProps({
        dragPreview: {
          visible: true,
          targetType: 'container',
          containerId: 'c1',
          position: { x: 0, y: 0, w: 2, h: 2 },
        },
      });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return true when dragPreview is irrelevant to this container', () => {
      const prev = createProps({ dragPreview: undefined });
      const next = createProps({
        dragPreview: {
          visible: true,
          targetType: 'container',
          containerId: 'other-container',
        },
      });
      expect(containerMemoComparison(prev as any, next as any)).toBe(true);
    });

    it('should return false when source container matches (cross-grid drag)', () => {
      const prev = createProps({ dragPreview: undefined });
      const next = createProps({
        dragPreview: {
          visible: true,
          targetType: 'canvas',
          sourceContainerId: 'c1',
        },
      });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });

    it('should return false when preview position changes', () => {
      const baseDragPreview = {
        visible: true,
        targetType: 'container' as const,
        containerId: 'c1',
        sourceContainerId: undefined,
      };
      const prev = createProps({
        dragPreview: { ...baseDragPreview, position: { x: 0, y: 0, w: 2, h: 2 } },
      });
      const next = createProps({
        dragPreview: { ...baseDragPreview, position: { x: 1, y: 0, w: 2, h: 2 } },
      });
      expect(containerMemoComparison(prev as any, next as any)).toBe(false);
    });
  });

  it('should return false when renderChildComponent changes', () => {
    const prev = createProps({ renderChildComponent: jest.fn() });
    const next = createProps({ renderChildComponent: jest.fn() });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });

  it('should return false when container.currentState changes', () => {
    const prev = createProps();
    const next = createProps({ container: { currentState: 'disabled' } });
    expect(containerMemoComparison(prev as any, next as any)).toBe(false);
  });
});
