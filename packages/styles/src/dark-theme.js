import colors from './colors';

export default {
  background: {
    primary: '#2E2E2E',
    secondary: '#424242',
    subtle: '#212121',
    page: '#151515',
  },
  content: {
    primary: '#F8F8F8',
    secondary: colors.blue,
    emphasize: colors.white,
    subtle: '#949494',
    disabled: colors['grey-light'],
    border: colors['grey-light'],
  },
  informative: {
    primary: colors['grey-dark'],
    secondary: colors.blue,
    background: colors['blue-lighter'],
    iconBackground: colors['blue-light'],
    icon: colors['blue-dark'],
  },
  negative: {
    primary: colors['red-darker'],
    secondary: colors['red'],
    background: colors['red-lighter'],
    iconBackground: colors['red'],
    icon: colors['white'],
  },
  positive: {
    primary: colors['green-darker'],
    secondary: colors['green'],
    background: colors['green-lighter'],
    iconBackground: colors['green'],
    icon: colors['white'],
  },
  fontSizes: {
    small: 12,
    medium: 14,
    mediumLarge: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 26,
  },
  fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
};
