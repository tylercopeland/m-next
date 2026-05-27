import iconPaths from './icon-paths';
import { SvgIconName } from './SvgIconNames';
import { methodOnlySvgIcons } from './SvgIconNames';

/**
 * Interface for icon data structure from icon-paths
 */
interface IconData {
  properties: {
    name: string;
  };
}

/**
 * Interface for the icon option object returned by the iconList function
 */
export interface IconOption {
  value: SvgIconName;
  label: string;
}

/**
 * Converts an icon name to a human-friendly caption
 *
 * @param value - The icon name to convert
 * @returns A human-friendly caption for the icon
 */
function toHumanFriendlyCaption(value: string): string {
  // Remove 'v2', 'v3', 'v4', 'V4' suffixes with optional dash/space
  let caption = value.replace(/[-\s]?[vV][234](-\d)?$/g, '');

  // Remove leading/trailing spaces and handle special characters
  caption = caption.trim().replace(/[-_]/g, ' ');

  // Split on camelCase
  caption = caption.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Convert to lowercase and capitalize only first letter
  caption = caption.toLowerCase();
  caption = caption.charAt(0).toUpperCase() + caption.slice(1);

  // Handle special cases - keep acronyms in caps
  caption = caption
    .replace(/Css/g, 'CSS')
    .replace(/Html/g, 'HTML')
    .replace(/Id/g, 'ID')
    .replace(/Usd/g, 'USD')
    .replace(/Ui/g, 'UI')
    .replace(/Api/g, 'API')
    .replace(/Cc/g, 'Credit Card')
    .replace(/Alt$/, 'Alternative');

  return caption;
}

/**
 * Returns a list of all available icons with their values and labels
 *
 * @returns An array of icon options with values and labels
 */
const iconList = (): IconOption[] => {
  const icons: SvgIconName[] = [];

  // Add icons from icon-paths.js
  iconPaths.icons.forEach((icon: IconData) => {
    // Get the first name from the comma-separated list
    const iconName = icon.properties.name.split(',')[0] as SvgIconName;
    icons.push(iconName);
  });

  // Add additional icons
  methodOnlySvgIcons.forEach((name) => {
    icons.push(name);
  });

  // Create cleaned icon objects with values and labels
  const cleanedIcons: IconOption[] = icons.map((icon) => ({
    value: icon,
    label: toHumanFriendlyCaption(icon),
  }));

  // Remove duplicates by converting to a Set and back to an array
  const uniqueIconsSet = new Set(cleanedIcons.map((icon) => JSON.stringify(icon)));
  const uniqueIcons: IconOption[] = Array.from(uniqueIconsSet).map((str) => JSON.parse(str));

  // Sort by label
  return uniqueIcons.sort((a, b) => a.label.localeCompare(b.label));
};

export default iconList;
