import React, { Suspense, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { colors } from '@m-next/styles';
import { FieldTypeIds, aggregateTypeIds, basicOperationId, complexValueTypes, fieldTypeIdLookup } from '@m-next/types';
import {parseExpression} from '@m-next/criteria-builder';
import {
  selectControls,
  selectActiveRecordId,
  selectSelectedControlId,
  selectSelectedControlProperty,
} from '../../../common/services/screenLayoutSlice';
import * as s from './designerWrapper.styles';
import { selectScreenId } from '../../../common/services/appSlice';
import {
  useGetChartDataLegacyQuery,
  useGetGridDataLegacyQuery,
  useGetChipsDataLegacyQuery,
  useGetTotalGridRecordsLegacyMutation,
} from '../../../common/services/runtimeApi';
import validateChart from '../validation/validateChart';
import DesignerComponentWrapper from './designerComponentWrapper';
import validateExpression from '../validation/validateExpression';
import { selectAccountName, selectDisplayPreferences } from '../../../common/services/sessionSlice';
import { useGetTagSuggestionsQuery } from '../../../common/services/tagsApi';

const ChartDrilldown = React.lazy(() => import('@m-next/chart-drilldown'));

// types
const propTypes = {
  id: PropTypes.string,
  onControlClick: PropTypes.func,
  containerWidth: PropTypes.number,
};

const chartTypes = {
  0: 'bar',
  1: 'column',
  2: 'column3d',
  3: 'line',
  4: 'pie',
  5: 'pie3d',
  6: 'area',
  7: 'donut',
};

const v3Colors = {
  pink: '#DF3261',
  blue: '#5D9DD5',
  aqua: '#6AC6B7',
  purple: '#955BA5',
  green: '#4FBA6F',
  yellow: '#FED204',
  orange: '#F99C23',
  red: '#E43C38',
};

const monthNumbers = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
};

function ChartDesignerWrapper({ id, onControlClick, containerWidth }) {
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);
  const selectedControlId = useSelector(selectSelectedControlId);
  const selectedControlProperty = useSelector(selectSelectedControlProperty);
  const control = useSelector((state) => selectControls(state)[id]);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const accountName = useSelector(selectAccountName);
  const [currentSeries, setCurrentSeries] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [gridData, setGridData] = useState(null);
  const [partialRecordCount, setPartialRecordCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasTotalRecord, setHasTotalRecord] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchString, setSearchString] = useState(null);
  const [gridIsLoading, setGridIsLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const [getTotalGridRecords] = useGetTotalGridRecordsLegacyMutation();
  const { data: tagList, isLoading: isLoadingTagList } = useGetTagSuggestionsQuery({ accountName });

  // Helper function to validate if control model has all required properties
  const isValidChartModel = (control) => !!(
      control?.model &&
      control.model.viewFilter &&
      control.model.viewFilter.expression &&
      Array.isArray(control.model.viewFilter.expression)
    );

  const isValid = useMemo(() => {
    if (!control || !isValidChartModel(control)) return false;
    if (control.isEditing) return true;

    const expression = parseExpression(control.model.viewFilter.expression);
    return validateChart(control).isValid && validateExpression(expression).isValid;
  }, [control]);

  const expanded = useMemo(
    () => control && control.model && control.model.drilldownEnabled && selectedControlId === control.id && selectedControlProperty === 'drilldown',
    [control, selectedControlId, selectedControlProperty],
  );

  useEffect(() => {
    if (!expanded) {
      setSearchString(null);
      setGridData(null);
      setGridIsLoading(true);
      setSelectedPoint(null);
      setPageNumber(1);
    }
  }, [expanded]);

  const numberFormat = useMemo(() => {
    if (
      !control?.model?.columns || 
      control.model.columns.length === 0 ||
      !control.model.columns[1] ||
      control.model.columns[1].aggregate === aggregateTypeIds.Count ||
      control.model.columns[1].fieldType === FieldTypeIds.Integer
    ) {
      return 'integer';
    }
    if (control.model.columns[1].fieldType === FieldTypeIds.Decimal) {
      return 'decimal';
    }
    if (control.model.columns[1].fieldType === FieldTypeIds.Money) {
      return 'currency';
    }
    return null;
  }, [control]);

  const allowDecimals = useMemo(
    () =>
      control?.model?.columns?.length > 0 &&
      control.model.columns[1] &&
      control.model.columns[1].aggregate !== aggregateTypeIds.Count &&
      (control.model.columns[1].fieldType === FieldTypeIds.Decimal ||
        control.model.columns[1].fieldType === FieldTypeIds.Money),
    [control],
  );

  const transformedProjection = useMemo(() => {
    const cols = [];
    if (!control || !control.model || !control.model.drilldownProjection || !control.model.drilldownProjection.fields)
      return [];
    let recordIdExists = false;

    control.model.drilldownProjection.fields.forEach((field) => {
      cols.push({
        name: field.name,
        field: field.name,
        caption: field.caption,
        visible: true,
        editable: false,
        fieldType: fieldTypeIdLookup(field.type),
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
        fieldType: FieldTypeIds.Integer,
      });
    }
    return cols;
  }, [control]);

  const gridModel = useMemo(() => {
    if (
      !control ||
      !control.model ||
      !control.model.drilldownProjection ||
      !control.model.drilldownProjection.fields ||
      control.model.drilldownProjection.fields.length === 0
    ) {
      return null;
    }

    const buildDateFilter = (filter, datePart, dateField) => {
      if (!control.model.columns || !control.model.columns[0]) return;
      
      filter.push({
        operation: null,
        dateField: null,
        source: {
          Value: control.model.columns[0].name,
          ValueType: complexValueTypes.Field,
          Property: null,
          ChildProperty: null,
        },
      });
      filter.push({ operation: basicOperationId.Is, dateField, source: null });
      filter.push({
        operation: null,
        dateField: null,
        source: {
          Value: datePart,
          ValueType: complexValueTypes.Text,
          Property: null,
          ChildProperty: null,
        },
      });
    };

    const filter = [...control.model.viewFilter.expression];

    if (selectedPoint !== null && filter.length > 0) {
      filter.push({ operation: basicOperationId.And, dateField: null, source: null });
    }
    if (selectedPoint === '' && control.model.columns && control.model.columns[0]) {
      filter.push({
        operation: null,
        dateField: null,
        source: {
          Value: control.model.columns[0].name,
          ValueType: complexValueTypes.Field,
          Property: null,
          ChildProperty: null,
        },
      });
      filter.push({ operation: basicOperationId.IsEmpty, dateField: null, source: null });
    } else if (selectedPoint !== null && control.model.columns && control.model.columns[0] && control.model.columns[0].dateGroupBy === 2) {
      buildDateFilter(filter, selectedPoint, 4);
    } else if (selectedPoint !== null && control.model.columns && control.model.columns[0] && control.model.columns[0].dateGroupBy === 1) {
      const dateParts = selectedPoint.replace('.', '').split('-');
      buildDateFilter(filter, dateParts[0], 4);
      filter.push({ operation: basicOperationId.And, dateField: null, source: null });
      buildDateFilter(filter, monthNumbers[dateParts[1]], 3);
    } else if (selectedPoint !== null && control.model.columns && control.model.columns[0] && control.model.columns[0].dateGroupBy === 0) {
      const dateParts = selectedPoint.replace('.', '').split('-');
      buildDateFilter(filter, dateParts[0], 4);
      filter.push({ operation: basicOperationId.And, dateField: null, source: null });
      buildDateFilter(filter, monthNumbers[dateParts[1]], 3);
      filter.push({ operation: basicOperationId.And, dateField: null, source: null });
      buildDateFilter(filter, Number(dateParts[2]), 2);
    } else if (selectedPoint !== null && control.model.columns && control.model.columns[0]) {
      filter.push({
        operation: null,
        dateField: null,
        source: {
          Value: control.model.columns[0].name,
          ValueType: complexValueTypes.Field,
          Property: null,
          ChildProperty: null,
        },
      });
      filter.push({ operation: basicOperationId.Is, dateField: null, source: null });
      filter.push({
        operation: null,
        dateField: null,
        source: {
          Value: selectedPoint,
          ValueType: complexValueTypes.Text,
          Property: null,
          ChildProperty: null,
        },
      });
    }

    const sorting =
      control &&
      control.model &&
      control.model.drilldownProjection &&
      control.model.drilldownProjection.sorting &&
      control.model.drilldownProjection.sorting.length > 0
        ? control.model.drilldownProjection.sorting[0]
        : null;

    const model = {
      id: control.id,
      type: 'EDT',
      viewFriendlyName: control.model.viewName,
      defaultViewFilter: control.model.viewFilter.filterId,
      viewFilter: control.model.viewFilter.filterId,
      viewList: [
        {
          id: control.model.viewFilter.filterId,
          name: 'Drilldown',
          columns: [],
          filtering: filter,
        },
      ],
      paging: {
        pageNumber,
        pageSize,
      },
      columns: transformedProjection,
      searchString,
      sorting,
    };
    let recordIdExists = false;

    control.model.drilldownProjection.fields.forEach((field) => {
      model.viewList[0].columns.push({
        field: field.name,
        visible: true,
      });

      if (field.name === 'RecordID') {
        recordIdExists = true;
      }
    });

    if (!recordIdExists) {
      model.viewList[0].columns.push({
        field: 'RecordID',
        visible: false,
      });
    }

    return model;
  }, [control, pageNumber, pageSize, searchString, selectedPoint, transformedProjection]);

  const { data, error, isLoading } = useGetChartDataLegacyQuery(
    {
      id: control.id,
      screenId,
      activeRecordId,
      body: {
        model: control?.model,
      },
    },
    { skip: !control || !isValid || control.isEditing, refetchOnMountOrArgChange: true },
  );

  const { isFetching: gridFetching, data: rawGridData } = useGetGridDataLegacyQuery(
    {
      id: control?.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model: gridModel,
      },
    },
    { refetchOnMountOrArgChange: 1, skip: !control || !isValid || !expanded || !gridModel },
  );

  useEffect(() => {
    if (gridFetching) {
      setGridIsLoading(true);
    }
    if (rawGridData && !gridFetching) {
      const cleanData = [];

      if (!hasTotalRecord) {
        setPartialRecordCount(rawGridData.partialRowCount);
        setTotalRecords(rawGridData.totalRows);
      }

      rawGridData.dataSource.forEach((element) => {
        const rowData = {};
        const rowErrorData = {};
        element.cells.forEach((cell) => {
          const col = transformedProjection.filter((x) => x.name === cell.name)[0];
          if (col) {
            switch (col.fieldType) {
              case FieldTypeIds.DropDown:
                rowData[cell.name] = { text: cell.text, value: cell.value };
                break;
              default:
                rowData[cell.name] = cell.value;
                break;
            }

            if (cell.validationError) {
              rowErrorData[cell.name] = cell.validationError;
            }
          }
        });
        cleanData.push(rowData);
      });
      setGridData(cleanData);
      setGridIsLoading(false);
    }
  }, [
    rawGridData,
    control.viewList,
    control.viewFilter,
    control.columns,
    gridFetching,
    hasTotalRecord,
    transformedProjection,
  ]);

  const categories = useMemo(() => {
    if (!isLoading && !error && (data === null || data === undefined)) return currentCategory;
    if (isLoading || error || data === null || data === undefined) return null;

    setCurrentCategory(data.categories);
    return data.categories;
  }, [currentCategory, data, error, isLoading]);

  const series = useMemo(() => {
    if (!isLoading && !error && (data === null || data === undefined)) return currentSeries;
    if (isLoading || error || data === null || data === undefined) return null;
    setCurrentSeries(data.series);
    return data.series;
  }, [currentSeries, data, error, isLoading]);

  const [currentChartType, setCurrentChartType] = useState(chartTypes[control?.model?.chart]);
  const [refreshChart, setRefreshChart] = useState(false);

  useEffect(() => {
    setCurrentChartType(null);
    setTimeout(() => {
      setCurrentChartType(chartTypes[control?.model?.chart]);
    }, 100);
  }, [control?.model?.chart]);

  const chartColors = useMemo(() => {
    let result = null;
    if (control && control.model && control.model.colors) {
      // set hex codes to uppercase
      result = [control.model.colors.length];
      for (let i = 0; i < control.model.colors.length; i++) {
        result[i] = control.model.colors[i].toUpperCase();
      }

      // check if color list contains a v3 color
      const v3ColorsList = [
        v3Colors.pink,
        v3Colors.blue,
        v3Colors.aqua,
        v3Colors.purple,
        v3Colors.green,
        v3Colors.yellow,
        v3Colors.orange,
        v3Colors.red,
      ];
      const isV3ColorPresent = result.some((x) => v3ColorsList.indexOf(x) >= 0);

      // map v3 colors to v4 color palette if applicable
      if (isV3ColorPresent) {
        for (let i = 0; i < result.length; i++) {
          switch (result[i]) {
            case v3Colors.pink:
              result[i] = colors['fuchsia'];
              break;
            case v3Colors.blue:
              result[i] = colors['blue'];
              break;
            case v3Colors.aqua:
              result[i] = colors['teal'];
              break;
            case v3Colors.purple:
              result[i] = colors['purple'];
              break;
            case v3Colors.green:
              result[i] = colors['green'];
              break;
            case v3Colors.yellow:
              result[i] = colors['yellow'];
              break;
            case v3Colors.orange:
              result[i] = colors['orange'];
              break;
            case v3Colors.red:
              result[i] = colors['red'];
              break;
            default:
              break;
          }
        }
      }
    }

    return result;
  }, [control]);

  useEffect(() => {
    setRefreshChart(true);
    setTimeout(() => {
      setRefreshChart(false);
    }, 50);
  }, [chartColors, containerWidth]);

  const handleGridClickMany = async () => {
    const result = await getTotalGridRecords({
      id: control?.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model: gridModel,
      },
    }).unwrap();
    setHasTotalRecord(true);
    setTotalRecords(result);
  };

  const handleGridPageChange = (e) => {
    setPageNumber(e);
    setGridIsLoading(true);
  };

  const handleGridPageLengthChange = (e) => {
    setPageSize(Number(e));
    setGridIsLoading(true);
  };

  const handleSearch = (e) => {
    setSearchString(e);
    setPageNumber(1);
    setGridIsLoading(true);
    setHasTotalRecord(false);
  };

  const handlePointClick = (event) => {
    if (event.point.name !== undefined) {
      setSelectedPoint(event.point.selected ? null : event.point.name);
    } else {
      setSelectedPoint(event.point.selected ? null : event.point.category);
    }
    setGridIsLoading(true);
    setHasTotalRecord(false);
    setSearchString(null);
  };

  const handleClick = () => {
    setSelectedPoint(null);
    setGridIsLoading(true);
    setHasTotalRecord(false);
  };

  const width = useMemo(
    () => (control.widthType === 'fixed' ? Number(control.width.replace('px', '')) : '100%'),
    [control?.widthType, control?.width],
  );

  const [chipsData, setChipsData] = useState(null);
  const [chipsDataQueryParams, setChipsDataQueryParams] = useState({ field: null, searchString: null });
  const legacyChipsData = useGetChipsDataLegacyQuery(
    {
      id: control?.id,
      screenId,
      activeRecordId,
      body: {
        field: chipsDataQueryParams.field,
        screenState: null,
        model: {
          ...gridModel,
          searchString: chipsDataQueryParams.searchString,
      },
    },
    },
    {
      skip: chipsDataQueryParams.field === null || chipsDataQueryParams.searchString === null || !isValid,
      refetchOnMountOrArgChange: true,
    },
  );

  const handleFetchChipsData = (field, value) => {
    setChipsDataQueryParams({ field, searchString: value });
  };

  useEffect(()=>{
    if (Array.isArray(legacyChipsData.data?.dataSource)) setChipsData(legacyChipsData.data.dataSource);
  },[legacyChipsData]);

  return (
    <DesignerComponentWrapper 
      id={id} 
      onControlClick={onControlClick} 
      isValid={isValid} 
      width={width === '100%' ? `calc(${width} - 16px)` : width}
    >
      {(!control || !control.model || !control.model.columns || control.model.columns.length === 0) && (
        <s.EmptyWrapper id={`${id}-no-fields`} style={{ maxWidth: containerWidth }}>
          <strong>Chart not configured</strong>
          <span>To configure select this object and add fields from the right panel.</span>
        </s.EmptyWrapper>
      )}
      {!isValid && control && control.model && control.model.columns && control.model.columns.length > 0 && (
        <s.EmptyWrapper id={`${id}-no-fields`} style={{ maxWidth: containerWidth }}>
          <strong>Chart not configured</strong>
          <span>To configure select this object and add fields from the right panel.</span>
        </s.EmptyWrapper>
      )}
      {isValid && control && control.model && control.model.columns && control.model.columns.length > 0 && (
        <Suspense fallback={<LoadingSkeleton count={1} height={control.height} />}>
          <ChartDrilldown
            id={id}
            caption={control.hideCaption ? null : control.caption}
            data={series}
            isLoading={currentChartType === null || isLoading || refreshChart}
            error={error}
            style={{ cursor: 'pointer' }}
            //  onRefetch={handleRefetch}
            dataPoints={control.model.dataPoints}
            xAxisLabel={control.model.labels.primary}
            yAxisLabel={control.model.labels.secondary}
            height={control.height}
            width={width}
            chartType={currentChartType}
            categories={categories}
            colors={chartColors}
            onPointClick={handlePointClick}
            onClick={handleClick}
            enableForceSelect={false}
            drilldown={{
              enabled: control.model.drilldownEnabled,
              projection: control.model.drilldownProjection,
              data: gridData,
              totalRecords: totalRecords === 0 && partialRecordCount > 0 ? partialRecordCount : totalRecords,
              isPartialCount: totalRecords === 0 && partialRecordCount > 0,
              onClickMany: handleGridClickMany,
              onPageChange: handleGridPageChange,
              onPageLengthChange: handleGridPageLengthChange,
              onSearch: handleSearch,
              pageNumber,
              pageSize,
              isLoading: gridIsLoading,
              showExport: false,
              tagsList: isLoadingTagList ? null : tagList?.others,
              hasAdvancedSearch: true,
              searchValue: searchString,
            }}
            showClose={false}
            anchorEl='#canvas-wrapper'
            expanded={expanded}
            expandedMargin='70px 380px 0px 0px'
            displayPreferences={displayPreferences}
            yAxisAllowDecimals={allowDecimals}
            numberFormat={numberFormat}
            onFetchChipsData={handleFetchChipsData}
            chipsData={chipsData}
          />
        </Suspense>
      )}
    </DesignerComponentWrapper>
  );
}

ChartDesignerWrapper.propTypes = propTypes;
export default ChartDesignerWrapper;
