/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { lightTheme, colors } from '@m-next/styles';
import { keyframes } from '@emotion/react';

export const FadeIn = keyframes`
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Wrapper = styled.div(
  ({ colorScheme, maxWidth, size, isMobile, variant, theme, hasClick, hasProfileIcon }) => {
    const background = theme.background || lightTheme.background;

    let backgroundColor = background.primary;
    let border = null;

    // Special handling for v4 color schemes
    if (colorScheme === 'v4-blue') {
      backgroundColor = colors['blue-light'];
    } else if (colorScheme === 'v4-red') {
      backgroundColor = colors['red-light'];
    } else if (colorScheme === 'v4-yellow') {
      backgroundColor = colors['yellow-light'];
    } else if (colorScheme === 'v4-purple') {
      backgroundColor = '#DCD4FF';
    } else if (colorScheme === 'v4-green') {
      backgroundColor = colors['green-light'];
    } else if (colorScheme === 'v4-gray') {
      backgroundColor = colors['grey-light'];
    } else if (colorScheme === 'v4-orange') {
      backgroundColor = colors['orange-light'];
    } else if (variant === 'ghost') {
      border = `1px solid ${colors['grey-light']}`;
      if (colorScheme !== 'transparent') {
        backgroundColor = colors[`${colorScheme}-light`];
      }
    } else if (variant === 'subtle' && colorScheme !== 'transparent') {
      backgroundColor = colors[`${colorScheme}-lighter`];
    } else if (variant === 'solid' && colorScheme !== 'transparent') {
      backgroundColor = colors[`${colorScheme}-light`];
    }
    return [
      {
        display: 'inline-flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        color: lightTheme.content.emphasize,
        backgroundColor,
        border,
        maxWidth,
        padding: size === 'narrow' ? '0 8px' : isMobile ? '4px 12px' : '4px 8px',
        borderRadius: size === 'narrow' ? '8px' : isMobile ? '24px' : '16px',
        height: size === 'narrow' ? 16 : 24,
        cursor: hasClick ? 'pointer' : 'default',
        ':hover': {
          backgroundColor: variant === 'ghost' && !hasProfileIcon ? colors.concrete : backgroundColor,
        },
        ':active': {
          backgroundColor: variant === 'ghost' && !hasProfileIcon ? colors['grey-light'] : null,
        },
        userSelect: 'none',
      },
    ];
  },
);

function getV4TextColor(colorScheme) {
  const v4ColorMap = {
    'v4-blue': colors['blue-dark'],
    'v4-red': colors['red-dark'],
    'v4-yellow': colors['yellow-darker'],
    'v4-purple': '#4D169C', // This purple doesn't exist in the color lib yet
    'v4-green': colors['green-dark'],
    'v4-gray': colors['grey-dark'],
    'v4-orange': colors['orange-dark'],
  };

  return v4ColorMap[colorScheme] || undefined;
}

function getV4DotColor(colorScheme) {
  const v4ColorMap = {
    'v4-blue': colors['blue'],
    'v4-red': colors['red'],
    'v4-yellow': colors['yellow'],
    'v4-purple': '#4D169C', // This purple doesn't exist in the color lib yet
    'v4-green': colors['green'],
    'v4-gray': colors['grey'],
    'v4-orange': colors['orange'],
  };

  return v4ColorMap[colorScheme] || undefined;
}

export const Text = styled.span(
  ({ size, isMobile, disabled, onClick, hasIcon, bold, overrideFontSize, colorScheme }) => [
    {
      fontWeight: bold ? 600 : 400,
      flexShrink: 1,
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: size === 'narrow' ? overrideFontSize : isMobile ? '20px' : overrideFontSize,
      lineHeight: size === 'narrow' ? '16px' : isMobile ? '24px' : '16px',
      padding: size === 'narrow' ? '0 2px' : '0 4px',
      opacity: disabled ? 0.65 : 1,
      cursor: onClick ? 'pointer' : 'default',
      paddingLeft: hasIcon ? 8 : null,
      color: getV4TextColor(colorScheme),
    },
  ],
);

export const Dot = styled.span(({ size, isMobile, colorScheme }) => [
  {
    width: size === 'narrow' ? '8px' : isMobile ? '16px' : '8px',
    height: size === 'narrow' ? '8px' : isMobile ? '16px' : '8px',
    backgroundColor: getV4DotColor(colorScheme) || colors[colorScheme],
    borderRadius: '100%',
  },
]);

export const TooltipIconDescription = styled.div`
  position: fixed;

  transform: translateX(-100%);
  z-index: 2;

  display: none;
  opacity: 0;

  width: max-content;
  max-width: 150px;

  background-color: ${colors['grey-darkest']};
  border-radius: 2px;
  padding: 4px 8px;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: ${colors['white']};
`;

export const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  margin-left: ${(props) => props.ml};

  .pill-lead-icon {
    cursor: pointer;
  }

  .pill-lead-icon:hover + ${TooltipIconDescription} {
    display: block;
    animation: 1s ${FadeIn};
    animation-fill-mode: forwards;
  }
`;
