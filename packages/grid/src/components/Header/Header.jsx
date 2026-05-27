import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Sorting } from '@m-next/types';
import { Checkbox } from '@m-next/checkbox';
import SvgIcon from '@m-next/svg-icon';
import { Droppable } from 'react-beautiful-dnd';
import * as s from './Header.styles';
import HeaderColumn from './HeaderColumn';
import { STATUSES } from '../../utilities';
import Column from '../../ColumnPropType';

const propTypes = {
  invertSelection: PropTypes.bool,
  selectedRecordIds: PropTypes.arrayOf(PropTypes.number),
  selectedRows: PropTypes.arrayOf(PropTypes.number),
  rowRecordIds: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.arrayOf(Column),

  id: PropTypes.string,
  disabled: PropTypes.bool,
  isMobile: PropTypes.bool,
  rowStatuses: PropTypes.arrayOf(PropTypes.number),
  checked: PropTypes.bool,
  totalRecords: PropTypes.number,
  halfChecked: PropTypes.bool,

  setHalfChecked: PropTypes.func,
  setChecked: PropTypes.func,
  setSelectedOnPage: PropTypes.func,
  setNumOfCheckboxes: PropTypes.func,
  setNewLinesAdded: PropTypes.func,
  onClickMany: PropTypes.func,
  setAllRecordsOnOnePage: PropTypes.func,
  pageSize: PropTypes.number,
  onSelectPage: PropTypes.func,
  onKeyboardNavigation: PropTypes.func,
  selectable: PropTypes.bool,
  focusOnSelectAllCheckbox: PropTypes.bool,
  reorderColumns: PropTypes.bool,
  canDelete: PropTypes.bool,
  editable: PropTypes.bool,
  defaultColumnWidth: PropTypes.number,
  onChangeColumnSorting: PropTypes.func,
  sorting: Sorting,
  placeholderProps: PropTypes.instanceOf(Object),
  draggableRows: PropTypes.bool,
  showMobileCardColumn: PropTypes.bool,
  size: PropTypes.string,
  containerWidth: PropTypes.number,
  highlightColumn: PropTypes.string,
};

function Header({
  invertSelection,
  selectedRecordIds,
  selectedRows,
  rowRecordIds,
  columns,
  id,
  isMobile,
  disabled,
  rowStatuses,
  checked,
  totalRecords,
  halfChecked,
  setHalfChecked,
  setChecked,
  setSelectedOnPage,
  setNumOfCheckboxes,
  setNewLinesAdded,
  onClickMany,
  setAllRecordsOnOnePage,
  pageSize,
  onSelectPage,
  onKeyboardNavigation,
  selectable,
  focusOnSelectAllCheckbox,
  reorderColumns,
  canDelete,
  editable,
  defaultColumnWidth,
  onChangeColumnSorting,
  sorting,
  placeholderProps,
  draggableRows,
  showMobileCardColumn,
  size,
  containerWidth,
  highlightColumn,
}) {
  const [totalRecordsUnknown, setTotalRecordsUnknown] = useState(false);
  const firstVisible = useMemo(() => columns.findIndex((x) => x.visible), [columns]);

  const pageIsSelected = () => {
    let countSelected = 0;
    let countPageTotal = 0;
    let countUnselected = 0;

    rowRecordIds.forEach((item, rowIdx) => {
      // Add selected (existing and new)
      if (
        ((!invertSelection && selectedRecordIds.indexOf(item) > -1) || selectedRows.indexOf(rowIdx) > -1) &&
        (!invertSelection || selectedRecordIds.indexOf(item) === -1)
      ) {
        countSelected += 1;
      }

      // Unselected count
      if (invertSelection && selectedRecordIds.indexOf(item) > -1) {
        countUnselected += 1;
      }

      // Count all minus Deleted and Blank
      if (rowStatuses[rowIdx] !== STATUSES.deleted && rowStatuses[rowIdx] !== STATUSES.blank) {
        countPageTotal += 1;
      }

      // Remove new items from countSelected if they are not active
      if (selectedRows.indexOf(rowIdx) > -1 && rowStatuses[rowIdx] === STATUSES.blank) {
        countSelected -= 1;
      }

      // Remove new items from countSelected if they are de-selected
      if (
        item === -1 &&
        !invertSelection &&
        selectedRecordIds.indexOf(item) > -1 &&
        selectedRows.indexOf(rowIdx) === -1
      ) {
        countSelected -= 1;
      }
    });

    if (rowRecordIds.length === 0) {
      countSelected = selectedRecordIds.length || selectedRows.length;
      countPageTotal = totalRecords;
    }

    let nextChecked = false;
    let nextHalfChecked = false;

    if (countSelected > 0 && countSelected === countPageTotal) {
      nextChecked = true;
    } else if (countSelected > 0 && countSelected < countPageTotal) {
      nextHalfChecked = true;
    }

    if (countSelected === 0 && countUnselected === 0 && invertSelection) {
      nextChecked = true;
      nextHalfChecked = false;
    }

    setHalfChecked(nextHalfChecked);
    setChecked(nextChecked);

    // Set count selected
    setSelectedOnPage(countSelected);

    // Set number of checkboxes per page
    setNumOfCheckboxes(countPageTotal);

    // Set newLinesAdded
    if (rowRecordIds.indexOf(-1) > -1) setNewLinesAdded(true);
    else setNewLinesAdded(false);
  };

  useEffect(() => {
    pageIsSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordIds, selectedRows, rowRecordIds, invertSelection]);

  useEffect(() => {
    if (invertSelection && !totalRecords) {
      onClickMany();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invertSelection]);

  useEffect(() => {
    const totalUnknown = rowRecordIds.length > 0 && totalRecords === 0; // "Many" link is displayed in grid footer
    if (totalRecordsUnknown !== totalUnknown) setTotalRecordsUnknown(totalUnknown);

    if (pageSize >= totalRecords && !totalUnknown) setAllRecordsOnOnePage(true);
    else setAllRecordsOnOnePage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, totalRecords, rowRecordIds]);

  const handleSelectPage = (isChecked) => {
    onSelectPage(isChecked);
    setHalfChecked(false);
    setChecked(isChecked);
  };

  const handleKeyboardNavigation = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
      if (e.keyCode === 40) onKeyboardNavigation(40, -1, 'checkbox');
    }
  };

  const renderDraggable = () => (
    <thead>
      <Droppable droppableId='droppableHeader' direction='horizontal' type='COLUMN' ignoreContainerClipping>
        {(provided) => (
          <s.TR id={`${id}-HEADER-ROW`} {...provided.droppableProps} ref={provided.innerRef}>
            {draggableRows && !selectable && (
              <s.TH>
                <span style={{ width: 20, display: 'block' }} />
              </s.TH>
            )}
            {selectable && (
              <s.Select id={`${id}-HEADER-ROW-SELECT`} selected={checked || halfChecked}>
                <Checkbox
                  align='center'
                  autoFocus={focusOnSelectAllCheckbox}
                  checked={checked}
                  disabled={disabled || totalRecords === 0}
                  halfChecked={halfChecked}
                  id={`${id}-HEADER-ROW-SELECT-CHECKBOX`}
                  onChange={handleSelectPage}
                  onKeyDown={handleKeyboardNavigation}
                  narrow
                />
              </s.Select>
            )}

            {columns.map((column, index) => {
              if ((!showMobileCardColumn && column.visible) || (showMobileCardColumn && column.visibleOnMobile)) {
                let sort = null;
                if (sorting && sorting.sortField === column.name) {
                  sort = sorting.sortType;
                }

                return (
                  <HeaderColumn
                    key={`${id}-HEADER-ROW-${column.name}`}
                    id={`${id}-HEADER-ROW-${index}`}
                    column={column}
                    index={index}
                    reorderColumns={reorderColumns}
                    defaultColumnWidth={defaultColumnWidth}
                    isMobile={isMobile}
                    onChangeColumnSorting={onChangeColumnSorting}
                    sorting={sort}
                    draggingOver={
                      placeholderProps.type === 'COLUMN' &&
                      placeholderProps.destinationIndex === index &&
                      placeholderProps.destinationIndex !== placeholderProps.sourceIndex
                    }
                    isAColumnDragging={
                      placeholderProps.sourceIndex !== null && placeholderProps.sourceIndex !== undefined
                    }
                    hideLeftBorder={firstVisible === index}
                    size={size}
                    containerWidth={containerWidth}
                    highlightColumn={highlightColumn}
                  />
                );
              }
              return null;
            })}

            {canDelete && editable && (
              <s.ActionColumn id={`${id}-HEADER-ROW-LAST`} hasCardColumnsMobile={showMobileCardColumn}>
                &nbsp;
              </s.ActionColumn>
            )}
          </s.TR>
        )}
      </Droppable>
    </thead>
  );

  const render = () => (
    <thead>
      <s.TR id={`${id}-HEADER-ROW`}>
        {draggableRows && (
          <s.TH>
            <SvgIcon name='' size={16} />
          </s.TH>
        )}
        {selectable && (
          <s.Select id={`${id}-HEADER-ROW-SELECT`} selected={checked || halfChecked}>
            <Checkbox
              align='center'
              autoFocus={focusOnSelectAllCheckbox}
              checked={checked}
              disabled={disabled || totalRecords === 0}
              halfChecked={halfChecked}
              id={`${id}-HEADER-ROW-SELECT-CHECKBOX`}
              onChange={handleSelectPage}
              onKeyDown={handleKeyboardNavigation}
              narrow
            />
          </s.Select>
        )}
        {columns.map((column, index) => {
          if ((!showMobileCardColumn && column.visible) || (showMobileCardColumn && column.visibleOnMobile)) {
            let sort = null;
            if (sorting && sorting.sortField === column.name) {
              sort = sorting.sortType;
            }

            return (
              <HeaderColumn
                key={`${id}-HEADER-ROW-${column.name}`}
                id={`${id}-HEADER-ROW-${index}`}
                column={column}
                index={index}
                defaultColumnWidth={defaultColumnWidth}
                isMobile={isMobile}
                onChangeColumnSorting={onChangeColumnSorting}
                sorting={sort}
                size={size}
                containerWidth={containerWidth}
                highlightColumn={highlightColumn}
              />
            );
          }
          return null;
        })}
        {canDelete && editable && (
          <s.ActionColumn id={`${id}-HEADER-ROW-LAST`} hasCardColumnsMobile={showMobileCardColumn}>
            &nbsp;
          </s.ActionColumn>
        )}
      </s.TR>
    </thead>
  );

  return reorderColumns && !disabled ? renderDraggable() : render();
}
Header.propTypes = propTypes;

export default Header;
