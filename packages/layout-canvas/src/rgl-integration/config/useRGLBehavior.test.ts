import { renderHook } from '@testing-library/react-hooks';
import { useRGLBehavior } from './useRGLBehavior';
import { createDesignerCanvasConfig, RGLBehaviorConfig } from './RGLBehaviorConfig';
import { ResponsiveComponent } from '../types';
import { Layout } from 'react-grid-layout';

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

function createMockLayout(overrides: Partial<Layout> = {}): Layout {
  return { i: 'comp-1', x: 0, y: 0, w: 2, h: 2, ...overrides } as Layout;
}

const mockPlaceholder = createMockLayout();

describe('useRGLBehavior', () => {
  describe('rglProps', () => {
    it('returns rglProps matching base config', () => {
      const config = createDesignerCanvasConfig();
      const { result } = renderHook(() => useRGLBehavior(config, []));

      expect(result.current.rglProps).toEqual(config.base);
    });
  });

  describe('wrapOnLayoutChange', () => {
    it('calls postCompact if provided', () => {
      const postCompact = jest.fn((layout: Layout[]) => layout);
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        compaction: { postCompact },
      };
      const components = [createMockComponent()];
      const { result } = renderHook(() => useRGLBehavior(config, components));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnLayoutChange(nativeHandler);

      const layout = [createMockLayout()];
      wrappedHandler(layout);

      expect(postCompact).toHaveBeenCalledWith(layout, components);
      expect(nativeHandler).toHaveBeenCalled();
    });

    it('passes through to native handler when no strategy provided', () => {
      const config = createDesignerCanvasConfig();
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnLayoutChange(nativeHandler);

      const layout = [createMockLayout()];
      wrappedHandler(layout);

      expect(nativeHandler).toHaveBeenCalledWith(layout);
    });

    it('calls beforeLayoutChange middleware before native handler', () => {
      const callOrder: string[] = [];
      const beforeLayoutChange = jest.fn((layout: Layout[]) => {
        callOrder.push('before');
        return layout;
      });
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        middleware: { beforeLayoutChange },
      };
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn(() => callOrder.push('native'));
      const wrappedHandler = result.current.wrappedHandlers.wrapOnLayoutChange(nativeHandler);

      wrappedHandler([createMockLayout()]);

      expect(callOrder).toEqual(['before', 'native']);
    });

    it('calls afterLayoutChange middleware after native handler', () => {
      const callOrder: string[] = [];
      const afterLayoutChange = jest.fn(() => callOrder.push('after'));
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        middleware: { afterLayoutChange },
      };
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn(() => callOrder.push('native'));
      const wrappedHandler = result.current.wrappedHandlers.wrapOnLayoutChange(nativeHandler);

      wrappedHandler([createMockLayout()]);

      expect(callOrder).toEqual(['native', 'after']);
    });
  });

  describe('wrapOnDragStart', () => {
    it('calls beforeDragStart middleware if provided', () => {
      const beforeDragStart = jest.fn();
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        middleware: { beforeDragStart },
      };
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnDragStart(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout();
      const newItem = createMockLayout();
      const element = document.createElement('div');
      const event = new MouseEvent('mousedown') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(beforeDragStart).toHaveBeenCalled();
      expect(nativeHandler).toHaveBeenCalled();
    });

    it('passes through to native handler when no strategy', () => {
      const config = createDesignerCanvasConfig();
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnDragStart(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout();
      const newItem = createMockLayout();
      const element = document.createElement('div');
      const event = new MouseEvent('mousedown') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(nativeHandler).toHaveBeenCalledWith(layout, oldItem, newItem, mockPlaceholder, event, element);
    });
  });

  describe('wrapOnDragStop', () => {
    it('enforces isPositionAllowed constraints', () => {
      const isPositionAllowed = jest.fn(() => false); // Reject all positions
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        drag: { isPositionAllowed },
      };
      const comp = createMockComponent({ id: 'comp-1' });
      const { result } = renderHook(() => useRGLBehavior(config, [comp]));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnDragStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout({ x: 0, y: 0 });
      const newItem = createMockLayout({ x: 5, y: 5 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      // Should revert to old position
      expect(nativeHandler).toHaveBeenCalled();
      const calledNewItem = nativeHandler.mock.calls[0][2];
      expect(calledNewItem.x).toBe(0);
      expect(calledNewItem.y).toBe(0);
    });

    it('applies snapToPosition if provided', () => {
      const snapToPosition = jest.fn(() => ({ x: 4, y: 6 }));
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        drag: { snapToPosition },
      };
      const comp = createMockComponent({ id: 'comp-1' });
      const { result } = renderHook(() => useRGLBehavior(config, [comp]));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnDragStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout({ x: 0, y: 0 });
      const newItem = createMockLayout({ x: 3, y: 5 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      const calledNewItem = nativeHandler.mock.calls[0][2];
      expect(calledNewItem.x).toBe(4);
      expect(calledNewItem.y).toBe(6);
    });

    it('calls afterDragStop middleware after native handler', () => {
      const callOrder: string[] = [];
      const afterDragStop = jest.fn(() => callOrder.push('after'));
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        middleware: { afterDragStop },
      };
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn(() => callOrder.push('native'));
      const wrappedHandler = result.current.wrappedHandlers.wrapOnDragStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout();
      const newItem = createMockLayout({ x: 2, y: 3 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(callOrder).toEqual(['native', 'after']);
    });

    it('passes through to native handler when no strategy', () => {
      const config = createDesignerCanvasConfig();
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnDragStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout();
      const newItem = createMockLayout({ x: 2, y: 3 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(nativeHandler).toHaveBeenCalledWith(layout, oldItem, newItem, mockPlaceholder, event, element);
    });
  });

  describe('wrapOnResizeStop', () => {
    it('applies getProportionalResize if provided', () => {
      const getProportionalResize = jest.fn(() => ({ w: 6, h: 3 }));
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        resize: { getProportionalResize },
      };
      const comp = createMockComponent({ id: 'comp-1' });
      const { result } = renderHook(() => useRGLBehavior(config, [comp]));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnResizeStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout({ w: 2, h: 2 });
      const newItem = createMockLayout({ w: 5, h: 4 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(getProportionalResize).toHaveBeenCalledWith(comp, { w: 2, h: 2 }, { w: 5, h: 4 });
      const calledNewItem = nativeHandler.mock.calls[0][2];
      expect(calledNewItem.w).toBe(6);
      expect(calledNewItem.h).toBe(3);
    });

    it('applies getLinkedResizeUpdates if provided', () => {
      const linkedUpdates = new Map([['comp-2', { w: 4, x: 6 }]]);
      const getLinkedResizeUpdates = jest.fn(() => linkedUpdates);
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        resize: { getLinkedResizeUpdates },
      };
      const comp1 = createMockComponent({ id: 'comp-1' });
      const comp2 = createMockComponent({ id: 'comp-2' });
      const { result } = renderHook(() => useRGLBehavior(config, [comp1, comp2]));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnResizeStop(nativeHandler);

      const layout = [createMockLayout({ i: 'comp-1' }), createMockLayout({ i: 'comp-2', w: 2, x: 8 })];
      const oldItem = createMockLayout({ w: 2, h: 2 });
      const newItem = createMockLayout({ w: 6, h: 2 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      // comp-2 in the layout should have been updated
      expect(layout[1]!.w).toBe(4);
      expect(layout[1]!.x).toBe(6);
    });

    it('calls afterResizeStop middleware after native handler', () => {
      const callOrder: string[] = [];
      const afterResizeStop = jest.fn(() => callOrder.push('after'));
      const config: RGLBehaviorConfig = {
        ...createDesignerCanvasConfig(),
        middleware: { afterResizeStop },
      };
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn(() => callOrder.push('native'));
      const wrappedHandler = result.current.wrappedHandlers.wrapOnResizeStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout({ w: 2, h: 2 });
      const newItem = createMockLayout({ w: 4, h: 3 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(callOrder).toEqual(['native', 'after']);
    });

    it('passes through to native handler when no strategy', () => {
      const config = createDesignerCanvasConfig();
      const { result } = renderHook(() => useRGLBehavior(config, []));

      const nativeHandler = jest.fn();
      const wrappedHandler = result.current.wrappedHandlers.wrapOnResizeStop(nativeHandler);

      const layout = [createMockLayout()];
      const oldItem = createMockLayout({ w: 2, h: 2 });
      const newItem = createMockLayout({ w: 4, h: 3 });
      const element = document.createElement('div');
      const event = new MouseEvent('mouseup') as unknown as MouseEvent;

      wrappedHandler(layout, oldItem, newItem, mockPlaceholder, event, element);

      expect(nativeHandler).toHaveBeenCalledWith(layout, oldItem, newItem, mockPlaceholder, event, element);
    });
  });
});
