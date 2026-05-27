 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { colors } from '@m-next/styles';
import ColorSelector from './ColorSelector';

// Mock mq-polyfill
jest.mock('mq-polyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const matchMediaPolyfill = jest.fn();

interface MockDropdownOption {
  value: string;
  label: string;
  color?: string;
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
      <div data-testid="dropdown" {...props}>
        <select 
          data-testid="dropdown-select"
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
        <div data-testid="selected-value">{selectedValue?.label}</div>
        <div data-testid="selected-color" style={{ backgroundColor: selectedValue?.color }} />
      </div>
    );
  });

describe('ColorSelector Component', () => {
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

  const defaultProps = {
    id: 'test-color-selector',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<ColorSelector {...defaultProps} />);
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('renders with default color options', () => {
    render(<ColorSelector {...defaultProps} />);
    
    expect(screen.getByText('Dark Grey')).toBeInTheDocument();
    expect(screen.getByText('Grey')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('uses default value when no value is provided', () => {
    render(<ColorSelector {...defaultProps} />);
    
    const select = screen.getByTestId('dropdown-select') as HTMLSelectElement;
    expect(select.value).toBe(colors['grey-darker']);
  });

  it('uses provided value', () => {
    render(<ColorSelector {...defaultProps} value="red" />);
    
    const selectedColor = screen.getByTestId('selected-color');
    expect(selectedColor).toHaveStyle(`background-color: ${colors.red}`);
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<ColorSelector {...defaultProps} onChange={onChange} />);
    
    const select = screen.getByTestId('dropdown-select');
    fireEvent.change(select, { target: { value: colors.blue } });
    
    expect(onChange).toHaveBeenCalledWith(
      'blue',
      expect.objectContaining({
        value: colors.blue,
        label: 'Blue',
      })
    );
  });

  it('translates colors correctly', () => {
    const onChange = jest.fn();
    render(<ColorSelector {...defaultProps} onChange={onChange} />);
    
    const select = screen.getByTestId('dropdown-select');
    fireEvent.change(select, { target: { value: colors.red } });
    
    expect(onChange).toHaveBeenCalledWith('red', expect.any(Object));
  });

  it('handles custom options', () => {
    const customOptions = [
      { value: '#FF0000', label: 'Custom Red' },
      { value: '#00FF00', label: 'Custom Green' },
    ];
    
    render(<ColorSelector {...defaultProps} customOptions={customOptions} />);
    
    expect(screen.getByText('Custom Red')).toBeInTheDocument();
    expect(screen.getByText('Custom Green')).toBeInTheDocument();
  });


  it('hides label when showLabel is false', () => {
    render(<ColorSelector {...defaultProps} showLabel={false} value="red" />);
    
    const selectedValue = screen.getByTestId('selected-value');
    expect(selectedValue).toHaveTextContent('');
  });

  it('handles different color types', () => {
    const { rerender } = render(<ColorSelector {...defaultProps} type="font-color" />);
    
    let selectedValue = screen.getByTestId('selected-value');
    expect(selectedValue.closest('[data-testid="dropdown"]')).toBeInTheDocument();
    
    rerender(<ColorSelector {...defaultProps} type="fill-color" />);
    selectedValue = screen.getByTestId('selected-value');
    expect(selectedValue.closest('[data-testid="dropdown"]')).toBeInTheDocument();
    
    rerender(<ColorSelector {...defaultProps} type="color" />);
    selectedValue = screen.getByTestId('selected-value');
    expect(selectedValue.closest('[data-testid="dropdown"]')).toBeInTheDocument();
  });

  it('passes width prop correctly', () => {
    const { container } = render(<ColorSelector {...defaultProps} width="200px" />);
    
    const dropdown = container.querySelector('[width="200px"]');
    expect(dropdown).toBeInTheDocument();
  });


  it('generates correct id', () => {
    const { container } = render(<ColorSelector {...defaultProps} />);
    
    const dropdown = container.querySelector('#test-color-selector-color-selector');
    expect(dropdown).toBeInTheDocument();
  });

  it('handles value changes through useEffect', () => {
    const { rerender } = render(<ColorSelector {...defaultProps} value="red" />);
    
    let selectedColor = screen.getByTestId('selected-color');
    expect(selectedColor).toHaveStyle(`background-color: ${colors.red}`);
    
    rerender(<ColorSelector {...defaultProps} value="blue" />);
    selectedColor = screen.getByTestId('selected-color');
    expect(selectedColor).toHaveStyle(`background-color: ${colors.blue}`);
  });

  it('handles invalid color values gracefully', () => {
    render(<ColorSelector {...defaultProps} value="invalid-color" />);
    
    const selectedColor = screen.getByTestId('selected-color');
    expect(selectedColor).toHaveStyle(`background-color: ${colors['grey-darker']}`);
  });

  it('supports numeric width values', () => {
    const { container } = render(<ColorSelector {...defaultProps} width={150} />);
    
    const dropdown = container.querySelector('[width="150"]');
    expect(dropdown).toBeInTheDocument();
  });

});
