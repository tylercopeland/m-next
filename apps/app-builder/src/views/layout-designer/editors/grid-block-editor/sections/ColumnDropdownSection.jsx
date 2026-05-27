import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import CriteriaEditor from '@m-next/criteria-builder';
import Grid from '@m-next/grid';
import { fieldTypeIdIcons, fieldTypeIdLookup, FieldTypeIds } from '@m-next/types';
import { formatter, Guid, toCamelCase } from '@m-next/utilities';
import Dropdown from '@m-next/dropdown';
import { Text, TextLine } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { ButtonGroupRow } from '@m-next/button-group';
import Toggle from '@m-next/toggle';
import { colors } from '@m-next/styles';
import { createBaseColumn, ValidationRuleTypes } from '@m-next/runtime-interface';
import Accordion from '../../../../../components/accordion/Accordion';
import { GridColumnModel } from '../type';
import GridSortingSection from './GridSortingSection';
import { createDropdownControl } from '../../../control-classes';
import { useGetFieldsForTableQuery } from '../../../../../common/services/tablesFieldsApi';
import { selectAccountName, selectDisplayPreferences } from '../../../../../common/services/sessionSlice';
import { selectControls } from '../../../../../common/services/screenLayoutSlice';
import * as s from '../GridBlockEditor.styles';
import ValidationRulesList from '../../common/components/validation-rules-list/ValidationRulesList';
import ComplexValue from '../../../../../components/complex-value/ComplexValue';
import AddableAccordion from '../../../../../components/accordion/AddableAccordion';
import EditorInput from '../../common/components/editor-input/EditorInput';

const propTypes = {
  column: GridColumnModel,
  onChange: PropTypes.func,
  columns: PropTypes.arrayOf(GridColumnModel),
  control: PropTypes.instanceOf(Object),
};

const ColumnDropdownSection = ({ column, columns, onChange }) => {
  const accountName = useSelector(selectAccountName);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const controlList = useSelector(selectControls);
  const [openQuickEdit, setOpenQuickEdit] = useState(false);
  const [open, setOpen] = useState(true);

  const viewName = column.control?.model?.viewName ?? null;
  const sorting = column.control?.model?.viewFilter?.sorting ?? [];
  const expression = column.control?.model?.viewFilter?.expression ?? [];

  const filteredColumnList = useMemo(
    () =>
      columns
        ?.filter(
          (item) =>
            item.sourceModel === column.field || item.name === `${column.field}_RecordID` || item.name === column.field,
        )
        .map((x) => ({
          value: x.name,
          sourceField: x.sourceField,
          label: x.caption || x.name,
          icon: fieldTypeIdIcons[fieldTypeIdLookup(x.type)],
        })),
    [column.field, columns],
  );

  const selectedField = useMemo(() => {
    const match = filteredColumnList ? filteredColumnList.find(
      (x) => x.value === column.displayField || x.sourceField === column.displayField,
    ) : undefined;
    if (match) {
      return { value: match.value, label: match.label };
    }
    return { value: column.field, label: column.header || column.field };
  }, [column.displayField, column.field, column.header, filteredColumnList]);

  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: viewName, complexFields: false },
    { skip: !viewName },
  );

  const handleDisplayFieldSelected = (option) => {
    const updated = {
      ...column,
      displayField: option.value,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          columns: [...column.control.model.columns],
        },
      },
    };

    if (!updated.control.model.columns.find((x) => x.name === option.sourceField)) {
      const field = fieldList.find((item) => item.name === option.sourceField);
      const newColumn = createBaseColumn({
        name: field.name,
        caption: field.caption || field.name,
        fieldType: field.type,
        format: {
          visible: true,
          visibleMobile: true,
        },
      });
      updated.control.model.columns.push(newColumn);
    }
    onChange(updated);
  };

  useEffect(() => {
    if (!column.control) {
      const updated = {
        ...column,
        control: createDropdownControl(),
      };
      onChange(updated);
    }
  });

  const filteredFieldList = useMemo(() => fieldList?.filter((item) => !item.name.includes('_RecordID')), [fieldList]);
  const projection = useMemo(
    () => ({
      fields: column.control?.model?.columns.map((item) => ({ name: item.name })),
    }),
    [column.control?.model?.columns],
  );

  const fieldListOptions = useMemo(
    () =>
      formatter.formatFieldList(
        filteredFieldList,
        column.control?.model?.viewName,
        projection,
        {},
        {},
        null,
        false,
        false,
        true,
      ),
    [filteredFieldList, column.control?.model?.viewName, projection],
  );

  const fieldListOptionsFlat = useMemo(
    () => (fieldListOptions ? fieldListOptions.flatMap((section) => section.options) : []),
    [fieldListOptions],
  );

  const dropdownViewColumns = useMemo(
    () =>
      fieldList
        ? fieldList.map((col) => ({
            ...col,
            field: col.name,
            header: col.caption || col.name,
            fieldType: fieldTypeIdLookup(col.type),
          }))
        : [],
    [fieldList],
  );

  const additionalColumns = useMemo(
    () =>
      column.control.model.columns
        .filter((x) => x.name !== 'RecordID' && x.name !== column.displayField)
        .map((col) => ({
          ...col,
          field: col.name,
          header: col.caption || col.name,
          fieldType: col.fieldType,
        })),
    [column.control.model.columns, column.displayField],
  );

  const handleSortDelete = (index) => {
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          viewFilter: {
            ...column.control.model.viewFilter,
            sorting: sorting.filter((_, i) => i !== index),
          },
        },
      },
    };

    onChange(updated);
  };

  const handleSortReorder = (from, to) => {
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          viewFilter: {
            ...column.control.model.viewFilter,
            sorting: sorting.map((item, index) => {
              if (index === from) return sorting[to];
              if (index === to) return sorting[from];
              return item;
            }),
          },
        },
      },
    };

    onChange(updated);
  };

  const handleSortChange = (index, order) => {
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          viewFilter: {
            ...column.control.model.viewFilter,
            sorting: sorting.map((item, i) => {
              if (i === index) return { ...item, filterOrder: order };
              return item;
            }),
          },
        },
      },
    };

    onChange(updated);
  };

  const handleAddSort = (sortField) => {
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          viewFilter: {
            ...column.control.model.viewFilter,
            sorting: [...sorting, { filterField: sortField, filterOrder: 'asc' }],
          },
        },
      },
    };

    onChange(updated);
  };

  const handleAddFilterClick = () => {
    setOpenQuickEdit(true);
    setOpen(true);
  };

  const handleCloseCriteriaEditor = () => {
    setOpenQuickEdit(false);
  };

  const handleCriteriaChange = (criteria) => {
    const filterId =
      !column.control.model.viewFilter.filterId || column.control.model.viewFilter.filterId === Guid.empty()
        ? Guid.create()
        : column.control.model.viewFilter.filterId;
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          viewFilter: {
            ...column.control.model.viewFilter,
            filterId,
            expression: toCamelCase(criteria),
          },
        },
      },
    };

    onChange(updated);
  };

  const handleAdditionalColumnDelete = (index, primaryKey) => {
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          columns: column.control.model.columns.filter((item) => item.name !== primaryKey),
        },
      },
    };

    onChange(updated);
  };

  const handleAddAdditionalColumnReorder = (from, to) => {
    let offset = 1;
    if (column.control.model.columns.length > 1 && column.control.model.columns[1].name === column.displayField) {
      offset = 2;
    }
    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          columns: column.control.model.columns.map((item, index) => {
            if (index === from + offset) return column.control.model.columns[to + offset];
            if (index === to + offset) return column.control.model.columns[from + offset];
            return item;
          }),
        },
      },
    };

    onChange(updated);
  };

  const handleFieldSelected = (option) => {
    const field = fieldList.find((item) => item.name === option.value);
    const newColumn = createBaseColumn({
      name: field.name,
      caption: field.caption || field.name,
      fieldType: field.type,
      format: {
        visible: true,
        visibleMobile: true,
      },
    });

    const updated = {
      ...column,
      control: {
        ...column.control,
        model: {
          ...column.control.model,
          columns: [...column.control.model.columns, newColumn],
        },
      },
    };
    onChange(updated);
  };

  const handlePropertyChange = (property, value) => {
    const updated = { ...column, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...column, [property]: { ...column[property], [child]: value } };
    onChange(updated);
  };

  const handleHeaderChange = (e) => {
    handlePropertyChange('header', e);
  };

  const handleWidthChange = (e) => {
    if (e.value === 'fixed') {
      const updated = { ...column, format: { ...column.format, width: e.value, widthFixed: 120 } };
      onChange(updated);
    } else {
      handleChildPropertyChange('format', 'width', e.value);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextLine>Edit a column in the parent grid.</TextLine>
        <s.HeaderIconWrapper gap={4}>
          <Text style={{ flexBasis: '46%' }}>Name in database</Text>
          <SvgIcon id='field-type' size={12} name={fieldTypeIdIcons[column.fieldType]} />
          <Text style={{ fontStyle: 'italic' }}>{column.field}</Text>
        </s.HeaderIconWrapper>
        <s.LineWrapper>
          <Text
            tooltip='Determines if this column can be edited when the grid is set to an editable state.'
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Column type
          </Text>
          <ButtonGroupRow
            id='column-type'
            width={184}
            selected={column.readOnly}
            data={
              column.isLocked
                ? [{ value: true, label: 'Read only' }]
                : [
                    { value: true, label: 'Read only' },
                    { value: false, label: 'Editable' },
                  ]
            }
            onClick={column.isLocked ? null : (e) => handlePropertyChange('readOnly', e.value)}
          />
        </s.LineWrapper>
      </div>
      <s.SettingDivider />
      <Accordion id='display' caption='Display' variant='left' open borderless>
        <EditorInput
          id='header'
          value={column.header}
          label='Header title'
          onChange={handleHeaderChange}
          controlId={column.field}
          maxLength={100}
        />
        <s.LineWrapper gap={8}>
          <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
          <Toggle
            id='show-header'
            checked={column.showHeader}
            onChange={(e) => handlePropertyChange('showHeader', e)}
            label='Show title'
            width='100%'
            style={{ justifyContent: 'flex-start' }}
            labelStyle={{ flexBasis: '100%' }}
          />
        </s.LineWrapper>
        <s.LineWrapper>
          <Text
            tooltip="Choose between 'Auto' which adjusts width dynamically with size presets, or 'Fixed' which specifies a pixel width."
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Width
          </Text>
          <ButtonGroupRow
            id='column-width'
            width={184}
            selected={column.format.width}
            data={[
              { value: 'dynamic', label: 'Auto' },
              { value: 'fixed', label: 'Fixed' },
            ]}
            onClick={handleWidthChange}
          />
        </s.LineWrapper>
        {column.fieldType === FieldTypeIds.Text && column.format.width === 'dynamic' && (
          <s.LineWrapper>
            <Text style={{ flexGrow: 1 }} />
            <ButtonGroupRow
              id='column-auto-width'
              width={184}
              selected={column.format.widthAutoSize}
              data={[
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
              ]}
              onClick={(e) => handleChildPropertyChange('format', 'widthAutoSize', e.value)}
            />
          </s.LineWrapper>
        )}
        {column.format.width === 'fixed' && (
          <EditorInput
            id='width'
            value={column.format.widthFixed}
            onChange={(e) => handleChildPropertyChange('format', 'widthFixed', e)}
            controlId={column.field}
            maxLength={400}
            suffixText='px'
            type='number'
          />
        )}
        <s.LineWrapper>
          <Text
            tooltip='Aligns both the header and content in the cell.'
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Alignment
          </Text>
          <ButtonGroupRow
            id='column-alignment'
            width={184}
            selected={column.format.alignment}
            data={[
              { value: 'left', icon: 'align-left' },
              { value: 'center', icon: 'align-center' },
              { value: 'right', icon: 'align-right' },
            ]}
            onClick={(e) => handleChildPropertyChange('format', 'alignment', e.value)}
          />
        </s.LineWrapper>
        {column.readOnly && (
          <s.LineWrapper>
            <Text
              tooltip='Sets the font weight for the cells in this column (regular, semibold, or bold).'
              tooltipId='editor-tooltip'
              tooltipHighlighting
            >
              Font weight
            </Text>
            <ButtonGroupRow
              id='column-font-weight'
              width={184}
              selected={column.format.fontWeight || 'normal'}
              data={[
                { value: 'normal', label: 'Ag', labelStyle: { fontWeight: 400, fontSize: 14 } },
                { value: '600', label: 'Ag', labelStyle: { fontWeight: 600, fontSize: 14 } },
                { value: 'bold', label: 'Ag', labelStyle: { fontWeight: 700, fontSize: 14 } },
              ]}
              onClick={(e) => handleChildPropertyChange('format', 'fontWeight', e.value)}
            />
          </s.LineWrapper>
        )}
        <s.LineWrapper>
          <Text>Display value</Text>
          <Dropdown
            id='display-value'
            options={filteredColumnList}
            onChange={handleDisplayFieldSelected}
            dropdownStyle='multi-icon'
            isV4Design
            value={selectedField}
            width={184}
          />
        </s.LineWrapper>
        {!column.isLocked && (
          <s.LineWrapper align='flex-start'>
            <Text style={{ lineHeight: '32px' }}>Default value</Text>
            <ComplexValue
              id='default-value'
              complexValue={column.defaultValue}
              fieldListOptions={fieldListOptions}
              fieldType={column.fieldType}
              includeControls
              includeNone
              includeSessionVariables
              controlList={controlList}
              width={184}
              onChange={(e) => handlePropertyChange('defaultValue', e)}
              controlId={column.controlId}
            />
          </s.LineWrapper>
        )}
      </Accordion>
      <s.SettingDivider />
      <AddableAccordion
        id='additional-columns'
        caption='Dropdown subtitles'
        onAdd={handleFieldSelected}
        open
        tooltip='Add subtitle'
        tooltipId='editor-tooltip'
        emptyMessage='No subtitles added'
        addLabel='Add'
        options={fieldListOptionsFlat}
        optionKey='value'
        optionCaption='label'
        optionsIcon='icon'
        isEmpty={dropdownViewColumns.length === 0 || additionalColumns.length === 0}
        valueKey='field'
        values={additionalColumns}
        canAdd={additionalColumns.length < 4}
        subHeader={<TextLine>Columns below will be visible when searching dropdown.</TextLine>}
      >
        <>
          {loadingFieldList && <LoadingSkeleton count={1} height={100} />}
          <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
            {!loadingFieldList && (
              <Grid
                id='additional-columns'
                hideCaption={false}
                searchable={false}
                showGoToPage={false}
                showPageSize={false}
                showReload={false}
                showHeader={false}
                addRowsEnabled={false}
                editable
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
                data={additionalColumns}
                compact
                pageSize={50}
                pageNumber={1}
                totalRecords={additionalColumns.length}
                isPageData
                canDelete
                onDelete={handleAdditionalColumnDelete}
                onReorder={handleAddAdditionalColumnReorder}
                draggable
                hideRecordCount
                showSelectedRecords={false}
                showPagination={false}
              />
            )}
          </Suspense>
        </>
      </AddableAccordion>
      <s.SettingDivider />
      <Accordion
        id='filter'
        caption='Filter'
        tooltip='Add filter'
        tooltipId='editor-tooltip'
        onAdd={handleAddFilterClick}
        open={open}
        onClose={() => setOpen(false)}
        variant='left'
        borderless
      >
        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          {loadingFieldList ? (
            <LoadingSkeleton count={1} height={100} />
          ) : (
            <CriteriaEditor
              id='filter'
              controlList={controlList}
              dataModelId={column.control?.model?.viewName}
              displayPreferences={displayPreferences}
              onChange={handleCriteriaChange}
              expression={expression}
              filterId={column.control?.model?.viewFilter?.filterId}
              fieldList={fieldList}
              includeControls
              includeSessionVariables
              showEmptyState
              openQuickEdit={openQuickEdit}
              onClose={handleCloseCriteriaEditor}
              emptyMessage='No filters applied'
              showEmptyFilterIcon={false}
            />
          )}
        </Suspense>
      </Accordion>
      {!column.isLocked && <s.SettingDivider />}
      {!column.isLocked && (
        <ValidationRulesList
          standardOptions={[ValidationRuleTypes.Required]}
          values={column.validationRules}
          onChange={(e) => handlePropertyChange('validationRules', e)}
        />
      )}
      <s.SettingDivider />
      {!loadingFieldList && (
        <GridSortingSection
          id='sorting'
          caption='Sorting'
          sortColumns={column.control?.model?.viewFilter?.sorting}
          columns={dropdownViewColumns}
          canAdd
          emptyMessage='Sorting allows you to order the data displayed on your grid.'
          emptyTitle='No sorting applied'
          onAdd={handleAddSort}
          onReorder={handleSortReorder}
          onDelete={handleSortDelete}
          onChange={handleSortChange}
        />
      )}
      <s.SettingDivider />
    </>
  );
};

ColumnDropdownSection.propTypes = propTypes;
export default ColumnDropdownSection;
