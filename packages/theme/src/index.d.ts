import * as React from 'react';
import type {
  SpacingToken,
  RadiusToken,
  ShadowToken,
  ZIndexToken,
  TransitionToken,
  LineHeightToken,
  FontWeightToken,
} from '@m-next/tokens';

export type ThemeName = 'light' | 'dark' | 'fun';

export interface ComposedTheme {
  spacing: Record<SpacingToken, number>;
  radius: Record<RadiusToken, number>;
  shadow: Record<ShadowToken, string>;
  zIndex: Record<ZIndexToken, number>;
  transition: Record<TransitionToken, string>;
  lineHeight: Record<LineHeightToken, number>;
  fontWeight: Record<FontWeightToken, number>;
  [key: string]: unknown;
}

export interface ThemeProviderProps {
  name?: ThemeName;
  theme?: ThemeName | object;
  defaultName?: ThemeName;
  injectCssVariables?: boolean;
  children?: React.ReactNode;
}

export interface ThemeSwitcher {
  current: ThemeName | string;
  setTheme: (name: ThemeName) => void;
  available: ThemeName[];
}

export const ThemeProvider: React.FC<ThemeProviderProps>;
export const useTheme: () => ComposedTheme;
export const useThemeSwitcher: () => ThemeSwitcher;
export const composeTheme: (nameOrObject: ThemeName | object) => ComposedTheme;
export const themeNames: ThemeName[];

declare const _default: typeof ThemeProvider;
export default _default;
