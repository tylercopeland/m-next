import React, { useState, useEffect } from 'react';
import SvgIcon from '@m-next/svg-icon';
import type { SvgIconName } from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import * as s from './toggle.styles';
import { getOnText, getOffText } from './textOptions';
import type { ToggleProps } from './types';

const ZERO_WIDTH_SPACE = '\u200b';

/**
 * Toggle component: accessible switch/checkbox-style control.
 * Supports runtime (with optional Yes/No, On/Off, True/False labels) and design-time modes.
 */
function Toggle({
  id,
  disabled = false,
  checked = false,
  onChange = null,
  onBlur = null,
  onFocus = null,
  alignRight = false,
  isRuntime = false,
  isV4Design = false,
  textOpt = 'Blank',
  width = 'auto',
  color = null,
  forwardRef = null,
  label = null,
  style = {},
  labelStyle = {},
  legacyClass = null,
  bold = false,
  tooltip,
  tooltipId,
  icon,
  size = 'medium',
}: ToggleProps) {
  const [hasFocus, setFocus] = useState(false);
  const [isChecked, setIsChecked] = useState(checked);

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
              legacyClass={legacyClass ?? undefined}
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
              ref={forwardRef}
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
          isV4Design={isV4Design}
          data-testid={`${id}-Toggle-wrapper`}
        >
          {(label || labelStyle) && (
            <s.Label bold={bold} alignRight={alignRight} isV4Design={isV4Design} style={labelStyle}>
              {icon && <SvgIcon name={icon as SvgIconName} size={10} />}
              {isV4Design ? (
                <s.LabelText data-tooltip-id={tooltipId} data-tooltip-html={tooltip} hasTooltip={!!tooltip}>
                  {label}
                </s.LabelText>
              ) : (
                label
              )}
            </s.Label>
          )}

          <s.ToggleWrapper disabled={disabled} alignRight={alignRight} htmlFor={id} size={size}>
            <s.Input
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
}

export default Toggle;
export type { ToggleProps, ToggleTextOpt, ToggleSize } from './types';
