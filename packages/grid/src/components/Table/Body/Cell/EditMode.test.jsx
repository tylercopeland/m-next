/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeIds } from '@m-next/types';
import EditMode from './EditMode';

const defaultProps = {
  column: {
    fieldType: FieldTypeIds.Text,
    editable: true,
    name: 'testColumn',
    columnAlign: 'left',
  },
  id: 'testId',
  value: 'testValue',
  updateCellData: jest.fn(),
  handleLoseFocus: jest.fn(),
  onKeyUp: jest.fn(),
  inputElRef: React.createRef(),
};

describe('EditMode', () => {
  it('renders input field for text type', () => {
    const { getByDisplayValue } = render(<EditMode {...defaultProps} />);
    expect(getByDisplayValue('testValue')).toBeInTheDocument();
  });
});
