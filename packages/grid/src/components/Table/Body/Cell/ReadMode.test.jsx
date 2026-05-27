/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeIds } from '@m-next/types';
import ReadMode from './ReadMode';

const defaultProps = {
  blankRow: false,
  column: {
    fieldType: FieldTypeIds.YesNo,
    displayOptions: {
      trueIcon: { name: 'check', color: 'green' },
      falseIcon: { name: 'close', color: 'red' },
    },
    editable: true,
    name: 'test-field',
  },
  id: 'test-id',
  primaryKey: 1,
  rowIdx: 0,
  setRowAndCellToEditing: jest.fn(),
  updateCellData: jest.fn(),
  value: true,
  displayValue: '',
  disabled: false,
  displayPreferences: {},
  isMobile: false,
  dragAndDrop: null,
  isLoading: false,
  editingRow: null,
  onSetEditingRow: jest.fn(),
  setEditingCell: jest.fn(),
  editable: true,
  tagsList: [],
  enrichedData: {},
};

describe('ReadMode', () => {
  it('renders without crashing', () => {
    render(<ReadMode {...defaultProps} />);
    expect(screen.getByTestId('test-id-test-field')).toBeInTheDocument();
  });

  it('calls updateCellData and setRowAndCellToEditing on checkbox change', () => {
    render(<ReadMode {...defaultProps} />);
    fireEvent.click(screen.getByTestId('test-id-test-field'));
    expect(defaultProps.updateCellData).toHaveBeenCalledWith(false);
    expect(defaultProps.setRowAndCellToEditing).toHaveBeenCalled();
  });

  it('renders custom component when column.renderAs is provided', () => {
    const customRender = jest.fn().mockReturnValue(<div data-testid='custom-component'>Custom</div>);
    render(<ReadMode {...defaultProps} column={{ ...defaultProps.column, renderAs: customRender }} />);
    expect(screen.getByTestId('custom-component')).toBeInTheDocument();
  });
});
