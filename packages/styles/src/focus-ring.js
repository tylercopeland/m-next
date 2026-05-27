import colors from './colors';
import lightTheme from './light-theme';

/** ==================================
 * GENERAL FOCUS UTILITIES
 * ===================================
 */

export const customFocusOutline = `
    --outline-box-shadow-color: ${lightTheme.content.secondary};
    box-shadow: 0 0 0.75pt 1.5pt var(--outline-box-shadow-color);
`;

export const customOffsetFocusOutline = `
    --outline-offset-box-shadow-color: white;
    --outline-box-shadow-color: ${lightTheme.content.secondary};
    box-shadow: 0 0 0 2pt var(--outline-offset-box-shadow-color), 0 0 0.75pt 3.5pt var(--outline-box-shadow-color);
`;

export const customOffsetFocusOutlineObject = {
  '--outline-offset-box-shadow-color': colors.white,
  '--outline-box-shadow-color': lightTheme.content.secondary,
  boxShadow: '0 0 0 2pt var(--outline-offset-box-shadow-color), 0 0 0.75pt 3.5pt var(--outline-box-shadow-color)',
};

export const renderPseudoFocusRing = ({
  styleOnly = false, // doesn't return the CSS with selectors wrapper -> just the styling that can be applied to any pseudo element
  element = 'before',
  width = '100%',
  height = '100%',
  borderRadius = '2px',
  left = '50%',
  top = '50%',
  zIndex = '1',
  offsetX = 0,
  offsetY = 0,
  outlineColor = lightTheme.content.secondary,
  circle = false,
} = {}) => {
  const pseudoElementFocusStyles = `
    content: '';
    position: absolute;
    z-index: ${zIndex};
    left: ${left}; top: ${top};
    transform: translate(-50%, -50%);
    width: calc(${width} + ${offsetX * 2}px);
    height: calc(${height} + ${offsetY * 2}px);
    border-radius: ${borderRadius};
    ${customFocusOutline};
    --outline-box-shadow-color: ${outlineColor};

    ${
      circle
        ? `height: ${width}; 
      width: ${width}; 
      border-radius:100%;`
        : ''
    }
  `;

  if (styleOnly) {
    return pseudoElementFocusStyles;
  }

  return `
    outline: none;
    position: relative;
    /* &:focus::${element} { */

     &:focus-visible::${element} {
      ${pseudoElementFocusStyles}
    }
  `;
};

/** ==================================
 * SPECIFIC FOCUS STYLES
 * ===================================
 */

export const textListItemFocusRing = renderPseudoFocusRing({
  offsetX: 3,
  offsetY: 3,
});

export const PageTitleDropdownItemStyle = `
  display: inline-block;
  width: 100%;
  position: relative;
  outline: none;
  
  ${textListItemFocusRing};
`;

/** ==================================
 * YOUR SHARED CODE HERE....
 * ===================================
 */
