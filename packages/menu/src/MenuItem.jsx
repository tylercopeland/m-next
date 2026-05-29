import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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

const MenuItem = forwardRef(function MenuItem(props, ref) {
  const {
    id: idProp,
    children,
    style,
    className,
    onClick,
    selected = false,
    active = false,
    disabled = false,

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
    internalIdRef.current = `m-next-menu-item-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // Soft-shim legacy `forwardRef` prop.
  if (legacyForwardRef) {
    warnOnce(
      'menu-item-forwardRef-prop',
      '@m-next/menu: MenuItem `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const innerRef = useRef(null);

  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(innerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = innerRef.current;
    }
  }, [ref, legacyForwardRef]);

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (onClick) onClick(e);
    }
  };

  return (
    <s.MenuItemWrapper
      id={`${id}-item`}
      ref={innerRef}
      role='menuitem'
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-selected={selected || active || undefined}
      style={style}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      selected={selected}
      active={active}
      disabled={disabled}
      {...rest}
    >
      {children}
    </s.MenuItemWrapper>
  );
});

MenuItem.displayName = 'MenuItem';

MenuItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,

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

export default MenuItem;
