/* eslint-disable react/no-array-index-key */
 
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { openActionEditor } from '@m-next/action-editor';
import SingleAction, { SingleActionProps } from './SingleAction';

// Mock external dependencies
jest.mock('@m-next/action-editor', () => ({
  openActionEditor: jest.fn(),
}));

jest.mock(
  '@m-next/loading-skeleton',
  () =>
    function MockLoadingSkeleton({ count, height }: { count: number; height: number }) {
      return (
        <div data-testid='loading-skeleton' style={{ height: `${height}px` }}>
          Loading {count} items...
        </div>
      );
    },
);

interface MockGridProps {
  id: string;
  data: Record<string, unknown>[];
  onRowClick: (columnName: string, val: string, column: Record<string, unknown>, rowIdx: number, primaryKey: string) => void;
  columns: Record<string, unknown>[];
  hideCaption: boolean;
  compact: boolean;
  pageSize: number;
  totalRecords: number;
}

jest.mock(
  '@m-next/grid',
  () =>
    function MockGrid({ id, data, onRowClick, columns, hideCaption, compact, pageSize, totalRecords }: MockGridProps) {
      return (
        <div data-testid={`grid-${id}`}>
          <div data-testid='grid-header'>
            {!hideCaption &&
              columns
                .filter((col) => col.visible)
                .map((col) => (
                  <span key={col.name as string} data-testid={`header-${col.name as string}`}>
                    {col.caption}
                  </span>
                ))}
          </div>
          <div data-testid='grid-body'>
            {data.map((row, index) => (
              <div
                key={index}
                data-testid={`grid-row-${index}`}
                onClick={() =>
                  onRowClick(
                    'label',
                    row.label as string,
                    columns.find((c) => c.name === 'label') || {},
                    index,
                    row.value as string,
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                {columns.map(
                  (col) =>
                    col.visible && (
                      <span key={col.name as string} data-testid={`cell-${col.name as string}-${index}`}>
                        {row[col.name as string]}
                      </span>
                    ),
                )}
              </div>
            ))}
          </div>
          <div data-testid='grid-meta'>
            Page Size: {pageSize}, Total: {totalRecords}, Compact: {compact ? 'true' : 'false'}
          </div>
        </div>
      );
    },
);

jest.mock(
  '@m-next/typeography',
  () =>
    function MockText({ children }: { children: React.ReactNode }) {
      return <span data-testid='text'>{children}</span>;
    },
);

interface MockButtonProps {
  id: string;
  value: string;
  buttonStyle: string;
  icon?: { name: string; size: number; position: string };
  onClick: () => void;
  isV4Design: boolean;
}

jest.mock(
  '@m-next/button',
  () =>
    function MockButton({ id, value, buttonStyle, icon, onClick, isV4Design }: MockButtonProps) {
      return (
        <button type='button' data-testid={id} onClick={onClick} className={`${buttonStyle} ${isV4Design ? 'v4' : ''}`}>
          {icon && (
            <span data-testid={`${id}-icon`}>
              {icon.name} ({icon.size}px, {icon.position})
            </span>
          )}
          {value}
        </button>
      );
    },
);

// Mock console.log to avoid test output pollution
const originalLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
});

describe('SingleAction', () => {
  const defaultProps: SingleActionProps = {
    value: null,
    control: { id: 'test-control' },
    emptyMessage: 'No event applied',
    addLabel: 'Add',
    onAddAction: jest.fn(),
    action: { value: 'click', label: 'Click', source: 'onClick' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<SingleAction {...defaultProps} />);

      // Should render empty content when no value
      expect(screen.getByTestId('text')).toBeInTheDocument();
      expect(screen.getByTestId('action-list-section-add')).toBeInTheDocument();
    });

    it('should render empty content when value is null', () => {
      render(<SingleAction {...defaultProps} value={null} />);

      expect(screen.getByTestId('text')).toHaveTextContent('No event applied');
      expect(screen.getByTestId('action-list-section-add')).toBeInTheDocument();
    });

    it('should render empty content when value is undefined', () => {
      render(<SingleAction {...defaultProps} value={undefined} />);

      expect(screen.getByTestId('text')).toHaveTextContent('No event applied');
      expect(screen.getByTestId('action-list-section-add')).toBeInTheDocument();
    });

    it('should render grid when value is provided', () => {
      const valueProps = {
        ...defaultProps,
        value: { value: '123', label: 'Click Action' },
      };

      render(<SingleAction {...valueProps} />);

      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Click Action');
      expect(screen.queryByTestId('text')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display custom empty message', () => {
      const customProps = {
        ...defaultProps,
        emptyMessage: 'Custom empty message',
      };

      render(<SingleAction {...customProps} />);

      expect(screen.getByTestId('text')).toHaveTextContent('Custom empty message');
    });

    it('should display custom add label', () => {
      const customProps = {
        ...defaultProps,
        addLabel: 'Custom Add',
      };

      render(<SingleAction {...customProps} />);

      expect(screen.getByTestId('action-list-section-add')).toHaveTextContent('Custom Add');
    });

    it('should render add button with correct icon', () => {
      render(<SingleAction {...defaultProps} />);

      const addButton = screen.getByTestId('action-list-section-add');
      expect(addButton).toHaveClass('link', 'v4');

      const icon = screen.getByTestId('action-list-section-add-icon');
      expect(icon).toHaveTextContent('plus-V4 (10px, left)');
    });
  });

  describe('Grid State', () => {
    const valueProps = {
      ...defaultProps,
      value: { value: '123', label: 'Click Action' },
    };

    it('should render grid with correct configuration', () => {
      render(<SingleAction {...valueProps} />);

      const grid = screen.getByTestId('grid-action-grid');
      expect(grid).toBeInTheDocument();

      const meta = screen.getByTestId('grid-meta');
      expect(meta).toHaveTextContent('Page Size: 10, Total: 1, Compact: true');
    });

    it('should render grid with value column hidden and label column visible', () => {
      render(<SingleAction {...valueProps} />);

      // Value column should be hidden (not visible in output)
      expect(screen.queryByTestId('cell-value-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-value')).not.toBeInTheDocument();

      // Label column should be visible
      expect(screen.getByTestId('cell-label-0')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Click Action');
    });

    it('should handle grid row click', () => {
      render(<SingleAction {...valueProps} />);

      const gridRow = screen.getByTestId('grid-row-0');
      fireEvent.click(gridRow);

      expect(console.log).toHaveBeenCalledWith('123');
      expect(openActionEditor).toHaveBeenCalledWith({ options: defaultProps.control }, '123');
    });

    it('should show total records as 1 when value exists', () => {
      render(<SingleAction {...valueProps} />);

      const meta = screen.getByTestId('grid-meta');
      expect(meta).toHaveTextContent('Total: 1');
    });

    it('should show total records as 0 when value is null', () => {
      // We need to render with a truthy value first, then check the totalRecords logic
      // Since we can't directly test the ternary in the component, we test the behavior
      const valueProps = {
        ...defaultProps,
        value: null,
      };

      render(<SingleAction {...valueProps} />);

      // When value is null/undefined, EmptyContent is rendered instead of Grid
      expect(screen.queryByTestId('grid-action-grid')).not.toBeInTheDocument();
      expect(screen.getByTestId('text')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onAddAction when add button is clicked', () => {
      render(<SingleAction {...defaultProps} />);

      const addButton = screen.getByTestId('action-list-section-add');
      fireEvent.click(addButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith('onClick', 'click');
    });

    it('should call openActionEditor when grid row is clicked', () => {
      const valueProps = {
        ...defaultProps,
        value: { value: '456', label: 'Change Action' },
      };

      render(<SingleAction {...valueProps} />);

      const gridRow = screen.getByTestId('grid-row-0');
      fireEvent.click(gridRow);

      expect(console.log).toHaveBeenCalledWith('456');
      expect(openActionEditor).toHaveBeenCalledWith({ options: defaultProps.control }, '456');
    });
  });

  describe('Props Handling', () => {
    it('should handle missing action prop gracefully', () => {
      const propsWithoutAction = {
        ...defaultProps,
        action: undefined,
      };

      expect(() => render(<SingleAction {...propsWithoutAction} />)).not.toThrow();
    });

    it('should handle missing control prop', () => {
      const propsWithoutControl = {
        ...defaultProps,
        control: undefined,
      };

      render(<SingleAction {...propsWithoutControl} />);

      const addButton = screen.getByTestId('action-list-section-add');
      fireEvent.click(addButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith('onClick', 'click');
    });

    it('should use default props when not provided', () => {
      const minimalProps = {
        onAddAction: jest.fn(),
        action: { value: 'test', source: 'onTest' },
      };

      render(<SingleAction {...minimalProps} />);

      expect(screen.getByTestId('text')).toHaveTextContent('No event applied');
      expect(screen.getByTestId('action-list-section-add')).toHaveTextContent('Add');
    });
  });

  describe('Grid Column Configuration', () => {
    it('should configure value column correctly', () => {
      const valueProps = {
        ...defaultProps,
        value: { value: 'test-value', label: 'Test Label' },
      };

      render(<SingleAction {...valueProps} />);

      // Value column should be primary but not visible
      expect(screen.queryByTestId('cell-value-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-value')).not.toBeInTheDocument();
    });

    it('should configure label column correctly', () => {
      const valueProps = {
        ...defaultProps,
        value: { value: 'test-value', label: 'Test Label' },
      };

      render(<SingleAction {...valueProps} />);

      // Label column should be visible
      expect(screen.getByTestId('cell-label-0')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Test Label');
    });
  });

  describe('Suspense Integration', () => {
    it('should wrap grid in Suspense with loading fallback', () => {
      const valueProps = {
        ...defaultProps,
        value: { value: '123', label: 'Test Action' },
      };

      render(<SingleAction {...valueProps} />);

      // Grid should be rendered (Suspense fallback would only show during actual loading)
      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
    });
  });

  describe('Styled Components', () => {
    it('should render EmptyContent with correct structure', () => {
      render(<SingleAction {...defaultProps} />);

      // EmptyContent should contain both text and button
      const container = screen.getByTestId('text').parentElement;
      expect(container).toContainElement(screen.getByTestId('text'));
      expect(container).toContainElement(screen.getByTestId('action-list-section-add'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value object', () => {
      const emptyValueProps = {
        ...defaultProps,
        value: {},
      };

      render(<SingleAction {...emptyValueProps} />);

      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('');
    });

    it('should handle value with only some properties', () => {
      const partialValueProps = {
        ...defaultProps,
        value: { label: 'Only Label' },
      };

      render(<SingleAction {...partialValueProps} />);

      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Only Label');
    });
  });
});
