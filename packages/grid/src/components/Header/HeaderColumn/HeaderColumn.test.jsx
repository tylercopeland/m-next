/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeIds } from '@m-next/types';
import HeaderColumn from './HeaderColumn';

const column = {
  name: 'Test Column',
  fieldType: FieldTypeIds.Text,
  columnAlign: 'left',
  caption: 'Test Caption',
};

const defaultProps = {
  id: 'test-id',
  column,
  index: 0,
  onChangeColumnSorting: jest.fn(),
  isMobile: false,
  reorderColumns: false,
  sorting: 0,
  draggingOver: false,
  isAColumnDragging: false,
  hideLeftBorder: false,
  size: 'md',
  defaultColumnWidth: 100,
  containerWidth: 500,
};

describe('HeaderColumn', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <table>
        <thead>
          <tr>
            <HeaderColumn {...defaultProps} />
          </tr>
        </thead>
      </table>,
    );
    expect(getByText('Test Caption')).toBeInTheDocument();
  });

  it('calls onChangeColumnSorting when clicked', () => {
    const { getByText } = render(
      <table>
        <thead>
          <tr>
            <HeaderColumn {...defaultProps} />
          </tr>
        </thead>
      </table>,
    );
    fireEvent.click(getByText('Test Caption'));
    expect(defaultProps.onChangeColumnSorting).toHaveBeenCalledWith(
      'Test Column',
      1,
      'Column Click',
      expect.any(Object),
    );
  });

  it('does not call onChangeColumnSorting when sortable is false', () => {
    const { getByText } = render(
      <table>
        <thead>
          <tr>
            <HeaderColumn {...defaultProps} onChangeColumnSorting={null} />
          </tr>
        </thead>
      </table>,
    );
    fireEvent.click(getByText('Test Caption'));
    expect(defaultProps.onChangeColumnSorting).not.toHaveBeenCalled();
  });

  it('renders non-draggable header when reorderColumns is false', () => {
    const { getByText } = render(
      <table>
        <thead>
          <tr>
            <HeaderColumn {...defaultProps} reorderColumns={false} />
          </tr>
        </thead>
      </table>,
    );
    expect(getByText('Test Caption')).toBeInTheDocument();
  });
});
