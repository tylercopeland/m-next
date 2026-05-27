import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const ScreenCardWrapper = styled.div(() => [
  {
    background: colors.white,
  },
]);

export const ScreenCardContent = styled.div(() => [
  {
    height: 130,
    marginBottom: 16,
    marginTop: 12,
    cursor: 'pointer',
  },
]);

export const ScreenCardHeader = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
]);

export const Spacer = styled.div(() => [
  {
    flexGrow: 1,
  },
]);

export const Pill = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
  },
]);

export const HeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 16,
  },
]);

export const DraftIndicator = styled.div(() => [
  {
    background: colors.orange,
    borderRadius: 8,
    width: 8,
    height: 8,
  },
]);
export const ScreenCardFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 4,
    width: '100%',
    alignItems: 'center',
  },
]);

export const DialogContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
]);
export const DialogInnerContent = styled.div(() => [
  {
    margin: 32,
  },
]);

export const DialogFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    background: colors['grey-lighter'],
    margin: -16,
    padding: 16,
  },
]);
