import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock scrollTo for jsdom
    Element.prototype.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<ChatInput onChange={mockOnChange} />);

    const input = screen.getByTestId('chat-input-textarea');
    await user.type(input, 'T');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('applies custom placeholder', () => {
    render(<ChatInput placeholder='Custom placeholder' />);
    const input = screen.getByTestId('chat-input-textarea');
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
  });

  it('handles Enter key for submit', () => {
    const mockOnSubmit = jest.fn();
    render(<ChatInput onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId('chat-input-textarea');
    fireEvent.change(input, { target: { value: 'Test message' } });

    // Simulate Enter key
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnSubmit).toHaveBeenCalledWith('Test message', [], undefined);
  });

  it('disables submit button when input is empty', () => {
    render(<ChatInput />);
    const button = screen.getByTestId('chat-input-send-button');
    expect(button).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    render(<ChatInput />);
    const input = screen.getByTestId('chat-input-textarea');
    const button = screen.getByTestId('chat-input-send-button');

    fireEvent.change(input, { target: { value: 'Test' } });
    expect(button).not.toBeDisabled();
  });

  it('renders attach button', () => {
    render(<ChatInput />);
    const attachButton = screen.getByTestId('chat-input-attach-button');
    expect(attachButton).toBeInTheDocument();
  });

  it('triggers file input when attach button is clicked', () => {
    render(<ChatInput />);
    const attachButton = screen.getByTestId('chat-input-attach-button');
    const fileInput = screen.getByTestId('chat-input-file-input');

    const clickSpy = jest.spyOn(fileInput, 'click');
    fireEvent.click(attachButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('handles file attachments and includes them in submit', () => {
    const mockOnSubmit = jest.fn();
    render(<ChatInput onSubmit={mockOnSubmit} />);

    const fileInput = screen.getByTestId('chat-input-file-input') as HTMLInputElement;
    const textInput = screen.getByTestId('chat-input-textarea');

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    fireEvent.change(fileInput);
    fireEvent.change(textInput, { target: { value: 'Test message' } });
    fireEvent.keyDown(textInput, { key: 'Enter' });

    expect(mockOnSubmit).toHaveBeenCalledWith('Test message', [file], undefined);
  });

  it('does not submit on Shift+Enter', () => {
    const mockOnSubmit = jest.fn();
    render(<ChatInput onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId('chat-input-textarea');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('clears input after submit in uncontrolled mode', () => {
    const mockOnSubmit = jest.fn();
    render(<ChatInput onSubmit={mockOnSubmit} />);

    const input = screen.getByTestId('chat-input-textarea') as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input.value).toBe('');
  });

  it('respects controlled value', () => {
    render(<ChatInput value='controlled value' controlled />);
    const input = screen.getByTestId('chat-input-textarea') as HTMLTextAreaElement;
    expect(input.value).toBe('controlled value');
  });
});
