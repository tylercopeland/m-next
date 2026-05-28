import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';

export const Line = styled.div(() => [
  {
    marginBottom: 0,
  },
]);

export const ReadOnlyLine = styled.div(({ theme, selected, initial }) => {
  const style = [
    {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      margin: 0,
      lineBreak: 'anywhere',
      fontSize: '14px',
      color: theme.content ? theme.content.primary : lightTheme.content.primary,
      minHeight: 28,
      padding: selected ? 7 : 8,
    },
  ];
  if (selected) {
    style.push({
      border: `1px solid ${colors.blue.base}`,
      borderRadius: '2px',
      transition: initial ? null : 'background-color .5s linear',
      background: initial ? colors.concrete : null,
      boxShadow: '0px 0px 0px 2px rgba(13, 113, 200, 0.2)',
    });
  }

  return style;
});

export const EmptyWrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
]);

export const ReadonlyLabel = styled.div(({ theme, padding }) => [
  {
    fontWeight: 700,
    margin: 0,
    padding: 0,
    color: theme.content ? theme.content.primary : lightTheme.content.primary,
    lineHeight: '20px',
    paddingBottom: padding || 0,
  },
]);

export const ReadonlyValue = styled.span(() => [
  {
    margin: 0,
    lineHeight: '20px',
  },
]);

export const ReadOnlyIconValue = styled.div(() => [
  {
    gap: 8,
    display: 'flex',
    alignItems: 'center',
  },
]);

export const CollapseEmptyButton = styled.div(() => [
  {
    alignSelf: 'end',
  },
]);

export const ButtonFooter = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    flexDirection: 'row',
  },
]);

export const SectionHeader = styled.h2(({ theme }) => [
  {
    margin: 0,
    padding: '4px 0 8px',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.4,
    color: theme.content ? theme.content.primary : lightTheme.content.primary,
  },
]);

export const SectionDescription = styled.div(() => [
  {
    margin: 0,
    padding: '0 0 8px',
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.4,
    color: colors.grey.base,
  },
]);
