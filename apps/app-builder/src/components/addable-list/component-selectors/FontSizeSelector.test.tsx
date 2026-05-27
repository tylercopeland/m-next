 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FontSizeSelector from './FontSizeSelector';

// Mock mq-polyfill
jest.mock('mq-polyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const matchMediaPolyfill = jest.fn();

interface MockStyleSelectorProps {
  onChange?: (value: string) => void;
  value?: string;
  defaultOptions?: Array<{ value: string; label: string; secondary?: string }>;
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
          <option key={option.value} value={option.value} title={option.secondary}>
            {option.label}
          </option>
        ))}
      </select>
    );
  });

describe('FontSizeSelector Component', () => {
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
    id: 'test-font-size-selector',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<FontSizeSelector {...defaultProps} />);
    expect(screen.getByTestId('style-selector')).toBeInTheDocument();
  });

  it('renders with default font size options', () => {
    render(<FontSizeSelector {...defaultProps} />);
    
    expect(screen.getByText('X-Small')).toBeInTheDocument();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Regular')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getByText('X-Large')).toBeInTheDocument();
    expect(screen.getByText('XX-Large')).toBeInTheDocument();
    expect(screen.getByText('XXX-Large')).toBeInTheDocument();
  });

  it('uses default value of "regular"', () => {
    render(<FontSizeSelector {...defaultProps} />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('regular');
  });

  it('uses provided value', () => {
    render(<FontSizeSelector {...defaultProps} value="large" />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('large');
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<FontSizeSelector {...defaultProps} onChange={onChange} />);
    
    const selector = screen.getByTestId('style-selector');
    fireEvent.change(selector, { target: { value: 'xlarge' } });
    
    expect(onChange).toHaveBeenCalledWith('xlarge');
  });

  it('includes secondary values (pixel sizes) in default options', () => {
    render(<FontSizeSelector {...defaultProps} />);
    
    const xsmallOption = screen.getByText('X-Small').closest('option') as HTMLOptionElement;
    const regularOption = screen.getByText('Regular').closest('option') as HTMLOptionElement;
    const xxlargeOption = screen.getByText('XX-Large').closest('option') as HTMLOptionElement;
    
    expect(xsmallOption?.title).toBe('10px');
    expect(regularOption?.title).toBe('14px');
    expect(xxlargeOption?.title).toBe('22px');
  });

  it('passes width prop correctly', () => {
    const { container } = render(<FontSizeSelector {...defaultProps} width="160px" />);
    
    const selector = container.querySelector('[width="160px"]');
    expect(selector).toBeInTheDocument();
  });

  it('generates correct id for StyleSelector', () => {
    const { container } = render(<FontSizeSelector {...defaultProps} />);
    
    const selector = container.querySelector('#test-font-size-selector-font-size-selector');
    expect(selector).toBeInTheDocument();
  });

  it('sets correct aria label', () => {
    const { container } = render(<FontSizeSelector {...defaultProps} />);
    
    const selector = container.querySelector('[ariaLabel="Font size selector"]');
    expect(selector).toBeInTheDocument();
  });

  it('handles undefined customOptions gracefully', () => {
    render(<FontSizeSelector {...defaultProps} customOptions={undefined} />);
    
    // Should still render default options
    expect(screen.getByText('X-Small')).toBeInTheDocument();
    expect(screen.getByText('Regular')).toBeInTheDocument();
  });

  it('supports numeric width values', () => {
    const { container } = render(<FontSizeSelector {...defaultProps} width={140} />);
    
    const selector = container.querySelector('[width="140"]');
    expect(selector).toBeInTheDocument();
  });

  it('verifies all default font size values and labels', () => {
    render(<FontSizeSelector {...defaultProps} />);
    
    const expectedOptions = [
      { value: 'xsmall', label: 'X-Small', secondary: '10px' },
      { value: 'small', label: 'Small', secondary: '12px' },
      { value: 'regular', label: 'Regular', secondary: '14px' },
      { value: 'large', label: 'Large', secondary: '16px' },
      { value: 'xlarge', label: 'X-Large', secondary: '18px' },
      { value: 'xxlarge', label: 'XX-Large', secondary: '22px' },
      { value: 'xxxlarge', label: 'XXX-Large', secondary: '30px' },
    ];
    
    expectedOptions.forEach(({ value, label, secondary }) => {
      const option = screen.getByText(label).closest('option') as HTMLOptionElement;
      expect(option?.value).toBe(value);
      expect(option?.title).toBe(secondary);
    });
  });

  it('handles edge case font size values', () => {
    render(<FontSizeSelector {...defaultProps} value="xxxlarge" />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('xxxlarge');
  });
});
