import styled from '@emotion/styled';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { Z_UI } from '@m-next/layout-canvas';

export const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 48px;
  height: 100%;
  background-color: ${colors['white']};
  padding: 16px 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);
  z-index: ${Z_UI.TOOLBAR};
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

export const ToolbarButton = styled.button<{ isActive?: boolean; highlighted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  padding: 6px;
  color: ${colors['grey']};
  position: relative;

  ${({ highlighted }) => highlighted && `
    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 10px;
      padding: 2px;
      background: linear-gradient(124deg, #FF6B3D 18.11%, #7B2FF7 78.2%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
  `}

  &:hover:not(:disabled) {
    background-color: ${({ isActive }) => !isActive && colors['grey-lighter']};
    color: ${colors['grey-dark']};
  }

  ${({ isActive }) => isActive && `
    background-color: ${colors['concrete']};
    border: 0.5px solid #D5E9ED;
    box-shadow: inset -1px 1px 5px 0px rgba(0, 0, 0, 0.25);
  `}

  &:focus-visible {
    outline: 2px solid ${colors['blue']};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ButtonIcon = styled(SvgIcon)`
`;

export const AIButton = styled.button<{ highlighted?: boolean }>`
  position: relative;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors['white']};
  cursor: pointer;
  overflow: visible;
  transition: box-shadow 0.2s ease, border-radius 0.3s ease;

  ${({ highlighted }) => highlighted && `
    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      padding: 2px;
      background: linear-gradient(124deg, #FF6B3D 18.11%, #7B2FF7 78.2%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      z-index: -1;
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(124deg, #FF6B3D 18.11%, #7B2FF7 78.2%);
    border-radius: 50%;
    transition: rotate 0.3s ease;
  }

  & > * {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled)::before {
    rotate: 180deg;
  }

  &:hover:not(:disabled) > * {
    transform: scale(1.25);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${colors['blue']};
    outline-offset: 2px;
  }
`;