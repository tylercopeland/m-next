/* eslint-disable react/no-danger */
// vendors
import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors, convertClass, darkenColor } from '@m-next/styles';

// components
import * as s from './button.styles';
// prop types
const propTypes = {
  buttonStyle: PropTypes.oneOf(['primary', 'link', 'v4-primary', 'ghost', 'plain', 'radio', 'radio-selected']),
  classes: PropTypes.instanceOf(Array),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  isV4Design: PropTypes.bool,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  type: PropTypes.string,
  value: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  widthType: PropTypes.string,
  icon: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    position: PropTypes.oneOf(['left', 'right']),
  }),
  forwardRef: PropTypes.instanceOf(Object),
  style: PropTypes.instanceOf(Object),
  isDangerous: PropTypes.bool,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.string,
  fontSize: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
};

/* ---------------------------------- */

function Button({
  id = 'Button',
  value = null,
  type = 'button',
  buttonStyle = 'primary',
  width = null,
  disabled = false,
  tabIndex = 0,
  isV4Design = true,
  onClick = null,
  className = '',
  visible = true,
  widthType = 'auto',
  icon = null,
  isMobile = false,
  classes = [],
  forwardRef = null,
  style = null,
  isDangerous = false,
  tooltip,
  tooltipId,
  backgroundColor,
  color,
  borderColor,
  borderRadius,
  fontSize,
  size = 'medium',
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const btnRef = forwardRef ?? useRef(null);

  const styleOverrides = useMemo(() => {
    if (backgroundColor || color || fontSize) {
      let mappedBackgroundColor = backgroundColor ? colors[backgroundColor] : null;
      if (backgroundColor === 'dark-grey') {
        mappedBackgroundColor = colors['grey-darker'];
      }
      if (mappedBackgroundColor === undefined) {
        mappedBackgroundColor = backgroundColor;
      }
      let mappedBorderColor = borderColor ? colors[borderColor] : null;
      if (borderColor === 'dark-grey') {
        mappedBorderColor = colors['grey-darker'];
      }
      if (mappedBorderColor === undefined) {
        mappedBorderColor = borderColor;
      }
      let mappedColor = color ? colors[color] : null;
      if (color === 'dark-grey') {
        mappedColor = colors['grey-darker'];
      }
      if (mappedColor === undefined) {
        mappedColor = color;
      }
      return {
        backgroundColor: mappedBackgroundColor,
        borderColor: mappedBorderColor,
        color: mappedColor,
        fontSize,
      };
    }
    return null;
  }, [backgroundColor, borderColor, color, fontSize]);

  const hoverColor = useMemo(() => {
    if (!backgroundColor && !color) return null;
    if (buttonStyle === 'primary' && backgroundColor !== 'white' && backgroundColor !== colors.white) {
      return null;
    }

    if (color) {
      const bgColor = colors[color] || color;
      return darkenColor(bgColor, 0.1);
    }
    return null;
  }, [backgroundColor, buttonStyle, color]);

  const backgroundHoverColor = useMemo(() => {
    if (!backgroundColor) return null;
    if (buttonStyle === 'primary' && backgroundColor !== 'white' && backgroundColor !== colors.white) {
      const bgColor = colors[backgroundColor] || backgroundColor;
      return darkenColor(bgColor, 0.1);
    }

    return null;
  }, [backgroundColor, buttonStyle]);

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) onClick(e);

    return btnRef.current?.blur();
  };
  // Hack here to disable background change on disabled buttons
  const controlStyles = convertClass(className);
  return (
    <>
      {isDangerous && (icon === null || icon === undefined) && (
        <s.ButtonStyled
          id={id}
          type={type}
          onClick={handleOnClick}
          buttonStyle={buttonStyle}
          width={width}
          disabled={disabled}
          tabIndex={tabIndex}
          isV4Design={isV4Design}
          ref={btnRef}
          className={className}
          visible={visible}
          widthType={widthType}
          isMobile={isMobile}
          classes={classes}
          hasIcon={icon !== null && icon !== undefined}
          style={style}
          backgroundColor={disabled ? controlStyles.backgroundColor : null}
          dangerouslySetInnerHTML={{ __html: value }} // hack to get around customer issue
          data-tooltip-id={tooltipId}
          data-tooltip-html={tooltip}
          styleOverrides={styleOverrides}
          size={size}
          hoverColor={hoverColor}
          backgroundHoverColor={backgroundHoverColor}
          borderRadius={borderRadius}
        />
      )}

      {isDangerous && icon !== null && icon !== undefined && (
        <s.ButtonStyled
          id={id}
          type={type}
          onClick={handleOnClick}
          buttonStyle={buttonStyle}
          width={width}
          disabled={disabled}
          tabIndex={tabIndex}
          isV4Design={isV4Design}
          ref={btnRef}
          className={className}
          visible={visible}
          widthType={widthType}
          isMobile={isMobile}
          classes={classes}
          backgroundColor={disabled ? controlStyles.backgroundColor : null}
          borderColor={disabled ? controlStyles.backgroundColor : null}
          hasIcon={icon !== null && icon !== undefined}
          style={style}
          isIconOnly={!value && icon}
          data-tooltip-id={tooltipId}
          data-tooltip-html={tooltip}
          styleOverrides={styleOverrides}
          size={size}
          hoverColor={hoverColor}
          backgroundHoverColor={backgroundHoverColor}
          borderRadius={borderRadius}
        >
          {icon && icon.position !== 'right' && <SvgIcon name={icon.name} size={icon.size} color={icon.color} />}
          {value && isV4Design && (
            <s.ButtonTextStyled
              dangerouslySetInnerHTML={{ __html: value }} // hack to get around customer issue
            />
          )}
          {value && !isV4Design && (
            <span
              dangerouslySetInnerHTML={{ __html: value }} // hack to get around customer issue
            />
          )}
          {icon && icon.position?.toLowerCase() === 'right' && (
            <SvgIcon name={icon.name} size={icon.size} color={icon.color} />
          )}
        </s.ButtonStyled>
      )}

      {!isDangerous && (
        <s.ButtonStyled
          id={id}
          type={type}
          onClick={handleOnClick}
          buttonStyle={buttonStyle}
          width={width}
          disabled={disabled}
          tabIndex={tabIndex}
          isV4Design={isV4Design}
          ref={btnRef}
          className={className}
          visible={visible}
          widthType={widthType}
          isMobile={isMobile}
          classes={classes}
          backgroundColor={disabled ? controlStyles.backgroundColor : null}
          borderColor={disabled ? controlStyles.backgroundColor : null}
          hasIcon={icon !== null && icon !== undefined}
          style={style}
          isIconOnly={!value && icon}
          data-tooltip-id={tooltipId}
          data-tooltip-html={tooltip}
          styleOverrides={styleOverrides}
          size={size}
          hoverColor={hoverColor}
          backgroundHoverColor={backgroundHoverColor}
          borderRadius={borderRadius}
          data-testid={id}
        >
          {icon && icon.position !== 'right' && <SvgIcon name={icon.name} size={icon.size} color={icon.color} />}
          {value}
          {icon && icon.position?.toLowerCase() === 'right' && (
            <SvgIcon name={icon.name} size={icon.size} color={icon.color} />
          )}
        </s.ButtonStyled>
      )}
    </>
  );
}

Button.propTypes = propTypes;
export default Button;
