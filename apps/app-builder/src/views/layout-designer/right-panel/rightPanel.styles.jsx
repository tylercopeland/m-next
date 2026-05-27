import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const EmptyWrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    fontSize: 20,
    padding: 16,
  },
]);

export const Header = styled.h2(() => [
  {
    width: '100%',
    borderBottom: `1px solid ${colors['grey-light']}`,
    padding: 8,
    margin: 0,
    fontSize: 18,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: colors.white,
  },
]);
