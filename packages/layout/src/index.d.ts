import * as React from 'react';
import type { SpacingToken } from '@m-next/tokens';

type SpaceValue = SpacingToken | number;

type CommonBoxProps = {
  as?: keyof JSX.IntrinsicElements;
  padding?: SpaceValue;
  paddingX?: SpaceValue;
  paddingY?: SpaceValue;
  paddingTop?: SpaceValue;
  paddingRight?: SpaceValue;
  paddingBottom?: SpaceValue;
  paddingLeft?: SpaceValue;
  margin?: SpaceValue;
  marginX?: SpaceValue;
  marginY?: SpaceValue;
  marginTop?: SpaceValue;
  marginRight?: SpaceValue;
  marginBottom?: SpaceValue;
  marginLeft?: SpaceValue;
  width?: SpaceValue | string;
  height?: SpaceValue | string;
  maxWidth?: SpaceValue | string;
  maxHeight?: SpaceValue | string;
  minWidth?: SpaceValue | string;
  minHeight?: SpaceValue | string;
  background?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderColor?: string;
  overflow?: string;
  display?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export interface BoxProps extends CommonBoxProps {
  [key: string]: unknown;
}

export interface StackProps extends CommonBoxProps {
  gap?: SpaceValue;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export interface InlineProps extends CommonBoxProps {
  gap?: SpaceValue;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround';
  wrap?: boolean;
}

export interface FlexProps extends CommonBoxProps {
  direction?: 'row' | 'column' | 'rowReverse' | 'columnReverse';
  gap?: SpaceValue;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly';
  wrap?: boolean;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  spacing?: SpaceValue;
  size?: number;
  style?: React.CSSProperties;
}

export const Box: React.FC<BoxProps>;
export const Stack: React.FC<StackProps>;
export const Inline: React.FC<InlineProps>;
export const Flex: React.FC<FlexProps>;
export const Divider: React.FC<DividerProps>;
