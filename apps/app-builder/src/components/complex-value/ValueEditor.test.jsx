/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { complexValueTypes } from '@m-next/types';
import ValueEditor from './ValueEditor';

jest.mock('@m-next/dropdown', () => () => null);
jest.mock('@m-next/input', () => ({
  DebouncedInput: () => null,
}));
jest.mock('@m-next/datepicker', () => ({
  DatePicker: () => null,
  TimePicker: () => null,
}));

const mockRadioGroupRender = jest.fn();

jest.mock('@m-next/radio-button', () => (props) => {
  mockRadioGroupRender(props);
  return (
    <div data-testid='yes-no-radio-group' data-selected-value={props.selectedValue}>
      <button data-testid='yes-option' type='button' onClick={() => props.onChange(null, 'True')}>
        Yes
      </button>
      <button data-testid='no-option' type='button' onClick={() => props.onChange(null, 'FALSE')}>
        No
      </button>
    </div>
  );
});

describe('ValueEditor Yes/No behavior', () => {
  const defaultProps = {
    id: 'default-value',
    controlList: {},
    onChange: jest.fn(),
    fieldListOptions: [],
    fieldType: 'YesNo',
    controlId: 'control-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selects No by default when Yes/No value is empty', () => {
    render(
      <ValueEditor
        {...defaultProps}
        complexValue={{
          valueType: complexValueTypes.YesNo,
          value: null,
        }}
      />,
    );

    expect(screen.getByTestId('yes-no-radio-group').getAttribute('data-selected-value')).toBe('false');
  });

  it('normalizes string Yes/No values for selection', () => {
    render(
      <ValueEditor
        {...defaultProps}
        complexValue={{
          valueType: complexValueTypes.YesNo,
          value: 'True',
        }}
      />,
    );

    expect(screen.getByTestId('yes-no-radio-group').getAttribute('data-selected-value')).toBe('true');
  });

  it('normalizes radio changes to lowercase true/false strings', () => {
    const onChange = jest.fn();
    render(
      <ValueEditor
        {...defaultProps}
        onChange={onChange}
        complexValue={{
          valueType: complexValueTypes.YesNo,
          value: 'false',
        }}
      />,
    );

    fireEvent.click(screen.getByTestId('yes-option'));
    fireEvent.click(screen.getByTestId('no-option'));

    expect(onChange).toHaveBeenNthCalledWith(1, 'true');
    expect(onChange).toHaveBeenNthCalledWith(2, 'false');
  });
});
