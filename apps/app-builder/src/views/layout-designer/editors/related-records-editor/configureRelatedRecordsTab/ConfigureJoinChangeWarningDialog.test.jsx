import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfigureJoinChangeWarningDialog from './ConfigureJoinChangeWarningDialog';

describe('ConfigureJoinChangeWarningDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const defaultProps = {
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    screenName: 'Test Screen',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with the correct title and text', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);
    
    expect(screen.getByText('Manage linked fields')).toBeInTheDocument();
    expect(screen.getByText('Updating linked fields will break any customizations on the related app screen Test Screen.')).toBeInTheDocument();
    expect(screen.getByText('To proceed, select how you want to modify the screen:')).toBeInTheDocument();
  });

  it('renders the radio buttons with correct options', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);

    expect(screen.getByText(/create a new screen/i)).toBeInTheDocument();
    expect(screen.getByText(/maintain the current screen/i)).toBeInTheDocument();
  });

  it('should select the "replace" option by default', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);

    expect(screen.getByRole('radio', {  name: /create a new screen/i})).toBeChecked();
    expect(screen.getByRole('radio', {  name: /maintain the current screen/i})).not.toBeChecked();
  });

  it('should change selection when a different radio button is clicked', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);

    const keepRadioButton = screen.getByText(/maintain the current screen/i);
    fireEvent.click(keepRadioButton);

    expect(screen.getByRole('radio', {  name: /maintain the current screen/i})).toBeChecked();
    expect(screen.getByRole('radio', {  name: /create a new screen/i})).not.toBeChecked();
  });

  it('should call onClose when the cancel button is clicked', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm with the selected option when the confirm button is clicked', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Confirm'));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).toHaveBeenCalledWith('replace');
  });

  it('should call onConfirm with the "keep" option when it is selected and confirmed', () => {
    render(<ConfigureJoinChangeWarningDialog {...defaultProps} />);

    fireEvent.click(screen.getByText(/maintain the current screen/i));
    fireEvent.click(screen.getByText('Confirm'));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).toHaveBeenCalledWith('keep');
  });
});
