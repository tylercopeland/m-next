export type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ShadowToken = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ZIndexToken = 'base' | 'dropdown' | 'sticky' | 'modal' | 'popover' | 'toast';
export type TransitionToken = 'fast' | 'normal' | 'slow';
export type LineHeightToken = 'tight' | 'normal' | 'relaxed';
export type FontWeightToken = 'normal' | 'medium' | 'semibold' | 'bold';

export type ColorShade =
  | 'darkest'
  | 'darker'
  | 'dark'
  | 'base'
  | 'light'
  | 'lighter'
  | 'lightest';

export type ColorFamily =
  | 'blue'
  | 'green'
  | 'fuchsia'
  | 'yellow'
  | 'red'
  | 'grey'
  | 'purple'
  | 'orange'
  | 'teal';

export interface ColorPalette {
  black: string;
  white: string;
  concrete: string;
  blue: Record<ColorShade, string>;
  green: Record<ColorShade, string>;
  fuchsia: Record<ColorShade, string>;
  yellow: Record<ColorShade, string>;
  red: Record<ColorShade, string>;
  grey: Record<ColorShade, string>;
  purple: Record<ColorShade, string>;
  orange: Record<ColorShade, string>;
  teal: Partial<Record<ColorShade, string>>;
  method: { base: string; light: string; lightest: string };
}

export const spacing: Record<SpacingToken, number>;
export const radius: Record<RadiusToken, number>;
export const shadow: Record<ShadowToken, string>;
export const zIndex: Record<ZIndexToken, number>;
export const transition: Record<TransitionToken, string>;
export const lineHeight: Record<LineHeightToken, number>;
export const fontWeight: Record<FontWeightToken, number>;
export const colors: ColorPalette;
export const colorFamilies: ColorFamily[];
export const colorShades: ColorShade[];
export const cssVariables: string;

declare const tokens: {
  spacing: Record<SpacingToken, number>;
  radius: Record<RadiusToken, number>;
  shadow: Record<ShadowToken, string>;
  zIndex: Record<ZIndexToken, number>;
  transition: Record<TransitionToken, string>;
  lineHeight: Record<LineHeightToken, number>;
  fontWeight: Record<FontWeightToken, number>;
  colors: ColorPalette;
};

export default tokens;
