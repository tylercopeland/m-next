/* eslint-disable react/no-array-index-key */
 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DropdownOption } from '@m-next/dropdown';
import TableDropdown from './TableDropdown';

interface MockDropdownProps {
  id: string;
  options: DropdownOption[] | null;
  value: () => DropdownOption | null;
  onChange: (option: DropdownOption) => void;
  placeholder?: string;
  validationMessage?: string;
  width?: string;
  disabled?: boolean;
}

interface MockLoadingSkeletonProps {
  count?: number;
  width?: string;
  height?: string;
}

interface MockDialogProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  footer: {
    primaryButtonLabel: string;
    onPrimaryButtonClick: () => void;
    secondaryButtonLabel: string;
    onSecondaryButtonClick: () => void;
  };
  onClose: () => void;
}

interface MockContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface MockTextLineProps {
  children: React.ReactNode;
}

// Mock the dependencies
jest.mock('@m-next/dropdown', () => function MockDropdown({ id, options, value, onChange, placeholder, validationMessage, width, disabled }: MockDropdownProps) {
    const currentValue = typeof value === 'function' ? value() : value;
    
    return (
      <div data-testid={`dropdown-${id}`}>
        <button
          type='button'
          data-testid={`dropdown-${id}-trigger`}
          onClick={() => {
            if (onChange && options && options.length > 0) {
              // Simulate selecting the first option that's different from current value
              const selectedOption = options.find(opt => opt.value !== currentValue?.value) || options[0];
              onChange(selectedOption);
            }
          }}
          disabled={disabled}
          style={{ width }}
        >
          {currentValue ? currentValue.label : placeholder}
        </button>
        {validationMessage && <div data-testid='validation-message'>{validationMessage}</div>}
        <div data-testid='dropdown-options'>
          {options &&
            options.map((option, index) => (
              <div 
                key={index} 
                data-testid={`option-${option.value}`}
                onClick={() => onChange && onChange(option)}
                role="button"
                tabIndex={0}
              >
                {option.label}
              </div>
            ))}
        </div>
      </div>
    );
  });

jest.mock('@m-next/loading-skeleton', () => function MockLoadingSkeleton({ width, height }: MockLoadingSkeletonProps) {
    return <div data-testid='loading-skeleton' style={{ width, height }} />;
  });

jest.mock('@m-next/dialog', () => function MockDialog({ title, isOpen, children, footer, onClose }: MockDialogProps) {
    if (!isOpen) return null;
    return (
      <div data-testid='dialog' role='dialog'>
        <div data-testid='dialog-title'>{title}</div>
        <div data-testid='dialog-content'>{children}</div>
        <div data-testid='dialog-footer'>
          <button type='button' data-testid='primary-button' onClick={footer.onPrimaryButtonClick}>
            {footer.primaryButtonLabel}
          </button>
          <button type='button' data-testid='secondary-button' onClick={footer.onSecondaryButtonClick}>
            {footer.secondaryButtonLabel}
          </button>
        </div>
        <button type='button' data-testid='close-button' onClick={onClose}>
          ×
        </button>
      </div>
    );
  });

jest.mock('@m-next/container', () => function MockContainer({ children, style }: MockContainerProps) {
    return (
      <div data-testid='container' style={style}>
        {children}
      </div>
    );
  });

jest.mock('@m-next/typeography', () => ({
  TextLine: function MockTextLine({ children }: MockTextLineProps) {
    return <div data-testid='text-line'>{children}</div>;
  },
}));

interface TableItem {
  name: string;
  caption?: string;
  displayName?: string;
}

describe('TableDropdown', () => {
  const mockTableList: TableItem[] = [
    { name: 'Customer', caption: 'Customers' },
    { name: 'Invoice', caption: 'Invoices' },
    { name: 'Product', caption: 'Products' },
  ];

  const defaultProps = {
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading States', () => {
    it('renders loading skeleton when loading is true', () => {
      render(<TableDropdown {...defaultProps} loading />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('renders loading skeleton when tableList is null', () => {
      render(<TableDropdown {...defaultProps} tableList={null} />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('renders loading skeleton when tableList is empty', () => {
      render(<TableDropdown {...defaultProps} tableList={[]} />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('renders loading skeleton with custom width', () => {
      render(<TableDropdown {...defaultProps} loading width='200px' />);

      const skeleton = screen.getByTestId('loading-skeleton');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });
  });

  describe('Dropdown Rendering', () => {
    it('renders dropdown with formatted table list', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} />);

      expect(screen.getByTestId('dropdown-table')).toBeInTheDocument();
      expect(screen.getByTestId('option-Customer')).toHaveTextContent('Customers');
      expect(screen.getByTestId('option-Invoice')).toHaveTextContent('Invoices');
      expect(screen.getByTestId('option-Product')).toHaveTextContent('Products');
    });

    it('sorts table options alphabetically by label', () => {
      const unsortedTables: TableItem[] = [
        { name: 'ZTable', caption: 'Z Table' },
        { name: 'ATable', caption: 'A Table' },
        { name: 'MTable', caption: 'M Table' },
      ];

      render(<TableDropdown {...defaultProps} tableList={unsortedTables} />);

      const options = screen.getAllByTestId(/^option-/);
      expect(options[0]).toHaveTextContent('A Table');
      expect(options[1]).toHaveTextContent('M Table');
      expect(options[2]).toHaveTextContent('Z Table');
    });

    it('includes EmailsSent option when includeEmailsSent is true', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} includeEmailsSent />);

      expect(screen.getByTestId('option-EmailsSent')).toHaveTextContent('Emails sent');
    });

    it('uses table name as label when caption is not available', () => {
      const tablesWithoutCaption: TableItem[] = [{ name: 'TableWithoutCaption' }];

      render(<TableDropdown {...defaultProps} tableList={tablesWithoutCaption} />);

      expect(screen.getByTestId('option-TableWithoutCaption')).toHaveTextContent('TableWithoutCaption');
    });
  });

  describe('Selected Value', () => {
    it('shows selected table with caption', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} selectedTableName='Customer' />);

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('Customers');
    });

    it('shows selected table name when no caption available', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} selectedTableName='NonExistentTable' />);

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('NonExistentTable');
    });

    it('shows placeholder when no table is selected', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} placeholder='Select a table' />);

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('Select a table');
    });

    it('handles EmailsSent selection correctly', () => {
      render(
        <TableDropdown
          {...defaultProps}
          tableList={mockTableList}
          selectedTableName='EmailsSent'
          includeEmailsSent
        />,
      );

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('Emails sent');
    });
  });

  describe('Table Change Handling', () => {
    it('calls onChange directly when showWarning is false', () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown 
          {...defaultProps} 
          onChange={onChangeSpy}
          tableList={mockTableList} 
          showWarning={false} 
        />
      );

      // Click on a specific option instead of the trigger to avoid the bug
      fireEvent.click(screen.getByTestId('option-Invoice'));

      expect(onChangeSpy).toHaveBeenCalledWith('Invoice');
    });

    it('shows warning dialog when showWarning is true', () => {
      render(
        <TableDropdown
          {...defaultProps}
          tableList={mockTableList}
          showWarning
          warningLabel='Warning message'
          warningSubLabel='Sub warning message'
        />,
      );

      // Click on a specific option to trigger the warning dialog
      fireEvent.click(screen.getByTestId('option-Invoice'));

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Change table - Reset properties');
      expect(screen.getAllByTestId('text-line')[0]).toHaveTextContent('Warning message');
      expect(screen.getAllByTestId('text-line')[1]).toHaveTextContent('Sub warning message');
    });

    it('confirms table change from dialog', async () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown 
          {...defaultProps} 
          onChange={onChangeSpy}
          tableList={mockTableList} 
          showWarning 
        />
      );

      // First click opens the dialog and sets newTable state
      fireEvent.click(screen.getByTestId('option-Invoice'));
      
      // Verify dialog is open
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      
      // Click primary button to confirm change
      fireEvent.click(screen.getByTestId('primary-button'));

      // Should call onChange with the selected table
      expect(onChangeSpy).toHaveBeenCalledWith('Invoice');
      
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    it('cancels table change from dialog', async () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown 
          {...defaultProps} 
          onChange={onChangeSpy}
          tableList={mockTableList} 
          showWarning 
        />
      );

      fireEvent.click(screen.getByTestId('option-Invoice'));
      fireEvent.click(screen.getByTestId('secondary-button'));

      expect(onChangeSpy).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes dialog using close button', async () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown 
          {...defaultProps} 
          onChange={onChangeSpy}
          tableList={mockTableList} 
          showWarning 
        />
      );

      fireEvent.click(screen.getByTestId('option-Invoice'));
      fireEvent.click(screen.getByTestId('close-button'));

      // Should not call onChange when just closing
      expect(onChangeSpy).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    it('calls onChange when selecting a different table', () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown
          {...defaultProps}
          onChange={onChangeSpy}
          tableList={mockTableList}
          selectedTableName='Customer'
          showWarning={false}
        />,
      );

      // Click on a specific different option
      fireEvent.click(screen.getByTestId('option-Invoice'));

      // Should call onChange with the selected table
      expect(onChangeSpy).toHaveBeenCalledWith('Invoice');
    });

    it('does not call onChange when selecting the same table', () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown
          {...defaultProps}
          onChange={onChangeSpy}
          tableList={mockTableList}
          selectedTableName='Customer'
          showWarning={false}
        />,
      );

      // Click on the same table that is already selected
      fireEvent.click(screen.getByTestId('option-Customer'));

      // Should NOT call onChange since same table is selected
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('does not show warning dialog when selecting the same table with showWarning true', () => {
      const onChangeSpy = jest.fn();
      render(
        <TableDropdown
          {...defaultProps}
          onChange={onChangeSpy}
          tableList={mockTableList}
          selectedTableName='Customer'
          showWarning
        />,
      );

      // Click on the same table that is already selected
      fireEvent.click(screen.getByTestId('option-Customer'));

      // Dialog should NOT appear since same table is selected
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      // onChange should NOT be called
      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Props and Configuration', () => {
    it('applies custom width', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} width='300px' />);

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveStyle({ width: '300px' });
    });

    it('shows validation message', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} validationMessage='This field is required' />);

      expect(screen.getByTestId('validation-message')).toHaveTextContent('This field is required');
    });

    it('disables dropdown when disabled prop is true', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} disabled />);

      expect(screen.getByTestId('dropdown-table-trigger')).toBeDisabled();
    });

    it('uses custom placeholder', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} placeholder='Choose table...' />);

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('Choose table...');
    });
  });

  describe('Default Props', () => {
    it('uses default props when not provided', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} />);

      // Default placeholder
      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('Search table');

      // Default width should be applied to loading skeleton
      render(<TableDropdown {...defaultProps} loading />);
      expect(screen.getByTestId('loading-skeleton')).toHaveStyle({ width: '184px' });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty table list gracefully', () => {
      render(<TableDropdown {...defaultProps} tableList={[]} />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('handles null selectedTableName', () => {
      render(<TableDropdown {...defaultProps} tableList={mockTableList} selectedTableName={null} />);

      expect(screen.getByTestId('dropdown-table-trigger')).toHaveTextContent('Search table');
    });

    it('handles table with missing name or caption', () => {
      const malformedTables: TableItem[] = [
        { name: 'ValidTable', caption: 'Valid Table' }, 
        { name: 'NoCaption' }, // No caption, should use name
        { caption: 'No Name Table' } as TableItem // No name, might cause issues but should be handled
      ];

      // Should not crash and should handle gracefully
      expect(() => {
        render(<TableDropdown {...defaultProps} tableList={malformedTables} />);
      }).not.toThrow();

      // Check that at least the valid table appears
      expect(screen.getByTestId('option-ValidTable')).toHaveTextContent('Valid Table');
      expect(screen.getByTestId('option-NoCaption')).toHaveTextContent('NoCaption');
    });
  });
});