import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { FieldTypeIds, sortTypes } from '@m-next/types';
import { Draggable } from 'react-beautiful-dnd';
import { breakpointNames, colors } from '@m-next/styles';

import * as s from './HeaderColumn.styles';
import Column from '../../../ColumnPropType';
import { getColumnWidth } from '../../../utilities';

const propTypes = {
  column: Column,
  id: PropTypes.string.isRequired,
  index: PropTypes.number,
  onChangeColumnSorting: PropTypes.func,
  isMobile: PropTypes.bool,
  reorderColumns: PropTypes.bool,
  sorting: PropTypes.number,
  draggingOver: PropTypes.bool,
  isAColumnDragging: PropTypes.bool,
  hideLeftBorder: PropTypes.bool,
  size: PropTypes.string,
  defaultColumnWidth: PropTypes.number,
  containerWidth: PropTypes.number,
  highlightColumn: PropTypes.string,
};

function HeaderColumn({
  id,
  column,
  index,
  onChangeColumnSorting,
  isMobile,
  reorderColumns,
  sorting,
  draggingOver,
  isAColumnDragging,
  hideLeftBorder,
  size,
  defaultColumnWidth,
  containerWidth,
  highlightColumn,
}) {
  const [isDragDisabled, setIsDragDisabled] = useState(true);
  const [isDragVisible, setIsDragVisible] = useState(false);

  const widthStyle = useMemo(
    () => getColumnWidth(column, defaultColumnWidth, containerWidth),
    [column, containerWidth, defaultColumnWidth],
  );

  const sortable = useMemo(() => {
    if (!onChangeColumnSorting) return false;

    // Tags columns (fieldType Text with LinkedFieldCaption="TagList") are sortable
    if (
      column.fieldType === FieldTypeIds.Integer ||
      column.fieldType === FieldTypeIds.DateTime ||
      column.fieldType === FieldTypeIds.Decimal ||
      column.fieldType === FieldTypeIds.Money ||
      column.fieldType === FieldTypeIds.Text ||
      column.fieldType === FieldTypeIds.DropDown ||
      column.fieldType === FieldTypeIds.MultiSelectDropDown ||
      column.fieldType === FieldTypeIds.YesNo ||
      column.fieldType === FieldTypeIds.CardColumn
    )
      return true;

    return false;
  }, [column.fieldType, onChangeColumnSorting]);

  const ariaSort = useMemo(() => {
    if (!sorting) return 'none';
    if (sorting === 2) return 'descending';
    return 'ascending';
  }, [sorting]);

  const alignment = useMemo(() => {
    if (
      column.fieldType === FieldTypeIds.Picture ||
      column.fieldType === FieldTypeIds.YesNo ||
      column.fieldType === FieldTypeIds.Button
    )
      return 'center';
    return column.columnAlign;
  }, [column.columnAlign, column.fieldType]);

  const alignmentLayout = useMemo(() => {
    if (column.fieldType === FieldTypeIds.Picture || column.fieldType === FieldTypeIds.YesNo) return 'center';
    if (column.columnAlign === 'right') return 'flex-end';
    if (column.columnAlign === 'center') return 'center';
    return 'flex-start';
  }, [column.columnAlign, column.fieldType]);

  const handleOnClick = (e) => {
    if (onChangeColumnSorting) {
      if (!sorting) {
        onChangeColumnSorting(column.name, 1, 'Column Click', e);
      } else {
        onChangeColumnSorting(column.name, sorting === 2 ? 1 : 2, 'Column Click', e);
      }
    }
  };
  const getItemStyle = (isDragging, draggableStyle) => {
    if (!isDragging)
      return {
        ...widthStyle,
        border: isAColumnDragging && draggingOver ? `2px dashed ${colors.blue}` : null,
        backgroundColor: isAColumnDragging && draggingOver ? colors['blue-lighter'] : null,
      };

    return {
      ...draggableStyle,
      width: 100,

      alignItems: 'center',
      textAlign: 'middle',
      backgroundColor: colors['grey-light'],
      opacity: 0.5,
      cursor: 'drag',
    };
  };

  const renderDraggableHeader = () => (
    <Draggable key={id} draggableId={id} index={index} type='COLUMN' isDragDisabled={isDragDisabled}>
      {(providedInner, snapshotInner) => (
        <s.TH
          alt={column.name}
          aria-sort={ariaSort}
          aria-colindex={index + 1}
          id={id}
          isMobile={isMobile || size === breakpointNames.xs}
          onClick={sortable ? handleOnClick : null}
          visible
          hasSorting={sortable}
          ref={providedInner.innerRef}
          {...providedInner.draggableProps}
          {...providedInner.dragHandleProps}
          style={getItemStyle(snapshotInner.isDragging, providedInner.draggableProps.style)}
          onMouseEnter={() => setIsDragVisible(!isAColumnDragging)}
          onMouseLeave={() => setIsDragVisible(false)}
          isDragging={snapshotInner.isDragging}
          hideLeftBorder={hideLeftBorder}
          isDragVisible={isDragVisible}
          title={column.caption ?? column.name}
          isAColumnDragging={isAColumnDragging}
          highlightColumn={highlightColumn === column.name}
        >
          <s.HeaderContent hasSorting={sortable} isDragVisible={isDragVisible}>
            <div
              id={`${id}-DRAG`}
              draggable
              onMouseEnter={() => (snapshotInner.draggingOver ? null : setIsDragDisabled(false))}
              onMouseLeave={() => setIsDragDisabled(true)}
              style={{ cursor: 'grab', display: isDragVisible ? 'block' : 'none' }}
            >
              <SvgIcon
                id={`data-model-drag-${id}`}
                name='drag-V4'
                size={12}
                style={{ cursor: 'grab', marginRight: 2 }}
              />
            </div>
            <s.HeaderContentInternal
              style={{
                justifyContent: alignmentLayout,
                //       ...widthStyle,
              }}
            >
              {(column.caption || column.name) && (
                <s.HeaderContentLabel style={{ marginRight: sorting || !sortable ? 0 : 16, textAlign: alignment }}>
                  {column.showHeader === false ? '' : (column.caption ?? column.name)}
                </s.HeaderContentLabel>
              )}
              {sorting === sortTypes.Ascending && <SvgIcon size={16} name='arrow-up-V4' />}
              {sorting === sortTypes.Descending && <SvgIcon size={16} name='arrow-down-V4' />}
              {!sorting && <SvgIcon size={16} name='' />}
            </s.HeaderContentInternal>
          </s.HeaderContent>
          {providedInner.placeholder}
        </s.TH>
      )}
    </Draggable>
  );

  const renderHeader = () => (
    <s.TH
      alt={column.name}
      aria-sort={ariaSort}
      aria-colindex={index + 1}
      id={id}
      isMobile={isMobile || size === breakpointNames.xs}
      onClick={sortable ? handleOnClick : null}
      visible
      hasSorting={sortable}
      title={column.caption ?? column.name}
      style={widthStyle}
      highlightColumn={highlightColumn === column.name}
    >
      <s.HeaderContent
        style={{
          justifyContent: alignmentLayout,
          //      ...widthStyle,
        }}
        hasSorting={sortable}
      >
        {(column.caption || column.name) && (
          <s.HeaderContentLabel style={{ marginRight: sorting || !sortable ? 0 : 16, textAlign: alignment }}>
            {column.showHeader === false ? '' : (column.caption ?? column.name)}
          </s.HeaderContentLabel>
        )}
        {sorting === sortTypes.Ascending && <SvgIcon size={16} name='arrow-up-V4' />}
        {sorting === sortTypes.Descending && <SvgIcon size={16} name='arrow-down-V4' />}
      </s.HeaderContent>
    </s.TH>
  );

  return reorderColumns && !isMobile && size !== breakpointNames.xs ? renderDraggableHeader() : renderHeader();
}

HeaderColumn.propTypes = propTypes;

export default HeaderColumn;
