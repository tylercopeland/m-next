import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { HTMLElementType } from '@m-next/types';
import Popover from '@m-next/popover';
import Container from '@m-next/container';
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

// Match focusable / activatable MenuItem children. We identify MenuItems via
// their internal displayName so consumers composing wrappers still work.
const isMenuItem = (child) => {
  if (!isValidElement(child)) return false;
  const type = child.type;
  if (!type) return false;
  return type.displayName === 'MenuItem';
};

const MenuList = forwardRef(function MenuList(props, ref) {
  const {
    // Clean API
    id: idProp,
    open = false,
    onClose,
    anchorEl,
    children,
    width = 'auto',
    maxHeight,
    header,
    horizontalAlign = 'center',
    inline = false,
    relativeToParent,
    marginVertical,
    marginHorizontal = 0,
    marginThreshold = 16,
    shiftLeft = 0,
    shiftDown = 0,
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

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-menu-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'menu-forwardRef-prop',
      '@m-next/menu: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Refs ============

  const containerRef = useRef(null);

  // Merge external ref (React forwardRef API + legacy forwardRef prop) into
  // the internal container ref.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(containerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = containerRef.current;
    }
  }, [ref, legacyForwardRef]);

  // ============ Keyboard navigation ============

  // Collect MenuItem children indexes for arrow-key focus management.
  const items = useMemo(() => Children.toArray(children).filter(isMenuItem), [children]);
  const itemRefs = useRef([]);
  itemRefs.current = items.map((_, i) => itemRefs.current[i] || React.createRef());

  const focusIndex = useCallback((idx) => {
    const ref = itemRefs.current[idx];
    if (ref && ref.current && typeof ref.current.focus === 'function') {
      ref.current.focus();
    }
  }, []);

  const focusableIndexFrom = useCallback(
    (startIdx, direction) => {
      if (items.length === 0) return -1;
      let i = startIdx;
      for (let step = 0; step < items.length; step += 1) {
        i = (i + direction + items.length) % items.length;
        const child = items[i];
        if (!child.props || !child.props.disabled) return i;
      }
      return -1;
    },
    [items],
  );

  // Focus the first non-disabled item when the menu opens.
  useEffect(() => {
    if (!open || items.length === 0) return;
    const next = focusableIndexFrom(-1, 1);
    if (next >= 0) {
      // Defer so popover/portal has time to mount the DOM.
      const t = setTimeout(() => focusIndex(next), 0);
      // eslint-disable-next-line consistent-return
      return () => clearTimeout(t);
    }
  }, [open, items.length, focusableIndexFrom, focusIndex]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      if (onClose) onClose(e);
      return;
    }
    if (items.length === 0) return;

    const active =
      typeof document !== 'undefined' ? document.activeElement : null;
    const currentIdx = itemRefs.current.findIndex((r) => r.current === active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = focusableIndexFrom(currentIdx, 1);
      if (next >= 0) focusIndex(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = focusableIndexFrom(currentIdx === -1 ? 0 : currentIdx, -1);
      if (next >= 0) focusIndex(next);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const next = focusableIndexFrom(-1, 1);
      if (next >= 0) focusIndex(next);
    } else if (e.key === 'End') {
      e.preventDefault();
      const next = focusableIndexFrom(0, -1);
      if (next >= 0) focusIndex(next);
    }
  };

  // ============ Render ============

  const count = Children.count(children);

  // Decorate MenuItem children with focusable refs.
  let itemCursor = 0;
  const decoratedChildren = Children.map(children, (child) => {
    if (!isMenuItem(child)) return child;
    const ref = itemRefs.current[itemCursor];
    itemCursor += 1;
    return cloneElement(child, { ref });
  });

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
        aria-labelledby={header ? `${id}-menu-header` : undefined}
        ref={containerRef}
        style={style}
        className={className}
        padding={8}
        width={width}
        maxHeight={maxHeight}
        scrollable={count >= 10}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {header && <s.MenuHeader id={`${id}-menu-header`}>{header}</s.MenuHeader>}
        {decoratedChildren}
      </Container>
    </Popover>
  );
});

MenuList.displayName = 'MenuList';

MenuList.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  anchorEl: PropTypes.oneOfType([HTMLElementType, PropTypes.object, PropTypes.func]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  header: PropTypes.string,
  horizontalAlign: PropTypes.string,
  inline: PropTypes.bool,
  relativeToParent: PropTypes.bool,
  marginVertical: PropTypes.number,
  marginHorizontal: PropTypes.number,
  marginThreshold: PropTypes.number,
  shiftLeft: PropTypes.number,
  shiftDown: PropTypes.number,
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

export default MenuList;
