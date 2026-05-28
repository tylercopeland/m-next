import styled from '@emotion/styled';

export const HeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '0px 8px',
    lineHeight: '24px',
  },
]);
export const CrumbsWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    lineHeight: '24px',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '& > *': {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      overflow: 'hidden',
    },
  },
]);
