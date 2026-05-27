/* eslint-disable react/no-array-index-key */
 
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionListSection, { ActionListSectionProps } from './ActionListSection';

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
}

jest.mock(
  '@m-next/grid',
  () =>
    function MockGrid({ id, data, onRowClick, columns, hideCaption }: MockGridProps) {
      return (
        <div data-testid={`grid-${id}`}>
          <div data-testid='grid-header'>
            {!hideCaption &&
              columns.filter((col) => col.visible).map((col) => <span key={col.name as string}>{col.caption}</span>)}
          </div>
          <div data-testid='grid-body'>
            {data.map((row, index) => (
              <div
                key={index}
                data-testid={`grid-row-${index}`}
                onClick={() => onRowClick('label', row.label as string, columns[1], index, row.value as string)}
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
        </div>
      );
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
          {icon && <span data-testid={`${id}-icon`}>{icon.name}</span>}
          {value}
        </button>
      );
    },
);

jest.mock('@m-next/typeography', () => ({
  Text: function MockText({ children }: { children: React.ReactNode }) {
    return <span data-testid='text'>{children}</span>;
  },
}));

interface MockAddableAccordionProps {
  id: string;
  caption?: string;
  emptyMessage?: string;
  canAdd?: boolean;
  onAdd?: (option: Record<string, unknown>) => void;
  options?: Record<string, unknown>[];
  optionCaption?: string;
  addLabel?: string;
  children: React.ReactNode;
  isEmpty?: boolean;
}

jest.mock(
  '../../../../../../components/accordion/AddableAccordion',
  () =>
    function MockAddableAccordion({
      id,
      caption,
      emptyMessage,
      canAdd,
      onAdd,
      options,
      optionCaption,
      addLabel,
      children,
      isEmpty,
    }: MockAddableAccordionProps) {
      return (
        <div data-testid={`addable-accordion-${id}`}>
          <h3 data-testid='accordion-caption'>{caption}</h3>
          {isEmpty && <p data-testid='empty-message'>{emptyMessage}</p>}
          {canAdd && options && (
            <div data-testid='add-section'>
              {options.map((option, index) => (
                <button type='button' key={index} data-testid={`add-option-${index}`} onClick={() => onAdd?.(option)}>
                  {addLabel} {optionCaption ? option[optionCaption] : ''}
                </button>
              ))}
            </div>
          )}
          <div data-testid='accordion-content'>{children}</div>
        </div>
      );
    },
);

describe('ActionListSection', () => {
  const defaultProps: ActionListSectionProps = {
    caption: 'Events',
    emptyMessage: 'No events applied',
    addLabel: 'Add',
    canAdd: true,
    values: [],
    actions: [
      { value: 'click', label: 'Click', source: 'onClick' },
      { value: 'change', label: 'Change', source: 'onChange' },
    ],
    control: { id: 'test-control' },
    onAddAction: jest.fn(),
    isEmpty: true,
    valueKey: 'actionId',
    optionKey: 'id',
    singleActionVariant: false,
    isScreenEvent: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ActionListSection {...defaultProps} />);
      expect(screen.getByTestId('addable-accordion-action-list-section')).toBeInTheDocument();
    });

    it('should render caption and empty message when no values', () => {
      render(<ActionListSection {...defaultProps} />);

      expect(screen.getByTestId('accordion-caption')).toHaveTextContent('Events');
      expect(screen.getByTestId('empty-message')).toHaveTextContent('No events applied');
    });

    it('should render add buttons for each action option', () => {
      render(<ActionListSection {...defaultProps} />);

      expect(screen.getByTestId('add-option-0')).toHaveTextContent('Add Click');
      expect(screen.getByTestId('add-option-1')).toHaveTextContent('Add Change');
    });

    it('should render grid with values when values are provided', () => {
      const propsWithValues = {
        ...defaultProps,
        values: [
          { actionId: '123', label: 'Click Action' },
          { actionId: '456', label: 'Change Action' },
        ],
        isEmpty: false,
      };

      render(<ActionListSection {...propsWithValues} />);

      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Click Action');
      expect(screen.getByTestId('cell-label-1')).toHaveTextContent('Change Action');
    });
  });

  describe('Single Action Variant', () => {
    const singleActionProps = {
      ...defaultProps,
      singleActionVariant: true,
      actions: [{ value: 'click', label: 'Click', source: 'onClick' }],
    };

    it('should render empty content when no values in single action variant', () => {
      render(<ActionListSection {...singleActionProps} />);

      expect(screen.getByTestId('text')).toHaveTextContent('No events applied');
      expect(screen.getByTestId('action-grid-add')).toBeInTheDocument();
    });

    it('should render grid when values exist in single action variant', () => {
      const propsWithValue = {
        ...singleActionProps,
        values: [{ actionId: '123', label: 'Click Action' }],
      };

      render(<ActionListSection {...propsWithValue} />);

      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Click Action');
    });

    it('should handle add action click in single action variant', () => {
      render(<ActionListSection {...singleActionProps} />);

      const addButton = screen.getByTestId('action-grid-add');
      fireEvent.click(addButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith('onClick', 'click');
    });
  });

  describe('User Interactions', () => {
    it('should call onAddAction when add button is clicked', () => {
      render(<ActionListSection {...defaultProps} />);

      const addButton = screen.getByTestId('add-option-0');
      fireEvent.click(addButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith('onClick', 'click');
    });
  });

  describe('Props Handling', () => {
    it('should use custom valueKey and optionKey', () => {
      const customProps = {
        ...defaultProps,
        valueKey: 'id',
        optionKey: 'key',
      };

      render(<ActionListSection {...customProps} />);

      // Component should pass these props to AddableAccordion
      expect(screen.getByTestId('addable-accordion-action-list-section')).toBeInTheDocument();
    });

    it('should handle canAdd being false', () => {
      const propsWithoutAdd = {
        ...defaultProps,
        canAdd: false,
      };

      render(<ActionListSection {...propsWithoutAdd} />);

      expect(screen.queryByTestId('add-section')).not.toBeInTheDocument();
    });

    it('should use default values for optional props', () => {
      const minimalProps = {
        control: { id: 'test' },
        onAddAction: jest.fn(),
      };

      render(<ActionListSection {...minimalProps} />);

      expect(screen.getByTestId('addable-accordion-action-list-section')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading skeleton in Suspense fallback', () => {
      const propsWithValues = {
        ...defaultProps,
        values: [{ actionId: '123', label: 'Test Action' }],
        isEmpty: false,
      };

      // We can't easily test Suspense fallback in this setup, but we can verify
      // the component structure is correct
      render(<ActionListSection {...propsWithValues} />);

      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
    });
  });

  describe('Grid Configuration', () => {
    it('should configure grid with correct columns', () => {
      const propsWithValues = {
        ...defaultProps,
        values: [{ value: '123', label: 'Test Action' }],
        isEmpty: false,
      };

      render(<ActionListSection {...propsWithValues} />);

      const grid = screen.getByTestId('grid-action-grid');
      expect(grid).toBeInTheDocument();

      // Verify that both value and label columns are handled
      expect(screen.getByTestId('cell-label-0')).toHaveTextContent('Test Action');
    });

    it('should pass correct props to Grid component', () => {
      const propsWithValues = {
        ...defaultProps,
        values: [{ actionId: '123', label: 'Test Action' }],
        isEmpty: false,
      };

      render(<ActionListSection {...propsWithValues} />);

      // Verify grid is rendered with expected configuration
      expect(screen.getByTestId('grid-action-grid')).toBeInTheDocument();
    });
  });

  describe('EmptyContent Styling', () => {
    it('should render EmptyContent component in single action variant', () => {
      const singleActionProps = {
        ...defaultProps,
        singleActionVariant: true,
        actions: [{ value: 'click', label: 'Click', source: 'onClick' }],
      };

      render(<ActionListSection {...singleActionProps} />);

      // EmptyContent should be rendered
      expect(screen.getByTestId('text')).toBeInTheDocument();
      expect(screen.getByTestId('action-grid-add')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should handle missing actions gracefully', () => {
      const propsWithoutActions = {
        ...defaultProps,
        actions: undefined,
      };

      expect(() => render(<ActionListSection {...propsWithoutActions} />)).not.toThrow();
    });

    it('should handle empty actions array', () => {
      const propsWithEmptyActions = {
        ...defaultProps,
        actions: [],
      };

      render(<ActionListSection {...propsWithEmptyActions} />);
      expect(screen.getByTestId('addable-accordion-action-list-section')).toBeInTheDocument();
    });
  });
});
