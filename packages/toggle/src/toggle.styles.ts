/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { colors, customOffsetFocusOutline, lightTheme } from '@m-next/styles';

import type { Theme } from '@emotion/react';
import type { ToggleSize } from './types';

export type { ToggleSize };

/** Theme with optional design tokens (from @m-next/styles) */
interface ThemeWithContent extends Theme {
  content?: { primary: string };
}

export interface WrapperProps {
  alignRight?: boolean;
  isRuntime?: boolean;
  isV4Design?: boolean;
  width?: string;
}

export interface LabelProps {
  bold?: boolean;
  alignRight?: boolean;
  isV4Design?: boolean;
}

export interface LabelTextProps {
  hasTooltip?: boolean;
}

export interface CircleProps {
  checked?: boolean;
  size?: ToggleSize;
  focused?: boolean;
  isRuntime?: boolean;
  sizeVariant?: ToggleSize;
  color?: string;
}

export interface TrackProps {
  checked?: boolean;
  isRuntime?: boolean;
  size?: ToggleSize;
  color?: string;
}

export interface InputProps {
  color?: string;
}

export interface OnTextProps {
  checked?: boolean;
}

export interface OffTextProps {
  checked?: boolean;
}

export interface ToggleWrapperProps {
  disabled?: boolean;
  alignRight?: boolean;
  isFocused?: boolean;
  isRuntime?: boolean;
  isV4Design?: boolean;
  size?: ToggleSize;
}

export const Wrapper = styled.div<WrapperProps>`
  display: ${(p) => (p.isRuntime ? 'inline-block' : 'flex')};
  align-items: ${(p) => (p.isRuntime ? 'none' : 'center')};
  justify-content: ${(p) => (p.isRuntime ? 'none' : 'space-between')};
  padding: 0;
  width: ${(p) => (p.width ? p.width : 'auto')};
  ${(p) =>
    p.isV4Design &&
    `
    max-width: 100%;
  `}
`;

export const Label = styled.div<LabelProps>`
  font-size: 14px;
  font-weight: ${(p) => (p.bold ? 600 : 400)};
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-left: ${(p) => (p.alignRight ? '16px' : 0)};
  padding-right: ${(p) => (p.alignRight ? 0 : '16px')};
  order: ${(p) => (p.alignRight ? 1 : 0)};
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(p) =>
    (p.theme as ThemeWithContent)?.content
      ? (p.theme as ThemeWithContent).content!.primary
      : lightTheme.content.primary};

  ${(p) =>
    p.isV4Design &&
    `
    min-width: 0;
  `}
`;

export const LabelText = styled.span<LabelTextProps>`
  border-bottom: ${(p) =>
    p.hasTooltip
      ? `1px dashed ${
          (p.theme as ThemeWithContent)?.content
            ? (p.theme as ThemeWithContent).content!.primary
            : lightTheme.content.primary
        }`
      : 'none'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Circle = styled.div<CircleProps>(({ size, focused, checked, isRuntime, sizeVariant, color }) => {
  const getTranslateX = () => {
    if (!checked) return '0px';
    if (isRuntime) return '32px';
    if (sizeVariant === 'medium') return '20px';
    if (sizeVariant === 'large') return '24px';
    return '16px';
  };

  return {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 'auto',
    width: size === 'medium' ? 16 : size === 'large' ? 24 : 8,
    height: size === 'medium' ? 16 : size === 'large' ? 24 : 8,
    borderRadius: 16,
    backgroundColor: checked ? color || colors.blue : colors.grey,
    boxShadow: focused ? '0 0 0 8px rgba(93, 157, 213, 0.1)' : 'none',
    boxSizing: 'border-box',
    transition: 'all 0.25s ease',
    transform: `translateX(${getTranslateX()})`,
  };
});

export const Track = styled.div<TrackProps>(({ isRuntime, size, checked, color }) => ({
  width: isRuntime ? 56 : size === 'medium' ? 44 : size === 'large' ? 56 : 32,
  height: size === 'medium' ? 24 : size === 'large' ? 32 : 16,
  padding: 0,
  borderRadius: 16,
  backgroundColor: checked ? (color ? `${color}4C` : 'rgba(93, 157, 213, 0.3)') : colors['grey-light'],
  outline: 'none',

  transition: 'all 0.2s ease',
}));

export const Input = styled.input<InputProps>`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  outline: black;

  &:focus-visible + .toggle-track {
    outline: none;
    ${customOffsetFocusOutline}
  }
`;

export const OnText = styled.span<OnTextProps>`
  display: ${(p) => (p.checked ? 'block' : 'none')};
  padding-top: 4px;
  text-indent: 10px;
  text-align: left;
`;

export const OffText = styled.span<OffTextProps>`
  display: ${(p) => (p.checked ? 'none' : 'block')};
  padding-top: 4px;
  text-indent: 28px;
  text-align: left;
`;

export const ToggleWrapper = styled.label<ToggleWrapperProps>`
  touch-action: pan-x;
  display: inline-block;
  position: relative;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  padding: ${(p) => (p.isRuntime ? '0 0 2px 0' : '0')};
  margin-bottom: 0;
  order: ${(p) => (p.alignRight ? 0 : 1)};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  ${(p) => p.isV4Design && 'flex-shrink: 0;'}

  user-select: none;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;

  &:hover .toggle-circle {
    box-shadow: ${(p) => (p.disabled ? 'none' : '0 0 0 8px rgba(93, 157, 213, 0.1)')};
  }
`;
