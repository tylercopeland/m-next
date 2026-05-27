import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

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

export const LineWrapperColumn = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 16,
  },
]);

export const StateWrapper = styled.div(({ theme, selected }) => [
  {
    border: `2px solid ${selected ? colors.blue : theme.content.border}`,
    backgroundColor: selected ? '#EFF8FF' : null,
    display: 'flex',
    padding: 8,
    gap: 16,
    width: '100%',
    cursor: 'pointer',
  },
]);
