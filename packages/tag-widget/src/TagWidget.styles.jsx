import styled from '@emotion/styled';

export const ReadonlyTags = styled.div(({ hasCaption }) => [
  {
    display: 'flex',
    margin: 0,
    gap: 4,
    paddingTop: hasCaption ? 8 : null,
    flexWrap: 'wrap',
  },
]);

export const ReadonlyWrapper = styled.div(() => [
  {
    position: 'relative',
  },
]);
