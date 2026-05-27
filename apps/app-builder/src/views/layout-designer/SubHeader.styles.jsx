import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div(({ theme }) => [
  {
    display: 'flex',
    width: '100%',
    height: 40,
    background: theme.background.primary,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
]);

export const ResolutionWrapper = styled.div(({ theme }) => [
  {
    display: 'flex',
    background: theme.background.secondary,
    gap: 8,
    borderRadius: 8,
    boxShadow: '-1px 1px 6px 0px rgba(0, 0, 0, 0.12) inset',
    padding: ' 1px 4px',
    alignItems: 'center',
  },
]);
export const Spacer = styled.div(() => [
  {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

export const ScreenSelectWrapper = styled.div(() => [
  {
    display: 'flex',
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

export const Divider = styled.div(({ theme }) => [
  {
    borderRight: `1px solid ${theme.content.border}`,
    marginLeft: 8,
    marginTop: -12,
    marginBottom: -12,
  },
]);
