export const breakpoints = ['481px', '768px', '1024px', '1200px', '1440px'];

export const breakPointSuffix = ['sm', 'md', 'lg', 'xl', 'xxl'];
export const breakpointNames = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

export const bpCount = breakPointSuffix.length;

export const size = {
  sm: breakpoints[0],
  md: breakpoints[1],
  lg: breakpoints[2],
  xl: breakpoints[3],
  xxl: breakpoints[4],
};

export const getBreakpoint = (width) => {
  if (width >= 1960) return 'xl';
  if (width >= 1280) return 'lg';
  if (width >= 960) return 'md';
  if (width >= 600) return 'sm';

  return 'xs';
};

export const device = {
  mobileL: `(min-width: ${size.sm})`,
  tablet: `(min-width: ${size.md})`,
  laptop: `(min-width: ${size.lg})`,
  desktop: `(min-width: ${size.xl})`,
  desktopL: `(min-width: ${size.xxl})`,
};

export const mq = {
  mobileL: `@media (min-width: ${size.sm})`,
  tablet: `@media (min-width: ${size.md})`,
  laptop: `@media (min-width: ${size.lg})`,
  desktop: `@media (min-width: ${size.xl})`,
  desktopL: `@media (min-width: ${size.xxl})`,
};
