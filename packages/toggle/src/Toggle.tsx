import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import SvgIcon from '@m-next/svg-icon';
import type { SvgIconName } from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import * as s from './toggle.styles';
import { getOnText, getOffText } from './textOptions';
import type { ToggleProps } from './types';

const ZERO_WIDTH_SPACE = '​';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
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

/**
 * Toggle component: accessible switch/checkbox-style control.
 * Supports runtime (with optional Yes/No, On/Off, True/False labels) and design-time modes.
 */
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(props, ref) {
  const {
    id: idProp,
    disabled = false,
    checked = false,
    onChange = null,
    onBlur = null,
    onFocus = null,
    alignRight = false,
    isRuntime = false,
    textOpt = 'Blank',
    width = 'auto',
    color = null,
    label = null,
    style = {},
    labelStyle = {},
    bold = false,
    tooltip,
    tooltipId,
    icon,
    size = 'medium',

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,
    displayAuto: _displayAuto,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef<string | null>(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-toggle-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'toggle-forwardRef-prop',
      '@m-next/toggle: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ State ============

  const [hasFocus, setFocus] = useState(false);
  const [isChecked, setIsChecked] = useState(checked);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Expose the input element through both the React ref (forwardRef API)
  // and the legacy `forwardRef` prop.
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  useEffect(() => {
    if (!legacyForwardRef) return;
    if (typeof legacyForwardRef === 'function') {
      legacyForwardRef(inputRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      (legacyForwardRef as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current;
    }
  }, [legacyForwardRef]);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleFocus = () => {
    setFocus(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocus(false);
    onBlur?.();
  };

  const handleChange = () => {
    setIsChecked(!isChecked);
    onChange?.(!isChecked);
  };

  const onText = getOnText(textOpt) ?? ZERO_WIDTH_SPACE;
  const offText = getOffText(textOpt) ?? ZERO_WIDTH_SPACE;

  return (
    <>
      {isRuntime && (
        <s.Wrapper id={id} width={width} style={style} alignRight={alignRight} isRuntime={isRuntime}>
          {label && (
            <Caption
              id={`${id}-toggle-caption`}
              data-testid={`${id}-toggle-caption`}
              required={false}
              label={label}
              isValid
              isV4Design={false}
              isMobile={false}
              float={hasFocus}
              focused={hasFocus}
              elFor={`${id}-Toggle`}
              disabled={disabled}
              isLabelBolded={bold}
              style={{
                display: 'inline-block',
                width: 'unset',
                paddingLeft: '5px',
                paddingTop: '5px',
                paddingRight: '5px',
                float: alignRight ? 'right' : 'left',
                fontWeight: bold ? 600 : 400,
              }}
            />
          )}
          <s.ToggleWrapper
            htmlFor={`${id}-Toggle`}
            disabled={disabled}
            alignRight={alignRight}
            isFocused={hasFocus}
            isRuntime={isRuntime}
          >
            <s.Input
              ref={inputRef}
              id={`${id}-Toggle`}
              data-testid={`${id}-Toggle-input`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              checked={isChecked}
              type='checkbox'
              disabled={disabled}
              aria-checked={isChecked}
              color={color ?? undefined}
              role='switch'
              tabIndex={0}
            />
            <s.Track
              className='toggle-track'
              checked={isChecked}
              isRuntime={isRuntime}
              size={size}
              color={color ?? undefined}
            >
              <s.OnText checked={isChecked}>{onText}</s.OnText>
              <s.OffText checked={isChecked}>{offText}</s.OffText>
              <s.Circle
                className='toggle-circle'
                checked={isChecked}
                focused={hasFocus}
                size={size}
                isRuntime={isRuntime}
                sizeVariant={size}
                color={color ?? undefined}
              />
            </s.Track>
          </s.ToggleWrapper>
        </s.Wrapper>
      )}
      {!isRuntime && (
        <s.Wrapper
          width={width}
          style={style}
          alignRight={alignRight}
          data-testid={`${id}-Toggle-wrapper`}
        >
          {(label || labelStyle) && (
            <s.Label bold={bold} alignRight={alignRight} style={labelStyle}>
              {icon && <SvgIcon name={icon as SvgIconName} size={10} />}
              <s.LabelText data-tooltip-id={tooltipId} data-tooltip-html={tooltip} hasTooltip={!!tooltip}>
                {label}
              </s.LabelText>
            </s.Label>
          )}

          <s.ToggleWrapper disabled={disabled} alignRight={alignRight} htmlFor={id} size={size}>
            <s.Input
              ref={inputRef}
              id={id}
              data-testid={`${id}-Toggle-input`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              checked={isChecked}
              type='checkbox'
              disabled={disabled}
              aria-checked={isChecked}
              role='switch'
            />
            <s.Track className='toggle-track' checked={isChecked} size={size} color={undefined}>
              <s.Circle
                className='toggle-circle'
                checked={isChecked}
                focused={hasFocus}
                size={size}
                sizeVariant={size}
                color={undefined}
              />
            </s.Track>
          </s.ToggleWrapper>
        </s.Wrapper>
      )}
    </>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
export type { ToggleProps, ToggleTextOpt, ToggleSize } from './types';
