/**
 * Chart constants and mappings
 */

import type { ChartTypes, V3Colors, MonthNumbers } from '../types';

/**
 * Chart type mapping from numeric ID to string type
 */
export const chartTypes: ChartTypes = {
  0: 'bar',
  1: 'column',
  2: 'column3d',
  3: 'line',
  4: 'pie',
  5: 'pie3d',
  6: 'area',
  7: 'donut',
};

/**
 * V3 color palette (legacy colors)
 */
export const v3Colors: V3Colors = {
  pink: '#DF3261',
  blue: '#5D9DD5',
  aqua: '#6AC6B7',
  purple: '#955BA5',
  green: '#4FBA6F',
  yellow: '#FED204',
  orange: '#F99C23',
  red: '#E43C38',
};

/**
 * Month number to month name mapping
 */
export const monthNumbers: MonthNumbers = {
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
