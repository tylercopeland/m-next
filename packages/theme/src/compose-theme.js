import * as tokens from '@m-next/tokens';
import { lightTheme, darkTheme, funTheme } from '@m-next/styles';

const named = {
  light: lightTheme,
  dark: darkTheme,
  fun: funTheme,
};

const composeTheme = (nameOrObject) => {
  const base = typeof nameOrObject === 'string' ? named[nameOrObject] : nameOrObject;
  if (!base) {
    throw new Error(`@m-next/theme: unknown theme "${nameOrObject}". Expected one of: ${Object.keys(named).join(', ')}`);
  }
  return {
    ...base,
    spacing: tokens.spacing,
    radius: tokens.radius,
    shadow: tokens.shadow,
    zIndex: tokens.zIndex,
    transition: tokens.transition,
    lineHeight: tokens.lineHeight,
    fontWeight: tokens.fontWeight,
  };
};

export const themeNames = Object.keys(named);
export default composeTheme;
