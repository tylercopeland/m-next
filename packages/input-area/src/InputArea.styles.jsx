import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';

export const Container = styled.div((props) => {
  const { width, isValid, theme } = props;
  const { fontFamily } = theme;

  return {
    display: 'inline-flex',
    position: 'relative',
    width,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    marginBottom: isValid ? '32px' : '0',
    fontFamily: fontFamily || lightTheme.fontFamily,
  };
});

export const TextAreaInput = styled.textarea((props) => {
  const { isValid, theme, readOnly, scrollable, disableResize, disabled, height, customResize } = props;
  const { fontFamily } = theme;

  const fontSize = theme.fontSizes ? theme.fontSizes.medium : lightTheme.fontSizes.medium;
  const content = theme.content || lightTheme.content;
  const negative = theme.negative || lightTheme.negative;
  const background = theme.background || lightTheme.background;

  // Honor explicit `resize` prop, then fall back to disableResize, then default.
  const resizeValue = customResize ?? (disableResize ? 'none' : 'both');

  return {
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
    borderRadius: 4,
    boxSizing: 'border-box',
    marginBottom: 0,
    overflowY: scrollable ? 'auto' : 'hidden',
    resize: resizeValue,
    '&:hover': {
      borderColor: isValid ? content.primary : negative.secondary,
      backgroundColor: (disabled || readOnly) && background.secondary,
    },

    '&:focus': {
      borderColor: isValid ? content.secondary : negative.secondary,
      outline: 'none',
    },
    '::placeholder': {
      color: colors.grey.dark,
      opacity: 0.6,
    },
    backgroundColor: (disabled || readOnly) && background.secondary,
    height,
  };
});

export const TextAreaInputMirror = styled.textarea((props) => {
  const { scrollable, theme } = props;
  const { fontFamily } = theme;
  const fontSize = theme.fontSizes ? theme.fontSizes.medium : lightTheme.fontSizes.medium;

  return {
    display: 'none',
    position: 'absolute',
    visibility: 'hidden',
    width: '100%',
    fontSize,
    fontWeight: 'normal',
    lineHeight: '16px',
    minHeight: 32,
    padding: 8,
    boxSizing: 'border-box',
    marginBottom: 0,
    resize: 'none',
    overflowY: scrollable ? 'auto' : 'hidden',
    fontFamily: fontFamily || lightTheme.fontFamily,
  };
});
