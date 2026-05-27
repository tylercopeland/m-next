import { createDesignerCanvasConfig, createRuntimeCanvasConfig, createContainerConfig } from './RGLBehaviorConfig';
import { ResponsiveComponent } from '../types';

function createMockContainer(overrides: Partial<ResponsiveComponent> = {}): ResponsiveComponent {
  return {
    id: 'container-1',
    type: 'L-CON',
    x: 0,
    y: 0,
    width: 8,
    height: 12,
    containerId: null,
    showBorder: true,
    ...overrides,
  } as ResponsiveComponent;
}

describe('RGLBehaviorConfig', () => {
  describe('createDesignerCanvasConfig', () => {
    it('returns compactType null', () => {
      const config = createDesignerCanvasConfig();
      expect(config.base.compactType).toBeNull();
    });

    it('returns preventCollision true', () => {
      const config = createDesignerCanvasConfig();
      expect(config.base.preventCollision).toBe(true);
    });

    it('returns drag handle ".drag-handle"', () => {
      const config = createDesignerCanvasConfig();
      expect(config.base.draggableHandle).toBe('.drag-handle');
    });

    it('returns isDraggable true', () => {
      const config = createDesignerCanvasConfig();
      expect(config.base.isDraggable).toBe(true);
    });

    it('returns isDroppable true', () => {
      const config = createDesignerCanvasConfig();
      expect(config.base.isDroppable).toBe(true);
    });

    it('returns resize handles [s, e, w]', () => {
      const config = createDesignerCanvasConfig();
      expect(config.base.resizeHandles).toEqual(['s', 'e', 'w']);
    });

    it('merges overrides correctly', () => {
      const config = createDesignerCanvasConfig({ compactType: 'vertical' });
      expect(config.base.compactType).toBe('vertical');
      // Non-overridden values remain default
      expect(config.base.preventCollision).toBe(true);
    });

    it('returns empty strategy objects', () => {
      const config = createDesignerCanvasConfig();
      expect(config.compaction).toEqual({});
      expect(config.drag).toEqual({});
      expect(config.resize).toEqual({});
    });
  });

  describe('createRuntimeCanvasConfig', () => {
    it('returns isDraggable false', () => {
      const config = createRuntimeCanvasConfig();
      expect(config.base.isDraggable).toBe(false);
    });

    it('returns isResizable false', () => {
      const config = createRuntimeCanvasConfig();
      expect(config.base.isResizable).toBe(false);
    });

    it('returns empty resizeHandles', () => {
      const config = createRuntimeCanvasConfig();
      expect(config.base.resizeHandles).toEqual([]);
    });

    it('returns isDroppable false', () => {
      const config = createRuntimeCanvasConfig();
      expect(config.base.isDroppable).toBe(false);
    });

    it('returns compactType null', () => {
      const config = createRuntimeCanvasConfig();
      expect(config.base.compactType).toBeNull();
    });
  });

  describe('createContainerConfig', () => {
    it('always uses compactType null (static layout)', () => {
      const container = createMockContainer();
      const config = createContainerConfig(container, true);
      expect(config.base.compactType).toBeNull();
    });

    it('always sets preventCollision to true', () => {
      const container = createMockContainer();
      const runtimeConfig = createContainerConfig(container, false);
      expect(runtimeConfig.base.preventCollision).toBe(true);

      const designerConfig = createContainerConfig(container, true);
      expect(designerConfig.base.preventCollision).toBe(true);
    });

    it('uses nested drag handles for containers', () => {
      const container = createMockContainer();
      const config = createContainerConfig(container, true);
      expect(config.base.draggableHandle).toBe('.nested-drag-handle,.nested-component-drag-area');
    });

    it('sets containerPadding based on showBorder', () => {
      const withBorder = createMockContainer({ showBorder: true });
      const config1 = createContainerConfig(withBorder, true);
      expect(config1.base.containerPadding).toEqual([8, 8]);

      const noBorder = createMockContainer({ showBorder: false });
      const config2 = createContainerConfig(noBorder, true);
      expect(config2.base.containerPadding).toEqual([0, 0]);
    });

    it('returns empty resize handles in runtime mode', () => {
      const container = createMockContainer();
      const config = createContainerConfig(container, false);
      expect(config.base.resizeHandles).toEqual([]);
    });

    it('merges overrides correctly', () => {
      const container = createMockContainer();
      const config = createContainerConfig(container, true, { margin: [4, 4] });
      expect(config.base.margin).toEqual([4, 4]);
      // Non-overridden values remain
      expect(config.base.useCSSTransforms).toBe(false);
    });
  });
});
