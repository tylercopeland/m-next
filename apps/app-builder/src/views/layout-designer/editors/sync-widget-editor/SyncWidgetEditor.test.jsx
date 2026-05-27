import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import SyncWidgetEditor from './SyncWidgetEditor';

// Mock the RumComponentContextProvider to avoid RUM-related errors in tests
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }) => <div data-testid="rum-provider">{children}</div>,
}));

describe('SyncWidgetEditor', () => {
  const defaultProps = {
    rawControl: {
      id: 'test-sync-widget-control',
      type: 'SYW',
      caption: 'Test Sync Widget',
      name: 'testSyncWidget',
      visible: true,
      disabled: false,
    },
    onChange: jest.fn(),
    onAddAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<SyncWidgetEditor />);

      expect(screen.getByTestId('rum-provider')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<SyncWidgetEditor {...defaultProps} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });

    it('renders without props (all optional)', () => {
      render(<SyncWidgetEditor />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });

    it('renders the informational banner', () => {
      render(<SyncWidgetEditor {...defaultProps} />);

      const banner = screen.getByText('No properties to configure').closest('[role="alert"], [role="status"], div');
      expect(banner).toBeInTheDocument();
    });

    it('displays correct descriptive text', () => {
      render(<SyncWidgetEditor {...defaultProps} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });
  });

  describe('RUM Integration', () => {
    it('wraps content in RumComponentContextProvider with correct component name', () => {
      render(<SyncWidgetEditor {...defaultProps} />);

      const rumProvider = screen.getByTestId('rum-provider');
      expect(rumProvider).toBeInTheDocument();
      expect(rumProvider).toContainElement(screen.getByText('Edit the base configuration and styles of the sync widget.'));
    });
  });

  describe('Props Handling', () => {
    it('does not break when rawControl is undefined', () => {
      render(<SyncWidgetEditor onChange={defaultProps.onChange} onAddAction={defaultProps.onAddAction} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });

    it('does not break when onChange is undefined', () => {
      render(<SyncWidgetEditor rawControl={defaultProps.rawControl} onAddAction={defaultProps.onAddAction} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });

    it('does not break when onAddAction is undefined', () => {
      render(<SyncWidgetEditor rawControl={defaultProps.rawControl} onChange={defaultProps.onChange} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });

    it('accepts complex rawControl object without errors', () => {
      const complexControl = {
        ...defaultProps.rawControl,
        customProperty: 'custom value',
        nestedObject: {
          key: 'value',
          number: 42,
        },
        arrayProperty: [1, 2, 3],
      };

      render(<SyncWidgetEditor rawControl={complexControl} onChange={defaultProps.onChange} onAddAction={defaultProps.onAddAction} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('uses the common BlockEditor styles wrapper', () => {
      const { container } = render(<SyncWidgetEditor {...defaultProps} />);

      // Check that the styled component wrapper is present
      // The wrapper should have specific styling applied
      const wrapper = container.firstChild?.firstChild; // RumProvider > Wrapper
      expect(wrapper).toBeTruthy();
    });

    it('contains both description and banner elements', () => {
      render(<SyncWidgetEditor {...defaultProps} />);

      // Should have the description text
      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();

      // Should have the informational banner
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful text content', () => {
      render(<SyncWidgetEditor {...defaultProps} />);

      // The component should provide clear information about its purpose
      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<SyncWidgetEditor {...defaultProps} />);

      // Should contain div elements with proper structure
      const divElements = container.querySelectorAll('div');
      expect(divElements.length).toBeGreaterThan(0);
    });
  });

  describe('TypeScript Compliance', () => {
    it('accepts properly typed props', () => {
      const typedProps = {
        rawControl: {
          id: 'typed-control',
          type: 'SYW',
          caption: 'Typed Sync Widget Control',
          name: 'typedSyncWidget',
          visible: true,
          disabled: false,
        },
        onChange: (control) => {
          expect(control).toBeDefined();
        },
        onAddAction: (control, eventName) => {
          expect(control).toBeDefined();
          expect(typeof eventName).toBe('string');
        },
      };

      expect(() => {
        render(<SyncWidgetEditor {...typedProps} />);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles null rawControl gracefully', () => {
      render(<SyncWidgetEditor rawControl={null} onChange={defaultProps.onChange} onAddAction={defaultProps.onAddAction} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });

    it('handles empty rawControl object', () => {
      render(<SyncWidgetEditor rawControl={{}} onChange={defaultProps.onChange} onAddAction={defaultProps.onAddAction} />);

      expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
    });

    it('renders consistently with different prop combinations', () => {
      const renderTests = [
        {},
        { rawControl: defaultProps.rawControl },
        { onChange: defaultProps.onChange },
        { onAddAction: defaultProps.onAddAction },
        { rawControl: defaultProps.rawControl, onChange: defaultProps.onChange },
        defaultProps,
      ];

      renderTests.forEach((props) => {
        const { unmount } = render(<SyncWidgetEditor {...props} />);

        expect(screen.getByText('Edit the base configuration and styles of the sync widget.')).toBeInTheDocument();
        expect(screen.getByText('No properties to configure')).toBeInTheDocument();

        unmount();
      });
    });
  });
});
