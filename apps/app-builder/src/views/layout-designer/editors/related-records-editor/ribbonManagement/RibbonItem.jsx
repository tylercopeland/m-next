import React from 'react';
import PropTypes from 'prop-types';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import { interactions } from '@m-next/utilities';

import * as s from './RibbonManagement.styles';

const propTypes = {
  id: PropTypes.string,
  caption: PropTypes.string,
  visible: PropTypes.bool,
  onClick: PropTypes.func,
  onShowHideClick: PropTypes.func,
  isDragging: PropTypes.bool,
  showHide: PropTypes.bool,
};

function RibbonItem({ id, caption, visible, onClick, onShowHideClick, isDragging, showHide }) {
  const handleClick = () => {
    onClick(id);
  };
  const handleShowHideClick = (e) => {
    onShowHideClick(id);
    interactions.preventPropagation(e);
  };

  return (
    <s.RibbonItemWrapper visible={visible} isDragging={isDragging}>
      {visible && (
        <SvgIcon
          color={colors['grey-dark']}
          size={12}
          name='drag'
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      )}
      <s.RibbonName onClick={isDragging ? null : handleClick}>{caption}</s.RibbonName>
      {(showHide || !visible) && (
        <SvgIcon
          color={colors['grey-dark']}
          size={16}
          name={visible ? 'eye-open-V4' : 'eye-closed-V4'}
          tooltipId='ribbon-management'
          tooltip={visible ? 'Hide' : 'Show'}
          onClick={isDragging ? null : handleShowHideClick}
        />
      )}
    </s.RibbonItemWrapper>
  );
}

RibbonItem.propTypes = propTypes;
export default RibbonItem;
