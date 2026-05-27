 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BorderStyleSelector from './BorderStyleSelector';

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

describe('BorderStyleSelector Component', () => {
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
    id: 'test-border-style-selector',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<BorderStyleSelector {...defaultProps} />);
    expect(screen.getByTestId('style-selector')).toBeInTheDocument();
  });

  it('renders with default border style options', () => {
    render(<BorderStyleSelector {...defaultProps} />);
    
    expect(screen.getByText('Solid')).toBeInTheDocument();
    expect(screen.getByText('Dashed')).toBeInTheDocument();
    expect(screen.getByText('Dotted')).toBeInTheDocument();
    expect(screen.getByText('Double')).toBeInTheDocument();
  });

  it('uses default value of "solid"', () => {
    render(<BorderStyleSelector {...defaultProps} />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('solid');
  });

  it('uses provided value', () => {
    render(<BorderStyleSelector {...defaultProps} value="dashed" />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('dashed');
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<BorderStyleSelector {...defaultProps} onChange={onChange} />);
    
    const selector = screen.getByTestId('style-selector');
    fireEvent.change(selector, { target: { value: 'dotted' } });
    
    expect(onChange).toHaveBeenCalledWith('dotted');
  });

  it('passes width prop correctly', () => {
    const { container } = render(<BorderStyleSelector {...defaultProps} width="180px" />);
    
    const selector = container.querySelector('[width="180px"]');
    expect(selector).toBeInTheDocument();
  });

  it('generates correct id for StyleSelector', () => {
    const { container } = render(<BorderStyleSelector {...defaultProps} />);
    
    const selector = container.querySelector('#test-border-style-selector-border-style-selector');
    expect(selector).toBeInTheDocument();
  });

  it('sets correct aria label', () => {
    const { container } = render(<BorderStyleSelector {...defaultProps} />);
    
    const selector = container.querySelector('[ariaLabel="Border style selector"]');
    expect(selector).toBeInTheDocument();
  });

  it('handles undefined customOptions gracefully', () => {
    render(<BorderStyleSelector {...defaultProps} customOptions={undefined} />);
    
    // Should still render default options
    expect(screen.getByText('Solid')).toBeInTheDocument();
    expect(screen.getByText('Dashed')).toBeInTheDocument();
  });

  it('supports numeric width values', () => {
    const { container } = render(<BorderStyleSelector {...defaultProps} width={120} />);
    
    const selector = container.querySelector('[width="120"]');
    expect(selector).toBeInTheDocument();
  });

  it('verifies all default options have correct values', () => {
    render(<BorderStyleSelector {...defaultProps} />);
    
    const solidOption = screen.getByText('Solid').closest('option') as HTMLOptionElement;
    const dashedOption = screen.getByText('Dashed').closest('option') as HTMLOptionElement;
    const dottedOption = screen.getByText('Dotted').closest('option') as HTMLOptionElement;
    const doubleOption = screen.getByText('Double').closest('option') as HTMLOptionElement;
    
    expect(solidOption?.value).toBe('solid');
    expect(dashedOption?.value).toBe('dashed');
    expect(dottedOption?.value).toBe('dotted');
    expect(doubleOption?.value).toBe('double');
  });
});
