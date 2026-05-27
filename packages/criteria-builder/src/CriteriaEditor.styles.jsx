import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const EmptyColumnWrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
]);

export const EmptyRowWrapper = styled.div(() => [
  {
    padding: 16,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    border: `1px solid ${colors['grey-lighter']}`,
    background: colors.white,
  },
]);
