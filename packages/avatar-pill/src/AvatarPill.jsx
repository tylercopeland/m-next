import React, { forwardRef, isValidElement, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as s from './AvatarPill.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/sidebar
// and @m-next/pill.
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

const VALID_SIZES = ['sm', 'md', 'lg'];
const VALID_VARIANTS = ['subtle', 'solid'];
const VALID_COLORS = [
  'blue',
  'green',
  'fuchsia',
  'grey',
  'yellow',
  'red',
  'purple',
  'orange',
  'teal',
];

// Legacy size aliases — soft-shimmed from the MethodUI AvatarPill API.
const LEGACY_SIZE_MAP = { narrow: 'sm', regular: 'md' };

// Built-in close glyph for trailing dismiss buttons. Inline SVG keeps us
// dep-free; consumers can pass a custom `trailingIcon` for anything else.
const CloseGlyph = () => (
  <svg
    width='100%'
    height='100%'
    viewBox='0 0 10 10'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    focusable='false'
  >
    <path
      d='M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
    />
  </svg>
);

// Derive initials from a free-text label when the consumer hasn't supplied
// any. Used as a fallback render for the avatar circle so an AvatarPill
// always has SOMETHING in the avatar slot — even when only `children` is
// provided.
const deriveInitials = (text) => {
  if (!text || typeof text !== 'string') return '';
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const avatarShape = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.shape({
    src: PropTypes.string,
    initials: PropTypes.string,
    alt: PropTypes.string,
  }),
]);

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /**
   * Avatar to display on the left edge. Accepts either:
   *   - A ReactNode (e.g. <Avatar size='sm' ... />) — rendered as-is.
   *   - A config object {src?, initials?, alt?} — AvatarPill renders the
   *     circle itself (src wins; initials are the text fallback).
   */
  avatar: avatarShape,
  /** Color scheme — drives the chip background and the initial-avatar fill. */
  colorScheme: PropTypes.oneOf(VALID_COLORS),
  /** Background variant — 'subtle' (lighter) or 'solid' (light). */
  variant: PropTypes.oneOf(VALID_VARIANTS),
  /** Size of the chip. */
  size: PropTypes.oneOf(VALID_SIZES),
  /** Optional icon rendered before the avatar (e.g. status dot, lock). */
  leadingIcon: PropTypes.node,
  /** Optional icon rendered after the label. If onTrailingIconClick is also
   *  set, the trailing icon becomes a real <button>. */
  trailingIcon: PropTypes.node,
  /** Click handler for the trailing icon button. When set without an explicit
   *  trailingIcon node, a default × glyph is rendered. */
  onTrailingIconClick: PropTypes.func,
  /** Accessible label for the trailing icon button (e.g. "Remove tag"). */
  trailingIconLabel: PropTypes.string,
  /** Click handler for the chip as a whole. Promotes the chip to a button-like
   *  affordance with hover + focus-visible feedback. */
  onClick: PropTypes.func,
  /** Cap the rendered width — long labels truncate with an ellipsis. */
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Convenience label prop. Equivalent to `children` — used when children
   *  is awkward (e.g. iterating over a data array). */
  label: PropTypes.node,
  /** Displayed text. */
  children: PropTypes.node,

  className: PropTypes.string,
  style: PropTypes.object,

  // Soft-shimmed legacy props
  forwardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  leadIcon: PropTypes.node,
  trailIcon: PropTypes.node,

  // Silently ignored legacy ghosts
  isV4Design: PropTypes.bool,
  isMobile: PropTypes.bool,
  legacyClass: PropTypes.string,
  displayAuto: PropTypes.bool,
  compactStyle: PropTypes.bool,
  hidden: PropTypes.bool,
};

/**
 * AvatarPill — entity-reference chip.
 *
 *   <AvatarPill avatar={{ initials: 'TC' }} colorScheme='blue'>
 *     Tyler Copeland
 *   </AvatarPill>
 *
 *   <AvatarPill
 *     avatar={{ src: '/me.jpg', alt: 'Tyler' }}
 *     trailingIcon  // default ×
 *     onTrailingIconClick={removeTag}
 *     trailingIconLabel='Remove Tyler'
 *   >
 *     Tyler Copeland
 *   </AvatarPill>
 *
 * Sibling primitives:
 *   - @m-next/pill   — text-only chip (no avatar slot)
 *   - @m-next/badge  — non-interactive status indicator
 *
 * AvatarPill is the chip you reach for when the entity is a USER, CUSTOMER,
 * or any other thing that has a visual identity (initials or photo).
 *
 * The `avatar` prop accepts BOTH a ReactNode and a `{src, initials, alt}`
 * config object — the object form is the common case (data-driven lists),
 * the ReactNode form is the escape hatch (consumer wants to drop in a
 * fully-styled <Avatar /> from elsewhere).
 */
const AvatarPill = forwardRef(function AvatarPill(props, ref) {
  const {
    id: idProp,
    avatar = null,
    colorScheme: colorSchemeProp = 'blue',
    variant: variantProp = 'subtle',
    size: sizeProp = 'md',
    leadingIcon = null,
    trailingIcon: trailingIconProp,
    onTrailingIconClick,
    trailingIconLabel = 'Remove',
    onClick,
    maxWidth,
    label,
    children,
    className,
    style,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    leadIcon: legacyLeadIcon,
    trailIcon: legacyTrailIcon,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // ============ Auto-id ============
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-avatar-pill-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  // size
  let size = sizeProp;
  if (size != null && Object.prototype.hasOwnProperty.call(LEGACY_SIZE_MAP, size)) {
    warnOnce(
      `avatar-pill-size-${size}`,
      `@m-next/avatar-pill: \`size="${size}"\` is deprecated. Use \`size="${LEGACY_SIZE_MAP[size]}"\`.`,
    );
    size = LEGACY_SIZE_MAP[size];
  }
  if (!VALID_SIZES.includes(size)) {
    warnOnce(
      `avatar-pill-size-invalid-${size}`,
      `@m-next/avatar-pill: invalid \`size="${size}"\`. Expected one of ${VALID_SIZES.join(', ')}. Falling back to 'md'.`,
    );
    size = 'md';
  }

  // colorScheme
  let colorScheme = colorSchemeProp;
  if (!VALID_COLORS.includes(colorScheme)) {
    warnOnce(
      `avatar-pill-colorScheme-invalid-${colorScheme}`,
      `@m-next/avatar-pill: invalid \`colorScheme="${colorScheme}"\`. Expected one of ${VALID_COLORS.join(', ')}. Falling back to 'blue'.`,
    );
    colorScheme = 'blue';
  }

  // variant
  let variant = variantProp;
  if (!VALID_VARIANTS.includes(variant)) {
    warnOnce(
      `avatar-pill-variant-invalid-${variant}`,
      `@m-next/avatar-pill: invalid \`variant="${variant}"\`. Expected one of ${VALID_VARIANTS.join(', ')}. Falling back to 'subtle'.`,
    );
    variant = 'subtle';
  }

  if (legacyForwardRef) {
    warnOnce(
      'avatar-pill-forwardRef-prop',
      '@m-next/avatar-pill: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }
  if (legacyLeadIcon !== undefined) {
    warnOnce(
      'avatar-pill-leadIcon-prop',
      '@m-next/avatar-pill: `leadIcon` is deprecated. Use `leadingIcon`.',
    );
  }
  if (legacyTrailIcon !== undefined) {
    warnOnce(
      'avatar-pill-trailIcon-prop',
      '@m-next/avatar-pill: `trailIcon` is deprecated. Use `trailingIcon` + `onTrailingIconClick`.',
    );
  }

  // Resolve leading + trailing icons (modern wins; legacy is a fallback).
  const resolvedLeading = leadingIcon ?? legacyLeadIcon ?? null;
  const resolvedTrailing = trailingIconProp !== undefined ? trailingIconProp : legacyTrailIcon;

  // ============ Chain ref + legacy forwardRef ============
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

  // ============ Avatar rendering ============
  //
  // Three input shapes to handle:
  //   1) avatar is a valid React element — render as-is.
  //   2) avatar is a {src, initials, alt} config — render an Avatar circle.
  //   3) avatar is null/undefined — derive initials from label/children.
  //
  // (3) is the "always render the avatar slot" default — an AvatarPill
  // without a visible avatar reads as a regular Pill, which is a different
  // primitive. We want the avatar circle to always be present.
  const labelText = label ?? children;
  let avatarNode = null;

  if (avatar && isValidElement(avatar)) {
    avatarNode = avatar;
  } else if (avatar && typeof avatar === 'object') {
    const { src, initials, alt } = avatar;
    if (src) {
      avatarNode = (
        <s.Avatar size={size} colorScheme={colorScheme} aria-hidden={!alt}>
          <s.AvatarImg src={src} alt={alt || ''} />
        </s.Avatar>
      );
    } else {
      const text = initials || deriveInitials(typeof labelText === 'string' ? labelText : '');
      avatarNode = (
        <s.Avatar
          size={size}
          colorScheme={colorScheme}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        >
          {text}
        </s.Avatar>
      );
    }
  } else {
    const text = deriveInitials(typeof labelText === 'string' ? labelText : '');
    avatarNode = (
      <s.Avatar size={size} colorScheme={colorScheme} aria-hidden='true'>
        {text}
      </s.Avatar>
    );
  }

  // ============ Trailing icon rendering ============
  //
  // If `onTrailingIconClick` is set, wrap in a real <button> for proper
  // keyboard + screen-reader semantics. The glyph itself defaults to a ×
  // when `trailingIcon` is undefined OR just `true`.
  const hasTrailingClick = typeof onTrailingIconClick === 'function';
  const trailingGlyph = (() => {
    if (resolvedTrailing && resolvedTrailing !== true) return resolvedTrailing;
    if (hasTrailingClick || resolvedTrailing === true) return <CloseGlyph />;
    return null;
  })();

  const handleTrailingClick = (e) => {
    // Stop the parent chip's onClick from firing.
    e.stopPropagation();
    if (onTrailingIconClick) onTrailingIconClick(e);
  };

  // ============ Render ============
  const hasClick = typeof onClick === 'function';

  return (
    <s.Wrapper
      ref={setRef}
      id={id}
      className={className}
      style={style}
      size={size}
      colorScheme={colorScheme}
      variant={variant}
      maxWidth={typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth}
      hasClick={hasClick}
      onClick={hasClick ? onClick : undefined}
      role={hasClick ? 'button' : undefined}
      tabIndex={hasClick ? 0 : undefined}
      {...rest}
    >
      {resolvedLeading && (
        <s.IconSlot size={size} aria-hidden='true'>
          {resolvedLeading}
        </s.IconSlot>
      )}

      {avatarNode}

      <s.Label size={size}>{labelText}</s.Label>

      {trailingGlyph && hasTrailingClick && (
        <s.TrailButton
          type='button'
          size={size}
          onClick={handleTrailingClick}
          aria-label={trailingIconLabel}
        >
          {trailingGlyph}
        </s.TrailButton>
      )}
      {trailingGlyph && !hasTrailingClick && (
        <s.IconSlot size={size} aria-hidden='true'>
          {trailingGlyph}
        </s.IconSlot>
      )}
    </s.Wrapper>
  );
});

AvatarPill.displayName = 'AvatarPill';
AvatarPill.propTypes = propTypes;

export default AvatarPill;
