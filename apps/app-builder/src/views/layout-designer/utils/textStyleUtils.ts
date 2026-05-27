/**
 * Utility functions for translating text control properties to CSS classes
 * This allows us to store proper control properties and translate them to legacy classes during rendering
 */

export interface TextStyleProperties {
  textAlignment?: string;
  fontWeight?: string;
  fontColor?: string;
}

/**
 * Maps text alignment property to CSS class
 */
export const getTextAlignmentClass = (textAlignment?: string): string => {
  switch (textAlignment) {
    case 'center':
      return 'mi-text-center';
    case 'right':
      return 'mi-text-right';
    case 'justify':
      return 'mi-text-justify';
    case 'left':
    default:
      return 'mi-text-left';
  }
};

/**
 * Maps text size property to CSS class
 */
export const getTextSizeClass = (textSize?: string): string => {
  switch (textSize) {
    case 'XXX-Large':
      return 'mi-caption-font-xxxlarge';
    case 'XX-Large':
      return 'mi-caption-font-xxlarge';
    case 'X-Large':
      return 'mi-caption-font-xlarge';
    case 'Large':
      return 'mi-caption-font-large';
    case 'Medium':
      return 'mi-caption-font-medium';
    case 'Normal':
      return 'mi-caption-font-normal';
    case 'Small':
      return 'mi-caption-font-small';
    case 'X-Small':
      return 'mi-caption-font-xsmall';
    case 'XX-Small':
      return 'mi-caption-font-xxsmall';
    case 'XXX-Small':
      return 'mi-caption-font-xxxsmall';
    case 'Regular':
    default:
      return ''; // Regular doesn't need a class
  }
};

/**
 * Maps text size labels to pixel values
 */
export const mapTextSizeToPixels = (textSize?: string): string => {
  switch (textSize) {
    case 'XXX-Large':
      return '1.875rem';
    case 'XX-Large':
      return '1.7rem';
    case 'X-Large':
      return '1.375rem';
    case 'Large':
      return '1.125rem';
    case 'Medium':
      return '1rem';
    case 'Normal':
      return '1rem';
    case 'Small':
      return '0.875rem';
    case 'X-Small':
      return '0.75rem';
    case 'XX-Small':
      return '0.625rem';
    case 'XXX-Small':
      return '0.5rem';
    case 'Regular':
    default:
      return '1rem';
  }
};

/**
 * Maps pixel values back to text size labels
 */
export const mapPixelsToTextSize = (fontSize?: string): string => {
  switch (fontSize) {
    case '48px':
      return 'XXX-Large';
    case '40px':
      return 'XX-Large';
    case '32px':
      return 'X-Large';
    case '24px':
      return 'Large';
    case '20px':
      return 'Medium';
    case '16px':
      return 'Normal';
    case '14px':
      return 'Small';
    case '12px':
      return 'X-Small';
    case '8px':
      return 'XX-Small';
    case '4px':
      return 'XXX-Small';
    default:
      return 'Regular';
  }
};

/**
 * Maps font weight property to CSS class
 */
export const getFontWeightClass = (fontWeight?: string): string => {
  switch (fontWeight) {
    case 'bold':
      return 'mi-text-bold';
    case 'bolder':
      return 'mi-text-bolder';
    case 'regular':
    default:
      return ''; // Regular doesn't need a class
  }
};

/**
 * Maps font color property to CSS class
 */
export const getFontColorClass = (fontColor?: string): string => {
  const colorMap: Record<string, string> = {
    'grey-light': 'mi-caption-grey',
    'grey-darker': 'mi-caption-dark-grey',
    'red': 'mi-caption-alert',
    'fuchsia': 'mi-caption-pink',
    'purple': 'mi-caption-purple',
    'blue': 'mi-caption-primary',
    'teal': 'mi-caption-aqua',
    'green': 'mi-caption-success',
    'yellow': 'mi-caption-yellow',
    'orange': 'mi-caption-caution',
    'black': 'mi-caption-black',
    'white': 'mi-caption-white',
    'grey-lighter': 'mi-caption-grey', // fallback to grey
    'blue-darker': 'mi-caption-navigation',
  };
  
  return colorMap[fontColor || 'grey-darker'] || 'mi-caption-dark-grey';
};

/**
 * Combines all style properties into a single class string
 * This preserves any existing classes while adding the translated style classes
 */
export const combineTextStyleClasses = (
  existingClasses: string = '',
  styleProperties: TextStyleProperties
): string => {
  const classes: string[] = [];
  // Start with existing classes, but remove any style-related classes that we'll be replacing
  const cleanedClasses = existingClasses
    .replace(/\s?mi-text-(left|center|right|justify)\s?/g, '')
    .replace(/\s?mi-caption-font-(xxxlarge|xxlarge|xlarge|large|medium|normal|small|xsmall|xxsmall|xxxsmall)\s?/g, '')
    .replace(/\s?mi-text-(regular|bold|bolder)\s?/g, '')
    .replace(/\s?mi-caption-(grey|dark-grey|alert|pink|purple|primary|aqua|success|yellow|caution|black|white|navigation)\s?/g, '')
    .trim();
  
  if (cleanedClasses) {
    classes.push(cleanedClasses);
  }
  
  // Add style classes based on properties
  const alignmentClass = getTextAlignmentClass(styleProperties.textAlignment);
  if (alignmentClass) {
    classes.push(alignmentClass);
  }
  
  const weightClass = getFontWeightClass(styleProperties.fontWeight);
  if (weightClass) {
    classes.push(weightClass);
  }
  
  const colorClass = getFontColorClass(styleProperties.fontColor);
  if (colorClass) {
    classes.push(colorClass);
  }
  
  return classes.join(' ').trim();
};
