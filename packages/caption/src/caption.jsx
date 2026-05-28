import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { lightTheme, convertLegacyCaptionStyle } from '@m-next/styles';
import { colors } from '@m-next/tokens';
import * as s from './caption.styles';

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

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  htmlFor: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  color: PropTypes.string,
  required: PropTypes.bool,
  isValid: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  focused: PropTypes.bool,
  float: PropTypes.bool,
  floatYPos: PropTypes.number,
  floatXPosFocus: PropTypes.string,
  floatXPosUnfocus: PropTypes.string,
  narrow: PropTypes.bool,
  style: PropTypes.shape({}),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

/**
 * Caption — the label/text companion for form controls (Input, Dropdown,
 * MultiSelect, etc.) and standalone informational text. Renders a real
 * `<label htmlFor>` when associated with a form field; falls back to a
 * neutral block element when standalone.
 *
 * Forked from `@m-one/caption` and normalized to the m-next API
 * conventions: `htmlFor` (React idiom) instead of `elFor`, `label`
 * instead of `caption`, and the floating-label positioning props kept
 * intact because they're real visual modes that drive the field
 * `float-above-input` UX used by Input, Dropdown, etc.
 */
const Caption = forwardRef(function Caption(props, ref) {
  const {
    // Clean API
    id: idProp,
    label: labelProp,
    htmlFor: htmlForProp,
    align = 'left',
    color,
    required = false,
    isValid = true,
    disabled = false,
    readOnly: readOnlyProp,
    focused = false,
    float = false,
    floatYPos = 9,
    floatXPosFocus = null,
    floatXPosUnfocus = null,
    narrow = false,
    style = null,
    className,
    onClick = null,

    // Soft-shimmed legacy props
    caption: legacyCaption,
    elFor: legacyElFor,
    readonly: legacyReadonly,
    forwardRef: legacyForwardRef,
    legacyClass,

    // Silently ignored legacy ghosts — accepted, no behavioral effect.
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    isLabelBolded: _isLabelBolded,
    background: _background,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-caption-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption !== undefined && label === undefined) {
    warnOnce(
      'caption-caption',
      '@m-next/caption: `caption` is deprecated. Use `label`.',
    );
    label = legacyCaption;
  }

  let htmlFor = htmlForProp;
  if (legacyElFor !== undefined && htmlFor === undefined) {
    warnOnce(
      'caption-elFor',
      '@m-next/caption: `elFor` is deprecated. Use `htmlFor` (standard React naming).',
    );
    htmlFor = legacyElFor;
  }

  let readOnly = readOnlyProp;
  if (legacyReadonly !== undefined && readOnly === undefined) {
    warnOnce(
      'caption-readonly',
      '@m-next/caption: `readonly` is deprecated. Use `readOnly` (standard React casing).',
    );
    readOnly = legacyReadonly;
  }

  if (legacyForwardRef) {
    warnOnce(
      'caption-forwardRef-prop',
      '@m-next/caption: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  if (legacyClass) {
    warnOnce(
      'caption-legacyClass',
      '@m-next/caption: `legacyClass` is deprecated. Use `className` or `style`.',
    );
  }

  // Merge external ref (forwardRef API + legacy forwardRef prop).
  const handleRef = (node) => {
    const targets = [ref, legacyForwardRef];
    targets.forEach((target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(node);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = node;
      }
    });
  };

  // Resolve the displayed label. We keep dangerouslySetInnerHTML for
  // backwards-compat with legacy consumers (grid headers, etc.) that pass
  // HTML strings — only when `label` is a string. When `label` is a
  // ReactNode we render it as a normal child.
  const isHtmlString = typeof label === 'string';
  const sharedProps = {
    ref: handleRef,
    id: `${id}-Caption`,
    htmlFor,
    className,
    align,
    color: isValid ? color : lightTheme.negative.secondary,
    style: {
      ...convertLegacyCaptionStyle(legacyClass),
      ...style,
    },
    // `isV4Design` is the legacy floating-label switch. We always enable
    // V4 styling in the new API — callers no longer need to opt in.
    isV4Design: true,
    float,
    focused,
    disabled,
    readOnly,
    isValid,
    floatYPos,
    floatXPosFocus,
    floatXPosUnfocus,
    // Bold-label visual is the m-next default; the legacy
    // `isLabelBolded` toggle is silently ignored.
    isLabelBolded: true,
    narrow,
    onClick,
    ...rest,
  };

  if (isHtmlString) {
    const trimmedHtml = label.trim();
    return (
      <s.CaptionWrapper
        {...sharedProps}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: required
            ? `${trimmedHtml}<span style="color: ${colors.red.base}">*</span>`
            : trimmedHtml,
        }}
      />
    );
  }

  return (
    <s.CaptionWrapper {...sharedProps}>
      {label}
      {required ? <span style={{ color: colors.red.base }}>*</span> : null}
    </s.CaptionWrapper>
  );
});

Caption.displayName = 'Caption';
Caption.propTypes = propTypes;

export default Caption;
