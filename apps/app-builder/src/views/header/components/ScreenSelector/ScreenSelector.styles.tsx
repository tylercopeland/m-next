import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { Z_POPUP } from '@m-next/layout-canvas';

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: visible;
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  font-size: 16px;
  font-weight: 600; 
  color: ${colors['grey']};
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: ${colors['grey-lighter']};
    color: ${colors['grey-dark']};
  }

  &:focus-visible {
    outline: 2px solid ${colors['blue']};
    outline-offset: 2px;
  }
`;

export const ScreenName = styled.span<{ wide?: boolean }>`
  max-width: ${({ wide }) => (wide ? '208px' : '144px')};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
`;

export const ChevronIcon = styled.svg<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

export const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 160px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid #DFE9ED;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  overflow: visible;
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};

  z-index: ${Z_POPUP.SCREEN_SELECTOR};
`;

export const SearchContainer = styled.div`
  margin-bottom: 8px;
`;

export const MenuItemsContainer = styled.div<{ hasSearch: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const MenuItem = styled.div<{ isSelected: boolean; isFocused: boolean }>`
  font-size: 12px;
  padding: 4px 6px;
  width: 100%;
  color: ${({ isFocused }) => {
    if (isFocused) return colors['grey-darker'];
    return colors['grey-dark'];
  }};
  cursor: pointer;
  transition: background-color 0.15s ease, border 0.15s ease;
  border-radius: 4px;
  border: 1px solid transparent;
  background-color: ${({ isFocused, isSelected }) => {
    if (isSelected) return colors['blue-lighter'];
    if (isFocused) return colors['concrete'];
    return 'transparent';
  }};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? colors['blue-lighter'] : colors['concrete'])};
    border-color: ${({ isSelected }) => (isSelected ? colors['blue-light'] : 'transparent')};
  }
`;

export const NoResults = styled.div`
  padding: 8px 4px;
  font-size: 12px;
  color: ${colors['grey']};
  text-align: center;
`;