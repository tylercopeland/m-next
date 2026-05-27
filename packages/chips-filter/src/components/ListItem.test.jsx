/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ListItem from './ListItem';

describe('ListItem', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
  });

  const defaultProps = {
    id: 'test-id',
    label: 'Test Label',
    onClick: jest.fn(),
    value: 'test-value',
  };

  it('renders the label', () => {
    const { getByText } = render(<ListItem {...defaultProps} />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onClick when label is clicked', () => {
    const { getByText } = render(<ListItem {...defaultProps} />);
    fireEvent.click(getByText('Test Label'));
    expect(defaultProps.onClick).toHaveBeenCalledWith('test-value');
  });

  it('renders the checkbox when showCheckbox is true', () => {
    const { getByRole } = render(<ListItem {...defaultProps} showCheckbox />);
    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders the checkbox on the right when rightSelect is true', () => {
    const { getByRole } = render(<ListItem {...defaultProps} showCheckbox rightSelect />);
    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
