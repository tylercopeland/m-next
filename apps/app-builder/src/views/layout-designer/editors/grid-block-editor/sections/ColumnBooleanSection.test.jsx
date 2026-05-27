import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ColumnBooleanSection from './ColumnBooleanSection';

describe('ColumnBooleanSection', () => {
  const mockOnChange = jest.fn();
  const column = {
    displayAs: 'custom',
    field: 'testField',
    displayOptions: {
      trueValue: 'Yes',
      falseValue: 'No',
    },
  };

  it('renders without crashing', () => {
    const { getByText } = render(<ColumnBooleanSection column={column} onChange={mockOnChange} />);
    expect(getByText('Show alternative Yes/No')).toBeInTheDocument();
  });

  it('renders true and false value inputs when displayAs is custom', () => {
    const { getByLabelText } = render(<ColumnBooleanSection column={column} onChange={mockOnChange} />);
    expect(getByLabelText('Value for true')).toBeInTheDocument();
    expect(getByLabelText('Value for false')).toBeInTheDocument();
  });

  it('calls onChange when false value is changed', () => {
    const { getByTestId } = render(<ColumnBooleanSection column={column} onChange={mockOnChange} />);
    expect(getByTestId('display-value-Toggle-wrapper')).toBeInTheDocument();

    act(() => {
      userEvent.click(getByTestId('display-value-Toggle-wrapper'));
      expect(screen.getByRole('textbox', { name: /Value for false/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Value for true/i })).toBeInTheDocument();
      userEvent.type(screen.getByRole('textbox', { name: /Value for false/i }), 'False');
    });
  });
});
