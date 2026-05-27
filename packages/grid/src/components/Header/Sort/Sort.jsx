import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconMenuList } from '@m-next/menu';
import RadioGroup from '@m-next/radio-button';
import { TextLine } from '@m-next/typeography';
import Dropdown from '@m-next/dropdown';
import { FieldTypeIds, Sorting, sortTypes } from '@m-next/types';
import Column from '../../../ColumnPropType';

const propTypes = {
  id: PropTypes.string,
  columns: PropTypes.arrayOf(Column),
  sorting: Sorting,
  onChangeColumnSorting: PropTypes.func,
  disabled: PropTypes.bool,
  returnCodeSnippet: PropTypes.bool,
};

function Sort({ id = '', columns = [], sorting = [], onChangeColumnSorting = null, disabled, returnCodeSnippet }) {
  const columnOptions = useMemo(
    () =>
      columns
        .filter(
          (x) =>
            x.visible &&
            (x.fieldType === FieldTypeIds.Integer ||
              x.fieldType === FieldTypeIds.DateTime ||
              x.fieldType === FieldTypeIds.Decimal ||
              x.fieldType === FieldTypeIds.Money ||
              x.fieldType === FieldTypeIds.Text ||
              x.fieldType === FieldTypeIds.DropDown ||
              x.fieldType === FieldTypeIds.YesNo ||
              x.fieldType === FieldTypeIds.CardColumn),
        )
        .map((x) => ({ label: x.caption ?? x.name, value: x.name })),
    [columns],
  );
  const selectedColumn = useMemo(() => {
    if (!sorting) return null;

    const match = columns.filter((x) => x.name === sorting.sortField);
    if (match.length === 0) return null;

    return match[0];
  }, [columns, sorting]);

  const sortingOptions = useMemo(() => {
    const fieldType = selectedColumn?.fieldType;
    switch (fieldType) {
      case FieldTypeIds.Integer:
      case FieldTypeIds.Decimal:
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
  }, [selectedColumn]);

  const sortDirection = useMemo(() => {
    const value = !sorting || sorting.sortType === sortTypes.Ascending ? sortTypes.Ascending : sortTypes.Descending;

    let label = 'A to Z';
    const fieldType = selectedColumn?.fieldType;

    switch (fieldType) {
      case FieldTypeIds.Integer:
      case FieldTypeIds.Decimal:
        label = !value || value === sortTypes.Ascending ? '1 → 9' : '9 → 1';
        break;
      case FieldTypeIds.DateTime:
        label = !value || value === sortTypes.Ascending ? 'Old → New' : 'New → Old';
        break;
      case FieldTypeIds.Money:
        label = !value || value === sortTypes.Ascending ? 'Low → High' : 'High → Low';
        break;
      default:
        label = !value || value === sortTypes.Ascending ? 'A → Z ' : 'Z → A';
    }
    return { label, value };
  }, [selectedColumn, sorting]);

  const sortField = useMemo(() => (!sorting ? null : sorting.sortField), [sorting]);

  const handleColumnChange = (e, value) => {
    onChangeColumnSorting(value, sortDirection.value, 'Sort Menu', e);
  };

  const handleDirectionChange = (option) => {
    onChangeColumnSorting(sortField, option.value, 'Sort Menu', undefined);
  };

  const sortBody = () => (
    <>
      <TextLine bold>Sort by</TextLine>
      <RadioGroup
        id={`${id}-sort-columns`}
        options={columnOptions}
        onChange={handleColumnChange}
        selectedValue={sortField}
        name='sort-columns'
        labelStyle={{ overflow: 'hidden', textOverflow: 'ellipse', width: 180 }}
      />
      <Dropdown
        id={`${id}-sort-direction`}
        options={sortingOptions}
        onChange={handleDirectionChange}
        value={sortDirection}
        isV4Design
        style={{ marginTop: 8 }}
      />
    </>
  );

  if (returnCodeSnippet) {
    return sortBody();
  }

  return (
    <IconMenuList
      id={`${id}-sort-menu`}
      style={{ gap: 8 }}
      marginVertical={4}
      width={218}
      icon='arrow-up-down'
      iconBorder
      horizontalAlign='right'
      disabled={disabled}
      inline
      relativeToParent
    >
      {sortBody()}
    </IconMenuList>
  );
}

Sort.propTypes = propTypes;
export default Sort;
