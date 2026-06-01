import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as s from './AppBar.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
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

// ============================================================================
// AppBar — root container
// ============================================================================

const appBarPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /** Height in pixels. Default 56 — matches the m-next density baseline. */
  height: PropTypes.number,
  /** When true, omits the bottom border (use with shadow-via-style or
   *  layered backgrounds where a border looks doubled-up). */
  borderless: PropTypes.bool,
  /** When true, sets position: sticky + top: 0 + z-index so the bar pins
   *  to the viewport top. */
  sticky: PropTypes.bool,
  /** Accessible label for the <header> landmark. */
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
};

/**
 * AppBar — horizontal top chrome for an app shell. Compound-component API:
 *
 *   <AppBar>
 *     <AppBar.Start><Logo /><Breadcrumbs ... /></AppBar.Start>
 *     <AppBar.Center>{pageTitle}</AppBar.Center>
 *     <AppBar.End>
 *       <SearchInput ... />
 *       <IconButton icon='help' />
 *       <UserAvatar ... />
 *     </AppBar.End>
 *   </AppBar>
 *
 * Slot-based: every consumer fills start/center/end with different content
 * (logo, breadcrumbs, search, user menu, theme switcher, notification bell).
 * A data-driven `start={...} center={...} end={...}` prop API would still
 * be expressive (ReactNode-valued props) but loses the visual structure at
 * the call site that compound components give.
 */
const AppBar = forwardRef(function AppBar(props, ref) {
  const {
    id: idProp,
    height = 56,
    borderless = false,
    sticky = false,
    ariaLabel = 'Top navigation',
    children,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-app-bar-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'app-bar-forwardRef-prop',
      '@m-next/app-bar: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the rendered root.
  const internalElRef = useRef(null);
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(internalElRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = internalElRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const setRef = (node) => {
    internalElRef.current = node;
  };

  return (
    <s.AppBarRoot
      ref={setRef}
      id={id}
      height={height}
      borderless={borderless}
      sticky={sticky}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </s.AppBarRoot>
  );
});

AppBar.displayName = 'AppBar';
AppBar.propTypes = appBarPropTypes;

// ============================================================================
// AppBar.Start / AppBar.Center / AppBar.End — passive slot containers
// ============================================================================

const Start = ({ children, ...rest }) => <s.Start {...rest}>{children}</s.Start>;
Start.displayName = 'AppBar.Start';
Start.propTypes = { children: PropTypes.node };

const Center = ({ children, ...rest }) => <s.Center {...rest}>{children}</s.Center>;
Center.displayName = 'AppBar.Center';
Center.propTypes = { children: PropTypes.node };

const End = ({ children, ...rest }) => <s.End {...rest}>{children}</s.End>;
End.displayName = 'AppBar.End';
End.propTypes = { children: PropTypes.node };

// ============================================================================
// Compound exports
// ============================================================================

AppBar.Start = Start;
AppBar.Center = Center;
AppBar.End = End;

export { Start, Center, End };
export default AppBar;
