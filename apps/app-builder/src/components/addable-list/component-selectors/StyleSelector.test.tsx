 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StyleSelector, { StyleOption } from './StyleSelector';

// Mock mq-polyfill
jest.mock('mq-polyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const matchMediaPolyfill = jest.fn();

interface MockDropdownOption {
  value: string;
  label: string;
  icon?: string;
  secondary?: string;
}

interface MockDropdownProps {
  onChange?: (option: MockDropdownOption) => void;
  value?: (() => MockDropdownOption | undefined) | MockDropdownOption;
  options?: MockDropdownOption[];
  [key: string]: unknown;
}

// Mock Dropdown component
jest.mock('@m-next/dropdown', () => function MockDropdown({ onChange, value, options, ...props }: MockDropdownProps) {
    const selectedValue = typeof value === 'function' ? value() : value;
    return (
      <div data-testid='dropdown' {...props}>
        <select
          data-testid='dropdown-select'
          value={selectedValue?.value || ''}
          onChange={(e) => {
            const selectedOption = options?.find((opt) => opt.value === e.target.value);
            if (onChange && selectedOption) onChange(selectedOption);
          }}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div data-testid='selected-value'>{selectedValue?.label}</div>
        <div data-testid='selected-icon'>{selectedValue?.icon}</div>
      </div>
    );
  });

describe('StyleSelector Component', () => {
  beforeEach(() => {
    delete (window as unknown as { ResizeObserver?: unknown }).ResizeObserver;
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    matchMediaPolyfill(window);
    (window as unknown as { resizeTo: (width: number, height: number) => void }).resizeTo = function resizeTo(width: number, height: number) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height,
      });
      (this as unknown as Window).dispatchEvent(new Event('resize'));
    };
  });

  afterEach(() => {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserver;
    (window as unknown as { resizeTo: (width: number, height: number) => void }).resizeTo(1000, 1000);
    jest.restoreAllMocks();
  });

  const defaultOptions: StyleOption[] = [
    { value: 'option1', label: 'Option 1', icon: 'icon1' },
    { value: 'option2', label: 'Option 2', icon: 'icon2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    id: 'test-style-selector',
    onChange: jest.fn(),
    defaultOptions,
    defaultValue: 'option1',
  };

  it('renders without crashing', () => {
    render(<StyleSelector {...defaultProps} />);
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('uses default value when no value is provided', () => {
    render(<StyleSelector {...defaultProps} />);

    const select = screen.getByTestId('dropdown-select') as HTMLSelectElement;
    expect(select.value).toBe('option1');
  });

  it('uses provided value', () => {
    render(<StyleSelector {...defaultProps} value='option2' />);

    const select = screen.getByTestId('dropdown-select') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<StyleSelector {...defaultProps} onChange={onChange} />);

    const select = screen.getByTestId('dropdown-select');
    fireEvent.change(select, { target: { value: 'option3' } });

    expect(onChange).toHaveBeenCalledWith('option3');
  });

  it('uses custom options when provided', () => {
    const customOptions: StyleOption[] = [
      { value: 'custom1', label: 'Custom 1', icon: 'custom-icon1' },
      { value: 'custom2', label: 'Custom 2', icon: 'custom-icon2' },
    ];

    render(<StyleSelector {...defaultProps} customOptions={customOptions} />);

    expect(screen.getByText('Custom 1')).toBeInTheDocument();
    expect(screen.getByText('Custom 2')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('displays selected option label and icon correctly', () => {
    render(<StyleSelector {...defaultProps} value='option1' />);

    expect(screen.getByTestId('selected-value')).toHaveTextContent('Option 1');
    expect(screen.getByTestId('selected-icon')).toHaveTextContent('icon1');
  });

  it('shows "Custom" label when selected option is not found', () => {
    render(<StyleSelector {...defaultProps} value='nonexistent' />);

    expect(screen.getByTestId('selected-value')).toHaveTextContent('Custom');
  });

  it('passes width prop correctly', () => {
    const { container } = render(<StyleSelector {...defaultProps} width='200px' />);

    const dropdown = container.querySelector('[width="200px"]');
    expect(dropdown).toBeInTheDocument();
  });

  it('passes ariaLabel correctly', () => {
    const { container } = render(<StyleSelector {...defaultProps} ariaLabel='Test selector' />);

    const dropdown = container.querySelector('[ariaLabel="Test selector"]');
    expect(dropdown).toBeInTheDocument();
  });

  it('handles options without icons', () => {
    const optionsWithoutIcons: StyleOption[] = [
      { value: 'no-icon1', label: 'No Icon 1' },
      { value: 'no-icon2', label: 'No Icon 2' },
    ];

    render(<StyleSelector {...defaultProps} customOptions={optionsWithoutIcons} value='no-icon1' />);

    expect(screen.getByTestId('selected-value')).toHaveTextContent('No Icon 1');
    expect(screen.getByTestId('selected-icon')).toHaveTextContent('');
  });

  it('handles options with secondary information', () => {
    const optionsWithSecondary: StyleOption[] = [
      { value: 'sec1', label: 'Secondary 1', secondary: 'Extra info 1' },
      { value: 'sec2', label: 'Secondary 2', secondary: 'Extra info 2' },
    ];

    render(<StyleSelector {...defaultProps} customOptions={optionsWithSecondary} />);

    expect(screen.getByText('Secondary 1')).toBeInTheDocument();
    expect(screen.getByText('Secondary 2')).toBeInTheDocument();
  });

  it('supports numeric width values', () => {
    const { container } = render(<StyleSelector {...defaultProps} width={150} />);

    const dropdown = container.querySelector('[width="150"]');
    expect(dropdown).toBeInTheDocument();
  });

  it('updates internal value when selection changes', () => {
    const onChange = jest.fn();
    render(<StyleSelector {...defaultProps} onChange={onChange} />);

    const select = screen.getByTestId('dropdown-select');

    // Change to option2
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(onChange).toHaveBeenCalledWith('option2');
    expect(screen.getByTestId('selected-value')).toHaveTextContent('Option 2');

    // Change to option3
    fireEvent.change(select, { target: { value: 'option3' } });
    expect(onChange).toHaveBeenCalledWith('option3');
    expect(screen.getByTestId('selected-value')).toHaveTextContent('Option 3');
  });
  it('prioritizes customOptions over defaultOptions', () => {
    const customOptions: StyleOption[] = [{ value: 'custom', label: 'Custom Option' }];

    render(<StyleSelector {...defaultProps} customOptions={customOptions} />);

    expect(screen.getByText('Custom Option')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('correctly maps options to dropdown format', () => {
    const optionsWithAllProps: StyleOption[] = [
      { value: 'full', label: 'Full Option', icon: 'full-icon', secondary: 'secondary-info' },
    ];

    render(<StyleSelector {...defaultProps} customOptions={optionsWithAllProps} />);

    expect(screen.getByText('Full Option')).toBeInTheDocument();
  });

  it('handles value prop changes', () => {
    const { rerender } = render(<StyleSelector {...defaultProps} value='option1' />);

    expect(screen.getByTestId('selected-value')).toHaveTextContent('Option 1');

    rerender(<StyleSelector {...defaultProps} value='option2' />);
    expect(screen.getByTestId('selected-value')).toHaveTextContent('Option 2');
  });
});
