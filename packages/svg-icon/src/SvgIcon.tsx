import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import * as s from './SvgIcon.styles';
import iconPaths from './icon-paths';
import { combinedIconMap, combinedIconNames, SvgIconName } from './SvgIconNames';

// One-time deprecation warner — fires once per key, mirrors @m-next/input / @m-next/toggle.
const warnOnce = (() => {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

export interface SvgIconProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id' | 'onClick' | 'tabIndex'> {
  /** Optional id — auto-generated if omitted. */
  id?: string | null;
  testId?: string;
  /** Icon name from the LegacyIcons / v4 / widget icon maps. */
  name?: SvgIconName;
  /** Icon size in pixels (width and height). */
  size?: number;
  offsetX?: number;
  offsetY?: number;
  /** Fill color. CSS color string or token (e.g. colors.blue.base). */
  color?: string;
  hoverColor?: string;
  viewBox?: string;
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
  strokeWidth?: string;
  /** Caption rendered as <title> inside the SVG and used to build the accessible name. */
  caption?: string | null;
  /** Ref forwarded to the wrapping <span>. */
  iconRef?: React.LegacyRef<HTMLDivElement>;
  onClick?: (e: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLDivElement>) => void | null;
  rotate?: string | null;
  disabled?: boolean | null;
  tabIndex?: number | null;
  backgroundColor?: string | null;
  backgroundHoverColor?: string | null;
  isRound?: boolean;
  title?: string;
  tooltip?: string;
  tooltipId?: string;
  border?: boolean;
  children?: React.ReactNode;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;

  /**
   * Accessible label for the icon. When set, the SVG gets `role="img"` +
   * `aria-label={label}`. Pass when the icon conveys meaning that isn't
   * already in adjacent text.
   */
  label?: string;
  /**
   * Mark the icon as purely decorative — sets `aria-hidden="true"` and
   * removes it from the accessibility tree. Use when the icon sits next to
   * a text label that already describes the action.
   */
  decorative?: boolean;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.LegacyRef<HTMLElement>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export const TEST_IDS = {
  ICON_WRAPPER: 'svg-icon-wrapper',
  ICON_SVG: 'svg-icon-svg',
};

const SvgIcon = forwardRef<HTMLDivElement, SvgIconProps>(function SvgIcon(props, ref) {
  const {
    className = '',
    color = 'currentColor',
    hoverColor = 'currentColor',
    iconRef,
    style,
    id: idProp,
    testId,
    name,
    offsetX = 0,
    offsetY = 0,
    onClick = null,
    size,
    stroke = 'inherit',
    strokeWidth = '',
    viewBox = '0 0 1024 1024',
    rotate = null,
    caption = null,
    disabled = null,
    tabIndex = null,
    backgroundColor = null,
    backgroundHoverColor = null,
    isRound = false,
    title,
    tooltip,
    tooltipId,
    border = false,
    children = null,
    onKeyUp,
    label,
    decorative,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts (accepted, no behavior)
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    // Standard DOM envelope — forwarded to the root element below.
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef<string | null>(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-svg-icon-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'svg-icon-forwardRef-prop',
      '@m-next/svg-icon: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain the legacy `forwardRef` prop with the new React `ref`.
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const targets = [legacyForwardRef].filter(Boolean) as Array<React.LegacyRef<HTMLElement>>;
    targets.forEach((target) => {
      if (typeof target === 'function') {
        target(wrapperRef.current);
      } else if (target && typeof target === 'object') {
        (target as React.MutableRefObject<HTMLElement | null>).current = wrapperRef.current;
      }
    });
  }, [legacyForwardRef]);

  const [hover, setHover] = useState(false);
  const isClickable = useMemo(() => onClick && !disabled, [onClick, disabled]);

  const getIcon = (iconName: string) => {
    const paths: {
      icons: {
        properties: { name: string };
        icon: {
          paths: string[];
          attrs?: Record<string, any>;
        };
      }[];
    } = iconPaths;

    const icon = paths.icons.find((ic) => ic.properties.name.split(',').find((val) => val.trim() === iconName));
    if (!icon) {
      return {
        paths: [],
        attrs: [],
      };
    }
    return icon.icon;
  };

  const getPath = (icon: { paths: string[] }) => (icon ? icon.paths.join(' ') : '');

  const handleClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    if (onClick && isClickable) onClick(e);
  };

  // Resolve a11y semantics. Priority:
  //   decorative === true     → aria-hidden, no aria-label
  //   label provided          → aria-label={label}
  //   caption provided        → aria-label derived from caption
  //   otherwise (legacy)      → derived label from icon name
  const isDecorative = decorative === true;
  const resolvedAriaLabel = isDecorative
    ? undefined
    : (label
        ?? (caption ? String(caption) : undefined)
        ?? (disabled
          ? `disabled-${name?.replace('mi-icon-', '')} icon`
          : `${name?.replace('mi-icon-', '')} icon`));

  const renderIconComponent = () => {
    // Some icons have their own custom Components.
    const IconComponent =
      name && combinedIconNames.includes(name) ? combinedIconMap[name as keyof typeof combinedIconMap] : null;
    if (IconComponent) return <IconComponent width={size} height={size} color={hover ? hoverColor : color} />;

    // Some icons are designated by names that are different to how they are stored in code
    const nameRemaps: Record<string, string> = {
      'mi-icon-refresh': 'synchronize-31',
      'icon-star': 'caution-solid',
      'mi-icon-flag_square': 'flag_sqaure', // note typo in 'sqaure'
      'mi-icon-square': 'sqaure', // note typo in 'sqaure' again
    };
    const requestableName = name && nameRemaps[name] ? nameRemaps[name] : name?.replace('mi-icon-', '');

    const icon = getIcon(requestableName ?? '');

    // The `<path>` fill value is usually undefined and inherited from the `color` prop on parent `svg` but there are special cases:
    let computedFill;
    if (icon.attrs) {
      if (!Array.isArray(icon.attrs) && typeof icon.attrs.fill === 'string') {
        computedFill = icon.attrs.fill === 'black' ? stroke : icon.attrs.fill;
      }
    }
    if (typeof computedFill !== 'string' || computedFill === '') computedFill = undefined;

    return (
      <svg
        role={isDecorative ? undefined : 'img'}
        aria-hidden={isDecorative || undefined}
        aria-label={resolvedAriaLabel}
        width={`${size}px`}
        height={`${size}px`}
        viewBox={icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.viewBox ? icon.attrs.viewBox : viewBox}
        preserveAspectRatio='none'
        fill={hover ? hoverColor : color}
        xmlns='http://www.w3.org/2000/svg'
        transform={icon.attrs && !Array.isArray(icon.attrs) ? icon.attrs.transform : undefined}
        data-testid={testId ? `${testId}-svg` : `${TEST_IDS.ICON_SVG}-${name}`}
      >
        <path
          d={getPath(icon)}
          stroke={icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.stroke ? color : stroke}
          strokeWidth={
            icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.strokeWidth ? icon.attrs.strokeWidth : strokeWidth
          }
          fillRule={icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.fillRule ? icon.attrs.fillRule : undefined}
          clipRule={icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.clipRule ? icon.attrs.clipRule : undefined}
          fill={computedFill}
          strokeLinecap={
            icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.strokeLinecap
              ? (icon.attrs.strokeLinecap as 'inherit' | 'round' | 'square' | 'butt')
              : undefined
          }
          strokeLinejoin={
            icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.strokeLinejoin
              ? (icon.attrs.strokeLinejoin as 'inherit' | 'round' | 'miter' | 'bevel')
              : undefined
          }
        />
        {caption ? <title>{caption}</title> : null}
      </svg>
    );
  };

  if (!name && !children) return null;

  const handleMouseLeave: React.MouseEventHandler<HTMLSpanElement> = () => {
    if (hoverColor) setHover(false);
  };
  const handleMouseEnter: React.MouseEventHandler<HTMLSpanElement> = () => {
    if (hoverColor) setHover(true);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (onKeyUp) onKeyUp(e);
    if (e.key === 'Enter' || e.key === 'Space') {
      e.preventDefault();
      if (onClick && isClickable) onClick(e);
    }
  };

  // Chain wrapper span refs: internal wrapperRef (for legacy forwardRef
  // bridging) + legacy forwardRef prop happens via the effect above.
  const setWrapperRef = (node: HTMLSpanElement | null) => {
    wrapperRef.current = node;
  };

  return (
    <div
      {...rest}
      ref={(node) => {
        // Mirror to iconRef (legacy) and to the new React ref (forwarded).
        if (typeof iconRef === 'function') iconRef(node);
        else if (iconRef && typeof iconRef === 'object') {
          (iconRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        if (typeof ref === 'function') ref(node);
        else if (ref && typeof ref === 'object') {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className={className}
      data-testid={testId}
      style={style}
      title={title}
      data-tooltip-id={tooltipId}
      data-tooltip-html={tooltip}
    >
      <s.IconWrapper
        id={id ?? undefined}
        offsetX={offsetX}
        offsetY={offsetY}
        color={color}
        hoverColor={hoverColor}
        onClick={handleClick}
        isClickable={!!isClickable}
        isV4Design
        size={`${size}px`}
        rotate={rotate}
        disabled={disabled ? 'disabled' : null}
        onKeyUp={handleKeyUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        backgroundColor={backgroundColor}
        backgroundHoverColor={backgroundHoverColor}
        isRound={isRound}
        ref={setWrapperRef}
        tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
        border={border}
        data-testid={testId ? `${testId}-wrapper` : `${TEST_IDS.ICON_WRAPPER}-${name}`}
      >
        {(children && children) || renderIconComponent()}
      </s.IconWrapper>
    </div>
  );
});

SvgIcon.displayName = 'SvgIcon';

export default SvgIcon;
