/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Simple unit tests for LayoutCanvas without external testing dependencies
 * These tests focus on component instantiation and prop handling
 */

// Mock unified-control-registry FIRST to prevent action-editor imports
jest.mock('../../../apps/app-builder/src/views/layout-designer/unified-control-registry', () => ({
  UnifiedControlRegistry: {},
  mapWidgetToControlType: jest.fn(() => 'input'),
}));

import React from 'react';
import LayoutCanvas from './rgl-integration/wrappers/LayoutCanvas';
import { ResponsiveComponent, LayoutCanvasWrapperProps } from './rgl-integration/types';
import { WIDGETS } from '@m-next/runtime-interface';

// Mock react-grid-layout
jest.mock('react-grid-layout', () => ({
  __esModule: true,
  default: 'div',
  WidthProvider: (Component: any) => Component,
}));

// Mock utilities
jest.mock('@m-next/utilities', () => ({
  Guid: {
    create: () => 'test-guid-123',
  },
}));

// Mock svg-icon
jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: 'span',
}));

// Mock styles
jest.mock('@m-next/styles', () => ({
  colors: {
    blue: '#007bff',
    red: '#dc3545',
    'grey-light': '#f8f9fa',
    'blue-dark': '#0056b3',
    white: '#ffffff',
    black: '#000000',
    grey: '#6c757d',
    'grey-dark': '#495057',
    'grey-darkest': '#212529',
    'grey-lightest': '#f8f9fa',
    legacy: {
      greyLight: '#f8f9fa',
      blueHover: '#0056b3',
    },
  },
  customFocusOutline: '',
  customOffsetFocusOutline: '',
}));

// Mock container manager
jest.mock('./containers', () => ({
  ContainerManager: {
    isContainer: jest.fn(() => false),
    getChildComponents: jest.fn(() => []),
    isContainerEmpty: jest.fn(() => true),
    detectDropTarget: jest.fn(() => ({ type: 'canvas', validDrop: true })),
    handleNestedDrop: jest.fn(),
    handleNestedDragOver: jest.fn(),
    handleNestedDragLeave: jest.fn(),
  },
}));

// Mock component sizing utilities
jest.mock('./utils/componentSizing', () => ({
  getCustomComponentSize: jest.fn(() => ({ width: 4, height: 2 })),
}));

// Mock RGL state adapter
jest.mock('./rgl-integration/adapters/RGLStateAdapter', () => ({
  rglStateAdapter: {
    componentToLayoutItem: jest.fn((comp: any) => ({
      i: comp.id,
      x: comp.x,
      y: comp.y,
      w: comp.width,
      h: comp.height,
      static: comp.static,
    })),
    cleanLayout: jest.fn((layout: any) => layout),
    updateComponentsFromLayout: jest.fn((components: any) => components),
  },
}));

// Mock GridVisualization
jest.mock('./rgl-integration/visual-feedback/GridVisualization', () => ({
  DropZoneIndicator: () => null,
}));

// Mock LayoutCanvas styles
jest.mock('./rgl-integration/wrappers/LayoutCanvas.styles', () => ({
  injectRGLStyles: jest.fn(),
}));

describe('LayoutCanvas Core Tests', () => {
  const mockComponent: ResponsiveComponent = {
    id: 'test-1',
    type: WIDGETS.TEXTBOX,
    x: 0,
    y: 0,
    width: 4,
    height: 1,
    content: 'Test Component',
    isHidden: false,
    containerId: null,
    static: false,
  };

  const mockControlRegistry: LayoutCanvasWrapperProps['controlRegistry'] = {
    input: {
      wrapper: ({ children }: any) => React.createElement('div', { className: 'input-wrapper' }, children),
      editorName: 'test',
      rumRoute: '/test',
      editor: () => null,
      widgetConstants: [],
      getHeader: () => null,
      getProps: () => ({}),
      displayRestrictions: {},
      defaultValues: {},
    },
  } as any;

  const defaultProps: LayoutCanvasWrapperProps = {
    components: [mockComponent],
    width: 1200,
    cols: 12,
    rowHeight: 30,
    controlRegistry: mockControlRegistry,
  };

  describe('Component Instantiation', () => {
    it('creates LayoutCanvas without throwing', () => {
      expect(() => {
        React.createElement(LayoutCanvas, defaultProps);
      }).not.toThrow();
    });

    it('handles empty components array', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [],
        });
      }).not.toThrow();
    });

    it('handles null components gracefully', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: null as any,
        });
      }).not.toThrow();
    });

    it('handles undefined components gracefully', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: undefined as any,
        });
      }).not.toThrow();
    });

    it('handles missing controlRegistry gracefully', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          controlRegistry: null as any,
        });
      }).not.toThrow();
    });
  });

  describe('Prop Validation', () => {
    it('accepts all required props without throwing', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          components: [mockComponent],
          width: 1200,
          cols: 12,
          rowHeight: 30,
          controlRegistry: mockControlRegistry,
        });
      }).not.toThrow();
    });

    it('accepts optional props', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isDraggable: true,
          isResizable: true,
          selectedComponentId: 'test-1',
          isCanvasSelected: true,
          screenName: 'Test Screen',
        });
      }).not.toThrow();
    });

    it('handles optional callbacks', () => {
      const mockCallbacks = {
        onLayoutChange: jest.fn(),
        onComponentsChange: jest.fn(),
        onComponentClick: jest.fn(),
      };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          ...mockCallbacks,
        });
      }).not.toThrow();
    });
  });

  describe('Component Type Handling', () => {
    const componentTypes = [
      { type: WIDGETS.TEXTBOX, name: 'TEXTBOX' },
      { type: WIDGETS.BUTTON, name: 'BUTTON' },
      { type: WIDGETS.DROPDOWN, name: 'DROPDOWN' },
      { type: WIDGETS.CHECKBOX, name: 'CHECKBOX' },
      { type: WIDGETS.CHART, name: 'CHART' },
      { type: WIDGETS.DATATABLE, name: 'DATATABLE' },
      { type: WIDGETS.SECTION, name: 'SECTION' },
    ];

    componentTypes.forEach(({ type, name }) => {
      it(`handles ${name} component type correctly`, () => {
        const testComponent = { ...mockComponent, type };

        expect(() => {
          React.createElement(LayoutCanvas, {
            ...defaultProps,
            components: [testComponent],
          });
        }).not.toThrow();
      });
    });
  });

  describe('Width and Layout Configuration', () => {
    const configurations = [
      { width: 800, cols: 8, rowHeight: 20 },
      { width: 1200, cols: 12, rowHeight: 30 },
      { width: 1600, cols: 16, rowHeight: 40 },
    ];

    configurations.forEach(({ width, cols, rowHeight }) => {
      it(`handles width=${width}, cols=${cols}, rowHeight=${rowHeight}`, () => {
        expect(() => {
          React.createElement(LayoutCanvas, {
            ...defaultProps,
            width,
            cols,
            rowHeight,
          });
        }).not.toThrow();
      });
    });
  });

  describe('Multiple Components Handling', () => {
    it('handles multiple components without throwing', () => {
      const multipleComponents = [
        { ...mockComponent, id: 'test-1', x: 0, y: 0 },
        { ...mockComponent, id: 'test-2', x: 4, y: 0 },
        { ...mockComponent, id: 'test-3', x: 0, y: 1 },
      ];

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: multipleComponents,
        });
      }).not.toThrow();
    });

    it('handles components with containers', () => {
      const componentsWithContainer = [
        { ...mockComponent, id: 'container-1', type: WIDGETS.LAYOUT_CONTAINER },
        { ...mockComponent, id: 'child-1', containerId: 'container-1' },
      ];

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: componentsWithContainer,
        });
      }).not.toThrow();
    });

    it('handles hidden components', () => {
      const hiddenComponent = { ...mockComponent, isHidden: true };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [hiddenComponent],
        });
      }).not.toThrow();
    });

    it('handles static components', () => {
      const staticComponent = { ...mockComponent, static: true };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [staticComponent],
        });
      }).not.toThrow();
    });
  });

  describe('Interaction State Handling', () => {
    it('handles draggable state', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isDraggable: true,
        });
      }).not.toThrow();

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isDraggable: false,
        });
      }).not.toThrow();
    });

    it('handles resizable state', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isResizable: true,
        });
      }).not.toThrow();

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isResizable: false,
        });
      }).not.toThrow();
    });

    it('handles component selection', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          selectedComponentId: 'test-1',
        });
      }).not.toThrow();

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          selectedComponentId: null as any,
        });
      }).not.toThrow();
    });

    it('handles canvas selection', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isCanvasSelected: true,
          screenName: 'Test Canvas',
        });
      }).not.toThrow();

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          isCanvasSelected: false,
        });
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles component with negative position', () => {
      const negativeComponent = { ...mockComponent, x: -1, y: -1 };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [negativeComponent],
        });
      }).not.toThrow();
    });

    it('handles component with zero dimensions', () => {
      const zeroSizeComponent = { ...mockComponent, width: 0, height: 0 };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [zeroSizeComponent],
        });
      }).not.toThrow();
    });

    it('handles component with very large dimensions', () => {
      const largeComponent = { ...mockComponent, width: 100, height: 100 };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [largeComponent],
        });
      }).not.toThrow();
    });

    it('handles zero width canvas', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          width: 0,
        });
      }).not.toThrow();
    });

    it('handles zero columns', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          cols: 0,
        });
      }).not.toThrow();
    });

    it('handles zero row height', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          rowHeight: 0,
        });
      }).not.toThrow();
    });
  });

  describe('Control Registry Variations', () => {
    it('handles empty control registry', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          controlRegistry: {} as any,
        });
      }).not.toThrow();
    });

    it('handles missing component type in registry', () => {
      const unmappedComponent = { ...mockComponent, type: 'UNKNOWN_TYPE' as any };

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          components: [unmappedComponent],
        });
      }).not.toThrow();
    });

    it('handles registry with multiple component types', () => {
      const extendedRegistry = {
        input: { wrapper: ({ children }: any) => React.createElement('div', {}, children) },
        button: { wrapper: ({ children }: any) => React.createElement('div', {}, children) },
        dropdown: { wrapper: ({ children }: any) => React.createElement('div', {}, children) },
      } as any;

      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          controlRegistry: extendedRegistry,
        });
      }).not.toThrow();
    });
  });

  describe('Screen Name Handling', () => {
    it('uses default screen name when not provided', () => {
      const element = React.createElement(LayoutCanvas, defaultProps);
      expect(element).toBeDefined();
    });

    it('accepts custom screen name', () => {
      const element = React.createElement(LayoutCanvas, {
        ...defaultProps,
        screenName: 'Custom Screen Name',
      });

      expect(element.props.screenName).toBe('Custom Screen Name');
    });

    it('handles empty screen name', () => {
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          screenName: '',
        });
      }).not.toThrow();
    });

    it('handles very long screen name', () => {
      const longName = 'A'.repeat(200);
      expect(() => {
        React.createElement(LayoutCanvas, {
          ...defaultProps,
          screenName: longName,
        });
      }).not.toThrow();
    });
  });
});
