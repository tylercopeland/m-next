import { colors } from '@m-next/styles';
import React from 'react';
import styled from '@emotion/styled';

// Style constants
export const PALETTE_CONSTANTS = {
  PALETTE_WIDTH_OPEN: '256px',
  ICON_SIZE: 32,
  TRANSITION_DURATION: '0.2s',
} as const;

// Component style functions
export const getPaletteContainerStyles = (open: boolean): React.CSSProperties => ({
  position: 'relative',
  width: open ? PALETTE_CONSTANTS.PALETTE_WIDTH_OPEN : '0px',
  height: '100%',
  background: colors.white,
  display: 'flex',
  flexDirection: 'column',
  transition: `width ${PALETTE_CONSTANTS.TRANSITION_DURATION} ease-out`,
  overflow: 'hidden',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
});

export const getSearchContainerStyles = (isScrolled: boolean): React.CSSProperties => ({
  padding: '16px 16px 8px 16px',
  overflow: 'hidden',
  flexShrink: '0',
  borderBottom: isScrolled ? `1px solid ${colors['grey-lighter']}` : 'none',
});

export const categoryHeaderStyles: React.CSSProperties = {
  padding: '12px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '4px',
};

export const getCategoryContentStyles = (isOpen: boolean): React.CSSProperties => ({
  display: isOpen ? 'block' : 'none',
  padding: '4px 12px',
});

export const componentGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '8px',
};

export const emptyStateStyles: React.CSSProperties = {
  padding: '32px 16px',
  textAlign: 'center',
  paddingTop: '56px',
};

export const getHeaderContentStyle = (): React.CSSProperties => ({
  borderBottom: `1px solid ${colors['grey-lighter']}`,
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const headerTextStyle: React.CSSProperties = {
  color: colors.black,
  fontFeatureSettings: "'liga' off, 'clig' off",
  textOverflow: 'ellipsis',
  fontFamily: '"Source Sans Pro"',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '24px',
};

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

export const getContentContainerStyle = (open: boolean): React.CSSProperties => ({
  gap: 16,
  padding: '8px 0px 96px 0px',
  opacity: open ? 1 : 0,
  transition: 'opacity 200ms ease-in-out',
  flex: '1',
});
