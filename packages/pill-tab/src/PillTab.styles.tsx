import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const PillTabContainer = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px',
  background: 'rgba(223, 233, 237, 1)',
  borderRadius: '8px',
  boxShadow: 'inset -1px 1px 6px 0px rgba(0, 0, 0, 0.12)',
  width: 'fit-content',
  height: '32px',
});

const baseTabStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '24px',
  minWidth: '64px',
  padding: '0 8px',
  borderRadius: '4px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
};

export const PillTabButton = styled.button<{ isSelected: boolean; disabled?: boolean }>(
  baseTabStyles,
  ({ isSelected, disabled }) => ({
    background: isSelected ? '#FFFFFF' : 'transparent',
    color: disabled ? '#9CA3AF' : '#374151',
    boxShadow: isSelected ? '0px 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
    pointerEvents: disabled ? 'none' : 'auto',
    opacity: disabled ? 0.5 : 1,

    '&:hover': (!disabled && !isSelected) && {
      background: colors['grey-light'],
    },

    '&:active': (!disabled && !isSelected) && {
      background: '#ffffff',
    },
  })
);

export const PillTabLink = styled(PillTabButton.withComponent('a'))({
  textDecoration: 'none',
});
