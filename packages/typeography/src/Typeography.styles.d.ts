import * as React from 'react';

export interface StyledComponentProps {
  color?: string;
  bold?: boolean;
  gutterBottom?: number | string;
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'mediumLarge';
  theme?: any;
  onClick?: React.MouseEventHandler<HTMLElement> | null;
  opacity?: number;
  tooltipHighlighting?: boolean;
  isMobile?: boolean;
  style?: React.CSSProperties;
  isV4?: boolean;
}

export const Paragraph: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLParagraphElement>>;
export const Span: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLSpanElement>>;
export const Div: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLDivElement>>;
export const H1: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLHeadingElement>>;
export const H2: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLHeadingElement>>;
export const H3: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLHeadingElement>>;
export const H4: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLHeadingElement>>;
export const H5: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLHeadingElement>>;
export const H6: React.ComponentType<StyledComponentProps & React.HTMLAttributes<HTMLHeadingElement>>;
