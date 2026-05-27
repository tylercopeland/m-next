import { useCallback } from 'react';
import { FieldTypeIds, FieldTypeNames } from '@m-next/types';
import { formatter } from '@m-next/utilities';

export const reorderData = (data, onDataChange) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCallback(
    (dragIndex, hoverIndex) => {
      const newData = [...data];

      newData[dragIndex] = data[hoverIndex];
      newData[hoverIndex] = data[dragIndex];

      onDataChange(newData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

export const reorderGroupRow = (data, onDataChange) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCallback(
    (dragIndex, hoverIndex, groupIndex, item) => {
      const groupDrop = [...data[groupIndex].data];
      const groupDrag = [...data[item.groupIdx].data];
      const dragItem = { ...groupDrag[dragIndex] };

      groupDrop.splice(hoverIndex, 0, dragItem);
      groupDrag.splice(dragIndex, 1);

      onDataChange(groupDrop, groupIndex, groupDrag, item.groupIdx);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

export const getColumnWidth = (column, defaultWidth = 0, maxWidth = null) => {
  const { width, fieldType, widthFixed, widthAutoSize } = column;

  if (fieldType === FieldTypeIds.CardColumn && width !== 'dynamic') {
    return {};
  }

  let colWidth = 0;
  if (width === 'sm' || width === '' || width === null || width === undefined) {
    if (maxWidth) {
      colWidth = (maxWidth * (defaultWidth * 1)) / 100;
    } else {
      colWidth = `${defaultWidth * 1}%`;
    }
    if (fieldType === FieldTypeIds.DateTime && column.name !== 'TagList') {
      return { minWidth: colWidth };
    }
    return { width: colWidth };
  }

  if (width === 'md') {
    if (maxWidth) {
      colWidth = maxWidth * ((defaultWidth * 2) / 100);
    } else {
      colWidth = `${defaultWidth * 2}%`;
    }
    if (fieldType === FieldTypeIds.DateTime && column.name !== 'TagList') {
      return { minWidth: colWidth };
    }
    return { width: colWidth };
  }

  if (width === 'lg') {
    if (maxWidth) {
      colWidth = maxWidth * ((defaultWidth * 4) / 100);
    } else {
      colWidth = `${defaultWidth * 4}%`;
    }
    if (fieldType === FieldTypeIds.DateTime && column.name !== 'TagList') {
      return { minWidth: colWidth };
    }
    return { width: colWidth };
  }

  if (width === 'fixed') {
    return {
      minWidth: `${widthFixed}px`,
      width: `${widthFixed}px`,
    };
  }

  if (width === 'dynamic') {
    if (column.name === 'TagList')
      return {
        minWidth: 141,
      };
    if (fieldType === FieldTypeIds.DateTime) {
      switch (column.format?.dateType) {
        case 'Short Date':
        case 'Long Date':
        case 'Day':
        case 'Day of Week':
        case 'Month':
        case 'Month and Year':
        case 'Year':
        case 'Time':
        case 'Hour':
          return { width: 64 };
        default:
          return { width: 128 };
      }
    }

    if (fieldType === FieldTypeIds.Money || fieldType === FieldTypeIds.Decimal || fieldType === FieldTypeIds.Integer) {
      return { width: 96 };
    }

    if (fieldType === FieldTypeIds.Picture || fieldType === FieldTypeIds.YesNo) {
      return { width: 40 };
    }

    if (fieldType === FieldTypeIds.DropDown) {
      return { width: 120 };
    }

    if (fieldType === FieldTypeIds.Button) {
      return { width: 120 };
    }

    switch (widthAutoSize) {
      case 'sm':
        return {
          width: 141,
          minWidth: 141,
        };

      case 'md':
        return {
          width: 282,
          minWidth: 282,
        };
      case 'lg':
        return {
          width: 360,
          minWidth: 360,
        };
      default:
        return { width };
    }
  }
  return { width };
};

export const STATUSES = {
  unchanged: 0,
  edited: 1,
  deleted: 2,
  new: 3,
  blank: 4,
  locked: 5,
};

export const ColumnTypes = {
  Data: 0,
  Link: 1,
  Expression: 2,
  Button: 3,
  CardColumn: 4,
  Complex: 5,
  Formula: 6,
};

export const GridEventNames = {
  GridRefresh: 0,
  SortChanged: 1,
  PageChanged: 2,
  PageSizeChanged: 3,
  SettingChanged: 4,
  ActiveRowChanged: 5,
  FilterChanged: 6,
  ParentChanged: 7,
  GridLinkClicked: 8,
  RowChecked: 9,
  SearchClicked: 10,
  AdvancedSearch: 11,
  VisibleColumnsChanged: 12,
};

export const formatCellValue = (column, value, editable, displayPreferences) => {
  let options = {
    decimalPlace: 2,
    useThousandsSeparator: true,
  };
  const formatSource = column.formatType || column.format || {};
  let type = null;
  let returnValue = value;
  switch (column.fieldType) {
    case FieldTypeIds.DateTime: {
      let format = 'Short Date and Time';
      if (column?.formatType?.type) format = column?.formatType.type;
      if (column?.format?.dateType) format = column?.format.dateType; // Card column date field

      if (column.formatType) {
        options = {
          decimalPlace: column.formatType.rounding,
          useThousandsSeparator: column.formatType.separator,
        };
      } else if (column.format) {
        options = {
          decimalPlace: column.format.rounding,
          useThousandsSeparator: column.format.separator,
        };
      }
      options.dateFormat = format;

      returnValue = formatter.formatValue(FieldTypeNames.DateTime, value, options, displayPreferences);
      break;
    }
    case FieldTypeIds.Decimal:
    case FieldTypeIds.Integer:
    case FieldTypeIds.Money:
    default:
      options = {
        decimalPlace: formatSource.rounding || 2,
        useThousandsSeparator: formatSource.separator || 'Yes',
      };
      type = formatSource.type;

      switch (column.fieldType) {
        case FieldTypeIds.Decimal:
          type = FieldTypeNames.Decimal;
          break;
        case FieldTypeIds.Integer:
          type = FieldTypeNames.Integer;
          options.decimalPlace = 0;
          break;
        case FieldTypeIds.Money:
          type = FieldTypeNames.Money;
          break;
        case FieldTypeIds.DateTime:
          type = FieldTypeNames.DateTime;
          break;
        default:
          break;
      }

      returnValue = formatter.formatValue(type, value, options, displayPreferences);

      break;
  }
  return returnValue;
};

export const formatMoneyValue = (value, currencyCode, homeCurrencyCode, opts) =>
  formatter.formatMoneyValue(value, currencyCode, homeCurrencyCode, opts);

export const getErrorMessage = (error) => (error.toLowerCase() === 'field is required.' ? 'Required' : error);
