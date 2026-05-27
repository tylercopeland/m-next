import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

// InnerWrapper component styles
export const InnerWrapper = styled.div((props) => {
  const { theme, focused, isMobile, readOnly, disabled, showClearButton } = props;

  const content = theme.content || lightTheme.content;
  const fontFamily = theme.fontFamily || lightTheme.fontFamily;

  return {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: `1px solid  ${content.border}`,
    borderRadius: 8,
    ':hover': {
      '.mi-textinput-prefix, input:enabled': {
        borderColor: content.primary,
      },
    },
    ...(focused && {
      borderColor: content.secondary,
      outline: 'none',
    }),

    [`&&& input`]: {
      position: 'relative',
      zIndex: 3,
      display: 'block',
      color: content.primary,
      width: '100%',
      marginBottom: 0,
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',

      [`::-ms-clear`]: {
        display: 'none',
        width: 0,
        height: 0,
      },
    },

    [`& .mi-textinput-prefix`]: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px',
      height: 32,
      fontFamily,
      ...(isMobile && {
        padding: '15px 8px',
        fontSize: '16px',
        height: 48,
      }),
      ...((readOnly || disabled) && {
        opacity: 0.5,
        pointerEvents: 'none',
      }),
      paddingRight: 0,
    },

    [`& input`]: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px',
      height: 32,
      fontFamily,
      '::placeholder': {
        color: content.primary,
        opacity: 0.6,
      },
      ...(isMobile && {
        padding: '15px 8px',
        fontSize: '16px',
        height: 48,
      }),
      ...((readOnly || disabled) && {
        opacity: 0.5,
        pointerEvents: 'none',
      }),
      ...(showClearButton && {
        paddingRight: 0,
      }),
    },
  };
});

export const ClearIconWrapper = styled.div(() => ({
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
}));
