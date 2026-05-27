import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div(({ selected }) => {
  let border = `0px solid ${colors['grey-light']}`;
  if (selected) {
    border = `1px solid ${colors['blue']}`;
  }

  return {
    flex: 1,
    marginLeft: 16,
    minHeight: 600,
    height: '100vh',
    position: 'relative',
    width: 'calc(100% - 440px)',
    backgroundColor: colors.white,
    border,
    boxShadow: selected ? '0px 0px 0px 2px rgba(13, 113, 200, 0.2)' : null,
    marginRight: 8,
    marginTop: 8,
    padding: selected ? 0 : 1,
    boxSizing: 'border-box',
    '&:hover': {
      border: `1px solid ${colors['grey-light']}`,
      cursor: 'pointer',
      padding: 0,
    },
  };
});

export const TabHeaderBadge = styled.div(({ selected }) => ({
  height: 16,
  borderRadius: 16,
  backgroundColor: selected ? colors['blue'] : colors['grey-light'],
  display: 'inline-block',
  marginLeft: 4,
  padding: '0px 4px',
  minWidth: 16,
  fontSize: 12,
  textAlign: 'center',
  color: selected ? colors['white'] : colors['grey-dark'],
}));
