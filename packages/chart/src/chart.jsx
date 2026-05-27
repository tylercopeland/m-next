/* eslint-disable react/no-this-in-sfc */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import Button from '@m-next/button';
import { ErrorBoundary } from '@m-next/utilities';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styled from '@emotion/styled';
import Typeography from '@m-next/typeography';
import { EmptyFilterIcon } from '@m-next/svg-icon';

require('highcharts/modules/no-data-to-display')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

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
  colors: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  dataPoints: PropTypes.bool,
  forceSelect: PropTypes.string,
  yAxisAllowDecimals: PropTypes.bool,
  numberFormat: PropTypes.string,
  /** When false, disables the Highcharts accessibility module (avoids a11y mock points that can break pie rendering in modals). */
  accessibilityEnabled: PropTypes.bool,
};

const EmptyWrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
]);

const circlularSizes = {
  small: '60%',
  large: '90%',
  innerSmall: '35%',
  innerLarge: '45%',
};

function Chart({
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
  colors,
  categories,
  xAxisLabel,
  yAxisLabel,
  dataPoints,
  forceSelect,
  yAxisAllowDecimals = true,
  numberFormat,
  accessibilityEnabled = true,
}) {
  const nonNullcolors = colors || [
    '#0D71C8',
    '#001e56',
    '#00376f',
    '#022266',
    '#022266',
    '#064499',
    '#B3E5FF',
    '#E5F7FF',
    '#E5F7FF',
    '#c3ffff',
    '#dcffff',
  ];
  const [chartOptions, setChartOptions] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    setIsSelected(false);
  }, [chartType, isLoading]);

  useEffect(() => {
    if (isSelected) setSelectedColor(colors[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  useEffect(() => {
    if (chartInstance && chartInstance.series && chartInstance.series.length > 0 && chartInstance.series[0].data) {
      chartInstance.series[0].data.forEach((element) => {
        let selected = false;
        if (element.name !== undefined && element.name === forceSelect) {
          selected = true;
        } else if (element.category !== undefined && element.category === forceSelect) {
          selected = true;
        }
        if (selected) {
          element.select(true, false);
          setSelectedColor(element.color);
          setIsSelected(true);
        }
        if (!forceSelect) {
          element.select(false, false);
        }
      });
      if (!forceSelect) {
        setIsSelected(false);
      }
    } else {
      setIsSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSelect]);

  const handleClick = (event) => {
    setIsSelected(false);
    if (onClick) onClick(event);
  };

  const handlePointClick = (event) => {
    setIsSelected(!event.point.selected);
    setSelectedColor(event.point.color);
    if (onPointClick) onPointClick(event);
  };

  const chartData = useMemo(() => {
    if (chartType === 'pie' || chartType === 'pie3d' || chartType === 'donut') {
      if (data !== undefined && data !== null && data.length > 0) {
        const circularData = [];
        const seriesData = data[0].data;

        if (categories && seriesData) {
          for (let i = 0; i < categories.length; i++) {
            const raw = seriesData[i];
            const y = typeof raw === 'object' && raw !== null && 'y' in raw ? raw.y : raw;
            circularData.push([categories[i], y]);
          }
        }

        let innerSize = null;
        if (chartType === 'donut') {
          innerSize = dataPoints ? circlularSizes.innerSmall : circlularSizes.innerLarge;
        }

        return [
          {
            type: 'pie',
            name: data[0].name,
            data: circularData,
            size: dataPoints ? circlularSizes.small : circlularSizes.large,
            innerSize,
          },
        ];
      }
    }
    return data;
  }, [chartType, data, categories, dataPoints]);

  const formatNumber = (number) => {
    if (yAxisAllowDecimals) {
      return Number(number).toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    if (numberFormat === 'integer') {
      return Number(number).toLocaleString('en-US');
    }

    return number;
  };

  useEffect(() => {
    let options3d = null;
    let currentChartType = chartType || 'column';
    if (chartType === 'pie3d') {
      currentChartType = 'pie';
    }
    if (chartType === 'column3d') {
      currentChartType = 'column';
    }
    if (chartType === 'donut') {
      currentChartType = 'pie';
    }

    if (chartType === 'pie3d') {
      options3d = {
        enabled: true,
        alpha: 45,
        beta: 0,
      };
    }
    if (chartType === 'column3d') {
      options3d = {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      };
    }

    setChartOptions({
      accessibility: {
        enabled: accessibilityEnabled,
      },
      chart: {
        type: currentChartType,
        events: {
          click: handleClick,
        },
        numberFormatter: formatNumber,
        options3d,
        height,
        scrollablePlotArea: {
          minWidth: typeof width === 'string' && width.includes('%') ? null : 320,
          scrollPositionX: 1,
        },
      },
      colors: nonNullcolors,
      loading: {
        style: {
          opacity: 1,
          backgroundColor: 'rgba(255,255,255,0.4)',
        },
        labelStyle: {
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          textTransform: 'uppercase',
          lineHeight: '100px',
          color: '#aaa',
          top: '30%',
        },
      },
      title: {
        text: caption,
      },
      xAxis: {
        categories, // columns
        title: {
          text:
            currentChartType === 'pie' || currentChartType === 'pie3d' || currentChartType === 'donut'
              ? null
              : xAxisLabel,
          style: {
            fontWeight: 'bold',
          },
        },
      },
      yAxis: {
        title: {
          text:
            currentChartType === 'pie' || currentChartType === 'pie3d' || currentChartType === 'donut'
              ? null
              : yAxisLabel,
          style: {
            fontWeight: 'bold',
          },
        },
        allowDecimals: yAxisAllowDecimals,
      },
      tooltip: {
        enabled: true,
        style: {
          zIndex: 2000,
        },
        formatter() {
          let value = this.y;
          if (yAxisAllowDecimals) {
            value = Number(this.y).toLocaleString('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          } else if (numberFormat === 'integer') {
            value = Number(this.y).toLocaleString('en-US');
          }
          return `${this.x !== undefined ? this.x : this.key}<br/><tspan style="color: ${this.point.color}; fill: ${
            this.series.color
          };">●</tspan> ${this.series.name !== undefined ? this.series.name : this.series.category}:<b>${value}</b>`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: dataPoints,
            format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            },
          },
        },
        bar: {
          allowPointSelect: true,
          dataLabels: {
            enabled: dataPoints,
            format: yAxisAllowDecimals ? '{point.y:.2f}' : null,
          },
        },
        column: {
          allowPointSelect: true,
          dataLabels: {
            enabled: dataPoints,
            format: yAxisAllowDecimals ? '{point.y:.2f}' : null,
          },
        },
        line: {
          allowPointSelect: true,
          dataLabels: {
            enabled: dataPoints,
            format: yAxisAllowDecimals ? '{point.y:.2f}' : null,
          },
          states: {
            select: {
              enabled: true,
              attributes: {
                'stroke-width': 12,
                'stroke-opacity': 0.25,
              },
            },
          },
        },
        area: {
          allowPointSelect: true,
          dataLabels: {
            enabled: dataPoints,
            format: yAxisAllowDecimals ? '{point.y:.2f}' : null,
          },
          states: {
            select: {
              enabled: true,
              attributes: {
                'stroke-width': 12,
                'stroke-opacity': 0.25,
              },
            },
          },
        },
        series: {
          allowPointSelect: true,
          cursor: 'pointer',

          states: {
            hover: {
              enabled: false,
            },
          },
          point: {
            events: {
              click: handlePointClick,
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: chartData,
      lang: {
        thousandsSep: ',',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, chartType, xAxisLabel, yAxisLabel, categories, caption, height, dataPoints, accessibilityEnabled]);

  const chartHeight = useMemo(() => {
    let currentHeight = height;

    if (height === null || height === undefined || height === '') {
      currentHeight = '0px';
    }

    if (typeof currentHeight === 'number' || (!currentHeight.includes('px') && !currentHeight.includes('%'))) {
      currentHeight = `${currentHeight}px`;
    }
    return currentHeight;
  }, [height]);

  const registerCallback = (chart) => {
    setChartInstance(chart);
    if (!isSelected && chart && chart.series && chart.series.length > 0 && chart.series[0].data) {
      chart.series[0].data.forEach((element) => {
        element.select(false, false);
      });
    }

    if (!isSelected && chart && chart.series && chart.series.length > 0 && chart.series[0].data) {
      chart.series[0].data.forEach((element) => {
        let selected = false;
        if (element.name !== undefined && element.name === forceSelect) {
          selected = true;
        } else if (element.category !== undefined && element.category === forceSelect) {
          selected = true;
        }
        if (selected) {
          element.select(true, false);
          setSelectedColor(element.color);
          setIsSelected(true);
        }
      });
    }
  };

  const renderContent = () => {
    if (error) {
      if (chartOptions && (!chartOptions.series || chartOptions.series.length === 0 || !chartOptions.series[0].data)) {
        return (
          <EmptyWrapper>
            <EmptyFilterIcon height={80} width={120} />
            <Typeography fontSize='medium' variant='h4'>
              Unable to load chart
            </Typeography>
            <Typeography fontSize='medium' variant='body1'>
              Please verify the chart configuration settings
            </Typeography>
          </EmptyWrapper>
        );
      }

      return (
        <EmptyWrapper>
          <strong>Unable to load chart</strong>
          <Button id={`${id}-chart-refetch`} value='Try again' onClick={onRefetch} buttonStyle='link' />
        </EmptyWrapper>
      );
    }

    if (isLoading) {
      return <LoadingSkeleton count={1} height={chartHeight} />;
    }

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} callback={registerCallback} />;
  };

  const errorFallback = () => (
    <EmptyWrapper>
      <strong>Unable to load chart</strong>
    </EmptyWrapper>
  );

  return (
    <ErrorBoundary fallback={errorFallback()}>
      <Container
        id={`${id}-chart`}
        style={{ ...style, padding: 0 }}
        css={{
          '.highcharts-point': {
            filter: `opacity(${isSelected && chartType !== 'pie' && chartType !== 'donut' ? 0.25 : 1})`,
          },
          '.highcharts-point-select': {
            fill: selectedColor,
            stroke: selectedColor,
            strokeWidth: chartType === 'area' || chartType === 'line' ? 12 : 0,
            strokeOpacity: chartType === 'area' || chartType === 'line' ? 0.25 : 1,

            filter: 'opacity(1)',
          },
          '.highcharts-area': {
            filter: `opacity(${isSelected && chartType !== 'pie' && chartType !== 'donut' ? 0.25 : 1})`,
          },
        }}
        isRound={false}
        borderless
        width={width}
        padding={0}
      >
        {renderContent()}
      </Container>
    </ErrorBoundary>
  );
}

Chart.propTypes = propTypes;
export default Chart;
