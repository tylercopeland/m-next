import styled from '@emotion/styled';
import { colors, customFocusOutline } from '@m-next/styles';

export const SearchContainer = styled.form`
  width: 100%;
  position: relative;
`;

export const Input = styled.input`
  box-sizing: border-box;
  border: 1px solid ${colors['grey-light']} !important;
  border-radius: 8px !important;
  color: ${colors['grey-dark']} !important;
  height: ${(p) => (p.isMobile ? '48px !important;' : '32px !important;')}
  margin: 0 !important;
  padding: ${(p) => (p.isMobile ? '0 48px 0 12px !important;' : '0 32px 0 12px !important;')}
  width: 100%;

  &::placeholder {
    color: ${colors['grey-dark']};
    opacity: 0.6;
  }

  &:hover {
    border-color: ${colors['grey-dark']} !important;
  }

  &:focus {
    border-color: ${colors['blue']} !important;
  }
`;

export const SearchIconWrapper = styled.span`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  height: ${(p) => (p.isMobile ? '48px;' : '32px;')}
  width:  ${(p) => (p.isMobile ? '48px;' : '32px;')}
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 50%;
    width: 1px;
    background-color: ${colors['grey-light']}; 
  }

  svg {
    fill: ${colors['grey-darkest']};
  }

  &:hover svg {
    fill: ${colors['blue-dark']};
  }

  ${Input}:hover ~ & {
    border-left-color: ${colors['grey-dark']};
  }

  ${Input}:focus ~ & {
    border-left-color: ${colors['blue']};
  }
`;

export const ClearIconContainer = styled.button`
  position: absolute;
  top: 0;
  right: 32px;
  height: ${(p) => (p.isMobile ? '48px;' : '32px;')} 
  width:  ${(p) => (p.isMobile ? '48px;' : '32px;')}
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: none;
  background: transparent;

  body.user-is-tabbing &:focus {
    ${customFocusOutline};
  }
`;

export const ClearIconWrapper = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    border-radius: 50%;
    height: 21px;
    width: 21px;
    background-color: ${colors.grey};
    opacity: 0;
    transition: 150ms ease-out;
  }

  &:hover {
    &:before {
      opacity: 0.15;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

export const ClearIcon = styled.span`
  height: 12px;

  &:before,
  &:after {
    content: '';
    height: 12px;
    border-left: 1px solid ${colors['grey-darkest']};
    position: absolute;
    top: 0;
  }

  &:after {
    transform: rotate(45deg);
  }

  &:before {
    transform: rotate(-45deg);
  }
`;
