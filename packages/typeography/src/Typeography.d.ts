declare module '@m-next/typeography' {
  import * as React from 'react';

  export type TypographyVariant = 'body1' | 'body2' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | string;

  export type TypographyFontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'mediumLarge';

  export interface TypeographyProps {
    id?: string;
    children?: React.ReactNode;
    gutterBottom?: number | string | null;
    variant?: TypographyVariant;
    bold?: boolean;
    fontSize?: TypographyFontSize;
    style?: React.CSSProperties;
    color?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    tooltip?: string;
    tooltipId?: string;
    tooltipPlace?: string;
    tooltipHighlighting?: boolean;
    className?: string;
    opacity?: number;
    isMobile?: boolean;
    isV4?: boolean;
  }

  const Typeography: React.ForwardRefExoticComponent<TypeographyProps & React.RefAttributes<HTMLElement>>;

  export { Header } from './Header';
  export { Text } from './Text';
  export { TextLine } from './TextLine';
  export { TextDiv } from './TextDiv';
  export default Typeography;
}
