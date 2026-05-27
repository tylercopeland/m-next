import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Chart-specific data interface
export interface ChartControlData {
  chartType?: string | null;
  dataSource?: string | null;
  xAxis?: string | null;
  yAxis?: string | null;
  title?: string | null;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[] | null;
  height?: number | null;
}

// Complete chart control interface
export interface ChartControl extends BaseControl {
  type: string;
  chartType?: string | null;
  dataSource?: string | null;
  xAxis?: string | null;
  yAxis?: string | null;
  title?: string | null;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[] | null;
  height?: number | null;
  componentVersion?: string | null;
}

// Factory function to create chart control
export const createChartControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Chart',
    classes: '',
    name: 'chart',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: ChartControlData = {
    chartType: 'bar',
    dataSource: null,
    xAxis: null,
    yAxis: null,
    title: null,
    showLegend: true,
    showGrid: true,
    colors: null,
    height: 300,
  },
): ChartControl => ({
  ...createBaseControl(base),
  type: WIDGETS.CHART,
  chartType: data.chartType || 'bar',
  dataSource: data.dataSource || null,
  xAxis: data.xAxis || null,
  yAxis: data.yAxis || null,
  title: data.title || null,
  showLegend: data.showLegend !== undefined ? data.showLegend : true,
  showGrid: data.showGrid !== undefined ? data.showGrid : true,
  colors: data.colors || null,
  height: data.height || 300,
});

// Type guard function
export const isChartControl = (control: unknown): control is ChartControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.CHART
  );
};

export default createChartControl;
