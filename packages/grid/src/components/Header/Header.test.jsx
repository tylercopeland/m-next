/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';
import { STATUSES } from '../../utilities';

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({ droppableProps: {}, innerRef: jest.fn() }),
}));

jest.mock(
  './HeaderColumn',
  () =>
    function MockHeaderColumn() {
      return <th data-testid='header-column' />;
    },
);

jest.mock('./Header.styles', () => ({
  TR: 'tr',
  TH: 'th',
  Select: 'th',
  ActionColumn: 'th',
}));

const baseProps = (overrides = {}) => ({
  id: 'grid',
  invertSelection: false,
  selectedRecordIds: [],
  selectedRows: [],
  rowRecordIds: [1, 2],
  columns: [{ name: 'Name', visible: true, visibleOnMobile: true }],
  isMobile: false,
  disabled: false,
  rowStatuses: [STATUSES.unchanged, STATUSES.unchanged],
  checked: false,
  totalRecords: 2,
  halfChecked: false,
  setHalfChecked: jest.fn(),
  setChecked: jest.fn(),
  setSelectedOnPage: jest.fn(),
  setNumOfCheckboxes: jest.fn(),
  setNewLinesAdded: jest.fn(),
  onClickMany: jest.fn(),
  setAllRecordsOnOnePage: jest.fn(),
  pageSize: 10,
  onSelectPage: jest.fn(),
  onKeyboardNavigation: jest.fn(),
  selectable: true,
  focusOnSelectAllCheckbox: false,
  reorderColumns: false,
  canDelete: false,
  editable: false,
  defaultColumnWidth: 100,
  onChangeColumnSorting: null,
  sorting: null,
  placeholderProps: {},
  draggableRows: false,
  showMobileCardColumn: false,
  size: 'md',
  containerWidth: 900,
  highlightColumn: null,
  ...overrides,
});

describe('Header selection transitions', () => {
  const renderHeader = (props) =>
    render(
      <table>
        <Header {...props} />
      </table>,
    );

  it('calls onSelectPage(true) when checkbox is clicked from half-checked state', () => {
    const props = baseProps({ halfChecked: true, checked: false });
    const { container } = renderHeader(props);

    const checkbox = container.querySelector('#grid-HEADER-ROW-SELECT-CHECKBOX');
    fireEvent.click(checkbox);

    expect(props.onSelectPage).toHaveBeenCalledWith(true);
  });

  it('derives halfChecked for partial page selection', () => {
    const props = baseProps({ selectedRecordIds: [1], checked: false, halfChecked: false });
    renderHeader(props);

    expect(props.setHalfChecked).toHaveBeenCalledWith(true);
    expect(props.setChecked).toHaveBeenCalledWith(false);
  });

  it('derives checked for full page selection', () => {
    const props = baseProps({ selectedRecordIds: [1, 2], checked: false, halfChecked: false });
    renderHeader(props);

    expect(props.setHalfChecked).toHaveBeenCalledWith(false);
    expect(props.setChecked).toHaveBeenCalledWith(true);
  });

  it('derives checked in invert mode when there are no explicit unselected records', () => {
    const props = baseProps({
      invertSelection: true,
      selectedRecordIds: [],
      selectedRows: [],
      checked: false,
      halfChecked: false,
    });
    renderHeader(props);

    expect(props.setHalfChecked).toHaveBeenCalledWith(false);
    expect(props.setChecked).toHaveBeenCalledWith(true);
  });

  it('supports select all then unselect all from header checkbox', () => {
    const onSelectPage = jest.fn();
    const selectedStateSetters = {
      setHalfChecked: jest.fn(),
      setChecked: jest.fn(),
      setSelectedOnPage: jest.fn(),
      setNumOfCheckboxes: jest.fn(),
      setNewLinesAdded: jest.fn(),
    };

    const { container, rerender } = renderHeader(
      baseProps({
        checked: false,
        halfChecked: false,
        onSelectPage,
        ...selectedStateSetters,
      }),
    );

    const checkbox = container.querySelector('#grid-HEADER-ROW-SELECT-CHECKBOX');
    fireEvent.click(checkbox);
    expect(onSelectPage).toHaveBeenLastCalledWith(true);

    rerender(
      <table>
        <Header
          {...baseProps({
            checked: true,
            halfChecked: false,
            onSelectPage,
            ...selectedStateSetters,
          })}
        />
      </table>,
    );

    const checkedCheckbox = container.querySelector('#grid-HEADER-ROW-SELECT-CHECKBOX');
    fireEvent.click(checkedCheckbox);
    expect(onSelectPage).toHaveBeenLastCalledWith(false);
  });

  it('recomputes selection state when changing pages after unselecting a few rows', () => {
    const setHalfChecked = jest.fn();
    const setChecked = jest.fn();
    const sharedProps = {
      setHalfChecked,
      setChecked,
      setSelectedOnPage: jest.fn(),
      setNumOfCheckboxes: jest.fn(),
      setNewLinesAdded: jest.fn(),
    };

    const { rerender } = renderHeader(
      baseProps({
        rowRecordIds: [1, 2, 3],
        selectedRecordIds: [1, 3],
        checked: false,
        halfChecked: false,
        ...sharedProps,
      }),
    );

    expect(setHalfChecked).toHaveBeenCalledWith(true);
    expect(setChecked).toHaveBeenCalledWith(false);

    setHalfChecked.mockClear();
    setChecked.mockClear();

    rerender(
      <table>
        <Header
          {...baseProps({
            rowRecordIds: [4, 5, 6],
            selectedRecordIds: [1, 3],
            checked: false,
            halfChecked: true,
            ...sharedProps,
          })}
        />
      </table>,
    );

    expect(setHalfChecked).toHaveBeenCalledWith(false);
    expect(setChecked).toHaveBeenCalledWith(false);
  });

  it('shows half-checked when rows are selected across pages and current page has a subset selected', () => {
    const setHalfChecked = jest.fn();
    const setChecked = jest.fn();

    renderHeader(
      baseProps({
        rowRecordIds: [4, 5, 6],
        selectedRecordIds: [1, 5, 9],
        checked: false,
        halfChecked: false,
        setHalfChecked,
        setChecked,
      }),
    );

    expect(setHalfChecked).toHaveBeenCalledWith(true);
    expect(setChecked).toHaveBeenCalledWith(false);
  });
});
