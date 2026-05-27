/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';
import { keyframes } from '@emotion/react';

export const FadeIn = keyframes`
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

// Resolve a colorScheme + shade slot to a hex from @m-next/tokens.
// `transparent` is special: it stays transparent regardless of shade.
function resolveColor(scheme, shade) {
  if (scheme === 'transparent') return 'transparent';
  return (colors[scheme] && colors[scheme][shade]) || undefined;
}

export const Wrapper = styled.div(
  ({ colorScheme, maxWidth, size, variant, theme, hasClick, hasProfileIcon }) => {
    const background = (theme && theme.background) || lightTheme.background;

    let backgroundColor = background.primary;
    let border = null;

    if (variant === 'ghost') {
      border = `1px solid ${colors.grey.light}`;
      if (colorScheme !== 'transparent') {
        backgroundColor = resolveColor(colorScheme, 'light');
      }
    } else if (variant === 'subtle' && colorScheme !== 'transparent') {
      backgroundColor = resolveColor(colorScheme, 'lighter');
    } else if (variant === 'solid' && colorScheme !== 'transparent') {
      backgroundColor = resolveColor(colorScheme, 'light');
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
        padding: size === 'sm' ? '0 8px' : '4px 8px',
        borderRadius: size === 'sm' ? '8px' : '16px',
        height: size === 'sm' ? 16 : 24,
        cursor: hasClick ? 'pointer' : 'default',
        ':hover': {
          backgroundColor:
            variant === 'ghost' && !hasProfileIcon ? colors.concrete : backgroundColor,
        },
        ':active': {
          backgroundColor: variant === 'ghost' && !hasProfileIcon ? colors.grey.light : null,
        },
        userSelect: 'none',
      },
    ];
  },
);

export const Text = styled.span(
  ({ size, disabled, onClick, hasIcon, bold, overrideFontSize }) => [
    {
      fontWeight: bold ? 600 : 400,
      flexShrink: 1,
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: overrideFontSize,
      lineHeight: size === 'sm' ? '16px' : '16px',
      padding: size === 'sm' ? '0 2px' : '0 4px',
      opacity: disabled ? 0.65 : 1,
      cursor: onClick ? 'pointer' : 'default',
      paddingLeft: hasIcon ? 8 : null,
    },
  ],
);

export const Dot = styled.span(({ size, colorScheme }) => [
  {
    width: size === 'sm' ? '8px' : '8px',
    height: size === 'sm' ? '8px' : '8px',
    backgroundColor:
      colorScheme === 'transparent' ? colors.grey.base : resolveColor(colorScheme, 'base'),
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

  background-color: ${colors.grey.darkest};
  border-radius: 2px;
  padding: 4px 8px;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: ${colors.white};
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
