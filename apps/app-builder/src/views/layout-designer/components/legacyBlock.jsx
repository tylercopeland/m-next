// Commented out interaction experince until we can review and decide on the best approach for handling children.

import React from 'react';
import PropTypes from 'prop-types';
import { widgets } from '@m-next/types';
import { useSelector } from 'react-redux';
import * as s from './legacyBlock.styles';
import {
  selectHoveredControlId,
  selectSelectedControlId,
} from '../../../common/services/screenLayoutSlice';

// types
const propTypes = {
  id: PropTypes.string,
  control: PropTypes.instanceOf(Object),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  children: PropTypes.node,
  type: PropTypes.string,
  legacyClass: PropTypes.string,
  onClick: PropTypes.func,
};

function LegacyBlock({ id, control, height, children, type, legacyClass, width }) {
 // const dispatch = useDispatch();
  const wrapperRef = React.useRef(null);
  const selectedControlId = useSelector(selectSelectedControlId);
  const hoveredControlId = useSelector(selectHoveredControlId);
/*
  const handleKeyDown = (event) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    }
  };

  const handleMouseEnter = () => {
    dispatch(controlHovered({ controlId: control.id }));
  };

  const handleMouseLeave = () => {
    if (control.id === hoveredControlId) {
      dispatch(controlHovered(null));
    }
  };

  const handleFocus = (event) => {
    if (onClick) {
      onClick(event);
    }
  };
  */

  const getLegacyHeight = () => {
    if (height) return height;
    switch (type) {
      case widgets.GRID:
        return 850;
      case widgets.SECTION:
        return 25;
      default:
        return 36;
    }
  };

  const getLayout = () => {
    if (!legacyClass) return null;

    const legacyMap = {
      tblrow: 'row',
      tblcell: 'cell',
      tbl: 'table',
    };
    return (
      legacyMap[
        Object.keys(legacyMap)
          .sort((a, b) => b.length - a.length)
          .find((k) => legacyClass.includes(k))
      ] || undefined
    );
  };

  const showHeader = control && control.caption !== '' && control.hasHeader === true;
  return (
    <s.Wrapper
      id={`${id}-legacy-block`}
      width={width}
      height={getLegacyHeight()}
      layout={getLayout()}
    //  onClick={onClick}
     // onKeyDown={handleKeyDown}
     // onFocus={handleFocus}
     // onMouseEnter={handleMouseEnter}
     // onMouseLeave={handleMouseLeave}
      tabIndex={0}
      ref={wrapperRef}
      selected={control?.id === selectedControlId}
      shouldShowHover={hoveredControlId === control?.id}
    >
      {showHeader && <s.h3>{control.caption}</s.h3>}
      {children}
    </s.Wrapper>
  );
}

LegacyBlock.propTypes = propTypes;
export default LegacyBlock;
