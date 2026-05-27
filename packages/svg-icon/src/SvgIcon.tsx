import React, { useMemo, useState } from 'react';
import * as s from './SvgIcon.styles';
import iconPaths from './icon-paths';
import { combinedIconMap, combinedIconNames, SvgIconName } from './SvgIconNames';

export interface SvgIconProps {
  id?: string | null;
  testId?: string;
  name?: SvgIconName;
  size?: number;
  offsetX?: number;
  offsetY?: number;
  color?: string;
  hoverColor?: string;
  viewBox?: string;
  className?: string;
  style?: React.CSSProperties;
  stroke?: string;
  strokeWidth?: string;
  caption?: string | null;
  iconRef?: React.LegacyRef<HTMLDivElement>;
  onClick?: (e: any) => void | null;
  isV4Design?: boolean;
  rotate?: string | null;
  disabled?: boolean | null;
  tabIndex?: number | null;
  backgroundColor?: string | null;
  backgroundHoverColor?: string | null;
  isRound?: boolean;
  forwardRef?: React.LegacyRef<HTMLElement>;
  title?: string;
  tooltip?: string;
  tooltipId?: string;
  border?: boolean;
  children?: React.ReactNode;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
}

export const TEST_IDS = {
  ICON_WRAPPER: 'svg-icon-wrapper',
  ICON_SVG: 'svg-icon-svg',
};

const SvgIcon: React.FC<SvgIconProps> = ({
  className = '',
  color = 'currentColor',
  hoverColor = 'currentColor',
  iconRef,
  style,
  id,
  testId,
  name,
  offsetX = 0,
  offsetY = 0,
  onClick = null,
  size,
  stroke = 'inherit',
  strokeWidth = '',
  viewBox = '0 0 1024 1024',
  isV4Design = true,
  rotate = null,
  caption = null,
  disabled = null,
  tabIndex = null,
  backgroundColor = null,
  backgroundHoverColor = null,
  isRound = false,
  forwardRef,
  title,
  tooltip,
  tooltipId,
  border = false,
  children = null,
  onKeyUp,
}) => {
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

    const ariaLabel = disabled
      ? `disabled-${caption || name?.replace('mi-icon-', '')} icon`
      : `${caption || name?.replace('mi-icon-', '')} icon`;

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
        role='img'
        width={`${size}px`}
        height={`${size}px`}
        viewBox={icon.attrs && !Array.isArray(icon.attrs) && icon.attrs.viewBox ? icon.attrs.viewBox : viewBox}
        preserveAspectRatio='none'
        fill={hover ? hoverColor : color}
        xmlns='http://www.w3.org/2000/svg'
        aria-label={ariaLabel}
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

  return (
    <div
      ref={iconRef}
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
        isV4Design={isV4Design}
        size={`${size}px`}
        rotate={rotate}
        disabled={disabled ? 'disabled' : null}
        onKeyUp={handleKeyUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        backgroundColor={backgroundColor}
        backgroundHoverColor={backgroundHoverColor}
        isRound={isRound}
        ref={forwardRef}
        tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
        border={border}
        data-testid={testId ? `${testId}-wrapper` : `${TEST_IDS.ICON_WRAPPER}-${name}`}
      >
        {(children && children) || renderIconComponent()}
      </s.IconWrapper>
    </div>
  );
};

SvgIcon.defaultProps = {
  color: 'currentColor',
  className: '',
  viewBox: '0 0 1024 1024',
  offsetX: 0,
  offsetY: 0,
  stroke: 'inherit',
  strokeWidth: '',
  caption: null,
};

export default SvgIcon;
