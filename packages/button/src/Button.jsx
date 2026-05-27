import React, { forwardRef } from 'react';
import SvgIcon from '@m-next/svg-icon';
import { ButtonStyled } from './Button.styles';

// One-time deprecation warner.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

const LEGACY_VARIANT_MAP = {
  primary: 'primary',
  'v4-primary': 'primary',
  link: 'link',
  ghost: 'ghost',
  plain: 'ghost',
  // radio / radio-selected intentionally absent — use a SegmentedControl/RadioGroup.
};

const LEGACY_SIZE_MAP = {
  small: 'sm',
  medium: 'md',
};

const Button = forwardRef(function Button(props, ref) {
  const {
    children,
    variant: variantProp,
    size: sizeProp,
    leftIcon: leftIconProp,
    rightIcon: rightIconProp,
    fullWidth = false,
    disabled = false,
    type = 'button',
    onClick,
    // Legacy props (soft shim — warn once, then translate)
    value,
    buttonStyle,
    icon,
    forwardRef: legacyForwardRef,
    // Legacy props (silently ignored — no behavior to preserve)
    isV4Design: _ignored1,
    isMobile: _ignored2,
    visible: _ignored3,
    classes: _ignored4,
    widthType: _ignored5,
    width: _ignored6,
    // Legacy props (hard-broken — warn so consumers know)
    isDangerous,
    tooltip,
    tooltipId,
    backgroundColor,
    borderColor,
    borderRadius,
    fontSize,
    color,
    ...rest
  } = props;

  let variant = variantProp;
  let size = sizeProp;
  let leftIcon = leftIconProp;
  let rightIcon = rightIconProp;
  let content = children;

  // Legacy: value → children
  if (content == null && value != null) {
    warnOnce(
      'button-value',
      '@m-next/button: `value` prop is deprecated. Pass content as children: <Button>Save</Button>',
    );
    content = value;
  }

  // Legacy: buttonStyle → variant
  if (variant == null && buttonStyle != null) {
    warnOnce(
      'button-buttonStyle',
      '@m-next/button: `buttonStyle` is deprecated. Use `variant`. (radio / radio-selected are no longer supported — use a SegmentedControl.)',
    );
    variant = LEGACY_VARIANT_MAP[buttonStyle] || 'primary';
  }
  if (variant == null) variant = 'primary';

  // Legacy: size 'small'/'medium' → 'sm'/'md'
  if (size === 'small' || size === 'medium') {
    warnOnce(
      'button-size-legacy',
      `@m-next/button: size="${size}" is deprecated. Use "sm" / "md" / "lg".`,
    );
    size = LEGACY_SIZE_MAP[size];
  }
  if (size == null) size = 'md';

  // Legacy: icon object → leftIcon / rightIcon
  if (icon && !leftIcon && !rightIcon) {
    warnOnce(
      'button-icon-object',
      '@m-next/button: `icon={{ name, size, color, position }}` is deprecated. Use `leftIcon` or `rightIcon` ReactNodes.',
    );
    const iconEl = <SvgIcon name={icon.name} size={icon.size} color={icon.color} />;
    if (icon.position === 'right') rightIcon = iconEl;
    else leftIcon = iconEl;
  }

  // Hard-break notices (no shim — these were unsafe or out of scope)
  if (isDangerous) {
    warnOnce(
      'button-isDangerous',
      '@m-next/button: `isDangerous` (HTML rendering via dangerouslySetInnerHTML) was removed for security. Pass ReactNode children instead.',
    );
  }
  if (tooltip || tooltipId) {
    warnOnce(
      'button-tooltip',
      '@m-next/button: `tooltip` / `tooltipId` were removed. Compose with <Tooltip> from @m-next/tooltip.',
    );
  }
  if (legacyForwardRef) {
    warnOnce(
      'button-forwardRef-prop',
      '@m-next/button: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }
  if (backgroundColor || borderColor || borderRadius || fontSize || color) {
    warnOnce(
      'button-style-overrides',
      '@m-next/button: per-prop style overrides (backgroundColor, borderColor, borderRadius, fontSize, color) were removed. Use `variant` or pass `style={{ ... }}` for one-off escape hatches.',
    );
  }

  return (
    <ButtonStyled
      ref={ref ?? legacyForwardRef}
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={onClick}
      {...rest}
    >
      {leftIcon}
      {content}
      {rightIcon}
    </ButtonStyled>
  );
});

Button.displayName = 'Button';

export default Button;
