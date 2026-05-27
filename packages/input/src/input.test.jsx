/* eslint-disable import/no-extraneous-dependencies */
import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Input from './input';

describe('Input Component', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    const { getByLabelText } = render(<Input {...defaultProps} />);
    expect(getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    const { getByText } = render(<Input {...defaultProps} />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when the input value changes', () => {
    const { getByLabelText } = render(<Input {...defaultProps} />);
    const input = getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('displays the placeholder text', () => {
    const placeholderText = 'Enter text';
    const { getByPlaceholderText } = render(<Input {...defaultProps} placeholder={placeholderText} />);
    expect(getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('handles focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByLabelText } = render(<Input {...defaultProps} onFocus={onFocus} onBlur={onBlur} />);
    const input = getByLabelText('Test Label');
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });

  it('displays validation message', () => {
    const validationMessage = 'This field is required';
    const { getByText } = render(<Input {...defaultProps} validationMessage={validationMessage} />);
    expect(getByText(validationMessage)).toBeInTheDocument();
  });

  it('renders with a prefix icon', () => {
    const prefixIcon = 'search';
    const { container } = render(<Input {...defaultProps} prefixIcon={prefixIcon} />);
    expect(container.querySelector('.mi-textinput-prefix')).toBeInTheDocument();
  });

  it('renders with a suffix text', () => {
    const suffixText = 'USD';
    const { getByText } = render(<Input {...defaultProps} suffixText={suffixText} />);
    expect(getByText(suffixText)).toBeInTheDocument();
  });

  it('handles autoFocus correctly', () => {
    const { getByLabelText } = render(<Input {...defaultProps} autoFocus />);
    const input = getByLabelText('Test Label');
    expect(document.activeElement).toBe(input);
  });

  it('disables the input when disabled prop is true', () => {
    const { getByLabelText } = render(<Input {...defaultProps} disabled />);
    const input = getByLabelText('Test Label');
    expect(input).toBeDisabled();
  });

  it('forward ref', () => {
    const ref = createRef(null);
    const { getByLabelText } = render(<Input {...defaultProps} forwardRef={ref} />);
    expect(getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('use validation checks', () => {
    const { getByLabelText } = render(
      <Input
        {...defaultProps}
        autoFocus
        required
        useValidation
        type='email'
        maxLength={50}
        minLength={5}
        minValue={0}
        maxValue={10}
      />,
    );
    const input = getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(document.activeElement).toBe(input);
  });
});
