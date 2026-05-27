import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { widgets } from '@m-next/types';
import { selectControls } from '../../../common/services/screenLayoutSlice';

import RowLayout from './rowLayout';
import LegacyBlock from './legacyBlock';

const propTypes = {
  canvasWidth: PropTypes.number,
  content: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Object)]),
  id: PropTypes.string.isRequired,
  legacyChildClass: PropTypes.string,
  legacyClass: PropTypes.string,
  legacyDataWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  singleColumnDisplay: PropTypes.bool,
  onControlClick: PropTypes.func,
};

export const renderRow = (item, idx, useSingleColumnDisplay, singleColumnDisplay, canvasWidth, onControlClick, id) => {
  if (item.type === widgets.LAYOUT_SECTION || item.type === widgets.SECTION) {
    return (
      // eslint-disable-next-line no-use-before-define
      <SectionLayout
        key={idx}
        id={item.id}
        content={item.content}
        legacyClass={item.legacyClass}
        legacyChildClass={item.legacyChildClass}
        legacyDataWidth={item.legacyDataWidth}
        singleColumnDisplay={singleColumnDisplay}
        useSingleColumnDisplay={useSingleColumnDisplay}
        canvasWidth={canvasWidth}
        onControlClick={onControlClick}
      />
    );
  }

  if (item.type === widgets.LAYOUT_ROW) {
    return (
      <RowLayout
        key={`${idx}-${id}`}
        content={item.content}
        legacyClass={item.legacyClass}
        legacyChildClass={item.legacyChildClass}
        legacyDataWidth={item.legacyDataWidth}
        singleColumnDisplay={singleColumnDisplay}
        useSingleColumnDisplay={useSingleColumnDisplay}
        canvasWidth={canvasWidth}
        onControlClick={onControlClick}
      />
    );
  }
};

function SectionLayout({
  id,
  content,
  singleColumnDisplay,
  canvasWidth,
  legacyChildClass,
  legacyDataWidth,
  onControlClick,
}) {
  const control = useSelector((state) => {
    const controls = selectControls(state);
    return controls ? controls[id] : null;
  });

  const onClick = (event) => {
    if (id === '00000000-0000-0000-0000-000000000000') return;
    onControlClick(id);
    event.stopPropagation();
  };

  const render = () => {
    let width = legacyDataWidth;
    let useSingleColumnDisplay = false;

    if (legacyChildClass?.includes('FlowTablet') || legacyChildClass?.includes('FlowMobile'))
      useSingleColumnDisplay = true;

    if (control?.width && control?.width !== '') {
      width = control?.width;
      if (typeof width === 'string' && width.indexOf('px') >= 0) {
        width = Number(width.replace('px', ''));
      }
    }
    if (id === '00000000-0000-0000-0000-000000000000') {
      return (
        <div>
          {content.map((item, idx) =>
            renderRow(item, idx, useSingleColumnDisplay, singleColumnDisplay, canvasWidth, onControlClick, id),
          )}
        </div>
      );
    }
    return (
      <LegacyBlock
        id={id}
        key={id}
        control={control}
        type={widgets.SECTION}
        legacyClass={legacyChildClass}
        visible={control?.visible}
        useSingleColumnDisplay
        onClick={onClick}
      >
        {content.map((item, idx) =>
          renderRow(item, idx, useSingleColumnDisplay, singleColumnDisplay, canvasWidth, onControlClick, id),
        )}
      </LegacyBlock>
    );
  };

  return render();
}
SectionLayout.propTypes = propTypes;
export default SectionLayout;
