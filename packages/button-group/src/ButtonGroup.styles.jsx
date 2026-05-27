import styled from '@emotion/styled';
import { colors, customFocusOutline, customOffsetFocusOutline } from '@m-next/styles';

// Hardcoded to old colours
const getHoverColor = (buttonStyle) => {
  switch (buttonStyle) {
    case 'plain':
      return `color: ${colors['grey-darkest']}`;
    case 'ghost':
      return `background-color: transparent`;
    case 'link':
      return `background-color: transparent; color: ${colors['blue-dark']}`;
    case 'calendarMenu':
      return `background-color: ${colors.blue}`;
    case 'primary':
    default:
      return `background-color: ${colors.legacy['blueHover']}`;
  }
};

const getBorderHover = (buttonStyle) => {
  switch (buttonStyle) {
    case 'plain':
    case 'link':
      return 'none';
    case 'calendarMenu':
    case 'ghost':
      return `${colors['blue-dark']}`;
    case 'primary':
    default:
      return `${colors['blue']}`;
  }
};

const getBackgroundColor = (buttonStyle) => {
  switch (buttonStyle) {
    case 'plain':
      return colors['grey'];
    case 'ghost':
    case 'link':
      return 'transparent';
    case 'calendarMenu':
      return colors.blue;
    case 'primary':
    default:
      return colors['grey'];
  }
};

const getTextColor = (buttonStyle) => {
  switch (buttonStyle) {
    case 'ghost':
    case 'link':
      return colors['blue'];
    case 'calendarMenu':
    case 'plain':
    case 'primary':
    default:
      return colors.white;
  }
};

const getTextColorHover = (buttonStyle) => {
  switch (buttonStyle) {
    case 'plain':
      return colors['grey-dark'];
    case 'ghost':
    case 'link':
      return colors['blue-dark'];
    case 'calendarMenu':
    case 'primary':
    default:
      return colors['white'];
  }
};

const getBorder = (buttonStyle) => {
  switch (buttonStyle) {
    case 'ghost':
      return `solid  ${colors['blue']}`;
    case 'link':
      return 'none';
    case 'plain':
    case 'primary':
    case 'calendarMenu':
    default:
      return `solid  ${colors.white}`;
  }
};

export const ContainerWrapper = styled.div`
  width: ${(p) => p.width};
  display: ${(p) => (p.fillWidth ? 'block' : 'inline-block')};
  vertical-align: top;
  margin: ${(p) => p.margin};
  ${(p) =>
    p.displayAuto &&
    `
    max-width: 100%;
    `}
`;

export const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  background-color: inherit;
  outline: none;
  border-radius: ${(p) => (p.isMobile ? '28px' : '17px')} !important;
  ${(p) =>
    p.displayAuto &&
    `
        display: inline-block;
        max-width: 100%;
    `}
  ${(p) =>
    p.fillWidth &&
    `
        display: block;
        width: 100%;
    `}

  body.user-is-tabbing &:focus {
    ${customOffsetFocusOutline};
  }
  &:focus-visible {
    ${customFocusOutline};
    z-index: 200;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  display: ${(p) => (p.fillWidth ? 'flex' : 'inline-flex')};
  vertical-align: middle;
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  ${(p) =>
    p.fillWidth &&
    `
        width: 100%;
    `}

  &:hover > div {
    ${(p) => p.isDropdown && getHoverColor(p.buttonStyle)};
    border-color: ${(p) => p.isDropdown && getBorderHover(p.buttonStyle)};
    color: ${(p) => p.isDropdown && getTextColorHover(p.buttonStyle)};
  }
  &:focus > div {
    ${(p) => p.isDropdown && getHoverColor(p.buttonStyle)};
    border-color: ${(p) => p.isDropdown && getBorderHover(p.buttonStyle)};
    color: ${(p) => p.isDropdown && getTextColorHover(p.buttonStyle)};
  }
`;

export const ListWrapper = styled.div`
  min-width: ${(p) => `${p.containerWidth}px`};
  background-color: ${colors.white};
  z-index: 300;
  max-width: 280px;
  position: absolute;
  margin-top: ${(p) => (p.openUp ? `${(p.containerHeight + 30) * -1 - 8}px` : null)};
  margin-left: ${(p) => (p.openLeft ? `${(p.containerWidth - p.headerWidth) * -1}px` : null)};
  background-clip: padding-box;
  border: 1px solid ${colors.legacy['greyLight']};
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 4px;
  right: ${(p) => (p.isMobile ? '8px' : '')};
`;

export const IconHolder = styled.button`
  border-top: 1px ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-bottom: 1px ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-left: 0px none;
  border-right: 1px ${({ buttonStyle }) => getBorder(buttonStyle)};

  min-height: ${(p) => {
    if (p.size === 'small') return '24px';
    return p.isMobile ? '48px' : '32px';
  }};
  border-radius: ${(p) => (p.isMobile ? '0 28px 28px 0' : '0 17px 17px 0')} !important;
  user-select: none;
  background-color: ${({ buttonStyle }) => getBackgroundColor(buttonStyle)};
  color: ${({ buttonStyle }) => getTextColor(buttonStyle)};
  padding: ${(p) => {
    if (p.buttonStyle === 'link') {
      return '6px 16px';
    }
    if (p.size === 'small') return p.isMobile ? '0px 16px' : '0px 16px';
    return p.isMobile ? '14px 16px' : '6px 16px';
  }};
  opacity: ${(p) => (p.disabled ? '.5' : '1')};
  align-items: center;
  display: flex;
  box-sizing: border-box;
  &:hover {
    ${({ buttonStyle }) => getHoverColor(buttonStyle)};
  }
  &:focus {
    ${({ buttonStyle }) => getHoverColor(buttonStyle)};
  }

  outline: none;
  body.user-is-tabbing &:focus {
    ${customFocusOutline};
    z-index: 200;
  }

  &:focus-visible {
    ${customFocusOutline};
    z-index: 200;
  }
`;
export const Button = styled.div`
  user-select: none;
  background-color: ${({ buttonStyle }) => getBackgroundColor(buttonStyle)};
  color: ${({ buttonStyle }) => getTextColor(buttonStyle)};

  font-size: 14px;
  font-weight: 600;
  border: ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  min-height: ${(p) => {
    if (p.size === 'small') return '24px';
    return p.isMobile ? '48px' : '32px';
  }};
  align-items: center;
  display: flex;
  box-sizing: border-box;
  ${(p) =>
    p.isV4Design &&
    `
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  `}
  ${(p) =>
    p.fillWidth &&
    `
        flex: 1;
    `}

  padding: ${(p) => {
    if (p.buttonStyle === 'link') {
      return '6px 16px';
    }
    if (p.size === 'small') {
      return p.isDropdown ? '0px 16px 0px 16px' : '0px 16px';
    }
    if (p.isDropdown) {
      return p.isMobile ? '14px 0px 14px 16px' : '6px 0px 6px 16px';
    }
    return p.isMobile ? '14px 16px' : '6px 16px';
  }};
  border-top: 1px ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-bottom: 1px ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-left: 1px ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-right: ${(p) => (p.isDropdown ? '0px' : '1px')} ${({ buttonStyle }) => getBorder(buttonStyle)};
  border-radius: ${(p) => {
    let radius = p.isMobile ? '28px 0 0 28px' : '17px 0 0 17px';
    if (p.single) {
      radius = p.isMobile ? '28px' : '17px';
    }
    return radius;
  }};
  opacity: ${(p) => (p.disabled ? '.5' : '1')};
  outline: none;
  body.user-is-tabbing &:focus {
    ${customFocusOutline};
    z-index: 200;
  }
  &:focus-visible {
    ${customFocusOutline};
    z-index: 200;
  }
  line-height: 18px;
`;

export const ButtonRow = styled.div`
    font-size: 14px;
    padding: 8px 16px;
    color:  ${colors.black}; 
    background-color: ${colors.white} ;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    line-height: 16px;
    opacity: ${(p) => (p.disabled ? '.5' : '1')};
    &:hover {
        color: ${() => colors['blue']};
        background-color: ${() => colors['grey-lightest']};
    }
    
    &:focus {
        color: ${() => colors['blue']};
        background-color: ${() => colors['grey-lightest']};
        };
    }
    outline:none
`;

// Text wrapper for V4 buttons - enables text truncation in flex container
export const ButtonTextStyled = styled.span({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flexShrink: 1,
});
