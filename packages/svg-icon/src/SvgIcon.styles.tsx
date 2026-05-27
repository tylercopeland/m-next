import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

interface IconWrapperProps {
  isV4Design?: boolean;
  color?: string;
  hoverColor?: string;
  offsetX?: number;
  offsetY?: number;
  size?: string;
  rotate?: string | null;
  tabIndex?: number | null;
  disabled?: string | null;
  isRound?: boolean;
  backgroundColor?: string | null;
  backgroundHoverColor?: string | null;
  border?: boolean;
  isClickable?: boolean;
}

export const IconWrapper = styled.span<IconWrapperProps>((props) => {
  const {
    isV4Design,
    color,
    offsetX,
    offsetY,
    size,
    rotate,
    tabIndex,
    disabled,
    isRound,
    backgroundColor,
    backgroundHoverColor,
    border,
    isClickable,
  } = props;
  let output = `
    display: ${isV4Design ? 'flex' : 'inline-block'};
    justify-content: center;
    transform: translate(${offsetX}px, ${offsetY}px);
    color: ${color};
    ${isClickable ? 'cursor: pointer;' : ''}

   &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 1pt ${lightTheme.content.secondary};
    }	    
    &:focus {
      outline: none;
    }
   
  `;
  if (rotate) {
    output += `
    ${rotate};
  `;

    if (!isV4Design) {
      output += `
      height: ${size};
    `;
    }
  }
  if (tabIndex === 0) {
    output += `
      cursor: ${disabled ? null : 'pointer'} ;
    `;
  }
  if (disabled) {
    output += `
      opacity: 0.5;
    `;
  }
  if (border) {
    output += `
    border: 1px solid ${colors['grey-light']};
    border-radius: 8px;
    padding: 7px;
  `;
  }
  if (isRound) {
    output += `
    border-radius: ${size};
    padding: 4px;
  `;
  }
  if (backgroundColor) {
    output += `
      background-color: ${backgroundColor};
    `;
  }
  if (backgroundHoverColor) {
    output += `
      &:hover {
        background-color: ${backgroundHoverColor};
      }
    `;
  }

  return output;
});
