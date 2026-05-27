import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const ViewerContainer = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  background: colors['concrete'],
  height: '100%',
  overflowY: 'auto',
  padding: '32px'
});

export const TabSidebar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: '32px',
});

interface TabButtonProps {
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export const TabButton = styled.button<TabButtonProps>((props) => {
  const { isActive, isFirst, isLast } = props;

  return {
    padding: '12px',
    transition: 'all 0.2s ease-in-out',
    borderRight: 0,
    backgroundColor: isActive ? 'rgb(37, 99, 235)' : colors.white,
    color: isActive ? colors.white : colors.grey,
    border: `1px solid ${isActive ? 'rgb(37, 99, 235)' : 'rgb(229, 231, 235)'}`,
    cursor: 'pointer',
    borderTopLeftRadius: isFirst ? '8px' : 0,
    borderBottomLeftRadius: isLast ? '8px' : 0,
    borderTop: isFirst || isActive ? `1px solid ${isActive ? 'rgb(37, 99, 235)' : 'rgb(229, 231, 235)'}` : 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      backgroundColor: isActive ? 'rgb(37, 99, 235)' : 'rgb(249, 250, 251)',
      color: isActive ? colors.white : colors['grey-dark'],
    },

    '&:focus': {
      outline: 'none',
    },
  };
});

export const ContentArea = styled.div({
  flex: 1,
  backgroundColor: colors.white,
  borderRadius: '16px',
  border: '1px solid rgb(229, 231, 235)',
  boxShadow: '0 10px 10px 0 rgba(0, 0, 0, 0.25)',
  overflow: 'hidden',
  // this extra padding at the bottom is intentional and according to design
  paddingBottom: '16px'
});
