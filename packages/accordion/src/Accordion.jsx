import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import * as s from './Accordion.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/sidebar.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoRootCounter = 0;
let autoItemCounter = 0;

// Normalize the various shapes `expanded` / `defaultExpanded` may take.
// Accepts `string`, `string[]`, `null`, `undefined`; returns a plain array
// of ids (possibly empty). A single string is wrapped, since the natural
// reader expectation is "open one item by name".
const toArray = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

// Internal context surface — items reach up to query whether they're open
// and to toggle. Keeping this private avoids exposing the state shape to
// consumers who should be using the controlled / uncontrolled props on the
// root instead.
const AccordionContext = createContext(null);

// ============================================================================
// Accordion — root container
// ============================================================================

const accordionPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /**
   * When true, multiple items can be expanded at once. When false (the
   * default), opening one item collapses the others — radio-style.
   */
  allowMultiple: PropTypes.bool,
  /**
   * Uncontrolled initial state. Accepts a single item id or an array of
   * ids. Ignored when `expanded` is provided.
   */
  defaultExpanded: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /**
   * Controlled state — array of expanded item ids. Pass alongside
   * `onExpandedChange` to manage state in the parent.
   */
  expanded: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** Fires with the next expanded-id array whenever state would change. */
  onExpandedChange: PropTypes.func,
  children: PropTypes.node,
};

/**
 * Accordion — compound-component progressive-disclosure container.
 *
 *   <Accordion allowMultiple defaultExpanded={['general']}>
 *     <Accordion.Item id="general" title="General settings">
 *       <p>Content...</p>
 *     </Accordion.Item>
 *     <Accordion.Item id="security" title="Security">
 *       <p>...</p>
 *     </Accordion.Item>
 *   </Accordion>
 *
 * The root owns the open/closed state for all items via internal context.
 * Items reach up to the context to render their expanded UI and to fire
 * toggles — consumers don't need to wire per-item handlers.
 *
 * Controlled vs uncontrolled: when `expanded` is provided the component is
 * fully controlled (parent owns state). When omitted, internal state is
 * seeded by `defaultExpanded` and updates locally. In both modes the
 * `onExpandedChange` callback fires with the next array so the parent can
 * observe / sync.
 */
const Accordion = forwardRef(function Accordion(props, ref) {
  const {
    id: idProp,
    allowMultiple = false,
    defaultExpanded,
    expanded: expandedProp,
    onExpandedChange,
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

  // Auto-generate root id if not provided. Item bodies derive their
  // aria-controls ids from the root's id, so a stable id is required.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-accordion-${++autoRootCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'accordion-forwardRef-prop',
      '@m-next/accordion: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
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

  // Controlled-vs-uncontrolled state. Internal state is always an array
  // (even when allowMultiple is false — we just enforce length <= 1 on
  // writes). That keeps every code path that reads state uniform.
  const isControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(() =>
    toArray(defaultExpanded),
  );
  const expandedArr = isControlled ? toArray(expandedProp) : internalExpanded;

  const isExpanded = useCallback((itemId) => expandedArr.includes(itemId), [expandedArr]);

  const toggle = useCallback(
    (itemId) => {
      const currentlyOpen = expandedArr.includes(itemId);
      let next;
      if (allowMultiple) {
        next = currentlyOpen
          ? expandedArr.filter((x) => x !== itemId)
          : [...expandedArr, itemId];
      } else {
        // Radio-style: opening closes everything else; closing returns [].
        next = currentlyOpen ? [] : [itemId];
      }
      if (!isControlled) setInternalExpanded(next);
      if (onExpandedChange) onExpandedChange(next);
    },
    [allowMultiple, expandedArr, isControlled, onExpandedChange],
  );

  const contextValue = useMemo(
    () => ({ rootId: id, isExpanded, toggle }),
    [id, isExpanded, toggle],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <s.AccordionRoot ref={setRef} id={id} {...rest}>
        {children}
      </s.AccordionRoot>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = 'Accordion';
Accordion.propTypes = accordionPropTypes;

// ============================================================================
// Accordion.Item — header + collapsible panel
// ============================================================================

const itemPropTypes = {
  /**
   * Stable identifier used by the root for expanded-state tracking. Strongly
   * recommended — without one, an auto id is generated but cannot be
   * referenced from `defaultExpanded` / `expanded`.
   */
  id: PropTypes.string,
  /** Header content. Plain string is most common; ReactNode allowed for rich titles. */
  title: PropTypes.node,
  /** Disables the toggle. Header still renders but click/keyboard do nothing. */
  disabled: PropTypes.bool,
  /** Optional left-side icon node next to the title. */
  icon: PropTypes.node,
  /** Body content shown when expanded. */
  children: PropTypes.node,
};

const Item = forwardRef(function Item(props, ref) {
  const { id: idProp, title, disabled = false, icon, children, ...rest } = props;

  const ctx = useContext(AccordionContext);

  // Auto-id if the consumer omitted one. Warned once per session — state
  // tracking won't work right with a generated id since consumers can't
  // reference it from defaultExpanded / expanded.
  const autoIdRef = useRef(null);
  if (autoIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    autoIdRef.current = `m-next-accordion-item-${++autoItemCounter}`;
  }
  const itemId = idProp ?? autoIdRef.current;

  if (idProp === undefined) {
    warnOnce(
      'accordion-item-missing-id',
      '@m-next/accordion: Accordion.Item is missing an `id`. An id was auto-generated, but you should provide a stable string id so the item can be referenced from `defaultExpanded` / `expanded` on the root.',
    );
  }

  // Items rendered outside of an Accordion still degrade gracefully — they
  // act as standalone always-collapsed disclosures. That keeps consumers
  // from crashing during partial migrations.
  const expanded = ctx ? ctx.isExpanded(itemId) : false;

  const handleClick = () => {
    if (disabled || !ctx) return;
    ctx.toggle(itemId);
  };

  const rootId = ctx?.rootId ?? 'm-next-accordion-orphan';
  const headerId = `${rootId}-${itemId}-header`;
  const bodyId = `${rootId}-${itemId}-body`;

  return (
    <s.ItemRoot ref={ref} {...rest}>
      <s.ItemHeader
        type='button'
        id={headerId}
        onClick={handleClick}
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls={bodyId}
        aria-disabled={disabled || undefined}
      >
        {icon && <s.ItemHeaderIcon aria-hidden='true'>{icon}</s.ItemHeaderIcon>}
        <s.ItemHeaderLabel>{title}</s.ItemHeaderLabel>
        <s.Chevron expanded={expanded} aria-hidden='true'>
          {'▾'}
        </s.Chevron>
      </s.ItemHeader>
      {expanded && (
        <s.ItemBody id={bodyId} role='region' aria-labelledby={headerId}>
          {children}
        </s.ItemBody>
      )}
    </s.ItemRoot>
  );
});

Item.displayName = 'Accordion.Item';
Item.propTypes = itemPropTypes;

// ============================================================================
// Compound exports
// ============================================================================

Accordion.Item = Item;

export { Item };
export default Accordion;
