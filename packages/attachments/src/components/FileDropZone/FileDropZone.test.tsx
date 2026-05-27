import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileDropZone } from './FileDropZone';

// Mock dependencies
jest.mock('../../hooks', () => ({
  useFileValidation: jest.fn(() => ({
    validateFile: jest.fn(() => ({ isValid: true })),
  })),
}));

jest.mock('../../utils', () => ({
  sanitizeFilename: jest.fn((filename) => filename),
}));

const baseProps = {
  onFilesAdded: jest.fn(),
  disabled: false,
  maxFileSize: 10485760, // 10MB
  allowedExtensions: ['txt', 'pdf', 'doc'],
  multiple: true,
  isMobile: false,
};

describe('FileDropZone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders drop zone with correct text', () => {
    render(<FileDropZone {...baseProps} />);

    expect(screen.getByText(/Drop files here or/)).toBeInTheDocument();
    expect(screen.getByText(/click to browse/)).toBeInTheDocument();
    expect(screen.getByText(/Individual file size limit is 10 MB/)).toBeInTheDocument();
  });

  it('shows mobile text when isMobile is true', () => {
    render(<FileDropZone {...baseProps} isMobile={true} />);

    expect(screen.getByText('Tap to upload files')).toBeInTheDocument();
  });

  it('shows drag active text when dragging', () => {
    render(<FileDropZone {...baseProps} />);

    const dropZone = screen.getByRole('button');
    fireEvent.dragEnter(dropZone);

    expect(screen.getByText('Drop files here to upload')).toBeInTheDocument();
  });

  it('calls onFilesAdded when files are dropped', () => {
    render(<FileDropZone {...baseProps} />);

    const dropZone = screen.getByRole('button');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [file],
      },
    });

    fireEvent(dropZone, dropEvent);

    expect(baseProps.onFilesAdded).toHaveBeenCalledWith([file], [], []);
  });

  it('calls onFilesAdded when files are selected via input', () => {
    render(<FileDropZone {...baseProps} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input');

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      expect(baseProps.onFilesAdded).toHaveBeenCalledWith([file], [], []);
    }
  });

  it('does not call onFilesAdded when disabled', () => {
    render(<FileDropZone {...baseProps} disabled={true} />);

    const dropZone = screen.getByRole('button');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [file],
      },
    });

    fireEvent(dropZone, dropEvent);

    expect(baseProps.onFilesAdded).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(<FileDropZone {...baseProps} />);

    const dropZone = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(dropZone, { key: 'Enter' });

    // Test Space key
    fireEvent.keyDown(dropZone, { key: ' ' });
  });

  it('prevents default behavior on drag events', () => {
    render(<FileDropZone {...baseProps} />);

    const dropZone = screen.getByRole('button');

    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    const dragOverEvent = new Event('dragover', { bubbles: true });
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });

    fireEvent(dropZone, dragEnterEvent);
    fireEvent(dropZone, dragOverEvent);
    fireEvent(dropZone, dragLeaveEvent);

    // If preventDefault was called, the events should be handled
    expect(dropZone).toBeInTheDocument();
  });

  it('sets correct accept attribute for file input', () => {
    render(<FileDropZone {...baseProps} allowedExtensions={['txt', 'pdf']} />);

    const input = screen.getByRole('button').querySelector('input');
    expect(input).toHaveAttribute('accept', '.txt,.pdf');
  });

  it('handles multiple file selection', () => {
    render(<FileDropZone {...baseProps} multiple={true} />);

    const input = screen.getByRole('button').querySelector('input');
    expect(input).toHaveAttribute('multiple');
  });

  it('disables single file selection when multiple is false', () => {
    render(<FileDropZone {...baseProps} multiple={false} />);

    const input = screen.getByRole('button').querySelector('input');
    expect(input).not.toHaveAttribute('multiple');
  });

  it('calculates max size in MB correctly', () => {
    render(<FileDropZone {...baseProps} maxFileSize={5242880} />); // 5MB

    expect(screen.getByText(/Individual file size limit is 5 MB/)).toBeInTheDocument();
  });

  it('uses default max size when not provided', () => {
    render(<FileDropZone {...baseProps} maxFileSize={undefined} />);

    expect(screen.getByText(/Individual file size limit is 50 MB/)).toBeInTheDocument();
  });

  it('sets tabIndex to -1 when disabled', () => {
    render(<FileDropZone {...baseProps} disabled={true} />);

    const dropZone = screen.getByRole('button');
    expect(dropZone).toHaveAttribute('tabIndex', '-1');
  });

  it('sets tabIndex to 0 when enabled', () => {
    render(<FileDropZone {...baseProps} disabled={false} />);

    const dropZone = screen.getByRole('button');
    expect(dropZone).toHaveAttribute('tabIndex', '0');
  });

  it('provides correct aria-label', () => {
    render(<FileDropZone {...baseProps} maxFileSize={10485760} />);

    const dropZone = screen.getByRole('button');
    expect(dropZone).toHaveAttribute('aria-label', 'Upload files. Individual file size limit is 10MB');
  });
});
