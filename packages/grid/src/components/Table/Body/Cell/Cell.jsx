import React, { useRef, useEffect, useState, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { FieldTypeIds, Tag } from '@m-next/types';
import * as s from './Cell.styles';
import { STATUSES, getColumnWidth, getErrorMessage } from '../../../../utilities';
import ReadMode from './ReadMode';
import EditMode from './EditMode';
import { Column } from '../../../../ColumnPropType';
import { RowHeightContext } from '../Body';

const propTypes = {
  cellData: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string, PropTypes.instanceOf(Object)]),
  displayValue: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  index: PropTypes.number,
  overflowVisible: PropTypes.bool,
  rowIndex: PropTypes.number,
  status: PropTypes.number,
  primaryKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  editable: PropTypes.bool,
  editingRow: PropTypes.number,
  editingCell: PropTypes.number,
  outsideClicked: PropTypes.bool,
  setEditingCell: PropTypes.func,
  onSetEditingRow: PropTypes.func,
  totalRows: PropTypes.number,
  column: Column,
  scrollerRef: PropTypes.instanceOf(Object),
  disabled: PropTypes.bool,
  isMobile: PropTypes.bool,
  dragAndDrop: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  isLoading: PropTypes.bool,
  tagsList: PropTypes.arrayOf(Tag),
  tagsSuggestions: PropTypes.arrayOf(PropTypes.string),
  isDragging: PropTypes.bool,
  onShowImageEditor: PropTypes.func,
  onUploadImage: PropTypes.func,
  onDownloadImage: PropTypes.func,
  onDisableClickOutside: PropTypes.func,
  onErrorMessageForUser: PropTypes.func,
  enrichedData: PropTypes.instanceOf(Object),
  isFirstVisible: PropTypes.bool,
  isRowLocked: PropTypes.bool,
  draggable: PropTypes.bool,
  tooltipId: PropTypes.string,
  highlightColumn: PropTypes.string,
  onColumnHover: PropTypes.func,
  hasRowClick: PropTypes.bool,
  defaultColumnWidth: PropTypes.number,
  containerWidth: PropTypes.number,
  isCellDisabled: PropTypes.bool,
  showVerticalDividers: PropTypes.bool,
  onManageTags: PropTypes.func,
  currencyMeta: PropTypes.instanceOf(Object),
};

function Cell({
  cellData = null,
  displayValue = null,
  error = null,
  id = null,
  index = 0,
  overflowVisible = false,
  rowIndex = null,
  status = STATUSES.unchanged,
  primaryKey = null,
  onClick = null,
  editable,
  editingRow,
  editingCell,
  outsideClicked,
  setEditingCell,
  onSetEditingRow,
  totalRows,
  column,
  scrollerRef,
  disabled,
  isMobile,
  dragAndDrop,
  isLoading,
  displayPreferences,
  tagsList,
  tagsSuggestions,
  isDragging,
  onShowImageEditor,
  onUploadImage,
  onDownloadImage,
  onDisableClickOutside,
  onErrorMessageForUser,
  enrichedData,
  isFirstVisible,
  isRowLocked = false,
  draggable,
  tooltipId,
  highlightColumn,
  onColumnHover,
  hasRowClick,
  defaultColumnWidth,
  containerWidth,
  isCellDisabled = false,
  showVerticalDividers,
  onManageTags,
  currencyMeta = null,
}) {
  const getValue = (val) => (val === 0 ? 0 : val || '');
  const [isDraft, setIsDraft] = useState(false);
  const [value, setValue] = useState(getValue(cellData));

  const isBlankRow = status === STATUSES.blank;
  const errorMessage = getErrorMessage(error || '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEditing = useMemo(() => column.editable && editable && editingRow === rowIndex, [editingRow, rowIndex]);
  const isFocused = useMemo(
    () => editingRow === rowIndex && editingCell === index,
    [editingRow, rowIndex, editingCell, index],
  );

  // Check for text input fields, filtering out buttons/checkboxes.
  const isTextInputField = useMemo(
    () => !(column.fieldType === FieldTypeIds.Button || column.fieldType === FieldTypeIds.YesNo),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const inputEl = useRef(null);

  const handleLoseFocus = () => {
    if (column.onChange) {
      switch (column.fieldType) {
        case FieldTypeIds.Decimal:
        case FieldTypeIds.Integer:
        case FieldTypeIds.Money: {
          const parsedValue =
            value !== null && value !== ''
              ? parseFloat(value.toString().replaceAll(',', '').replaceAll('(', '').replaceAll(')', ''))
              : value;
          if (Number.isNaN(parsedValue)) {
            setValue(getValue(cellData));
            break;
          }
          const onChangeArg =
            column.displayOptions?.numberFormat === 1
              ? JSON.stringify({ data: parsedValue, ...currencyMeta })
              : parsedValue;
          column.onChange(column.name, onChangeArg, column, rowIndex, primaryKey);
          break;
        }
        default:
          column.onChange(column.name, value, column, rowIndex, primaryKey);
          break;
      }
    }
    setIsDraft(false);
  };

  useEffect(() => {
    if (!isEditing && isDraft) {
      handleLoseFocus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, isDraft]);

  // Effects
  useEffect(() => {
    const newValue = getValue(cellData);
    if (value !== newValue) {
      setValue(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellData]);

  // Set focus to element
  useEffect(() => {
    if (isEditing && isFocused) {
      if (inputEl.current) inputEl.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCell, editingRow]);

  // Clear focus from element
  useEffect(() => {
    if (inputEl.current && outsideClicked) inputEl.current.blur();
  }, [outsideClicked]);

  const updateCellData = (val) => {
    setValue(val);
    if (!isDraft && isTextInputField) {
      setIsDraft(true);
    }
  };

  const setRowAndCellToEditing = () => {
    setEditingCell(index);
    onSetEditingRow(rowIndex);
  };

  const navigateGrid = (direction) => {
    switch (direction) {
      case 'up':
        if (editingRow === 0) return;
        setEditingCell(index);
        onSetEditingRow(rowIndex - 1);
        handleLoseFocus();
        break;

      case 'down':
        if (editingRow === totalRows - 1) return;
        setEditingCell(index);
        onSetEditingRow(rowIndex + 1);
        handleLoseFocus();
        break;

      default:
        break;
    }
  };

  const handleKeyUp = (e) => {
    switch (e.which) {
      case 40:
        navigateGrid('down');
        break;

      case 38:
        navigateGrid('up');
        break;

      case 13:
        if (
          column.singleLine ||
          column.fieldType === FieldTypeIds.Decimal ||
          column.fieldType === FieldTypeIds.Integer ||
          column.fieldType === FieldTypeIds.Money
        ) {
          setEditingCell(null);
          onSetEditingRow(null);
          handleLoseFocus();
        } else {
          navigateGrid(null);
        }
        break;

      default:
        navigateGrid(null);
        break;
    }
  };

  const handleSetEditing = (e) => {
    if (!editable) {
      return;
    }

    if (column.fieldType === FieldTypeIds.Button) {
      return;
    }

    // Set editing triggered by Checkbox is done inside renderReadMode
    if (column.fieldType === FieldTypeIds.YesNo) {
      return;
    }

    if (editable && !column.editable && column.onColumnClick) {
      column.onColumnClick(e, column.name, value, column, rowIndex, primaryKey);
      return;
    }

    if (editable && editingRow !== rowIndex) {
      setRowAndCellToEditing();
    }

    if (editable && editingRow !== rowIndex) {
      setRowAndCellToEditing();
    }

    if (isEditing && editingCell !== index) {
      setEditingCell(index);
    }
  };

  const handleKeyDown = (e) => {
    // 13 space, 32 enter
    if (column.fieldType === FieldTypeIds.CardColumn && [13, 32].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      if (onClick) onClick();
    }
  };

  const handleClick = (e) => {
    if (!column.editable && column.onColumnClick && editingRow === null) {
      column.onColumnClick(e, column.name, value, column, rowIndex, primaryKey);
      return;
    }
    if (!editable && column.onColumnClick) {
      column.onColumnClick(e, column.name, value, column, rowIndex, primaryKey);
      return;
    }
    if (column.fieldType === FieldTypeIds.CardColumn && onClick) {
      onClick(e);
      return;
    }
    if (column.fieldType !== FieldTypeIds.Button && editingRow === null && onClick) {
      onClick(e);
    }
  };

  const hasClick = useMemo(() => {
    // handle column click events
    if (!column.editable && column.onColumnClick && editingRow === null) return true;
    if (!editable && column.onColumnClick) return true;
    // handle row click event
    if (column.fieldType === FieldTypeIds.CardColumn && onClick) return true;
    if (column.fieldType !== FieldTypeIds.Button && editingRow === null && onClick) return true;
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column, editable, editingRow]);

  const widthStyle = useMemo(
    () => (column.width !== 'dynamic' ? null : getColumnWidth(column, defaultColumnWidth, containerWidth)),
    [column, containerWidth, defaultColumnWidth],
  );

  // Consume context to get preserved heights during loading
  const { recentRowHeights, isLoading: contextIsLoading } = useContext(RowHeightContext);
  const preservedHeight =
    contextIsLoading && recentRowHeights.length > 0 ? recentRowHeights[rowIndex] || recentRowHeights[0] : null;

  const handleHover = () => {
    onColumnHover(column.name);
  };
  const handleLeaveHover = () => {
    onColumnHover(null);
  };

  const computedTabIndex =
    editable &&
    !isEditing &&
    column.editable !== false &&
    column.fieldType !== FieldTypeIds.Button &&
    column.fieldType !== FieldTypeIds.CardColumn
      ? 0
      : null;

  const computedHideOutline =
    column.fieldType === FieldTypeIds.YesNo ||
    column.fieldType === FieldTypeIds.Button ||
    isEditing ||
    column.editable === false ||
    error
      ? 'hideOutline'
      : '';

  if (column.hideWhenDragging && isDragging) return null;
  return (
    <s.TD
      onMouseEnter={!column.editable && column.onColumnClick ? handleHover : null}
      onMouseLeave={!column.editable && column.onColumnClick ? handleLeaveHover : null}
      fontWeight={column.formatStyle?.fontWeight}
      align={
        column.fieldType === FieldTypeIds.Picture ||
        column.fieldType === FieldTypeIds.YesNo ||
        column.fieldType === FieldTypeIds.Button
          ? 'center'
          : column.columnAlign
      }
      aria-colindex={index + 1}
      fixedWidth={column.displayAs === 'icon' || column.fixedWidth}
      // eslint-disable-next-line no-nested-ternary
      cellWidth={column.displayAs === 'icon' ? (isFirstVisible && draggable ? '32px' : '48px') : column.cellWidth}
      className={computedHideOutline}
      disabled={disabled || status === STATUSES.deleted}
      id={id}
      isCheckboxCell={column.fieldType === FieldTypeIds.YesNo}
      isTextCell={column.fieldType === FieldTypeIds.Text}
      isDDCell={column.fieldType === FieldTypeIds.DropDown}
      isTagList={column.name === 'TagList'}
      isMobile={isMobile}
      isCard={column.fieldType === FieldTypeIds.CardColumn}
      isEditing={isEditing}
      isIcon={column.displayAs === 'icon'}
      onFocus={(e) => {
        // Only handle direct focus on the TD (Tab navigation), not bubbled from children
        if (e.target === e.currentTarget) {
          handleSetEditing(e);
        }
      }}
      onClick={(e) => {
        handleSetEditing(e);
        if (hasClick) handleClick(e);
      }}
      onKeyDown={(e) => handleKeyDown(e)}
      overflowVisible={overflowVisible}
      tabIndex={computedTabIndex}
      visible={column.visible}
      isDragging={isDragging}
      isFirstVisible={isFirstVisible}
      tooltipId={tooltipId}
      hasColumnClick={(!column.editable && column.onColumnClick) || hasRowClick}
      highlightColumn={highlightColumn === column.name}
      showVerticalDividers={showVerticalDividers}
      style={preservedHeight ? { ...widthStyle, height: `${preservedHeight}px` } : widthStyle}
    >
      {isEditing && !isRowLocked && !isCellDisabled && (
        <EditMode
          column={column}
          error={error}
          handleLoseFocus={handleLoseFocus}
          id={id}
          inputElRef={inputEl}
          isFocused={isFocused}
          navigateGrid={navigateGrid}
          onKeyUp={handleKeyUp}
          primaryKey={primaryKey}
          rowIdx={rowIndex}
          value={value}
          updateCellData={updateCellData}
          editable={editable}
          onSetEditingRow={onSetEditingRow}
          scrollerRef={scrollerRef}
          setEditingCell={setEditingCell}
          displayPreferences={displayPreferences}
          onShowImageEditor={onShowImageEditor}
          onUploadImage={onUploadImage}
          onDownloadImage={onDownloadImage}
          onDisableClickOutside={onDisableClickOutside}
          onErrorMessageForUser={onErrorMessageForUser}
          enrichedData={enrichedData}
          tooltipId={tooltipId}
          tagsList={tagsList}
          tagsSuggestions={tagsSuggestions}
          onManageTags={onManageTags}
        />
      )}

      {(!isEditing || isRowLocked || isCellDisabled) && (
        <ReadMode
          blankRow={isBlankRow}
          column={column}
          error={error}
          id={id}
          primaryKey={primaryKey}
          rowIdx={rowIndex}
          setRowAndCellToEditing={setRowAndCellToEditing}
          value={value}
          displayValue={displayValue}
          updateCellData={editable ? updateCellData : null}
          displayPreferences={displayPreferences}
          disabled={disabled || isCellDisabled}
          dragAndDrop={dragAndDrop}
          editable={editable}
          editingRow={editingRow}
          isLoading={isLoading}
          isMobile={isMobile}
          onSetEditingRow={onSetEditingRow}
          setEditingCell={setEditingCell}
          tagsList={tagsList}
          onShowImageEditor={onShowImageEditor}
          onDownloadImage={onDownloadImage}
          enrichedData={enrichedData}
          tooltipId={tooltipId}
        />
      )}

      {!isBlankRow && error && (
        <s.Error id={`${id}-ERROR`}>
          <SvgIcon id={`${id}-ERROR-ICON`} color='#DA211E' name='info-sign' size={16} />
          {`   ${errorMessage}`}
        </s.Error>
      )}
    </s.TD>
  );
}

Cell.propTypes = propTypes;
export default Cell;
