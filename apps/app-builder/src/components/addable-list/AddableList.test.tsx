/* eslint-disable react/destructuring-assignment */
 
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddableList, { ValueItem, OptionItem } from './AddableList';

// Mock mq-polyfill
jest.mock('mq-polyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const matchMediaPolyfill = jest.fn();

interface MockTextProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

interface MockSvgIconProps {
  testId?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

interface MockInputProps {
  onBlur?: (value: string | number) => void;
  value?: string | number;
  type?: string;
  [key: string]: unknown;
}

interface MockSelectorProps {
  onChange?: (value: string) => void;
  value?: string;
  [key: string]: unknown;
}

// Mock the child components
jest.mock('@m-next/typeography', () => ({
  Text: ({ children, ...props }: MockTextProps) => <span {...props}>{children}</span>,
}));

jest.mock('@m-next/svg-icon', () => function MockSvgIcon(props: MockSvgIconProps) {
    return <svg data-testid={props.testId} onClick={props.onClick} {...props} />;
  });

jest.mock('@m-next/input', () => ({
  DebouncedInput: ({ onBlur, value, type, ...props }: MockInputProps) => (
    <input 
      data-testid="debounced-input"
      defaultValue={value}
      type={type}
      onBlur={(e) => {
        if (onBlur) {
          const rawValue = e.target.value;
          const processedValue = type === 'number' ? Number(rawValue) : rawValue;
          onBlur(processedValue);
        }
      }}
      {...props}
    />
  ),
}));

jest.mock('./component-selectors/ColorSelector', () => function MockColorSelector({ onChange, value, ...props }: MockSelectorProps) {
    return (
      <select 
        data-testid="color-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>
    );
  });

jest.mock('./component-selectors/AlignmentSelector', () => function MockAlignmentSelector({ onChange, value, ...props }: MockSelectorProps) {
    return (
      <select 
        data-testid="alignment-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    );
  });

jest.mock('./component-selectors/FontWeightSelector', () => function MockFontWeightSelector({ onChange, value, ...props }: MockSelectorProps) {
    return (
      <select 
        data-testid="font-weight-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        <option value="regular">Regular</option>
        <option value="bold">Bold</option>
      </select>
    );
  });

jest.mock('./component-selectors/FontSizeSelector', () => function MockFontSizeSelector({ onChange, value, ...props }: MockSelectorProps) {
    return (
      <select 
        data-testid="font-size-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        <option value="small">Small</option>
        <option value="large">Large</option>
      </select>
    );
  });

jest.mock('./component-selectors/BorderSizeSelector', () => function MockBorderSizeSelector({ onChange, value, ...props }: MockSelectorProps) {
    return (
      <select 
        data-testid="border-size-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        <option value="1px">1px</option>
        <option value="2px">2px</option>
      </select>
    );
  });

jest.mock('./component-selectors/BorderStyleSelector', () => function MockBorderStyleSelector({ onChange, value, ...props }: MockSelectorProps) {
    return (
      <select 
        data-testid="border-style-selector"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      >
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
      </select>
    );
  });

describe('AddableList Component', () => {
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

  const mockValues: ValueItem[] = [
    { id: 1, value: 'Test Value 1', canDelete: true },
    { id: 2, value: 'Test Value 2', canDelete: false },
  ];

  const mockOptions: OptionItem[] = [
    { value: 1, label: 'Option 1', type: 'text', canDelete: true },
    { value: 2, label: 'Option 2', type: 'color', canDelete: true },
  ];

  const defaultProps = {
    id: 'test-addable-list',
    values: mockValues,
    options: mockOptions,
    onChange: jest.fn(),
    onActionButtonClick: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<AddableList {...defaultProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('displays values correctly with merged options', () => {
    render(<AddableList {...defaultProps} />);
    
    // Should display labels from options
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    
    // Should render appropriate input types
    expect(screen.getByTestId('debounced-input')).toBeInTheDocument();
    expect(screen.getByTestId('color-selector')).toBeInTheDocument();
  });

  it('handles text input changes', () => {
    const onChange = jest.fn();
    render(<AddableList {...defaultProps} onChange={onChange} />);
    
    const textInput = screen.getByTestId('debounced-input');
    fireEvent.blur(textInput, { target: { value: 'New Value' } });
    
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, value: 'New Value' }),
        expect.objectContaining({ id: 2, value: 'Test Value 2' }),
      ])
    );
  });

  it('handles color selector changes', () => {
    const onChange = jest.fn();
    render(<AddableList {...defaultProps} onChange={onChange} />);
    
    const colorSelector = screen.getByTestId('color-selector');
    fireEvent.change(colorSelector, { target: { value: 'blue' } });
    
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, value: 'Test Value 1' }),
        expect.objectContaining({ id: 2, value: 'blue' }),
      ])
    );
  });

  it('handles action button click in removable mode', () => {
    const onChange = jest.fn();
    render(<AddableList {...defaultProps} onChange={onChange} mode="removable" />);
    
    const actionButton = screen.getAllByTestId(/test-addable-list-\d+-action/)[0];
    fireEvent.click(actionButton);
    
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: 2, value: 'Test Value 2' }),
    ]);
  });

  it('handles action button click in editable mode', () => {
    const onActionButtonClick = jest.fn();
    render(<AddableList {...defaultProps} onActionButtonClick={onActionButtonClick} mode="editable" />);
    
    const actionButton = screen.getAllByTestId(/test-addable-list-\d+-action/)[0];
    fireEvent.click(actionButton);
    
    expect(onActionButtonClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, value: 'Test Value 1' }),
      0
    );
  });

  it('filters out hidden items', () => {
    const optionsWithHidden: OptionItem[] = [
      { value: 1, label: 'Visible Option', type: 'text', canDelete: true },
      { value: 2, label: 'Hidden Option', type: 'text', canDelete: true, hidden: true },
    ];
    
    render(<AddableList {...defaultProps} options={optionsWithHidden} />);
    
    expect(screen.getByText('Visible Option')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Option')).not.toBeInTheDocument();
  });

  it('handles boolean type correctly', () => {
    const booleanOptions: OptionItem[] = [
      { value: 1, label: 'Boolean Option', type: 'boolean', canDelete: true },
    ];
    
    const booleanValues: ValueItem[] = [
      { id: 1, value: true, canDelete: true },
    ];
    
    render(<AddableList {...defaultProps} values={booleanValues} options={booleanOptions} />);
    
    expect(screen.getByText('Boolean Option')).toBeInTheDocument();
    // Boolean type should not render any input
    expect(screen.queryByTestId('debounced-input')).not.toBeInTheDocument();
  });

  it('handles empty values gracefully', () => {
    render(<AddableList {...defaultProps} values={[]} />);
    
    // Should not crash and should not render any items
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('handles values without options (direct mode)', () => {
    const directValues: ValueItem[] = [
      { id: 1, value: 'Direct Value', canDelete: true, label: 'Direct Label', type: 'text' },
    ];
    
    render(<AddableList {...defaultProps} values={directValues} options={[]} />);
    
    expect(screen.getByText('Direct Label')).toBeInTheDocument();
  });

  it('applies maxValue constraint for number inputs', () => {
    const onChange = jest.fn();
    const numberValues: ValueItem[] = [
      { id: 1, value: 5, canDelete: true, maxValue: 10 },
    ];
    const numberOptions: OptionItem[] = [
      { value: 1, label: 'Number Option', type: 'number', canDelete: true },
    ];
    
    render(
      <AddableList 
        {...defaultProps} 
        values={numberValues} 
        options={numberOptions} 
        onChange={onChange} 
      />
    );
    
    const numberInput = screen.getByTestId('debounced-input');
    fireEvent.blur(numberInput, { target: { value: '15' } });
    
    // Should be clamped to maxValue (10)
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: 1, value: 10 }),
    ]);
  });

  it('disables action button when canDelete is false', () => {
    const valuesWithDisabled: ValueItem[] = [
      { id: 1, value: 'Deletable', canDelete: true },
      { id: 2, value: 'Non-deletable', canDelete: false },
    ];
    
    render(<AddableList {...defaultProps} values={valuesWithDisabled} />);
    
    const actionButtons = screen.getAllByTestId(/test-addable-list-\d+-action/);
    
    // First button should not be disabled
    expect(actionButtons[0]).not.toHaveAttribute('disabled');
    // Second button should be disabled
    expect(actionButtons[1]).toHaveAttribute('disabled');
  });

  it('renders different selector types correctly', () => {
    const mixedOptions: OptionItem[] = [
      { value: 1, label: 'Text', type: 'text', canDelete: true },
      { value: 2, label: 'Color', type: 'color', canDelete: true },
      { value: 3, label: 'Alignment', type: 'alignment', canDelete: true },
      { value: 4, label: 'Font Weight', type: 'font-weight', canDelete: true },
      { value: 5, label: 'Font Size', type: 'font-size', canDelete: true },
      { value: 6, label: 'Border Size', type: 'border-size', canDelete: true },
      { value: 7, label: 'Border Style', type: 'border-style', canDelete: true },
    ];
    
    const mixedValues: ValueItem[] = mixedOptions.map((opt, index) => ({
      id: opt.value as number,
      value: `value-${index}`,
      canDelete: true,
    }));
    
    render(<AddableList {...defaultProps} values={mixedValues} options={mixedOptions} />);
    
    expect(screen.getByTestId('debounced-input')).toBeInTheDocument();
    expect(screen.getByTestId('color-selector')).toBeInTheDocument();
    expect(screen.getByTestId('alignment-selector')).toBeInTheDocument();
    expect(screen.getByTestId('font-weight-selector')).toBeInTheDocument();
    expect(screen.getByTestId('font-size-selector')).toBeInTheDocument();
    expect(screen.getByTestId('border-size-selector')).toBeInTheDocument();
    expect(screen.getByTestId('border-style-selector')).toBeInTheDocument();
  });
});
