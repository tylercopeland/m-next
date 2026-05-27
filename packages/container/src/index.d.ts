import * as React from 'react';

export interface ContainerProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  isLoading?: boolean;
  children?: React.ReactNode;
  isVisible?: boolean;
  hasChildLoading?: boolean;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  // eslint-disable-next-line no-unused-vars
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  isRound?: boolean;
  forwardRef?: React.RefObject<HTMLDivElement>;
  scrollable?: boolean;
  borderless?: boolean;
  padding?: number | string;
  maxHeight?: number | string;
}

export interface InfiniteScrollContainerProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  isLoading?: boolean;
  children?: React.ReactNode;
  isVisible?: boolean;
  hasChildLoading?: boolean;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  forwardRef?: React.RefObject<HTMLDivElement>;
  padding?: number | string;
  fetchData?: () => void;
  error?: string;
  tabIndex?: number;
  maxHeight?: number | string;
}

declare const Container: React.FC<ContainerProps>;
export const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps>;

export default Container;
