import React, { Children, useRef } from 'react';
import PropTypes from 'prop-types';
import { HTMLElementType } from '@m-next/types';
import Popover from '@m-next/popover';
import Container from '@m-next/container';
import * as s from './Menu.styles';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
  anchorEl: PropTypes.oneOfType([HTMLElementType, PropTypes.object, PropTypes.func]),
  relativeToParent: PropTypes.bool,

  open: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  inline: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  header: PropTypes.string,
  horizontalAlign: PropTypes.string,
  marginVertical: PropTypes.number,
  marginHorizontal: PropTypes.number,
  popoverStyle: PropTypes.instanceOf(Object),
  marginThreshold: PropTypes.number,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  shiftLeft: PropTypes.number,
  shiftDown: PropTypes.number,
};

/**
 * Wrapper component around
 */
function MenuList({
  id,
  onClose,
  anchorEl,
  relativeToParent,
  open = false,
  children,
  style,
  className,
  inline = false,
  width = 'auto',
  header,
  horizontalAlign = 'center',
  marginVertical,
  marginHorizontal = 0,
  popoverStyle,
  marginThreshold = 16,
  maxHeight,
  shiftLeft = 0,
  shiftDown = 0,
}) {
  const count = Children.count(children);
  const containerRef = useRef(null);

  return (
    <Popover
      id={`${id}-menu`}
      open={open}
      anchorEl={anchorEl}
      relativeToParent={relativeToParent}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: horizontalAlign,
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: horizontalAlign,
      }}
      inline={inline}
      marginVertical={marginVertical}
      marginHorizontal={marginHorizontal}
      style={popoverStyle}
      marginThreshold={marginThreshold}
      shiftLeft={shiftLeft}
      shiftDown={shiftDown}
      skipShifting
    >
      <Container
        role='menu'
        forwardRef={containerRef}
        style={style}
        className={className}
        padding={8}
        width={width}
        maxHeight={maxHeight}
        scrollable={count >= 10}
      >
        {header && <s.MenuHeader>{header}</s.MenuHeader>}
        {children}
      </Container>
    </Popover>
  );
}

MenuList.propTypes = propTypes;
export default MenuList;
