import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

const isRegular = (props) => {
  const { isV4Design, classes } = props;
  if (isV4Design) return false;
  if (!classes) return true;
  return !classes.some((item) => item.startsWith('button-'));
};
const getBackgroundColor = (buttonStyle, backgroundColor) => {
  if (backgroundColor) return backgroundColor;

  switch (buttonStyle) {
    case 'plain':
    case 'ghost':
    case 'radio':
    case 'link':
      return 'rgba(0, 0, 0, 0)';
    case 'radio-selected':
      return colors['blue-lighter'];
    case 'v4-primary':
    case 'primary':
    default:
      return colors.blue;
  }
};

const getTextColor = (buttonStyle) => {
  switch (buttonStyle) {
    case 'plain':
    case 'radio':
      return colors['grey-dark'];
    case 'ghost':
    case 'link':
    case 'radio-selected':
      return colors.blue;
    default:
      return colors.white;
  }
};

const getTextColorHover = (props) => {
  if (isRegular(props)) return colors['grey-darkest'];

  switch (props.buttonStyle) {
    case 'plain':
      return colors['grey-darker'];
    case 'ghost':
    case 'link':
    case 'radio-selected':
    case 'radio':
      return colors['blue-dark'];
    case 'primary':
    default:
      return colors.white;
  }
};

const getBorder = (buttonStyle) => {
  switch (buttonStyle) {
    case 'plain':
    case 'link':
      return 'none';
    case 'radio':
      return `1px solid ${colors['grey-light']}`;
    case 'radio-selected':
    default:
      return `1px solid ${colors.blue}`;
  }
};

const getBorderHover = (props) => {
  if (isRegular(props)) return `1px solid ${colors['grey-darkest']}`;

  switch (props.buttonStyle) {
    case 'plain':
    case 'link':
      return 'none';
    case 'ghost':
    case 'radio':
    case 'radio-selected':
    case 'primary':
    default:
      return `1px solid ${colors['blue-dark']}`;
  }
};

const getFocusAndHoverBackgroundColor = (props) => {
  if (isRegular(props)) return null;

  switch (props.buttonStyle) {
    case 'plain':
    case 'radio':
    case 'radio-selected':
    case 'ghost':
    case 'link':
      return null;
    case 'v4-primary':
    case 'primary':
    default:
      return colors['blue-dark'];
  }
};

const getActiveTextColor = (props) => {
  if (isRegular(props)) return colors.black;

  switch (props.buttonStyle) {
    case 'plain':
    case 'link':
      return colors.black;
    case 'radio':
    case 'radio-selected':
      return colors.blue;
    default:
      return null;
  }
};

const getActiveBackgroundColor = (props) => {
  if (isRegular(props)) return null;

  switch (props.buttonStyle) {
    case 'plain':
    case 'radio':
    case 'radio-selected':
    case 'ghost':
      return null;
    case 'link':
      return colors['blue-lighter'];
    case 'v4-primary':
    case 'primary':
    default:
      return colors['blue-dark'];
  }
};

const getPadding = (props) => {
  const { buttonStyle, isMobile, size, isV4Design } = props;

  switch (buttonStyle) {
    case 'link':
      // V4 link buttons use standard padding, V3 uses minimal padding
      if (isV4Design) {
        if (size === 'small') return isMobile ? '0px 24px' : '0px 16px';
        return isMobile ? '14px 24px' : '6px 16px';
      }
      return '2px';
    case 'radio':
    case 'radio-selected':
      return '4px 8px';
    case 'primary':
    default:
      if (size === 'small') return isMobile ? '0px 24px' : '0px 16px';
      return isMobile ? '14px 24px' : '6px 16px';
  }
};

// Text wrapper for V4 buttons with icons - enables text truncation in flex container
export const ButtonTextStyled = styled.span({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flexShrink: 1,
});

export const ButtonStyled = styled.button((props) => {
  const {
    buttonStyle,
    isMobile,
    disabled,
    width,
    isV4Design,
    visible,
    widthType,
    iconAlign,
    hasIcon,
    backgroundColor,
    isIconOnly,
    styleOverrides,
    hoverColor,
    backgroundHoverColor,
    borderRadius,
    size,
  } = props;

  let height = isMobile ? '48px' : '32px';
  if (size === 'small') height = '24px';
  // V3 link buttons use auto height, V4 uses standard height
  if (buttonStyle === 'link' && !isV4Design) height = 'auto';

  const currentBackgroundColor =
    buttonStyle === 'primary'
      ? styleOverrides?.backgroundColor || getBackgroundColor(buttonStyle, backgroundColor)
      : getBackgroundColor(buttonStyle, backgroundColor);
  const currentColor = styleOverrides?.color || getTextColor(buttonStyle);

  let hoverBackgroundColor = backgroundHoverColor;
  if (!hoverBackgroundColor) {
    hoverBackgroundColor =
      buttonStyle === 'primary'
        ? styleOverrides?.backgroundColor || getFocusAndHoverBackgroundColor(props)
        : getFocusAndHoverBackgroundColor(props);
  }

  const colorOnHover = hoverColor || styleOverrides?.color || getTextColorHover(props);

  const activeBackgroundColor =
    buttonStyle === 'primary'
      ? styleOverrides?.backgroundColor || getActiveBackgroundColor(props)
      : getActiveBackgroundColor(props);
  const activeColor = styleOverrides?.color || getActiveTextColor(props);

  const styling = {
    backgroundColor: currentBackgroundColor,
    color: currentColor,
    minHeight: height,
    padding: getPadding(props),
    alignItems: 'center',
    borderRadius: borderRadius || (isMobile ? '28px !important' : '17px !important'),
    boxSizing: 'border-box',
    fontSize: styleOverrides?.fontSize ? styleOverrides?.fontSize : '14px',
    fontWeight: 600,
  };

  if (!disabled) {
    styling[':hover'] = {
      backgroundColor: hoverBackgroundColor,
      border: getBorderHover(props),
      borderColor: styleOverrides?.borderColor,
      color: colorOnHover,
      cursor: 'pointer',
    };

    styling[':active'] = {
      backgroundColor: activeBackgroundColor,
      color: activeColor,
    };

    styling[':focus'] = {
      backgroundColor: hoverBackgroundColor,
      border: getBorderHover(props),
      borderColor: styleOverrides?.borderColor,
      color: colorOnHover,
    };
  }

  if (isV4Design) {
    styling.width = widthType === 'auto' || !width ? 'auto' : `${width}px`;
    styling.lineHeight = '18px';
    styling.border = getBorder(buttonStyle);
    styling.borderColor = styleOverrides?.borderColor;

    styling[':disabled'] = {
      opacity: 0.5,
      backgroundColor: styleOverrides?.backgroundColor || backgroundColor,
    };
  } else {
    styling.border = '1px solid transparent';
    styling.margin = '0 5px 10px';
    styling.position = 'relative !important';
    styling[':disabled'] = {
      boxShadow: 'none',
      cursor: 'default',
      border: '1px solid transparent',
      opacity: 0.5,
    };
  }

  if (!visible) {
    styling.display = 'none !important';
  }

  if (!isV4Design && widthType === 'full') {
    styling.width = '100%';
    styling.margin = '10px 0 !important';
  }
  if (isV4Design && widthType === 'full') {
    styling.width = '100%';
  }

  if (!isV4Design && widthType === 'fixed') {
    styling.width = width;
  }

  if (!isV4Design && iconAlign !== 'right') {
    styling[':before'] = {
      marginTop: 1,
    };
  }

  styling[':focus-visible'] = {
    outline: 'none',
    boxShadow: `0 0 0.75pt 1.5pt ${colors.blue}`,
    borderColor: `${colors.white}  !important`,
  };

  if (hasIcon) {
    styling.display = 'flex';
    styling.flexDirection = 'row';
    styling.justifyContent = 'center';
    styling.alignItems = 'center';
    styling.alignContent = 'center';
    styling.gap = '8px';

    // V4: Ensure icon doesn't shrink and text can truncate
    if (isV4Design) {
      styling.overflow = 'hidden';
      // Icon (svg) should not shrink
      styling['& > svg'] = {
        flexShrink: 0,
      };
    }
  }

  // Add text truncation for V4 design when button width is constrained (no icon case)
  if (isV4Design && !hasIcon) {
    styling.overflow = 'hidden';
    styling.whiteSpace = 'nowrap';
    styling.textOverflow = 'ellipsis';
  }

  if (isIconOnly) {
    styling.width = 24;
    styling.height = 24;
    styling.padding = '4.8px 9.6px';
    styling.minHeight = null;
  }

  return styling;
});

export default ButtonStyled;
