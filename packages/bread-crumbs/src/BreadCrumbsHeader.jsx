import React, { useEffect, useRef, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { Text } from '@m-next/typeography';
import { useTheme } from '@mui/material';
import { IconMenuList, MenuItem } from '@m-next/menu';
import { lightTheme } from '@m-next/styles';
import { interactions } from '@m-next/utilities';
import * as s from './BreadCrumbsHeader.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input / @m-next/button.
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

const propTypes = {
  id: PropTypes.string,
  showMenu: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
      tooltip: PropTypes.string,
    }),
  ),
  tooltipId: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  iconName: PropTypes.string,
  ariaLabel: PropTypes.string,

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  // eslint-disable-next-line react/forbid-prop-types
  forwardRef: PropTypes.any,

  // ============ Silently ignored legacy ghosts ============
  /** @deprecated No longer has any effect. */
  isV4Design: PropTypes.bool,
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile: PropTypes.bool,
  /** @deprecated Use `className`. */
  legacyClass: PropTypes.string,
  /** @deprecated No longer has any effect. */
  displayAuto: PropTypes.bool,
  /** @deprecated No longer has any effect. */
  compactStyle: PropTypes.bool,
};

const BreadCrumbsHeader = forwardRef(function BreadCrumbsHeader(props, ref) {
  const {
    id: idProp,
    showMenu = false,
    menuItems = [],
    crumbs = [],
    tooltipId,
    style,
    className,
    iconName = 'screens-V4',

    // Standard ARIA pass-through (with sensible default name for the nav landmark)
    'aria-label': ariaLabelStandard,
    ariaLabel: ariaLabelLegacyCased,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-breadcrumbs-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'bread-crumbs-forwardRef-prop',
      '@m-next/bread-crumbs: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // `ariaLabel` (camelCase non-DOM prop) shimmed to standard `aria-label`.
  let resolvedAriaLabel = ariaLabelStandard;
  if (ariaLabelLegacyCased && !resolvedAriaLabel) {
    warnOnce(
      'bread-crumbs-ariaLabel',
      '@m-next/bread-crumbs: `ariaLabel` is deprecated. Use the standard `aria-label` attribute.',
    );
    resolvedAriaLabel = ariaLabelLegacyCased;
  }
  // Default accessible name for the nav landmark.
  const navAriaLabel = resolvedAriaLabel ?? 'Breadcrumbs';

  // ============ Theme + state ============

  const { content: themeContent } = useTheme();
  const content = themeContent ?? lightTheme.content;
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  const navRef = useRef(null);
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(navRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = navRef.current;
    }
  }, [ref, legacyForwardRef]);

  useEffect(() => {
    setActive(-1);
    setOpen(false);
  }, [crumbs]);

  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;

    if ([9, 13, 27, 32, 35, 36, 38, 40].includes(keyPressed)) {
      interactions.preventPropagation(e);
    }

    switch (keyPressed) {
      case 9:
      case 27:
        setActive(-1);
        setOpen(false);
        break;
      case 13:
      case 32:
        if (active === -1) setActive(0);
        else menuItems[active].onClick();
        setActive(-1);
        break;
      case 35:
        setActive(menuItems.length - 1);
        break;
      case 36:
        setActive(0);
        break;
      case 38:
        setActive(active === 0 ? menuItems.length - 1 : active - 1);
        break;
      case 40:
        setActive(active === menuItems.length - 1 ? 0 : active + 1);
        break;
      default:
        break;
    }
  };

  return (
    <s.HeaderWrapper
      ref={navRef}
      as="nav"
      id={id}
      style={style}
      className={className}
      aria-label={navAriaLabel}
      {...rest}
    >
      <SvgIcon
        id={`${id}-icon`}
        name={iconName}
        color={crumbs?.length > 1 ? content.secondary : content.primary}
        size={16}
      />
      <s.CrumbsWrapper id={`${id}-crumbs`} as="ol">
        {crumbs?.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1;
          return (
            <li key={crumb.id}>
              <Text
                id={`${id}-${crumb.id}-crumb`}
                bold
                ellipsis
                onClick={crumb.onClick}
                color={isCurrent ? content.primary : content.secondary}
                fontSize="mediumLarge"
                tooltip={crumb.tooltip}
                tooltipId={tooltipId}
                tooltipPlace="left"
                aria-current={isCurrent ? 'page' : undefined}
              >
                {crumb.label}
              </Text>
              {!isCurrent && <Text style={{ paddingLeft: 4 }} aria-hidden="true">/</Text>}
            </li>
          );
        })}
      </s.CrumbsWrapper>

      {showMenu && (
        <IconMenuList
          id={id}
          inline
          relativeToParent
          icon="navigation-show-more"
          color={content.primary}
          size={16}
          iconRotation="transform: rotate(90deg)"
          onKeyUp={handleKeyPress}
          horizontalAlign="right"
          width={180}
          open={open}
          onToggle={setOpen}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              id={item.id}
              style={{ fontWeight: 400 }}
              onClick={item.onClick}
              active={active === index}
            >
              {item.label}
            </MenuItem>
          ))}
        </IconMenuList>
      )}
    </s.HeaderWrapper>
  );
});

BreadCrumbsHeader.displayName = 'BreadCrumbsHeader';
BreadCrumbsHeader.propTypes = propTypes;

export default BreadCrumbsHeader;
