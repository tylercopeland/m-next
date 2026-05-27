import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumericRangeInput from './NumericRangeInput';

// Mock OutroAnimation to avoid act() warnings with timers
jest.mock('@m-next/input', () => ({
  ...jest.requireActual('@m-next/input'),
  OutroAnimation: ({ show, children }: { show: boolean; children: React.ReactNode }) => (
    show ? <>{children}</> : null
  ),
}));

describe('NumericRangeInput', () => {
  const defaultProps = {
    id: 'test-input',
    value: 5,
    initialValue: 5,
    onChange: jest.fn(),
    type: 'integer' as const,
    minValue: 3,
    maxValue: 10,
    label: 'Test Input',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<NumericRangeInput {...defaultProps} />);
      expect(screen.getByTestId('test-input-Input')).toBeInTheDocument();
    });

    it('should render label', () => {
      render(<NumericRangeInput {...defaultProps} />);
      expect(screen.getByText('Test Input')).toBeInTheDocument();
    });

    it('should display initial value', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;
      expect(input.value).toBe('5');
    });
  });

  describe('Value Changes', () => {
    it('should update raw input on change', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '7' } });
      expect(input.value).toBe('7');
    });

    it('should call onChange after debounce period for valid value', async () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '7' } });
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(7);
      });
    });

    it('should not call onChange during debounce period', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '7' } });
      jest.advanceTimersByTime(250);
      
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe('Minimum Value Constraint', () => {
    it('should enforce minimum value on blur', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.blur(input);

      expect(defaultProps.onChange).toHaveBeenCalledWith(3);
      expect(input.value).toBe('3');
    });

    it('should show info message when below minimum', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '1' } });

      expect(screen.getByText(/Min value 3/i)).toBeInTheDocument();
    });

    it('should accept value at minimum', async () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '3' } });
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(3);
      });
      expect(input.value).toBe('3');
    });
  });

  describe('Maximum Value Constraint', () => {
    it('should enforce maximum value on blur', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '15' } });
      fireEvent.blur(input);

      expect(defaultProps.onChange).toHaveBeenCalledWith(10);
      expect(input.value).toBe('10');
    });

    it('should show info message when above maximum', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '15' } });

      expect(screen.getByText(/Max value 10/i)).toBeInTheDocument();
    });

    it('should accept value at maximum', async () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '10' } });
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(10);
      });
      expect(input.value).toBe('10');
    });
  });

  describe('Invalid Input Handling', () => {
    it('should reset to last valid value on blur with invalid input', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.blur(input);

      // Visual reset only, onChange not called on blur
      expect(input.value).toBe('5');
    });

    it('should reset to last valid value on blur with empty input', () => {
      render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      // Visual reset only, onChange not called on blur
      expect(input.value).toBe('5');
    });
  });

  describe('Integer Type', () => {
    it('should handle integer values correctly', async () => {
      render(<NumericRangeInput {...defaultProps} type='integer' />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '8' } });
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(8);
      });
    });
  });

  describe('Number Type', () => {
    it('should handle decimal values correctly', async () => {
      const props = { ...defaultProps, type: 'number' as const };
      render(<NumericRangeInput {...props} />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '7.5' } });
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(7.5);
      });
    });
  });

  describe('Focus Behavior', () => {
    it('should select text on focus when selectOnFocus is true', () => {
      render(<NumericRangeInput {...defaultProps} selectOnFocus />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;
      
      input.select = jest.fn();
      fireEvent.focus(input);

      expect(input.select).toHaveBeenCalled();
    });

    it('should not select text on focus when selectOnFocus is false', () => {
      render(<NumericRangeInput {...defaultProps} selectOnFocus={false} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;
      
      input.select = jest.fn();
      fireEvent.focus(input);

      expect(input.select).not.toHaveBeenCalled();
    });
  });

  describe('Suffix Text', () => {
    it('should display suffix text when provided', () => {
      render(<NumericRangeInput {...defaultProps} suffixText='px' />);
      expect(screen.getByText('px')).toBeInTheDocument();
    });

    it('should include suffix in info message', () => {
      render(<NumericRangeInput {...defaultProps} suffixText='px' />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '15' } });

      expect(screen.getByText(/Max value 10px/i)).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      render(<NumericRangeInput {...defaultProps} disabled />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      expect(input).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      render(<NumericRangeInput {...defaultProps} disabled />);
      const input = screen.getByTestId('test-input-Input');

      fireEvent.change(input, { target: { value: '7' } });
      jest.advanceTimersByTime(500);

      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });

  describe('Value Updates', () => {
    it('should update when value prop changes', () => {
      const { rerender } = render(<NumericRangeInput {...defaultProps} />);
      const input = screen.getByTestId('test-input-Input') as HTMLInputElement;

      expect(input.value).toBe('5');

      rerender(<NumericRangeInput {...defaultProps} value={8} />);

      expect(input.value).toBe('8');
    });

    it('should not call onChange when re-rendered with the same value and a new onChange ref', () => {
      const onChange1 = jest.fn();
      const { rerender } = render(<NumericRangeInput {...defaultProps} onChange={onChange1} />);

      // Initial render fires the debounce effect; advance past it
      jest.advanceTimersByTime(500);
      onChange1.mockClear();

      // Re-render with a new onChange function reference but the same value
      const onChange2 = jest.fn();
      rerender(<NumericRangeInput {...defaultProps} onChange={onChange2} />);

      jest.advanceTimersByTime(500);

      expect(onChange1).not.toHaveBeenCalled();
      expect(onChange2).not.toHaveBeenCalled();
    });
  });
});
