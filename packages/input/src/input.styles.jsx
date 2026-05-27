import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

// Container component styles
export const Container = styled.div((props) => {
  const { isHidden, width, isValid, displayAuto, isV4Design, compactStyle, theme } = props;
  const fontFamily = theme.fontFamily || lightTheme.fontFamily;

  return {
    display: isHidden ? 'none' : 'inline-flex',
    width,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    boxSizing: 'border-box',
    verticalAlign: 'top',
    marginBottom: isValid && !compactStyle ? '14px' : '0',
    fontFamily,
    ...(displayAuto && { display: 'inline-block' }),
    ...(isV4Design && {
      position: 'relative',
      zIndex: 1,
      ...(compactStyle ? {} : { marginBottom: isValid ? '32px' : '0' }),
    }),
  };
});

// InnerWrapper component styles
export const InnerWrapper = styled.div((props) => {
  const { theme, isValid, focused, isV4Design, isMobile, readOnly, disabled } = props;

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
    border: `1px solid  ${borderColor}`,
    borderRadius: isV4Design ? 4 : 1,
    ':hover': {
      borderColor: isValid ? content.primary : negative.secondary,
    },
    ':focus': {
      outline: 'none',
    },

    [`&&& input`]: {
      position: 'relative',
      zIndex: 3,
      display: 'block',
      color: content.primary,
      width: '100%',
      marginBottom: 0,
      backgroundColor: isV4Design ? 'transparent' : undefined,
      border: 'none',
      [`::-ms-clear`]: {
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

    [`& .mi-textinput-prefix`]: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      paddingLeft: '8px',
      paddingTop: '8px',
      paddingBottom: '8px',

      height: 32,
      fontFamily,
      ...(isMobile &&
        isV4Design && {
          padding: '15px 8px',
          fontSize: '16px',
          height: 48,
        }),
      ...((readOnly || disabled) && {
        opacity: 0.5,
        pointerEvents: 'none',
      }),
    },

    [`& input`]: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px',
      height: 32,
      fontFamily,
      '::placeholder': {
        color: colors['grey-dark'],
        opacity: 0.6,
      },
      ...(isMobile &&
        isV4Design && {
          padding: '15px 8px',
          fontSize: '16px',
          height: 48,
        }),
      ...((readOnly || disabled) && {
        opacity: 0.5,
        pointerEvents: 'none',
      }),
    },
  };
});

export const SuffixWrapper = styled.span(() => ({
  padding: '6px 8px',
}));

export const InfoMessageWrapper = styled.div(({ compactStyle }) => {
  let margin = ' 6px 0 14px 0';
  if (compactStyle) {
    margin = '6px 0 0px 0';
  } else {
    margin = '6px 0 10px 0';
  }

  return [
    {
      display: 'flex',
      alignItems: 'flex-start' /* to top align icon */,
      margin,
    },
  ];
});

export const InfoMessage = styled.div(() => [
  {
    display: 'block',
    color: colors.grey,
    width: '100%',
    fontSize: '14px',
    lineHeight: '16px',
  },
]);
