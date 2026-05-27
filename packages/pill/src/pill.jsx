import * as React from 'react';
import { forwardRef } from 'react';
import { interactions } from '@m-next/utilities';
import SvgIcon from '@m-next/svg-icon';
import AvatarImage from '@m-next/image/src/AvatarImage';
import * as s from './pill.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/button / @m-next/input.
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

// Legacy size aliases — soft-shimmed.
const LEGACY_SIZE_MAP = { narrow: 'sm', regular: 'md' };

// Legacy colorScheme aliases — `v4-*` were a parallel palette; strip the prefix.
// `gray` → `grey` (US/UK spelling normalization).
const LEGACY_COLOR_MAP = {
  'v4-blue': 'blue',
  'v4-red': 'red',
  'v4-yellow': 'yellow',
  'v4-purple': 'purple',
  'v4-green': 'green',
  'v4-gray': 'grey',
  'v4-orange': 'orange',
};

const VALID_SIZES = ['sm', 'md'];
const VALID_VARIANTS = ['subtle', 'solid', 'ghost'];
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
  'transparent',
];

const Pill = forwardRef(function Pill(props, ref) {
  const {
    id: idProp,

    // Clean API
    size: sizeProp,
    variant = 'subtle',
    colorScheme: colorSchemeProp = 'blue',
    maxWidth = '100%',
    leadIcon = null,
    trailIcon = null,
    profileIcon = null,
    className = null,
    style = {},
    textStyle = {},
    children,
    onClick,
    onDelete,
    disabled = false,
    bold = true,
    fontSize = 12,
    tooltip,
    tooltipId,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,

    ...rest
  } = props;

  // ============ Auto-id ============

  const internalIdRef = React.useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-pill-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  // size: 'narrow' | 'regular' → 'sm' | 'md'
  let size = sizeProp;
  if (size != null && Object.prototype.hasOwnProperty.call(LEGACY_SIZE_MAP, size)) {
    warnOnce(
      `pill-size-${size}`,
      `@m-next/pill: \`size="${size}"\` is deprecated. Use \`size="${LEGACY_SIZE_MAP[size]}"\`.`,
    );
    size = LEGACY_SIZE_MAP[size];
  }
  if (size == null) size = 'md';
  if (!VALID_SIZES.includes(size)) {
    warnOnce(
      `pill-size-invalid-${size}`,
      `@m-next/pill: invalid \`size="${size}"\`. Expected one of ${VALID_SIZES.join(', ')}. Falling back to 'md'.`,
    );
    size = 'md';
  }

  // colorScheme: v4-* aliases
  let colorScheme = colorSchemeProp;
  if (colorScheme != null && Object.prototype.hasOwnProperty.call(LEGACY_COLOR_MAP, colorScheme)) {
    warnOnce(
      `pill-colorScheme-${colorScheme}`,
      `@m-next/pill: \`colorScheme="${colorScheme}"\` is deprecated. Use \`colorScheme="${LEGACY_COLOR_MAP[colorScheme]}"\`.`,
    );
    colorScheme = LEGACY_COLOR_MAP[colorScheme];
  }
  if (!VALID_COLORS.includes(colorScheme)) {
    warnOnce(
      `pill-colorScheme-invalid-${colorScheme}`,
      `@m-next/pill: invalid \`colorScheme="${colorScheme}"\`. Expected one of ${VALID_COLORS.join(', ')}. Falling back to 'blue'.`,
    );
    colorScheme = 'blue';
  }

  // variant
  if (!VALID_VARIANTS.includes(variant)) {
    warnOnce(
      `pill-variant-invalid-${variant}`,
      `@m-next/pill: invalid \`variant="${variant}"\`. Expected one of ${VALID_VARIANTS.join(', ')}. Falling back to 'subtle'.`,
    );
  }
  const resolvedVariant = VALID_VARIANTS.includes(variant) ? variant : 'subtle';

  // legacy forwardRef prop
  if (legacyForwardRef) {
    warnOnce(
      'pill-forwardRef-prop',
      '@m-next/pill: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Render ============

  const lookupSpacing = (s1, s2) => (size === 'sm' ? s1 : s2);

  const CSSProperties = {
    lead: {
      display: 'inline-block',
      flexShrink: 0,
      margin: lookupSpacing('0 4px 0 0', '0 4px 0 2px'),
    },
    trail: {
      display: 'inline-block',
      flexShrink: 0,
      marginLeft: 4,
    },
    profile: {
      display: 'inline-flex',
      margin: lookupSpacing('0 4px 0 0', '0 4px 0 2px'),
    },
  };

  const leadIconSize = lookupSpacing(14, 14);
  const profileIconSize = lookupSpacing('12px', '16px');

  const handleClick = (e) => {
    interactions.preventPropagation(e);
    if (onClick) onClick(e);
  };

  const handleDelete = (e) => {
    interactions.preventPropagation(e);
    if (onDelete) onDelete(e);
  };

  const hasClick = !disabled && !!onClick;

  // Chain external ref (forwardRef API + legacy forwardRef prop).
  const handleRef = (node) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
    if (typeof legacyForwardRef === 'function') legacyForwardRef(node);
    else if (legacyForwardRef) legacyForwardRef.current = node;
  };

  return (
    <s.Wrapper
      id={id}
      className={className}
      style={style}
      ref={handleRef}
      maxWidth={maxWidth}
      variant={resolvedVariant}
      size={size}
      colorScheme={colorScheme}
      hasClick={hasClick}
      hasProfileIcon={!!profileIcon}
      onClick={hasClick ? handleClick : null}
      data-tooltip-id={tooltipId}
      data-tooltip-html={tooltip}
      {...rest}
    >
      {leadIcon &&
        // eslint-disable-next-line no-nested-ternary
        (leadIcon.name === 'dot' ? (
          <s.Dot
            id={`pill-dot-${id}`}
            className="pill-lead-icon--dot"
            role="presentation"
            aria-label={leadIcon.label}
            size={size}
            colorScheme={colorScheme}
            onClick={hasClick ? handleClick : null}
          />
        ) : !leadIcon.showTooltip ? (
          <SvgIcon
            id={`pill-dot-icon-${id}`}
            className="pill-lead-icon-no-tooltip"
            style={{
              ...CSSProperties.lead,
              color: leadIcon.color ? leadIcon.color : 'inherit',
            }}
            isV4Design
            name={leadIcon.name}
            size={leadIcon.size ? leadIcon.size : leadIconSize}
            onClick={hasClick ? handleClick : null}
          />
        ) : (
          <s.Tooltip ml="0">
            <SvgIcon
              id={`pill-dot-icon-${id}`}
              className="pill-lead-icon"
              style={{
                ...CSSProperties.lead,
                color: leadIcon.color ? leadIcon.color : 'inherit',
              }}
              isV4Design
              name={leadIcon.name}
              size={leadIcon.size ? leadIcon.size : leadIconSize}
              tooltipId={`pill-tooltip-${id}`}
              tooltip="{leadIcon.label}"
              onClick={hasClick ? handleClick : null}
            />
            <s.TooltipIconDescription className="tooltip-text">
              {leadIcon.label}
            </s.TooltipIconDescription>
          </s.Tooltip>
        ))}

      {profileIcon && (
        <AvatarImage
          id={`pill-profile-icon-${id}`}
          className="pill-profile-icon"
          imageSrc={profileIcon.name}
          style={CSSProperties.profile}
          caption={profileIcon.label}
          size={profileIcon.size ? profileIcon.size : profileIconSize}
        />
      )}

      <s.Text
        id={`pill-text-${id}`}
        data-testid={`pill-text-${id}`}
        className="pill-text"
        size={size}
        colorScheme={colorScheme}
        disabled={disabled}
        style={textStyle}
        hasIcon={!!leadIcon}
        bold={bold}
        overrideFontSize={fontSize}
        onClick={hasClick ? handleClick : null}
      >
        {children}
      </s.Text>

      {trailIcon &&
        (trailIcon.name === 'dot' ? (
          <s.Dot
            id={`pill-dot-${id}`}
            role="presentation"
            aria-label={trailIcon.label}
            size={size}
            colorScheme={colorScheme}
            onClick={hasClick ? handleClick : null}
          />
        ) : (
          <SvgIcon
            id={`pill-dot-${id}`}
            style={CSSProperties.trail}
            name={trailIcon.name}
            size={trailIcon.size ? trailIcon.size : leadIconSize}
            caption={trailIcon.label}
            onClick={hasClick ? handleClick : null}
          />
        ))}

      {onDelete && (
        <SvgIcon
          id={`pill-remove-${id}`}
          name="close-V4"
          size={8}
          onClick={disabled ? null : handleDelete}
          style={{ marginLeft: 8 }}
        />
      )}
    </s.Wrapper>
  );
});

Pill.displayName = 'Pill';

export default Pill;
