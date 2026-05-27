import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { lightTheme } from '@m-next/styles';
import Container from '@m-next/container';
import styled from '@emotion/styled';
import SvgIcon from '@m-next/svg-icon';
import { useResizeDetector } from 'react-resize-detector';
import Chart from './chart';

// types
const propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Object),
  error: PropTypes.instanceOf(Object),
  onRefetch: PropTypes.func,
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
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  showClose: PropTypes.bool,
  forceSelect: PropTypes.string,
  yAxisAllowDecimals: PropTypes.bool,
  numberFormat: PropTypes.string,
};

const DialogHeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: lightTheme.background.page,
    height: 24,
  },
]);

const DialogHeaderDismissButton = styled.div(() => [
  {
    marginRight: 8,
    cursor: 'pointer',
  },
]);

const DialogContent = styled.div(() => [
  {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
]);

const DialogChildContent = styled.div((props) => [
  {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    minHeight: props.height,
    background: '#FFFFFF',
  },
]);

function ChartDialog({
  id = '',
  isLoading = false,
  style = {},
  data = {},
  error,
  onRefetch,
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
  children,
  showClose = true,
  forceSelect,
  yAxisAllowDecimals = true,
  numberFormat = null,
}) {
  const { width, height, ref: containerRef } = useResizeDetector();
  const chartHeight = useMemo(() => {
    if (children && height) return `${height / 2 - 36}px`;
    if (height) return `${height - 48}px`;
    return '100px';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  const containerHeight = useMemo(() => {
    if (height) return `${height - 48}px`;
    return '100px';
  }, [height]);
  const chartWidth = useMemo(() => `${width ? width - 48 : 100}px`, [width]);
  const hasValidSize = (width ?? 0) > 0 && (height ?? 0) > 0;

  return (
    <div ref={containerRef} style={{ height: '100%' }}>
      <DialogHeaderWrapper id={id ? `${id}-header` : null} tabIndex='-1'>
        <DialogHeaderDismissButton id={id ? `${id}-dismiss` : null} onClick={onClose}>
          {showClose && <SvgIcon name='close-V4' size={12} color={lightTheme.content.emphasize} />}
        </DialogHeaderDismissButton>
      </DialogHeaderWrapper>
      <Container
        padding='0px 24px'
        scrollable
        borderless
        height={containerHeight}
        style={{ background: lightTheme.background.page, gap: 16 }}
      >
        <DialogContent>
          {hasValidSize && (
            <Chart
              id={`${id}-expanded`}
              isLoading={isLoading}
              style={style}
              data={data}
              error={error}
              onRefetch={onRefetch}
              height={chartHeight}
              width={chartWidth}
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
              forceSelect={forceSelect}
              yAxisAllowDecimals={yAxisAllowDecimals}
              numberFormat={numberFormat}
              accessibilityEnabled={false}
            />
          )}
        </DialogContent>
        {children && (
          <DialogChildContent id={`${id}-drilldown`} height={chartHeight}>
            {children}
          </DialogChildContent>
        )}
      </Container>
    </div>
  );
}

ChartDialog.propTypes = propTypes;
export default ChartDialog;
