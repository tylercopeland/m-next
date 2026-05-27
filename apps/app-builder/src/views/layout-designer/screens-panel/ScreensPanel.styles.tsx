import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const SidebarContainer = styled.div`
  position: relative;
  width: 256px;
  height: 100%;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-out;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
`;

export const SidebarHeader = styled.div`
  border-bottom: 1px solid ${colors['grey-lighter']};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SidebarTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${colors['grey-darker']};
`;

export const CloseButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  & svg {
    width: 10px;
    height: 10px;
  }
`;

export const ScreensInfo = styled.div`
  padding: 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ScreenCount = styled.div`
  font-size: 12px;
  color: ${colors['grey']};
  font-weight: 600;
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors['grey']};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors['grey-lighter']};
    color: ${colors['grey-darker']};
  }
`;

export const ScreensList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ScreenItem = styled.button<{ isActive?: boolean; isDisabled?: boolean }>`
  display: flex;
  padding: 2px 4px 2px 8px;
  align-items: center;
  gap: 8px;
  width: 100%;
  background-color: ${({ isActive }) => (isActive ? colors['blue-lighter'] : 'transparent')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${({ isDisabled }) => (isDisabled ? 'transparent' : colors['blue-lighter'])};
  }
`;

export const ScreenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${colors['grey']};
`;

export const ScreenName = styled.span`
  font-size: 14px;
  color: ${colors['grey-dark']};
  flex: 1;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid #d9d9d9;
  border-right-color: ${colors['green']};
  animation: l2 1s infinite linear;

  @keyframes l2 {
    to {
      transform: rotate(1turn);
    }
  }
`;
