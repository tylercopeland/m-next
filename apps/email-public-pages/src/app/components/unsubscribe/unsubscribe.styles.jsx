import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const InnerContentWrapper = styled.div(() => [
  {
    position: 'absolute',
    top: 48,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 24,
    justifyContent: 'center',
  },
]);

export const H1 = styled.h1(() => [
  {
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '36px',
  },
]);

export const MessageDiv = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
]);

export const p = styled.p(() => [
  {
    maxWidth: 600,
    gap: '8px',
    textAlign: 'center',
    lineHeight: '24px',
    fontSize: 16,
  },
]);

export const Divider = styled.hr(() => [
  {
    maxWidth: '400px',
    width: '80%',
    border: 'solid',
    borderWidth: 1,
    borderColor: colors['grey-light'],
  },
]);
