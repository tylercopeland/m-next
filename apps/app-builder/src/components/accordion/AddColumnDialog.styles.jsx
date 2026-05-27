import styled from '@emotion/styled';

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

export default NoResultsWrapper;
