/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, act } from '@testing-library/react';
import ShowHideColumns from './ShowHideColumns';

const columns = [
  { name: 'column1', caption: 'Column 1' },
  { name: 'column2', caption: 'Column 2' },
  { name: 'column3', caption: 'Column 3' },
];

const activeColumns = [{ name: 'column1', caption: 'Column 1' }];

describe('ShowHideColumns', () => {
  it('renders without crashing', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ShowHideColumns id='test' columns={columns} activeColumns={activeColumns} />,
    );
    act(() => {
      fireEvent.click(getByTestId('test-show-hide-menu-menu-icon-wrapper'));
    });
    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('filters columns based on search input', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <ShowHideColumns id='test' columns={columns} activeColumns={activeColumns} />,
    );
    act(() => {
      fireEvent.click(getByTestId('test-show-hide-menu-menu-icon-wrapper'));
    });
    const searchInput = getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Column 2' } });
    expect(getByText('Column 2')).toBeInTheDocument();
  });

  it('calls onChange when a column is toggled', () => {
    const onChange = jest.fn();
    const { getByText, getByTestId } = render(
      <ShowHideColumns id='test' columns={columns} activeColumns={activeColumns} onChange={onChange} />,
    );
    act(() => {
      fireEvent.click(getByTestId('test-show-hide-menu-menu-icon-wrapper'));
    });
    const checkbox = getByText('Column 2');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith([...activeColumns, columns[1]]);
  });

  it('handles keyboard navigation', () => {
    const mockChangeCallback = jest.fn();

    const { getByPlaceholderText, getByTestId } = render(
      <ShowHideColumns id='test' columns={columns} activeColumns={activeColumns} onChange={mockChangeCallback} />,
    );
    act(() => {
      fireEvent.click(getByTestId('test-show-hide-menu-menu-icon-wrapper'));
    });
    const searchInput = getByPlaceholderText('Search');
    fireEvent.keyUp(searchInput, { keyCode: 40 }); // Arrow down
    fireEvent.keyUp(searchInput, { keyCode: 13 }); // Enter
    expect(mockChangeCallback).toHaveBeenCalledWith([]);
  });
});
