import PropTypes from 'prop-types';

export const CountOfRecords = '__count_of__';

export const ChartValidationModel = PropTypes.shape({
  tableName: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.string),
});

export const primarySortValue = 'primary@chartBuilderSorting';
export const seriesSortValue = 'series_1@chartBuilderSorting';
export const legacySortValue = 'legacySortUsed';

export const sortOrderTypes = {
  MoneyAsc: 'Low \u2192 High',
  MoneyDesc: 'High \u2192 Low',
  IntegerAsc: '1 \u2192 9',
  IntegerDesc: '9 \u2192 1',
  DatetimeAsc: 'Old \u2192 New',
  DatetimeDesc: 'New \u2192 Old',
  DefaultAsc: 'A \u2192 Z',
  DefaultDesc: 'Z \u2192 A',
};

export const axisLabels = {
  xAxis: 'X axis',
  yAxis: 'Y axis',
  wedges: 'Wedges',
  values: 'Values',
};

export const ChartTypes = {
  Column: {
    value: 1,
    icon: 'mi-icon-bar-chart',
    label: 'Column',
  },
  Bar: {
    value: 0,
    icon: 'mi-icon-graph-bar-1',
    label: 'Bar',
  },
  Line: {
    value: 3,
    icon: 'mi-icon-graph-line-2',
    label: 'Line',
  },
  Area: {
    value: 6,
    icon: 'mi-icon-graph-line-4',
    label: 'Area',
  },
  Pie: {
    value: 4,
    icon: 'mi-icon-pie-chart',
    label: 'Pie',
  },
  Donut: {
    value: 7,
    icon: 'mi-icon-doughnut-chart',
    label: 'Donut',
  },
};