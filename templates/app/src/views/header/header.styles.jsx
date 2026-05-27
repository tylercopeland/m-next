import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const Wrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    height: 56,
  },
]);

export const LeftWrapper = styled.h1(() => [
  {
    display: 'flex',
    gap: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: lightTheme.content.emphasize,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
]);

export const RightWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
]);

export const Header = styled.span(() => [
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '48vw',
  },
]);
