import React, { useState } from 'react';
import { colors } from '@m-next/styles';
import DisplayTab from '../../../src/views/layout-designer/editors/chart-block-editor/DisplayTab';

const propTypes = {};

function DisplayTabWrapper() {
  const [titles, setTitles] = useState({
    caption: 'Test Chart',
    yAxis: 'Amount',
    xAxis: 'Customers',
    series: 'Total',
  });
  const [color, setColor] = useState(colors.blue);
  const [showDataPoints, setShowDataPoints] = useState(false);
  const [chart, setChart] = useState(2);

  const handleChangeChart = (value) => {
    setChart(value);
  };

  const handleChangeTitle = (value) => {
    setTitles(value);
  };

  const handleColorChange = (value) => {
    setColor(value);
  };
  const handleShowDataPointsChange = (value) => {
    setShowDataPoints(value);
  };
  return (
    <div style={{ width: 380 }}>
      <DisplayTab
        chart={chart}
        titles={titles}
        onChangeChart={handleChangeChart}
        onChangeTitles={handleChangeTitle}
        onColorChange={handleColorChange}
        onShowDataPointsChange={handleShowDataPointsChange}
        color={color}
        showDataPoints={showDataPoints}
        expandAll
      />
    </div>
  );
}

DisplayTabWrapper.propTypes = propTypes;
export default DisplayTabWrapper;
