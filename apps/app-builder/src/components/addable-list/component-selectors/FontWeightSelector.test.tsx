 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FontWeightSelector from './FontWeightSelector';

// Mock mq-polyfill
jest.mock('mq-polyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const matchMediaPolyfill = jest.fn();

interface MockStyleSelectorProps {
  onChange?: (value: string) => void;
  value?: string;
  defaultOptions?: Array<{ value: string; label: string; icon?: string }>;
  [key: string]: unknown;
}

// Mock StyleSelector
jest.mock('./StyleSelector', () => function MockStyleSelector({ onChange, value, defaultOptions, ...props }: MockStyleSelectorProps) {
    return (
      <select 
        data-testid="style-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        {defaultOptions?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  });

describe('FontWeightSelector Component', () => {
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
    id: 'test-font-weight-selector',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<FontWeightSelector {...defaultProps} />);
    expect(screen.getByTestId('style-selector')).toBeInTheDocument();
  });

  it('renders with default font weight options', () => {
    render(<FontWeightSelector {...defaultProps} />);
    
    expect(screen.getByText('Regular')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Extra Bold')).toBeInTheDocument();
  });

  it('uses default value of "regular"', () => {
    render(<FontWeightSelector {...defaultProps} />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('regular');
  });

  it('uses provided value', () => {
    render(<FontWeightSelector {...defaultProps} value="bold" />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('bold');
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<FontWeightSelector {...defaultProps} onChange={onChange} />);
    
    const selector = screen.getByTestId('style-selector');
    fireEvent.change(selector, { target: { value: 'xbold' } });
    
    expect(onChange).toHaveBeenCalledWith('xbold');
  });

  it('passes width prop correctly', () => {
    const { container } = render(<FontWeightSelector {...defaultProps} width="170px" />);
    
    const selector = container.querySelector('[width="170px"]');
    expect(selector).toBeInTheDocument();
  });

  it('generates correct id for StyleSelector', () => {
    const { container } = render(<FontWeightSelector {...defaultProps} />);
    
    const selector = container.querySelector('#test-font-weight-selector-font-weight-selector');
    expect(selector).toBeInTheDocument();
  });

  it('sets correct aria label', () => {
    const { container } = render(<FontWeightSelector {...defaultProps} />);
    
    const selector = container.querySelector('[ariaLabel="Font weight selector"]');
    expect(selector).toBeInTheDocument();
  });

  it('handles undefined customOptions gracefully', () => {
    render(<FontWeightSelector {...defaultProps} customOptions={undefined} />);
    
    // Should still render default options
    expect(screen.getByText('Regular')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Extra Bold')).toBeInTheDocument();
  });

  it('supports numeric width values', () => {
    const { container } = render(<FontWeightSelector {...defaultProps} width={130} />);
    
    const selector = container.querySelector('[width="130"]');
    expect(selector).toBeInTheDocument();
  });

  it('verifies all default font weight values and labels', () => {
    render(<FontWeightSelector {...defaultProps} />);
    
    const regularOption = screen.getByText('Regular').closest('option') as HTMLOptionElement;
    const boldOption = screen.getByText('Bold').closest('option') as HTMLOptionElement;
    const extraBoldOption = screen.getByText('Extra Bold').closest('option') as HTMLOptionElement;
    
    expect(regularOption?.value).toBe('regular');
    expect(boldOption?.value).toBe('bold');
    expect(extraBoldOption?.value).toBe('xbold');
  });

  it('handles all font weight options correctly', () => {
    const onChange = jest.fn();
    render(<FontWeightSelector {...defaultProps} onChange={onChange} />);
    
    const selector = screen.getByTestId('style-selector');
    
    // Test regular selection
    fireEvent.change(selector, { target: { value: 'regular' } });
    expect(onChange).toHaveBeenCalledWith('regular');
    
    // Test bold selection
    fireEvent.change(selector, { target: { value: 'bold' } });
    expect(onChange).toHaveBeenCalledWith('bold');
    
    // Test extra bold selection
    fireEvent.change(selector, { target: { value: 'xbold' } });
    expect(onChange).toHaveBeenCalledWith('xbold');
  });

  it('handles undefined value prop gracefully', () => {
    render(<FontWeightSelector {...defaultProps} value={undefined} />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('regular'); // Should use default
  });

  it('includes icon information in default options', () => {
    const customOptions = [
      { value: 'regular', label: 'Regular', icon: 'font-weight-regular' },
      { value: 'bold', label: 'Bold', icon: 'font-weight-bold' },
      { value: 'xbold', label: 'Extra Bold', icon: 'font-weight-xbold' },
    ];
    
    render(<FontWeightSelector {...defaultProps} customOptions={customOptions} />);
    
    expect(screen.getByText('Regular')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Extra Bold')).toBeInTheDocument();
  });
});
