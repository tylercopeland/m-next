import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Text from '@m-next/text';
import * as s from './SectionHeader.styles';

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

let autoIdCounter = 0;

const sectionHeaderPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /** Section title. Rendered as an <h3> via @m-next/text `as="H3"`. */
  title: PropTypes.node,
  /** Section subtitle. Rendered as a <p> via @m-next/text. */
  subTitle: PropTypes.node,
};

/**
 * SectionHeader — title-plus-subtitle stack for grouping form sections,
 * settings panels, or any content block that needs a hierarchy break.
 *
 *   <SectionHeader
 *     title='Billing details'
 *     subTitle='Used for invoicing and tax purposes.'
 *   />
 *
 * Both `title` and `subTitle` are optional and accept either a plain string
 * or a ReactNode (so you can mix in inline icons, links, or badges). The
 * title renders as a semantic <h3> via @m-next/text — H3 was chosen to
 * preserve the original MethodUI behavior (`<Heading type='h3'>`); deeper
 * sub-sections should override with their own Text component or the
 * upcoming `level` prop (v2). The wrapper carries the original 8px-after-h3
 * and 16px-after-p rhythm via child-selectors on @m-next/tokens spacing.
 */
const SectionHeader = forwardRef(function SectionHeader(props, ref) {
  const {
    id: idProp,
    title,
    subTitle,

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
    internalIdRef.current = `m-next-section-header-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'section-header-forwardRef-prop',
      '@m-next/section-header: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
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
    <s.SectionHeaderWrapper ref={setRef} id={id} {...rest}>
      {title && <Text as='H3'>{title}</Text>}
      {subTitle && <Text as='P'>{subTitle}</Text>}
    </s.SectionHeaderWrapper>
  );
});

SectionHeader.displayName = 'SectionHeader';
SectionHeader.propTypes = sectionHeaderPropTypes;

export default SectionHeader;
export { SectionHeader };
