import React, { Suspense, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { ButtonRadioGroup } from '@m-next/radio-button';
import Dropdown from '@m-next/dropdown';
import { formatter } from '@m-next/utilities';
import { TextLine } from '@m-next/typeography';
import { FieldTypeNames, aggregateTypeIds, fieldTypeIdLookup } from '@m-next/types';
import * as s from './ChartBlockEditor.styles';
import Accordion from '../../../../components/accordion/Accordion';
import SeriesEditor from './SeriesEditor';
import {
  axisLabels,
  ChartTypes,
  ChartValidationModel,
  CountOfRecords,
  legacySortValue,
  primarySortValue,
  seriesSortValue,
  sortOrderTypes,
} from './types';
import InfoWrapper from '../../../../components/infowrapper/InfoWrapper';

const CriteriaEditor = React.lazy(() => import('@m-next/criteria-builder'));

// types
const propTypes = {
  id: PropTypes.string,
  tableName: PropTypes.string,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  rawFieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  tableList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      caption: PropTypes.string,
      aggregate: PropTypes.number,
      fieldType: PropTypes.number,
      dateGroupBy: PropTypes.number,
    }),
  ),
  onTableChange: PropTypes.func,
  onColumnChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  chartType: PropTypes.number,
  expression: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  filterId: PropTypes.string,
  validation: ChartValidationModel,
  expandAll: PropTypes.bool,
  sorting: PropTypes.arrayOf(
    PropTypes.shape({
      filterField: PropTypes.string,
      filterOrder: PropTypes.string, // 'asc' or 'desc'
    }),
  ),
  onSendAnalytics: PropTypes.func,
  onSortChange: PropTypes.func,
};

function DataTab({
  id,
  fieldList,
  rawFieldList,
  tableList,
  tableName,
  columns,
  onTableChange,
  onColumnChange,
  onFilterChange,
  chartType,
  expression,
  controlList,
  displayPreferences,
  filterId,
  validation,
  expandAll,
  sorting,
  onSendAnalytics,
  onSortChange,
}) {
  const [isValidExpression, setIsValidExpression] = useState(true);

  const handleTableChange = (field) => {
    if (field.value !== tableName) {
      onTableChange(field.value);
    }
  };

  const primaryColumn = useMemo(() => {
    if (columns && columns.length > 0) {
      const column = {
        value: columns[0].name,
        label: columns[0].name,
        aggregate: columns[0].aggregate,
        dateGroupBy: columns[0].dateGroupBy,
      };

      if (fieldList) {
        const match = fieldList.filter((x) => x.name === column.value);
        if (match !== null && match.length > 0) {
          column.label = match[0].caption;
          column.type = match[0].type;
        } 
      }
      if (!column.value) return null;
      return column;
    }
    return null;
  }, [columns, fieldList]);

  const selectedTable = useMemo(() => {
    if (tableName) {
      const column = {
        value: tableName,
        label: tableName,
      };

      if (tableList) {
        const match = tableList.filter((x) => x.name === column.value);
        if (match !== null && match.length > 0) {
          column.label = match[0].caption;
        }
      }
      return column;
    }
    return null;
  }, [tableList, tableName]);

  const seriesColumn = useMemo(() => {
    if (columns && columns.length > 0) {
      const column = {
        value: columns[1].name,
        label: columns[1].name,
        aggregate: columns[1].aggregate,
        groupLabel: columns[1].name,
      };

      if (column.aggregate === aggregateTypeIds.Count) {
        column.value = CountOfRecords;
        column.label = `Count of ${selectedTable?.label} records`;
        column.groupLabel = 'Count';
        column.type = FieldTypeNames.Integer;
      } else if (fieldList) {
        const match = fieldList.filter((x) => x.name === column.value);
        if (match !== null && match.length > 0) {
          column.label = ` ${match[0].caption} of ${selectedTable?.label}`;
          column.groupLabel = match[0].caption;
          column.type = match[0].type;
        } 
      }
      if (!column.value) return null;
      return column;
    }
    return null;
  }, [columns, fieldList, selectedTable?.label]);

  const handleXAxisFieldChange = (field) => {
    if (field.value !== primaryColumn?.value) {
      const delta = [...columns];

      const match = fieldList.filter((x) => x.name === field.value);
      if (match !== null && match.length > 0) {
        delta[0] = { ...match[0] };
        delta[0].caption = 'PrimaryColumn';
        delta[0].dateGroupBy = null;
        delta[0].fieldType = fieldTypeIdLookup(match.type);
        onColumnChange(delta);
      }
    }
  };

  const handleXAxisGroupByChange = (value) => {
    if (value !== primaryColumn?.dateGroupBy) {
      const delta = [...columns];
      delta[0] = { ...delta[0] };
      delta[0].dateGroupBy = value.value;
      onColumnChange(delta);
    }
  };

  const handleSeriesChange = (column) => {
    const delta = [...columns];
    let checkValue = column.name;
    if (column.value === CountOfRecords) {
      checkValue = 'RecordID';
    }

    const match = fieldList.filter((x) => x.name === checkValue);
    if (match !== null && match.length > 0) {
      delta[1] = { ...match[0] };
      delta[1].caption = columns[1].caption;
      delta[1].aggregate = column.aggregate;
      delta[1].fieldType = column.fieldType;
    }
    onColumnChange(delta);
  };

  const dateGroups = [
    {
      label: 'Day',
      value: 0,
    },
    {
      label: 'Month',
      value: 1,
    },
    {
      label: 'Year',
      value: 2,
    },
  ];
  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList, tableName, null, {}, {}),
    [fieldList, tableName],
  );

  const filteredFieldListOptions = useMemo(
    () =>
      formatter.formatFieldList(fieldList, tableName, null, {}, {}, [
        FieldTypeNames.Integer,
        FieldTypeNames.Decimal,
        FieldTypeNames.Money,
      ]),
    [fieldList, tableName],
  );

  const formattedTableList = useMemo(() => {
    if (!tableList) return null;
    const cleaned = [];
    tableList.forEach((item) => {
      cleaned.push({ value: item.name, label: item.caption });
    });

    return cleaned;
  }, [tableList]);

  const getYCaption = () => {
    if (chartType === ChartTypes.Bar.value) return axisLabels.xAxis;

    if (chartType === ChartTypes.Pie.value || chartType === ChartTypes.Donut.value) return axisLabels.values;
    return axisLabels.yAxis;
  };

  const getXCaption = () => {
    if (chartType === ChartTypes.Bar.value) return axisLabels.yAxis;

    if (chartType === ChartTypes.Pie.value || chartType === ChartTypes.Donut.value) return axisLabels.wedges;
    return axisLabels.xAxis;
  };

  const handleExpressionValidationChange = (valid) => {
    setIsValidExpression(valid);
  };

  const getSortOrderListFromType = (type) => {
    switch (type) {
      case FieldTypeNames.Money: {
        return [
          {
            value: 'asc',
            label: sortOrderTypes.MoneyAsc,
          },
          {
            value: 'desc',
            label: sortOrderTypes.MoneyDesc,
          },
        ];
      }
      case FieldTypeNames.Decimal:
      case FieldTypeNames.Integer: {
        return [
          {
            value: 'asc',
            label: sortOrderTypes.IntegerAsc,
          },
          {
            value: 'desc',
            label: sortOrderTypes.IntegerDesc,
          },
        ];
      }
      case FieldTypeNames.DateTime: {
        return [
          {
            value: 'asc',
            label: sortOrderTypes.DatetimeAsc,
          },
          {
            value: 'desc',
            label: sortOrderTypes.DatetimeDesc,
          },
        ];
      }
      default: {
        return [
          {
            value: 'asc',
            label: sortOrderTypes.DefaultAsc,
          },
          {
            value: 'desc',
            label: sortOrderTypes.DefaultDesc,
          },
        ];
      }
    }
  };

  const grabSortPrimaryColumnLabel = (passedChartType) => {
    let label = axisLabels.xAxis;
    if (passedChartType === ChartTypes.Bar.value) {
      label = axisLabels.yAxis;
    } else if (passedChartType === ChartTypes.Pie.value || passedChartType === ChartTypes.Donut.value) {
      label = axisLabels.wedges;
    }
    return label;
  };

  const grabSortSeriesColumnLabel = (passedChartType) => {
    let label = axisLabels.yAxis;
    if (passedChartType === ChartTypes.Bar.value) {
      label = axisLabels.xAxis;
    } else if (passedChartType === ChartTypes.Pie.value || passedChartType === ChartTypes.Donut.value) {
      label = axisLabels.values;
    }
    return label;
  };

  const [sortingList, sortingOption, sortingOrderList, sortingOrder] = useMemo(() => {
    if (primaryColumn && seriesColumn) {
      const setSortingList = [
        {
          value: primarySortValue,
          label: `${grabSortPrimaryColumnLabel(chartType)} (${primaryColumn.label.trim()})`,
        },
        {
          value: seriesSortValue,
          label: `${grabSortSeriesColumnLabel(chartType)} (${seriesColumn.label.trim()})`,
        },
      ];

      let setSortingOrderList = getSortOrderListFromType(primaryColumn.type);
      let setSortingOption = setSortingList[0];
      let setSortingOrder = setSortingOrderList[0];

      if (sorting && sorting.length > 0) {
        if (sorting[0].filterField === primarySortValue || sorting[0].filterField === primaryColumn.value) {
           
          setSortingOption = setSortingList[0];
          setSortingOrderList = getSortOrderListFromType(primaryColumn.type);
        } else if (sorting[0].filterField === seriesSortValue || sorting[0].filterField === seriesColumn.value) {
           
          setSortingOption = setSortingList[1];
          setSortingOrderList = getSortOrderListFromType(seriesColumn.type);
        } else if (sorting.length > 1) {
          const objectToAdd = {
            value: legacySortValue,
            label: 'Legacy Sort (Multi)',
          };
          setSortingOption = objectToAdd;
          setSortingList.push(objectToAdd);
        } else {
          const objectToAdd = {
            value: legacySortValue,
            label: `Legacy Sort (${sorting[0].filterField})`,
          };
          setSortingOption = objectToAdd;
          setSortingList.push(objectToAdd);
        }

        if (sorting[0].filterOrder === 'desc') {
           
          setSortingOrder = setSortingOrderList[1];
        } else {
           
          setSortingOrder = setSortingOrderList[0];
        }
      }

      return [setSortingList, setSortingOption, setSortingOrderList, setSortingOrder];
    }
    return [null, null, null, null];
  }, [primaryColumn, seriesColumn, sorting, chartType]);

  const handleSortChange = (field) => {
    if (field.value !== sorting[0].filterField && field.value !== legacySortValue) {
      onSortChange(field.value, sortingOrder.value);
    }
  };

  const handleSortOrderChange = (field) => {
    onSortChange(sortingOption.value, field.value);
  };

  const validTable = useMemo(() => !validation?.tableName, [validation?.tableName]);
  const validPrimary = useMemo(() => !validation?.columns[0], [validation?.columns]);
  const validSecondary = useMemo(() => !validation?.columns[1], [validation?.columns]);

  return (
    <s.Wrapper padding={16}>
      <Accordion
        id='table-wrapper'
        caption='Data source (Table)'
        subTitle={selectedTable?.label}
        isValid={validTable}
        open={expandAll}
      >
        <TextLine bold>What do you want to display?</TextLine>
        {!formattedTableList && <LoadingSkeleton count={1} height={24} style={{ marginBottom: 8 }} />}
        {formattedTableList && (
          <Dropdown
            id='chart-table'
            options={formattedTableList}
            value={selectedTable}
            caption='Table'
            isV4Design
            onChange={handleTableChange}
            style={{ zIndex: 5, marginBottom: 8 }}
            width='100%'
            required
            hasValidation={validTable}
            placeholder='Search table'
            validationMessage={validation?.tableName}
          />
        )}
      </Accordion>

      <Accordion
        id='y-axis'
        caption={getYCaption()}
        subTitle={seriesColumn?.label}
        isValid={validSecondary}
        open={expandAll}
      >
        {!tableName && (
          <InfoWrapper id='y-axis-info'>
            <TextLine>A data source must be selected before y axis can be configured.</TextLine>
          </InfoWrapper>
        )}
        {tableName && (
          <SeriesEditor
            fieldList={fieldList}
            formattedFieldList={filteredFieldListOptions}
            onChange={handleSeriesChange}
            seriesColumn={seriesColumn}
            tableName={selectedTable?.label}
            validation={validation}
          />
        )}
      </Accordion>
      <Accordion
        id='x-axis'
        caption={getXCaption()}
        subTitle={primaryColumn?.label}
        isValid={validPrimary}
        open={expandAll}
      >
        {seriesColumn?.groupLabel && (
          <TextLine bold>{`How do you want to group ${seriesColumn?.groupLabel} of ${tableName}?`}</TextLine>
        )}
        {!seriesColumn?.groupLabel && <TextLine bold>How do you want to group the X axis?</TextLine>}

        {!tableName && (
          <InfoWrapper id='x-asix-info'>
            <TextLine>A data source must be selected before x axis can be configured.</TextLine>
          </InfoWrapper>
        )}
        {tableName && !fieldList && <LoadingSkeleton count={1} height={24} style={{ marginBottom: 8 }} />}
        {fieldList && (
          <>
            <Dropdown
              id='x-axis-field'
              options={fieldListOptions}
              onChange={handleXAxisFieldChange}
              placeholder='Search field'
              dropdownStyle='multi-icon'
              isV4Design
              value={primaryColumn}
              required
              hasValidation={validPrimary}
              validationMessage={validation?.columns[0]}
              style={{ marginBottom: 8 }}
            />

            {primaryColumn?.type === FieldTypeNames.DateTime && (
              <ButtonRadioGroup
                id='x-axis-group-by'
                selectedValue={primaryColumn?.dateGroupBy}
                onChange={handleXAxisGroupByChange}
                options={dateGroups}
                caption='Group by'
                isOneLine
                buttonWidth={100}
              />
            )}
          </>
        )}
      </Accordion>

      <Accordion id='filter-criteria' caption='Filter criteria' isValid={isValidExpression} open={expandAll}>
        <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='60px' circle={false} duration={1.4} />}>
          <CriteriaEditor
            id='chart-expression'
            key={`${id}-${filterId}`}
            controlList={controlList}
            displayPreferences={displayPreferences}
            dataModelId={selectedTable?.label}
            expression={expression}
            filterId={`${id}-${filterId}`}
            fieldList={rawFieldList}
            onChange={onFilterChange}
            onUpdatedValidStatus={handleExpressionValidationChange}
            onSendAnalytics={onSendAnalytics}
          />
        </Suspense>
      </Accordion>

      <Accordion id='sorting-criteria' caption='Sorting' open={expandAll}>
        {(!primaryColumn || !seriesColumn) && (
          <InfoWrapper id='sorting-accordion-info'>
            <TextLine>An x axis and y axis must be selected before sorting can be configured.</TextLine>
          </InfoWrapper>
        )}
        {primaryColumn && seriesColumn && (
          <>
            {sorting && sorting.length > 1 && (
              <InfoWrapper id='sorting-info' header='Multi-Sort'>
                <TextLine>Currently the chart is sorted on multiple fields:</TextLine>
                <ul style={{ marginLeft: '30px' }}>
                  {sorting.map((item) => (
                    <li key={`${item.filterField}-${item.filterOrder}`}>
                      {item.filterField}, {item.filterOrder === 'asc' ? 'ascending' : 'descending'}
                    </li>
                  ))}
                </ul>
                <TextLine>If you want to continue sorting on multiple fields use the legacy chart builder</TextLine>
              </InfoWrapper>
            )}

            <TextLine bold>How would you like to sort the chart?</TextLine>

            <div style={{ display: 'flex' }}>
              <Dropdown
                id='sort-by-field'
                options={sortingList}
                value={sortingOption}
                caption='Sort By'
                isV4Design
                onChange={handleSortChange}
                style={{ zIndex: 5, marginBottom: 8, marginRight: 8, flex: 2 }}
                hasValidation={validTable}
              />
              <Dropdown
                id='sort-by-order'
                options={sortingOrderList}
                value={sortingOrder}
                isV4Design
                onChange={handleSortOrderChange}
                style={{ zIndex: 5, marginBottom: 8, flex: 1 }}
                hasValidation={validTable}
              />
            </div>
          </>
        )}
      </Accordion>
      <Tooltip id='my-tooltip' />
    </s.Wrapper>
  );
}

DataTab.propTypes = propTypes;
export default DataTab;
