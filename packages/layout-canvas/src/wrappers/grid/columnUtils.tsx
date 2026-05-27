import React from 'react';
import { toCamelCase } from '@m-next/utilities';
import { FieldTypeIds } from '@m-next/runtime-interface';
import type { GridColumn as MOneGridColumn } from '@m-next/grid';
import GridDropdownCell from './GridDropdownCell';
import type {
  ControlColumn,
  GridControlDef,
  RuntimeContext,
  ColumnChangeHandler,
  BuildColumnListParams,
  DropdownValue,
} from './types';

/**
 * Props passed to the renderEditAs function
 */
interface RenderEditAsProps {
  id: string;
  column: MOneGridColumn;
  value: DropdownValue | string | number | null;
  error: string | null;
  inputElRef: React.RefObject<HTMLInputElement>;
  rowIdx: number;
  primaryKey: string | number;
  isFocused: boolean;
  scrollerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Finds a column definition from the control's columns array by field name.
 * @param field - The field name to search for
 * @param control - The control object containing columns array
 * @returns The column definition or null if not found
 */
export const getColumn = (field: string, control: GridControlDef | null | undefined): ControlColumn | null => {
  if (!control || !control.columns || !Array.isArray(control.columns)) {
    return null;
  }
  return control.columns.filter((x) => x.field === field)[0] ?? null;
};

const renderDropdownEditAs = (
  props: RenderEditAsProps,
  col: ControlColumn,
  columnChangeHandler: ColumnChangeHandler,
  runtimeContext: RuntimeContext | null | undefined,
): React.ReactElement => {
  // Return a component that will be rendered by EditMode.jsx
  return (
    <GridDropdownCell
      {...props}
      col={col}
      columnChangeHandler={columnChangeHandler}
      loadDropdownDataFn={runtimeContext?.loadDropdownData}
      getDropdownDataFn={runtimeContext?.getDropdownData}
    />
  );
};

/**
 * Builds an array of column configurations for the Grid component.
 * Transforms backend control/view column definitions into the format expected by the Grid.
 *
 * @param params - The parameters object
 * @param params.control - The control object containing column definitions
 * @param params.currentView - The current view containing column visibility/order
 * @param params.isRuntimeMode - Whether we're in runtime mode (vs designer mode)
 * @param params.handleColumnClickEvent - Handler for column click events
 * @param params.handleColumnChangeEvent - Handler for column change events
 * @param params.runtimeContext - The runtime context
 * @returns Array of column configuration objects for the Grid
 */
export const buildColumnList = ({
  control,
  currentView,
  isRuntimeMode,
  handleColumnClickEvent,
  handleColumnChangeEvent,
  runtimeContext,
}: BuildColumnListParams): MOneGridColumn[] => {
  const colList: MOneGridColumn[] = [];
  if (!control) return colList;

  if (currentView) {
    currentView.columns.forEach((view) => {
      const col = getColumn(view.field, control);
      if (col) {
        const isReadOnly = control.isReadOnly;
        const isColumnReadOnly = col.readOnly === true;
        let isVisible = view.visible;
        if (control.activeColumns && control.activeColumns.length > 0) {
          isVisible = control.activeColumns.includes(col.field);
        }
        const column: MOneGridColumn = {
          name: col.field,
          accessorProp:
            col.fieldType === FieldTypeIds.DropDown || col.fieldType === FieldTypeIds.MultiSelectDropDown
              ? 'text'
              : undefined,
          buttonLabel: col.fieldType === FieldTypeIds.Button ? col.control?.caption : undefined,
          cardColumnFields: col.cardColumnFields,
          columnAlign: col.format.alignment,
          columnType: col.columnType,
          // Column is editable only if both grid and column are not read-only
          // In designer mode, columns should not be editable (matches gridDesignerWrapper behavior)
          editable: !isRuntimeMode
            ? false
            : !isColumnReadOnly && !isReadOnly && col.fieldType !== FieldTypeIds.MultiSelectDropDown,
          fieldType: col.fieldType,
          formatType: {
            type: col.format.type,
            separator: col.format.separator,
            rounding: col.format.rounding,
            dateType: col.format.dateType,
          },
          formatStyle: {
            textColor: col.format.textColor,
            fontSize: col.format.fontSize,
            backgroundColor: col.format.backgroundColor,
            disabled: col.format.disabled,
            fontWeight: col.format.fontWeight,
          },
          hasColumnTotal: col.hasColumnTotal,
          caption: col.header,
          primary: col.field === 'RecordID',
          showOnMobile: col.showOnMobile,
          visible: isVisible,
          width: col.format.width,
          widthFixed: col.format.widthFixed,
          widthAutoSize: col.format.widthAutoSize,
          displayAs: col.displayAs,
          displayOptions: col.displayOptions,
          showHeader: col.showHeader,
          control: toCamelCase(col.control),
          onColumnClick: col.onClickEvent || !isRuntimeMode ? (handleColumnClickEvent ?? undefined) : undefined,
          // Cast to any for compatibility with grid's onClick/onChange signatures
          onClick: handleColumnChangeEvent as MOneGridColumn['onClick'],
          onChange: handleColumnChangeEvent as MOneGridColumn['onChange'],
          supportingColumns: col.supportingColumns,
          renderEditAs:
            col.fieldType === FieldTypeIds.DropDown && isRuntimeMode
              ? (props: RenderEditAsProps) => renderDropdownEditAs(props, col, handleColumnChangeEvent, runtimeContext)
              : undefined,
        };
        colList.push(column);
      }
    });
  }

  return colList;
};
