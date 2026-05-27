import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { Z_UI } from '@m-next/layout-canvas';

export const Wrapper = styled.div(() => [
  {
    display: 'flex',
    padding: '8px 16px 8px 8px',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    background: '#FFF',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    zIndex: Z_UI.HEADER,
    height: '48px'
  },
]);

export const LeftWrapper = styled.h1(() => [
  {
    display: 'flex',
    width: 360,
    height: 32,
    alignItems: 'center',
    gap: 8,
    color: lightTheme.content.emphasize,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 'normal',
  },
]);

export const RightWrapper = styled.div(() => [
  {
    display: 'flex',
    width: 360,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
]);

export const Header = styled.span(({ theme }) => [
  {
    display: 'flex',
    alignItems: 'center',
    textOverflow: 'ellipsis',
    overflow: 'visible',
    whiteSpace: 'nowrap',
    color: theme.content.primary,
  },
]);

export const HeaderAppName = styled.span(({ wide }) => [
  {
    fontWeight: 600,
    fontSize: '16px',
    maxWidth: wide ? '208px' : '144px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);

export const HeaderScreenName = styled.h3(() => [
  {
    fontWeight: 400,
  },
]);

export const ScreenDropdownWrapper = styled.div(() => [
  {
    position: 'relative',
    display: 'inline-block',
  },
]);

export const ScreenNameButton = styled.button(({ theme }) => [
  {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: 400,
    color: theme.content.secondary,
    backgroundColor: 'rgba(223, 233, 237, 1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(213, 223, 227, 1)',
    },
  },
]);

export const CenterWrapper = styled.div(() => [
  {
    display: 'flex',
    height: 32,
    padding: '2px 4px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
]);

export const ToggleItem = styled.div(({ theme, selected }) => [
  {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 8,
    padding: ' 4px 8px;',
    background: selected ? theme.background.primary : null,
    boxShadow: selected ? '0px 4px 8px 0px rgba(0, 0, 0, 0.10)' : null,
    cursor: 'pointer',
  },
]);

export const SaveWrapper = styled.span(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
]);



// LEGACY

// The styles below are legacy and will be removed in future refactors.

export const LegacyWrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    height: '48px',
  },
]);

export const LegacyLeftWrapper = styled.h1(() => [
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

export const LegacyRightWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 170,
  },
]);

export const LegacHeader = styled.span(({theme}) => [
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: theme.content.primary
  },
]);

export const LegacyCenterWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 12,
    padding: 4,
    background: 'rgba(186, 202, 208, 0.50)',
    marginRight: 48,
  },
]);

export const LegacyToggleItem = styled.div(({ theme, selected }) => [
  {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 8,
    padding: ' 4px 8px;',
    background: selected ? theme.background.primary : null,
    boxShadow: selected ? '0px 4px 8px 0px rgba(0, 0, 0, 0.10)' : null,
    cursor: 'pointer',
  },
]);

export const LegacySaveWrapper = styled.span(({ editing }) => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: editing? 84 : undefined,
  },
]);