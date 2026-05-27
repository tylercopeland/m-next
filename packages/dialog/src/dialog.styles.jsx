import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';

export const DialogHeaderWrapper = styled.div(({ theme }) => {
  const { content, background } = theme;
  return [
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
      backgroundColor: background ? background.primary : lightTheme.background.primary,
      borderBottom: `1px solid ${content ? content.border : lightTheme.content.border}`,
      height: 56,
    },
  ];
});

// Real <button> so it's keyboard-focusable and screen-reader-announced.
export const DialogHeaderDismissButton = styled.button(() => [
  {
    margin: 16,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: 4,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    color: colors.grey.darkest,
    ':focus-visible': {
      outline: `2px solid ${colors.blue.base}`,
      outlineOffset: 2,
    },
  },
]);

export const DialogHeaderTitle = styled.h4(({ theme }) => [
  {
    margin: '0px 16px',
    flexGrow: 1,
    fontSize: '18px',
    color: theme.content ? theme.content.emphasize : lightTheme.content.emphasize,
    fontWeight: 600,
    lineHeight: '24px',
  },
]);

export const DialogBodyWrapper = styled.div(({ theme, maxHeight }) => [
  {
    display: 'flex',
    flexGrow: 1,
    padding: 16,
    flexShrink: 1,
    overflow: 'auto',
    outline: 'none',
    backgroundColor: theme.background ? theme.background.primary : lightTheme.background.primary,
    maxHeight: maxHeight || 'auto',
  },
]);

export const DialogFooterWrapper = styled.div(({ theme }) => [
  {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: colors.grey.lighter,
    borderBottom: `1px solid ${theme.content ? theme.content.border : lightTheme.content.border}`,
    minHeight: 56,
    padding: 8,
  },
]);
