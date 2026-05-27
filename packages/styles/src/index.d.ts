// Type definitions for @m-next/styles

export interface Colors {
  [key: string]: string;
}

export interface Theme {
  [key: string]: any;
}

export interface Device {
  mobile: string;
  tablet: string;
  desktop: string;
  largeDesktop: string;
}

export interface MediaQueries {
  mobile: string;
  tablet: string;
  desktop: string;
  largeDesktop: string;
}

export interface FontSizes {
  [key: string]: string;
}

// Named exports to match index.js structure
export declare const colors: Colors;
export declare const lightTheme: Theme;
export declare const darkTheme: Theme;
export declare const funTheme: Theme;
export declare const fontSizes: FontSizes;
export declare const convertClass: (className: string) => string;

// Named exports from device.js
export declare const device: Device;
export declare const mq: MediaQueries;
export declare const breakpointNames: string[];
export declare function getBreakpoint(breakpoint: string): string;

// Color helper functions
export declare function darkenColor(hex: string, amount?: number): string;

// Focus ring exports
export declare const customFocusOutline: string;
export declare const customOffsetFocusOutline: string;
export declare const customOffsetFocusOutlineObject: object;
export declare const textListItemFocusRing: string;
export declare const PageTitleDropdownItemStyle: string;
export declare function renderPseudoFocusRing(options?: any): string;
