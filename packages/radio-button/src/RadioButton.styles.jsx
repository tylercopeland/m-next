import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { colors, customOffsetFocusOutline } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';

const sizes = {
  length: {
    xs: '4px',
    sm: '6px',
    med: '16px',
    lg: '24px',
  },
  font: {
    med: '14px',
    lg: '16px',
  },
};

const tabUserStyle = (props) => `
  outline: none !important;
  ${customOffsetFocusOutline}
  border: 1px solid  ${props.isV4Design ? colors.grey : props.customColor} !important;
`;

export const RadioGroupWrapper = styled.div((props) => {
  const { isV4Design, direction, rightAlign, widthType, width, minWidth, allowWrap = true } = props;

  return [
    {
      textAlign: 'initial',
      width: widthType === 'fixed' && width && width !== '100%' ? `${width}px` : width,
    },

    minWidth && {
      minWidth: `${minWidth}px`,
    },

    rightAlign && {
      justifyContent: 'flex-end',
    },
    isV4Design && {
      display: 'flex',
      flexDirection: 'column',
    },

    // Horizontal mode: wrap behavior controlled by allowWrap prop
    // Designer uses allowWrap=false (nowrap) for auto-collapse detection
    // Runtime uses allowWrap=true (wrap) for graceful wrapping when space is limited
    isV4Design &&
      direction === 'row' && {
        flexWrap: allowWrap ? 'wrap' : 'nowrap',
      },
    () => {
      if (!isV4Design) {
        const styles = {
          display: 'flex',
          // eslint-disable-next-line no-nested-ternary
          flexWrap: direction === 'row' ? (allowWrap ? 'wrap' : 'nowrap') : 'wrap',
          flexDirection: 'column',
          paddingRight: '15px',
        };

        if (direction === 'row') {
          styles.flexDirection = 'row';
        }

        return styles;
      }
    },
  ];
});

export const RadioGroupInnerWrapper = styled.div((props) => {
  const { isV4Design, direction, rightAlign, widthType, width, allowWrap = true } = props;

  return [
    {
      textAlign: 'initial',
      width: widthType === 'fixed' && width && width !== '100%' ? `${width}px` : width,
    },

    rightAlign && {
      justifyContent: 'flex-end',
    },

    // Horizontal mode: wrap behavior controlled by allowWrap prop
    // Designer uses allowWrap=false (nowrap) for auto-collapse detection
    // Runtime uses allowWrap=true (wrap) for graceful wrapping when space is limited
    isV4Design &&
      direction === 'row' && {
        display: 'flex',
        flexWrap: allowWrap ? 'wrap' : 'nowrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingRight: '16px',
      },
    () => {
      if (!isV4Design) {
        const styles = {
          display: 'flex',
          // eslint-disable-next-line no-nested-ternary
          flexWrap: direction === 'row' ? (allowWrap ? 'wrap' : 'nowrap') : 'wrap',
          flexDirection: 'column',
          paddingRight: '15px',
        };

        if (direction === 'row') {
          styles.flexDirection = 'row';
          styles.justifyContent = 'flex-start';
        }

        return styles;
      }
    },
  ];
});

export const RadioButtonWrapper = styled.label((props) => {
  const { disabled, isV4Design, customColor, isMobile, widthType, width, direction, marginBottom } = props;

  /* IMPORTANT!! CASCADING ORDER MUST BE RETAINED
   * checked
   * hover
   * disabled
   * initial
   */

  let wdth = sizes.length.xs;
  if (disabled || isMobile) wdth = sizes.length.sm;

  let hght = sizes.length.xs;
  if (disabled || isMobile) hght = sizes.length.sm;

  return [
    css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      outline: none;
      margin-bottom: ${marginBottom}px;

      & input:checked ~ div .radio-btn-indicator {
        background-color: ${disabled && !isV4Design ? colors['grey-lighter'] : customColor};
        border-color: ${customColor};
        box-shadow: 0 0 0 ${colors.white};
      }

      & input:checked ~ div .radio-btn-indicator::after {
        position: absolute !important;
        content: '';
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: ${wdth};
        height: ${hght};
        background-color: ${disabled ? colors.grey : colors.white} !important;
        border-radius: 100%;
      }

      &:hover {
        & input ~ div .radio-btn-indicator {
          box-shadow: 0 0 0 1px ${customColor};
        }
      }

      & input:focus ~ div .radio-btn-indicator {
        box-shadow: 0 0 0 1px ${customColor};
        border-color: ${isV4Design ? colors['blue-lighter'] : 'inherit'};
      }

      @media screen and (-ms-high-contrast: active) {
        & input:checked ~ div .radio-btn-indicator {
          background-color: ${colors.white};
          border-color: ${colors.white};
          box-shadow: 0 0 0 ${colors.white};
        }

        & input:focus ~ div .radio-btn-indicator {
          box-shadow: 0 0 0 1px ${colors.white};
          border-color: ${colors.white};
        }
      }
    `,

    () => {
      if (direction === 'row') {
        return widthType === 'full' ? { marginRight: 0, width } : { marginRight: '10px' };
      }
    },

    disabled &&
      isV4Design &&
      css`
        opacity: 0.8;

        &:hover,
        & > * {
          cursor: not-allowed;
        }

        & input ~ div .radio-btn-indicator {
          border-color: ${colors.grey};
          background-color: ${colors.white};
          box-shadow: 0 0 0 ${colors.white};
        }

        & input ~ div .radio-btn-indicator::after {
          background-color: ${colors.white};
        }

        & input:checked ~ div .radio-btn-indicator {
          background-color: ${colors.grey};
          border-color: ${colors.grey};
        }
      `,
  ];
});

export const NativeRadioButton = styled.input`
  position: absolute;
  height: 0;
  width: 0;
  opacity: 0;
  body.user-is-tabbing &:focus ~ div .radio-btn-indicator {
    ${(props) => tabUserStyle(props)}
  }
`;

export const StyledIndicator = styled.div((props) => {
  const { isMobile, isV4Design, disabled, customColor } = props;

  return [
    {
      display: 'block',
      borderRadius: '100%',
      width: sizes.length.med,
      height: sizes.length.med,
      border: `1px solid ${customColor}`,
      backgroundColor: colors.white,
      opacity: 'inherit',
    },

    isMobile && {
      width: sizes.length.lg,
      height: sizes.length.lg,
    },

    isV4Design && {
      border: `1px solid ${colors.grey}`,
    },

    disabled && {
      backgroundColor: colors['grey-lighter'],
      opacity: '0.6',
    },

    isV4Design &&
      disabled && {
        backgroundColor: colors.white,
        opacity: 'inherit',
      },

    {
      // eslint-disable-next-line no-useless-computed-key
      [' &:hover ']: {
        boxShadow: `0 0 0 1px ${customColor}`,
        borderColor: isV4Design ? colors['blue-lighter'] : 'inherit',
      },
    },
  ];
});

export const Text = styled.span((props) => {
  const { isMobile, isV4Design, direction, isRecommended, customFontSize, bold } = props;

  let fontSize = isMobile ? 16 : 14;
  if (customFontSize) fontSize = customFontSize;

  return [
    {
      fontSize,
      lineHeight: sizes.length.med,
      marginLeft: '6px',
      flexShrink: 0,
      zIndex: 1,
      textOverflow: 'ellipsis',
      fontWeight: bold ? 600 : null,
    },

    isV4Design && {
      fontSize: sizes.font.med,
      marginLeft: '8px',
      whiteSpace: 'unset',
      flexBasis: 'fit-content',
    },

    direction === 'row' && {
      marginLeft: '6px',
    },

    isMobile && {
      fontSize: sizes.font.lg,
      lineHeight: sizes.length.lg,
    },

    isRecommended &&
      css`
        &::after {
          content: ' (Recommended)';
          font-style: italic;
          font-weight: normal;
        }
      `,
  ];
});

export const ValidationIcon = styled(SvgIcon)`
  padding-left: 8px;
  padding-right: 4px;
  color: ${colors['grey']};
`;

export const Subtext = styled.div(({ last, gap }) => [
  { marginTop: 2, lineHeight: '20px', marginBottom: last ? null : gap },
]);
