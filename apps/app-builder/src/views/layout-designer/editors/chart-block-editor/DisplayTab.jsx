import React, { useCallback, useState } from 'react';

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Tooltip } from 'react-tooltip';
import { IconRadioGroup } from '@m-next/radio-button';
import { DebouncedInput } from '@m-next/input';
import ColorPicker from '@m-next/color-picker';
import Toggle from '@m-next/toggle';
import { Text } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import * as s from './ChartBlockEditor.styles';
import * as commonStyles from '../common/BlockEditor.styles';
import { ChartTypes } from './types';

// types
const propTypes = {
  chart: PropTypes.number,
  titles: PropTypes.shape({
    caption: PropTypes.string,
    yAxis: PropTypes.string,
    xAxis: PropTypes.string,
    series: PropTypes.string,
  }),
  onChangeChart: PropTypes.func,
  onChangeTitles: PropTypes.func, // (titles, options?: { sanitizedName?: string }) => void
  onColorChange: PropTypes.func,
  onShowDataPointsChange: PropTypes.func,
  onShowDynamicDates: PropTypes.func,
  color: PropTypes.string,
  showDataPoints: PropTypes.bool,
  expandAll: PropTypes.bool,
  showDynamicDates: PropTypes.bool,
  supportsDynamicDates: PropTypes.bool,
  control: PropTypes.object,
  onChange: PropTypes.func,
};

export const ColorWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
]);

export const ColorPickerSpacer = styled.div`
  height: ${({ isOpen }) => (isOpen ? '340px' : '0px')};
  transition: height 0.1s ease-out;
`;

function DisplayTab({
  chart,
  titles,
  onChangeChart,
  onChangeTitles,
  onColorChange,
  onShowDataPointsChange,
  onShowDynamicDates,
  color,
  showDataPoints,
  expandAll,
  showDynamicDates,
  supportsDynamicDates,
  control,
  onChange,
}) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const chartTypes = [
    ChartTypes.Column,
    ChartTypes.Bar,
    ChartTypes.Line,
    ChartTypes.Area,
    ChartTypes.Pie,
    ChartTypes.Donut,
  ];

  const changeChartType = (item) => {
    onChangeChart(item.value);
  };

  const handleCaptionChange = (newCaption, sanitizedName) => {
    const updated = { ...titles, caption: newCaption };
    onChangeTitles(updated, sanitizedName != null ? { sanitizedName } : undefined);
  };

  const handleXAxisChange = (e) => {
    const updated = { ...titles, xAxis: e };
    onChangeTitles(updated);
  };

  const handleYAxisChange = (e) => {
    const updated = { ...titles, yAxis: e };
    onChangeTitles(updated);
  };

  const handleColorChange = (e) => {
    onColorChange(e.currentValue.hex);
  };

  const handleShowDataPoints = (value) => {
    onShowDataPointsChange(value);
  };

  const handleShowDynamicDates = (value) => {
    onShowDynamicDates(value);
  };

  const handleHideCaptionChange = (value) => {
    if (control && onChange) {
      const updated = { ...control, hideCaption: !value };
      onChange(updated);
    }
  };

  const handleColorPickerOpen = useCallback(() => {
    setColorPickerOpen(true);
  }, []);

  const handleColorPickerClose = useCallback(() => {
    setColorPickerOpen(false);
  }, []);

  return (
    <s.Wrapper padding={16}>
      <IconRadioGroup id='chart-type' selectedValue={chart} onChange={changeChartType} options={chartTypes} />
      <commonStyles.LineWrapper>
        <Text>Chart color</Text>
        <ColorPicker
          id='chart-color'
          value={color}
          alignPanelRight
          popupPanelStyle={{ bottom: '32px', zIndex: Z_POPUP.COLOR_PICKER }}
          onChange={handleColorChange}
          onOpen={handleColorPickerOpen}
          onClose={handleColorPickerClose}
        />
      </commonStyles.LineWrapper>
      <ColorPickerSpacer isOpen={colorPickerOpen} />

      {control && onChange && <DefaultStateSelector control={control} onChange={onChange} />}

      <Accordion id='chart-titles-wrapper' caption='Titles' open={expandAll}>
        {control && onChange ? (
          <CaptionInput
            id='chart-caption'
            label='Chart title'
            controlId={control.id}
            value={titles.caption}
            onChange={handleCaptionChange}
            maxLength={30}
          />
        ) : (
          <DebouncedInput
            compactStyle
            id='chart-caption'
            value={titles.caption}
            caption='Chart title'
            onChange={(e) => handleCaptionChange(e, undefined)}
          />
        )}
        {control && onChange && (
          <commonStyles.LineWrapper gap={8}>
            <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
            <Toggle
              id='show-title'
              checked={!control.hideCaption}
              onChange={handleHideCaptionChange}
              label='Show title'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
          </commonStyles.LineWrapper>
        )}
        {chart !== 4 && chart !== 7 && (
          <DebouncedInput
            compactStyle
            id='chart-y-axis-title'
            value={titles.yAxis}
            caption='Y axis title'
            onChange={handleYAxisChange}
          />
        )}
        {chart !== 4 && chart !== 7 && (
          <DebouncedInput
            compactStyle
            id='chart-x-axis-title'
            value={titles.xAxis}
            caption='X axis title'
            onChange={handleXAxisChange}
          />
        )}
      </Accordion>

      <Accordion id='additional-options' caption='Additional options' open={expandAll}>
        <Toggle
          id='show-values-hover'
          checked={showDataPoints}
          onChange={handleShowDataPoints}
          label='Show data point values'
          width='100%'
          bold
          style={{ justifyContent: 'flex-start' }}
          labelStyle={{ flexBasis: '50%' }}
        />
        <Toggle
          id='show-dynamic-dates'
          checked={showDynamicDates}
          onChange={handleShowDynamicDates}
          label='Show dynamic dates'
          width='100%'
          bold
          style={{ justifyContent: 'flex-start' }}
          labelStyle={{ flexBasis: '50%' }}
          tooltip={
            supportsDynamicDates
              ? null
              : 'To enable the Dynamic Dates feature,<br/> you must use a single dynamic date in <br/>your filter criteria. (e.g. Start Date is <br/>before This Month)'
          }
          tooltipId='my-tooltip'
          disabled={!supportsDynamicDates}
        />
      </Accordion>
      <Tooltip id='my-tooltip' />
    </s.Wrapper>
  );
}

DisplayTab.propTypes = propTypes;
export default DisplayTab;
