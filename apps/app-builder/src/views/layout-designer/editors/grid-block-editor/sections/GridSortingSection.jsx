import React, { Suspense, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { fieldTypeIcons, FieldTypeIds, sortTypes } from '@m-next/types';
import Dropdown from '@m-next/dropdown';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Grid from '@m-next/grid';
import { GridColumnModel } from '../type';
import AddableAccordion from '../../../../../components/accordion/AddableAccordion';

const propTypes = {
  caption: PropTypes.string,
  canAdd: PropTypes.bool,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onReorder: PropTypes.func,
  sortColumns: PropTypes.arrayOf(
    PropTypes.shape({
      filterField: PropTypes.string,
      filterOrder: PropTypes.string,
      fieldType: PropTypes.string,
    }),
  ),
  columns: PropTypes.arrayOf(GridColumnModel),
};

const getSortingOptions = (columns, field) => {
  const match = columns.find((x) => x.field === field);
  if (!match)
    return [
      { label: 'A → Z ', value: sortTypes.Ascending },
      { label: 'Z → A', value: sortTypes.Descending },
    ];
  switch (match.fieldType) {
    case FieldTypeIds.Integer:
    case FieldTypeIds.Decimal:
    case FieldTypeIds.Id:
      return [
        { label: '1 → 9', value: sortTypes.Ascending },
        { label: '9 → 1', value: sortTypes.Descending },
      ];
    case FieldTypeIds.Money:
      return [
        { label: 'Low → High', value: sortTypes.Ascending },
        { label: 'High → Low', value: sortTypes.Descending },
      ];
    case FieldTypeIds.DateTime:
      return [
        { label: 'Old → New', value: sortTypes.Ascending },
        { label: 'New → Old', value: sortTypes.Descending },
      ];
    default:
      return [
        { label: 'A → Z ', value: sortTypes.Ascending },
        { label: 'Z → A', value: sortTypes.Descending },
      ];
  }
};

const getSortingValue = (columns, field, direction) => {
  const values = getSortingOptions(columns, field);
  return values[direction === 'asc' ? 0 : 1].label;
};

const GridSortingSection = ({ caption, canAdd, sortColumns = [], columns, onAdd, onChange, onDelete, onReorder }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const values = useMemo(
    () =>
      sortColumns.map((x) => {
        const mergedValue = {
          ...x,
          id: x.filterField,
          value: x.filterField,
          label: getSortingValue(columns, x.filterField, x.filterOrder),
        };
        mergedValue.edit = { label: mergedValue.label, value: mergedValue.value };
        const match = columns.find((col) => col.field === x.filterField);
        if (match) {
          mergedValue.label = match.header || match.field;
          mergedValue.fieldType = match.fieldType;
        }
        return mergedValue;
      }),
    [columns, sortColumns],
  );
  const columnOptions = useMemo(
    () =>
      columns
        .filter(
          (x) =>
            (x.fieldType === FieldTypeIds.Integer ||
              x.fieldType === FieldTypeIds.DateTime ||
              x.fieldType === FieldTypeIds.Decimal ||
              x.fieldType === FieldTypeIds.Id ||
              x.fieldType === FieldTypeIds.Money ||
              x.fieldType === FieldTypeIds.Text ||
              x.fieldType === FieldTypeIds.DropDown ||
              x.fieldType === FieldTypeIds.YesNo) &&
            x.name !== 'TagList',
        )
        .map((column) => ({
          ...column,
          value: column.field,
          label: column.header,
          icon: fieldTypeIcons[column.fieldType],
        })),
    [columns],
  );

  const mergedLines = useMemo(() => {
    let mergedValues = [];
    if (values?.length > 0) {
      if (columnOptions?.length > 0) {
        mergedValues = values
          .filter((item) => columnOptions.find((option) => option.value === item.value))
          .map((item) => {
            const selectedOption = columnOptions.find((option) => option.value === item.value);
            return {
              ...item,
              value: item.value,
              label: selectedOption.label,
              id: item.id,
            };
          });
      } else {
        mergedValues = values.map((item) => ({
          ...item,
          value: item.value,
          label: item.label || '',
          id: item.id,
        }));
      }
    }

    mergedValues = mergedValues.filter((item) => item.label.toLowerCase().includes(searchText.toLowerCase()));
    return mergedValues;
  }, [values, columnOptions, searchText]);

  const handleEditAction = (rowIdx, val) => {
    onChange(rowIdx, val.value === sortTypes.Ascending ? 'asc' : 'desc');
  };

  const handleAdd = (value) => {
    onAdd(value.field);
  };

  const handlePageChange = (value) => {
    setPageNumber(value);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPageNumber(0);
  };

  return (
    <AddableAccordion
      id='grid-sorting-section'
      caption={caption}
      tooltipId='editor-tooltip'
      tooltip='Add sorting'
      options={columnOptions}
      optionCaption='label'
      optionIcon='icon'
      optionKey='value'
      valueKey='filterField'
      canAdd={canAdd}
      onAdd={handleAdd}
      onDelete={onDelete}
      onReorder={onReorder}
      values={values.filterField}
      addLabel='Add'
      isEmpty={mergedLines.length === 0}
      emptyMessage='No sorting columns added'
      shiftLeft={16}
    >
      <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
        <Grid
          id='grid-sorting-grid'
          hideCaption={false}
          searchable={mergedLines.length > 10}
          showPagination={mergedLines.length > 10}
          showGoToPage={false}
          showPageSize={false}
          showReload={false}
          showHeader={false}
          addRowsEnabled={false}
          editable
          columns={[
            {
              name: 'label',
              primary: true,
              caption: '',
              visible: true,
              editable: false,
              singleLine: true,
              width: 'dynamic',
              fieldType: FieldTypeIds.Text,
            },
            {
              name: 'filterOrder',
              visible: false,
              editable: true,
              singleLine: true,
              fieldType: FieldTypeIds.Text,
              width: 'dynamic',
            },
            {
              name: 'edit',
              caption: '',
              visible: true,
              editable: true,
              singleLine: true,
              fieldType: FieldTypeIds.DropDown,
              accessorProp: 'label',
              cellWidth: '160px',
              width: 'dynamic',
              fixedWidth: true,
              renderEditAs: ({ value, rowIdx }) => (
                <Dropdown
                  id='sort-select'
                  options={getSortingOptions(columns, value?.value)}
                  value={value}
                  onChange={(val) => handleEditAction(rowIdx, val)}
                  isPortal
                  width='100%'
                  isV4Design
                />
              ),
            },
          ]}
          data={mergedLines}
          compact
          pageSize={10}
          totalRecords={mergedLines.length}
          onPageChange={handlePageChange}
          onGridSearch={handleSearch}
          pageNumber={pageNumber}
          isPageData
          canDelete={!!onDelete}
          onDelete={onDelete}
          onReorder={onReorder}
        />
      </Suspense>
    </AddableAccordion>
  );
};

GridSortingSection.propTypes = propTypes;
export default GridSortingSection;
