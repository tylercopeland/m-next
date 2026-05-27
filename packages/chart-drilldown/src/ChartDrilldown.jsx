import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '@m-next/utilities';
import { FieldTypeIds, FieldTypeNames, Projection, Tag, fieldTypeIdLookup } from '@m-next/types';
import { EmptyFilterIcon } from '@m-next/svg-icon';
import { ChartExpandable } from '@m-next/chart';
import { Text } from '@m-next/typeography';
import Grid from '@m-next/grid';
import * as s from './chart.styles';

// types
const propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Object),
  error: PropTypes.instanceOf(Object),
  onRefetch: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  chartType: PropTypes.oneOf(['bar', 'column', 'column3d', 'line', 'pie', 'pie3d', 'area', 'donut']),
  caption: PropTypes.string,
  onPointClick: PropTypes.func,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  colors: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  dataPoints: PropTypes.bool,
  expanded: PropTypes.bool,
  anchorEl: PropTypes.string,
  expandedMargin: PropTypes.string,
  constrainOverlayToAnchor: PropTypes.bool,
  drilldown: PropTypes.shape({
    enabled: PropTypes.bool,
    projection: Projection,
    data: PropTypes.instanceOf(Object),
    totalRecords: PropTypes.number,
    isPartialCount: PropTypes.bool,
    onClickMany: PropTypes.func,
    onPageChange: PropTypes.func,
    onPageLengthChange: PropTypes.func,
    onRowClick: PropTypes.func,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    isLoading: PropTypes.bool,
    onSearch: PropTypes.func,
    onExport: PropTypes.func,
    showExport: PropTypes.bool,
    customEmptyMessage: PropTypes.string,
    tagsList: PropTypes.arrayOf(Tag),
    hasAdvancedSearch: PropTypes.bool,
    searchValue: PropTypes.string,
    onAdvancedSearchChange: PropTypes.func,
    advancedSearchExpression: PropTypes.instanceOf(Object),
  }),
  displayPreferences: PropTypes.instanceOf(Object),
  showClose: PropTypes.bool,
  enableForceSelect: PropTypes.bool,
  yAxisAllowDecimals: PropTypes.bool,
  numberFormat: PropTypes.string,
  onFetchChipsData: PropTypes.func,
  chipsData: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

function ChartDrilldown({
  id = '',
  isLoading = false,
  style = {},
  data = {},
  error,
  onRefetch,
  height = 200,
  width = 200,
  chartType,
  caption,
  onPointClick,
  onClick,
  onClose,
  colors,
  categories,
  xAxisLabel,
  yAxisLabel,
  dataPoints,
  expanded,
  anchorEl = 'body',
  expandedMargin,
  constrainOverlayToAnchor = false,
  drilldown,
  displayPreferences,
  showClose = true,
  enableForceSelect = true,
  yAxisAllowDecimals = true,
  numberFormat = null,
  onFetchChipsData = null,
  chipsData = null,
}) {
  const [forceSelect, setForceSelect] = useState(null);

  const handleClose = (e) => {
    setForceSelect(null);
    if (onClose) onClose(e);
  };

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  const handleSearch = (text) => {
    if (drilldown.onSearch) drilldown.onSearch(text);
  };

  const handleAdvancedSearch = (value) => {
    if (drilldown.onAdvancedSearchChange) drilldown.onAdvancedSearchChange(value);
  };

  const handlePointClick = (event) => {
    if (!expanded && enableForceSelect) {
      if (event.point.name !== undefined) {
        setForceSelect(event.point.selected ? null : event.point.name);
      } else {
        setForceSelect(event.point.selected ? null : event.point.category);
      }
    }
    if (onPointClick) onPointClick(event);
  };

  const errorFallback = () => (
    <s.EmptyWrapper>
      <strong>Unable to load chart</strong>
    </s.EmptyWrapper>
  );

  const columns = useMemo(() => {
    if (!drilldown.projection || !drilldown.projection.fields) return [];

    const cols = [];
    let recordIdExists = false;
    drilldown.projection.fields.forEach((field) => {
      let columnAlign = 'left';
      if (
        field.type === FieldTypeNames.Integer ||
        field.type === FieldTypeNames.Decimal ||
        field.type === FieldTypeNames.Money ||
        field.type === FieldTypeNames.Id
      ) {
        columnAlign = 'right';
      }
      cols.push({
        name: field.name,
        caption: field.caption,
        visible: true,
        editable: false,
        fieldType: fieldTypeIdLookup(field.type),
        columnAlign,
        width: field.type === FieldTypeNames.Text ? 'md' : 'sm',
        accessorProp: field.type === FieldTypeNames.DropDown ? 'text' : null,
        format: {
          dateType: 'Short Date',
          rounding: field.displayOptions?.decimalRounding,
        },
      });
      if (field.name === 'RecordID') {
        recordIdExists = true;
      }
    });

    if (!recordIdExists) {
      cols.push({
        name: 'RecordID',
        field: 'RecordID',
        caption: 'RecordID',
        visible: false,
        editable: false,
        width: 'sm',
        fieldType: FieldTypeIds.Integer,
      });
    }
    return cols;
  }, [drilldown.projection]);

  const render = () => {
    if (!drilldown.enabled)
      return (
        <ChartExpandable
          id={id}
          isLoading={isLoading}
          style={style}
          data={data}
          error={error}
          onRefetch={onRefetch}
          height={height}
          width={width}
          chartType={chartType}
          caption={caption}
          onPointClick={onPointClick}
          onClick={onClick}
          onClose={onClose}
          colors={colors}
          categories={categories}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          dataPoints={dataPoints}
          anchorEl={anchorEl}
          expandedMargin={expandedMargin}
          expanded={expanded}
          constrainOverlayToAnchor={constrainOverlayToAnchor}
          yAxisAllowDecimals={yAxisAllowDecimals}
          numberFormat={numberFormat}
        />
      );

    return (
      <ChartExpandable
        id={id}
        isLoading={isLoading}
        style={style}
        data={data}
        error={error}
        onRefetch={onRefetch}
        height={height}
        width={width}
        chartType={chartType}
        caption={caption}
        onPointClick={handlePointClick}
        onClick={handleClick}
        onClose={handleClose}
        colors={colors}
        categories={categories}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        dataPoints={dataPoints}
        anchorEl={anchorEl}
        expandedMargin={expandedMargin}
        expanded={expanded}
        constrainOverlayToAnchor={constrainOverlayToAnchor}
        showClose={showClose}
        forceSelect={forceSelect}
        yAxisAllowDecimals={yAxisAllowDecimals}
        numberFormat={numberFormat}
      >
        {(!drilldown.projection || !drilldown.projection.fields || drilldown.projection.fields.length === 0) && (
          <s.EmptyState>
            <EmptyFilterIcon height={80} width={120} />
            <Text bold>
              {drilldown.customEmptyMessage
                ? drilldown.customEmptyMessage
                : 'No columns have been selected please add columns to start displaying drill down table'}
            </Text>
          </s.EmptyState>
        )}
        {drilldown.projection && drilldown.projection.fields && drilldown.projection.fields.length > 0 && (
          <Grid
            id={`${id}-drilldown`}
            columns={columns}
            editable={false}
            isLoading={drilldown.isLoading}
            data={drilldown.data}
            totalRecords={drilldown.totalRecords}
            isPartialCount={drilldown.isPartialCount}
            onClickMany={drilldown.onClickMany}
            onPageChange={drilldown.onPageChange}
            onPageLengthChange={drilldown.onPageLengthChange}
            onGridSearch={handleSearch}
            onExport={drilldown.onExport}
            pageNumber={drilldown.pageNumber}
            pageSize={drilldown.pageSize}
            primaryKeyName='RecordID'
            isPageData
            displayPreferences={displayPreferences}
            compact
            showExport={drilldown.showExport}
            showReload={false}
            onRowClick={drilldown.onRowClick}
            searchValue={drilldown.searchValue}
            tagsList={drilldown.tagsList}
            hasAdvancedSearch={drilldown.hasAdvancedSearch}
            advancedSearchExpression={drilldown.advancedSearchExpression}
            onAdvancedSearchChange={handleAdvancedSearch}
            defaultAdvancedSearch={!!drilldown.hasAdvancedSearch}
            onFetchChipsData={onFetchChipsData}
            chipsData={chipsData}
          />
        )}
        <div style={{ height: 8 }} />
      </ChartExpandable>
    );
  };

  return <ErrorBoundary fallback={errorFallback()}>{render()}</ErrorBoundary>;
}

ChartDrilldown.propTypes = propTypes;
export default ChartDrilldown;
