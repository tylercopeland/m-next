import styled from '@emotion/styled';
import { colors, customFocusOutline } from '@m-next/styles';

export const RibbonManagementWrapper = styled.div(({ isMobile }) => ({
  display: 'flex',
  gap: isMobile ? 0 : 8,
  flexDirection: 'column',
  margin: isMobile ? 0 : 16,
  marginBottom: isMobile ? 0 : 32,
  flexGrow: 1,
  minWidth: 343,
  overflow: 'hidden',
  paddingBottom: 64,
}));

export const NoResultsWrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 0px',
  },
]);

export const NotVisibleWrapper = styled.div(({ hasVisibleItems }) => ({
  display: 'flex',
  gap: 8,
  flexDirection: 'column',
  marginTop: hasVisibleItems ? -8 : 0,
}));

export const RibbonItemWrapper = styled.div(({ visible, isDragging }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'stretch',
  borderRadius: 8,
  border: isDragging ? '1px solid rgba(13, 113, 200, 0.50)' : `1px solid ${colors['grey-light']}`,
  padding: '8px 12px',
  backgroundColor: colors['white'],
  opacity: visible ? 1 : 0.6,
  gap: 4,
  boxSizing: 'border-box',
  boxShadow: isDragging ? '0px 0px 14px 0px rgba(44, 143, 229, 0.25)' : 'none',
  '&:hover': {
    border: '1px solid rgba(13, 113, 200, 0.50)',

    boxShadow: '0px 0px 14px 0px rgba(44, 143, 229, 0.25)',
  },
  cursor: isDragging ? 'grabbing' : 'pointer',
}));

export const RibbonItemMobileWrapper = styled.div`
  position: relative;
  width: 96%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  flex-direction: row;
  padding: 16px;
  min-height: 72px;
  background-color: ${colors['white']};
  &:hover {
    background-color: #f6fafb;
    transition: background-color 0.5s ease;
    border-radius: 4px;

    .ribbon-icon-count {
      box-shadow: 0 0 0 2px ${colors['concrete']};
    }
  }
  outline: none;
  body.user-is-tabbing &:focus {
    border-radius: 4px;
    ${customFocusOutline};
  }

  border-bottom: 1px solid ${colors['grey-light']};
  opacity: ${({ visible }) => (visible ? 1 : 0.6)};
  box-shadow: ${({ isDragging }) => (isDragging ? `0px 1px 17.6px 0px rgba(0, 0, 0, 0.12)` : '')};
  cursor: ${({ isDragging }) => (isDragging ? 'grabbing' : 'pointer')};
`;

export const RibbonIcon = styled.div(({ color }) => ({
  position: 'relative',
  height: 40,
  width: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
  background: colors['white'],
  color,
  cursor: 'pointer',
  boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.3)',

  '&:hover': {
    background: color,
    color: colors['white'],
    transition: 'background-color 0.5s ease',
  },
}));

export const RibbonCaption = styled.span({
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: '40px',
  paddingLeft: '16px',
  cursor: 'pointer',
});

export const RibbonAddIcon = styled.div`
  color: ${colors['grey-darker']};
  border-radius: 50px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    color: ${colors['blue-darkest']};
    background-color: ${colors['grey-lighter']};
    transition: background-color 0.5s ease;
  }
  outline: none;
  body.user-is-tabbing &:focus {
    ${customFocusOutline};
  }
`;

export const RibbonName = styled.div({
  flexGrow: 1,
  padding: '2px 4px',
  boxSizing: 'border-box',
});
