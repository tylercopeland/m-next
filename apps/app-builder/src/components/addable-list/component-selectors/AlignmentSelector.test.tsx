 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AlignmentSelector from './AlignmentSelector';

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

describe('AlignmentSelector Component', () => {
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
    id: 'test-alignment-selector',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<AlignmentSelector {...defaultProps} />);
    expect(screen.getByTestId('style-selector')).toBeInTheDocument();
  });

  it('renders with default alignment options', () => {
    render(<AlignmentSelector {...defaultProps} />);
    
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Center')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('uses default value of "left"', () => {
    render(<AlignmentSelector {...defaultProps} />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('left');
  });

  it('uses provided value', () => {
    render(<AlignmentSelector {...defaultProps} value="center" />);
    
    const selector = screen.getByTestId('style-selector') as HTMLSelectElement;
    expect(selector.value).toBe('center');
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<AlignmentSelector {...defaultProps} onChange={onChange} />);
    
    const selector = screen.getByTestId('style-selector');
    fireEvent.change(selector, { target: { value: 'right' } });
    
    expect(onChange).toHaveBeenCalledWith('right');
  });

  it('passes width prop correctly', () => {
    const { container } = render(<AlignmentSelector {...defaultProps} width="200px" />);
    
    const selector = container.querySelector('[width="200px"]');
    expect(selector).toBeInTheDocument();
  });

  it('generates correct id for StyleSelector', () => {
    const { container } = render(<AlignmentSelector {...defaultProps} />);
    
    const selector = container.querySelector('#test-alignment-selector-alignment-selector');
    expect(selector).toBeInTheDocument();
  });

  it('sets correct aria label', () => {
    const { container } = render(<AlignmentSelector {...defaultProps} />);
    
    const selector = container.querySelector('[ariaLabel="Alignment selector"]');
    expect(selector).toBeInTheDocument();
  });

  it('handles undefined customOptions gracefully', () => {
    render(<AlignmentSelector {...defaultProps} customOptions={undefined} />);
    
    // Should still render default options
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Center')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });
});
