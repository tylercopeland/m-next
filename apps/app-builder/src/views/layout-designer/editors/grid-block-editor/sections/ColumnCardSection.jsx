import React, { Suspense, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import Card from '@m-next/card';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import Toggle from '@m-next/toggle';
import { FieldTypeIds, FieldTypeNames } from '@m-next/types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Grid from '@m-next/grid';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from '../GridBlockEditor.styles';
import { GridColumnModel } from '../type';
import Accordion from '../../../../../components/accordion/Accordion';
import ColumnCardFieldSection from './ColumnCardFieldSection';
import { createCardField } from '../../../control-classes/card';
import EditorInput from '../../common/components/editor-input/EditorInput';

const propTypes = {
  column: GridColumnModel,
  onChange: PropTypes.func,
  onSelectChild: PropTypes.func,
  fieldList: PropTypes.arrayOf(PropTypes.shape({})),
  viewFriendlyName: PropTypes.string,
  selectedChildColumn: PropTypes.string,
};

const ColumnCardSection = ({
  column,
  onChange,
  onSelectChild,
  fieldList,
  viewFriendlyName,
  selectedChildColumn,
}) => {
  const { content } = useTheme();

  const selectedCardField = useMemo(() => {
    if (!selectedChildColumn) return null;
    if (selectedChildColumn === 'Image') return column.control.avatar;
    return column.control[selectedChildColumn.replace(' ', '').toLowerCase()];
  }, [selectedChildColumn, column.control]);
  const data = useMemo(
    () => [
      { key: 'avatar', label: 'Image', value: column.control.avatar?.name },
      { key: 'field1', label: 'Field 1', value: column.control.field1?.name },
      { key: 'field2', label: 'Field 2', value: column.control.field2?.name },
      { key: 'field3', label: 'Field 3', value: column.control.field3?.name },
      { key: 'field4', label: 'Field 4', value: column.control.field4?.name },
      { key: 'field5', label: 'Field 5', value: column.control.field5?.name },
      { key: 'field6', label: 'Field 6', value: column.control.field6?.name },
    ],
    [column.control],
  );

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

  const handleEditColumn = (columnData) => {
    onSelectChild(columnData.label);
  };

  const handleCardFieldChange = (updatedField) => {
    const field = selectedChildColumn === 'Image' ? 'avatar' : selectedChildColumn.replace(' ', '').toLowerCase();
    const updated = {
      ...column,
      control: { ...column.control, [field]: updatedField || createCardField() },
    };
    if (!updatedField) {
      onSelectChild(null);
    }
    onChange(updated);
  };

  const handleWidthChange = (e) => {
    if (e.value === 'fixed') {
      const updated = { ...column, format: { ...column.format, width: e.value, widthFixed: 180 } };
      onChange(updated);
    } else {
      handleChildPropertyChange('format', 'width', e.value);
    }
  };

  // hide icon options until we have a use case for it
  // hide card click event until column click runtime requirement is defined
  return selectedChildColumn ? (
    <ColumnCardFieldSection
      cardField={selectedCardField || createCardField()}
      onChange={handleCardFieldChange}
      fieldList={fieldList}
      viewFriendlyName={viewFriendlyName}
      fieldName={selectedChildColumn}
    />
  ) : (
    <>
      <TextLine>Edit a column in the parent grid.</TextLine>
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
        {column.format.width === 'dynamic' && (
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
      </Accordion>

      <Accordion id='fields' caption='Fields' variant='left' open borderless>
        <Card
          id='preview-card'
          field1={{ name: 'field1', caption: 'Field 1', type: FieldTypeNames.Text }}
          field2={{ name: 'field2', caption: 'Field 2', type: FieldTypeNames.Text }}
          field3={{ name: 'field3', caption: 'Field 3', type: FieldTypeNames.Text }}
          field4={{ name: 'field4', caption: 'Field 4', type: FieldTypeNames.Text }}
          field5={{ name: 'field5', caption: 'Field 5', type: FieldTypeNames.Text }}
          field6={{ name: 'field6', caption: 'Field 6', type: FieldTypeNames.Text }}
          size='small'
          data={{
            field1: column.control.field1?.name,
            field2: column.control.field2?.name,
            field3: column.control.field3?.name,
            field4: column.control.field4?.name,
            field5: column.control.field5?.name,
            field6: column.control.field6?.name,
          }}
          hasAvatar
          style={{ border: `1px solid ${content.border}` }}
          tooltipId='editor-tooltip'
        />

        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          <Grid
            id='columns'
            hideCaption={false}
            searchable={false}
            showGoToPage={false}
            showPageSize={false}
            showReload={false}
            showHeader={false}
            addRowsEnabled={false}
            editable={false}
            columns={[
              {
                name: 'key',
                primary: true,
                caption: '',
                visible: false,
                editable: false,
                singleLine: true,
                fieldType: FieldTypeIds.Text,
                width: 'dynamic',
              },
              {
                name: 'label',
                primary: false,
                caption: '',
                visible: true,
                editable: false,
                singleLine: true,
                fieldType: FieldTypeIds.Text,
                width: 'dynamic',
              },
              {
                name: 'value',
                caption: '',
                visible: true,
                editable: false,
                singleLine: true,
                fieldType: FieldTypeIds.Text,
                columnAlign: 'right',
                width: 'dynamic',
              },
            ]}
            data={data}
            onRowClick={handleEditColumn}
            compact
            pageSize={50}
            pageNumber={1}
            totalRecords={data.length}
            hideRecordCount
            isPageData
            canDelete={false}
            responsive={false}
          />
        </Suspense>
      </Accordion>
      <s.SettingDivider />
    </>
  );
};

ColumnCardSection.propTypes = propTypes;
export default ColumnCardSection;
