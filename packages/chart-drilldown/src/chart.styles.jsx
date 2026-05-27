import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const EmptyState = styled.div(() => [
  {
    display: 'flex',
    background: colors.white,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    height: '100%',
    textAlign: 'center',
  },
]);

export const EmptyWrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
]);
