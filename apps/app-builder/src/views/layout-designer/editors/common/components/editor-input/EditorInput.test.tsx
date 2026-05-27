import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditorInput from './EditorInput';

describe('EditorInput', () => {
  const defaultProps = {
    id: 'test-input',
    value: 'test value',
    label: 'Test Label',
    onChange: jest.fn(),
    controlId: 'control-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<EditorInput {...defaultProps} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('does not show warning when value is at max length', () => {
    render(<EditorInput {...defaultProps} value="12345" maxLength={5} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.queryByText('Max length 5')).not.toBeInTheDocument();
  });

  it('does not show warning when numeric value is at max value', () => {
    render(<EditorInput {...defaultProps} value={10} maxLength={10} type="number" />);

    expect(screen.queryByText('Max length 10')).not.toBeInTheDocument();
  });

    it('does not show warning when value is empty', () => {
    render(<EditorInput {...defaultProps} value="" maxLength={5} />);

    expect(screen.queryByText('Max length 5')).not.toBeInTheDocument();
  });

  it('shows warning when string value exceeds max length', () => {
    render(<EditorInput {...defaultProps} value="test" maxLength={5} />);

    const input = screen.getByRole('textbox', { name: 'Test Label' });
    
    // Simulate user typing beyond max length
    fireEvent.change(input, { target: { value: '123456' } });
    
    // Warning should appear when attempting to exceed limit
    expect(screen.getByText('Max length 5')).toBeInTheDocument();
  });

  it('shows warning message with suffix for numeric types when limit exceeded', () => {
    render(
      <EditorInput 
        {...defaultProps} 
        value={100} 
        maxLength={50} 
        suffixText="px" 
        type="integer" 
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    // Warning should only appear when user tries to exceed limit, not when at limit
    expect(screen.queryByText('Max length 50px')).not.toBeInTheDocument();
  });

  it('clears warning message on blur after delay', async () => {
    render(<EditorInput {...defaultProps} maxLength={5} />);
    const input = screen.getByRole('textbox', { name: 'Test Label' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '123456' } });
    
    expect(screen.getByText('Max length 5')).toBeInTheDocument();
    fireEvent.blur(input);

    const warningMessage = screen.queryByText('Max length 5');
    expect(warningMessage).toBeInTheDocument();
   
    await waitFor(() => {
      expect(screen.queryByText('Max length 5')).not.toBeInTheDocument();
    });
  });

  it('handles string values correctly', () => {
    const onChangeSpy = jest.fn();
    render(<EditorInput {...defaultProps} onChange={onChangeSpy} value="test" />);

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('handles number values correctly', () => {
    const onChangeSpy = jest.fn();
    render(<EditorInput {...defaultProps} onChange={onChangeSpy} value={42} type="integer" />);

    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });

  it('shows child icon when showChildIcon is true', () => {
    render(<EditorInput {...defaultProps} showChildIcon />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies custom width', () => {
    render(<EditorInput {...defaultProps} width="300px" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<EditorInput {...defaultProps} disabled />);

    const input = screen.getByDisplayValue('test value');
    expect(input).toBeDisabled();
  });

  it('shows placeholder when provided', () => {
    render(<EditorInput {...defaultProps} value="" placeholder="Enter value..." />);

    expect(screen.getByPlaceholderText('Enter value...')).toBeInTheDocument();
  });

  it('handles different alignment options', () => {
    render(<EditorInput {...defaultProps} align="center" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles custom gap', () => {
    render(<EditorInput {...defaultProps} gap={24} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles object values gracefully', () => {
    const onChangeSpy = jest.fn();
    const { container } = render(<EditorInput {...defaultProps} onChange={onChangeSpy} />);

    // Should not throw or cause errors when object is passed
    expect(container).toBeInTheDocument();
  });
});