import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@m-next/checkbox';
import { Tag } from '@m-next/types';
import SvgIcon from '@m-next/svg-icon';
import { IconMenuList, MenuItem } from '@m-next/menu';
import * as s from './Row.styles';
import { STATUSES } from '../../../../utilities';
import Cell from '../Cell';
import { Column } from '../../../../ColumnPropType';

const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  index: PropTypes.number,
  onMultiSelect: PropTypes.func,
  overflowVisible: PropTypes.bool,
  data: PropTypes.instanceOf(Object),
  errorData: PropTypes.instanceOf(Object),
  status: PropTypes.number,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  style: PropTypes.instanceOf(Object),

  disabled: PropTypes.bool,
  columns: PropTypes.arrayOf(Column),
  canDelete: PropTypes.bool,
  editingRow: PropTypes.number,
  selectable: PropTypes.bool,
  onSetRowStatus: PropTypes.func,
  primaryKeyName: PropTypes.string,
  isMobile: PropTypes.bool,
  activeElement: PropTypes.instanceOf(Object),
  confirmDeletion: PropTypes.bool,
  onDeleteConfirmation: PropTypes.func,

  onSetEditingRow: PropTypes.func,
  setEditingCell: PropTypes.func,
  handleDeleteRow: PropTypes.func,
  editable: PropTypes.bool,
  onKeyboardNavigation: PropTypes.func,
  totalRows: PropTypes.number,

  onRowClick: PropTypes.func,
  dragAndDrop: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  defaultColumnWidth: PropTypes.number,
  editingCell: PropTypes.number,
  isLoading: PropTypes.bool,
  outsideClicked: PropTypes.bool,
  scrollerRef: PropTypes.instanceOf(Object),
  tagsList: PropTypes.arrayOf(Tag),
  tagsSuggestions: PropTypes.arrayOf(PropTypes.string),
  onManageTags: PropTypes.func,
  reorderColumns: PropTypes.bool,
  columnSorting: PropTypes.bool,
  onShowImageEditor: PropTypes.func,
  onUploadImage: PropTypes.func,
  onDownloadImage: PropTypes.func,
  onDisableClickOutside: PropTypes.func,
  onErrorMessageForUser: PropTypes.func,
  showMobileCardColumn: PropTypes.bool,
  enrichedData: PropTypes.instanceOf(Object),
  menuColumn: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      visible: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  ),
  tooltipId: PropTypes.string,
  highlightColumn: PropTypes.string,
  onColumnHover: PropTypes.func,
  variant: PropTypes.string,
  showVerticalDividers: PropTypes.bool,
};

function Row({
  id,
  index = null,
  data = {},
  errorData = null,
  status = null,
  isSelected = false,
  onSelect = null,
  onMultiSelect = null,
  overflowVisible = false,
  style,
  disabled,
  columns,
  canDelete,
  editingRow,
  selectable,
  onSetRowStatus,
  primaryKeyName,
  isMobile,
  activeElement,
  confirmDeletion,
  onDeleteConfirmation,
  onSetEditingRow,
  setEditingCell,
  handleDeleteRow,
  editable,
  onKeyboardNavigation,
  totalRows,
  onRowClick = null,
  dragAndDrop,
  displayPreferences,
  defaultColumnWidth,
  editingCell,
  isLoading,
  outsideClicked,
  scrollerRef,
  tagsList,
  tagsSuggestions,
  onManageTags,
  reorderColumns,
  columnSorting,
  onShowImageEditor,
  onUploadImage,
  onDownloadImage,
  onDisableClickOutside,
  onErrorMessageForUser,
  showMobileCardColumn,
  enrichedData,
  menuColumn,
  tooltipId,
  highlightColumn,
  onColumnHover,
  variant = 'default',
  showVerticalDividers,
}) {
  // State
  const [primaryKey, setPrimaryKey] = useState(null);
  const [rowData, setRowData] = useState(data);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isEditing = useMemo(() => editingRow === index, [editingRow, index]);
  const isReadOnly = useMemo(() => !editable, [editable]);
  const isRowLocked = useMemo(() => status === STATUSES.locked, [status]);

  // Refs
  const deleteButtonRef = useRef();
  const rowStyle = style || { borderWidth: '0 1px 1px 1px' };

  useEffect(() => {
    if (editingRow === index) {
      if (status === STATUSES.blank) {
        onSetRowStatus(index, STATUSES.new);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingRow]);

  useEffect(() => {
    if (data) {
      setPrimaryKey(data[primaryKeyName]);
      setRowData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Set Delete button to focus on arrow navigation
  useEffect(() => {
    if (deleteButtonRef.current && activeElement.columnType === 'deleteIcon' && index === activeElement.rowIndex) {
      deleteButtonRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeElement.columnType, activeElement.rowIndex]);

  const deleteRow = () => {
    onSetEditingRow(null);
    setEditingCell(null);
    if (handleDeleteRow) {
      handleDeleteRow(index, primaryKey);
    }
  };

  const handleDelete = () => {
    if (disabled) return;
    if (confirmDeletion && onDeleteConfirmation) {
      onDeleteConfirmation(() => deleteRow(), null);
    } else deleteRow();
  };

  const changeColorOnHover = () => {
    let changeColOnHover = false;

    if (!editable && onRowClick) {
      changeColOnHover = true;
    }

    if (editable) {
      // Allow color change if row has 'editable + visible' columns
      const hasEdColumns = columns.some((col) => col.visible && col.editable);

      // Allow color change if row includes card columns
      const isCardColumns = columns.some((col) => col.name.includes('CardColumn'));
      if (hasEdColumns || isCardColumns) changeColOnHover = true;
    }

    return changeColOnHover;
  };

  const handleOnSelect = (isChecked) => {
    if (onSelect) {
      onSelect(primaryKey, index, isChecked);
    }
  };

  const handleKeyboardNavigation = (e, columnType) => {
    const acceptedCodes = [35, 36, 38, 40];
    const key = e.keyCode;
    if (acceptedCodes.indexOf(key) > -1) {
      e.preventDefault();

      // Up or down
      if (key === 38 || key === 40) onKeyboardNavigation(key, index, columnType);

      // Home
      if (key === 36) onKeyboardNavigation(key, 0, columnType);

      // End
      if (key === 35) onKeyboardNavigation(key, totalRows - 1, columnType);
    }
  };

  const handleMultiSelect = (e) => {
    handleKeyboardNavigation(e, 'checkbox');

    if (onMultiSelect) {
      onMultiSelect(e, index);
    }
  };

  const handleKeyDown = (e, rowContent, indx) => {
    const tr = document.getElementById(id);
    if (!disabled && document.activeElement === tr) {
      switch (e.keyCode) {
        case 13: // enter
        case 32: // space
          if (onRowClick && !editable) onRowClick(rowContent, indx, null, e, primaryKey);
          break;

        default:
          break;
      }
    }
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMenuClick = (clickEvent) => {
    setIsMenuOpen(false);
    clickEvent(index, primaryKey);
  };

  return (
    <s.TR
      tabIndex={isReadOnly ? 0 : null}
      aria-rowindex={index + 1}
      disabled={disabled || status === STATUSES.deleted}
      id={id}
      editing={isEditing}
      isReadOnly={isReadOnly}
      selected={isSelected}
      deleted={status === STATUSES.deleted}
      changeColorOnHover={changeColorOnHover()}
      hasRowClick={onRowClick && !editable}
      onKeyDown={isReadOnly ? (e) => handleKeyDown(e, rowData, index) : null}
      css={rowStyle}
    >
      {selectable && (
        <s.SelectCell id={`${id}-SELECT`} className='hideOutline'>
          {(primaryKey || status !== STATUSES.blank) && status !== STATUSES.deleted && (
            <s.ItemContainer>
              <Checkbox
                autoFocus={activeElement.columnType === 'checkbox' && index === activeElement.rowIndex}
                id={`${id}-SELECT-CHECKBOX`}
                disabled={disabled || status === STATUSES.deleted}
                checked={isSelected}
                onChange={handleOnSelect}
                onKeyDown={handleMultiSelect}
                align='center'
                narrow
              />
            </s.ItemContainer>
          )}
        </s.SelectCell>
      )}
      {columns.map((col, cellIdx) => {
        // On mobile, only render columns marked as visibleOnMobile
        if (showMobileCardColumn && !col.visibleOnMobile) return null;
        // For modern variant, don't render hidden columns at all (like the header does)
        // This prevents :first-of-type CSS selectors from targeting the wrong element
        if (!showMobileCardColumn && variant === 'modern' && !col.visible) return null;

        // On mobile, use visibleOnMobile for cell visibility instead of desktop visible
        const effectiveColumn = showMobileCardColumn ? { ...col, visible: col.visibleOnMobile } : col;

        const columnKey = `${cellIdx}-${col.name}`;
        return (
          <Cell
            key={columnKey}
            id={`${id}-${cellIdx}`}
            index={cellIdx}
            rowIndex={index}
            cellData={rowData[col.name]}
            displayValue={rowData[`${col.name}_displayValue`]}
            currencyMeta={rowData[`${col.name}_currencyMeta`]}
            status={status}
            error={errorData ? errorData[col.name] : null}
            primaryKey={primaryKey}
            overflowVisible={overflowVisible}
            column={effectiveColumn}
            hasRowClick={onRowClick && !editable}
            onClick={(e) => {
              if (onRowClick && (!editable || col.columnType === 4)) {
                onRowClick(rowData, index, col.fieldType, e, primaryKey);
              }
            }}
            displayPreferences={displayPreferences}
            defaultColumnWidth={defaultColumnWidth}
            disabled={disabled}
            dragAndDrop={dragAndDrop}
            editable={editable}
            editingCell={editingCell}
            editingRow={editingRow}
            isLoading={isLoading}
            isMobile={isMobile}
            onSetEditingRow={onSetEditingRow}
            outsideClicked={outsideClicked}
            scrollerRef={scrollerRef}
            setEditingCell={setEditingCell}
            totalRows={totalRows}
            tagsList={tagsList}
            tagsSuggestions={tagsSuggestions}
            onManageTags={onManageTags}
            reorderColumns={reorderColumns}
            columnSorting={columnSorting}
            onShowImageEditor={onShowImageEditor}
            onUploadImage={onUploadImage}
            onDownloadImage={onDownloadImage}
            onDisableClickOutside={onDisableClickOutside}
            onErrorMessageForUser={onErrorMessageForUser}
            enrichedData={enrichedData}
            isRowLocked={isRowLocked}
            tooltipId={tooltipId}
            highlightColumn={highlightColumn}
            onColumnHover={onColumnHover}
            isCellDisabled={col.isDisabled ? col.isDisabled(rowData) : false}
            showVerticalDividers={showVerticalDividers}
          />
        );
      })}
      {menuColumn?.length > 0 && (
        <s.ActionCell id={`${id}-MENU`} className='hideOutline'>
          <IconMenuList
            id={`${id}-Grid-MENU`}
            inline
            relativeToParent
            icon='navigation-show-more'
            size={16}
            horizontalAlign='left'
            width={180}
            style={{ alignItems: 'flex-start' }}
            marginHorizontal={100}
            marginVertical={56 + index * 40}
            open={isMenuOpen}
            onToggle={handleToggleMenu}
            onClose={handleCloseMenu}
          >
            {menuColumn
              .filter((x) => x.visible)
              .map((item) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  style={{ textAlign: 'left' }}
                  onClick={
                    item.onClick
                      ? () => {
                          handleMenuClick(item.onClick);
                        }
                      : null
                  }
                >
                  {item.label}
                </MenuItem>
              ))}
          </IconMenuList>
        </s.ActionCell>
      )}
      {canDelete && editable && (
        <s.ActionCell id={`${id}-LAST`} className='hideOutline'>
          <s.ItemContainer onKeyDown={(e) => handleKeyboardNavigation(e, 'deleteIcon')}>
            <s.Button
              alt='Delete'
              disabled={disabled || status === STATUSES.deleted || isRowLocked}
              id={`${id}-BUTTON-DELETE`}
              onClick={handleDelete}
              ref={deleteButtonRef}
              title='Delete'
              type='button'
            >
              <SvgIcon name='trash-V4' size={16} />
            </s.Button>
          </s.ItemContainer>
        </s.ActionCell>
      )}
    </s.TR>
  );
}

Row.propTypes = propTypes;

export default Row;
