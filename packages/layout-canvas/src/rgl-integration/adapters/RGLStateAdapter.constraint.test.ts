/**
 * Tests for dimension constraint enforcement in RGL State Adapter
 *
 * Verifies that displayRestrictions from unified control registry
 * are properly applied during component to layout item conversion
 */

import { RGLStateAdapterImpl } from './RGLStateAdapter';
import { ResponsiveComponent } from '../types';
import { widgets as WIDGETS } from '@m-next/types';

describe('RGLStateAdapter Dimension Constraints', () => {
  let adapter: RGLStateAdapterImpl;

  beforeEach(() => {
    adapter = new RGLStateAdapterImpl();
  });

  describe('componentToLayoutItem - Constraint Enforcement', () => {
    it('should apply displayRestrictions when provided', () => {
      const component: ResponsiveComponent = {
        id: 'test-button',
        type: WIDGETS.BUTTON,
        x: 0,
        y: 0,
        width: 3,
        height: 4,
        content: 'Test Button',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 2,
          maxWidth: 6,
          minHeight: 2,
          maxHeight: 6,
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.minW).toBe(2);
      expect(layoutItem.maxW).toBe(6);
      expect(layoutItem.minH).toBe(2);
      expect(layoutItem.maxH).toBe(6);
    });

    it('should use default constraints when displayRestrictions not provided', () => {
      const component: ResponsiveComponent = {
        id: 'test-component',
        type: WIDGETS.LABEL,
        x: 0,
        y: 0,
        width: 4,
        height: 2,
        content: 'Test Label',
        currentState: 0,
        containerId: null,
        static: false,
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      // Should use default constraints
      expect(layoutItem.minW).toBe(1);
      expect(layoutItem.maxW).toBe(12);
      expect(layoutItem.minH).toBe(2); // Minimum enforced
      expect(layoutItem.maxH).toBeUndefined(); // No limit
    });

    it('should enforce minimum height of 2 rows', () => {
      const component: ResponsiveComponent = {
        id: 'test-grid',
        type: WIDGETS.DATATABLE,
        x: 0,
        y: 0,
        width: 8,
        height: 24,
        content: 'Test Grid',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 4,
          maxWidth: 12,
          minHeight: 8,
          maxHeight: 48,
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.minH).toBe(8); // Component-specific minimum
      expect(layoutItem.minH).toBeGreaterThanOrEqual(2); // Global minimum enforced
    });

    it('should handle large data visualization constraints', () => {
      const component: ResponsiveComponent = {
        id: 'test-chart',
        type: WIDGETS.CHART,
        x: 0,
        y: 0,
        width: 6,
        height: 16,
        content: 'Test Chart',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 4,
          maxWidth: 12,
          minHeight: 8,
          maxHeight: 48,
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.minW).toBe(4);
      expect(layoutItem.maxW).toBe(12);
      expect(layoutItem.minH).toBe(8);
      expect(layoutItem.maxH).toBe(48);
    });

    it('should handle container constraints', () => {
      const component: ResponsiveComponent = {
        id: 'test-container',
        type: WIDGETS.LAYOUT_CONTAINER,
        x: 0,
        y: 0,
        width: 8,
        height: 24,
        content: 'Test Container',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 2,
          maxWidth: 12,
          minHeight: 4,
          maxHeight: 48,
        },
        container: {
          direction: 'column',
          children: [],
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.minW).toBe(2);
      expect(layoutItem.maxW).toBe(12);
      expect(layoutItem.minH).toBe(4);
      expect(layoutItem.maxH).toBe(48);
    });

    it('should preserve component position and size', () => {
      const component: ResponsiveComponent = {
        id: 'test-input',
        type: WIDGETS.TEXTBOX,
        x: 3,
        y: 5,
        width: 4,
        height: 2,
        content: 'Test Input',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 2,
          maxWidth: 8,
          minHeight: 2,
          maxHeight: 4,
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.x).toBe(3);
      expect(layoutItem.y).toBe(5);
      expect(layoutItem.w).toBe(4);
      expect(layoutItem.h).toBe(2);
    });

    it('should mark items as draggable and resizable', () => {
      const component: ResponsiveComponent = {
        id: 'test-dropdown',
        type: WIDGETS.DROPDOWN,
        x: 0,
        y: 0,
        width: 4,
        height: 2,
        content: 'Test Dropdown',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 2,
          maxWidth: 8,
          minHeight: 2,
          maxHeight: 4,
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.isDraggable).toBe(true);
      expect(layoutItem.isResizable).toBe(true);
    });

    it('should handle undefined maxHeight correctly', () => {
      const component: ResponsiveComponent = {
        id: 'test-component',
        type: WIDGETS.HTMLEDITOR,
        x: 0,
        y: 0,
        width: 6,
        height: 12,
        content: 'Test HTML Editor',
        currentState: 0,
        containerId: null,
        static: false,
        displayRestrictions: {
          minWidth: 4,
          maxWidth: 12,
          minHeight: 8,
          // maxHeight intentionally undefined (no limit)
        },
      };

      const layoutItem = adapter.componentToLayoutItem(component);

      expect(layoutItem.minH).toBe(8);
      expect(layoutItem.maxH).toBeUndefined(); // No height limit
    });
  });
});
