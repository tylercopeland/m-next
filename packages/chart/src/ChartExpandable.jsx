import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '@m-next/utilities';
import { lightTheme } from '@m-next/styles';
import styled from '@emotion/styled';
import Modal from 'react-modal';
import ChartDialog from './ChartDialog';
import Chart from './chart';

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
  /** When true, overlay uses position:absolute constrained to anchor. When false, uses position:fixed with margins (legacy behavior). */
  constrainOverlayToAnchor: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  showClose: PropTypes.bool,
  forceSelect: PropTypes.string,
  yAxisAllowDecimals: PropTypes.bool,
  numberFormat: PropTypes.string,
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

function ChartExpandable({
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
  children,
  showClose = true,
  forceSelect = null,
  yAxisAllowDecimals = true,
  numberFormat = null,
}) {
  const [chartExpanded, setChartExpanded] = useState(expanded);

  useEffect(() => {
    setChartExpanded(expanded);
  }, [expanded]);

  const errorFallback = () => (
    <EmptyWrapper>
      <strong>Unable to load chart</strong>
    </EmptyWrapper>
  );

  return (
    <ErrorBoundary fallback={errorFallback()}>
      <Chart
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
        forceSelect={forceSelect}
        yAxisAllowDecimals={yAxisAllowDecimals}
        numberFormat={numberFormat}
      />
      <Modal
        id={id ? `${id}-wrapper` : null}
        parentSelector={() => document.querySelector(anchorEl) || document.body}
        ariaHideApp={false}
        onRequestClose={onClose}
        isOpen={chartExpanded}
        role='dialog'
        style={{
          content: {
            position: 'unset',
            width: '90%',
            height: '90%',

            backgroundColor: lightTheme.background.page,
            padding: 0,
          },
          overlay: {
            backgroundColor: `${lightTheme.content.emphasize}88`,
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            margin: expandedMargin,
            // When constrainOverlayToAnchor is true (next-gen/V4), use absolute positioning so the overlay
            // is constrained to the anchor. Legacy screens use false to keep position:fixed with dynamic margins.
            ...(constrainOverlayToAnchor && anchorEl && anchorEl !== 'body'
              ? {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }
              : {}),
          },
        }}
      >
        <ChartDialog
          id={id}
          isLoading={isLoading}
          style={style}
          data={data}
          error={error}
          onRefetch={onRefetch}
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
          showClose={showClose}
          forceSelect={forceSelect}
          yAxisAllowDecimals={yAxisAllowDecimals}
          numberFormat={numberFormat}
        >
          {children}
        </ChartDialog>
      </Modal>
    </ErrorBoundary>
  );
}

ChartExpandable.propTypes = propTypes;
export default ChartExpandable;
