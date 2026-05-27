import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import MenuList from './MenuList';
import * as s from './Menu.styles';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
  relativeToParent: PropTypes.bool,
  preventAutoClose: PropTypes.bool,

  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  inline: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  header: PropTypes.string,
  horizontalAlign: PropTypes.string,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconBorder: PropTypes.bool,
  onKeyUp: PropTypes.func,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  color: PropTypes.string,
  marginHorizontal: PropTypes.number,
  popoverStyle: PropTypes.instanceOf(Object),
  marginThreshold: PropTypes.number,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconRotation: PropTypes.string,
  marginVertical: PropTypes.number,
  shiftLeft: PropTypes.number,
};

/**
 * Wrapper component around
 */
function IconMenuList({
  id,
  onClose,
  relativeToParent,
  preventAutoClose = false,
  children,
  style,
  className,
  inline = true,
  width,
  header,
  horizontalAlign = 'center',
  icon = 'chevron-down-V4',
  iconSize = 16,
  iconBorder = false,
  onKeyUp,
  disabled,
  onToggle,
  open,
  color,
  marginHorizontal = 0,
  popoverStyle,
  marginThreshold = 16,
  maxHeight,
  iconRotation,
  marginVertical = 12,
  shiftLeft = 0,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [internalOpen, setOpen] = useState(false);
  // const [closing, setClosing] = useState(false);
  const iconRef = useRef();
  useEffect(() => {
    setAnchorEl(iconRef.current);
  }, []);

  useEffect(() => {
    if (open !== undefined) {
      setOpen(open);
    }
  }, [open]);

  const handleClose = () => {
    if (preventAutoClose) {
      return; // Don't close automatically when preventAutoClose is true
    }
    setOpen(false);
    if (onClose) onClose();
    if (onToggle) onToggle(false);
  };

  const forceClose = () => {
    // Force close regardless of preventAutoClose setting
    setOpen(false);
    if (onClose) onClose();
    if (onToggle) onToggle(false);
  };

  const openMenu = () => {
    setAnchorEl(iconRef.current);
    if (!internalOpen && !disabled) {
      setOpen(true);
    }
    if (onToggle) onToggle(!internalOpen);
  };

  const toggleMenu = () => {
    if (internalOpen) {
      if (preventAutoClose) {
        forceClose(); // Use forceClose when manually toggling
      } else {
        handleClose();
      }
    } else {
      openMenu();
    }
  };

  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;
    // 9 - tab
    // 13 - enter
    // 27 - escape

    // 32 - space
    // 35 - end
    // 36 - home
    // 38 - up
    // 40 - down

    if (keyPressed === 9 || keyPressed === 27) {
      setOpen(false);
    }

    if (!internalOpen && (keyPressed === 13 || keyPressed === 40)) {
      setOpen(true);
    }

    if (internalOpen && keyPressed === 13) {
      setOpen(false);
    }

    if (onKeyUp) onKeyUp(e);
  };

  return (
    <s.IconMenuWrapper onKeyUp={handleKeyPress} style={style} role='menu'>
      <SvgIcon
        id={`${id}-menu-icon`}
        testId={`${id}-menu-icon`}
        name={icon}
        size={iconSize}
        onClick={toggleMenu}
        border={iconBorder}
        isV4Design
        forwardRef={iconRef}
        color={color}
        onKeyUp={() => {}}
        rotate={iconRotation}
        backgroundColor={colors.white}
        backgroundHoverColor={colors['grey-lighter']}
      />

      <MenuList
        id={`${id}-menu-content`}
        anchorEl={anchorEl}
        open={internalOpen}
        onClose={handleClose}
        marginVertical={marginVertical}
        relativeToParent={relativeToParent}
        className={className}
        inline={inline}
        header={header}
        horizontalAlign={horizontalAlign}
        width={width}
        marginHorizontal={marginHorizontal}
        popoverStyle={popoverStyle}
        marginThreshold={marginThreshold}
        maxHeight={maxHeight}
        shiftLeft={shiftLeft}
      >
        {children}
      </MenuList>
    </s.IconMenuWrapper>
  );
}

IconMenuList.propTypes = propTypes;
export default IconMenuList;
