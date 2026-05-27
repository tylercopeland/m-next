import styled from '@emotion/styled';

export const Wrapper = styled.div((props) => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flexGrow: 1,
    minHeight: 400,
    padding: props.padding,
  },
]);

export const LineWrapper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'space-between',
  },
]);
