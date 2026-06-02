import React, { forwardRef, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '@m-next/utilities';
import { lightTheme } from '@m-next/styles';
import styled from '@emotion/styled';
import Modal from 'react-modal';
import ChartDialog from './ChartDialog';
import Chart from './chart';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

// types
const propTypes = {
  /** Optional. Auto-generated when not provided. */
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

/**
 * ChartExpandable — wraps `Chart` and adds an expand-to-modal affordance via
 * `react-modal`. When `expanded` is true, renders a modal-overlaid larger
 * `ChartDialog` anchored to `anchorEl` (defaults to `body`).
 *
 * The `id` prop is now optional — auto-generated as
 * `m-next-chart-expandable-${n}` when omitted. The legacy `forwardRef` prop
 * is soft-shimmed (warns once); the React ref is chained onto the inner
 * `Chart` component, which exposes its underlying Container.
 */
const ChartExpandable = forwardRef(function ChartExpandable(props, ref) {
  const {
    id: idProp = '',
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

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts — defensive acceptors so callers passing
    // them don't error. None of these are referenced in the body below.
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-chart-expandable-${++autoIdCounter}`;
  }
  const id = idProp || internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'chart-expandable-forwardRef-prop',
      '@m-next/chart (ChartExpandable): `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the inner Chart (which
  // exposes its underlying Container element). The Modal lives as a sibling
  // and isn't a useful ref target.
  const chartRef = useRef(null);
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(chartRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = chartRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const setChartRef = (node) => {
    chartRef.current = node;
  };

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
        ref={setChartRef}
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
});

ChartExpandable.displayName = 'ChartExpandable';
ChartExpandable.propTypes = propTypes;
export default ChartExpandable;
