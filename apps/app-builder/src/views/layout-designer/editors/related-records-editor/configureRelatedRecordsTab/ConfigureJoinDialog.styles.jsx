import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

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
    padding: 8,
    paddingBottom: 24,
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

export const Container = styled.div(() => [
  {
    borderRadius: 8,
    border: `1px solid ${colors['grey-light']}`,
    background: colors.white,
    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.10)',
    padding: 16,
    width: 348,
  },
]);

export const ColorBlock = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 8,
    width: 316,
    height: 192,
    marginBottom: 8,
  },
]);

export const FieldSelectorWrapper = styled.div(() => [
  {
    display: 'flex',
    paddingLeft: 32,
  },
]);

export const AppNameWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    lineHeight: '32px',
  },
]);

export const JoinIconWrapper = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
  },
]);