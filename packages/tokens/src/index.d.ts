export type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ShadowToken = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type ZIndexToken = 'base' | 'dropdown' | 'sticky' | 'modal' | 'popover' | 'toast';
export type TransitionToken = 'fast' | 'normal' | 'slow';
export type LineHeightToken = 'tight' | 'normal' | 'relaxed';
export type FontWeightToken = 'normal' | 'medium' | 'semibold' | 'bold';

export const spacing: Record<SpacingToken, number>;
export const radius: Record<RadiusToken, number>;
export const shadow: Record<ShadowToken, string>;
export const zIndex: Record<ZIndexToken, number>;
export const transition: Record<TransitionToken, string>;
export const lineHeight: Record<LineHeightToken, number>;
export const fontWeight: Record<FontWeightToken, number>;
export const cssVariables: string;

declare const tokens: {
  spacing: Record<SpacingToken, number>;
  radius: Record<RadiusToken, number>;
  shadow: Record<ShadowToken, string>;
  zIndex: Record<ZIndexToken, number>;
  transition: Record<TransitionToken, string>;
  lineHeight: Record<LineHeightToken, number>;
  fontWeight: Record<FontWeightToken, number>;
};

export default tokens;
