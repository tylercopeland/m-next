/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeNames } from '@m-next/types';
import YesNoValueEditor from './YesNoValueEditor';

describe('YesNoValueEditor', () => {
  const defaultProps = {
    id: 'test-id',
    selectedValue: 'true',
    onChange: jest.fn(),
    direction: 'row',
    disabled: false,
    field: null,
  };

  it('renders with default options', () => {
    render(<YesNoValueEditor {...defaultProps} />);
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    render(<YesNoValueEditor {...defaultProps} />);
    fireEvent.click(screen.getByText('False'));
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('renders with custom field options', () => {
    const customField = {
      name: 'test',
      caption: 'Test',
      type: FieldTypeNames.YesNo,
      displayAs: 'custom',
      displayOptions: {
        trueValue: 'Yes',
        falseValue: 'No',
      },
    };
    render(<YesNoValueEditor {...defaultProps} field={customField} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
});
