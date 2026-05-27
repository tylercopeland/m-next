import React, { Suspense, useMemo, useRef } from 'react';

import PropTypes from 'prop-types';
import { ColumnTypes, STATUSES } from '@m-next/grid';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { Field, fieldTypeIdLookup, FieldTypeIds } from '@m-next/types';
import { formatter, Guid } from '@m-next/utilities';
import { ValidationRuleTypes } from '@m-next/runtime-interface';
import { GridColumnModel } from '../type';
import { createGridColumn } from '../../../control-classes';
import AddableAccordion from '../../../../../components/accordion/AddableAccordion';

const Grid = React.lazy(() => import('@m-next/grid'));

const propTypes = {
  columns: PropTypes.arrayOf(GridColumnModel),
  onChange: PropTypes.func,
  onEditColumn: PropTypes.func,
  loading: PropTypes.bool,
  fieldList: PropTypes.arrayOf(Field),
  control: PropTypes.instanceOf(Object),
};

const GridColumnsSection = ({ control, columns, onChange, onEditColumn, loading, fieldList }) => {
  const addButtonRef = useRef();

  const columnStatus = useMemo(
    () => columns.map((column) => (column.canDelete ? STATUSES.unchanged : STATUSES.locked)),
    [columns],
  );

  const filteredFieldList = useMemo(
    () => (fieldList ? fieldList.filter((item) => !item.name.includes('_RecordID')) : []),
    [fieldList],
  );
  const projection = useMemo(
    () => ({
      fields: columns
        ?.filter((item) => item.columnType === ColumnTypes.Data || item.columnType === ColumnTypes.Link)
        .map((item) => ({ name: item.field })),
    }),
    [columns],
  );

  const fieldListOptions = useMemo(
    () =>
      formatter
        .formatFieldList(filteredFieldList, control.viewFriendlyName, projection, {}, {}, null, false, false, true)
        .flatMap((section) => section.options),
    [filteredFieldList, control.viewFriendlyName, projection],
  );

  const columnOptions = useMemo(
    () => [
      {
        value: ColumnTypes.Button,
        icon: 'button',
        label: 'Button',
      },
      {
        value: ColumnTypes.CardColumn,
        icon: 'screen-V4',
        label: 'Card',
      },
      {
        value: ColumnTypes.Formula,
        icon: 'code',
        label: 'Formula',
      },
      ...fieldListOptions,
    ],
    [fieldListOptions],
  );

  const handleEditColumn = (columnName, val, column, rowIdx, primaryKey) => {
    onEditColumn(primaryKey);
  };

  const generateUniqueColumnName = (baseName, existingColumns) => {
    let newName = baseName;
    let counter = 2;
    while (existingColumns.some((column) => column.field === newName)) {
      newName = `${baseName} ${counter}`;
      counter += 1;
    }
    return newName;
  };

  const handleAddColumn = (selectedItem) => {
    const { value } = selectedItem;

    let newColumn = null;
    if (value === ColumnTypes.Button || value === ColumnTypes.CardColumn || value === ColumnTypes.Formula) {
      let fieldType = FieldTypeIds.Button;
      let columnName = 'Button';
      let showOnMobile = false;
      if (value === ColumnTypes.CardColumn) {
        fieldType = FieldTypeIds.CardColumn;
        columnName = 'Card';
      } else if (value === ColumnTypes.Formula) {
        fieldType = FieldTypeIds.Formula;
        columnName = 'Formula';
      }

      columnName = generateUniqueColumnName(columnName, columns);

      newColumn = createGridColumn({
        controlId: Guid.create(),
        field: columnName,
        header: columnName,
        isLocked: false,
        canDelete: true,
        readOnly: false,
        columnType: value,
        fieldType,
        showOnMobile,
      });
    } else {
      const field = fieldList.find((item) => item.name === value);
      newColumn = createGridColumn({
        controlId: Guid.create(),
        field: field.name,
        header: field.caption || field.name,
        isLocked: false,
        canDelete: true,
        readOnly: false,
        fieldType: fieldTypeIdLookup(field.type),
        columnType: field.isLinked ? ColumnTypes.Link : ColumnTypes.Data,
        sourceField: field.sourceField,
        sourceModel: field.sourceModel,
      });
    }

    const col = { ...newColumn };
    if (col.fieldType === FieldTypeIds.Text) {
      const field = fieldList.find((item) => item.name === value);
      col.validationRules = [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
        { rule: ValidationRuleTypes.MaxLength, value: field.size, canDelete: false, maxValue: field.size }
      ];
    }

    const updated = { ...control };
    updated.columns = [...updated.columns, col];
    updated.viewList = [...updated.viewList];
    for (let i = 0; i < updated.viewList.length; i += 1) {
      updated.viewList[i] = {
        ...updated.viewList[i],
        columns: [...updated.viewList[i].columns, { field: col.field, visible: true, visibleOnMobile: null }],
      };
    }
    onChange(updated);
  };

  return (
    <AddableAccordion
      id='data'
      caption='Columns'
      onAdd={handleAddColumn}
      open
      variant='left'
      borderless
      addButtonRef={addButtonRef}
      tooltipId='editor-tooltip'
      tooltip='Add column'
      addLabel='Add column'
      options={columnOptions}
      values={columns}
      canAdd
      optionCaption='label'
      optionIcon='icon'
      optionKey='value'
      valueKey='field'
      isEmpty={columns.length === 0}
    >
      {loading && <LoadingSkeleton count={1} height={100} />}
      {!loading && (
        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          {columns.length > 0 && (
            <Grid
              id='columns'
              hideCaption={false}
              showGoToPage={false}
              showPageSize={false}
              showReload={false}
              showHeader={false}
              addRowsEnabled={false}
              editable={false}
              searchable={false}
              columns={[
                {
                  name: 'field',
                  primary: true,
                  caption: '',
                  visible: false,
                  editable: false,
                  singleLine: true,
                  fieldType: FieldTypeIds.Text,
                  width: 'dynamic',
                },
                {
                  name: 'header',
                  caption: '',
                  visible: true,
                  editable: false,
                  singleLine: true,
                  fieldType: FieldTypeIds.Text,
                  width: 'dynamic',
                },
              ]}
              data={columns}
              onRowClick={handleEditColumn}
              compact
              pageSize={50}
              pageNumber={1}
              totalRecords={columns.length}
              hideRecordCount
              isPageData
              rowStatuses={columnStatus}
              canDelete={false}
            />
          )}
        </Suspense>
      )}
    </AddableAccordion>
  );
};

GridColumnsSection.propTypes = propTypes;
export default GridColumnsSection;
