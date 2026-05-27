import colors from './colors';

export default {
  palette: {
    mode: 'light',
    primary: {
      main: colors.blue,
      light: colors['blue-light'],
      dark: colors['blue-dark'],
      contrastText: colors.white,
    },
    secondary: {
      main: colors.purple,
      light: colors['purple-light'],
      dark: colors['purple-dark'],
      contrastText: colors.white,
    },
    error: {
      main: colors.red,
      light: colors['red-light'],
      dark: colors['red-dark'],
      contrastText: colors.white,
    },
    warning: {
      main: colors.yellow,
      light: colors['yellow-light'],
      dark: colors['yellow-dark'],
      contrastText: colors.white,
    },
    info: {
      main: colors['grey-dark'],
      light: colors['grey-light'],
      dark: colors['grey-darker'],
      contrastText: colors.white,
    },
    success: {
      main: colors.green,
      light: colors['green-light'],
      dark: colors['green-dark'],
      contrastText: colors.white,
    },
    grey: {
      50: colors['grey-lightest'],
      100: colors['grey-lighter'],
      200: colors['grey-light'],
      300: colors['grey'],
      400: colors['grey-dark'],
      500: colors['grey-darker'],
      600: colors['grey-darkest'],
    },
    text: {
      primary: colors['grey-dark'],
      secondary: colors['grey-darker'],
      disabled: colors['grey-light'],
    },
    divider: colors['grey-light'],
    background: {
      default: colors.white,
      paper: '#f6fafb',
    },
    action: {
      disabledOpacity: 0.8,
    },
  },
  fontSizes: {
    xsmall: 10,
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 22,
    xxxlarge: 30,
  },
  fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
};
