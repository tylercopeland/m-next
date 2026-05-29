import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import MenuList from './MenuList';
import * as s from './Menu.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/button.
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

const IconMenuList = forwardRef(function IconMenuList(props, ref) {
  const {
    id: idProp,
    children,
    onClose,
    onToggle,
    onKeyUp,
    open,
    disabled = false,
    preventAutoClose = false,
    relativeToParent,

    // Visual
    icon = 'chevron-down-V4',
    iconSize = 16,
    iconBorder = false,
    iconRotation,
    color,

    // MenuList passthrough
    inline = true,
    width,
    maxHeight,
    header,
    horizontalAlign = 'center',
    marginHorizontal = 0,
    marginVertical = 12,
    marginThreshold = 16,
    shiftLeft = 0,
    popoverStyle,
    style,
    className,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    hidden: _hidden,
    displayAuto: _displayAuto,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-icon-menu-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // Soft-shim legacy `forwardRef` prop.
  if (legacyForwardRef) {
    warnOnce(
      'icon-menu-forwardRef-prop',
      '@m-next/menu: IconMenuList `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [internalOpen, setOpen] = useState(false);
  const iconRef = useRef();
  const wrapperRef = useRef(null);

  // Merge external ref (forwardRef API + legacy forwardRef prop) onto the wrapper.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(wrapperRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = wrapperRef.current;
    }
  }, [ref, legacyForwardRef]);

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
    // Return focus to trigger.
    if (iconRef.current && typeof iconRef.current.focus === 'function') {
      iconRef.current.focus();
    }
  };

  const forceClose = () => {
    // Force close regardless of preventAutoClose setting
    setOpen(false);
    if (onClose) onClose();
    if (onToggle) onToggle(false);
    if (iconRef.current && typeof iconRef.current.focus === 'function') {
      iconRef.current.focus();
    }
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
        forceClose();
      } else {
        handleClose();
      }
    } else {
      openMenu();
    }
  };

  const handleKeyPress = (e) => {
    const { key, keyCode } = e;

    // ESC / Tab close.
    if (key === 'Escape' || key === 'Esc' || keyCode === 27 || keyCode === 9) {
      setOpen(false);
    }

    // Enter / ArrowDown open.
    if (!internalOpen && (key === 'Enter' || key === 'ArrowDown' || keyCode === 13 || keyCode === 40)) {
      setOpen(true);
    }

    // Enter when open: select (close).
    if (internalOpen && (key === 'Enter' || keyCode === 13)) {
      setOpen(false);
    }

    if (onKeyUp) onKeyUp(e);
  };

  return (
    <s.IconMenuWrapper
      ref={wrapperRef}
      onKeyUp={handleKeyPress}
      style={style}
      {...rest}
    >
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
        backgroundHoverColor={colors.grey.lighter}
        aria-haspopup='menu'
        aria-expanded={internalOpen}
        aria-controls={`${id}-menu-content-menu`}
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
});

IconMenuList.displayName = 'IconMenuList';

IconMenuList.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  onClose: PropTypes.func,
  onToggle: PropTypes.func,
  onKeyUp: PropTypes.func,
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  preventAutoClose: PropTypes.bool,
  relativeToParent: PropTypes.bool,

  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconBorder: PropTypes.bool,
  iconRotation: PropTypes.string,
  color: PropTypes.string,

  inline: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  header: PropTypes.string,
  horizontalAlign: PropTypes.string,
  marginHorizontal: PropTypes.number,
  marginVertical: PropTypes.number,
  marginThreshold: PropTypes.number,
  shiftLeft: PropTypes.number,
  popoverStyle: PropTypes.instanceOf(Object),
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,

  // Soft-shimmed legacy
  forwardRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),

  // Silently ignored
  // eslint-disable-next-line react/forbid-prop-types
  isV4Design: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  isMobile: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  hidden: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  displayAuto: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  legacyClass: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  compactStyle: PropTypes.any,
};

export default IconMenuList;
