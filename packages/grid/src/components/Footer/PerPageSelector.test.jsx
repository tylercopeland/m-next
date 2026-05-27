/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PerPageSelector from './PerPageSelector';

describe('PerPageSelector', () => {
  const defaultProps = {
    disabled: false,
    id: 'test',
    selected: 10,
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<PerPageSelector {...defaultProps} />);
    expect(screen.getByLabelText('test-PAGE-SELECTOR')).toBeInTheDocument();
  });

  it('displays the correct options', () => {
    render(<PerPageSelector {...defaultProps} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('5');
    expect(options[1]).toHaveTextContent('10');
    expect(options[2]).toHaveTextContent('25');
    expect(options[3]).toHaveTextContent('50');
    expect(options[4]).toHaveTextContent('100');
  });

  it('calls onChange when a new option is selected', () => {
    render(<PerPageSelector {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('test-PAGE-SELECTOR'), { target: { value: '25' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('25');
  });

  it('disables the selector when disabled prop is true', () => {
    render(<PerPageSelector {...defaultProps} disabled />);
    expect(screen.getByLabelText('test-PAGE-SELECTOR')).toBeDisabled();
  });

  it('adds selected value to options if not present', () => {
    render(<PerPageSelector {...defaultProps} selected={15} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6);
    expect(options[5]).toHaveTextContent('100');
  });
});
