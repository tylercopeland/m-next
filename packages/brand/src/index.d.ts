import * as React from 'react';

export interface MethodLogoProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'src' | 'alt'> {
  id?: string;
  /** Asset URL. Defaults to the white-wordmark variant on Method's CDN. */
  src?: string;
  /** Height in pixels. Width is derived from the natural aspect ratio. */
  height?: number | string;
  /** Explicit width override. Use either `height` or `width`. */
  width?: number | string;
  /** Accessible label. Defaults to "Method". */
  ariaLabel?: string;
  /** When true, the logo is decorative — sets aria-hidden, no role. */
  decorative?: boolean;

  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLImageElement> | null;
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

declare const MethodLogo: React.ForwardRefExoticComponent<
  MethodLogoProps & React.RefAttributes<HTMLImageElement>
>;

export { MethodLogo };
export default MethodLogo;
