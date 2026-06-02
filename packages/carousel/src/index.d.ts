import * as React from 'react';

export interface CarouselResponsiveBreakpoint {
  breakpoint: { max: number; min: number };
  items: number;
  partialVisibilityGutter?: number;
}

export interface CarouselResponsive {
  [key: string]: CarouselResponsiveBreakpoint;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
  /** CSS width applied to the outer shell. Default `'100%'`. */
  width?: string;
  /** CSS height applied to the outer shell. Default `'100%'`. */
  height?: string;
  /** Optional title shown centered above the slides. */
  title?: string;
  /** Horizontal margin (px) applied to each slide's content wrapper. Default `56`. */
  sideMarginPX?: number;
  /** Override the default chevron left arrow. */
  leftArrow?: React.ReactNode;
  /** Override the default chevron right arrow. */
  rightArrow?: React.ReactNode;
  /** react-multi-carousel breakpoint config. */
  responsive?: CarouselResponsive;
  /** className applied to each react-multi-carousel slide item. */
  itemClass?: string;
  /** className applied to the react-multi-carousel container. */
  containerClass?: string;

  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLDivElement> | null;
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

declare const Carousel: React.ForwardRefExoticComponent<
  CarouselProps & React.RefAttributes<HTMLDivElement>
>;

export { Carousel };
export default Carousel;
