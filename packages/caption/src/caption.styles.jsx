import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const CaptionWrapper = styled.div((props) => {
  const {
    align,
    color,
    disabled,
    background,
    float,
    isMobile,
    isValid,
    isV4Design,
    floatYPos,
    floatXPosFocus,
    floatXPosUnfocus,
    isLabelBolded,
    narrow,
    theme,
  } = props;

  const primaryColor = theme.content ? theme.content.primary : lightTheme.content.primary;
  const emphasizeColor = theme.content ? theme.content.emphasize : lightTheme.content.emphasize;

  const styling = {
    display: 'block',
    width: '100%',
    fontSize: 14,
    fontWeight: isLabelBolded ? 600 : 400,
    textAlign: align,
    color: color || emphasizeColor,
    boxSizing: 'border-box',
    marginBottom: narrow ? 0 : '10px !important',
    cursor: 'auto !important',
  };

  if (isV4Design) {
    let backgroundColor = theme.background ? theme.background.primary : lightTheme.background.primary;
    if (background) {
      backgroundColor = background;
    }
    styling.position = 'absolute';
    styling.top = 0;
    styling.display = 'inline-block';
    styling.color = disabled ? primaryColor : color || emphasizeColor;
    styling.width = 'auto';
    styling.margin = '0 !important';
    styling.transition = 'font-size 250ms ease, transform 250ms ease, color 100ms ease, z-index 0ms ease 50ms';
    styling.backgroundColor = backgroundColor;
    styling.padding = '0 4px';
    styling.left = 4;
    styling.userSelect = 'none';

    if (float) {
      styling.zIndex = 4;
      styling.transform = 'translateY(-4px)';
      styling.fontSize = isMobile ? 14 : 12;
      if (!isValid) {
        styling.color = theme.content ? theme.negative.secondary : lightTheme.negative.secondary;
      }
      if (floatXPosFocus) {
        styling.transform = `${styling.transform} translateX(${floatXPosFocus})`;
      }
      styling.lineHeight = '8px';
    } else {
      styling.zIndex = 2;
      styling.transform = isMobile ? 'translateY(16px)' : `translateY(${floatYPos || 9}px)`;
      if (floatXPosUnfocus) {
        styling.transform = `${styling.transform} translateX(${floatXPosUnfocus})`;
      }
      styling.color = emphasizeColor;
      styling.fontSize = isMobile ? 16 : 14;
      styling.lineHeight = '14px';
    }
  }

  return [styling];
});

export default CaptionWrapper;
