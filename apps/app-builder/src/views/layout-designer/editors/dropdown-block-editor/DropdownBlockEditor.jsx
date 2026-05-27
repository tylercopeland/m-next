import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { openActionEditor } from '@m-next/action-editor';

import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import LoadingSkeleton from '@m-next/loading-skeleton';
import CriteriaEditor from '@m-next/criteria-builder';
import Grid from '@m-next/grid';
import { fieldTypeIdLookup, FieldTypeIds, FieldTypeNames } from '@m-next/types';
import { formatter, Guid, toCamelCase } from '@m-next/utilities';
import Dropdown from '@m-next/dropdown';
import { Text, TextLine } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import Toggle from '@m-next/toggle';
import { colors } from '@m-next/styles';
import Dialog from '@m-next/dialog';
import Container from '@m-next/container';
import { createBaseColumn, ValidationRuleTypes } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import GridSortingSection from '../grid-block-editor/sections/GridSortingSection';
import { createDropdownControl, migrateDropdownControl } from '../../control-classes';
import { useGetFieldsForTableQuery, useGetTablesQuery } from '../../../../common/services/tablesFieldsApi';
import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import { selectBaseModel, selectControls } from '../../../../common/services/screenLayoutSlice';
import * as s from '../common/BlockEditor.styles';
import ValidationRulesList from '../common/components/validation-rules-list/ValidationRulesList';
import ComplexValue from '../../../../components/complex-value/ComplexValue';
import AddableAccordion from '../../../../components/accordion/AddableAccordion';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import EditorInput from '../common/components/editor-input/EditorInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import TableDropdown from '../common/components/table-dropdown/TableDropdown';

const propTypes = {
  onChange: PropTypes.func,
  rawControl: PropTypes.instanceOf(Object),
  onAddAction: PropTypes.func,
};

const actions = [
  { value: `Change`, label: 'Change', source: 'onChange' },
  { value: `Focus`, label: 'On focus', source: 'onFocus' },
  { value: `Lose Focus`, label: 'Lose focus', source: 'onBlur' },
];

function DropdownBlockEditor({ onChange, rawControl, onAddAction }) {
  const accountName = useSelector(selectAccountName);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const controlList = useSelector(selectControls);
  const screenBaseModel = useSelector(selectBaseModel);
  const [openQuickEdit, setOpenQuickEdit] = useState(false);
  const [open, setOpen] = useState(true);
  const [lastControlId, setLastControlId] = useState(null);
  const [saveDataDialogOpen, setSaveDataDialogOpen] = useState(false);
  const [viewName, setViewName] = useState(null);
  const [prevSaveData, setPrevSaveData] = useState(false);
  const [pendingSaveDataChange, setPendingSaveDataChange] = useState(null);

  const { data: tablesList, isFetching: loadingTableList } = useGetTablesQuery(
    { accountName },
    { skip: !accountName },
  );
  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: viewName, complexFields: false },
    { skip: !viewName },
  );
  const { data: baseModelFields } = useGetFieldsForTableQuery(
    { accountName, tableName: screenBaseModel, complexFields: false },
    { skip: !screenBaseModel },
  );

  const ensureRecordIdColumn = (columns) => {
    const columnsArray = columns || [];
    const hasRecordId = columnsArray.some((col) => col.name === 'RecordID');
    if (!hasRecordId) {
      const recordIdColumn = createBaseColumn({
        name: 'RecordID',
        caption: 'Record ID',
        fieldType: FieldTypeIds.Integer,
        format: {
          visible: false,
          visibleMobile: false,
        },
        isKey: true,
      });
      return [recordIdColumn, ...columnsArray];
    }
    return columnsArray;
  };

  // Ensure dropdown has both RecordID and a display column (required by backend)
  const ensureMinimumColumns = (columns, fields) => {
    let result = ensureRecordIdColumn(columns);
    // If we only have RecordID, add the first text field as display column
    if (result.length === 1 && fields && fields.length > 0) {
      // Find first text field, or use first field if no text fields
      const firstTextField = fields.find((f) => f.type === FieldTypeNames.Text) || fields[0];
      if (firstTextField) {
        const displayColumn = createBaseColumn({
          name: firstTextField.name,
          caption: firstTextField.caption || firstTextField.name,
          fieldType: firstTextField.type,
          format: {
            visible: true,
            visibleMobile: true,
          },
        });
        result = [...result, displayColumn];
      }
    }
    return result;
  };

  const activeControl = useMemo(() => {
    const defaultControl = createDropdownControl();
    if (lastControlId !== rawControl.id) {
      setLastControlId(rawControl.id);
    }

    // Merge rawControl with defaultControl, but don't let null values override defaults
    const mergedControl = { ...defaultControl };
    // TODO: Ensure component versions are updated properly (specifically fullwidth)
    if (rawControl) {
      Object.keys(rawControl).forEach((key) => {
        if (rawControl[key] !== null && rawControl[key] !== undefined) {
          mergedControl[key] = rawControl[key];
        }
      });
    }

    const merged = toCamelCase(mergedControl);
    const migrated = migrateDropdownControl(merged);
    const memoizedControl = migrated ?? merged;
    return memoizedControl;
  }, [lastControlId, rawControl]);

  useEffect(() => {
    setViewName(activeControl?.model?.viewName);
    setPrevSaveData(activeControl?.model?.isBound);
  }, [activeControl?.model?.viewName, activeControl?.model?.isBound]);

  // Effect to ensure dropdown has minimum columns after field list loads
  // This handles the case where handleTableChange resets columns to just RecordID
  useEffect(() => {
    if (
      !loadingFieldList &&
      fieldList &&
      fieldList.length > 0 &&
      activeControl?.model?.columns?.length === 1 &&
      activeControl.model.columns[0]?.name === 'RecordID'
    ) {
      // Only RecordID exists, need to add a display column
      const newColumns = ensureMinimumColumns(activeControl.model.columns, fieldList);
      if (newColumns.length > 1) {
        const updated = {
          ...activeControl,
          model: {
            ...activeControl.model,
            columns: newColumns,
          },
        };
        onChange(updated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingFieldList, fieldList, activeControl?.model?.columns?.length]);

  const sorting = activeControl?.model?.viewFilter?.sorting ?? [];
  const expression = activeControl?.model?.viewFilter?.expression ?? [];

  const displayField = activeControl?.model?.columns?.[1]?.name ?? '';

  const filteredControlList = useMemo(() => {
    const newControlList = Object.keys(controlList)
      .filter((key) => key !== activeControl.id)
      .reduce((acc, key) => {
        acc[key] = controlList[key];
        return acc;
      }, {});
    return newControlList;
  }, [activeControl.id, controlList]);

  const filteredBaseModelFields = useMemo(() => {
    const dropdownFields = baseModelFields?.filter((item) => item.type === FieldTypeNames.DropDown);
    const usedNames = Object.values(filteredControlList).map((control) => control.name);
    return dropdownFields?.filter((field) => !usedNames.includes(field.name));
  }, [baseModelFields, filteredControlList]);

  const selectedField = useMemo(() => {
    const match = fieldList?.find((x) => x.value === displayField);
    if (match) {
      return { value: match.name, label: match.caption || match.name };
    }
    return { value: displayField, label: displayField };
  }, [displayField, fieldList]);

  const selectedBaseField = useMemo(() => {
    const match = filteredBaseModelFields?.find((x) => x.name === activeControl.name);
    if (match) {
      return { value: match.name, label: match.caption || match.name };
    }
    return { value: activeControl.name, label: activeControl.name };
  }, [activeControl.name, filteredBaseModelFields]);

  const filteredFieldList = useMemo(
    () => fieldList?.filter((item) => !item.name.includes('_RecordID') && item.name !== 'RecordID'),
    [fieldList],
  );

  const selectedValueOptionsFlat = useMemo(
    () => {
      const getOptionSortText = (option) => {
        if (typeof option?.label === 'string') return option.label;
        return String(option?.value ?? '');
      };

      return filteredFieldList
        ? formatter
            .formatFieldList(filteredFieldList, viewName, null, {}, {}, null, false, false, false)
            .flatMap((section) => section.options)
            .sort((a, b) =>
              getOptionSortText(a).localeCompare(getOptionSortText(b), undefined, {
                sensitivity: 'base',
                numeric: true,
              }),
            )
        : [];
    },
    [filteredFieldList, viewName],
  );

  const projection = useMemo(
    () => ({
      fields: activeControl?.model?.columns.map((item) => ({ name: item.name })),
    }),
    [activeControl?.model?.columns],
  );

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(filteredFieldList, viewName, projection, {}, {}, null, false, false, false),
    [filteredFieldList, viewName, projection],
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
      activeControl.model.columns
        .filter((x) => x.name !== 'RecordID' && x.name !== displayField)
        .map((col) => ({
          ...col,
          field: col.name,
          header: col.caption || col.name,
          fieldType: col.fieldType,
        })),
    [activeControl.model.columns, displayField],
  );

  const events = useMemo(() => {
    const list = [];
    if (activeControl.onChange) {
      list.push({ id: activeControl.onChange, value: `Change`, label: 'Change' });
    }
    if (activeControl.onFocus) {
      list.push({ id: activeControl.onFocus, value: `Focus`, label: 'On focus' });
    }
    if (activeControl.onBlur) {
      list.push({ id: activeControl.onBlur, value: `Lose Focus`, label: 'Lose focus' });
    }
    // Custom Row Click event is now managed separately
    return list;
  }, [activeControl.onChange, activeControl.onFocus, activeControl.onBlur]);

  const filteredActions = useMemo(
    () => actions.filter((action) => !events.some((item) => item.value === action.value)),
    [events],
  );

  const handleDisplayFieldSelected = (option) => {
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        columns: [...activeControl.model.columns],
      },
    };

    if (!updated.model.columns.find((x) => x.name === option.value)) {
      const field = fieldList.find((item) => item.name === option.value);
      if (!field) return; // maybe log error instead if this happens
      const newColumn = createBaseColumn({
        name: field.name,
        caption: field.caption || field.name,
        fieldType: field.type,
        format: {
          visible: true,
          visibleMobile: true,
        },
      });
      updated.model.columns.splice(1, 0, newColumn);
    } else {
      const index = updated.model.columns.findIndex((x) => x.name === option.value);
      if (index > -1) {
        const [movedColumn] = updated.model.columns.splice(index, 1);
        updated.model.columns.splice(1, 0, movedColumn);
      }
    }
    onChange(updated);
  };

  const handleSortDelete = (index) => {
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        viewFilter: {
          ...activeControl.model.viewFilter,
          sorting: sorting.filter((_, i) => i !== index),
        },
      },
      filterDef: [
        {
          ...activeControl.filterDef?.[0],
          sorting: sorting.filter((_, i) => i !== index),
        },
      ],
    };

    onChange(updated);
  };

  const handleSortReorder = (from, to) => {
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        viewFilter: {
          ...activeControl.model.viewFilter,
          sorting: sorting.map((item, index) => {
            if (index === from) return sorting[to];
            if (index === to) return sorting[from];
            return item;
          }),
        },
      },
      filterDef: [
        {
          ...activeControl.filterDef?.[0],
          sorting: sorting.map((item, index) => {
            if (index === from) return sorting[to];
            if (index === to) return sorting[from];
            return item;
          }),
        },
      ],
    };

    onChange(updated);
  };

  const handleSortChange = (index, order) => {
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        viewFilter: {
          ...activeControl.model.viewFilter,
          sorting: sorting.map((item, i) => {
            if (i === index) return { ...item, filterOrder: order };
            return item;
          }),
        },
      },
      filterDef: [
        {
          ...activeControl.filterDef?.[0],
          sorting: sorting.map((item, i) => {
            if (i === index) return { ...item, filterOrder: order };
            return item;
          }),
        },
      ],
    };

    onChange(updated);
  };

  const handleAddSort = (sortField) => {
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        viewFilter: {
          ...activeControl.model.viewFilter,
          sorting: [...sorting, { filterField: sortField, filterOrder: 'asc' }],
        },
      },
      filterDef: [
        {
          ...activeControl.filterDef?.[0],
          sorting: [...sorting, { filterField: sortField, filterOrder: 'asc' }],
        },
      ],
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
      !activeControl.model?.viewFilter?.filterId || activeControl.model.viewFilter.filterId === Guid.empty()
        ? Guid.create()
        : activeControl.model.viewFilter.filterId;
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        viewFilter: {
          ...activeControl.model.viewFilter,
          filterId,
          expression: toCamelCase(criteria),
        },
      },
      filterDef: [
        {
          ...activeControl.filterDef?.[0],
          expression: toCamelCase(criteria),
        },
      ],
    };

    onChange(updated);
  };

  const handleAdditionalColumnDelete = (index, primaryKey) => {
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        columns: activeControl.model.columns.filter((item) => item.name !== primaryKey),
      },
    };

    onChange(updated);
  };

  const handleAddAdditionalColumnReorder = (from, to) => {
    let offset = 1;
    if (activeControl.model.columns.length > 1 && activeControl.model.columns[1].name === displayField) {
      offset = 2;
    }
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        columns: activeControl.model.columns.map((item, index) => {
          if (index === from + offset) return activeControl.model.columns[to + offset];
          if (index === to + offset) return activeControl.model.columns[from + offset];
          return item;
        }),
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
      ...activeControl,
      model: {
        ...activeControl.model,
        columns: [...activeControl.model.columns, newColumn],
      },
    };
    onChange(updated);
  };

  const handlePropertyChange = (property, value) => {
    const updated = { ...activeControl, [property]: value };
    onChange(updated);
  };

  const sanitizeControlName = (name) => {
    const similarControls = Object.values(controlList).filter(
      (control) => new RegExp(`^${name}(\\d+)?$`, 'i').test(control.name) && control.id !== activeControl.id,
    );
    const similarBaseFields = baseModelFields?.filter((field) => new RegExp(`^${name}(\\d+)?$`, 'i').test(field.name));

    const maxControlIndex =
      similarControls.length > 0
        ? Math.max(
            ...similarControls.map((control) => {
              const match = control.name.match(/(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            }),
          )
        : 0;

    const maxFieldIndex =
      similarBaseFields?.length > 0
        ? Math.max(
            ...similarBaseFields.map((field) => {
              const match = field.name.match(/(\d+)$/);
              return match ? parseInt(match[1], 10) : 0;
            }),
          )
        : 0;

    if ((!similarBaseFields || similarBaseFields.length === 0) && (!similarControls || similarControls.length === 0)) {
      return name;
    }

    // Increment the index by 1 to create a new unique name
    const maxIndex = Math.max(maxControlIndex, maxFieldIndex);

    return `${name}${maxIndex + 1}`;
  };

  const handleLabelChange = (value) => {
    const updated = { ...activeControl };
    updated.caption = value;
    if (!activeControl.isBound && activeControl.name !== value && value) {
      updated.name = sanitizeControlName(value);
    }
    if (!value) {
      updated.hideCaption = true;
    } else if (!activeControl.caption) {
      updated.hideCaption = false;
    }
    onChange(updated);
  };

  const handleSaveDataChange = (value) => {
    if (!value) {
      // When turning off save data
      const updated = { ...activeControl, isBound: value };
      updated.name = sanitizeControlName(activeControl.name);
      setPrevSaveData(value);
      onChange(updated);
    } else if (activeControl.model.viewName !== screenBaseModel) {
      // When turning on save data and table will change
      setSaveDataDialogOpen(true);
      setPendingSaveDataChange(value);
    } else {
      // When turning on save data and table will not change
      const updated = { ...activeControl, isBound: value };
      const firstField = filteredBaseModelFields?.[0];
      updated.name = firstField?.name;
      // Ensure both RecordID and display column exist, and update viewName
      // to the field's sourceModel so Display value / Subtitle dropdowns
      // load the correct options immediately (mirrors handleBaseFieldChange).
      updated.model = {
        ...updated.model,
        viewName: firstField?.sourceModel ?? updated.model.viewName,
        columns: ensureMinimumColumns(updated.model.columns, fieldList),
      };
      setPrevSaveData(value);
      onChange(updated);
    }
  };

  const handleConfirmSaveDataChange = () => {
    const updated = { ...activeControl, isBound: pendingSaveDataChange };
    const firstField = filteredBaseModelFields?.[0];
    updated.name = firstField?.name;
    updated.model = {
      ...updated.model,
      // Use the field's sourceModel so Display value / Subtitle dropdowns
      // load the correct options immediately (mirrors handleBaseFieldChange).
      viewName: firstField?.sourceModel ?? screenBaseModel,
      columns: ensureMinimumColumns(updated.model.columns || [], baseModelFields),
    };
    setPrevSaveData(pendingSaveDataChange);
    setSaveDataDialogOpen(false);
    setPendingSaveDataChange(null);
    onChange(updated);
  };

  const handleCancelSaveDataChange = () => {
    setSaveDataDialogOpen(false);
    setPendingSaveDataChange(null);
    // Reset the toggle state
    const prevSaveDataValue = activeControl.isBound;
    handlePropertyChange('isBound', !prevSaveDataValue); // Trigger a re-render with previous value
    setTimeout(() => handlePropertyChange('isBound', prevSaveDataValue), 0);
  };

  const handleTableChange = (newTable) => {
    if (newTable !== activeControl.model.viewName) {
      const updated = {
        ...activeControl,
        model: {
          ...activeControl.model,
          viewFilter: null,
          sorting: null,
          viewName: newTable,
          columns: ensureRecordIdColumn([]),
        },
      };
      if (prevSaveData !== updated.isBound && updated.isBound) {
        updated.name = filteredBaseModelFields?.[0]?.name;
        setPrevSaveData(updated.isBound);
      }
      onChange(updated);
    }
  };
  
  const handleBaseFieldChange = (value) => {
    const field = filteredBaseModelFields.find((item) => item.name === value);
    console.log({field})
    const updated = {
      ...activeControl,
      model: {
        ...activeControl.model,
        viewName: field.sourceModel,
      },
      name: value,
    };
    onChange(updated);
  };

  const handleAddAction = (property, eventName) => {
    // Create a new actionSetId if one doesn't exist
    const actionSetId = Guid.create();
    const updated = { ...activeControl, [property]: actionSetId };

    onChange(updated);
    onAddAction(updated, eventName);
  };

  // mouse event
  const openActionEditorWrapper = (e) => {
    if (e) {
      if (activeControl.onCustomRowClick && typeof openActionEditor === 'function') {
        // In production environment
        openActionEditor({ options: activeControl }, 'Custom Row Click', undefined, activeControl.id);
      } else {
        // In test environment or if no action exists yet, add a new one
        handleAddAction('onCustomRowClick', 'Custom Row Click');
      }
    } else {
      handlePropertyChange('onCustomRowClick', null);
    }
  };

  return (
    <>
      {loadingTableList && <LoadingSkeleton count={1} height={100} />}
      {!loadingTableList && (
        <s.Wrapper padding={16} gutter={96}>
          <Tooltip
            id='editor-tooltip'
            opacity={1}
            style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextLine>Edit the base configuration and styles of the dropdown.</TextLine>
            <s.LineWrapper>
              <Text
                style={{ textWrap: 'nowrap' }}
                tooltip='Saves the selected value to a connected table field.'
                tooltipId='editor-tooltip'
                tooltipHighlighting
              >
                Save data
              </Text>
              <Toggle
                id='save-data'
                checked={activeControl.isBound}
                onChange={(e) => handleSaveDataChange(e)}
                width='100%'
                style={{ justifyContent: 'flex-end' }}
                labelStyle={{ flexBasis: '100%' }}
              />
            </s.LineWrapper>
            <s.LineWrapper>
              <Text style={{ flexGrow: 1 }}>Table</Text>
              <TableDropdown
                tableList={tablesList}
                selectedTableName={activeControl.isBound ? screenBaseModel : viewName}
                onChange={handleTableChange}
                validationMessage={viewName ? '' : 'Table is required'}
                warningLabel='Changing the base table for this dropdown will mean that some properties, dropdown subtitles, filters and
            sorting will be lost.'
                warningSubLabel='Are you sure you want to change the table for this dropdown?'
                showWarning={activeControl.model.viewName}
                disabled={activeControl.isBound}
              />
            </s.LineWrapper>
            {!activeControl?.model?.viewName && (
              <div
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '2px',
                  backgroundColor: '#FFF3F0',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  gap: '16px',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    backgroundColor: '#DA211E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M7.587 10.6264C7.7103 10.544 7.8553 10.5 8.0037 10.5C8.2026 10.5 8.3933 10.579 8.534 10.7197C8.6746 10.8603 8.7537 11.0511 8.7537 11.25C8.7537 11.3983 8.7097 11.5433 8.6273 11.6667C8.5449 11.79 8.4277 11.8861 8.2907 11.9429C8.1536 11.9997 8.0028 12.0145 7.8573 11.9856C7.7119 11.9567 7.5782 11.8852 7.4733 11.7803C7.3684 11.6754 7.297 11.5418 7.2681 11.3963C7.2391 11.2508 7.254 11.1 7.3108 10.963C7.3675 10.8259 7.4636 10.7088 7.587 10.6264ZM8.0993 11.481C8.1144 11.4747 8.1289 11.467 8.1426 11.4579C8.17 11.4395 8.1934 11.4161 8.2115 11.3889C8.2206 11.3753 8.2283 11.3609 8.2346 11.3457C8.2473 11.3152 8.2537 11.2827 8.2537 11.25C8.2537 11.2337 8.2521 11.2174 8.2489 11.2012C8.2392 11.1527 8.2154 11.1082 8.1804 11.0732C8.1455 11.0383 8.1009 11.0144 8.0524 11.0048C8.0363 11.0016 8.02 11 8.0037 11C7.971 11 7.9385 11.0064 7.908 11.019C7.8928 11.0253 7.8783 11.0331 7.8648 11.0421C7.8376 11.0603 7.8141 11.0837 7.7958 11.1111C7.7867 11.1248 7.7789 11.1393 7.7727 11.1543C7.7602 11.1845 7.7537 11.217 7.7537 11.25C7.7537 11.2665 7.7553 11.2828 7.7585 11.2988C7.768 11.3469 7.7917 11.3916 7.8269 11.4268C7.8621 11.462 7.9067 11.4856 7.9549 11.4952C7.9708 11.4984 7.9872 11.5 8.0037 11.5C8.0367 11.5 8.0691 11.4935 8.0993 11.481Z'
                      fill='white'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8.0037 3C8.2798 3 8.5037 3.2239 8.5037 3.5V9C8.5037 9.2761 8.2798 9.5 8.0037 9.5C7.7275 9.5 7.5037 9.2761 7.5037 9V3.5C7.5037 3.2239 7.7275 3 8.0037 3Z'
                      fill='white'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8.0037 1C4.1377 1 1.0037 4.134 1.0037 8C1.0037 11.866 4.1377 15 8.0037 15C11.8697 15 15.0037 11.866 15.0037 8C15.0037 4.134 11.8697 1 8.0037 1ZM0.0037 8C0.0037 3.5817 3.5854 0 8.0037 0C12.4219 0 16.0037 3.5817 16.0037 8C16.0037 12.4183 12.4219 16 8.0037 16C3.5854 16 0.0037 12.4183 0.0037 8Z'
                      fill='white'
                    />
                  </svg>
                </div>
                <Text style={{ color: '#2A394A', fontSize: '14px', fontWeight: '400' }}>
                  Select a table to configure dropdown
                </Text>
              </div>
            )}
            {activeControl.isBound && (
              <>
                <s.LineWrapper>
                  <Text style={{ flexGrow: 1 }}>Field</Text>
                  <Dropdown
                    id='field'
                    value={selectedBaseField}
                    options={filteredBaseModelFields?.map((item) => ({
                      value: item.name,
                      label: item.caption || item.name,
                    }))}
                    onChange={(e) => handleBaseFieldChange(e.value)}
                    width={184}
                    required
                    isV4Design
                    disabled={filteredBaseModelFields?.length === 0}
                  />
                </s.LineWrapper>
                {filteredBaseModelFields?.length === 0 && (
                  <s.LineWrapper>
                    <Text style={{ flexGrow: 1 }}> </Text>
                    <Text style={{ width: '184px' }}>
                      All dropdown-type fields on this table are already in use. Remove a mapping to free one up or add
                      a new dropdown field to the table
                    </Text>
                  </s.LineWrapper>
                )}
              </>
            )}
          </div>
          <s.SettingDivider />
          <Accordion id='display' caption='Display' variant='left' open borderless>
            <EditorInput
              id='label'
              value={activeControl.caption}
              onChange={(e) => handleLabelChange(e)}
              maxLength={30}
              label='Label'
              controlId={activeControl.id}
            />
            <s.LineWrapper gap={8}>
              <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
              <Toggle
                id='show-label'
                checked={!activeControl.hideCaption}
                onChange={(e) => handlePropertyChange('hideCaption', !e)}
                label='Show label'
                width='100%'
                style={{ justifyContent: 'flex-start' }}
                labelStyle={{ flexBasis: '100%' }}
              />
            </s.LineWrapper>
            <s.LineWrapper>
              <Text>Display value</Text>
              <Dropdown
                id='display-value'
                options={selectedValueOptionsFlat}
                onChange={handleDisplayFieldSelected}
                dropdownStyle='multi-icon'
                isV4Design
                value={selectedField}
                width={184}
              />
            </s.LineWrapper>
            {!activeControl.isLocked && (
              <s.LineWrapper align='flex-start'>
                <div style={{ lineHeight: '32px' }}>
                  <Text tooltip='Sets the initial value of the input.' tooltipId='editor-tooltip' tooltipHighlighting>
                    Default value
                  </Text>
                </div>
                <ComplexValue
                  id={`default-value-${activeControl.id}`}
                  complexValue={
                    typeof activeControl.defaultValue === 'string'
                      ? { value: activeControl.defaultValue, valueType: 2 }
                      : activeControl.defaultValue
                  }
                  fieldListOptions={fieldListOptions}
                  fieldType={activeControl.fieldType}
                  includeControls
                  includeNone
                  includeSessionVariables
                  controlList={filteredControlList}
                  width={184}
                  onChange={(e) => handlePropertyChange('defaultValue', e)}
                  controlId={activeControl.id}
                />
              </s.LineWrapper>
            )}
            <DefaultStateSelector control={activeControl} onChange={onChange} />
          </Accordion>
          <s.SettingDivider />
          <AddableAccordion
            id='dropdown-action-item-accordion'
            caption='Dropdown Action Item'
            canAdd={!activeControl.onCustomRowClick}
            onAdd={openActionEditorWrapper}
            open
            options={[{ value: 'true' }]}
            optionKey='value'
            optionCaption='label'
            optionsIcon='icon'
            valueKey='value'
            values={[]}
            tooltip='Add action item'
            tooltipId='action-editor-tooltip'
            isEmpty={!activeControl.onCustomRowClick}
            emptyMessage='No actions applied'
            addLabel='Add click'
            subHeader={<TextLine>Add an action to manage dropdown items.</TextLine>}
          >
            {activeControl.onCustomRowClick && (
              <>
                <div
                  style={{
                    width: '100%',
                    border: '1px solid #E0E4EA',
                    borderRadius: 6,
                    padding: '8px 16px',
                    marginBottom: 12,
                    fontWeight: 500,
                    color: '#1A2233',
                    cursor: 'pointer',
                  }}
                  onClick={openActionEditorWrapper}
                >
                  Action item click
                </div>
                <EditorInput
                  id='customRowText'
                  controlId={activeControl.id}
                  value={
                    activeControl.customRowText === '' ? `Manage ${activeControl.caption}` : activeControl.customRowText
                  }
                  onChange={(e) => handlePropertyChange('customRowText', e)}
                  width='100%'
                  maxLength={30}
                  label='Action item label'
                  showChildIcon
                />
              </>
            )}
          </AddableAccordion>

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
                  controlList={filteredControlList}
                  dataModelId={viewName}
                  displayPreferences={displayPreferences}
                  onChange={handleCriteriaChange}
                  expression={expression}
                  filterId={activeControl?.model?.viewFilter?.filterId}
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
          <s.SettingDivider />
          {!loadingFieldList && (
            <GridSortingSection
              id='sorting'
              caption='Sorting'
              sortColumns={sorting}
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
          {!activeControl.isLocked && (
            <>
              <s.SettingDivider />
              <ValidationRulesList
                standardOptions={[ValidationRuleTypes.Required]}
                values={activeControl.validationRules}
                onChange={(e) => handlePropertyChange('validationRules', e)}
              />
            </>
          )}
          <s.SettingDivider />

          <ActionListSection
            caption='Events'
            values={events}
            emptyMessage='No events applied'
            canAdd={filteredActions.length > 0}
            addLabel='Add Event'
            actions={filteredActions}
            onAddAction={handleAddAction}
            control={activeControl}
            valueKey='value'
            optionKey='value'
          />
        </s.Wrapper>
      )}
      <Dialog
        title='Save data - Reset properties'
        isOpen={saveDataDialogOpen}
        onClose={() => setSaveDataDialogOpen(false)}
        onDismiss={handleCancelSaveDataChange}
        confirmText='Change save data'
        cancelText='Cancel'
        footer={{
          primaryButtonLabel: 'Save data',
          onPrimaryButtonClick: handleConfirmSaveDataChange,
          secondaryButtonLabel: 'Cancel',
          onSecondaryButtonClick: handleCancelSaveDataChange,
        }}
      >
        <Container style={{ gap: 16, padding: 0 }}>
          <TextLine>
            Changing the save data setting for this dropdown will change the table to the screen&apos;s base table and
            reset some properties.
          </TextLine>
          <TextLine>Are you sure you want to change the save data setting for this dropdown?</TextLine>
        </Container>
      </Dialog>
    </>
  );
}

DropdownBlockEditor.propTypes = propTypes;
export default DropdownBlockEditor;
