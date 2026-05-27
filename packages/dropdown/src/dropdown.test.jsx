/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Dropdown from './dropdown';

describe('Dropdown Component', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const defaultProps = {
    id: 'test-dropdown',
    options: mockOptions,
    onChange: jest.fn(),
    placeholder: 'Select an option',
  };

  it('renders without crashing', () => {
    render(<Dropdown {...defaultProps} />);
    expect(screen.getByText('Select an option')).toBeDefined();
  });

  it('displays options when clicked', () => {
    render(<Dropdown {...defaultProps} />);
    const dropdown = screen.getByTestId('test-dropdown-dropdown-list');
    fireEvent.keyDown(dropdown.firstChild, { key: 'ArrowDown' });
    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeDefined();
    });
  });

  it('calls onChange when an option is selected', () => {
    const onChangeMock = jest.fn();
    render(<Dropdown {...defaultProps} onChange={onChangeMock} />);
    const dropdown = screen.getByTestId('test-dropdown-dropdown-list');
    fireEvent.keyDown(dropdown.firstChild, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('Option 1'));
    expect(onChangeMock).toHaveBeenCalledWith(mockOptions[0]);
  });

  it('renders a caption if provided', () => {
    render(<Dropdown {...defaultProps} caption='Test Caption' />);
    expect(screen.getByText('Test Caption')).toBeDefined();
  });

  it('renders validation message when provided', () => {
    render(<Dropdown {...defaultProps} validationMessage='This field is required' />);
    expect(screen.getByText('This field is required')).toBeDefined();
  });

  it('supports multi-select when isMultiSelect is true', () => {
    render(<Dropdown {...defaultProps} isMultiSelect />);
    const dropdown = screen.getByTestId('test-dropdown-dropdown-list');
    fireEvent.keyDown(dropdown.firstChild, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('Option 1'));
    fireEvent.click(screen.getByText('Option 2'));
    expect(screen.getByText('Option 1')).toBeDefined();
    expect(screen.getByText('Option 2')).toBeDefined();
  });

  it('renders a custom action button when actionButtonText is provided', () => {
    const onActionButtonClickMock = jest.fn();
    render(
      <Dropdown
        {...defaultProps}
        actionButtonText='Custom Action'
        onActionButtonClick={onActionButtonClickMock}
        isCreateable
      />,
    );
    const dropdown = screen.getByTestId('test-dropdown-dropdown-list-creatable');
    fireEvent.keyDown(dropdown.firstChild, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('Custom Action'));
    expect(onActionButtonClickMock).toHaveBeenCalled();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(<Dropdown {...defaultProps} isLoading />);
    expect(screen.getByTestId('loading-skeleton')).toBeDefined();
  });
});
