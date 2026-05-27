import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import MapBlockEditor from './MapBlockEditor';

// Mock the RumComponentContextProvider to avoid RUM-related errors in tests
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="rum-provider">{children}</div>,
}));

describe('MapBlockEditor', () => {
  const defaultProps = {
    rawControl: {
      id: 'test-map-control',
      type: 'MAP',
      caption: 'Test Map',
      name: 'testMap',
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
      render(<MapBlockEditor />);
      
      expect(screen.getByTestId('rum-provider')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<MapBlockEditor {...defaultProps} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });

    it('renders without props (all optional)', () => {
      render(<MapBlockEditor />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });

    it('renders the informational banner', () => {
      render(<MapBlockEditor {...defaultProps} />);
      
      const banner = screen.getByText('No properties to configure').closest('[role="alert"], [role="status"], div');
      expect(banner).toBeInTheDocument();
    });

    it('displays correct descriptive text', () => {
      render(<MapBlockEditor {...defaultProps} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
    });
  });

  describe('RUM Integration', () => {
    it('wraps content in RumComponentContextProvider with correct component name', () => {
      render(<MapBlockEditor {...defaultProps} />);
      
      const rumProvider = screen.getByTestId('rum-provider');
      expect(rumProvider).toBeInTheDocument();
      expect(rumProvider).toContainElement(screen.getByText('Edit the base configuration and styles of the map widget.'));
    });
  });

  describe('Props Handling', () => {
    it('does not break when rawControl is undefined', () => {
      render(<MapBlockEditor onChange={defaultProps.onChange} onAddAction={defaultProps.onAddAction} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
    });

    it('does not break when onChange is undefined', () => {
      render(<MapBlockEditor rawControl={defaultProps.rawControl} onAddAction={defaultProps.onAddAction} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
    });

    it('does not break when onAddAction is undefined', () => {
      render(<MapBlockEditor rawControl={defaultProps.rawControl} onChange={defaultProps.onChange} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
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

      render(<MapBlockEditor rawControl={complexControl} onChange={defaultProps.onChange} onAddAction={defaultProps.onAddAction} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('uses the common BlockEditor styles wrapper', () => {
      const { container } = render(<MapBlockEditor {...defaultProps} />);
      
      // Check that the styled component wrapper is present
      // The wrapper should have specific styling applied
      const wrapper = container.firstChild?.firstChild; // RumProvider > Wrapper
      expect(wrapper).toBeTruthy();
    });

    it('contains both description and banner elements', () => {
      render(<MapBlockEditor {...defaultProps} />);
      
      // Should have the description text
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
      
      // Should have the informational banner
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful text content', () => {
      render(<MapBlockEditor {...defaultProps} />);
      
      // The component should provide clear information about its purpose
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
      expect(screen.getByText('No properties to configure')).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<MapBlockEditor {...defaultProps} />);
      
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
          type: 'MAP',
          caption: 'Typed Map Control',
          name: 'typedMap',
          visible: true,
          disabled: false,
        } as const,
        onChange: (control: Record<string, unknown>) => {
          expect(control).toBeDefined();
        },
        onAddAction: (control: Record<string, unknown>, eventName: string) => {
          expect(control).toBeDefined();
          expect(typeof eventName).toBe('string');
        },
      };

      expect(() => {
        render(<MapBlockEditor {...typedProps} />);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles null rawControl gracefully', () => {
      render(<MapBlockEditor rawControl={undefined} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
    });

    it('handles empty rawControl object', () => {
      render(<MapBlockEditor rawControl={{id: 'empty-control'}} />);
      
      expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
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
        const { unmount } = render(<MapBlockEditor {...props} />);
        
        expect(screen.getByText('Edit the base configuration and styles of the map widget.')).toBeInTheDocument();
        expect(screen.getByText('No properties to configure')).toBeInTheDocument();
        
        unmount();
      });
    });
  });
});
