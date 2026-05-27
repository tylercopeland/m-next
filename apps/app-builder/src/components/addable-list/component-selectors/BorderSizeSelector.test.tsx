 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BorderSizeSelector from './BorderSizeSelector';

// Mock mq-polyfill
jest.mock('mq-polyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const matchMediaPolyfill = jest.fn();

interface MockStyleSelectorProps {
  onChange?: (value: string) => void;
  value?: string;
  defaultOptions?: Array<{ value: string; label: string }>;
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

describe('BorderSizeSelector Component', () => {
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
    id: 'test-border-size-selector',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<BorderSizeSelector {...defaultProps} />);
    expect(screen.getByTestId('style-selector')).toBeInTheDocument();
  });

  it('renders with default border size options', () => {
    render(<BorderSizeSelector {...defaultProps} />);
    
    expect(screen.getByText('1px')).toBeInTheDocument();
    expect(screen.getByText('2px')).toBeInTheDocument();
    expect(screen.getByText('4px')).toBeInTheDocument();
    expect(screen.getByText('6px')).toBeInTheDocument();
    expect(screen.getByText('8px')).toBeInTheDocument();
    expect(screen.getByText('10px')).toBeInTheDocument();
  });

  it('uses default value of "1px"', () => {
    render(<BorderSizeSelector {...defaultProps} />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('1px');
  });

  it('uses provided value', () => {
    render(<BorderSizeSelector {...defaultProps} value="4px" />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('4px');
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<BorderSizeSelector {...defaultProps} onChange={onChange} />);
    
    const selector = screen.getByTestId('style-selector');
    fireEvent.change(selector, { target: { value: '6px' } });
    
    expect(onChange).toHaveBeenCalledWith('6px');
  });

  it('passes width prop correctly', () => {
    const { container } = render(<BorderSizeSelector {...defaultProps} width="150px" />);
    
    const selector = container.querySelector('[width="150px"]');
    expect(selector).toBeInTheDocument();
  });

  it('generates correct id for StyleSelector', () => {
    const { container } = render(<BorderSizeSelector {...defaultProps} />);
    
    const selector = container.querySelector('#test-border-size-selector-border-size-selector');
    expect(selector).toBeInTheDocument();
  });

  it('sets correct aria label', () => {
    const { container } = render(<BorderSizeSelector {...defaultProps} />);
    
    const selector = container.querySelector('[ariaLabel="Border size selector"]');
    expect(selector).toBeInTheDocument();
  });

  it('handles undefined customOptions gracefully', () => {
    render(<BorderSizeSelector {...defaultProps} customOptions={undefined} />);
    
    // Should still render default options
    expect(screen.getByText('1px')).toBeInTheDocument();
    expect(screen.getByText('2px')).toBeInTheDocument();
  });

  it('supports numeric width values', () => {
    const { container } = render(<BorderSizeSelector {...defaultProps} width={100} />);
    
    const selector = container.querySelector('[width="100"]');
    expect(selector).toBeInTheDocument();
  });
});
