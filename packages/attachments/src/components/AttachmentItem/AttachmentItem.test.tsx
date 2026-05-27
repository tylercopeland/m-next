/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttachmentItem } from './AttachmentItem';

// Mock dependencies
jest.mock('@m-next/checkbox', () => ({
  __esModule: true,
  default: ({ id, checked, onChange, disabled, hidden }: any) => (
    <input
      data-testid={id}
      type='checkbox'
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      style={{ display: hidden ? 'none' : 'block' }}
    />
  ),
}));

jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: ({ id, name, onClick }: any) => (
    <div data-testid={id} onClick={onClick}>
      {name}
    </div>
  ),
}));

jest.mock('../../hooks', () => ({
  useUploadProgress: jest.fn(),
}));

jest.mock('../../utils', () => ({
  formatFileSize: jest.fn((size) => `${size} bytes`),
  getFileExtension: jest.fn((filename) => filename.split('.').pop() || ''),
}));

const baseProps = {
  id: 'test-file-1',
  filename: 'test-file.txt',
  fileExtension: 'txt',
  url: 'http://example.com/test-file.txt',
  size: 1024,
  modifiedBy: 'Test User',
  createdDate: '2023-01-01T10:00:00Z',
  onLinkClick: jest.fn(),
  onRemove: jest.fn(),
  onToggleCheckbox: jest.fn(),
  onUploadEnd: jest.fn(),
};

describe('AttachmentItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file information correctly', () => {
    render(<AttachmentItem {...baseProps} />);

    expect(screen.getByText('test-file.txt')).toBeInTheDocument();
    expect(screen.getByText('txt')).toBeInTheDocument();
  });

  it('calls onLinkClick when file name is clicked', () => {
    render(<AttachmentItem {...baseProps} />);

    fireEvent.click(screen.getByText('test-file.txt'));
    expect(baseProps.onLinkClick).toHaveBeenCalledWith('test-file-1', 'http://example.com/test-file.txt');
  });

  it('calls onRemove when remove icon is clicked', () => {
    render(<AttachmentItem {...baseProps} />);

    fireEvent.click(screen.getByTestId('test-file-1-remove-icon'));
    expect(baseProps.onRemove).toHaveBeenCalledWith('test-file-1');
  });

  it('displays checkbox when displayCheckbox is true', () => {
    render(<AttachmentItem {...baseProps} displayCheckbox={true} />);

    expect(screen.getByTestId('test-file-1-checkbox')).toBeInTheDocument();
  });

  it('calls onToggleCheckbox when checkbox is changed', () => {
    render(<AttachmentItem {...baseProps} displayCheckbox={true} />);

    const checkbox = screen.getByTestId('test-file-1-checkbox');
    fireEvent.click(checkbox);
    expect(baseProps.onToggleCheckbox).toHaveBeenCalledWith('test-file-1', expect.any(Object));
  });

  it('displays error message when errorMessage is provided', () => {
    render(<AttachmentItem {...baseProps} errorMessage='Upload failed' />);

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('shows uploading state when uploading is true', () => {
    render(<AttachmentItem {...baseProps} uploading={true} />);

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('shows progress when progress is provided', () => {
    render(<AttachmentItem {...baseProps} progress={50} />);

    expect(screen.getByText('50% uploading...')).toBeInTheDocument();
  });

  it('disables interactions when uploading', () => {
    render(<AttachmentItem {...baseProps} uploading={true} />);

    fireEvent.click(screen.getByText('test-file.txt'));
    expect(baseProps.onLinkClick).not.toHaveBeenCalled();
  });

  it('disables interactions when there is an error', () => {
    render(<AttachmentItem {...baseProps} errorMessage='Upload failed' />);

    fireEvent.click(screen.getByText('test-file.txt'));
    expect(baseProps.onLinkClick).not.toHaveBeenCalled();
  });

  it('hides remove icon when disabled', () => {
    render(<AttachmentItem {...baseProps} disabled={true} />);

    expect(screen.queryByTestId('test-file-1-remove-icon')).not.toBeInTheDocument();
  });

  it('displays file description with all information', () => {
    render(<AttachmentItem {...baseProps} />);

    // The description should contain the formatted date, user, and size
    expect(screen.getByText(/by Test User/)).toBeInTheDocument();
    expect(screen.getByText(/1024 bytes/)).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      id: 'test-file-1',
      filename: 'test-file.txt',
      onLinkClick: jest.fn(),
      onRemove: jest.fn(),
      onToggleCheckbox: jest.fn(),
      onUploadEnd: jest.fn(),
    };

    render(<AttachmentItem {...minimalProps} />);

    expect(screen.getByText('test-file.txt')).toBeInTheDocument();
  });

  it('uses fileExtension when provided', () => {
    render(<AttachmentItem {...baseProps} fileExtension='pdf' />);

    expect(screen.getByText('pdf')).toBeInTheDocument();
  });

  it('falls back to filename extension when fileExtension is not provided', () => {
    render(<AttachmentItem {...baseProps} fileExtension='' />);

    expect(screen.getByText('txt')).toBeInTheDocument();
  });
});
