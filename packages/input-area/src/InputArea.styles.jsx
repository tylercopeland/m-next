import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const Container = styled.div((props) => {
  const { width, isValid, displayAuto, isV4Design, compactStyle, theme } = props;
  const { fontFamily } = theme;

  return [
    {
      display: 'inline-flex',
      position: 'relative',
      width,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      boxSizing: 'border-box',
      verticalAlign: 'top',
      marginBottom: isValid && !compactStyle ? '14px' : '0',
      fontFamily: fontFamily || lightTheme.fontFamily,
    },

    displayAuto && {
      display: 'inline-block',
    },

    isV4Design &&
      !compactStyle && {
        marginBottom: isValid ? '32px' : '0',
      },
  ];
});

export const TextAreaInput = styled.textarea((props) => {
  const { isValid, theme, readOnly, scrollable, disableResize, disabled, height, isV4Design } = props;
  const { fontFamily } = theme;

  const fontSize = theme.fontSizes ? theme.fontSizes.medium : lightTheme.fontSizes.medium;
  const content = theme.content || lightTheme.content;
  const negative = theme.negative || lightTheme.negative;
  const background = theme.background || lightTheme.background;

  return [
    {
      display: 'block',
      width: '100%',
      fontSize,
      fontWeight: 'normal',
      fontFamily: fontFamily || lightTheme.fontFamily,
      lineHeight: '16px',
      color: content.primary,
      border: `1px solid ${isValid ? content.border : negative.secondary}`,
      minHeight: 32,
      padding: 8,
      borderRadius: isV4Design ? 4 : 2,
      boxSizing: 'border-box',
      marginBottom: 0,
      overflowY: scrollable ? 'auto' : 'hidden',
      resize: disableResize ? 'none' : 'both',
      '&:hover': {
        borderColor: isValid ? content.primary : negative.secondary,
        backgroundColor: (disabled || readOnly) && background.secondary,
      },

      '&:focus': {
        borderColor: isValid ? content.secondary : negative.secondary,
        outline: 'none',
      },
      '::placeholder': {
        color: colors['grey-dark'],
        opacity: 0.6,
      },
      backgroundColor: (disabled || readOnly) && background.secondary,
      height,
    },
  ];
});

export const TextAreaInputMirror = styled.textarea((props) => {
  const { scrollable, theme } = props;
  const { fontFamily } = theme;
  const fontSize = theme.fontSizes ? theme.fontSizes.medium : lightTheme.fontSizes.medium;

  return [
    {
      display: 'none',
      position: 'absolute',
      visibility: 'hidden',
      width: '100%',
      fontSize: fontSize.medium,
      fontWeight: 'normal',
      lineHeight: '16px',
      minHeight: 32,
      padding: 8,
      boxSizing: 'border-box',
      marginBottom: 0,
      resize: 'none',
      overflowY: scrollable ? 'auto' : 'hidden',
      fontFamily: fontFamily || lightTheme.fontFamily,
    },
  ];
});
