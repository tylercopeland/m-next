import React from 'react';
import PropTypes from 'prop-types';
import { widgets } from '@m-next/types';
 
import ColumnLayout from './columnLayout';

const propTypes = {
  canvasWidth: PropTypes.number,
  content: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Object)]),
  legacyClass: PropTypes.string,
  legacyDataWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  singleColumnDisplay: PropTypes.bool,
  useSingleColumnDisplay: PropTypes.bool,
  onControlClick: PropTypes.func,
};
function RowLayout({
  canvasWidth,
  content,
  legacyClass,
  legacyDataWidth,
  singleColumnDisplay,
  useSingleColumnDisplay,
  onControlClick,
}) {
  const renderColumn = (item, idx, columnCanvasWidth) => {
    if (item.type === widgets.LAYOUT_COLUMN) {
      return (
        <ColumnLayout
          key={idx}
          content={item.content}
          legacyClass={item.legacyClass}
          legacyDataWidth={item.legacyDataWidth}
          legacyDataHeight={item.legacyDataHeight}
          singleColumnDisplay={singleColumnDisplay}
          useSingleColumnDisplay={useSingleColumnDisplay}
          canvasWidth={columnCanvasWidth}
          onControlClick={onControlClick}
        />
      );
    }
  };

  const render = () => {
    const rowStyle = { width: legacyDataWidth || null, display: 'table-row' };
    let widthRemaining = canvasWidth;
    let unsizedColumns = 0;

    const widths = content.map((item) => {
      if (item.content && item.legacyDataWidth) {
        if (item.legacyDataWidth.indexOf('px') >= 0) {
          const width = Number(item.legacyDataWidth.replace('px', ''));
          widthRemaining -= width;
          return width;
        }

        let width = canvasWidth;
        if (useSingleColumnDisplay) return width;

        width = canvasWidth * (Number(item.legacyDataWidth.replace('%', '')) / 100);
        widthRemaining -= width;
        return width;
      }

      unsizedColumns += 1;
      return 0;
    });

    for (let index = 0; index < content.length; index++) {
      if (widths[index] === 0) {
        widths[index] = widthRemaining / unsizedColumns;
      }
    }
  
    return (
      <div className={legacyClass} style={rowStyle} canvas_width={canvasWidth} layout_type='row'>
        {content.map((item, index) => renderColumn(item, index, widths[index]))}
      </div>
    );
  };

  return render();
}

RowLayout.propTypes = propTypes;

export default RowLayout;
