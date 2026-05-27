import colors from './colors';

export default {
  background: {
    primary: colors.white,
    secondary: colors.concrete,
    subtle: colors['grey-light'],
    page: '#f6fafb',
  },
  content: {
    primary: colors['grey-dark'],
    secondary: colors.blue,
    emphasize: colors['grey-darker'],
    subtle: colors.grey,
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
  warning: {
    primary: colors['yellow-darker'],
    secondary: colors.yellow,
    background: colors['yellow-lighter'],
    iconBackground: colors['yellow-darker'],
    icon: colors['yellow-lighter'],
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
