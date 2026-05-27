import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';

// Container component styles
export const Container = styled.div((props) => {
  const { width, isValid, theme } = props;
  const fontFamily = theme.fontFamily || lightTheme.fontFamily;

  return {
    display: 'inline-flex',
    width,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    fontFamily,
    position: 'relative',
    zIndex: 1,
    marginBottom: isValid ? '32px' : '0',
  };
});

// InnerWrapper component styles
export const InnerWrapper = styled.div((props) => {
  const { theme, isValid, focused, readOnly, disabled } = props;

  const content = theme.content || lightTheme.content;
  const negative = theme.negative || lightTheme.negative;
  const fontFamily = theme.fontFamily || lightTheme.fontFamily;
  let borderColor = isValid ? content.border : negative.secondary;

  if (focused) {
    borderColor = isValid ? content.secondary : negative.secondary;
  }

  return {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    border: `1px solid ${borderColor}`,
    borderRadius: 4,
    ':hover': {
      borderColor: isValid ? content.primary : negative.secondary,
    },
    ':focus': {
      outline: 'none',
    },

    '&&& input': {
      position: 'relative',
      zIndex: 3,
      display: 'block',
      color: content.primary,
      width: '100%',
      marginBottom: 0,
      backgroundColor: 'transparent',
      border: 'none',
      '::-ms-clear': {
        display: 'none',
        width: 0,
        height: 0,
      },
      ':focus': {
        borderColor,
        outline: 'none',
      },
      ':hover': {
        borderColor: isValid ? content.primary : negative.secondary,
      },
    },

    '& .mi-textinput-prefix': {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      paddingLeft: '8px',
      paddingTop: '8px',
      paddingBottom: '8px',
      height: 32,
      fontFamily,
      ...((readOnly || disabled) && {
        opacity: 0.5,
        pointerEvents: 'none',
      }),
    },

    '& input': {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px',
      height: 32,
      fontFamily,
      '::placeholder': {
        color: colors.grey.dark,
        opacity: 0.6,
      },
      ...((readOnly || disabled) && {
        opacity: 0.5,
        pointerEvents: 'none',
      }),
    },
  };
});

export const SuffixWrapper = styled.span(() => ({
  padding: '6px 8px',
  alignSelf: 'center',
  color: colors.grey.base,
  fontSize: 14,
}));

export const InfoMessageWrapper = styled.div(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  margin: '6px 0 10px 0',
}));

export const InfoMessage = styled.div(() => ({
  display: 'block',
  color: colors.grey.base,
  width: '100%',
  fontSize: '14px',
  lineHeight: '16px',
}));
