import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const Wrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
  },
]);

export const NavLinkWrapper = styled.div((props) => {
  const { selected } = props;
  return [
    {
      padding: 8,
      paddingTop: 12,
      borderRadius: 4,
      ':focus-visible': {
        outline: 'none',
        boxShadow: '#0d71c8 0px 0px 0px 2.5px',
      },
      backgroundColor: selected ? colors['grey-lighter'] : null,
    },
  ];
});

export const NavLink = styled.div(() => [
  {
    color: lightTheme.content.emphasize,
    fontSize: '14px',
    padding: '8px',
    textAlign: 'center',
    height: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
]);

export const NavLinkButton = styled.div(() => [
  {
    backgroundColor: lightTheme.background.primary,
    borderRadius: 32,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
    padding: 8,
  },
]);

export const NavLinkLabel = styled.span((props) => {
  const { selected } = props;

  return [{ color: selected ? lightTheme.content.secondary : lightTheme.content.primary }];
});
