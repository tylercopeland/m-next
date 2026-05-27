import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const MenuItemWrapper = styled.div((props) => {
  const { theme, selected, disabled, active } = props;
  const { content, fontSizes, background } = theme;
  let defaultColor = content ? content.primary : lightTheme.content.emphasize;
  const defaultBackgrounColor = background ? background.primary : lightTheme.background.primary;
  const defaultFontSizes = fontSizes || lightTheme.fontSizes;

  if (disabled) defaultColor = content ? content.subtle : colors['grey-light'];

  const style = [
    {
      fontSize: defaultFontSizes.medium,
      backgroundColor: selected || active ? colors['grey-lighter'] : defaultBackgrounColor,
      color: selected || active ? lightTheme.content.secondary : defaultColor,
      cursor: disabled ? null : 'pointer',
      padding: 8,
      ':hover': {
        backgroundColor: disabled ? defaultBackgrounColor : colors['grey-lighter'],
        color: disabled ? defaultColor : lightTheme.content.secondary,
      },
    },
  ];
  return style;
});

export const MenuHeader = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'center',
    padding: '0px 8px',
    color: lightTheme.content.subtle,
    fontSize: '75%',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
]);
export const IconMenuWrapper = styled.div(() => [{}]);
