/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { screen, render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DebouncedInput from './debouncedInput';

describe('DebouncedInput', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<DebouncedInput id='test-input' />);
    expect(getByTestId('test-input-Input')).toBeInTheDocument();
  });

  it('calls onChange after debounce period', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const { getByTestId } = render(<DebouncedInput id='test-input' onChange={handleChange} />);
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(handleChange).toHaveBeenCalledWith('test');

    jest.useRealTimers();
  });

  it('displays validation message', () => {
    const { getByText } = render(<DebouncedInput id='test-input' validationMessage='Invalid input' />);
    expect(getByText('Invalid input')).toBeInTheDocument();
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const { getByTestId } = render(<DebouncedInput id='test-input' onFocus={handleFocus} onBlur={handleBlur} />);
    const input = getByTestId('test-input-Input');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles prefix icon rendering', () => {
    const { container } = render(<DebouncedInput id='test-input' prefixIcon='search' />);
    expect(container.querySelector('.mi-textinput-prefix')).toBeInTheDocument();
  });

  it('handles input change', () => {
    const { getByTestId } = render(<DebouncedInput id='test-input' />);
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input.value).toBe('new value');
  });

  it('handles disabled state', () => {
    const { getByTestId } = render(<DebouncedInput id='test-input' disabled />);
    const input = getByTestId('test-input-Input');
    expect(input).toBeDisabled();
  });

  it('handles readOnly state', () => {
    const { getByTestId } = render(<DebouncedInput id='test-input' readonly />);
    const input = getByTestId('test-input-Input');
    expect(input).toHaveAttribute('readOnly');
  });

  it('handles info message', () => {
    render(<DebouncedInput id='test-input' infoMessage='This is just a test' />);
    expect(screen.getByText('This is just a test')).toBeInTheDocument();
  });

  it('does not allow input to exceed maxLength when truncate is true', () => {
    const maxLength = 5;
    const { getByTestId } = render(<DebouncedInput id='test-input' maxLength={maxLength} truncate />);
    const input = getByTestId('test-input-Input');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input.value.length).toBeLessThanOrEqual(maxLength);
  });

  it('does not update value if string exceeds maxLength and truncate is true', () => {
    const maxLength = 3;
    const { getByTestId } = render(<DebouncedInput id='test-input' maxLength={maxLength} truncate />);
    const input = getByTestId('test-input-Input');
    fireEvent.change(input, { target: { value: '123' } });
    expect(input.value).toBe('123');
    fireEvent.change(input, { target: { value: '1234' } });
    // Should not update to '1234'
    expect(input.value).toBe('123');
  });

  it('does not allow input to exceed maxValue for number type when truncate is true', () => {
    const maxValue = 10;
    const { getByTestId } = render(<DebouncedInput id='test-input' type='number' maxValue={maxValue} truncate />);
    const input = getByTestId('test-input-Input');
    fireEvent.change(input, { target: { value: '15' } });
    expect(Number(input.value)).toBeLessThanOrEqual(maxValue);
  });

  it('does not allow input to exceed maxValue for integer type when truncate is true', () => {
    const maxValue = 20;
    const { getByTestId } = render(<DebouncedInput id='test-input' type='integer' maxValue={maxValue} truncate />);
    const input = getByTestId('test-input-Input');
    fireEvent.change(input, { target: { value: '25' } });
    expect(Number(input.value)).toBeLessThanOrEqual(maxValue);
  });

  it('flushes pending value on blur before debounce completes', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const { getByTestId } = render(<DebouncedInput id='test-input' onChange={handleChange} />);
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: 'quick edit' } });
    expect(handleChange).not.toHaveBeenCalled();

    // Blur before the 500ms debounce fires
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith('quick edit');

    jest.useRealTimers();
  });

  it('does not double-fire onChange when debounce completes after blur flush', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const { getByTestId, rerender } = render(<DebouncedInput id='test-input' onChange={handleChange} />);
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Simulate parent updating value prop after onChange
    rerender(<DebouncedInput id='test-input' value='test' onChange={handleChange} />);

    // Let the debounce fire — should not call onChange again
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(handleChange).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('flushes pending value on unmount before debounce completes', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const { getByTestId, unmount } = render(<DebouncedInput id='test-input' onChange={handleChange} />);
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: 'unmount test' } });
    expect(handleChange).not.toHaveBeenCalled();

    // Unmount before the 500ms debounce fires
    unmount();
    expect(handleChange).toHaveBeenCalledWith('unmount test');

    jest.useRealTimers();
  });

  it('does not flush on unmount when value is already committed', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const { getByTestId, rerender, unmount } = render(<DebouncedInput id='test-input' onChange={handleChange} />);
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: 'committed' } });

    // Let debounce complete
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Simulate parent updating value prop after onChange
    rerender(<DebouncedInput id='test-input' value='committed' onChange={handleChange} />);

    // Unmount — should not fire onChange again
    unmount();
    expect(handleChange).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('does not flush blank value on unmount when resetOnBlank is true', () => {
    jest.useFakeTimers();
    const handleChange = jest.fn();
    const { getByTestId, unmount } = render(
      <DebouncedInput id='test-input' value='existing' onChange={handleChange} resetOnBlank />,
    );
    const input = getByTestId('test-input-Input');

    fireEvent.change(input, { target: { value: '' } });

    // Unmount — should not flush blank value when resetOnBlank is true
    unmount();
    expect(handleChange).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
