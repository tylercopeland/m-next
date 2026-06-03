import React, { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as s from './Sidebar.styles';

// Internal context so slot children (Header, etc.) can sync their padding
// with the Sidebar's open/closed state without the caller wiring it twice.
const SidebarContext = createContext({ isOpen: true });

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
// Sidebar — root container
// ============================================================================

const sidebarPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /** Open/closed state. Controlled. */
  isOpen: PropTypes.bool,
  /** Called when the sidebar would like to change open state. */
  onToggle: PropTypes.func,
  /** Width in pixels when open. */
  width: PropTypes.number,
  /** Width in pixels when collapsed. */
  collapsedWidth: PropTypes.number,
  /** Accessible label for the <aside> landmark. */
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Sidebar — vertical app navigation. Compound-component API:
 *
 *   <Sidebar isOpen={open} onToggle={setOpen}>
 *     <Sidebar.Header>...</Sidebar.Header>
 *     <Sidebar.Body>
 *       <Sidebar.Group title="Workspace">
 *         <Sidebar.Item icon={...} active>Dashboard</Sidebar.Item>
 *       </Sidebar.Group>
 *     </Sidebar.Body>
 *     <Sidebar.Footer>...</Sidebar.Footer>
 *   </Sidebar>
 *
 * Slot-based: shells need flexibility because every consumer fills the
 * header/footer/items with different content. Items, groups, and the
 * shell itself are exported as sub-components on `Sidebar` (Sidebar.Item,
 * Sidebar.Group, etc.) — the dot notation makes it clear at the call site
 * what's a navigation primitive vs. arbitrary children.
 */
const Sidebar = forwardRef(function Sidebar(props, ref) {
  const {
    id: idProp,
    isOpen = true,
    // onToggle is consumer-owned — Sidebar doesn't trigger toggles on its own
    // in v1. Reserved for future hooks (e.g. a built-in collapse handle).
    onToggle: _onToggle,
    width = 224,
    collapsedWidth = 48,
    ariaLabel = 'Sidebar navigation',
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
    internalIdRef.current = `m-next-sidebar-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'sidebar-forwardRef-prop',
      '@m-next/sidebar: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
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

  const ctxValue = useMemo(() => ({ isOpen }), [isOpen]);

  return (
    <SidebarContext.Provider value={ctxValue}>
      <s.SidebarRoot
        ref={setRef}
        id={id}
        isOpen={isOpen}
        width={width}
        collapsedWidth={collapsedWidth}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </s.SidebarRoot>
    </SidebarContext.Provider>
  );
});

Sidebar.displayName = 'Sidebar';
Sidebar.propTypes = sidebarPropTypes;

// ============================================================================
// Sidebar.Header / Sidebar.Body / Sidebar.Footer — passive slot containers
// ============================================================================

const Header = ({ children, ...rest }) => {
  const { isOpen } = useContext(SidebarContext);
  return (
    <s.SidebarHeader isOpen={isOpen} {...rest}>
      {children}
    </s.SidebarHeader>
  );
};
Header.displayName = 'Sidebar.Header';
Header.propTypes = { children: PropTypes.node };

const Body = ({ children, ...rest }) => <s.SidebarBody {...rest}>{children}</s.SidebarBody>;
Body.displayName = 'Sidebar.Body';
Body.propTypes = { children: PropTypes.node };

const Footer = ({ children, ...rest }) => <s.SidebarFooter {...rest}>{children}</s.SidebarFooter>;
Footer.displayName = 'Sidebar.Footer';
Footer.propTypes = { children: PropTypes.node };

// ============================================================================
// Sidebar.Divider — explicit horizontal rule between sections
// ============================================================================

const dividerPropTypes = {
  /** Override the default border color. */
  color: PropTypes.string,
};

const Divider = ({ color, ...rest }) => (
  <s.Divider color={color} role='separator' aria-orientation='horizontal' {...rest} />
);
Divider.displayName = 'Sidebar.Divider';
Divider.propTypes = dividerPropTypes;

// ============================================================================
// Sidebar.Group — optional titled section, optionally collapsible
// ============================================================================

const groupPropTypes = {
  title: PropTypes.node,
  collapsible: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  /** Controlled override. When provided, `defaultExpanded` is ignored. */
  expanded: PropTypes.bool,
  onExpandedChange: PropTypes.func,
  children: PropTypes.node,
};

const Group = ({
  title,
  collapsible = false,
  defaultExpanded = true,
  expanded: expandedProp,
  onExpandedChange,
  children,
  ...rest
}) => {
  const isControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = isControlled ? expandedProp : internalExpanded;

  const handleToggle = () => {
    if (!collapsible) return;
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    if (onExpandedChange) onExpandedChange(next);
  };

  return (
    <s.GroupRoot {...rest}>
      {title && (
        <s.GroupHeader
          as={collapsible ? 'button' : 'div'}
          collapsible={collapsible}
          onClick={collapsible ? handleToggle : undefined}
          aria-expanded={collapsible ? expanded : undefined}
          type={collapsible ? 'button' : undefined}
        >
          <span>{title}</span>
          {collapsible && (
            <s.GroupChevron expanded={expanded} aria-hidden='true'>
              ›
            </s.GroupChevron>
          )}
        </s.GroupHeader>
      )}
      {(!collapsible || expanded) && <s.GroupBody>{children}</s.GroupBody>}
    </s.GroupRoot>
  );
};

Group.displayName = 'Sidebar.Group';
Group.propTypes = groupPropTypes;

// ============================================================================
// Sidebar.Item — clickable nav row (button or link via `as`)
// ============================================================================

const itemPropTypes = {
  icon: PropTypes.node,
  badge: PropTypes.node,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  href: PropTypes.string,
  /** Element/component to render as. Defaults to `button`; pass `'a'` for links. */
  as: PropTypes.elementType,
  children: PropTypes.node,
};

const Item = forwardRef(function Item(props, ref) {
  const {
    icon,
    badge,
    active = false,
    disabled = false,
    onClick,
    href,
    as: Tag,
    children,
    ...rest
  } = props;

  const renderAs = Tag || (href ? 'a' : 'button');
  const typeAttr = renderAs === 'button' ? 'button' : undefined;

  return (
    <s.Item
      ref={ref}
      as={renderAs}
      type={typeAttr}
      href={href}
      onClick={disabled ? undefined : onClick}
      active={active}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {icon && <s.ItemIcon aria-hidden='true'>{icon}</s.ItemIcon>}
      <s.ItemLabel>{children}</s.ItemLabel>
      {badge && <s.ItemBadge>{badge}</s.ItemBadge>}
    </s.Item>
  );
});

Item.displayName = 'Sidebar.Item';
Item.propTypes = itemPropTypes;

// ============================================================================
// Compound exports
// ============================================================================

Sidebar.Header = Header;
Sidebar.Body = Body;
Sidebar.Footer = Footer;
Sidebar.Divider = Divider;
Sidebar.Group = Group;
Sidebar.Item = Item;

export { Header, Body, Footer, Divider, Group, Item };
export default Sidebar;
