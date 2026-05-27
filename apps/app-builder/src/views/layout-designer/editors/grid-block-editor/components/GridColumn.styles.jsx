import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const GridColumnWrapper = styled.div(({ theme }) => [
  {
    display: 'flex',
    gap: 16,
    padding: 8,
    border: `1px solid ${theme.content.border}`,
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderRadius: 2,
  },
]);

export const CaptionColumn = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
]);

export const CaptionColumnContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
  },
]);

export const ConfigColumn = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);

export const SizeWrapper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
]);

export const SizeItemWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 4,
  },
]);
export const SizeItem = styled.div(({ selected, theme }) => [
  {
    border: `1px solid ${selected ? colors.blue : theme.content.border}`,
    color: selected ? colors.blue : theme.content.primary,
    borderRadius: 2,
    width: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    backgroundColor: selected ? '#EFF8FF' : null,
    cursor: 'pointer',
  },
]);
